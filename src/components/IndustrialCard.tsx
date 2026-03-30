
import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const IndustrialCard = ({ card, hidden, onClick, styleClass = "", className = "", style = {}, children }: any) => {
  const combinedClassName = className || styleClass;
  
  if (!card && !hidden) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden",
          combinedClassName
        )}
        style={style}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!hidden && onClick ? { y: -10, scale: 1.05 } : {}}
      onClick={onClick}
      style={style}
      className={cn(
        "relative w-24 h-36 md:w-32 md:h-48 tactile-card p-2 md:p-3 flex flex-col items-center justify-between cursor-pointer transition-all shadow-2xl",
        combinedClassName,
        hidden ? 'bg-on-primary-fixed!' : ''
      )}
    >
      {!hidden ? (
        <>
          {/* Top Left: Number + Icon (Suit) */}
          <div className="w-full flex justify-start items-center gap-1">
            <span className="text-lg md:text-2xl font-black text-on-primary-fixed leading-none">{card.n}</span>
            <span className={`material-symbols-outlined text-sm md:text-lg symbol-3d ${card.iconColor || 'text-on-primary-fixed'}`}>{card.icon || 'star'}</span>
          </div>
          
          {/* Center Content: Large Emoji + Background Icon */}
          <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
            {/* Background Suit Icon - Subtle */}
            <span className={`absolute material-symbols-outlined text-5xl md:text-7xl opacity-[0.08] ${card.iconColor || 'text-black'}`}>{card.icon}</span>
            
            {/* Safety/Industrial Emoji */}
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/90 flex items-center justify-center shadow-xl border border-black/5 z-10 transform rotate-3">
              <span className="text-2xl md:text-4xl symbol-3d">{card.e}</span>
            </div>
          </div>
          
          {/* Bottom Section: Label + Power Bar */}
          <div className="w-full text-center">
            <p className="font-headline text-[8px] md:text-[10px] font-black text-on-primary-fixed mb-0.5 md:mb-1 uppercase tracking-tighter leading-tight truncate">
              {card.l}
            </p>
            <div className="h-1.5 md:h-2 w-full bg-slate-200/50 rounded-full overflow-hidden border border-black/5">
              <div 
                className={`h-full bg-secondary shadow-[0_0_8px_rgba(255,182,144,0.6)] transition-all duration-700`} 
                style={{ width: `${(card.p / 14) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-0.5 md:mt-1">
               <p className="text-[6px] md:text-[7px] font-bold text-black/40 uppercase tracking-tighter">Control: {card.p}</p>
               {/* Bottom Right: Number + Icon (Small/Inverted) */}
               <div className="flex items-center gap-0.5 opacity-30">
                  <span className="text-[8px] md:text-[10px] font-black">{card.n}</span>
                  <span className="material-symbols-outlined text-[8px] md:text-[10px]">{card.icon}</span>
               </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
           <div className="w-12 h-12 rounded-full border-2 border-secondary/20 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-secondary text-3xl">shield</span>
           </div>
           <p className="text-[8px] font-headline tracking-[0.3em] text-secondary/40 uppercase">Seguridad</p>
        </div>
      )}
    </motion.div>
  );
};
