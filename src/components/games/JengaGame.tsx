
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Zap, Info, Trophy, Layout, LogOut, ChevronRight, Play, X, CheckCircle2, Dice5, AlertTriangle, Target, ArrowRight, Timer, MousePointer2, Clock, HelpCircle, Paperclip, Calendar, Cpu, User, Layers, Printer, Monitor, ChevronLeft, Filter, RotateCcw, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { JENGA_SHEETS_URL, JENGA_FALLBACK } from '../../constants';

export const JengaGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [mode, setMode] = useState<'START' | 'PRINT' | 'DIGITAL'>('START');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [answeredIds, setAnsweredIds] = useState(new Set());
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [printFilters, setPrintFilters] = useState({ niveles: ['Básico', 'Medio', 'Experto'], categorias: [] as string[] });

  useEffect(() => {
    fetch(JENGA_SHEETS_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const parsed = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            numero: parseInt(cols[0]),
            pregunta: cols[1],
            respuesta: cols[2],
            nivel: cols[3],
            categoria: cols[4],
            explicacion: cols[5]
          };
        }).filter(d => !isNaN(d.numero));
        setData(parsed.length > 0 ? parsed : JENGA_FALLBACK);
        setLoading(false);
      })
      .catch(() => {
        setData(JENGA_FALLBACK);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => [...new Set(data.map(d => d.categoria))], [data]);
  const filteredData = useMemo(() => data.filter(d => printFilters.niveles.includes(d.nivel) && (printFilters.categorias.length === 0 || printFilters.categorias.includes(d.categoria))), [data, printFilters]);

  const getLevelColorClass = (nivel: string) => {
    switch(nivel) {
      case 'Básico': return 'bg-emerald-500';
      case 'Medio': return 'bg-amber-500';
      case 'Experto': return 'bg-rose-500';
      default: return 'bg-zinc-500';
    }
  };

  const getLevelBorderClass = (nivel: string) => {
    switch(nivel) {
      case 'Básico': return 'border-emerald-500/30';
      case 'Medio': return 'border-amber-500/30';
      case 'Experto': return 'border-rose-500/30';
      default: return 'border-white/10';
    }
  };

  const getLevelTextClass = (nivel: string) => {
    switch(nivel) {
      case 'Básico': return 'text-emerald-500';
      case 'Medio': return 'text-amber-500';
      case 'Experto': return 'text-rose-500';
      default: return 'text-white/40';
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 hex-grid opacity-20"></div>
      <div className="relative z-10 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mb-6 mx-auto"
        />
        <h2 className="text-xl font-black tracking-widest text-emerald-500 animate-pulse uppercase">CARGANDO PROTOCOLOS</h2>
      </div>
    </div>
  );

  if (mode === 'START') return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 hex-grid opacity-10"></div>
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-7xl font-black tracking-tighter mb-2 uppercase">JENGA<span className="text-emerald-500">SEGURO</span></h1>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Industrial Safety Training</p>
      </motion.div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="glass-panel-heavy p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center space-y-8 group hover:border-emerald-500/30 transition-all duration-500"
        >
          <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
            <Printer className="w-12 h-12 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-3 uppercase">MODO IMPRESIÓN</h2>
            <p className="text-sm text-white/50 leading-relaxed">Genera etiquetas físicas de alta visibilidad para tu torre Jenga real.</p>
          </div>
          <button 
            onClick={() => setMode('PRINT')} 
            className="w-full py-5 bg-emerald-500 text-slate-950 font-black rounded-xl uppercase tracking-widest text-sm"
          >
            CONFIGURAR ETIQUETAS
          </button>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="glass-panel-heavy p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center space-y-8 group hover:border-amber-500/30 transition-all duration-500"
        >
          <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/30 group-hover:scale-110 transition-transform duration-500">
            <Monitor className="w-12 h-12 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-3 uppercase">MODO DIGITAL</h2>
            <p className="text-sm text-white/50 leading-relaxed">Utiliza la interfaz digital proyectada para dinamizar tus talleres.</p>
          </div>
          <button 
            onClick={() => setMode('DIGITAL')} 
            className="w-full py-5 bg-amber-500 text-slate-950 font-black rounded-xl uppercase tracking-widest text-sm"
          >
            INICIAR TALLER
          </button>
        </motion.div>
      </div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onExit} 
        className="mt-16 px-8 py-3 glass-panel-heavy rounded-full text-white/40 font-black uppercase text-xs tracking-widest hover:text-emerald-500 hover:border-emerald-500/30 transition-all flex items-center gap-3"
      >
        <LogOut size={12} /> Volver al Menú Principal
      </motion.button>
    </div>
  );

  if (mode === 'PRINT') return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      <div className="absolute inset-0 hex-grid opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 no-print">
          <button 
            onClick={() => setMode('START')} 
            className="flex items-center gap-3 text-white/40 hover:text-emerald-500 transition-all uppercase font-black text-xs tracking-widest"
          >
            <ChevronLeft size={18} /> Volver al Inicio
          </button>
          
          <div className="text-center">
            <h2 className="text-4xl font-black leading-none mb-2 uppercase">GENERADOR DE <span className="text-emerald-500">ETIQUETAS</span></h2>
            <p className="text-[10px] opacity-40 uppercase tracking-[0.4em]">Configuración de Activos Físicos</p>
          </div>

          <button 
            onClick={() => window.print()} 
            className="px-10 py-4 bg-emerald-500 text-slate-950 font-black rounded-xl flex items-center gap-3 uppercase text-sm tracking-widest"
          >
            <Printer size={20} /> IMPRIMIR LOTE
          </button>
        </header>

        <div className="grid lg:grid-cols-4 gap-10">
          <aside className="space-y-6 no-print">
            <div className="glass-panel-heavy p-8 rounded-[2rem] border border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-3">
                <Layers size={16} /> Filtrar Niveles
              </h3>
              <div className="space-y-4">
                {['Básico', 'Medio', 'Experto'].map(lvl => (
                  <label key={lvl} className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={printFilters.niveles.includes(lvl)} 
                      onChange={(e) => {
                        const next = e.target.checked ? [...printFilters.niveles, lvl] : printFilters.niveles.filter(n => n !== lvl);
                        setPrintFilters(prev => ({ ...prev, niveles: next }));
                      }} 
                      className="w-6 h-6 rounded-lg border-2 border-white/10 bg-white/5 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer" 
                    />
                    <span className="text-sm font-black uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-all">{lvl}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-3">
              {filteredData.map(item => (
                <div 
                  key={item.numero} 
                  className="bg-white text-black p-6 border-2 border-dashed border-black/20 flex flex-col min-h-[160px] relative overflow-hidden print:break-inside-avoid rounded-sm"
                >
                  <div className="flex-1 border-b-2 border-dashed border-black/10 pb-4 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-4xl font-black leading-none">#{item.numero}</span>
                      <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full border-2 border-black/10">
                        {item.categoria}
                      </span>
                    </div>
                    <p className="text-xs font-bold leading-tight">{item.pregunta}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-[9px] font-black uppercase opacity-40 mb-1">Respuesta Clave:</p>
                      <p className="text-xs font-bold leading-tight">{item.respuesta}</p>
                    </div>
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-2 ${getLevelColorClass(item.nivel)}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col obsidian-table text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-hex-grid opacity-5 pointer-events-none"></div>
      
      <header className="glass-panel-heavy p-6 flex justify-between items-center border-b border-white/10 z-20 relative">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setMode('START')} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group"
          >
            <ChevronLeft size={24} className="group-hover:text-emerald-500 transition-colors" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter leading-none uppercase">JENGA<span className="text-emerald-500">SEGURO</span></h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/60 mt-1">Taller Digital Interactivo</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex gap-10">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest mb-1">Correctas</p>
              <p className="text-3xl font-black leading-none">{score.correct}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-rose-500 tracking-widest mb-1">Incorrectas</p>
              <p className="text-3xl font-black leading-none">{score.incorrect}</p>
            </div>
          </div>
          {onFinish && (
            <button 
              onClick={() => onFinish()}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Trophy size={14} /> FINALIZAR Y REGISTRAR
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="grid grid-cols-6 md:grid-cols-9 gap-3 w-full max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar p-2">
            {data.map((block) => {
              const isAnswered = answeredIds.has(block.numero);
              return (
                <motion.button 
                  key={block.numero} 
                  whileHover={!isAnswered ? { scale: 1.05, y: -5 } : {}}
                  whileTap={!isAnswered ? { scale: 0.95 } : {}}
                  onClick={() => { if(!isAnswered) { setSelectedBlock(block); setRevealAnswer(false); } }}
                  className={`aspect-square rounded-2xl font-black text-lg transition-all flex items-center justify-center border-2 relative overflow-hidden ${
                    isAnswered 
                    ? 'bg-zinc-900 border-zinc-800 opacity-20 pointer-events-none' 
                    : `bg-white/5 ${getLevelBorderClass(block.nivel)} hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`
                  }`}
                >
                  {!isAnswered && (
                    <div className={`absolute top-0 left-0 w-full h-1 ${getLevelColorClass(block.nivel)}`}></div>
                  )}
                  <span className={`relative z-10 ${isAnswered ? 'text-white/20' : 'text-white'}`}>{block.numero}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedBlock && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 40 }}
              className="max-w-4xl w-full glass-panel-heavy p-12 rounded-[4rem] border border-white/10 relative overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedBlock(null)} 
                className="absolute top-10 right-10 p-3 hover:bg-white/10 rounded-full transition-all z-20"
              >
                <X size={32} className="text-white/40 hover:text-white" />
              </button>

              <div className="space-y-12 relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <span className="text-8xl font-black text-white/5 leading-none tracking-tighter">#{selectedBlock.numero}</span>
                    <div className="space-y-2">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${getLevelBorderClass(selectedBlock.nivel)} ${getLevelTextClass(selectedBlock.nivel)}`}>
                        Nivel {selectedBlock.nivel}
                      </span>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-500/60">{selectedBlock.categoria}</p>
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter text-white">
                    {selectedBlock.pregunta}
                  </h2>
                </div>

                {revealAnswer ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-10"
                  >
                    <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-2 h-full ${getLevelColorClass(selectedBlock.nivel)}`}></div>
                      <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-6 ${getLevelTextClass(selectedBlock.nivel)}`}>Respuesta Técnica Validada</p>
                      <p className="text-2xl font-black text-white mb-6 leading-relaxed">{selectedBlock.respuesta}</p>
                      <p className="text-sm italic text-white/50 leading-relaxed">
                        {selectedBlock.explicacion}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <button 
                        onClick={() => { 
                          setScore(s => ({...s, correct: s.correct+1})); 
                          setAnsweredIds(prev => new Set(prev).add(selectedBlock.numero)); 
                          setSelectedBlock(null); 
                          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#f7be1d'] }); 
                        }} 
                        className="py-6 bg-emerald-500 text-slate-950 font-black rounded-2xl shadow-lg hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                      >
                        <CheckCircle2 size={24} /> MARCACIÓN CORRECTA
                      </button>
                      <button 
                        onClick={() => { 
                          setScore(s => ({...s, incorrect: s.incorrect+1})); 
                          setAnsweredIds(prev => new Set(prev).add(selectedBlock.numero)); 
                          setSelectedBlock(null); 
                        }} 
                        className="py-6 bg-rose-500 text-slate-950 font-black rounded-2xl shadow-lg hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                      >
                        <XCircle size={24} /> MARCACIÓN INCORRECTA
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setRevealAnswer(true)} 
                    className="w-full py-12 bg-white/5 border-2 border-dashed border-white/20 rounded-[2.5rem] text-white/40 font-black uppercase tracking-[0.5em] hover:bg-white/10 hover:border-emerald-500/40 hover:text-emerald-500 transition-all flex items-center justify-center gap-6 group"
                  >
                    <Zap className="text-emerald-500 group-hover:scale-125 transition-transform duration-500" size={28} /> 
                    REVELAR PROTOCOLO DE RESPUESTA
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
