
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Zap, Info, Trophy, Layout, LogOut, ChevronRight, Play, X, CheckCircle2 } from 'lucide-react';
import { PlayerData, Game } from '../../types';
import { GAMES_ENHANCED, CONFIG_SHEET_URL, LOGS_READ_URL } from '../../constants';
import { GameCardV2 } from './UIComponents';

export const EnhancedGameMenu = ({ 
  playerData, 
  onSelectGame, 
  onLogout,
  missionIds
}: { 
  playerData: PlayerData, 
  onSelectGame: (id: string) => void,
  onLogout: () => void,
  missionIds: string[]
}) => {
  const [activeTab, setActiveTab] = useState<'FLOOR' | 'LOGS'>('FLOOR');
  const [selectedGameInfo, setSelectedGameInfo] = useState<Game | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  useEffect(() => {
    if (activeTab === 'LOGS') {
      fetchLogs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (missionIds.length > 0) {
      console.log('EnhancedGameMenu received missionIds:', missionIds);
    }
  }, [missionIds]);

  const fetchLogs = async () => {
    setIsLogsLoading(true);
    try {
      const response = await fetch(LOGS_READ_URL);
      const csv = await response.text();
      
      // More robust CSV parsing
      const rows = csv.split(/\r?\n/).filter(row => row.trim()).map(row => {
        // Handle both comma and semicolon separators
        const separator = row.includes(';') ? ';' : ',';
        return row.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
      });
      
      if (rows.length > 1) {
        const headers = rows[0].map(h => h.toLowerCase().trim());
        const data = rows.slice(1).map(row => {
          const raw: any = {};
          headers.forEach((header, i) => {
            if (row[i] !== undefined) {
              raw[header] = row[i];
            }
          });
          
          // Extraemos los valores base de forma flexible
          let date = raw.fecha || raw.timestamp || raw.date || raw['fecha y hora'] || '-';
          let operator = raw.nombre || raw.operador || raw.operator || raw.usuario || raw['nombre del operador'] || '-';
          let game = raw.juego || raw.game || raw.módulo || raw.modulo || raw.actividad || '-';
          let score = raw.puntaje || raw.score || raw.puntos || raw.resultado || '0';
          // Mapeo robusto de sector: Buscamos en claves específicas y descartamos datos de sitio (como LUQUE)
          let sector = '-';
          const possibleSectorKeys = ['sector', 'área', 'area', 'sección', 'seccion', 'sector / área', 'sector / area'];
          
          for (const key of possibleSectorKeys) {
            const val = raw[key];
            if (val && val !== '-' && val.trim() !== '') {
              const lowerVal = val.toLowerCase();
              // Si el valor parece ser un sitio/localidad, lo ignoramos y seguimos buscando
              if (!lowerVal.includes('luque') && !lowerVal.includes('sitio') && lowerVal !== 'planta a' && lowerVal !== 'planta b') {
                sector = val;
                break;
              }
            }
          }

          // Limpieza de prefijos comunes
          game = game.replace('GAME_', '');

          // HEURÍSTICA DE CORRECCIÓN (Basada en la imagen del usuario)
          // Problema detectado: En algunas filas, el ID/Timestamp aparece en 'Módulo' 
          // y el Nombre del Juego aparece en 'Puntaje'.
          
          const scoreHasLetters = /[a-zA-Z]{3,}/.test(score); // Tiene al menos 3 letras (ej: "Truco")
          const gameIsNumericId = /^\d{10,}$/.test(game.trim()); // Es un ID numérico largo (timestamp)

          if (scoreHasLetters && gameIsNumericId) {
            // Intercambio detectado: El nombre del juego está en la columna de puntaje
            game = score;
            score = '0'; // El ID no nos sirve como puntaje visual
          }

          return {
            date,
            operator,
            game,
            score,
            sector
          };
        }).filter(item => item.operator !== '-' || item.game !== '-');
        
        setLogs(data.reverse());
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLogsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 md:pt-24 pb-12 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-1 h-6 md:h-8 bg-emerald-500 rounded-full" />
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                CENTRO DE <span className="text-emerald-500">OPERACIONES</span>
              </h2>
            </div>
            <p className="text-white/40 font-mono text-[10px] md:text-xs tracking-widest uppercase max-w-xl leading-relaxed">
              Seleccioná un módulo de entrenamiento para comenzar la validación de competencias preventivas.
            </p>
          </div>

          <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl w-full md:w-auto overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('FLOOR')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${
                activeTab === 'FLOOR' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5 md:w-4 md:h-4" />
              TRAINING_FLOOR
            </button>
            <button
              onClick={() => setActiveTab('LOGS')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${
                activeTab === 'LOGS' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4" />
              HISTORIAL_OPS
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
              {(() => {
                const normalizedMissionIds = missionIds.map(id => id.toLowerCase().replace(/[^a-z0-9]/g, ''));
                
                // Sort games: 1. Missions, 2. Active, 3. Inactive
                const sortedGames = [...GAMES_ENHANCED].sort((a, b) => {
                  const isAMission = a.active && normalizedMissionIds.length > 0 && (
                    normalizedMissionIds.includes(a.id.toLowerCase().replace(/[^a-z0-9]/g, '')) || 
                    normalizedMissionIds.includes(a.subtitle.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
                    normalizedMissionIds.some(mid => a.subtitle.toLowerCase().replace(/[^a-z0-9]/g, '') === `mision${mid}`)
                  );
                  const isBMission = b.active && normalizedMissionIds.length > 0 && (
                    normalizedMissionIds.includes(b.id.toLowerCase().replace(/[^a-z0-9]/g, '')) || 
                    normalizedMissionIds.includes(b.subtitle.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
                    normalizedMissionIds.some(mid => b.subtitle.toLowerCase().replace(/[^a-z0-9]/g, '') === `mision${mid}`)
                  );

                  // Missions first
                  if (isAMission && !isBMission) return -1;
                  if (!isAMission && isBMission) return 1;

                  // Active next
                  if (a.active && !b.active) return -1;
                  if (!a.active && b.active) return 1;

                  return 0;
                });

                const anyGameMatches = normalizedMissionIds.length > 0 && sortedGames.some(g => {
                  if (!g.active) return false;
                  const normalizedGameId = g.id.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const normalizedSubtitle = g.subtitle.toLowerCase().replace(/[^a-z0-9]/g, '');
                  return normalizedMissionIds.includes(normalizedGameId) || 
                         normalizedMissionIds.includes(normalizedSubtitle) ||
                         normalizedMissionIds.some(mid => normalizedSubtitle === `mision${mid}`);
                });

                return sortedGames.map((game) => {
                  const normalizedGameId = game.id.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const normalizedSubtitle = game.subtitle.toLowerCase().replace(/[^a-z0-9]/g, '');
                  
                  const isMission = game.active && normalizedMissionIds.length > 0 && (
                    normalizedMissionIds.includes(normalizedGameId) || 
                    normalizedMissionIds.includes(normalizedSubtitle) ||
                    normalizedMissionIds.some(mid => normalizedSubtitle === `mision${mid}`)
                  );
                  
                  return (
                    <GameCardV2
                      key={game.id}
                      game={game}
                      isMission={!!isMission}
                      hasActiveMission={!!anyGameMatches}
                      onSelect={onSelectGame}
                      onShowRules={setSelectedGameInfo}
                    />
                  );
                });
              })()}
            </motion.div>
          ) : (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl shadow-black/50"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                    <Activity className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">REGISTROS DE ACTIVIDAD</h3>
                    <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">Monitoreo en tiempo real de validaciones preventivas</p>
                  </div>
                </div>
                <button 
                  onClick={fetchLogs}
                  disabled={isLogsLoading}
                  className="px-6 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950 transition-all text-[10px] font-bold uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLogsLoading ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  {isLogsLoading ? 'SINCRONIZANDO...' : 'ACTUALIZAR DATOS'}
                </button>
              </div>

              <div className="mb-8">
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Activity className="w-4 h-4 text-white/20" />
                  </div>
                  <input
                    type="text"
                    placeholder="BUSCAR POR OPERADOR, MÓDULO O SECTOR..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[10px] font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest"
                  />
                </div>
              </div>

              {isLogsLoading && logs.length === 0 ? (
                <div className="py-32 text-center">
                  <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Accediendo a la base de datos central...</p>
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-12">
                  {/* Stats Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Top Sectors */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <Layout className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Top 3 Sectores</h4>
                      </div>
                      <div className="space-y-4">
                        {(() => {
                          const counts: Record<string, number> = {};
                          logs.forEach(log => {
                            const s = (log.sector || 'Desconocido').toUpperCase();
                            counts[s] = (counts[s] || 0) + 1;
                          });
                          return Object.entries(counts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([name, count], i) => (
                              <div key={i} className="flex items-center justify-between group/item">
                                <span className="text-xs text-white/60 truncate max-w-[140px] group-hover/item:text-white transition-colors">{name}</span>
                                <div className="flex items-center gap-2">
                                  <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${(count / logs.length) * 100}%` }} />
                                  </div>
                                  <span className="text-[10px] font-mono text-emerald-500 font-bold">{count}</span>
                                </div>
                              </div>
                            ));
                        })()}
                      </div>
                    </div>

                    {/* Top Players */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <Trophy className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Top 5 Operadores</h4>
                      </div>
                      <div className="space-y-4">
                        {(() => {
                          const counts: Record<string, number> = {};
                          logs.forEach(log => {
                            const p = log.operator || 'Anónimo';
                            counts[p] = (counts[p] || 0) + 1;
                          });
                          return Object.entries(counts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([name, count], i) => (
                              <div key={i} className="flex items-center justify-between group/item">
                                <span className="text-xs text-white/60 truncate max-w-[140px] group-hover/item:text-white transition-colors">{name}</span>
                                <span className="text-[10px] font-mono text-emerald-500 font-bold">{count} OPS</span>
                              </div>
                            ));
                        })()}
                      </div>
                    </div>

                    {/* Top Games */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <Zap className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Top 3 Módulos</h4>
                      </div>
                      <div className="space-y-4">
                        {(() => {
                          const counts: Record<string, number> = {};
                          logs.forEach(log => {
                            const g = (log.game || 'Desconocido').toUpperCase();
                            counts[g] = (counts[g] || 0) + 1;
                          });
                          return Object.entries(counts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([name, count], i) => (
                              <div key={i} className="flex items-center justify-between group/item">
                                <span className="text-xs text-white/60 truncate max-w-[140px] group-hover/item:text-white transition-colors">{name}</span>
                                <span className="text-[10px] font-mono text-emerald-500 font-bold">{count}</span>
                              </div>
                            ));
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5">
                            <th className="py-5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-6">Fecha y Hora</th>
                            <th className="py-5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-6">Operador</th>
                            <th className="py-5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-6">Módulo</th>
                            <th className="py-5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-6">Puntaje</th>
                            <th className="py-5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest px-6">Sector / Área</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {logs
                            .filter(log => 
                              log.operator.toLowerCase().includes(logSearch.toLowerCase()) ||
                              log.game.toLowerCase().includes(logSearch.toLowerCase()) ||
                              log.sector.toLowerCase().includes(logSearch.toLowerCase())
                            )
                            .map((log, i) => (
                              <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                                <td className="py-4 px-6 text-xs text-white/60 font-mono whitespace-nowrap">{log.date}</td>
                                <td className="py-4 px-6 text-xs text-white font-bold whitespace-nowrap">{log.operator}</td>
                                <td className="py-4 px-6 text-xs text-white/60 uppercase tracking-wider whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                    {log.game}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black font-mono border border-emerald-500/20">
                                    {log.score}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-xs text-white/40 uppercase whitespace-nowrap">{log.sector}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-32 text-center">
                  <Activity className="w-16 h-16 text-white/5 mx-auto mb-6" />
                  <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em]">No se detectaron registros en el sistema</p>
                </div>
              )}
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
