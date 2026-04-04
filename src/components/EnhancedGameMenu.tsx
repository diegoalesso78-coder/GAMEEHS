
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, LayoutGrid, LayoutList, ShieldAlert, TrendingUp, Trophy, Clock, User, Shield, Wrench, Truck, Activity, Zap, Flame, Star, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { Game, UserStats, PlayerData } from '../types';
import { GAMES_ENHANCED, AVATARS } from '../constants';
import { GameCardV2 } from './GameCardV2';
import { RulesModal } from './RulesModal';

interface EnhancedGameMenuProps {
  onSelectGame: (gameId: string) => void;
  onViewMissions: () => void;
  onLogout: () => void;
  playerData: PlayerData;
  userStats: UserStats;
  missionIds: string[];
  sessionGamesCompleted: string[];
}

export const EnhancedGameMenu: React.FC<EnhancedGameMenuProps> = ({ 
  onSelectGame, 
  onViewMissions, 
  onLogout,
  playerData, 
  userStats,
  missionIds,
  sessionGamesCompleted
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGameForRules, setSelectedGameForRules] = useState<Game | null>(null);

  const filteredGames = GAMES_ENHANCED.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (game.desc && game.desc.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || game.level === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'PRINCIPIANTE', 'INTERMEDIO', 'EXPERTO'];

  const renderAvatarIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'User': return <User size={size} />;
      case 'Shield': return <Shield size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      case 'Truck': return <Truck size={size} />;
      case 'Activity': return <Activity size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Trophy': return <Trophy size={size} />;
      case 'Flame': return <Flame size={size} />;
      default: return <User size={size} />;
    }
  };

  const userAvatar = AVATARS.find(a => a.id === playerData.avatar) || AVATARS[0];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-3xl ${userAvatar.color} flex items-center justify-center shadow-2xl shadow-black/40 border-2 border-white/10 relative group`}>
              <div className="text-white group-hover:scale-110 transition-transform duration-500">
                {renderAvatarIcon(userAvatar.icon, 40)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary text-black p-1.5 rounded-lg shadow-lg">
                <ShieldAlert size={14} />
              </div>
            </div>
            <div className="space-y-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-secondary font-black text-xs tracking-[0.3em] uppercase"
              >
                Operador EHS Activo
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black tracking-tighter leading-tight uppercase"
              >
                {playerData.nombre}
              </motion.h1>
              <div className="flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                <span>{playerData.sector}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{playerData.sitio}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onViewMissions}
              className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-6 shadow-2xl cursor-pointer hover:border-secondary/50 transition-all group"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-black text-white/40 tracking-widest uppercase">Nivel</div>
                <div className="text-2xl font-black text-secondary">LVL {userStats.level}</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-black text-white/40 tracking-widest uppercase">Puntos</div>
                <div className="text-2xl font-black text-white">{userStats.xp.toLocaleString()}</div>
              </div>
            </motion.div>

            <button 
              onClick={onLogout}
              className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all group"
              title="Cerrar Sesión"
            >
              <LogOut size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

        {/* Session Progress & Priority Missions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Checklist Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CheckCircle2 size={120} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  Checklist de Sesión
                </h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tu progreso en este entrenamiento</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{sessionGamesCompleted.length} / 3</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Misiones</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => {
                const isCompleted = sessionGamesCompleted.length >= i;
                return (
                  <div 
                    key={i}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/20' 
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/20'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : <span className="font-black">{i}</span>}
                    </div>
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${
                        isCompleted ? 'text-emerald-500' : 'text-white/20'
                      }`}>
                        {isCompleted ? 'Completado' : 'Pendiente'}
                      </div>
                      <div className="text-xs font-bold text-white/60">Misión {i}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sessionGamesCompleted.length >= 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-emerald-500 text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] text-center shadow-lg shadow-emerald-500/20"
              >
                ¡Objetivo de Sesión Alcanzado! +500 XP Extra
              </motion.div>
            )}
          </motion.div>

          {/* Priority Missions Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-secondary/10 border border-secondary/20 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-black text-secondary uppercase tracking-tight flex items-center gap-2 mb-2">
                <AlertCircle size={20} />
                Prioridad Admin
              </h3>
              <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest mb-6">Misiones críticas para tu sector</p>
              
              <div className="space-y-3">
                {GAMES_ENHANCED.filter(g => missionIds.includes(g.id)).slice(0, 2).map(game => (
                  <button
                    key={game.id}
                    onClick={() => onSelectGame(game.id)}
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-secondary transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                        <Star size={16} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black text-white uppercase tracking-tight">{game.title}</div>
                        <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{game.level}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
                {missionIds.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-secondary/20 rounded-2xl">
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">No hay misiones prioritarias</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-secondary/10">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-secondary/60">Bonus de Prioridad</span>
                <span className="text-secondary">2X XP</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Misiones Completadas', value: userStats.gamesPlayed, icon: Clock, color: 'text-blue-400' },
            { label: 'Victorias Perfectas', value: userStats.victories, icon: ShieldAlert, color: 'text-emerald-400' },
            { label: 'Tasa de Éxito', value: userStats.gamesPlayed > 0 ? `${Math.floor((userStats.victories / userStats.gamesPlayed) * 100)}%` : '0%', icon: TrendingUp, color: 'text-secondary' },
            { label: 'Logros Totales', value: `${userStats.achievements.length}/5`, icon: Trophy, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-zinc-900/60 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-black/40 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</div>
                <div className="text-xl font-black text-white">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-zinc-900/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="BUSCAR MISIÓN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-bold tracking-widest focus:outline-none focus:border-secondary/50 transition-all placeholder:text-white/10"
              />
            </div>
            
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-secondary text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-secondary text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <Filter size={16} className="text-white/20 mr-2 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap border ${
                  selectedCategory === cat 
                    ? 'bg-secondary border-secondary text-black shadow-lg shadow-secondary/20' 
                    : 'bg-black/40 border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, i) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <GameCardV2 
                  game={game} 
                  onSelect={onSelectGame} 
                  onShowRules={setSelectedGameForRules}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-zinc-900/20 border border-dashed border-white/10 rounded-3xl"
          >
            <div className="material-icons-round text-6xl text-white/10 mb-4">search_off</div>
            <h3 className="text-xl font-black text-white/40 uppercase tracking-widest">No se encontraron misiones</h3>
            <p className="text-white/20 text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
          </motion.div>
        )}
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {selectedGameForRules && (
          <RulesModal 
            game={selectedGameForRules} 
            onClose={() => setSelectedGameForRules(null)} 
          />
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase pb-12">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SISTEMA OPERATIVO
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            CONEXIÓN SEGURA
          </div>
        </div>
        <div>EHS_GAMIFICATION_ENGINE v2.4.0 // 2024</div>
      </footer>
    </div>
  );
};
