import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, AlertTriangle, Play, RotateCcw, BarChart2, Trophy } from 'lucide-react';
import { TRUCO_SHEETS_URL, TRUCO_FALLBACK } from '../../constants';

// --- Types ---
interface CardData {
  id: string;
  n: number; // Number
  s: string; // Suit (espadas, bastos, oros, copas)
  p: number; // Power
  l: string; // Label
  d: string; // Description
}

interface HandResult {
  winner: 'player' | 'bot' | 'tie';
  playerCards: CardData[];
  botCards: CardData[];
  points: number;
}

// --- Constants & Helpers ---
const SUIT_COLORS: Record<string, string> = {
  espadas: '#000000',
  bastos: '#5D4037',
  oros: '#FFD700',
  copas: '#D32F2F',
};

const POWER_COLORS: Record<number, string> = {
  14: '#D32F2F', // Red
  13: '#F57C00', // Orange
  12: '#2E7D32', // Dark Green
  11: '#1976D2', // Blue
  10: '#FFA000', // Amber
  9: '#455A64',  // Dark Gray
  8: '#757575',  // Gray
};

const getPowerColor = (p: number) => {
  if (p >= 14) return POWER_COLORS[14];
  if (p >= 12) return POWER_COLORS[12];
  if (p >= 10) return POWER_COLORS[10];
  if (p >= 8) return POWER_COLORS[8];
  return '#333333';
};

const SuitIcon = ({ suit, className = "w-full h-full" }: { suit: string, className?: string }) => {
  const s = suit.toLowerCase();
  switch (s) {
    case 'espadas':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          {/* Blade */}
          <path d="M48 5 L52 5 L54 75 L46 75 Z" />
          {/* Guard */}
          <path d="M35 72 L65 72 L65 77 L35 77 Z" />
          {/* Handle */}
          <path d="M47 77 L53 77 L53 92 L47 92 Z" />
          {/* Pommel */}
          <circle cx="50" cy="94" r="4" />
        </svg>
      );
    case 'bastos':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          <path d="M40 10C35 10 30 15 30 25C30 45 40 80 50 90C60 80 70 45 70 25C70 15 65 10 60 10H40Z" />
          <circle cx="50" cy="25" r="5" fill="white" opacity="0.3" />
        </svg>
      );
    case 'oros':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
          <circle cx="50" cy="50" r="25" fill="currentColor" />
          <path d="M50 10L55 30H45L50 10Z" />
          <path d="M50 90L45 70H55L50 90Z" />
          <path d="M10 50L30 45V55L10 50Z" />
          <path d="M90 50L70 55V45L90 50Z" />
        </svg>
      );
    case 'copas':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          <path d="M25 10H75V40C75 55 65 65 50 65C35 65 25 55 25 40V10Z" />
          <path d="M45 65H55V85H45V65Z" />
          <path d="M30 85H70V95H30V85Z" />
        </svg>
      );
    default:
      return null;
  }
};

const Card = ({ card, isBot = false, isPlayed = false, onClick, isWinning = false, isLosing = false }: { 
  card: CardData, 
  isBot?: boolean, 
  isPlayed?: boolean, 
  onClick?: () => void,
  isWinning?: boolean,
  isLosing?: boolean
}) => {
  const suitKey = card.s.toLowerCase();
  if (isBot && !isPlayed) {
    return (
      <div className="w-32 h-48 bg-[#1B5E20] rounded-lg border-2 border-[#FFD700] shadow-2xl relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #FFD700 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
        <div className="text-[#FFD700] font-black text-2xl border-4 border-[#FFD700] rounded-full w-12 h-12 flex items-center justify-center">RS</div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={isPlayed ? { scale: 0.8, y: isBot ? -50 : 50, opacity: 0 } : false}
      animate={{ 
        scale: 1, 
        y: 0, 
        opacity: 1,
        boxShadow: isWinning ? '0 0 20px #FFD700' : '0 10px 25px rgba(0,0,0,0.4)',
        borderColor: isWinning ? '#FFD700' : '#000000'
      }}
      whileHover={!isPlayed && !isBot ? { y: -12, scale: 1.05 } : {}}
      onClick={onClick}
      className={`w-32 h-48 bg-[#f5f0e8] rounded-lg border-[1px] p-1 relative cursor-pointer select-none overflow-hidden ${isWinning ? 'animate-pulse border-4' : 'border-black'}`}
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
      }}
    >
      {/* Inner Frame */}
      <div className="absolute inset-1 border-[1px] border-black/20 rounded-md pointer-events-none" />

      {/* Corners */}
      <div className="absolute top-1 left-1 flex flex-col items-center leading-none">
        <span className="text-sm font-bold text-black">{card.n}</span>
        <div className="w-4 h-4" style={{ color: SUIT_COLORS[suitKey] }}>
          <SuitIcon suit={card.s} />
        </div>
      </div>
      <div className="absolute bottom-1 right-1 flex flex-col items-center leading-none rotate-180">
        <span className="text-sm font-bold text-black">{card.n}</span>
        <div className="w-4 h-4" style={{ color: SUIT_COLORS[suitKey] }}>
          <SuitIcon suit={card.s} />
        </div>
      </div>

      {/* Central Area */}
      <div className="h-full flex flex-col items-center justify-center text-center px-1 py-4">
        <div className="w-16 h-16 mb-2" style={{ color: SUIT_COLORS[suitKey] }}>
          <SuitIcon suit={card.s} />
        </div>
        <div 
          className="text-[10px] font-black uppercase tracking-wide leading-tight mb-1"
          style={{ color: getPowerColor(card.p) }}
        >
          {card.l}
        </div>
        <div className="text-[8px] leading-tight text-[#333333] line-clamp-2">
          {card.d}
        </div>
      </div>

      {/* Shake animation for losing */}
      {isLosing && (
        <motion.div
          animate={{ x: [-2, 2, -2, 2, 0] }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-red-500/10 pointer-events-none"
        />
      )}
    </motion.div>
  );
};

const ChalkStroke = ({ count, color = "#F5F5F5" }: { count: number, color?: string }) => {
  const groups = Math.floor(count / 5);
  const remainder = count % 5;

  return (
    <div className="flex flex-wrap gap-2" style={{ color }}>
      {Array.from({ length: groups }).map((_, i) => (
        <div key={i} className="relative w-6 h-8">
          <div className="absolute top-0 left-1 w-1 h-full bg-current rotate-[-5deg]" />
          <div className="absolute top-0 left-2.5 w-1 h-full bg-current rotate-[2deg]" />
          <div className="absolute top-0 left-4 w-1 h-full bg-current rotate-[-2deg]" />
          <div className="absolute top-0 left-5.5 w-1 h-full bg-current rotate-[5deg]" />
          <div className="absolute top-1/2 left-0 w-full h-1 bg-current rotate-[-20deg] -translate-y-1/2" />
        </div>
      ))}
      {remainder > 0 && (
        <div className="flex gap-1">
          {Array.from({ length: remainder }).map((_, i) => (
            <div key={i} className="w-1 h-8 bg-current" style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const TrucoGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [botHand, setBotHand] = useState<CardData[]>([]);
  const [table, setTable] = useState<{ player: CardData | null, bot: CardData | null }>({ player: null, bot: null });
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [currentHandRounds, setCurrentHandRounds] = useState<('player' | 'bot' | 'tie')[]>([]);
  const [turn, setTurn] = useState<'player' | 'bot'>('player');
  const [message, setMessage] = useState("");
  const [subMessage, setSubMessage] = useState("");
  const [trucoState, setTrucoState] = useState<'none' | 'called' | 'accepted'>('none');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [handResults, setHandResults] = useState<HandResult[]>([]);
  const [winningCardId, setWinningCardId] = useState<string | null>(null);
  const [losingCardId, setLosingCardId] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch(TRUCO_SHEETS_URL);
        const text = await response.text();
        const rows = text.split('\n').slice(1);
        const cards: CardData[] = rows.map(row => {
          const parts = row.split(',');
          if (parts.length < 6) return null;
          const [id, n, s, p, l, d] = parts.map(s => s.trim());
          return { id, n: parseInt(n), s, p: parseInt(p), l, d };
        }).filter(c => c !== null && !isNaN(c.n)) as CardData[];
        setDeck(cards.length > 0 ? cards : TRUCO_FALLBACK);
      } catch (e) {
        setDeck(TRUCO_FALLBACK);
      }
    };
    loadCards();
  }, []);

  const shuffleDeck = useCallback(() => {
    return [...deck].sort(() => Math.random() - 0.5);
  }, [deck]);

  const startNewHand = useCallback(() => {
    if (handsPlayed >= 4) {
      setGameState('result');
      onGameOver(playerScore);
      return;
    }

    const shuffled = shuffleDeck();
    setPlayerHand(shuffled.slice(0, 3));
    setBotHand(shuffled.slice(3, 6));
    setTable({ player: null, bot: null });
    setCurrentHandRounds([]);
    setTrucoState('none');
    setTurn(handsPlayed % 2 === 0 ? 'player' : 'bot');
    setMessage(`MANO ${handsPlayed + 1} DE 4`);
    setSubMessage("¡A jugar con seguridad!");
    
    if (handsPlayed % 2 !== 0) {
      // Bot starts
      setTimeout(() => botPlayLogic(shuffled.slice(3, 6), shuffled.slice(0, 3), null, []), 1500);
    }
  }, [handsPlayed, shuffleDeck]);

  const startGame = () => {
    setPlayerScore(0);
    setBotScore(0);
    setHandsPlayed(0);
    setHandResults([]);
    setGameState('playing');
    // We need to wait for deck to be loaded
    if (deck.length > 0) {
      startNewHand();
    }
  };

  // Trigger startNewHand when deck is loaded and we are in playing state
  useEffect(() => {
    if (gameState === 'playing' && deck.length > 0 && playerHand.length === 0 && handsPlayed === 0) {
      startNewHand();
    }
  }, [gameState, deck, playerHand.length, handsPlayed, startNewHand]);

  const resolveRound = (pCard: CardData, bCard: CardData) => {
    let winner: 'player' | 'bot' | 'tie';
    if (pCard.p > bCard.p) {
      winner = 'player';
      setWinningCardId(pCard.id);
      setLosingCardId(bCard.id);
    } else if (bCard.p > pCard.p) {
      winner = 'bot';
      setWinningCardId(bCard.id);
      setLosingCardId(pCard.id);
    } else {
      winner = 'tie';
    }

    const newRounds = [...currentHandRounds, winner];
    setCurrentHandRounds(newRounds);

    // Check for hand winner
    const pWins = newRounds.filter(r => r === 'player').length;
    const bWins = newRounds.filter(r => r === 'bot').length;
    const ties = newRounds.filter(r => r === 'tie').length;

    let handWinner: 'player' | 'bot' | null = null;

    if (pWins === 2) handWinner = 'player';
    else if (bWins === 2) handWinner = 'bot';
    else if (newRounds.length === 2 && ties === 1 && newRounds[0] !== 'tie') handWinner = newRounds[0] as 'player' | 'bot';
    else if (newRounds.length === 3) {
      if (pWins > bWins) handWinner = 'player';
      else if (bWins > pWins) handWinner = 'bot';
      else if (ties === 3) handWinner = handsPlayed % 2 === 0 ? 'player' : 'bot'; // Mano wins tie
      else if (ties === 2) handWinner = newRounds.find(r => r !== 'tie') as 'player' | 'bot';
      else if (newRounds[0] === 'tie') handWinner = newRounds[1] === 'player' ? 'player' : 'bot';
      else handWinner = newRounds[0] as 'player' | 'bot';
    }

    setTimeout(() => {
      setWinningCardId(null);
      setLosingCardId(null);
      setTable({ player: null, bot: null });

      if (handWinner) {
        const pts = trucoState === 'accepted' ? 2 : 1;
        if (handWinner === 'player') setPlayerScore(s => s + pts);
        else setBotScore(s => s + pts);
        
        setHandsPlayed(h => h + 1);
        setMessage(handWinner === 'player' ? "¡GANASTE LA MANO!" : "EL RIESGO GANÓ LA MANO");
        setSubMessage(handWinner === 'player' ? "Seguridad reforzada." : "Cuidado con las conductas.");
        
        setTimeout(() => startNewHand(), 2000);
      } else {
        const nextTurn = winner === 'tie' ? (handsPlayed % 2 === 0 ? 'player' : 'bot') : winner;
        setTurn(nextTurn);
        if (nextTurn === 'bot') {
          setTimeout(() => botPlayLogic(botHand, playerHand, null, newRounds), 1000);
        }
      }
    }, 2000);
  };

  const botPlayLogic = (currentBotHand: CardData[], currentPlayerHand: CardData[], pPlayedCard: CardData | null, rounds: ('player' | 'bot' | 'tie')[]) => {
    setIsBotThinking(true);
    setTimeout(() => {
      let chosenCard: CardData;

      if (pPlayedCard) {
        // Try to beat player card with minimum power
        const winners = currentBotHand.filter(c => c.p > pPlayedCard.p).sort((a, b) => a.p - b.p);
        if (winners.length > 0) {
          chosenCard = winners[0];
        } else {
          // Play weakest
          chosenCard = [...currentBotHand].sort((a, b) => a.p - b.p)[0];
        }
      } else {
        // Play medium card if first
        chosenCard = currentBotHand[Math.floor(Math.random() * currentBotHand.length)];
      }

      const newBotHand = currentBotHand.filter(c => c.id !== chosenCard.id);
      setBotHand(newBotHand);
      setTable(prev => ({ ...prev, bot: chosenCard }));
      setIsBotThinking(false);

      if (pPlayedCard) {
        resolveRound(pPlayedCard, chosenCard);
      } else {
        setTurn('player');
      }
    }, 2500);
  };

  const playPlayerCard = (card: CardData) => {
    if (turn !== 'player' || isBotThinking || table.player) return;

    const newHand = playerHand.filter(c => c.id !== card.id);
    setPlayerHand(newHand);
    setTable(prev => ({ ...prev, player: card }));

    if (table.bot) {
      resolveRound(card, table.bot);
    } else {
      setTurn('bot');
      botPlayLogic(botHand, newHand, card, currentHandRounds);
    }
  };

  const handleTruco = () => {
    if (turn !== 'player' || trucoState !== 'none' || isBotThinking) return;
    
    setMessage("¡INTERVENIR!");
    setSubMessage("Desafiando al Riesgo...");
    
    setTimeout(() => {
      const botBestPower = Math.max(...botHand.map(c => c.p));
      const accepts = botBestPower >= 8 || Math.random() > 0.5;

      if (accepts) {
        setTrucoState('accepted');
        setMessage("EL RIESGO ACEPTA");
        setSubMessage("La mano vale 2 puntos.");
      } else {
        // Bot folds
        setPlayerScore(s => s + 1);
        setHandsPlayed(h => h + 1);
        setMessage("EL RIESGO SE RETIRA");
        setSubMessage("Ganás 1 punto por la intervención.");
        setTimeout(() => startNewHand(), 2000);
      }
    }, 1500);
  };

  const handleFold = () => {
    if (turn !== 'player' || isBotThinking) return;
    const pts = trucoState === 'accepted' ? 2 : 1;
    setBotScore(s => s + pts);
    setHandsPlayed(h => h + 1);
    setMessage("TE RETIRASTE");
    setSubMessage(`El Riesgo suma ${pts} puntos.`);
    setTimeout(() => startNewHand(), 2000);
  };

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-7xl font-black text-[#FFD700] mb-2 tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        TRUCO SEGURO
      </motion.h1>
      <p className="text-xl text-white/80 mb-8 font-bold italic">El Desafío de la Conducta</p>
      
      <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-md mb-8">
        <h3 className="text-[#FFD700] font-bold mb-4 uppercase tracking-widest">Reglas de Operación</h3>
        <ul className="text-left text-sm text-white/70 space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mt-1.5 flex-shrink-0" />
            <span>Partida rápida a 4 manos contra "El Riesgo".</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mt-1.5 flex-shrink-0" />
            <span>Usá tus cartas de Seguridad para neutralizar peligros.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mt-1.5 flex-shrink-0" />
            <span>Intervení para duplicar puntos si tenés buenas cartas.</span>
          </li>
        </ul>
      </div>

      <button
        onClick={startGame}
        className="group relative px-12 py-4 bg-[#FFD700] text-black font-black text-xl rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Play fill="currentColor" /> JUGAR
        </span>
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
      </button>
    </div>
  );

  const renderResultScreen = () => {
    const playerWon = playerScore > botScore;
    const tie = playerScore === botScore;
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          {playerWon ? (
            <div className="w-32 h-32 bg-[#FFD700] rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,215,0,0.5)]">
              <Shield size={64} />
            </div>
          ) : tie ? (
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-white">
              <BarChart2 size={64} />
            </div>
          ) : (
            <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(220,38,38,0.5)]">
              <AlertTriangle size={64} />
            </div>
          )}
        </motion.div>

        <h2 className={`text-4xl md:text-6xl font-black mb-2 tracking-tighter uppercase ${playerWon ? 'text-emerald-400' : tie ? 'text-white' : 'text-red-500'}`}>
          {playerWon ? '¡RIESGO CONTROLADO!' : tie ? 'PARTIDA PAREJA' : 'EL RIESGO GANÓ'}
        </h2>
        <p className="text-white/60 mb-8 max-w-md">
          {playerWon 
            ? `Excelente gestión. La seguridad triunfó en las 4 manos.` 
            : tie 
            ? "Un empate técnico. La prevención debe ser constante." 
            : "Reforzá tus barreras preventivas. El riesgo encontró un camino."}
        </p>

        <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-xs">
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Tu Score</p>
            <p className="text-5xl font-black text-emerald-400">{playerScore}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Riesgo</p>
            <p className="text-5xl font-black text-red-500">{botScore}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          {onFinish && (
            <button
              onClick={() => onFinish()}
              className="px-8 py-4 bg-[#FFD700] text-black font-black rounded-full hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.3)] uppercase tracking-widest text-sm"
            >
              <Trophy size={20} /> FINALIZAR Y REGISTRAR
            </button>
          )}
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="flex-1 px-8 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors border border-white/10"
            >
              NUEVA PARTIDA
            </button>
            <button
              onClick={onExit}
              className="flex-1 px-8 py-3 bg-white/5 text-white/60 font-bold rounded-full hover:bg-white/10 transition-colors border border-white/5"
            >
              SALIR
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative w-full min-h-[800px] z-[10] bg-[#1C0A00] overflow-hidden flex flex-col rounded-3xl"
      style={{
        backgroundImage: `linear-gradient(rgba(28, 10, 0, 0.8), rgba(28, 10, 0, 0.8)), url("https://www.transparenttextures.com/patterns/wood-pattern.png")`
      }}
    >
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,220,100,0.08)_0%,transparent_60%)]" />

      {gameState === 'start' && renderStartScreen()}
      {gameState === 'result' && renderResultScreen()}

      {gameState === 'playing' && (
        <>
          {/* Header / Scoreboard */}
          <div className="p-4 pt-12 flex justify-between items-start relative z-10">
            {/* Player Score (Pizarrón) */}
            <div className="bg-[#2C1810] border-4 border-[#8B4513] p-3 rounded-lg shadow-2xl min-w-[140px]">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">VOS — Seguridad</p>
              <div className="text-[#F5F5F5] min-h-[40px]">
                <ChalkStroke count={playerScore} />
              </div>
            </div>

            {/* Hand Indicator */}
            <div className="flex flex-col items-center">
              <p className="text-[#FFD700] font-black text-sm mb-2 tracking-widest drop-shadow-md">MANO {handsPlayed + 1} DE 4</p>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                      i < handsPlayed ? 'bg-[#FFD700] border-[#FFD700]' : 
                      i === handsPlayed ? 'bg-white/20 border-white/40 animate-pulse' : 
                      'bg-transparent border-white/10'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Bot Score (Pizarrón) */}
            <div className="bg-[#2C1810] border-4 border-[#8B4513] p-3 rounded-lg shadow-2xl min-w-[140px] text-right">
              <p className="text-[10px] font-bold text-red-500/40 uppercase tracking-widest mb-1">EL RIESGO</p>
              <div className="text-[#DC143C] min-h-[40px] flex justify-end">
                <ChalkStroke count={botScore} color="#DC143C" />
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 relative flex items-center justify-center px-4">
            {/* Green Felt */}
            <div className="absolute w-[90%] h-[70%] max-w-4xl bg-[#0D3B1E] rounded-[40px] border-[3px] border-[#FFD700]/30 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]" />
            
            {/* Cards on Table */}
            <div className="relative z-10 flex gap-8 md:gap-16 items-center">
              <div className="flex flex-col items-center gap-2">
                <AnimatePresence mode="wait">
                  {table.bot && (
                    <motion.div
                      key={table.bot.id}
                      initial={{ y: -200, opacity: 0, rotate: -15 }}
                      animate={{ y: 0, opacity: 1, rotate: Math.random() * 10 - 5 }}
                    >
                      <Card card={table.bot} isBot={true} isPlayed={true} isWinning={winningCardId === table.bot.id} isLosing={losingCardId === table.bot.id} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-4 text-[8px] font-bold text-red-500 uppercase tracking-widest opacity-50">Riesgo</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <AnimatePresence mode="wait">
                  {table.player && (
                    <motion.div
                      key={table.player.id}
                      initial={{ y: 200, opacity: 0, rotate: 15 }}
                      animate={{ y: 0, opacity: 1, rotate: Math.random() * 10 - 5 }}
                    >
                      <Card card={table.player} isPlayed={true} isWinning={winningCardId === table.player.id} isLosing={losingCardId === table.player.id} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-4 text-[8px] font-bold text-emerald-500 uppercase tracking-widest opacity-50">Vos</div>
              </div>
            </div>

            {/* Message Panel */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-[8%] left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[280px] shadow-2xl pointer-events-none"
                >
                  <h3 className="text-[#FFD700] font-black text-xl mb-1 tracking-tight">{message}</h3>
                  <p className="text-white/60 text-xs uppercase tracking-widest">{subMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Area */}
          <div className="bg-[#1C0A00] border-t-2 border-white/5 p-6 relative z-20">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
              {/* Player Hand */}
              <div className="flex justify-center -space-x-8">
                {playerHand.map((card, i) => (
                  <div 
                    key={card.id}
                    className="relative transition-transform"
                    style={{ 
                      zIndex: i,
                      transform: `rotate(${(i - 1) * 8}deg) translateY(${Math.abs(i - 1) * 8}px)`
                    }}
                  >
                    <Card 
                      card={card} 
                      onClick={() => playPlayerCard(card)} 
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex-1 flex gap-4 w-full">
                <button
                  onClick={handleTruco}
                  disabled={turn !== 'player' || trucoState !== 'none' || isBotThinking}
                  className="flex-1 h-16 bg-gradient-to-b from-[#F97316] to-[#EA580C] border-b-4 border-[#9A3412] rounded-xl text-white font-black uppercase tracking-widest shadow-lg active:translate-y-1 active:border-b-0 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  INTERVENIR ⚡
                </button>
                <button
                  onClick={handleFold}
                  disabled={turn !== 'player' || isBotThinking}
                  className="flex-1 h-16 bg-gradient-to-b from-[#DC2626] to-[#991B1B] border-b-4 border-[#7F1D1D] rounded-xl text-white font-black uppercase tracking-widest shadow-lg active:translate-y-1 active:border-b-0 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  DETENER 🛑
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-6 right-6 z-[110] w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Terminar Partida (Small) */}
      {gameState === 'playing' && (
        <button
          onClick={() => setGameState('result')}
          className="absolute bottom-4 right-4 z-[110] text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/60 transition-colors"
        >
          Terminar Partida
        </button>
      )}
    </div>
  );
};
