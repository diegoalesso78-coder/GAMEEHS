
import React, { useState, useEffect } from 'react';
import { Shield, User, Zap, Trophy } from 'lucide-react';
import { View, UserStats } from '../types';

export const GlobalHeader = ({ playerData, userStats, onViewChange }: { playerData: any, userStats: UserStats, onViewChange: (view: View) => void }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 md:h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('MENU')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Shield className="text-black" size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-headline text-lg md:text-xl font-black text-white tracking-tighter leading-none">PREVEN<span className="text-secondary">EHS</span></h1>
            <p className="text-[8px] font-headline text-white/40 uppercase tracking-widest mt-1">SISTEMA DE GESTIÓN PREVENTIVA</p>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

        <div className="hidden lg:flex items-center gap-6">
          <div 
            className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onViewChange('GAME_MISSIONS')}
          >
            <span className="text-[8px] font-headline text-secondary uppercase tracking-widest mb-0.5">NIVEL DE ACCESO</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">NIVEL {userStats.level} / {userStats.xp} XP</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-headline text-secondary uppercase tracking-widest mb-0.5">LOCALIZACIÓN</span>
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">{playerData?.site || 'PLANTA_BASE'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[8px] font-headline text-secondary uppercase tracking-widest mb-0.5">RELOJ DEL SISTEMA</span>
          <span className="text-[10px] font-mono text-white/60">{time}</span>
        </div>

        <div 
          className="flex items-center gap-3 bg-white/5 p-1.5 md:p-2 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
          onClick={() => onViewChange('GAME_MISSIONS')}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary/20 flex items-center justify-center border border-secondary/30">
            <User className="text-secondary" size={18} />
          </div>
          <div className="pr-2 md:pr-4">
            <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-tighter leading-none">{playerData?.name || 'OPERADOR_01'}</p>
            <div className="flex items-center gap-2 mt-1">
              <Trophy size={10} className="text-secondary" />
              <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-widest">{userStats.achievements.length} LOGROS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
