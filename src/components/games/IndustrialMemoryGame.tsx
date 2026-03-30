import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Trophy, 
  Zap, 
  Timer, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Info
} from 'lucide-react';
import { MEMORY_PAIRS } from '../../constants';

interface IndustrialMemoryGameProps {
  onExit: () => void;
  onGameOver: (score: number) => void;
  onFinish?: () => void;
}

const IndustrialMemoryGame: React.FC<IndustrialMemoryGameProps> = ({ onExit, onGameOver, onFinish }) => {
  const [view, setView] = useState<'INTRO' | 'GAME' | 'END'>('INTRO');
  const [difficulty, setDifficulty] = useState(6);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const [showMatchInfo, setShowMatchInfo] = useState<any>(null);
  const [timer, setTimer] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (view === 'GAME' && energy > 0 && matched.length < cards.length) {
      interval = setInterval(() => {
        setEnergy(prev => Math.max(0, prev - (0.5 + (matched.length / 4))));
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (energy === 0 && view === 'GAME') {
      // Game Over by energy depletion
      setTimeout(() => setView('END'), 1000);
    }
    return () => clearInterval(interval);
  }, [view, energy, matched, cards]);

  const startGame = (diff: number) => {
    setDifficulty(diff);
    const selectedPairs = [...MEMORY_PAIRS].sort(() => Math.random() - 0.5).slice(0, diff);
    const gameCards: any[] = [];
    
    selectedPairs.forEach((pair, idx) => {
      gameCards.push({
        id: `R-${idx}`,
        pairId: idx,
        type: 'RIESGO',
        content: pair.riesgo.emoji,
        titulo: pair.riesgo.titulo,
        desc: pair.riesgo.desc,
        bgColor: pair.riesgo.color,
      });
      gameCards.push({
        id: `M-${idx}`,
        pairId: idx,
        type: 'MITIGACIÓN',
        content: pair.mitigacion.emoji,
        titulo: pair.mitigacion.titulo,
        desc: pair.mitigacion.desc,
        bgColor: pair.mitigacion.color,
      });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setEnergy(100);
    setScore(0);
    setCombo(1);
    setView('GAME');
  };

  const handleCardClick = (idx: number) => {
    if (isProcessing || flipped.includes(idx) || matched.includes(idx) || energy <= 0) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        const now = Date.now();
        const timeBonus = Math.max(1, 5 - (now - lastMatchTime) / 1000);
        const newCombo = (now - lastMatchTime < 3000) ? combo + 1 : 1;
        
        setCombo(newCombo);
        setLastMatchTime(now);
        
        const points = Math.round(100 * newCombo * timeBonus);
        setScore(prev => prev + points);
        setEnergy(prev => Math.min(100, prev + 15));
        
        setTimeout(() => {
          setMatched([...matched, firstIdx, secondIdx]);
          setFlipped([]);
          setShowMatchInfo(firstCard.pairId);
          setIsProcessing(false);
          
          if (matched.length + 2 === cards.length) {
            setTimeout(() => {
              onGameOver(score + points);
              setView('END');
            }, 1000);
          }
          
          setTimeout(() => setShowMatchInfo(null), 2000);
        }, 600);
      } else {
        // NO MATCH
        setCombo(1);
        setEnergy(prev => Math.max(0, prev - 5));
        setTimeout(() => {
          setFlipped([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  if (view === 'INTRO') {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20">
            <Brain className="w-12 h-12 text-slate-900" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter italic">MEMORY PREVENTIVO</h2>
          <p className="text-slate-400 mb-8">Emparejá Riesgos con sus Mitigaciones antes de que se agote la energía del sistema.</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => startGame(6)}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
            >
              NIVEL PRINCIPIANTE (12 CARTAS)
            </button>
            <button 
              onClick={() => startGame(10)}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-all border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1"
            >
              NIVEL AVANZADO (20 CARTAS)
            </button>
          </div>
          
          <button onClick={onExit} className="mt-8 text-slate-500 hover:text-white flex items-center gap-2 mx-auto font-bold">
            <ArrowLeft className="w-4 h-4" /> VOLVER AL MENÚ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 font-mono">
      {/* HUD INDUSTRIAL */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-black">Sistema_Energía</span>
            <div className="w-48 h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mt-1">
              <motion.div 
                animate={{ width: `${energy}%` }}
                className={`h-full ${energy > 50 ? 'bg-emerald-500' : energy > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-black">Puntaje_Total</span>
            <span className="text-2xl font-black text-white tracking-tighter italic">{score.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
            <Zap className={`w-4 h-4 ${combo > 1 ? 'text-yellow-500 animate-pulse' : 'text-slate-600'}`} />
            <span className="text-sm font-black text-white">X{combo}</span>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
            <Timer className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-black text-white">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
          <button onClick={onExit} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* GRILLA DE CARTAS */}
      <div className={`max-w-5xl mx-auto grid ${difficulty > 8 ? 'grid-cols-4 md:grid-cols-5' : 'grid-cols-3 md:grid-cols-4'} gap-3`}>
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            layout
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCardClick(idx)}
            className="aspect-square relative cursor-pointer perspective-1000"
          >
            <div className={`w-full h-full transition-all duration-500 preserve-3d ${flipped.includes(idx) || matched.includes(idx) ? 'rotate-y-180' : ''}`}>
              {/* FRONT (BACK OF CARD) */}
              <div className="absolute inset-0 backface-hidden bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 border-2 border-slate-700 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-slate-600" />
                </div>
                <div className="absolute top-2 left-2 text-[8px] text-slate-600 font-bold">MEM_SYS_v2.0</div>
              </div>

              {/* BACK (FRONT OF CARD) */}
              <div 
                className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex flex-col items-center justify-center p-2 text-center shadow-xl border-2"
                style={{ backgroundColor: card.bgColor, borderColor: 'rgba(0,0,0,0.1)' }}
              >
                <span className="text-4xl mb-2">{card.content}</span>
                <span className="text-[10px] font-black text-slate-900 leading-tight uppercase">{card.titulo}</span>
                <div className="absolute top-1 right-1 px-1 bg-white/30 rounded text-[6px] font-bold text-slate-900">
                  {card.type}
                </div>
              </div>
            </div>
            
            {matched.includes(idx) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* POPUP DE INFORMACIÓN AL EMPAREJAR */}
      <AnimatePresence>
        {showMatchInfo !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl z-50 border-t-8 border-emerald-500"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-slate-900 font-black text-lg leading-tight uppercase italic">
                  {MEMORY_PAIRS[showMatchInfo].riesgo.titulo} + {MEMORY_PAIRS[showMatchInfo].mitigacion.titulo}
                </h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                  {MEMORY_PAIRS[showMatchInfo].riesgo.desc} <br/>
                  <span className="font-bold text-emerald-600">Solución:</span> {MEMORY_PAIRS[showMatchInfo].mitigacion.desc}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANTALLA DE RESULTADOS */}
      {view === 'END' && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm w-full bg-slate-800 border-2 border-slate-700 rounded-3xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <Trophy className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter italic uppercase">MISIÓN COMPLETADA</h2>
            <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-700">
              <div className="text-slate-500 text-xs uppercase font-black mb-1">Puntaje Final</div>
              <div className="text-5xl font-black text-emerald-500 tracking-tighter italic">{score.toLocaleString()}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-700/30 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase font-black">Tiempo</div>
                <div className="text-lg font-black text-white">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
              </div>
              <div className="bg-slate-700/30 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase font-black">Dificultad</div>
                <div className="text-lg font-black text-white">{difficulty === 6 ? 'BÁSICA' : 'AVANZADA'}</div>
              </div>
            </div>

            {onFinish && (
              <button 
                onClick={() => onFinish()}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 mb-3 flex items-center justify-center gap-2"
              >
                <Trophy size={18} /> FINALIZAR Y REGISTRAR
              </button>
            )}
            <button 
              onClick={() => setView('INTRO')}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-all border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 mb-3"
            >
              REINTENTAR MISIÓN
            </button>
            <button 
              onClick={onExit}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
            >
              SALIR AL MENÚ
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IndustrialMemoryGame;
