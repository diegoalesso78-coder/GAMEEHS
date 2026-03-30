import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Activity, Zap, Info, Trophy, Layout, LogOut, 
  ChevronRight, Play, X, CheckCircle2, AlertTriangle, 
  Target, ArrowRight, Timer, MousePointer2, Clock, 
  HelpCircle, Paperclip, Camera, User, Unlock, Lock,
  AlertCircle, Search, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ESCAPE_SHEETS_URL, ESCAPE_FALLBACK } from '../../constants';

const EscapeRoomIntro = ({ onStart, onExit }: { onStart: () => void, onExit: () => void }) => (
  <div className="min-h-screen obsidian-table relative overflow-hidden flex items-center justify-center p-6 font-sans text-white">
    {/* Background Elements */}
    <div className="absolute inset-0 hex-grid opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal/50 pointer-events-none" />

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl w-full glass-panel-heavy p-12 rounded-2xl border border-white/10 text-center shadow-2xl relative z-10"
    >
      <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 mb-6 flex items-center gap-2 transition-opacity">
        <ArrowRight className="rotate-180" size={12} /> Volver al Menú
      </button>

      <div className="mb-10 inline-block p-6 bg-tertiary/10 rounded-full border-2 border-tertiary/30 shadow-[0_0_30px_rgba(247,190,29,0.2)]">
        <Lock className="w-16 h-16 text-tertiary" />
      </div>
      <div className="mb-10">
        <p className="text-tertiary font-black uppercase tracking-[0.5em] text-sm mb-2">Protocolo de Emergencia</p>
        <h1 className="text-7xl font-black text-white mb-2 tracking-tighter uppercase leading-none">
          ESCAPE ROOM <span className="text-tertiary">EHS</span>
        </h1>
        <div className="w-32 h-1.5 bg-tertiary mx-auto rounded-full" />
      </div>
      
      <div className="bg-charcoal/60 p-8 rounded-xl border border-white/5 text-left mb-12 space-y-5 font-mono text-sm leading-relaxed relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
        <p className="text-tertiary font-black">&gt; INICIANDO PROTOCOLO DE INVESTIGACIÓN...</p>
        <p className="text-white/70">ALERTA: Un operario ha caído desde 3 metros en la obra de Córdoba. La SRT llegará en 45 minutos para una auditoría sorpresa de alto impacto.</p>
        <p className="text-white/70">MISIÓN: Tu objetivo es identificar la causa raíz, analizar testimonios y proponer medidas preventivas antes de que el tiempo expire.</p>
        <p className="text-tertiary font-black animate-pulse">&gt; ¿ESTÁS LISTO PARA EL DESAFÍO, OPERADOR?</p>
      </div>

      <button 
        onClick={onStart}
        className="btn-industrial-orange w-full py-8 text-black font-headline font-black uppercase tracking-widest text-2xl"
      >
        COMENZAR INVESTIGACIÓN
      </button>
    </motion.div>
  </div>
);

const EscapeRoomEnd = ({ score, onRestart, onFinish }: { score: number, onRestart: () => void, onFinish?: () => void }) => (
  <div className="min-h-screen obsidian-table relative overflow-hidden flex items-center justify-center p-6 font-sans text-white">
    {/* Background Elements */}
    <div className="absolute inset-0 hex-grid opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal/50 pointer-events-none" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl w-full glass-panel-heavy p-12 rounded-2xl border border-emerald-500/20 text-center shadow-2xl relative z-10"
    >
      <div className="mb-10 inline-block p-6 bg-emerald-500/10 rounded-full border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <Unlock className="w-16 h-16 text-emerald-500" />
      </div>
      <div className="mb-12">
        <p className="text-emerald-500 font-black uppercase tracking-[0.5em] text-sm mb-2">Análisis Completado</p>
        <h2 className="text-6xl font-black text-white mb-2 tracking-tighter uppercase">¡CASO CERRADO!</h2>
        <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full" />
      </div>
      
      <div className="bg-charcoal/60 p-10 rounded-xl border border-white/5 mb-12 shadow-inner">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Puntaje de Eficiencia Operativa</p>
        <p className="text-7xl font-black text-tertiary tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(247,190,29,0.3)]">
          {score.toString().padStart(4, '0')}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {onFinish && (
          <button 
            onClick={onFinish}
            className="btn-industrial-orange w-full py-6 text-black font-headline font-black uppercase tracking-widest text-xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(247,190,29,0.3)]"
          >
            <Trophy size={24} /> FINALIZAR Y REGISTRAR
          </button>
        )}
        <button 
          onClick={onRestart}
          className="w-full py-6 bg-white/10 hover:bg-white/20 text-white font-headline font-black uppercase tracking-widest text-xl rounded-sm transition-all"
        >
          NUEVA INVESTIGACIÓN
        </button>
      </div>
    </motion.div>
  </div>
);

const EscapeRoomStageRenderer = ({ stage, data, onComplete }: { stage: number, data: any[], onComplete: (exp: string) => void }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [inputs, setInputs] = useState(['', '', '', '', '']);
  const [classified, setClassified] = useState<Record<number, string>>({});

  if (stage === 1 || stage === 2) {
    const handleToggle = (idx: number) => {
      if (selected.includes(idx)) {
        setSelected(selected.filter(i => i !== idx));
      } else if (selected.length < 3) {
        setSelected([...selected, idx]);
      }
    };

    const validate = () => {
      const correctIndices = data.map((d, i) => d.es_correcto === 'SI' ? i : null).filter(i => i !== null);
      const isAllCorrect = selected.length === 3 && selected.every(i => correctIndices.includes(i));
      if (isAllCorrect) {
        onComplete(data[0].explicacion);
      } else {
        alert("Algunos elementos seleccionados no son correctos o faltan evidencias.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-tertiary uppercase tracking-tighter flex items-center gap-3">
            {stage === 1 ? <Camera className="w-7 h-7" /> : <User className="w-7 h-7" />}
            {stage === 1 ? "Evidencias del Sitio" : "Declaración del Testigo"}
          </h3>
          <div className="px-4 py-1.5 bg-tertiary/10 border border-tertiary/30 rounded-full">
            <span className="text-[10px] font-black text-tertiary uppercase tracking-widest">Selección: {selected.length}/3</span>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto pr-4 custom-scrollbar">
          {data.map((item, i) => (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              className={`p-6 rounded-xl border-2 text-left transition-all relative group overflow-hidden ${
                selected.includes(i) 
                ? 'bg-tertiary/10 border-tertiary text-white' 
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                  selected.includes(i) 
                  ? 'bg-tertiary border-tertiary text-charcoal' 
                  : 'border-white/20 bg-charcoal/50'
                }`}>
                  {selected.includes(i) && <CheckCircle2 className="w-5 h-5" />}
                </div>
                <p className="font-mono text-sm leading-relaxed uppercase tracking-tight">{item.texto}</p>
              </div>
              {selected.includes(i) && (
                <motion.div 
                  layoutId="active-bg"
                  className="absolute inset-0 bg-gradient-to-r from-tertiary/5 to-transparent pointer-events-none"
                />
              )}
            </button>
          ))}
        </div>
        <button 
          disabled={selected.length < 3}
          onClick={validate}
          className="mt-8 w-full py-6 bg-tertiary hover:bg-tertiary/80 text-charcoal font-black uppercase tracking-widest text-xl disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl transition-all"
        >
          VALIDAR HALLAZGOS
        </button>
      </div>
    );
  }

  if (stage === 3) {
    const handleClassify = (idx: number, type: string) => {
      setClassified({ ...classified, [idx]: type });
    };

    const validate = () => {
      const allCorrect = data.every((d, i) => classified[i] === d.tipo);
      if (allCorrect && Object.keys(classified).length === data.length) {
        onComplete("Análisis técnico validado. Has separado correctamente los síntomas de las fallas sistémicas.");
      } else {
        alert("La clasificación técnica presenta errores. Revisa la lógica de causalidad.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-black text-tertiary uppercase tracking-tighter mb-8 flex items-center gap-3">
          <Zap className="w-7 h-7" /> Clasificación de Causas
        </h3>
        <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
          {data.map((item, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
              <p className="font-mono text-sm mb-6 text-white uppercase tracking-tight leading-relaxed border-l-2 border-tertiary pl-4">{item.texto}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleClassify(i, 'causa_inmediata')}
                  className={`flex-1 py-4 rounded-lg border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                    classified[i] === 'causa_inmediata' 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                    : 'border-white/10 text-white/40 hover:bg-white/5'
                  }`}
                >
                  Causa Inmediata
                </button>
                <button 
                  onClick={() => handleClassify(i, 'causa_basica')}
                  className={`flex-1 py-4 rounded-lg border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                    classified[i] === 'causa_basica' 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'border-white/10 text-white/40 hover:bg-white/5'
                  }`}
                >
                  Causa Básica
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          disabled={Object.keys(classified).length < data.length}
          onClick={validate}
          className="mt-8 w-full py-6 bg-tertiary hover:bg-tertiary/80 text-charcoal font-black uppercase tracking-widest text-xl disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl transition-all"
        >
          CONFIRMAR CLASIFICACIÓN
        </button>
      </div>
    );
  }

  if (stage === 4) {
    const validate = () => {
      if (inputs.every(v => v.length > 5)) {
        onComplete("Análisis profundo completado. Has llegado a la falla en el sistema de mantenimiento.");
      } else {
        alert("Completa todos los niveles del análisis con respuestas detalladas.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-black text-tertiary uppercase tracking-tighter mb-8 flex items-center gap-3">
          <HelpCircle className="w-7 h-7" /> Técnica de los 5 Por Qué
        </h3>
        <div className="flex-1 space-y-5 overflow-y-auto pr-4 custom-scrollbar">
          {inputs.map((val, i) => (
            <div key={i} className="flex gap-6 items-start group">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary font-black flex-shrink-0 shadow-lg group-hover:bg-tertiary group-hover:text-charcoal transition-all">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">Nivel de Causalidad {i + 1}</p>
                <input 
                  type="text"
                  placeholder="¿Por qué ocurrió esto?"
                  value={val}
                  onChange={(e) => {
                    const newInputs = [...inputs];
                    newInputs[i] = e.target.value;
                    setInputs(newInputs);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white placeholder:text-white/20 focus:border-tertiary focus:bg-white/10 outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={validate}
          className="mt-8 w-full py-6 bg-tertiary hover:bg-tertiary/80 text-charcoal font-black uppercase tracking-widest text-xl rounded-2xl transition-all"
        >
          FINALIZAR ANÁLISIS
        </button>
      </div>
    );
  }

  if (stage === 5) {
    const validate = () => {
      if (selected.length === 3) {
        onComplete("Plan de acción definido. La investigación ha concluido con éxito.");
      } else {
        alert("Selecciona las 3 medidas preventivas más efectivas.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-black text-tertiary uppercase tracking-tighter mb-8 flex items-center gap-3">
          <Target className="w-7 h-7" /> Plan de Acción Preventivo
        </h3>
        <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto pr-4 custom-scrollbar">
          {data.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (selected.includes(i)) setSelected(selected.filter(x => x !== i));
                else if (selected.length < 3) setSelected([...selected, i]);
              }}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selected.includes(i) 
                ? 'bg-tertiary/10 border-tertiary text-white' 
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selected.includes(i) ? 'bg-tertiary border-tertiary text-charcoal' : 'border-white/20'}`}>
                  {selected.includes(i) && <CheckCircle2 size={14} />}
                </div>
                <p className="font-mono text-sm uppercase tracking-tight">{item.texto}</p>
              </div>
            </button>
          ))}
        </div>
        <button 
          disabled={selected.length < 3}
          onClick={validate}
          className="mt-8 w-full py-6 bg-tertiary hover:bg-tertiary/80 text-charcoal font-black uppercase tracking-widest text-xl disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl transition-all"
        >
          CERRAR INVESTIGACIÓN
        </button>
      </div>
    );
  }

  return null;
};

export const EscapeRoomGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME' | 'END'>('INTRO');
  const [stage, setStage] = useState(1);
  const [gameData, setGameData] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [score, setScore] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    fetch(ESCAPE_SHEETS_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const data = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            etapa: parseInt(cols[0]),
            tipo: cols[1],
            texto: cols[2],
            es_correcto: cols[3],
            pista: cols[4],
            explicacion: cols[5]
          };
        }).filter(d => !isNaN(d.etapa));
        setGameData(data.length > 0 ? data : ESCAPE_FALLBACK);
      })
      .catch(() => setGameData(ESCAPE_FALLBACK));
  }, []);

  useEffect(() => {
    if (view === 'GAME') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [view]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUseHint = () => {
    setShowHint(true);
    setTimeLeft(prev => Math.max(0, prev - 30));
  };

  const nextStage = () => {
    setExplanation(null);
    setShowHint(false);
    if (stage < 5) {
      setCompletedStages([...completedStages, stage]);
      setStage(prev => prev + 1);
    } else {
      const finalScore = timeLeft * 10;
      setScore(finalScore);
      onGameOver(finalScore);
      setView('END');
    }
  };

  if (view === 'INTRO') return <EscapeRoomIntro onStart={() => setView('GAME')} onExit={onExit} />;
  if (view === 'END') return <EscapeRoomEnd score={score} onRestart={() => onExit()} onFinish={onFinish} />;

  const currentStageData = gameData.filter(d => d.etapa === stage);

  return (
    <div className="min-h-screen obsidian-table relative overflow-hidden flex flex-col font-sans text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 hex-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal/50 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full h-screen overflow-hidden">
        {/* HUD Superior */}
        <header className="glass-panel-heavy p-6 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => {
                onGameOver(score);
                onExit();
              }}
              className="px-6 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              Finalizar Partida
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary mb-1">Investigación en curso</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Operación <span className="text-tertiary">Causa Raíz</span></h2>
            </div>
            <div className="h-12 w-px bg-white/10 hidden md:block"></div>
            <div className="flex gap-3">
              {[1,2,3,4,5].map(s => (
                <div 
                  key={s} 
                  className={`w-10 h-2.5 rounded-full transition-all duration-700 relative overflow-hidden bg-white/5 border border-white/5 ${
                    stage === s ? 'ring-1 ring-tertiary/50' : ''
                  }`}
                >
                  <motion.div 
                    initial={false}
                    animate={{ 
                      width: completedStages.includes(s) ? '100%' : stage === s ? '50%' : '0%',
                      backgroundColor: completedStages.includes(s) ? '#10b981' : stage === s ? '#f7be1d' : 'transparent'
                    }}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-tertiary opacity-70 mb-1">Tiempo SRT</p>
              <div className="flex items-center gap-3 justify-end">
                <Clock className={`w-6 h-6 ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-white'}`} />
                <span className={`text-4xl font-black tabular-nums ${timeLeft < 300 ? 'text-rose-500' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <button 
              onClick={handleUseHint}
              className="w-14 h-14 bg-white/5 hover:bg-tertiary hover:text-charcoal border border-white/10 rounded-xl transition-all flex items-center justify-center group"
              title="Pedir Pista (-30s)"
            >
              <HelpCircle className="w-8 h-8 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </header>

        {/* Área de Juego Principal */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
          {/* Panel de Información / Dossier */}
          <div className="lg:col-span-1 flex flex-col gap-6 relative">
            {/* Paperclip decoration */}
            <div className="absolute -top-2 left-10 z-20 rotate-[-15deg] opacity-60 pointer-events-none">
              <Paperclip className="w-10 h-10 text-slate-400 drop-shadow-md" />
            </div>

            <div className="bg-[#fdf6e3] text-black font-mono p-8 rounded-sm rotate-[-0.5deg] flex-1 overflow-y-auto custom-scrollbar shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-b-8 border-r-8 border-black/10 relative overflow-hidden group select-none">
              {/* Paper texture overlay */}
              <div className="absolute inset-0 paper-texture pointer-events-none" />
              
              {/* Subtle fold lines */}
              <div className="absolute top-1/3 left-0 w-full h-px bg-black/5 pointer-events-none" />
              <div className="absolute top-2/3 left-0 w-full h-px bg-black/5 pointer-events-none" />
              
              {/* Coffee Stain */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#4a3728] opacity-[0.03] rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-8 w-32 h-32 border-8 border-[#4a3728] opacity-[0.02] rounded-full blur-md pointer-events-none" />

              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] opacity-[0.04] pointer-events-none select-none">
                <Shield className="w-96 h-96" />
              </div>

              {/* Confidential Stamp */}
              <div className="absolute top-12 right-8 border-4 border-rose-700/40 text-rose-700/40 font-black px-4 py-2 rounded-lg uppercase tracking-[0.3em] text-xs rotate-12 pointer-events-none select-none stamped flex flex-col items-center leading-none">
                <span>CONFIDENCIAL</span>
                <span className="text-[8px] mt-1 opacity-60">SRT-EHS-2026</span>
              </div>

              <div className="border-b-2 border-black/20 pb-6 mb-8 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Expediente #COR-2026-03</h3>
                  <div className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest">TOP SECRET</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-black">Protocolo EHS - Investigación de Accidentes</p>
                </div>
              </div>
              
              <div className="space-y-8 text-sm text-black relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black/5 rounded flex items-center justify-center flex-shrink-0 border border-black/5">
                    <AlertCircle className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Evento Reportado</p>
                    <p className="leading-tight font-bold">Caída de altura (3 metros) durante montaje de vigas estructurales.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black/5 rounded flex items-center justify-center flex-shrink-0 border border-black/5">
                    <Search className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Ubicación Geográfica</p>
                    <p className="leading-tight font-bold">Obra Civil "Nuevos Horizontes", Sector B, Córdoba.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black/5 rounded flex items-center justify-center flex-shrink-0 border border-black/5">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Estado del Personal</p>
                    <p className="leading-tight font-bold">Operario estable, fractura de fémur. Bajo observación médica.</p>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-black/10 mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-xs uppercase tracking-widest text-zinc-500">Objetivo Fase {stage}</p>
                    <div className="text-[8px] font-bold text-zinc-400">PÁGINA {stage} DE 5</div>
                  </div>
                  <p className="italic font-medium text-black leading-relaxed bg-black/5 p-5 rounded-lg border-l-4 border-black shadow-inner">
                    {stage === 1 && "Identifica las 3 evidencias físicas críticas que demuestren fallas en el sistema de seguridad."}
                    {stage === 2 && "Analiza los testimonios del personal y detecta las 3 inconsistencias o mentiras."}
                    {stage === 3 && "Clasifica técnicamente los hallazgos entre causas inmediatas y causas básicas."}
                    {stage === 4 && "Aplica la metodología de los '5 Por Qué' para profundizar hasta el origen sistémico."}
                    {stage === 5 && "Define el plan de acción preventivo para mitigar la recurrencia del evento."}
                  </p>

                  {/* Field Notes Decoration */}
                  <div className="mt-10 pt-8 border-t border-black/10 relative">
                    <div className="flex items-center gap-2 text-rose-900/40 mb-3">
                      <FileText className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Notas de Campo del Analista</span>
                    </div>
                    <p className="text-xl text-rose-950/80 mt-2 leading-tight font-handwritten">
                      "El sistema de anclaje parece haber fallado por falta de mantenimiento preventivo. Revisar bitácora de inspecciones urgentemente."
                    </p>
                    
                    {/* Barcode placeholder */}
                    <div className="mt-10 flex flex-col items-end opacity-20">
                      <div className="flex gap-0.5 h-8">
                        {[2,4,1,3,2,1,4,2,3,1,2,4,1,3].map((w, i) => (
                          <div key={i} className="bg-black" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                      <span className="text-[8px] mt-1 font-mono">SRT-99283-EHS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="bg-tertiary/20 border-l-4 border-tertiary p-5 rounded-r-xl shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-tertiary" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-tertiary">Pista del Analista</p>
                  </div>
                  <p className="text-sm text-white italic leading-relaxed">
                    {gameData.find(d => d.etapa === stage)?.pista || "Analiza los detalles técnicos con rigor."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Panel de Interacción */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel-heavy flex-1 rounded-2xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {explanation ? (
                  <motion.div 
                    key="explanation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border-2 border-emerald-500/30">
                      <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Fase {stage} Validada</h3>
                    <div className="w-16 h-1 bg-emerald-500 mb-8 rounded-full" />
                    <p className="text-white/70 max-w-lg mb-12 leading-relaxed text-lg italic">
                      "{explanation}"
                    </p>
                    <button 
                      onClick={nextStage}
                      className="btn-industrial-orange px-16 py-6 text-black font-headline font-black uppercase tracking-widest text-xl flex items-center gap-4"
                    >
                      SIGUIENTE FASE <ArrowRight className="w-6 h-6" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={`stage-${stage}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    <EscapeRoomStageRenderer 
                      stage={stage} 
                      data={gameData.filter(d => d.etapa === stage)} 
                      onComplete={(exp: string) => {
                        setExplanation(exp);
                        setScore(prev => prev + 1000);
                        if (stage === 5) {
                          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
