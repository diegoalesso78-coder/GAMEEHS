import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Trophy, ArrowRight, Info, Timer } from 'lucide-react';
import { MATCH_SHEETS_URL, MATCH_FALLBACK } from '../../constants';

// Helper function to shuffle array
const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const MatchSetup = ({ onStart, onBack }: { onStart: (l: 'easy' | 'medium' | 'expert') => void, onBack: () => void }) => {
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
          <h2 className="text-5xl font-headline font-black mb-2 tracking-tighter uppercase">UNE EL <span className="text-secondary">RIESGO</span></h2>
          <p className="text-[10px] font-headline uppercase tracking-[0.3em] text-secondary opacity-70">Misión de Mitigación</p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-headline uppercase font-black opacity-50 text-center tracking-widest mb-2">Seleccionar Nivel de Riesgo</p>
          <button onClick={() => onStart('easy')} className="group relative p-6 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all text-left overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-10 group-hover:opacity-30 transition-opacity">🛡️</div>
            <h3 className="text-xl font-headline font-black text-emerald-400">BÁSICO</h3>
            <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">6 Pares • 90 Segundos</p>
          </button>
          <button onClick={() => onStart('medium')} className="group relative p-6 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/50 transition-all text-left overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-10 group-hover:opacity-30 transition-opacity">⚠️</div>
            <h3 className="text-xl font-headline font-black text-amber-400">INTERMEDIO</h3>
            <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">9 Pares • 75 Segundos</p>
          </button>
          <button onClick={() => onStart('expert')} className="group relative p-6 bg-white/5 border border-white/10 rounded-xl hover:border-rose-500/50 transition-all text-left overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-10 group-hover:opacity-30 transition-opacity">🔥</div>
            <h3 className="text-xl font-headline font-black text-rose-400">EXPERTO</h3>
            <p className="text-[10px] opacity-60 uppercase tracking-widest mt-1">12 Pares • 60 Segundos</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const MatchWinner = ({ score, onRestart, onFinish }: { score: number, onRestart: () => void, onFinish?: () => void }) => {
  return (
    <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel-heavy w-full max-w-lg p-10 rounded-2xl border-2 border-secondary text-center hard-shadow relative z-10"
      >
        <Trophy className="mx-auto text-secondary mb-6" size={80} />
        <h2 className="text-6xl font-headline font-black mb-2 tracking-tighter uppercase">¡RIESGOS CAZADOS!</h2>
        <p className="text-2xl font-headline font-black text-secondary mb-8 uppercase tracking-widest">Puntaje Final: {score}</p>
        
        <div className="bg-black/40 p-6 rounded-xl border border-white/10 mb-8">
          <p className="text-sm opacity-70 font-body italic">"Tu capacidad para identificar medidas preventivas es vital para la seguridad de todos."</p>
        </div>

        <div className="flex flex-col gap-3">
          {onFinish && (
            <button 
              onClick={() => onFinish()}
              className="btn-industrial-orange w-full py-5 text-black font-headline font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <Trophy size={18} /> FINALIZAR Y REGISTRAR
            </button>
          )}
          <button 
            onClick={onRestart}
            className="w-full py-5 bg-white/10 hover:bg-white/20 text-white font-headline font-black uppercase tracking-widest text-sm rounded-sm transition-all"
          >
            NUEVA MISIÓN
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const MatchGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'WINNER'>('SETUP');
  const [level, setLevel] = useState<'easy' | 'medium' | 'expert'>('easy');
  const [pairs, setPairs] = useState<any[]>([]);
  const [shuffledMeasures, setShuffledMeasures] = useState<any[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);
  const [selectedMeasureId, setSelectedMeasureId] = useState<number | null>(null);
  const [gameData, setGameData] = useState<any[]>(MATCH_FALLBACK);

  useEffect(() => {
    fetch(MATCH_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 6) return null;
          return {
            riesgo: cols[0],
            medida: cols[1],
            nivel: cols[2].toLowerCase(),
            emoji_r: cols[3],
            emoji_m: cols[4],
            exp: cols[5]
          };
        }).filter(d => d !== null);
        if (parsed.length > 0) setGameData(parsed);
      })
      .catch(err => console.warn("Error loading Match data:", err));
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (gameState === 'PLAYING' && timeLeft === 0) {
      setGameState('WINNER');
      onGameOver(score);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const handleStart = (selectedLevel: 'easy' | 'medium' | 'expert') => {
    const config = {
      easy: { pairs: 6, time: 90 },
      medium: { pairs: 9, time: 75 },
      expert: { pairs: 12, time: 60 }
    };
    
    const pairsCount = config[selectedLevel].pairs;
    let filtered = gameData.filter(d => d.nivel === selectedLevel);
    if (filtered.length < pairsCount) {
      filtered = [...filtered, ...gameData.filter(d => d.nivel !== selectedLevel)].slice(0, pairsCount);
    } else {
      filtered = shuffle([...filtered]).slice(0, pairsCount);
    }

    const gamePairs = filtered.map((p, i) => ({ ...p, id: i }));
    setPairs(gamePairs);
    setShuffledMeasures(shuffle(gamePairs.map(p => ({ ...p }))));
    setLevel(selectedLevel);
    setTotalTime(config[selectedLevel].time);
    setTimeLeft(config[selectedLevel].time);
    setMatchedIds([]);
    setScore(0);
    setSelectedRiskId(null);
    setSelectedMeasureId(null);
    setGameState('PLAYING');
  };

  const handleMatch = (riskId: number, measureId: number) => {
    if (riskId === measureId) {
      if (matchedIds.includes(riskId)) return;
      
      const newMatched = [...matchedIds, riskId];
      setMatchedIds(newMatched);
      
      const pair = pairs.find(p => p.id === riskId);
      setExplanation(pair.exp);
      setTimeout(() => setExplanation(null), 3500);

      const currentScore = Math.max(0, 1000 - ((totalTime - timeLeft) * 10));
      setScore(prev => prev + currentScore);

      setSelectedRiskId(null);
      setSelectedMeasureId(null);

      if (newMatched.length === pairs.length) {
        setTimeout(() => {
          setGameState('WINNER');
          onGameOver(score + currentScore);
        }, 4000);
      }
    } else {
      // Wrong match
      setSelectedRiskId(null);
      setSelectedMeasureId(null);
    }
  };

  const selectRisk = (id: number) => {
    if (matchedIds.includes(id)) return;
    if (selectedMeasureId !== null) {
      handleMatch(id, selectedMeasureId);
    } else {
      setSelectedRiskId(id === selectedRiskId ? null : id);
    }
  };

  const selectMeasure = (id: number) => {
    if (matchedIds.includes(id)) return;
    if (selectedRiskId !== null) {
      handleMatch(selectedRiskId, id);
    } else {
      setSelectedMeasureId(id === selectedMeasureId ? null : id);
    }
  };

  if (gameState === 'SETUP') return <MatchSetup onStart={handleStart} onBack={onExit} />;
  if (gameState === 'WINNER') return <MatchWinner score={score} onRestart={() => setGameState('SETUP')} onFinish={onFinish} />;

  return (
    <div className="h-screen flex flex-col p-4 md:p-8 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
      
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-sm hard-shadow">
            <Info className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-black tracking-tighter uppercase leading-none">UNE EL <span className="text-secondary">RIESGO</span></h1>
            <p className="text-[10px] font-headline uppercase tracking-widest opacity-50">Uní el riesgo con su medida de control</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-headline uppercase tracking-widest opacity-50 mb-1">Tiempo Restante</p>
            <div className="flex items-center gap-2 text-2xl font-mono font-black text-secondary">
              <Timer size={20} />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-headline uppercase tracking-widest opacity-50 mb-1">Puntaje</p>
            <p className="text-3xl font-mono font-black text-white">{score.toString().padStart(6, '0')}</p>
          </div>
          <button onClick={onExit} className="p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-rose-500/20 hover:border-rose-500/50 transition-all group">
            <LogOut className="group-hover:text-rose-500 transition-colors" size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-4 md:gap-8 relative z-10 overflow-hidden">
        {/* Risks Column */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-[10px] font-headline uppercase tracking-widest font-black opacity-40 mb-1">Situaciones de Riesgo</h3>
          {pairs.map((p) => (
            <button 
              key={p.id}
              onClick={() => selectRisk(p.id)}
              className={`relative p-3 md:p-4 rounded-xl border-2 transition-all flex items-center gap-3 md:gap-4 text-left w-full
                ${matchedIds.includes(p.id) 
                  ? 'bg-emerald-500/10 border-emerald-500/50 grayscale-0 opacity-50' 
                  : selectedRiskId === p.id
                    ? 'bg-secondary/20 border-secondary shadow-[0_0_15px_rgba(242,125,38,0.3)] grayscale-0'
                    : 'bg-white/5 border-white/10 grayscale hover:border-white/30'}`}
            >
              <div className="text-2xl md:text-3xl shrink-0">{p.emoji_r}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm md:text-base font-headline font-black uppercase tracking-tight truncate">{p.riesgo}</h4>
                {matchedIds.includes(p.id) && (
                  <p className="text-[8px] text-emerald-400 font-headline uppercase tracking-widest mt-0.5 truncate">Controlado</p>
                )}
              </div>
              {matchedIds.includes(p.id) && (
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black shrink-0">
                  <Trophy size={12} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Divider for mobile */}
        <div className="h-px w-full bg-white/10 md:hidden" />

        {/* Measures Column */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-[10px] font-headline uppercase tracking-widest font-black opacity-40 mb-1">Medidas de Control</h3>
          {shuffledMeasures.map((m) => (
            <button
              key={m.id}
              onClick={() => selectMeasure(m.id)}
              className={`relative p-3 md:p-4 rounded-xl border-2 transition-all flex items-center gap-3 md:gap-4 text-left w-full
                ${matchedIds.includes(m.id) 
                  ? 'bg-emerald-500/10 border-emerald-500/50 grayscale-0 opacity-50' 
                  : selectedMeasureId === m.id
                    ? 'bg-secondary/20 border-secondary shadow-[0_0_15px_rgba(242,125,38,0.3)] grayscale-0'
                    : 'bg-white/5 border-white/10 grayscale hover:border-white/30'}`}
            >
              <div className="text-2xl md:text-3xl shrink-0">{m.emoji_m}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm md:text-base font-headline font-black uppercase tracking-tight truncate">{m.medida}</h4>
                {matchedIds.includes(m.id) && (
                  <p className="text-[8px] text-emerald-400 font-headline uppercase tracking-widest mt-0.5 truncate">Aplicado</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {explanation && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-emerald-500 p-6 rounded-2xl hard-shadow flex items-center gap-6 border-4 border-black">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-4xl shrink-0">💡</div>
              <div>
                <h5 className="text-black font-headline font-black uppercase tracking-tighter text-xl leading-none mb-1">¿Por qué es importante?</h5>
                <p className="text-black/80 font-body text-sm leading-tight">{explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-8 text-[8px] font-mono opacity-20 uppercase tracking-[0.5em]">
        Security Match System v2.4 // Protocolo de Mitigación Activo
      </div>
    </div>
  );
};
