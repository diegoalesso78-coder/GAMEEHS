
import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Shield, Zap, Target, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { UserStats, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../services/PersistenceService';
import { MISSIONS_OF_THE_WEEK } from '../lib/constants';

export const MissionsView = ({ userStats, onBack }: { userStats: UserStats, onBack: () => void }) => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-headline font-black text-white tracking-tighter uppercase leading-none">CENTRO DE <span className="text-secondary">MISIONES</span></h2>
            <p className="text-xs md:text-sm font-headline text-white/40 uppercase tracking-widest mt-2">PROGRESO OPERATIVO Y LOGROS DEL SISTEMA</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-headline font-black uppercase tracking-widest text-xs">VOLVER</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Level */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,182,144,0.3)]">
                  <Zap className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-headline font-black text-white uppercase tracking-tighter mb-1">NIVEL {userStats.level}</h3>
                <p className="text-[10px] font-headline text-secondary uppercase tracking-widest mb-6">RANGO: ESPECIALISTA EHS</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-headline font-black text-white/60 mb-2 uppercase tracking-widest">
                      <span>PROGRESO DE NIVEL</span>
                      <span>{userStats.xp % 1000} / 1000 XP</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(userStats.xp % 1000) / 10}%` }}
                        className="h-full bg-secondary shadow-[0_0_10px_rgba(255,182,144,0.5)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-[8px] font-headline text-white/40 uppercase tracking-widest block mb-1">MISIONES</span>
                      <span className="text-xl font-headline font-black text-white">{userStats.gamesPlayed}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-[8px] font-headline text-white/40 uppercase tracking-widest block mb-1">VICTORIAS</span>
                      <span className="text-xl font-headline font-black text-secondary">{userStats.victories}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10">
              <h3 className="text-sm font-headline font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Star size={16} className="text-secondary" />
                MISIONES SEMANALES
              </h3>
              <div className="space-y-4">
                {MISSIONS_OF_THE_WEEK.map(mission => {
                  const progress = userStats.missionProgress?.[mission.id] || 0;
                  const isCompleted = progress >= mission.target;
                  const percentage = Math.min(100, (progress / mission.target) * 100);
                  
                  return (
                    <div key={mission.id} className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-secondary/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-headline font-black text-white uppercase tracking-tighter">{mission.title}</span>
                        {isCompleted ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        )}
                      </div>
                      <p className="text-[9px] text-white/40 mb-3 leading-tight">{mission.desc}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-headline font-black text-white/40 uppercase tracking-widest">
                          <span>PROGRESO</span>
                          <span>{progress} / {mission.target}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-secondary"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end mt-2">
                        <span className="text-[9px] font-headline font-black text-secondary">+{mission.xp} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements Grid */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-8 rounded-2xl border border-white/10 h-full">
              <h3 className="text-sm font-headline font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                <Trophy size={16} className="text-secondary" />
                LOGROS DESBLOQUEADOS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = userStats.achievements.includes(achievement.id);
                  return (
                    <div 
                      key={achievement.id}
                      className={`p-6 rounded-2xl border transition-all duration-500 flex gap-4 ${
                        isUnlocked 
                          ? 'bg-secondary/10 border-secondary/30' 
                          : 'bg-white/5 border-white/5 opacity-50 grayscale'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked ? 'bg-secondary text-black shadow-lg' : 'bg-white/10 text-white/40'
                      }`}>
                        {achievement.id === 'perfect_score' ? <Star size={24} /> : 
                         achievement.id === 'five_games' ? <Shield size={24} /> :
                         achievement.id === 'truco_master' ? <Target size={24} /> :
                         <Trophy size={24} />}
                      </div>
                      <div>
                        <h4 className={`text-sm font-headline font-black uppercase tracking-tighter mb-1 ${
                          isUnlocked ? 'text-white' : 'text-white/40'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-[10px] text-white/40 leading-tight mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-headline font-black uppercase tracking-widest ${
                            isUnlocked ? 'text-secondary' : 'text-white/20'
                          }`}>
                            +{achievement.xp} XP
                          </span>
                          {isUnlocked && (
                            <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-headline font-black uppercase tracking-widest">
                              COMPLETADO
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
