import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ArrowRight, ShieldAlert, CheckCircle2, XCircle, Info, HelpCircle, Hand, PhoneCall, Shield, AlertTriangle, ChevronRight, RefreshCw, LogIn } from 'lucide-react';
import { PARE_SHEETS_URL, PARE_FALLBACK } from '../../constants';
import { cn } from '../../lib/utils';

export const PareYPidaAyudaGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish: () => void }) => {
  const [nodes, setNodes] = useState<any>(PARE_FALLBACK);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentNodeId && (nodes[currentNodeId]?.es_final === true || nodes[currentNodeId]?.es_final === "SI")) {
      const current = nodes[currentNodeId];
      if (current.tipo_final === 'correcto') {
        onGameOver(100);
      } else if (current.tipo_final === 'critico') {
        onGameOver(0);
      } else {
        onGameOver(50);
      }
    }
  }, [currentNodeId, nodes, onGameOver]);

  useEffect(() => {
    setLoading(true);
    fetch(PARE_SHEETS_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.text();
      })
      .then(csv => {
        const lines = csv.split('\n').filter(l => l.trim().length > 0).slice(1);
        const parsed: any = {};
        
        lines.forEach(line => {
          // Robust CSV splitting
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 3) return;
          
          const id = cols[0];
          const situacion = cols[1];
          const esFinal = cols[2].toUpperCase() === 'SI';
          
          if (esFinal) {
            parsed[id] = {
              id,
              situacion,
              es_final: true,
              tipo_final: (cols[3] || 'incidente').toLowerCase(),
              aprendizaje: cols[4] || 'Sin aprendizaje registrado.'
            };
          } else {
            const opciones = [];
            // Handle up to 3 options
            if (cols[3] && cols[4]) opciones.push({ texto: cols[3], siguiente: cols[4] });
            if (cols[5] && cols[6]) opciones.push({ texto: cols[5], siguiente: cols[6] });
            if (cols[7] && cols[8]) opciones.push({ texto: cols[7], siguiente: cols[8] });
            
            parsed[id] = {
              id,
              situacion,
              historia: cols[9] || `Escenario: ${id}`,
              es_final: false,
              opciones
            };
          }
        });

        if (Object.keys(parsed).length > 0) {
          setNodes(parsed);
          setError(null);
        } else {
          console.warn("Parsed data is empty, using fallback.");
          setNodes(PARE_FALLBACK);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading Pare data:", err);
        setError("No se pudo cargar la base de datos de seguridad. Usando protocolos de respaldo.");
        setNodes(PARE_FALLBACK);
        setLoading(false);
      });
  }, []);

  const startStory = (id: string) => {
    setCurrentNodeId(id);
    setHistory([id]);
  };

  const handleOption = (nextId: string) => {
    setCurrentNodeId(nextId);
    setHistory(prev => [...prev, nextId]);
  };

  const restart = () => {
    setCurrentNodeId(null);
    setHistory([]);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center obsidian-table relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent animate-pulse" />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tighter">Sincronizando Protocolos...</h2>
          <p className="text-xs font-headline text-rose-500/50 uppercase tracking-widest mt-2">Accediendo a la base de datos EHS</p>
        </div>
      </div>
    );
  }

  if (!currentNodeId) {
    const startNodes = Object.values(nodes).filter((n: any) => n.id && n.id.startsWith('inicio_'));
    return (
      <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="glass-panel-heavy w-full max-w-2xl p-8 md:p-12 rounded-3xl border border-rose-500/30 text-center hard-shadow relative z-10"
        >
          <div className="relative inline-block mb-8">
            <ShieldAlert className="text-rose-500 animate-pulse" size={100} />
            <div className="absolute -inset-4 bg-rose-500/20 blur-2xl rounded-full -z-10" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-headline font-black mb-2 tracking-tighter uppercase leading-none">
            PARE <span className="text-rose-500">Y PIDA</span> AYUDA
          </h2>
          <div className="h-1 w-24 bg-rose-500 mx-auto mb-6" />
          
          <p className="text-sm md:text-base opacity-70 font-body mb-10 max-w-md mx-auto italic leading-relaxed">
            "Ninguna tarea es tan importante ni tan urgente que no pueda hacerse con seguridad."
          </p>

          {error && (
            <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3 text-amber-500 text-xs text-left">
              <Info size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="grid gap-4">
            {startNodes.length > 0 ? startNodes.map((node: any) => {
              // Fix for "NO" buttons: if historia is "NO" or empty, use a better label
              const displayTitle = (node.historia && node.historia !== 'NO') 
                ? node.historia 
                : (node.situacion && node.situacion.length > 40 ? node.situacion.substring(0, 40) + '...' : node.situacion || `Escenario ${node.id}`);

              return (
                <button 
                  key={node.id} 
                  onClick={() => startStory(node.id)} 
                  className="group relative overflow-hidden btn-industrial-red w-full py-6 text-white font-headline font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <span className="relative z-10">{displayTitle}</span>
                  <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              );
            }) : (
              <div className="p-8 border border-white/10 rounded-xl bg-white/5">
                <p className="text-sm opacity-50">No hay escenarios disponibles en este momento.</p>
              </div>
            )}
            
            <button 
              onClick={onExit} 
              className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center justify-center gap-2 transition-opacity mt-6 group"
            >
              <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={12} /> VOLVER AL PANEL DE CONTROL
            </button>
          </div>
        </motion.div>

        <div className="absolute bottom-8 right-8 flex items-center gap-4 opacity-20">
          <div className="text-right">
            <p className="text-[10px] font-headline font-black uppercase tracking-widest">EHS Protocol</p>
            <p className="text-[8px] font-mono">SEC-ID: 1987480223</p>
          </div>
          <Shield size={32} />
        </div>
      </div>
    );
  }

  const current = nodes[currentNodeId];
  const isFinal = current.es_final === true || current.es_final === "SI";

  return (
    <div className="h-screen flex flex-col p-4 md:p-8 obsidian-table relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      
      <header className="flex justify-between items-center mb-8 md:mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-12 h-12 bg-rose-500 flex items-center justify-center rounded-sm hard-shadow"
          >
            <ShieldAlert className="text-white" size={24} />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-none">
              PARE <span className="text-rose-500">Y PIDA</span> AYUDA
            </h1>
            <p className="text-[10px] font-headline uppercase tracking-widest opacity-50">
              {current.historia || 'Simulación de Riesgo Crítico'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className={cn(
              "hidden md:flex items-center gap-2 px-4 py-2 rounded-sm border font-headline font-black text-[10px] uppercase tracking-widest transition-all",
              showHelp ? "bg-rose-500 text-black border-rose-500" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            )}
          >
            <PhoneCall size={14} />
            {showHelp ? 'Cerrar Directorio' : 'Directorio de Ayuda'}
          </button>
          
          <button 
            onClick={onExit} 
            className="p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-rose-500/20 hover:border-rose-500/50 transition-all group"
          >
            <LogOut className="group-hover:text-rose-500 transition-colors" size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {showHelp ? (
            <motion.div 
              key="help" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="w-full max-w-2xl glass-panel-heavy p-8 rounded-3xl border border-rose-500/30"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center">
                  <PhoneCall className="text-rose-500" size={24} />
                </div>
                <h3 className="text-2xl font-headline font-black uppercase tracking-tighter">DIRECTORIO DE EMERGENCIA</h3>
              </div>
              
              <div className="grid gap-4">
                {[
                  { n: "Supervisor de Turno", t: "Línea Directa 101" },
                  { n: "Brigada de Emergencia", t: "Línea Directa 105" },
                  { n: "Servicio Médico", t: "Línea Directa 107" },
                  { n: "Centro de Control", t: "Línea Directa 100" }
                ].map((c, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-[8px] font-headline uppercase tracking-widest opacity-50">Contacto</p>
                      <p className="text-sm font-headline font-black uppercase tracking-tight">{c.n}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-headline uppercase tracking-widest opacity-50">Frecuencia</p>
                      <p className="text-sm font-mono font-black text-rose-500">{c.t}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setShowHelp(false)}
                className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-xl font-headline font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
              >
                Volver a la Simulación
              </button>
            </motion.div>
          ) : !isFinal ? (
            <motion.div 
              key={currentNodeId} 
              initial={{ x: 20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: -20, opacity: 0 }} 
              className="w-full max-w-3xl"
            >
              <div className="glass-panel-heavy p-8 md:p-12 rounded-[2rem] border border-white/10 mb-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
                <div className="absolute top-4 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShieldAlert size={140} />
                </div>
                <p className="text-3xl md:text-5xl font-headline font-black leading-tight text-white uppercase tracking-tighter relative z-10">
                  {current.situacion}
                </p>
              </div>

              <div className="grid gap-4">
                {current.opciones && current.opciones.map((opt: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleOption(opt.siguiente)}
                    className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-rose-500 hover:bg-rose-500/10 transition-all text-left relative overflow-hidden active:scale-95"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/0 group-hover:bg-rose-500 transition-all" />
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-headline font-black group-hover:bg-rose-500 group-hover:text-black transition-colors shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-base md:text-lg font-headline font-black uppercase tracking-widest leading-tight">{opt.texto}</span>
                    </div>
                    <ChevronRight className="text-rose-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" size={28} />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="final" 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="w-full max-w-2xl text-center"
            >
              <motion.div 
                initial={{ rotate: -10, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                className={cn(
                  "w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 shadow-2xl relative",
                  current.tipo_final === 'correcto' ? 'bg-emerald-500 text-black shadow-emerald-500/40' : 
                  current.tipo_final === 'critico' ? 'bg-rose-600 text-white shadow-rose-600/40' : 
                  'bg-amber-500 text-black shadow-amber-500/40'
                )}
              >
                {current.tipo_final === 'correcto' ? <CheckCircle2 size={64} /> : 
                 current.tipo_final === 'critico' ? <ShieldAlert size={64} /> : 
                 <Info size={64} />}
                
                <div className="absolute -inset-4 border border-current opacity-20 rounded-full animate-ping" />
              </motion.div>
              
              <h3 className={cn(
                "text-4xl md:text-6xl font-headline font-black mb-6 uppercase tracking-tighter",
                current.tipo_final === 'correcto' ? 'text-emerald-400' : 
                current.tipo_final === 'critico' ? 'text-rose-500' : 
                'text-amber-400'
              )}>
                {current.tipo_final === 'correcto' ? '¡OBJETIVO CUMPLIDO!' : 
                 current.tipo_final === 'critico' ? 'ACCIDENTE CRÍTICO' : 
                 'INCIDENTE REPORTADO'}
              </h3>
              
              <div className="glass-panel-heavy p-8 md:p-12 rounded-[2.5rem] border border-white/10 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <p className="text-xl md:text-2xl font-body leading-relaxed mb-8 text-white/90 italic">
                  "{current.situacion}"
                </p>
                
                <div className="flex items-start gap-6 text-left bg-white/5 p-8 rounded-3xl border border-white/10 relative">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0">
                    <HelpCircle className="text-secondary" size={28} />
                  </div>
                  <div>
                    <h4 className="font-headline font-black uppercase text-[10px] text-secondary mb-2 tracking-[0.3em]">Lección Aprendida</h4>
                    <p className="text-base font-body opacity-80 leading-relaxed">{current.aprendizaje}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={restart} 
                  className="btn-industrial-orange px-12 py-5 text-black font-headline font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                >
                  <RefreshCw size={18} /> INTENTAR OTRA HISTORIA
                </button>
                <button 
                  onClick={() => onFinish()} 
                  className="px-12 py-5 bg-emerald-500 text-slate-950 rounded-sm font-headline font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  FINALIZAR Y REGISTRAR
                </button>
                <button 
                  onClick={onExit} 
                  className="px-12 py-5 bg-white/5 border border-white/10 rounded-sm font-headline font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
                >
                  SALIR AL MENÚ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[8px] font-headline uppercase tracking-widest opacity-30">Protocolo de Seguridad Activo</span>
          </div>
          <div className="hidden md:block h-4 w-px bg-white/10" />
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[8px] font-mono opacity-20 uppercase tracking-widest">
              Nodos Explorados: {history.length} // Latencia: 24ms
            </span>
          </div>
        </div>
        <div className="text-[8px] font-mono opacity-20 uppercase tracking-[0.5em]">
          Stop & Help Protocol v2.0 // Simulación de Seguridad Industrial
        </div>
      </footer>
    </div>
  );
};
