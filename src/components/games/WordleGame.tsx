
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Zap, Info, Trophy, Layout, LogOut, ChevronRight, Play, X, CheckCircle2, Dice5, AlertTriangle, Target, ArrowRight, Timer, MousePointer2, Clock, HelpCircle, Paperclip, Calendar, Delete, CornerDownLeft } from 'lucide-react';
import { WORDLE_SHEETS_URL, WORDLE_FALLBACK } from '../../constants';

export const WordleGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME'>('INTRO');
  const [mode, setMode] = useState<'DAILY' | 'FREE'>('DAILY');
  const [wordData, setWordData] = useState<any>(WORDLE_FALLBACK[0]);
  const [allWords, setAllWords] = useState<any[]>(WORDLE_FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [shakeRow, setShakeRow] = useState(-1);
  const [stats, setStats] = useState({
    played: 0,
    won: 0,
    streak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0]
  });
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const savedStats = localStorage.getItem('prevenwordle_stats');
    if (savedStats) setStats(JSON.parse(savedStats));

    setIsLoading(true);
    fetch(WORDLE_SHEETS_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const data = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            palabra: cols[0]?.toUpperCase(),
            definicion: cols[1],
            categoria: cols[2],
            dificultad: cols[3],
            referencia: cols[4],
            fecha: cols[5]
          };
        }).filter(d => d.palabra);
        if (data.length > 0) setAllWords(data);
      })
      .catch(err => console.error('Error loading Wordle words:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const selectWord = (selectedMode: 'DAILY' | 'FREE') => {
    if (allWords.length === 0) return;

    let target;
    if (selectedMode === 'DAILY') {
      const today = new Date().toISOString().split('T')[0];
      target = allWords.find(w => w.fecha === today);
      if (!target) {
        const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        target = allWords[hash % allWords.length];
      }
    } else {
      target = allWords[Math.floor(Math.random() * allWords.length)];
    }

    setWordData(target);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('PLAYING');
    setMode(selectedMode);
    setView('GAME');
  };

  const onKeyPress = (key: string) => {
    if (gameState !== 'PLAYING') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordData.palabra.length) {
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(-1), 500);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === wordData.palabra) {
        setGameState('WON');
        updateStats(true, newGuesses.length);
      } else if (newGuesses.length === 6) {
        setGameState('LOST');
        updateStats(false, 0);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < wordData.palabra.length && /^[A-ZÑ]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER') onKeyPress('ENTER');
      else if (key === 'BACKSPACE') onKeyPress('BACKSPACE');
      else if (/^[A-ZÑ]$/.test(key)) onKeyPress(key);
    };
    if (view === 'GAME') {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentGuess, guesses, gameState, wordData]);

  const updateStats = (won: boolean, attempts: number) => {
    onGameOver(won ? (7 - attempts) * 100 : 0);
    setStats(prev => {
      const newStats = {
        played: prev.played + 1,
        won: prev.won + (won ? 1 : 0),
        streak: won ? prev.streak + 1 : 0,
        maxStreak: won ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
        distribution: [...prev.distribution]
      };
      if (won) newStats.distribution[attempts - 1]++;
      localStorage.setItem('prevenwordle_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const getLetterStatus = (letter: string, pos: number, guess: string) => {
    const target = wordData.palabra;
    if (target[pos] === letter) return 'correct';
    
    const targetCount = target.split('').filter(l => l === letter).length;
    if (targetCount === 0) return 'absent';
    
    const correctCount = guess.split('').filter((l, i) => l === letter && target[i] === l).length;
    
    let occurrencesBefore = 0;
    for (let i = 0; i < pos; i++) {
      if (guess[i] === letter && target[i] !== letter) {
        occurrencesBefore++;
      }
    }
    
    if (occurrencesBefore < (targetCount - correctCount)) return 'present';
    return 'absent';
  };

  const getKeyStatuses = () => {
    const statuses: any = {};
    guesses.forEach(guess => {
      guess.split('').forEach((letter, i) => {
        const status = getLetterStatus(letter, i, guess);
        if (!statuses[letter] || status === 'correct' || (status === 'present' && statuses[letter] !== 'correct')) {
          statuses[letter] = status;
        }
      });
    });
    return statuses;
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const keyStatuses = getKeyStatuses();

  if (isLoading) {
    return (
      <div className="h-screen obsidian-table flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]"></div>
        <p className="text-emerald-500 font-black uppercase tracking-widest text-xs animate-pulse">Sincronizando Base de Datos...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col obsidian-table text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-hex-grid opacity-10 pointer-events-none"></div>
      
      <header className="glass-panel-heavy p-4 flex justify-between items-center border-b border-white/10 relative z-20">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="p-3 hover:bg-white/5 rounded-xl transition-all group" title="Salir al Menú">
            <LogOut className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform rotate-180" />
          </button>
          <button onClick={() => setShowHelp(true)} className="p-3 hover:bg-white/5 rounded-xl transition-all group">
            <HelpCircle className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter">PREVEN<span className="text-emerald-500">WORDLE</span></h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowStats(true)} className="p-3 hover:bg-white/5 rounded-xl transition-all group">
            <Activity className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'INTRO' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass-panel-heavy p-8 rounded-[2.5rem] border border-white/10 text-center space-y-8 shadow-2xl">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20">
                <Shield className="w-10 h-10 text-emerald-500" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tighter">¿Listo para el desafío?</h2>
                <p className="text-white/40 text-sm">Adivina la palabra de seguridad en 6 intentos.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => selectWord('DAILY')}
                  className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-charcoal font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <Calendar className="w-6 h-6" /> RETO DIARIO
                </button>
                <button 
                  onClick={() => selectWord('FREE')}
                  className="w-full py-6 bg-white/5 border border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95"
                >
                  <Zap className="w-6 h-6 text-emerald-500" /> MODO LIBRE
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'GAME' && wordData && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-4 md:p-8"
          >
            {/* Hint Card */}
            <div className="w-full max-w-lg mb-6">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-hud p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Pista / Definición</p>
                    <p className="text-sm text-white/90 font-medium leading-relaxed italic">
                      "{wordData.definicion}"
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                        {wordData.categoria}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/5 text-white/40 rounded-full border border-white/10">
                        {wordData.dificultad}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid gap-2 mb-8">
              {Array.from({ length: Math.min(6, guesses.length + (gameState === 'PLAYING' ? 1 : 0)) }).map((_, i) => {
            const guess = guesses[i] || (i === guesses.length ? currentGuess : '');
            const isSubmitted = i < guesses.length;
            const isCurrent = i === guesses.length;
            
            return (
              <div key={i} className={`flex gap-2 ${shakeRow === i ? 'animate-shake' : ''}`}>
                {Array.from({ length: wordData.palabra.length }).map((_, j) => {
                  const letter = guess[j] || '';
                  const status = isSubmitted ? getLetterStatus(letter, j, guess) : '';
                  
                  return (
                    <motion.div
                      key={j}
                      initial={false}
                      animate={isSubmitted ? { rotateX: 180 } : { scale: letter ? 1.05 : 1 }}
                      transition={{ duration: 0.4, delay: j * 0.1 }}
                      className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-black uppercase rounded-lg transition-all ${
                        isSubmitted
                        ? status === 'correct' ? 'bg-emerald-500 border-emerald-500 text-charcoal' :
                          status === 'present' ? 'bg-secondary border-secondary text-charcoal' :
                          'bg-white/10 border-white/10 text-white/40'
                        : letter ? 'border-white/40 text-white' : 'border-white/10 text-white/20'
                      }`}
                    >
                      <span className={isSubmitted ? 'rotate-x-180' : ''}>{letter}</span>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-lg space-y-2">
          {keyboardRows.map((row, i) => (
            <div key={i} className="flex justify-center gap-1.5">
              {row.map(key => {
                const status = keyStatuses[key];
                return (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className={`h-14 rounded-lg font-black text-sm uppercase transition-all flex items-center justify-center ${
                      key === 'ENTER' || key === 'BACKSPACE' ? 'px-4 bg-white/10' : 'w-10'
                    } ${
                      status === 'correct' ? 'bg-emerald-500 text-charcoal' :
                      status === 'present' ? 'bg-secondary text-charcoal' :
                      status === 'absent' ? 'bg-white/5 text-white/20' :
                      'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {key === 'BACKSPACE' ? <Delete className="w-5 h-5" /> : 
                     key === 'ENTER' ? <CornerDownLeft className="w-5 h-5" /> : 
                     key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState !== 'PLAYING' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-charcoal/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass-panel-heavy p-10 rounded-[3rem] border border-white/10 text-center space-y-8"
            >
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2 ${gameState === 'WON' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                {gameState === 'WON' ? <Trophy className="w-10 h-10 text-emerald-500" /> : <X className="w-10 h-10 text-rose-500" />}
              </div>
              
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
                  {gameState === 'WON' ? '¡EXCELENTE TRABAJO!' : 'INTENTO AGOTADO'}
                </h3>
                <p className="text-white/40 font-black uppercase tracking-widest text-xs">
                  {gameState === 'WON' ? 'Has identificado el concepto de seguridad' : 'Sigue capacitándote en prevención'}
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="text-4xl font-black text-emerald-500 tracking-widest uppercase">{wordData.palabra}</div>
                <div className="w-12 h-1 bg-emerald-500/30 mx-auto rounded-full"></div>
                <p className="text-sm text-white/70 italic leading-relaxed">"{wordData.definicion}"</p>
                {wordData.referencia && (
                  <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Ref: {wordData.referencia}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {onFinish && (
                  <button 
                    onClick={onFinish}
                    className="w-full py-5 bg-emerald-500 text-charcoal font-black rounded-xl uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Trophy size={16} /> FINALIZAR Y REGISTRAR
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setView('INTRO')}
                    className="py-5 bg-white/5 border border-white/10 text-white font-black rounded-xl uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                  >
                    VOLVER
                  </button>
                  <button 
                    onClick={() => selectWord('FREE')}
                    className="py-5 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all"
                  >
                    OTRA PALABRA
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
