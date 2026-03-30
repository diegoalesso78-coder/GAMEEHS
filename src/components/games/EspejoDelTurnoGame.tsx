import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, RefreshCw, MessageCircle, Info, User, Shield, AlertCircle, CheckCircle2, XCircle, Zap, ArrowRight, Trophy, Heart, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ESPEJO_SHEETS_URL, ESPEJO_FALLBACK, ESPEJO_CATEGORY_COLORS } from '../../constants';

type GameStep = 'SITUATION' | 'DECISION' | 'RESULT' | 'SUMMARY';

export const EspejoDelTurnoGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish: () => void }) => {
  const [situations, setSituations] = useState<any[]>(ESPEJO_FALLBACK);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [step, setStep] = useState<GameStep>('SITUATION');
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [lastDecision, setLastDecision] = useState<'SAFE' | 'RISKY' | null>(null);
  const [integrityLevel, setIntegrityLevel] = useState(100);

  useEffect(() => {
    fetch(ESPEJO_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = lines.map((line, i) => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 4) return null;
          return {
            id: String(i + 1),
            situacion: cols[0],
            categoria: cols[1],
            pregunta_debate: cols[2],
            reflexion: cols[3],
            opcion_segura: cols[4] || "Hacer lo correcto (Seguir protocolo)",
            opcion_riesgosa: cols[5] || "Tomar el atajo (Ahorrar tiempo)"
          };
        }).filter(d => d !== null);
        if (parsed.length > 0) setSituations(parsed);
      })
      .catch(err => console.warn("Error loading Espejo data:", err))
      .finally(() => setLoading(false));
  }, []);

  const current = situations[currentIdx];

  const handleDecision = (type: 'SAFE' | 'RISKY') => {
    setLastDecision(type);
    setStep('RESULT');
    
    if (type === 'SAFE') {
      const points = 100;
      setScore(prev => prev + points);
      setIntegrityLevel(prev => Math.min(100, prev + 5));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffb690', '#f7be1d', '#ffffff']
      });
    } else {
      setIntegrityLevel(prev => Math.max(0, prev - 20));
    }
  };

  const nextCard = () => {
    if (currentIdx === situations.length - 1) {
      onGameOver(score);
      setStep('SUMMARY');
    } else {
      setStep('SITUATION');
      setLastDecision(null);
      setCurrentIdx(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <RefreshCw className="animate-spin text-secondary mb-4 mx-auto" size={48} />
          <p className="text-secondary font-headline font-black uppercase tracking-widest animate-pulse">Sincronizando Espejo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-4 md:p-8 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--secondary-rgb),0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* HUD Header */}
      <header className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-secondary flex items-center justify-center rounded-xl hard-shadow shadow-secondary/20">
            <User className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-headline font-black tracking-tighter uppercase leading-none text-white">EL ESPEJO <span className="text-secondary">DEL TURNO</span></h1>
            <p className="text-xs font-headline uppercase tracking-[0.3em] text-secondary/60 font-bold">Módulo de Integridad Preventiva</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-headline font-black uppercase text-white/40 tracking-widest mb-1">Nivel de Integridad</p>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${integrityLevel > 50 ? 'bg-emerald-500' : integrityLevel > 20 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${integrityLevel}%` }}
                />
              </div>
              <span className="text-xl font-headline font-black text-white">{integrityLevel}%</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-headline font-black uppercase text-white/40 tracking-widest mb-1">Puntaje</p>
            <p className="text-2xl font-headline font-black text-secondary">{score}</p>
          </div>
          <button onClick={onExit} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-rose-500/20 hover:border-rose-500/50 transition-all group shadow-lg">
            <LogOut className="group-hover:text-rose-500 transition-colors text-white/60" size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-6xl mx-auto w-full gap-8">
        
        {/* Progress Bar */}
        <div className="w-full max-w-md flex gap-1 mb-4">
          {situations.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i === currentIdx ? 'bg-secondary scale-y-125' : i < currentIdx ? 'bg-secondary/40' : 'bg-white/10'}`} 
            />
          ))}
        </div>
        <div className="w-full perspective-2000 h-[650px] md:h-[750px] max-w-5xl">
          <AnimatePresence mode="wait">
            {step === 'SUMMARY' ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full glass-panel-heavy rounded-[3rem] border-4 border-secondary p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-secondary/5 pointer-events-none" />
                <Trophy className="text-secondary mb-6" size={80} />
                <h2 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tighter mb-4">MISIÓN <span className="text-secondary">COMPLETADA</span></h2>
                <p className="text-xl md:text-2xl font-headline font-black text-white/60 uppercase tracking-widest mb-12">Tu reflejo ha demostrado integridad</p>
                
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
                  <button 
                    onClick={() => onFinish()}
                    className="flex-1 py-6 bg-emerald-500 text-slate-950 rounded-2xl font-headline font-black uppercase tracking-widest text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:scale-105"
                  >
                    FINALIZAR Y REGISTRAR
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex-1 py-6 bg-white/5 border-2 border-white/10 text-white rounded-2xl font-headline font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all hover:scale-105"
                  >
                    REINTENTAR
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                className="relative w-full h-full transition-all duration-700 preserve-3d"
                animate={{ rotateY: step === 'RESULT' ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of Card: Situation & Decision */}
                <div 
                  className="absolute inset-0 backface-hidden glass-panel-heavy rounded-[3rem] border-4 border-white/20 p-4 md:p-8 flex flex-col items-center justify-between text-center shadow-2xl overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <div className={`absolute inset-0 opacity-10 ${ESPEJO_CATEGORY_COLORS[current.categoria]?.split(' ')[0] || 'bg-secondary'}`} />
                  
                  {/* Top Bar: Category & Mission */}
                  <div className="w-full flex justify-between items-center relative z-10 mb-4">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-headline font-black uppercase tracking-[0.2em] ${ESPEJO_CATEGORY_COLORS[current.categoria] || 'bg-gray-500'} text-black shadow-lg`}>
                      {current.categoria}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 font-headline font-bold text-[10px] uppercase tracking-widest">
                      <Shield size={12} /> Misión {currentIdx + 1}/{situations.length}
                    </div>
                  </div>

                  {/* Main Content: The Situation (Prominent) */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 relative z-10 w-full px-4 md:px-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="px-5 py-1.5 bg-secondary/20 border border-secondary/30 rounded-full">
                        <span className="text-secondary font-headline font-black uppercase tracking-[0.4em] text-[9px]">Escenario de Integridad</span>
                      </div>
                      <div className="flex items-center gap-4 text-white/20">
                        <div className="h-px w-16 bg-current" />
                        <Zap size={32} className="text-secondary animate-pulse" />
                        <div className="h-px w-16 bg-current" />
                      </div>
                    </div>
                    
                    <div className="relative w-full group">
                      {/* Large Decorative Quotes */}
                      <div className="absolute -top-16 -left-6 text-secondary/10 text-[140px] md:text-[220px] font-serif leading-none select-none pointer-events-none group-hover:text-secondary/20 transition-colors duration-700">“</div>
                      
                      <motion.h3 
                        key={current.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl md:text-6xl lg:text-7xl font-headline font-black uppercase tracking-tight leading-[1.05] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)] relative z-10 px-2"
                      >
                        {current.situacion}
                      </motion.h3>
                      
                      <div className="absolute -bottom-20 -right-6 text-secondary/10 text-[140px] md:text-[220px] font-serif leading-none select-none pointer-events-none rotate-180 group-hover:text-secondary/20 transition-colors duration-700">“</div>
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                        <p className="text-secondary font-headline font-black uppercase tracking-[0.5em] text-xs">¿Cómo reacciona tu reflejo?</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                      </div>
                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent rounded-full" />
                    </div>
                  </div>

                  {/* Decision Grid: Proportional Buttons */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 relative z-10 mt-4">
                    <button 
                      onClick={() => handleDecision('SAFE')}
                      className="group relative flex flex-col items-center gap-2 p-4 md:p-6 bg-emerald-500/5 border-2 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500 rounded-[1.5rem] transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle2 size={48} />
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="text-center">
                        <span className="block text-[9px] font-headline font-black uppercase tracking-widest text-emerald-500/60 mb-0.5">Integridad</span>
                        <span className="text-xs md:text-sm font-headline font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                          {current.opcion_segura || "Hacer lo correcto"}
                        </span>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleDecision('RISKY')}
                      className="group relative flex flex-col items-center gap-2 p-4 md:p-6 bg-rose-500/5 border-2 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500 rounded-[1.5rem] transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle size={48} />
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/20">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="text-center">
                        <span className="block text-[9px] font-headline font-black uppercase tracking-widest text-rose-500/60 mb-0.5">Atajo</span>
                        <span className="text-xs md:text-sm font-headline font-black uppercase tracking-tight text-white group-hover:text-rose-400 transition-colors">
                          {current.opcion_riesgosa || "Tomar el atajo"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Back of Card: Result & Reflection */}
                <motion.div 
                  className={`absolute inset-0 backface-hidden rounded-[3rem] border-4 ${lastDecision === 'SAFE' ? 'border-emerald-500' : 'border-rose-500'} p-6 md:p-10 flex flex-col items-center justify-between text-center shadow-2xl bg-slate-900 rotate-y-180 overflow-hidden`}
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className={`absolute inset-0 opacity-10 ${lastDecision === 'SAFE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  
                  <div className="w-full flex justify-center relative z-10">
                    <div className={`flex items-center gap-3 px-6 py-2 rounded-full font-headline font-black uppercase tracking-[0.2em] text-xs ${lastDecision === 'SAFE' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                      {lastDecision === 'SAFE' ? <Trophy size={16} /> : <AlertCircle size={16} />}
                      {lastDecision === 'SAFE' ? 'DECISIÓN ÍNTEGRA' : 'RIESGO DETECTADO'}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10 py-2 w-full px-4">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center mb-2 ${lastDecision === 'SAFE' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'} border-2 border-current shadow-lg`}>
                      {lastDecision === 'SAFE' ? <Heart size={32} /> : <AlertTriangle size={32} />}
                    </div>
                    
                    <h4 className="text-[10px] md:text-xs font-headline font-black text-secondary uppercase tracking-[0.4em] mb-1">La Verdad del Espejo</h4>
                    
                    <div className="relative px-6 max-w-4xl">
                      <div className="absolute -top-6 -left-2 text-white/10 text-6xl md:text-8xl font-serif">“</div>
                      <p className="text-xl md:text-3xl lg:text-4xl font-headline font-black uppercase leading-[1.2] text-white drop-shadow-lg">
                        {lastDecision === 'SAFE' ? current.reflexion : `Al elegir el atajo: ${current.pregunta_debate}`}
                      </p>
                      <div className="absolute -bottom-10 -right-2 text-white/10 text-6xl md:text-8xl font-serif rotate-180">“</div>
                    </div>
                  </div>

                  <div className="w-full space-y-4 relative z-10">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <div className="w-full flex items-start gap-4 text-left bg-white/5 p-5 rounded-[2rem] border border-white/10">
                      <div className={`p-3 rounded-2xl ${lastDecision === 'SAFE' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'} shrink-0`}>
                        <Info size={20} />
                      </div>
                      <div>
                        <span className="font-headline font-black uppercase text-secondary/60 text-[10px] tracking-widest block mb-1">Aprendizaje Clave</span>
                        <p className="text-sm md:text-base font-body text-white/90 leading-snug">
                          {lastDecision === 'SAFE' 
                            ? "Tu integridad fortalece la cultura de seguridad de todo el equipo. ¡Seguí así!" 
                            : current.reflexion}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={nextCard} 
                      className={`w-full py-5 font-headline font-black uppercase tracking-[0.3em] text-sm rounded-2xl transition-all flex items-center justify-center gap-4 ${lastDecision === 'SAFE' ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {currentIdx === situations.length - 1 ? 'FINALIZAR MISIÓN' : 'SIGUIENTE ESCENARIO'}
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 text-sm font-headline font-bold uppercase tracking-[0.3em] text-white/40">
          <AlertCircle size={18} className="text-secondary" /> La seguridad no es una opción, es una decisión diaria
        </div>
      </main>

      <div className="absolute bottom-6 left-10 flex items-center gap-4 opacity-30">
        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-white">
          Mirror Integrity Module v4.0 // Decisión y Consecuencia
        </div>
      </div>
    </div>
  );
};
