
import React from 'react';
import { motion } from 'framer-motion';
import { X, Info, ShieldCheck, ClipboardList } from 'lucide-react';
import { Game } from '../types';

interface RulesModalProps {
  game: Game;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ game, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-zinc-900 border border-secondary/30 w-full max-w-lg rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-secondary/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-secondary transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-xl ${game.color} flex items-center justify-center shadow-lg shadow-black/50`}>
            <span className="material-icons-round text-3xl text-black">{game.icon}</span>
          </div>
          <div>
            <div className="text-secondary font-black text-xs tracking-[0.2em] mb-1">{game.subtitle}</div>
            <h2 className="text-2xl font-black text-white tracking-tight">{game.title}</h2>
          </div>
        </div>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-secondary font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <Info size={14} /> Descripción
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">{game.desc}</p>
          </section>
          
          <section>
            <h3 className="text-secondary font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck size={14} /> Objetivo
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">{game.obj}</p>
          </section>
          
          <section>
            <h3 className="text-secondary font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <ClipboardList size={14} /> Reglas del Juego
            </h3>
            <ul className="space-y-2">
              {game.rules.map((rule: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-white/70 text-xs">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0"></div>
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-secondary text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
        >
          ENTENDIDO
        </button>
      </motion.div>
    </motion.div>
  );
};
