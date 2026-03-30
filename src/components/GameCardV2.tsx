
import React from 'react';
import { motion } from 'framer-motion';
import { Info, Play, ShieldAlert } from 'lucide-react';
import { Game } from '../types';

interface GameCardV2Props {
  game: Game;
  onSelect: (gameId: string) => void;
  onShowRules: (game: Game) => void;
}

export const GameCardV2: React.FC<GameCardV2Props> = ({ game, onSelect, onShowRules }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-secondary/30 transition-all duration-500"
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <img 
          src={game.img} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full ${game.color} text-black text-[10px] font-black tracking-widest uppercase shadow-lg`}>
            {game.level}
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onShowRules(game);
            }}
            className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white/60 hover:text-secondary hover:bg-black/80 transition-all border border-white/5"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-secondary font-black text-[10px] tracking-[0.2em] mb-1">{game.subtitle}</div>
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-secondary transition-colors uppercase">{game.title}</h3>
          </div>
          <div className={`w-12 h-12 rounded-xl ${game.color} flex items-center justify-center shadow-lg shadow-black/50 group-hover:scale-110 transition-transform`}>
            <span className="material-icons-round text-2xl text-black">{game.icon}</span>
          </div>
        </div>
        
        <p className="text-white/40 text-xs leading-relaxed mb-6 line-clamp-2 group-hover:text-white/60 transition-colors">
          {game.desc}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 tracking-widest">
            <ShieldAlert size={12} className="text-secondary/50" />
            {game.stats}
          </div>
          
          <button 
            onClick={() => onSelect(game.id)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-black text-xs font-black rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/10"
          >
            <Play size={14} fill="currentColor" />
            INICIAR
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
};
