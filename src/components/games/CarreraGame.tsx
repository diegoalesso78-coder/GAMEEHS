import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Trophy, ArrowRight, Timer, Brain } from 'lucide-react';
import { CARRERA_SHEETS_URL, CARRERA_CATEGORIES, CARRERA_FALLBACK } from '../../constants';

export const CarreraSetup = ({ onStart, onBack }: { onStart: (p: any[]) => void, onBack: () => void }) => {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(['Operador 1', 'Operador 2', 'Operador 3', 'Operador 4']);
  return (
    <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-heavy w-full max-w-lg p-10 rounded-2xl border border-secondary/30 hard-shadow relative z-10"
      >
        <button onClick={onBack} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 mb-6 flex items-center gap-2 transition-opacity">
          <ArrowRight className="rotate-180" size={12} /> Volver
        </button>
        
        <div className="text-center mb-10">
          <h2 className="text-5xl font-headline font-black mb-2 tracking-tighter uppercase">CARRERA <span className="text-secondary">MENTE</span></h2>
          <p className="text-[10px] font-headline uppercase tracking-[0.3em] text-secondary opacity-70">Desafío de Conocimiento</p>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-headline uppercase font-black mb-4 opacity-50 text-center tracking-widest">Participantes</p>
          <div className="flex gap-4 justify-center">
            {[2, 3, 4].map(n => (
              <button 
                key={n} 
                onClick={() => setCount(n)} 
                className={`w-14 h-14 rounded-sm font-headline font-black transition-all border-2 ${count === n ? 'bg-secondary text-black border-secondary hard-shadow-sm scale-110' : 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-headline font-black bg-white/10 text-secondary group-focus-within:bg-secondary group-focus-within:text-black transition-colors">
                {i + 1}
              </div>
              <input 
                type="text" 
                value={names[i]} 
                onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }} 
                className="w-full bg-black/40 border border-white/10 focus:border-secondary/50 outline-none py-4 pl-12 pr-4 uppercase font-headline font-black text-xs tracking-widest transition-all rounded-sm" 
                placeholder={`ID Op ${i+1}`} 
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => onStart(names.slice(0, count).map(n => ({ name: n })))} 
          className="btn-industrial-orange w-full py-5 text-black font-headline font-black uppercase tracking-widest text-sm"
        >
          INICIAR COMPETENCIA
        </button>
      </motion.div>
    </div>
  );
};

export const CarreraWinner = ({ player, onRestart, onFinish }: { player: any, onRestart: () => void, onFinish?: () => void }) => (
  <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent pointer-events-none" />
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel-heavy w-full max-w-lg p-10 rounded-2xl border-2 border-secondary text-center hard-shadow relative z-10">
      <Trophy className="mx-auto text-secondary mb-6" size={80} />
      <h2 className="text-6xl font-headline font-black mb-2 tracking-tighter uppercase">¡CAMPEÓN!</h2>
      <p className="text-xl md:text-2xl text-secondary font-headline font-black uppercase mb-8 md:mb-10 tracking-widest">{player.name} ha llegado a la meta</p>
      
      <div className="flex flex-col gap-3">
        {onFinish && (
          <button 
            onClick={() => onFinish()}
            className="btn-industrial-orange w-full py-4 md:py-5 text-black font-headline font-black uppercase tracking-widest text-[10px] md:text-sm flex items-center justify-center gap-2"
          >
            <Trophy size={18} /> FINALIZAR Y REGISTRAR
          </button>
        )}
        <button 
          onClick={onRestart} 
          className="w-full py-4 md:py-5 bg-white/10 hover:bg-white/20 text-white font-headline font-black uppercase tracking-widest text-[10px] md:text-sm rounded-sm transition-all"
        >
          NUEVA JORNADA
        </button>
      </div>
    </motion.div>
  </div>
);

export const CarreraGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'WINNER'>('SETUP');
  const [players, setPlayers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>(CARRERA_FALLBACK);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [playState, setPlayState] = useState<'IDLE' | 'SPINNING' | 'QUESTION' | 'FEEDBACK'>('IDLE');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [timer, setTimer] = useState(20);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    fetch(CARRERA_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 4) return null;
          return {
            cat: cols[0].toLowerCase(),
            q: cols[1],
            a: cols[2],
            o: cols[3].split('|').map(o => o.trim()),
            diff: cols[4],
            exp: cols[5]
          };
        }).filter(q => q && CARRERA_CATEGORIES[q.cat]);
        
        if (parsed.length > 0) setQuestions(parsed);
      })
      .catch(err => console.warn("Error loading Carrera data:", err));
  }, []);

  useEffect(() => {
    let interval: any;
    if (playState === 'QUESTION' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (playState === 'QUESTION' && timer === 0) {
      handleAnswer(null);
    }
    return () => clearInterval(interval);
  }, [playState, timer]);

  const handleStart = (newPlayers: any[]) => {
    setPlayers(newPlayers.map(p => ({ ...p, score: 0 })));
    setGameState('PLAYING');
  };

  const spinRoulette = () => {
    if (playState !== 'IDLE') return;
    setPlayState('SPINNING');
    const extraRots = 5 + Math.random() * 5;
    const newRot = rotation + extraRots * 360;
    setRotation(newRot);

    setTimeout(() => {
      const finalAngle = newRot % 360;
      const catKeys = Object.keys(CARRERA_CATEGORIES);
      const idx = Math.floor(((360 - (finalAngle % 360)) % 360) / 72);
      const cat = CARRERA_CATEGORIES[catKeys[idx]];
      setSelectedCategory(cat);
      
      const catQuestions = questions.filter(q => q.cat === cat.id);
      const q = catQuestions.length > 0 
        ? catQuestions[Math.floor(Math.random() * catQuestions.length)]
        : questions[Math.floor(Math.random() * questions.length)];
      
      setCurrentQuestion(q);
      setPlayState('QUESTION');
      setTimer(20);
    }, 3000);
  };

  const handleAnswer = (option: string | null) => {
    if (playState !== 'QUESTION') return;
    
    const isCorrect = option === currentQuestion.a;
    const earned = isCorrect ? Math.ceil(timer * 5) : 0;
    setScoreEarned(earned);
    
    if (isCorrect) {
      setPlayers(prev => {
        const next = [...prev];
        next[currentPlayerIdx].score += earned;
        return next;
      });
    }

    setPlayState('FEEDBACK');
    setTimeout(() => {
      if (players[currentPlayerIdx].score >= 1000) {
        setGameState('WINNER');
        onGameOver(players[currentPlayerIdx].score);
      } else {
        const nextIdx = (currentPlayerIdx + 1) % players.length;
        setCurrentPlayerIdx(nextIdx);
        if (nextIdx === 0) setCurrentRound(r => r + 1);
        setPlayState('IDLE');
        setSelectedCategory(null);
        setCurrentQuestion(null);
      }
    }, 3000);
  };

  if (gameState === 'SETUP') return <CarreraSetup onStart={handleStart} onBack={onExit} />;
  if (gameState === 'WINNER') return <CarreraWinner player={players[currentPlayerIdx]} onRestart={() => window.location.reload()} onFinish={onFinish} />;

  return (
    <div className="h-screen flex flex-col lg:flex-row p-4 md:p-8 gap-8 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
      
      <aside className="w-full lg:w-96 flex flex-col gap-6 relative z-10">
        <div className="glass-panel-heavy p-6 rounded-xl border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-sm hard-shadow">
              <Brain className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-headline font-black tracking-tighter uppercase leading-none">CARRERA <span className="text-secondary">MENTE</span></h1>
              <p className="text-[10px] font-headline uppercase tracking-widest opacity-50">Ronda {currentRound}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {players.map((p, i) => (
              <div key={i} className={`p-4 rounded-sm border-l-4 transition-all ${currentPlayerIdx === i ? 'bg-secondary/10 border-secondary hard-shadow-sm' : 'bg-white/5 border-transparent opacity-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-headline font-black uppercase tracking-widest">{p.name}</span>
                  <span className="text-xs font-mono font-black text-secondary">{p.score} PTS</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-secondary" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (p.score / 1000) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <button onClick={onExit} className="w-full py-4 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-headline font-black uppercase tracking-widest text-xs hover:bg-rose-500 hover:text-white transition-all rounded-sm">
            Finalizar Operación
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {playState === 'IDLE' || playState === 'SPINNING' ? (
            <motion.div key="roulette" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-12">
              <div className="text-center">
                <p className="text-xs font-headline uppercase tracking-[0.3em] text-secondary mb-2">Turno de</p>
                <h2 className="text-5xl font-headline font-black uppercase tracking-tighter">{players[currentPlayerIdx].name}</h2>
              </div>

              <div className="relative w-64 h-64 md:w-96 md:h-96">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 text-4xl drop-shadow-lg">👇</div>
                <motion.svg 
                  viewBox="0 0 400 400" 
                  className="w-full h-full drop-shadow-[0_0_30px_rgba(242,125,38,0.2)]"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 3, ease: "circOut" }}
                >
                  {Object.values(CARRERA_CATEGORIES).map((cat: any, i) => {
                    const angle = 72;
                    const startAngle = i * angle;
                    const endAngle = (i + 1) * angle;
                    const x1 = 200 + 200 * Math.cos((startAngle - 90) * Math.PI / 180);
                    const y1 = 200 + 200 * Math.sin((startAngle - 90) * Math.PI / 180);
                    const x2 = 200 + 200 * Math.cos((endAngle - 90) * Math.PI / 180);
                    const y2 = 200 + 200 * Math.sin((endAngle - 90) * Math.PI / 180);
                    
                    return (
                      <g key={cat.id}>
                        <path 
                          d={`M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`} 
                          fill={cat.color}
                          stroke="#000"
                          strokeWidth="2"
                        />
                        <text 
                          x="200" y="80" 
                          transform={`rotate(${startAngle + 36}, 200, 200)`}
                          fill="white" textAnchor="middle" fontSize="32"
                          className="select-none pointer-events-none"
                        >
                          {cat.icon}
                        </text>
                      </g>
                    );
                  })}
                </motion.svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black border-4 border-white/20 rounded-full hard-shadow flex items-center justify-center z-20">
                    <div className="w-4 h-4 bg-secondary rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              <button 
                onClick={spinRoulette}
                disabled={playState === 'SPINNING'}
                className="btn-industrial-orange px-12 py-5 text-black font-headline font-black uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {playState === 'SPINNING' ? 'GIRANDO...' : 'GIRAR RULETA'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="question" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="w-full max-w-2xl">
              <div className={`p-8 rounded-2xl border-2 mb-8 relative overflow-hidden ${selectedCategory.bg} text-white hard-shadow`}>
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
                  <Timer size={16} />
                  <span className="font-mono font-black">{timer}s</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{selectedCategory.icon}</span>
                  <span className="text-xs font-headline font-black uppercase tracking-widest opacity-80">{selectedCategory.label}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-headline font-black uppercase tracking-tight leading-tight">{currentQuestion.q}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.o.map((opt: string, i: number) => (
                  <button
                    key={i}
                    disabled={playState === 'FEEDBACK'}
                    onClick={() => handleAnswer(opt)}
                    className={`p-6 rounded-xl border-2 font-headline font-black uppercase tracking-widest text-xs transition-all text-left
                      ${playState === 'FEEDBACK' 
                        ? opt === currentQuestion.a 
                          ? 'bg-emerald-500 border-emerald-500 text-black' 
                          : 'bg-white/5 border-white/10 opacity-30'
                        : 'bg-white/5 border-white/10 hover:border-secondary hover:bg-secondary/10'
                      }`}
                  >
                    <span className="opacity-30 mr-4">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                ))}
              </div>

              {playState === 'FEEDBACK' && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-8 p-6 bg-black/40 rounded-xl border border-white/10 text-center">
                  <p className={`text-2xl font-headline font-black uppercase mb-2 ${scoreEarned > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {scoreEarned > 0 ? `¡CORRECTO! +${scoreEarned} PTS` : 'INCORRECTO'}
                  </p>
                  <p className="text-sm opacity-70 font-body">{currentQuestion.exp}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
