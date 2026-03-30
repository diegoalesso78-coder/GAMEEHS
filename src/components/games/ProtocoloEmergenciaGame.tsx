import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, AlertTriangle, Phone, Users, DoorClosed, Zap, MapPin, XCircle, Shield, Heart, Thermometer, Clock, LogOut as LogOutIcon, Search, Wind, Layers, FileText, CheckCircle2, Timer, AlertCircle, Activity, Info, HelpCircle, Eye, Hand, Flame, Skull, HardHat, Construction, Truck, Car, Stethoscope, Briefcase, Bell, Settings, Trash2, Edit, Save, Plus, Minus, RefreshCw, Play, Pause, Square, Circle, Triangle, Hexagon, Octagon } from 'lucide-react';
import { PROTOCOLO_SHEETS_URL, PROTOCOLO_FALLBACK } from '../../constants';

const IconMap: { [key: string]: any } = {
  AlertTriangle, Phone, Users, DoorClosed, Zap, MapPin, XCircle, Shield, Heart, Thermometer, Clock, LogOut: LogOutIcon, Search, Wind, Layers, FileText, AlertCircle, Activity, Info, HelpCircle, CheckCircle2, Timer, Eye, Hand, Flame, Skull, HardHat, Construction, Truck, Car, Stethoscope, Briefcase, Bell, Settings, Trash2, Edit, Save, Plus, Minus, RefreshCw, Play, Pause, Square, Circle, Triangle, Hexagon, Octagon
};

const getIcon = (iconName: string) => {
  if (!iconName) return AlertTriangle;
  const Icon = IconMap[iconName];
  if (Icon) return Icon;
  
  const entry = Object.entries(IconMap).find(([k]) => k.toLowerCase() === iconName.toLowerCase());
  return entry ? entry[1] : AlertTriangle;
};

export const ProtocoloEmergenciaGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish: () => void }) => {
  const [protocols, setProtocols] = useState<any>(PROTOCOLO_FALLBACK);
  const [gameState, setGameState] = useState<{
    selectedProtocol: string | null;
    timeLeft: number | null;
    isGameOver: boolean;
    isSuccess: boolean;
    userSteps: any[];
    shuffledSteps: any[];
    lives: number;
    showInstructions: boolean;
    lastErrorStepId: number | null;
  }>({
    selectedProtocol: null,
    timeLeft: null,
    isGameOver: false,
    isSuccess: false,
    userSteps: [],
    shuffledSteps: [],
    lives: 3,
    showInstructions: true,
    lastErrorStepId: null
  });

  const { selectedProtocol, timeLeft, isGameOver, isSuccess, userSteps, shuffledSteps, lives, showInstructions, lastErrorStepId } = gameState;

  useEffect(() => {
    fetch(PROTOCOLO_SHEETS_URL)
      .then(r => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.text();
      })
      .then(csv => {
        const lines = csv.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) return;

        const delimiter = lines[0].includes(';') ? ';' : ',';
        const headers = lines[0].split(delimiter).map(h => h.toLowerCase().trim().replace(/^"|"$/g, ''));
        
        // Map headers to indices with better priority and exclusivity
        const colMap = {
          categoria: headers.findIndex(h => h === 'categoria' || h === 'emergencia' || h === 'protocolo' || h.includes('cat') || h.includes('emergencia')),
          tiempo: headers.findIndex(h => h === 'tiempo' || h === 'segundos' || h.includes('tiem') || h.includes('seg')),
          id: headers.findIndex(h => h === 'id' || h === 'orden' || h === 'nro' || h === 'num' || h === 'n°' || h === 'n'),
          paso: headers.findIndex(h => h === 'paso' || h === 'accion' || h === 'descripcion' || h.includes('desc') || h.includes('accion') || h.includes('texto')),
          detalle: headers.findIndex(h => h === 'detalle' || h === 'info' || h.includes('det') || h.includes('info') || h.includes('explic')),
          icono: headers.findIndex(h => h === 'icono' || h === 'icon' || h.includes('ico') || h.includes('img') || h.includes('visual'))
        };

        // Fallbacks for ID if not found by exact match
        if (colMap.id === -1) {
          colMap.id = headers.findIndex(h => h.includes('id') || h.includes('orden') || h.includes('num'));
        }

        // If id and paso are the same, it's likely a mistake. Prioritize paso as text if it matches 'paso' exactly.
        if (colMap.id !== -1 && colMap.id === colMap.paso) {
          // If we have another potential ID column, use it
          const alternativeId = headers.findIndex((h, i) => i !== colMap.id && (h.includes('id') || h.includes('orden') || h.includes('num')));
          if (alternativeId !== -1) {
            colMap.id = alternativeId;
          } else {
            // If not, maybe 'paso' IS the ID and we need to find another column for the text
            const alternativePaso = headers.findIndex((h, i) => i !== colMap.id && (h.includes('desc') || h.includes('accion') || h.includes('texto')));
            if (alternativePaso !== -1) {
              colMap.paso = alternativePaso;
            }
          }
        }

        // Fallback to defaults if headers still not found
        const idx = {
          categoria: colMap.categoria !== -1 ? colMap.categoria : 0,
          tiempo: colMap.tiempo !== -1 ? colMap.tiempo : 1,
          id: colMap.id !== -1 ? colMap.id : 2,
          paso: colMap.paso !== -1 ? colMap.paso : 3,
          detalle: colMap.detalle !== -1 ? colMap.detalle : 4,
          icono: colMap.icono !== -1 ? colMap.icono : 5
        };

        const parsed: any = {};
        lines.slice(1).forEach(line => {
          let cols: string[] = [];
          if (delimiter === ',') {
            cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          } else {
            cols = line.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          }

          const categoria = cols[idx.categoria];
          if (!categoria) return;

          const tiempo = parseInt(cols[idx.tiempo]) || 90;
          const paso = {
            id: parseInt(cols[idx.id]),
            paso: cols[idx.paso],
            detalle: cols[idx.detalle] || '',
            icono: cols[idx.icono] || 'AlertTriangle'
          };
          
          if (!parsed[categoria]) {
            parsed[categoria] = { tiempo, pasos: [] };
          }
          if (!isNaN(paso.id)) {
            parsed[categoria].pasos.push(paso);
          }
        });
        
        const finalParsed: any = {};
        Object.keys(parsed).forEach(cat => {
          if (parsed[cat].pasos.length > 0) {
            parsed[cat].pasos.sort((a: any, b: any) => a.id - b.id);
            finalParsed[cat] = parsed[cat];
          }
        });
        
        if (Object.keys(finalParsed).length > 0) {
          setProtocols(finalParsed);
        }
      })
      .catch(err => console.warn("Error loading Protocolo data:", err));
  }, []);

  useEffect(() => {
    let timer: any;
    if (selectedProtocol && timeLeft !== null && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft !== null ? prev.timeLeft - 1 : 0
        }));
      }, 1000);
    } else if (selectedProtocol && timeLeft === 0 && !isGameOver) {
      endGame(false);
    }
    return () => clearInterval(timer);
  }, [selectedProtocol, timeLeft, isGameOver]);

  const startProtocol = (name: string) => {
    if (!protocols[name]) return;
    
    const protocolData = protocols[name];
    setGameState({
      selectedProtocol: name,
      timeLeft: protocolData.tiempo || 90,
      isGameOver: false,
      isSuccess: false,
      userSteps: [],
      shuffledSteps: [...protocolData.pasos].sort(() => Math.random() - 0.5),
      lives: 3,
      showInstructions: false,
      lastErrorStepId: null
    });
  };

  const addStep = (step: any) => {
    if (isGameOver) return;
    if (userSteps.find(s => s.id === step.id)) return;
    
    const correctSteps = protocols[selectedProtocol!].pasos;
    const nextStepIndex = userSteps.length;
    const isCorrect = step.id === correctSteps[nextStepIndex].id;
    
    if (!isCorrect) {
      setGameState(prev => ({ 
        ...prev, 
        lives: prev.lives - 1,
        lastErrorStepId: step.id
      }));
      
      // Clear error highlight after a delay
      setTimeout(() => {
        setGameState(prev => ({ ...prev, lastErrorStepId: null }));
      }, 1000);

      if (lives <= 1) {
        endGame(false);
      }
    } else {
      const nextSteps = [...userSteps, step];
      if (nextSteps.length === correctSteps.length) {
        endGame(true);
      } else {
        setGameState(prev => ({ ...prev, userSteps: nextSteps, lastErrorStepId: null }));
      }
    }
  };

  const endGame = (success: boolean) => {
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      isSuccess: success
    }));
    onGameOver(success ? 100 : 0);
  };

  if (!selectedProtocol) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 obsidian-table relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel-heavy w-full max-w-2xl p-6 md:p-12 rounded-2xl border border-amber-500/30 text-center hard-shadow relative z-10 my-auto">
          <AlertTriangle className="mx-auto text-amber-500 mb-6 md:mb-8 w-12 h-12 md:w-20 md:h-20" />
          <h2 className="text-3xl md:text-5xl font-headline font-black mb-4 tracking-tighter uppercase leading-tight">PROTOCOLOS DE <span className="text-amber-500">EMERGENCIA</span></h2>
          <p className="text-xs md:text-sm opacity-70 font-body mb-8 md:mb-10 max-w-md mx-auto italic">¿Sabrías qué hacer en los primeros segundos de una crisis? El orden salva vidas.</p>
          
          <div className="grid gap-3 md:gap-4">
            {Object.keys(protocols).map(name => (
              <button key={name} onClick={() => startProtocol(name)} className="btn-industrial-orange w-full py-4 md:py-5 text-black font-headline font-black uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-3">
                {name} <Timer size={18} />
              </button>
            ))}
            <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center justify-center gap-2 transition-opacity mt-4">
              VOLVER AL PANEL
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const protocol = protocols[selectedProtocol];
  const availableSteps = shuffledSteps;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 obsidian-table relative overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
      
      <header className="flex justify-between items-center mb-4 md:mb-8 relative z-10 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 flex items-center justify-center rounded-sm hard-shadow">
            <AlertTriangle className="text-black w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-headline font-black tracking-tighter uppercase leading-none">PROTOCOLO: <span className="text-amber-500">{selectedProtocol}</span></h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
              <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-50">Ordena los pasos correctamente</p>
              <div className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full ${timeLeft !== null && timeLeft < 20 ? 'bg-rose-500 animate-pulse' : 'bg-white/10'} transition-colors`}>
                <Timer size={10} className="md:w-3 md:h-3" />
                <span className="text-[10px] md:text-xs font-mono font-bold">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart 
                    key={i} 
                    size={12} 
                    className={i < lives ? "text-rose-500 fill-rose-500" : "text-white/20"} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <button onClick={onExit} className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-rose-500/20 hover:border-rose-500/50 transition-all group">
          <LogOut className="group-hover:text-rose-500 transition-colors w-5 h-5 md:w-6 md:h-6" />
        </button>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10 max-w-6xl mx-auto w-full">
        {/* Sequence Area */}
        <div className="flex flex-col h-[300px] md:h-full overflow-hidden">
          <h3 className="text-[10px] font-headline font-black uppercase tracking-widest opacity-50 mb-2 md:mb-4">Tu Secuencia</h3>
          <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-2 md:gap-3">
            {userSteps.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-4 md:p-8">
                <Layers size={32} className="md:w-12 md:h-12 mb-2 md:mb-4" />
                <p className="text-[10px] md:text-sm font-headline uppercase tracking-widest leading-tight">Selecciona los pasos en el orden correcto</p>
              </div>
            )}
            {userSteps.map((step, i) => {
              const Icon = getIcon(step.icono);
              return (
                <motion.div 
                  key={i} 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl relative overflow-hidden shrink-0"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-headline font-black text-[10px] md:text-xs">
                    {i + 1}
                  </div>
                  <Icon className="text-emerald-500 shrink-0 md:w-5 md:h-5" size={16} />
                  <div className="min-w-0">
                    <h4 className="font-headline font-black uppercase text-[10px] md:text-xs leading-none mb-1 truncate">{step.paso}</h4>
                    <p className="text-[8px] md:text-[10px] opacity-60 leading-tight line-clamp-1 md:line-clamp-none">{step.detalle}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Options Area */}
        <div className="flex flex-col h-[400px] md:h-full overflow-hidden">
          <h3 className="text-[10px] font-headline font-black uppercase tracking-widest opacity-50 mb-2 md:mb-4">Opciones Disponibles</h3>
          <div className="grid grid-cols-1 gap-2 md:gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {availableSteps.map((step, i) => {
              const isSelected = userSteps.find(s => s.id === step.id);
              const isError = lastErrorStepId === step.id;
              const Icon = getIcon(step.icono);
              
              return (
                <motion.button
                  key={i}
                  disabled={isSelected || isGameOver}
                  onClick={() => addStep(step)}
                  animate={isError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all text-left relative overflow-hidden shrink-0 ${
                    isSelected 
                      ? 'opacity-20 grayscale border-white/5' 
                      : isError 
                        ? 'bg-rose-500/20 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                        : 'bg-white/5 border-white/10 hover:border-amber-500 hover:bg-amber-500/5'
                  }`}
                >
                  {isError && (
                    <div className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none" />
                  )}
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isError ? 'bg-rose-500 text-white' : 'bg-white/5 text-white/50'}`}>
                    <Icon size={16} className="md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] md:text-xs font-headline font-black uppercase tracking-widest truncate">{step.paso}</p>
                  </div>
                  {isError && <XCircle size={14} className="text-rose-500 shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Instructions Overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="glass-panel-heavy w-full max-w-lg p-10 rounded-3xl border border-amber-500/30 text-center"
            >
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black shadow-lg shadow-amber-500/20">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-3xl font-headline font-black mb-4 uppercase tracking-tighter">¿CÓMO JUGAR?</h2>
              <div className="space-y-4 text-left mb-8">
                <div className="flex gap-4 items-start p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-xs shrink-0">1</div>
                  <p className="text-xs text-white/70 leading-relaxed">Analiza los pasos de emergencia presentados en desorden.</p>
                </div>
                <div className="flex gap-4 items-start p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-xs shrink-0">2</div>
                  <p className="text-xs text-white/70 leading-relaxed">Selecciona cada paso en el <b>orden secuencial correcto</b> para construir el protocolo.</p>
                </div>
                <div className="flex gap-4 items-start p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-xs shrink-0">3</div>
                  <p className="text-xs text-white/70 leading-relaxed">Tienes <b>3 vidas</b>. Un error te costará una vida. Si el tiempo se agota o pierdes tus vidas, la misión fallará.</p>
                </div>
              </div>
              <button 
                onClick={() => setGameState(prev => ({ ...prev, showInstructions: false }))}
                className="btn-industrial-orange w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs"
              >
                ENTENDIDO, COMENZAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel-heavy w-full max-w-md p-10 rounded-3xl border-2 border-white/10 text-center shadow-2xl">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}>
                {isSuccess ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>
              <h2 className={`text-4xl font-headline font-black mb-2 uppercase tracking-tighter ${isSuccess ? 'text-emerald-400' : 'text-rose-500'}`}>
                {isSuccess ? '¡PROTOCOLO EXITOSO!' : 'FALLO EN EL PROTOCOLO'}
              </h2>
              <p className="text-sm font-body opacity-70 mb-8">
                {isSuccess 
                  ? 'Has demostrado conocer los pasos vitales para manejar esta emergencia de forma segura.' 
                  : timeLeft === 0 ? 'Se agotó el tiempo. En una emergencia real, cada segundo cuenta.' : 'El orden de los pasos fue incorrecto. Un error en la secuencia puede agravar la crisis.'}
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => startProtocol(selectedProtocol)} className="btn-industrial-orange w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs">REINTENTAR</button>
                <button onClick={() => onFinish()} className="w-full py-4 bg-emerald-500 text-slate-950 rounded-xl font-headline font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">FINALIZAR Y REGISTRAR</button>
                <button onClick={() => setGameState({
                  selectedProtocol: null,
                  timeLeft: null,
                  isGameOver: false,
                  isSuccess: false,
                  userSteps: [],
                  shuffledSteps: [],
                  lives: 3,
                  showInstructions: true,
                  lastErrorStepId: null
                })} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-headline font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">CAMBIAR PROTOCOLO</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-8 text-[8px] font-mono opacity-20 uppercase tracking-[0.5em]">
        Emergency Response Protocol v1.5 // Simulación de Crisis
      </div>
    </div>
  );
};
