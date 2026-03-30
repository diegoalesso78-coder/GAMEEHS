import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Trophy, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { DECISIONES_SHEETS_URL, DECISIONES_FALLBACK } from '../../constants';

export const DecisionesSegurasGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'FEEDBACK' | 'SUMMARY'>('START');
  const [scenarios, setScenarios] = useState<any[]>(DECISIONES_FALLBACK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch(DECISIONES_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 8) return null;
          return {
            escenario: cols[0],
            descripcion: cols[1],
            imagen_url: cols[2],
            opcion_a: cols[3],
            opcion_b: cols[4],
            opcion_c: cols[5],
            correcta: cols[6].toUpperCase(),
            consecuencia_correcta: cols[7],
            consecuencia_incorrecta: cols[8],
            principio: cols[9],
            dificultad: cols[10]
          };
        }).filter(d => d !== null);
        if (parsed.length > 0) setScenarios(parsed);
      })
      .catch(err => console.warn("Error loading Decisiones data:", err));
  }, []);

  const handleDecision = (option: string) => {
    setSelectedOption(option);
    const current = scenarios[currentIndex];
    const isCorrect = option === current.correcta;
    
    if (isCorrect) setScore(s => s + 20);
    
    setHistory(prev => [...prev, {
      ...current,
      selected: option,
      isCorrect
    }]);

    setGameState('FEEDBACK');
  };

  const nextScenario = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setGameState('PLAYING');
    } else {
      setGameState('SUMMARY');
      onGameOver(score);
    }
  };

  if (gameState === 'START') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 obsidian-table relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel-heavy w-full max-w-2xl p-6 md:p-12 rounded-2xl border border-secondary/30 text-center hard-shadow relative z-10 my-auto">
          <ShieldCheck className="mx-auto text-secondary mb-6 md:mb-8 w-12 h-12 md:w-20 md:h-20" />
          <h2 className="text-3xl md:text-5xl font-headline font-black mb-4 tracking-tighter uppercase leading-tight">DECISIONES <span className="text-secondary">SEGURAS</span></h2>
          <p className="text-xs md:text-sm opacity-70 font-body mb-8 md:mb-10 max-w-md mx-auto">Enfrentá situaciones reales de planta y demostrá que tu prioridad es la vida. Cada decisión cuenta.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setGameState('PLAYING')} className="btn-industrial-orange w-full py-4 md:py-5 text-black font-headline font-black uppercase tracking-widest text-xs md:text-sm">INICIAR ENTRENAMIENTO</button>
            <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <ArrowRight className="rotate-180" size={12} /> VOLVER AL PANEL
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'SUMMARY') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 obsidian-table relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent pointer-events-none" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel-heavy w-full max-w-3xl p-6 md:p-10 rounded-2xl border-2 border-secondary hard-shadow relative z-10 flex flex-col my-auto">
          <div className="text-center mb-6 md:mb-8">
            <Trophy className="mx-auto text-secondary mb-4 w-10 h-10 md:w-16 md:h-16" />
            <h2 className="text-2xl md:text-4xl font-headline font-black mb-1 tracking-tighter uppercase">ENTRENAMIENTO FINALIZADO</h2>
            <p className="text-lg md:text-xl font-headline font-black text-secondary uppercase tracking-widest">Puntaje: {score}/100</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar mb-8">
            <div className="grid gap-4">
              {history.map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border-l-4 ${item.isCorrect ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/10 border-rose-500'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline font-black uppercase text-xs">{item.escenario}</h4>
                    {item.isCorrect ? <CheckCircle2 className="text-emerald-500" size={16} /> : <XCircle className="text-rose-500" size={16} />}
                  </div>
                  <p className="text-[10px] opacity-70 mb-2">{item.descripcion}</p>
                  <p className="text-[10px] font-headline font-bold uppercase tracking-widest">
                    <span className="opacity-50">Tu decisión:</span> {item[`opcion_${item.selected.toLowerCase()}`]}
                  </p>
                </div>
              ))}
            </div>
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
              onClick={() => window.location.reload()} 
              className="w-full py-5 bg-white/10 hover:bg-white/20 text-white font-headline font-black uppercase tracking-widest text-sm rounded-sm transition-all"
            >
              REPETIR ENTRENAMIENTO
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const current = scenarios[currentIndex];

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 obsidian-table relative overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
      
      <header className="flex justify-between items-center mb-4 md:mb-8 relative z-10 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary flex items-center justify-center rounded-sm hard-shadow">
            <ShieldCheck className="text-black w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-none">DECISIONES <span className="text-secondary">SEGURAS</span></h1>
            <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-50">Escenario {currentIndex + 1} de {scenarios.length}</p>
          </div>
        </div>
        <button onClick={onExit} className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-rose-500/20 hover:border-rose-500/50 transition-all group">
          <LogOut className="group-hover:text-rose-500 transition-colors w-5 h-5 md:w-6 md:h-6" />
        </button>
      </header>

      <main className="flex-1 relative z-10 py-2 md:py-4">
        <div className="h-full flex items-center justify-center p-1 md:p-2">
          <AnimatePresence mode="wait">
            {gameState === 'PLAYING' ? (
              <motion.div key="scenario" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="w-full max-w-4xl grid md:grid-cols-2 gap-4 md:gap-8">
                <div className="glass-panel-heavy p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <AlertTriangle className="text-secondary md:w-8 md:h-8" size={24} />
                    <h3 className="text-xl md:text-2xl font-headline font-black uppercase tracking-tight leading-none">{current.escenario}</h3>
                  </div>
                  <p className="text-sm md:text-lg text-on-surface-variant font-body leading-relaxed mb-6 md:mb-8">{current.descripcion}</p>
                  <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[10px] font-headline uppercase tracking-widest opacity-50 mb-1">Principio de Seguridad</p>
                    <p className="text-xs font-headline font-bold text-secondary italic">"{current.principio}"</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:gap-4">
                  {['A', 'B', 'C'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleDecision(opt)}
                      className="group relative p-3.5 md:p-6 bg-white/5 border border-white/10 rounded-xl hover:border-secondary hover:bg-secondary/10 transition-all text-left overflow-hidden"
                    >
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-headline font-black opacity-5 group-hover:opacity-10 transition-opacity">{opt}</div>
                      <p className="text-[10px] md:text-sm font-headline font-black uppercase tracking-widest pr-8 md:pr-12">{current[`opcion_${opt.toLowerCase()}`]}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
            <motion.div key="feedback" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-2xl text-center">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 shadow-2xl ${selectedOption === current.correcta ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                {selectedOption === current.correcta ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
              </div>
              
              <h3 className={`text-2xl md:text-4xl font-headline font-black mb-4 uppercase tracking-tighter ${selectedOption === current.correcta ? 'text-emerald-400' : 'text-rose-500'}`}>
                {selectedOption === current.correcta ? '¡DECISIÓN CORRECTA!' : 'DECISIÓN RIESGOSA'}
              </h3>
              
              <div className="glass-panel-heavy p-5 md:p-8 rounded-2xl border border-white/10 mb-6 md:mb-10">
                <p className="text-base md:text-xl font-body leading-relaxed mb-4 md:mb-6">
                  {selectedOption === current.correcta ? current.consecuencia_correcta : current.consecuencia_incorrecta}
                </p>
                <div className="h-px bg-white/10 w-16 md:w-24 mx-auto mb-4 md:mb-6" />
                <p className="text-[10px] md:text-xs font-headline font-black uppercase tracking-widest text-secondary">Recuerda: {current.principio}</p>
              </div>

              <button onClick={nextScenario} className="btn-industrial-orange w-full md:w-auto md:px-12 py-4 md:py-5 text-black font-headline font-black uppercase tracking-widest text-xs md:text-sm">
                {currentIndex < scenarios.length - 1 ? 'SIGUIENTE ESCENARIO' : 'VER RESUMEN FINAL'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      <div className="absolute bottom-4 left-8 text-[8px] font-mono opacity-20 uppercase tracking-[0.5em]">
        Safety Decision Engine v1.2 // Simulación de Riesgo Crítico
      </div>
    </div>
  );
};
