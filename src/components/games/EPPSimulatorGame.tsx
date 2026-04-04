
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle2, XCircle, Trophy, ArrowRight, AlertTriangle, HardHat, Eye, Headphones, Hand, Footprints, Wind } from 'lucide-react';

interface Scenario {
  id: string;
  risk: string;
  desc: string;
  required: string[];
  options: { id: string, label: string, icon: any }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'altura',
    risk: 'TRABAJO EN ALTURA',
    desc: 'Se requiere realizar mantenimiento en una luminaria a 5 metros de altura usando un elevador de tijera.',
    required: ['arnes', 'casco', 'botas'],
    options: [
      { id: 'arnes', label: 'Arnés de Seguridad', icon: Shield },
      { id: 'casco', label: 'Casco con Barbijo', icon: HardHat },
      { id: 'botas', label: 'Botas de Seguridad', icon: Footprints },
      { id: 'guantes_nitrilo', label: 'Guantes de Nitrilo', icon: Hand },
      { id: 'lentes', label: 'Lentes de Seguridad', icon: Eye }
    ]
  },
  {
    id: 'quimico',
    risk: 'TRASVASE DE QUÍMICOS',
    desc: 'Se debe realizar el trasvase de una sustancia corrosiva desde un tambor a recipientes menores.',
    required: ['guantes_quimicos', 'antiparras', 'delantal'],
    options: [
      { id: 'guantes_quimicos', label: 'Guantes para Químicos', icon: Hand },
      { id: 'antiparras', label: 'Antiparras Estancas', icon: Eye },
      { id: 'delantal', label: 'Delantal de PVC', icon: Shield },
      { id: 'auditivos', label: 'Protectores Auditivos', icon: Headphones },
      { id: 'casco', label: 'Casco de Seguridad', icon: HardHat }
    ]
  },
  {
    id: 'ruido',
    risk: 'OPERACIÓN DE AMOLADORA',
    desc: 'Corte de perfiles metálicos en taller con niveles de ruido superiores a 90dB y proyección de chispas.',
    required: ['auditivos', 'lentes', 'guantes_vaqueta', 'proteccion_facial'],
    options: [
      { id: 'auditivos', label: 'Protectores Auditivos', icon: Headphones },
      { id: 'lentes', label: 'Lentes de Seguridad', icon: Eye },
      { id: 'guantes_vaqueta', label: 'Guantes de Vaqueta', icon: Hand },
      { id: 'proteccion_facial', label: 'Protector Facial', icon: Eye },
      { id: 'respirador', label: 'Respirador N95', icon: Wind }
    ]
  }
];

export const EPPSimulatorGame = ({ onGameOver, onFinish }: { onGameOver: (score: number) => void, onFinish: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const toggleSelection = (id: string) => {
    if (showFeedback) return;
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const validateSelection = () => {
    const hasAllRequired = scenario.required.every(id => selected.includes(id));
    const hasNoExtra = selected.every(id => scenario.required.includes(id));
    
    const correct = hasAllRequired && hasNoExtra;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      const points = 500;
      setScore(prev => prev + points);
      onGameOver(points);
    }
  };

  const nextScenario = () => {
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected([]);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="p-8 md:p-12 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl"
        >
          <Trophy className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-2">SIMULACIÓN COMPLETADA</h2>
          <p className="text-white/40 font-mono text-sm tracking-widest uppercase mb-8">Puntaje Total Acumulado</p>
          
          <div className="text-6xl font-black text-emerald-500 mb-12 font-mono">
            {score}
          </div>
          
          <button
            onClick={() => onFinish(score)}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            FINALIZAR REPORTE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Simulador de EPP</h3>
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">Escenario {currentIdx + 1} de {SCENARIOS.length}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Puntaje</p>
          <div className="text-emerald-500 font-mono font-bold text-xl">{score}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scenario Card */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h4 className="text-sm font-bold text-orange-500 uppercase tracking-widest">Alerta de Riesgo</h4>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">
            {scenario.risk}
          </h2>
          
          <p className="text-white/60 text-base leading-relaxed mb-12">
            {scenario.desc}
          </p>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Estado de Equipamiento</h5>
            <div className="flex flex-wrap gap-2">
              {selected.length === 0 ? (
                <span className="text-xs text-white/20 italic">Ningún elemento seleccionado...</span>
              ) : (
                selected.map(id => {
                  const opt = scenario.options.find(o => o.id === id);
                  return (
                    <span key={id} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase">
                      {opt?.label}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Selection Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenario.options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selected.includes(opt.id);
              
              return (
                <button
                  key={opt.id}
                  disabled={showFeedback}
                  onClick={() => toggleSelection(opt.id)}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 text-center group ${
                    isSelected 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-white/20 group-hover:text-white'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {!showFeedback ? (
            <button
              onClick={validateSelection}
              disabled={selected.length === 0}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              VALIDAR EQUIPAMIENTO
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-8 rounded-[2rem] border ${
                isCorrect ? 'bg-emerald-500/10 border-emerald-500' : 'bg-red-500/10 border-red-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                <h4 className={`text-sm font-bold uppercase tracking-widest ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isCorrect ? '¡Equipamiento Correcto!' : 'Equipamiento Insuficiente o Incorrecto'}
                </h4>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mb-8">
                {isCorrect 
                  ? 'Has seleccionado todas las barreras necesarias para mitigar los riesgos de este escenario. ¡Excelente trabajo preventivo!' 
                  : 'Faltan elementos críticos o has seleccionado equipos innecesarios que podrían dificultar la tarea. Recordá siempre consultar la HDS o el AST.'}
              </p>
              <button
                onClick={nextScenario}
                className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                Siguiente Escenario
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
