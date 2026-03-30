import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Search, Wrench, Eye, Trophy, ArrowRight } from 'lucide-react';
import { RESOLVE_SHEETS_URL, RESOLVE_FALLBACK } from '../../constants';

export const ResolveEnElPuestoGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish: () => void }) => {
  const [scenarios, setScenarios] = useState<any[]>(RESOLVE_FALLBACK);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'FEEDBACK' | 'SUMMARY'>('START');
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (gameState === 'SUMMARY') {
      onGameOver(score);
    }
  }, [gameState, score, onGameOver]);

  useEffect(() => {
    fetch(RESOLVE_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').filter(l => l.trim()).slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 5) return null;
          
          const correctSteps = [cols[4], cols[5], cols[6], cols[7]];
          const options = [
            [cols[4], cols[8], cols[9]],
            [cols[5], cols[10], cols[11]],
            [cols[6], cols[12], cols[13]],
            [cols[7], cols[14], cols[15]]
          ].map(opts => opts.filter(Boolean).sort(() => Math.random() - 0.5));

          return {
            id: cols[0],
            titulo: cols[1],
            descripcion: cols[2],
            imagen_url: cols[3],
            pasos_correctos: correctSteps,
            opciones: options,
            aprendizaje: cols[16],
            dificultad: cols[17]
          };
        }).filter(d => d !== null);
        if (parsed.length > 0) setScenarios(parsed);
      })
      .catch(err => console.warn("Error loading Resolve data:", err));
  }, []);

  const handleStepSelect = (step: string, stepIdx: number) => {
    if (stepIdx !== currentStepIdx) return;
    if (selectedSteps[stepIdx]) return;

    const newSteps = [...selectedSteps];
    newSteps[stepIdx] = step;
    setSelectedSteps(newSteps);

    if (stepIdx < 3) {
      setCurrentStepIdx(stepIdx + 1);
    } else {
      const current = scenarios[currentIdx];
      const isCorrect = newSteps.every((s, i) => s === current.pasos_correctos[i]);
      if (isCorrect) setScore(s => s + Math.round(100 / scenarios.length));
      
      setHistory(prev => [...prev, {
        ...current,
        userSteps: newSteps,
        isCorrect
      }]);
      
      setGameState('FEEDBACK');
    }
  };

  const nextScenario = () => {
    if (currentIdx < scenarios.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setCurrentStepIdx(0);
      setSelectedSteps([]);
      setGameState('PLAYING');
    } else {
      setGameState('SUMMARY');
    }
  };

  if (gameState === 'START') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 obsidian-table relative overflow-y-auto custom-scrollbar">
        <div className="fixed inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel-heavy w-full max-w-2xl p-6 md:p-12 rounded-2xl border border-blue-500/30 text-center hard-shadow relative z-10 my-auto">
          <Wrench className="mx-auto text-blue-500 mb-6 md:mb-8 w-12 h-12 md:w-20 md:h-20" />
          <h2 className="text-3xl md:text-5xl font-headline font-black mb-4 tracking-tighter uppercase leading-none">RESOLVÉ EN <span className="text-blue-500">EL PUESTO</span></h2>
          <p className="text-xs md:text-sm opacity-70 font-body mb-8 md:mb-10 max-w-md mx-auto">Identificá, analizá y actuá. Demostrá que sabés cómo gestionar los riesgos en tu lugar de trabajo.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setGameState('PLAYING')} className="btn-industrial-orange w-full py-4 md:py-5 text-black font-headline font-black uppercase tracking-widest text-xs md:text-sm">INICIAR SIMULACIÓN</button>
            <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center justify-center gap-2 transition-opacity py-2">
              VOLVER AL PANEL
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'SUMMARY') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 obsidian-table relative overflow-y-auto custom-scrollbar">
        <div className="fixed inset-0 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel-heavy w-full max-w-3xl p-6 md:p-10 rounded-2xl border-2 border-blue-500 hard-shadow relative z-10 flex flex-col my-auto">
          <div className="text-center mb-6 md:mb-8">
            <Trophy className="mx-auto text-blue-500 mb-4 w-12 h-12 md:w-16 md:h-16" />
            <h2 className="text-2xl md:text-4xl font-headline font-black mb-1 tracking-tighter uppercase">SIMULACIÓN COMPLETADA</h2>
            <p className="text-lg md:text-xl font-headline font-black text-blue-500 uppercase tracking-widest">Puntaje Total: {score}/100</p>
          </div>

          <div className="max-h-[40vh] md:max-h-[50vh] overflow-y-auto pr-2 md:pr-4 custom-scrollbar mb-6 md:mb-8">
            <div className="grid gap-3 md:gap-4">
              {history.map((item, i) => (
                <div key={i} className={`p-3 md:p-4 rounded-xl border-l-4 ${item.isCorrect ? 'bg-emerald-500/10 border-emerald-500' : 'bg-rose-500/10 border-rose-500'}`}>
                  <h4 className="font-headline font-black uppercase text-[10px] md:text-xs mb-2">{item.titulo}</h4>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {item.userSteps.map((step: string, j: number) => (
                      <span key={j} className={`text-[7px] md:text-[8px] px-2 py-1 rounded uppercase font-bold ${step === item.pasos_correctos[j] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        Paso {j + 1}: {step}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <button 
              onClick={() => onFinish()} 
              className="w-full py-4 md:py-6 bg-emerald-500 text-slate-950 rounded-xl font-headline font-black uppercase tracking-widest text-sm md:text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              FINALIZAR Y REGISTRAR
            </button>
            <button onClick={() => window.location.reload()} className="w-full py-3 md:py-5 bg-white/5 border border-white/10 text-white rounded-xl font-headline font-black uppercase tracking-widest text-[10px] md:text-sm hover:bg-white/10 transition-all">REPETIR SIMULACIÓN</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const current = scenarios[currentIdx];
  const stepLabels = ['Identificación', 'Riesgo', 'Acción', 'Validación'];
  const stepIcons = [Search, AlertTriangle, Wrench, Eye];

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 obsidian-table relative overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
      
      <header className="flex justify-between items-center mb-6 md:mb-8 relative z-10 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 flex items-center justify-center rounded-sm hard-shadow shrink-0">
            <Wrench className="text-black w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-none truncate">RESOLVÉ <span className="text-blue-500">EN EL PUESTO</span></h1>
            <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-50">Escenario {currentIdx + 1} de {scenarios.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[8px] font-headline uppercase tracking-widest opacity-40">Puntaje</span>
            <span className="text-sm md:text-xl font-headline font-black text-blue-500">{score} PTS</span>
          </div>
          <button onClick={onExit} className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-rose-500/20 hover:border-rose-500/50 transition-all group shrink-0">
            <LogOut className="group-hover:text-rose-500 transition-colors w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {gameState === 'PLAYING' ? (
            <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full grid lg:grid-cols-12 gap-6 md:gap-8 items-start">
              {/* Scenario Info */}
              <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
                <div className="glass-panel-heavy p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-blue-500" />
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[9px] font-headline font-black uppercase tracking-widest ${current.dificultad === 'Alta' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'}`}>
                      Dificultad: {current.dificultad}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-headline font-black uppercase tracking-tight mb-3 md:mb-4 leading-none">{current.titulo}</h3>
                  <p className="text-sm md:text-lg font-body leading-relaxed opacity-80 mb-6 md:mb-8">{current.descripcion}</p>
                  
                  <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-white/10 hard-shadow group">
                    <img src={current.imagen_url} alt={current.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              {/* Steps Selection */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-[10px] md:text-xs font-headline font-black uppercase tracking-[0.3em] text-blue-500">Protocolo de Resolución</h4>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`w-6 md:w-8 h-1 rounded-full transition-all duration-500 ${i < currentStepIdx ? 'bg-emerald-500' : i === currentStepIdx ? 'bg-blue-500 animate-pulse' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 pb-8">
                  {stepLabels.map((label, i) => {
                    const Icon = stepIcons[i];
                    const isCompleted = !!selectedSteps[i];
                    const isActive = i === currentStepIdx;
                    const isLocked = i > currentStepIdx;

                    return (
                      <motion.div 
                        key={i} 
                        initial={false}
                        animate={{ 
                          opacity: isLocked ? 0.4 : 1,
                          scale: isActive ? 1.01 : 1,
                          borderColor: isActive ? 'rgba(59, 130, 246, 0.5)' : isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                        }}
                        className={`glass-panel-heavy p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all relative overflow-hidden ${isActive ? 'bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : isCompleted ? 'bg-emerald-500/5' : 'bg-white/5'}`}
                      >
                        {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />}
                        
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-blue-500 text-black' : isCompleted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                            <Icon size={18} className="md:w-5 md:h-5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[7px] md:text-[8px] font-headline font-black uppercase tracking-widest opacity-40">Paso 0{i + 1}</span>
                            <h4 className="text-xs md:text-sm font-headline font-black uppercase tracking-widest truncate">{label}</h4>
                          </div>
                          {isCompleted && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto flex items-center gap-1.5 md:gap-2 text-emerald-500 shrink-0">
                              <span className="hidden xs:inline text-[8px] md:text-[9px] font-headline font-black uppercase tracking-widest">OK</span>
                              <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </motion.div>
                          )}
                        </div>
                        
                        {isActive && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 md:gap-3">
                            {current.opciones[i].map((opt: string, j: number) => (
                              <button
                                key={j}
                                onClick={() => handleStepSelect(opt, i)}
                                className="group relative p-3 md:p-4 bg-white/5 border border-white/10 rounded-lg md:rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all text-left overflow-hidden"
                              >
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                                <span className="text-[10px] md:text-[11px] font-headline font-black uppercase tracking-wider text-white/70 group-hover:text-white transition-colors block leading-tight">
                                  {opt}
                                </span>
                              </button>
                            ))}
                          </motion.div>
                        )}

                        {isCompleted && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] md:text-xs font-body font-bold text-emerald-400 pl-11 md:pl-14 italic">
                            {selectedSteps[i]}
                          </motion.p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="feedback" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl mx-auto py-4 md:py-8">
              <div className="glass-panel-heavy p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/10 relative overflow-hidden text-center">
                <div className={`absolute top-0 left-0 w-full h-1.5 md:h-2 ${history[currentIdx]?.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                
                <div className={`w-20 h-20 md:w-28 md:h-28 mx-auto rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 rotate-3 shadow-2xl ${history[currentIdx]?.isCorrect ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                  {history[currentIdx]?.isCorrect ? <Trophy size={40} className="md:w-14 md:h-14" /> : <AlertTriangle size={40} className="md:w-14 md:h-14" />}
                </div>
                
                <h3 className={`text-3xl md:text-5xl font-headline font-black mb-3 md:mb-4 uppercase tracking-tighter leading-none ${history[currentIdx]?.isCorrect ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {history[currentIdx]?.isCorrect ? '¡MISIÓN CUMPLIDA!' : 'FALLO EN EL PROTOCOLO'}
                </h3>
                
                <p className="text-sm md:text-xl font-body leading-relaxed opacity-80 max-w-2xl mx-auto mb-8 md:mb-10">
                  {history[currentIdx]?.isCorrect 
                    ? 'Has identificado correctamente los riesgos y aplicado las medidas preventivas necesarias para garantizar la seguridad en el puesto.' 
                    : 'Las acciones seleccionadas no garantizan la mitigación total del riesgo. Es fundamental seguir el protocolo establecido.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10 text-left">
                  <div className="bg-white/5 p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 text-blue-500">
                      <ShieldCheck size={18} className="md:w-5 md:h-5" />
                      <span className="text-[9px] md:text-[10px] font-headline font-black uppercase tracking-widest">Lección Aprendida</span>
                    </div>
                    <p className="text-xs md:text-sm font-body leading-relaxed italic opacity-90">"{current.aprendizaje}"</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 text-secondary">
                      <CheckCircle2 size={18} className="md:w-5 md:h-5" />
                      <span className="text-[9px] md:text-[10px] font-headline font-black uppercase tracking-widest">Pasos Correctos</span>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      {current.pasos_correctos.map((p: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-[8px] md:text-[10px] font-headline uppercase tracking-tight opacity-60">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={nextScenario} 
                  className="btn-industrial-orange w-full md:w-auto px-8 md:px-16 py-4 md:py-6 text-black font-headline font-black uppercase tracking-[0.2em] text-xs md:text-sm flex items-center justify-center gap-3 md:gap-4 mx-auto hover:scale-105 transition-transform active:scale-95"
                >
                  {currentIdx < scenarios.length - 1 ? 'SIGUIENTE ESCENARIO' : 'FINALIZAR MISIÓN'} <ArrowRight size={18} className="md:w-5 md:h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="hidden sm:block absolute bottom-4 left-8 text-[8px] font-mono opacity-20 uppercase tracking-[0.5em]">
        On-Site Resolution Engine v1.1 // Gestión de Riesgos
      </div>
    </div>
  );
};
