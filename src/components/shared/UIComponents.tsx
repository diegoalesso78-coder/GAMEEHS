
import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Zap, Info, Trophy, Layout, LogOut, ChevronRight, Play, Monitor, Smartphone, Lock } from 'lucide-react';
import { PlayerData, Game, DisplayMode } from '../../types';

export const ScanlineOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
  </div>
);

export const SystemLoader = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center font-mono">
    <div className="w-64 h-1 bg-slate-900 rounded-full overflow-hidden mb-4 relative">
      <motion.div 
        className="absolute inset-0 bg-emerald-500"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="text-emerald-500 text-xs tracking-[0.2em] animate-pulse">
      {message.toUpperCase()}
    </div>
    <div className="mt-8 grid grid-cols-4 gap-2 opacity-20">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="w-1 h-1 bg-emerald-500 rounded-full" />
      ))}
    </div>
  </div>
);

export const GlobalHeader = ({ 
  playerData, 
  onBackToMenu, 
  onFinish,
  isGameActive,
  displayMode, 
  onToggleDisplayMode 
}: { 
  playerData: PlayerData | null, 
  onBackToMenu?: () => void,
  onFinish?: () => void,
  isGameActive?: boolean,
  displayMode: DisplayMode,
  onToggleDisplayMode: () => void
}) => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-white/5 z-40 px-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <Shield className="w-5 h-5 text-emerald-500" />
      </div>
      <div>
        <h1 className="text-white font-bold tracking-tight text-sm">PREVENT_CORE</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-500/70 font-mono tracking-widest uppercase">System Active</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      {isGameActive && onFinish && (
        <button 
          onClick={onFinish}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Finalizar y Registrar</span>
        </button>
      )}

      <button 
        onClick={onToggleDisplayMode}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-mono uppercase tracking-wider"
        title={displayMode === 'MOBILE' ? 'Switch to PC/TV Mode' : 'Switch to Mobile Mode'}
      >
        {displayMode === 'MOBILE' ? (
          <>
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PC/TV</span>
          </>
        ) : (
          <>
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MOBILE</span>
          </>
        )}
      </button>

      {playerData && (
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-[10px] font-mono tracking-wider">
            <div className="flex flex-col">
              <span className="text-white/40 uppercase">Operator</span>
              <span className="text-white">{playerData.nombre}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 uppercase">Sector</span>
              <span className="text-white">{playerData.sector}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 uppercase">Score</span>
              <span className="text-emerald-400 font-bold">{playerData.score.toLocaleString()}</span>
            </div>
          </div>
          
          {onBackToMenu && (
            <button 
              onClick={onBackToMenu}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  </header>
);

interface GameCardV2Props {
  game: Game;
  isMission: boolean;
  hasActiveMission: boolean;
  onSelect: (id: string) => void;
  onShowRules: (game: Game) => void;
}

export const GameCardV2: React.FC<GameCardV2Props> = ({ 
  game, 
  isMission, 
  hasActiveMission,
  onSelect, 
  onShowRules 
}) => {
  const isDimmed = hasActiveMission && !isMission;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        y: 0,
        scale: isMission ? [1, 1.03, 1] : 1,
        filter: isDimmed ? 'grayscale(100%)' : 'grayscale(0%)'
      }}
      transition={{
        scale: isMission ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 },
        opacity: { duration: 0.5 },
        y: { duration: 0.5 },
        filter: { duration: 0.5 }
      }}
      whileHover={!isDimmed ? { y: -5, scale: isMission ? 1.05 : 1.02 } : {}}
      className="group relative transition-all duration-500"
    >
      {/* Mission Glow Effect */}
      {isMission && (
        <>
          <div className="absolute -inset-2 bg-emerald-500/20 blur-3xl rounded-[2.5rem] animate-pulse z-0" />
          <motion.div 
            className="absolute -inset-[2px] rounded-2xl z-0 border-2 border-emerald-500/50"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.01, 1],
              boxShadow: [
                "0 0 0px rgba(16, 185, 129, 0)",
                "0 0 30px rgba(16, 185, 129, 0.5)",
                "0 0 0px rgba(16, 185, 129, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className={`relative h-[420px] rounded-2xl overflow-hidden bg-slate-900 border transition-all duration-500 z-10 ${
        isMission 
          ? 'border-emerald-500 shadow-2xl shadow-emerald-500/40' 
          : 'border-white/5'
      } ${!isDimmed ? 'group-hover:border-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/10' : ''}`}>
        
        <div className="absolute inset-0">
          <img 
            src={game.img} 
            alt={game.title}
            className={`w-full h-full object-cover transition-opacity duration-500 scale-110 group-hover:scale-100 ${
              isMission ? 'opacity-60' : 'opacity-40 group-hover:opacity-60'
            }`}
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent ${isDimmed ? 'bg-slate-950/60' : ''}`} />
        </div>

        {isMission && (
          <div className="absolute top-4 left-4 z-10">
            <div className="px-4 py-1.5 rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/40 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-current" />
              MISIÓN PRIORITARIA
            </div>
          </div>
        )}

        {isDimmed && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-2 opacity-60">
              <Lock className="w-8 h-8 text-white/40" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Módulo Secundario</span>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest ${game.color} text-white shadow-sm`}>
                {game.level}
              </span>
              <span className="text-[9px] text-white/40 font-mono uppercase tracking-widest">
                {game.stats}
              </span>
            </div>
            <h3 className={`text-xl font-bold mb-1 transition-colors ${
              isMission ? 'text-emerald-400 animate-pulse' : 'text-white group-hover:text-emerald-400'
            }`}>
              {game.title}
            </h3>
            <p className="text-xs text-white/50 font-mono tracking-wider uppercase">
              {game.subtitle}
            </p>
          </div>

          <div className={`transition-all duration-500 ${isMission ? 'h-auto opacity-100' : 'h-auto md:h-0 overflow-hidden md:group-hover:h-auto opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
            <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-3">
              {game.desc || "Entrenamiento avanzado de seguridad y prevención de riesgos laborales."}
            </p>
            
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(game.id)}
                className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
              >
                <Play className="w-4 h-4 fill-current" />
                INICIAR
              </motion.button>
              <button
                onClick={() => onShowRules(game)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
