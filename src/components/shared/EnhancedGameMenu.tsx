
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Zap, Info, Trophy, Layout, LogOut, ChevronRight, Play, X, CheckCircle2 } from 'lucide-react';
import { PlayerData, Game } from '../../types';
import { GAMES_ENHANCED, CONFIG_SHEET_URL } from '../../constants';
import { GameCardV2 } from './UIComponents';

export const EnhancedGameMenu = ({ 
  playerData, 
  onSelectGame, 
  onLogout,
  missionId
}: { 
  playerData: PlayerData, 
  onSelectGame: (id: string) => void,
  onLogout: () => void,
  missionId: string | null
}) => {
  const [activeTab, setActiveTab] = useState<'FLOOR' | 'LOGS'>('FLOOR');
  const [selectedGameInfo, setSelectedGameInfo] = useState<Game | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-emerald-500 rounded-full" />
              <h2 className="text-4xl font-black text-white tracking-tight">
                CENTRO DE <span className="text-emerald-500">OPERACIONES</span>
              </h2>
            </div>
            <p className="text-white/40 font-mono text-xs tracking-widest uppercase max-w-xl leading-relaxed">
              Seleccioná un módulo de entrenamiento para comenzar la validación de competencias preventivas.
            </p>
          </div>

          <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('FLOOR')}
              className={`px-8 py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] transition-all flex items-center gap-3 ${
                activeTab === 'FLOOR' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'
              }`}
            >
              <Layout className="w-4 h-4" />
              TRAINING_FLOOR
            </button>
            <button
              onClick={() => setActiveTab('LOGS')}
              className={`px-8 py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] transition-all flex items-center gap-3 ${
                activeTab === 'LOGS' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              SYSTEM_LOGS
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'FLOOR' ? (
            <motion.div
              key="floor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {GAMES_ENHANCED.filter(g => g.active).map((game) => (
                <GameCardV2
                  key={game.id}
                  game={game}
                  isMission={missionId === game.id}
                  hasActiveMission={!!missionId}
                  onSelect={onSelectGame}
                  onShowRules={setSelectedGameInfo}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900/50 border border-white/10 rounded-3xl p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Sincronizando Datos</h3>
              <p className="text-white/40 font-mono text-xs max-w-md mx-auto">
                Los registros globales se están actualizando. Volvé pronto para ver el ranking de operadores.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedGameInfo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGameInfo(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="h-48 relative">
                <img 
                  src={selectedGameInfo.img} 
                  className="w-full h-full object-cover opacity-40"
                  alt={selectedGameInfo.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <button 
                  onClick={() => setSelectedGameInfo(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 -mt-12 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${selectedGameInfo.color} flex items-center justify-center shadow-lg`}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{selectedGameInfo.title}</h3>
                    <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">{selectedGameInfo.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-3">Objetivo</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {selectedGameInfo.obj || "Validar conocimientos específicos sobre normativas de seguridad y detección de riesgos en el entorno laboral."}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-3">Descripción</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {selectedGameInfo.desc || "Módulo de entrenamiento interactivo diseñado para fortalecer la cultura preventiva a través de desafíos dinámicos."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4">Protocolo de Juego</h4>
                    <div className="space-y-3">
                      {(selectedGameInfo.rules || [
                        'Iniciá el módulo desde el menú principal.',
                        'Completá los desafíos antes de que el tiempo expire.',
                        'Sumá puntos por cada acierto preventivo.',
                        'Al finalizar, tus resultados se enviarán al sistema central.'
                      ]).map((rule, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-xs text-white/60 leading-tight">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                  <button
                    onClick={() => {
                      onSelectGame(selectedGameInfo.id);
                      setSelectedGameInfo(null);
                    }}
                    className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    INICIAR MISIÓN
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
