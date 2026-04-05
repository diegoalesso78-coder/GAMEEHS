
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Trophy, 
  Info, 
  Zap, 
  DollarSign, 
  Settings,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HIERARCHY_FALLBACK, HIERARCHY_SHEETS_URL } from '../../constants';
import { PlayerData } from '../../types';

interface HierarchyGameProps {
  playerData: PlayerData;
  onFinish: (score: number) => void;
}

interface Control {
  nivel: number;
  tipo: string;
  control: string;
  emoji: string;
  costo: string;
  dificultad: string;
  reflexion: string;
}

interface Scenario {
  id: number;
  riesgo: string;
  emoji_riesgo: string;
  sector: string;
  controles: Control[];
}

const HIERARCHY_LEVELS = [
  { level: 1, name: 'ELIMINACIÓN', color: 'bg-rose-600', desc: 'Eliminar el riesgo de raíz' },
  { level: 2, name: 'SUSTITUCIÓN', color: 'bg-orange-600', desc: 'Reemplazar por algo menos peligroso' },
  { level: 3, name: 'INGENIERÍA', color: 'bg-amber-600', desc: 'Aislar a las personas del peligro' },
  { level: 4, name: 'ADMINISTRATIVO', color: 'bg-blue-600', desc: 'Cambiar la forma en que se trabaja' },
  { level: 5, name: 'EPP', color: 'bg-emerald-600', desc: 'Proteger al trabajador con equipo' }
];

export const HierarchyGame: React.FC<HierarchyGameProps> = ({ playerData, onFinish }) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [shuffledControls, setShuffledControls] = useState<Control[]>([]);
  const [placedControls, setPlacedControls] = useState<(Control | null)[]>([null, null, null, null, null]);
  const [selectedControlIndex, setSelectedControlIndex] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'validating' | 'finished'>('playing');
  const [results, setResults] = useState<boolean[]>([]);
  const [showReflections, setShowReflections] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${HIERARCHY_SHEETS_URL}&t=${Date.now()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const csvText = await response.text();
        
        const rows = csvText.split(/\r?\n/).filter(row => row.trim()).map(row => {
          const separator = row.includes(';') ? ';' : ',';
          return row.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
        });

        if (rows.length <= 1) throw new Error('No data in CSV');

        const headers = rows[0].map(h => h.toUpperCase());
        const dataRows = rows.slice(1);

        // Group by ID_RIESGO
        const scenariosMap: Record<string, Scenario> = {};
        
        dataRows.forEach(row => {
          const id = row[headers.indexOf('ID_RIESGO')];
          if (!scenariosMap[id]) {
            scenariosMap[id] = {
              id: parseInt(id),
              riesgo: row[headers.indexOf('RIESGO')],
              emoji_riesgo: row[headers.indexOf('EMOJI_RIESGO')],
              sector: row[headers.indexOf('SECTOR')],
              controles: []
            };
          }
          
          scenariosMap[id].controles.push({
            nivel: parseInt(row[headers.indexOf('NIVEL')]),
            tipo: row[headers.indexOf('TIPO_CONTROL')],
            control: row[headers.indexOf('CONTROL')],
            emoji: row[headers.indexOf('EMOJI_CONTROL')],
            costo: row[headers.indexOf('COSTO')],
            dificultad: row[headers.indexOf('DIFICULTAD')],
            reflexion: row[headers.indexOf('REFLEXION')]
          });
        });

        const scenarios = Object.values(scenariosMap);
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        setScenario(randomScenario);
        setShuffledControls([...randomScenario.controles].sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error('Error fetching hierarchy data:', error);
        const randomScenario = HIERARCHY_FALLBACK[Math.floor(Math.random() * HIERARCHY_FALLBACK.length)];
        setScenario(randomScenario);
        setShuffledControls([...randomScenario.controles].sort(() => Math.random() - 0.5));
      } finally {
        setLoading(false);
        setStartTime(Date.now());
      }
    };

    fetchData();
  }, []);

  const handleSelectControl = (index: number) => {
    if (gameStatus !== 'playing') return;
    setSelectedControlIndex(index);
  };

  const handlePlaceControl = (slotIndex: number) => {
    if (gameStatus !== 'playing' || selectedControlIndex === null) return;

    const newPlaced = [...placedControls];
    const controlToPlace = shuffledControls[selectedControlIndex];

    // If slot already has a control, put it back in the pool
    if (newPlaced[slotIndex]) {
      const existing = newPlaced[slotIndex] as Control;
      setShuffledControls(prev => [...prev, existing]);
    }

    newPlaced[slotIndex] = controlToPlace;
    setPlacedControls(newPlaced);

    // Remove from shuffled pool
    setShuffledControls(prev => prev.filter((_, i) => i !== selectedControlIndex));
    setSelectedControlIndex(null);
  };

  const handleRemoveControl = (slotIndex: number) => {
    if (gameStatus !== 'playing') return;
    const control = placedControls[slotIndex];
    if (!control) return;

    const newPlaced = [...placedControls];
    newPlaced[slotIndex] = null;
    setPlacedControls(newPlaced);
    setShuffledControls(prev => [...prev, control]);
  };

  const handleValidate = () => {
    if (placedControls.some(c => c === null)) return;

    const newResults = placedControls.map((control, index) => {
      return control?.nivel === index + 1;
    });

    setResults(newResults);
    setGameStatus('validating');

    const correctCount = newResults.filter(r => r).length;
    const timeBonus = Math.max(0, 1000 - Math.floor((Date.now() - startTime) / 1000) * 10);
    const finalScore = (correctCount * 200) + (correctCount === 5 ? timeBonus : 0);
    setScore(finalScore);

    if (correctCount === 5) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    }
  };

  const handleFinish = () => {
    onFinish(score);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest animate-pulse">Cargando Escenarios...</p>
        </div>
      </div>
    );
  }

  if (!scenario) return null;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white">JERARQUÍA DE CONTROL</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">Misión de Seguridad</span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">Sector: {scenario.sector}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-right">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Puntaje</div>
              <div className="text-xl font-black text-emerald-500">{score}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Nivel</div>
              <div className="text-xl font-black text-indigo-400">EXPERTO</div>
            </div>
          </div>
        </div>

        {/* Scenario Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <AlertTriangle className="w-32 h-32 text-indigo-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{scenario.emoji_riesgo}</span>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">ESCENARIO: {scenario.riesgo}</h3>
            </div>
            <p className="text-indigo-200/70 text-sm leading-relaxed max-w-2xl">
              Identificamos un riesgo crítico en el sector de {scenario.sector}. Tu misión es construir la pirámide de control colocando cada medida en su nivel jerárquico correspondiente.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* The Pyramid Slots */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> Pirámide de Seguridad
              </h4>
              <span className="text-[10px] font-mono text-white/30">Más efectivo ↑</span>
            </div>

            {HIERARCHY_LEVELS.map((level, idx) => (
              <motion.div
                key={level.level}
                onClick={() => handlePlaceControl(idx)}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  gameStatus === 'playing' && selectedControlIndex !== null ? 'hover:scale-[1.02]' : ''
                }`}
              >
                <div className={`flex items-stretch rounded-2xl border min-h-[80px] overflow-hidden transition-all ${
                  placedControls[idx] 
                    ? (gameStatus === 'validating' 
                        ? (results[idx] ? 'border-emerald-500 bg-emerald-500/10' : 'border-rose-500 bg-rose-500/10')
                        : 'border-white/20 bg-white/5')
                    : (gameStatus === 'playing' && selectedControlIndex !== null ? 'border-indigo-500/50 bg-indigo-500/5 border-dashed' : 'border-white/5 bg-white/2')
                }`}>
                  {/* Level Badge */}
                  <div className={`w-16 flex flex-col items-center justify-center text-white/90 ${level.color} shadow-lg`}>
                    <span className="text-xs font-black">N{level.level}</span>
                    <div className="h-px w-6 bg-white/30 my-1" />
                    <span className="text-[8px] font-bold rotate-[-90deg] whitespace-nowrap uppercase tracking-tighter">
                      {level.name.split(' ')[0]}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-4 flex items-center justify-between gap-4">
                    {placedControls[idx] ? (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{placedControls[idx]?.emoji}</span>
                          <div>
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-0.5">{level.name}</div>
                            <div className="text-sm font-bold text-white leading-tight">{placedControls[idx]?.control}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {gameStatus === 'validating' && (
                            results[idx] ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />
                          )}
                          {gameStatus === 'playing' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRemoveControl(idx); }}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">{level.name}</span>
                        <span className="text-[10px] text-white/10 italic">{level.desc}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reflection Tooltip (only when validating) */}
                <AnimatePresence>
                  {gameStatus === 'validating' && placedControls[idx] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 px-4 py-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-white/60 italic leading-relaxed"
                    >
                      <div className="flex items-center gap-2 mb-1 not-italic">
                        <Info className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Reflexión Técnica</span>
                      </div>
                      "{placedControls[idx]?.reflexion}"
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Controls Pool */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-3 h-3" /> Medidas Disponibles
              </h4>
              <span className="text-[10px] font-mono text-white/30">{shuffledControls.length} restantes</span>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {shuffledControls.map((control, idx) => (
                  <motion.div
                    key={control.control}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleSelectControl(idx)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      selectedControlIndex === idx 
                        ? 'bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1">{control.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-bold leading-tight mb-2 ${selectedControlIndex === idx ? 'text-slate-950' : 'text-white'}`}>
                          {control.control}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                            selectedControlIndex === idx ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-white/40'
                          }`}>
                            <DollarSign className="w-2 h-2" /> Costo: {control.costo}
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                            selectedControlIndex === idx ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-white/40'
                          }`}>
                            <Zap className="w-2 h-2" /> {control.dificultad}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {shuffledControls.length === 0 && gameStatus === 'playing' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center text-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Pirámide Completa</h5>
                    <p className="text-xs text-white/40">Todos los controles han sido asignados. ¿Estás listo para validar?</p>
                  </div>
                  <button
                    onClick={handleValidate}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    Validar Jerarquía
                  </button>
                </motion.div>
              )}

              {gameStatus === 'validating' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-4"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-center">
                      <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Aciertos</div>
                      <div className="text-2xl font-black text-white">{results.filter(r => r).length}/5</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Puntos</div>
                      <div className="text-2xl font-black text-emerald-500">+{score}</div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    {results.filter(r => r).length === 5 
                      ? "¡Excelente! Dominás la jerarquía de controles. Recordá que eliminar el riesgo siempre es la prioridad."
                      : "Buen intento. Repasá las reflexiones en la pirámide para entender por qué algunos controles son más efectivos que otros."}
                  </p>

                  <button
                    onClick={handleFinish}
                    className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Finalizar Misión <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Modal Overlay (Optional) */}
      {gameStatus === 'playing' && placedControls.every(c => c === null) && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
              Seleccioná una medida y luego el nivel de la pirámide
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
};
