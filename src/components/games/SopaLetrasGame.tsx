
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CheckCircle2, Timer, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

const WORDS = ['ARNES', 'CASCO', 'RIESGO', 'LOTO', 'FUEGO', 'SALUD'];
const GRID_SIZE = 10;

const generateGrid = () => {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Place words
  WORDS.forEach(word => {
    let placed = false;
    while (!placed) {
      const isHorizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE : GRID_SIZE - word.length));
      const col = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE - word.length : GRID_SIZE));

      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const r = isHorizontal ? row : row + i;
        const c = isHorizontal ? col + i : col;
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const r = isHorizontal ? row : row + i;
          const c = isHorizontal ? col + i : col;
          grid[r][c] = word[i];
        }
        placed = true;
      }
    }
  });

  // Fill empty cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
};

export const SopaLetrasGame = ({ onGameOver, onFinish }: { onGameOver: (score: number) => void, onFinish: (score: number) => void }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{r: number, c: number}[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setGrid(generateGrid());
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  const handleCellClick = (r: number, c: number) => {
    if (isFinished) return;
    
    const isAlreadySelected = selectedCells.some(cell => cell.r === r && cell.c === c);
    if (isAlreadySelected) {
      setSelectedCells(prev => prev.filter(cell => !(cell.r === r && cell.c === c)));
      return;
    }

    const newSelected = [...selectedCells, {r, c}];
    setSelectedCells(newSelected);

    // Check if selected cells form a word
    const currentWord = newSelected.map(cell => grid[cell.r][cell.c]).join('');
    const reversedWord = currentWord.split('').reverse().join('');

    if (WORDS.includes(currentWord) && !foundWords.includes(currentWord)) {
      setFoundWords(prev => [...prev, currentWord]);
      setSelectedCells([]);
      const points = 200;
      setScore(prev => prev + points);
      onGameOver(points);
      
      if (foundWords.length + 1 === WORDS.length) {
        setIsFinished(true);
      }
    } else if (WORDS.includes(reversedWord) && !foundWords.includes(reversedWord)) {
      setFoundWords(prev => [...prev, reversedWord]);
      setSelectedCells([]);
      const points = 200;
      setScore(prev => prev + points);
      onGameOver(points);

      if (foundWords.length + 1 === WORDS.length) {
        setIsFinished(true);
      }
    }
  };

  if (isFinished) {
    return (
      <div className="p-8 md:p-12 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl"
        >
          <Trophy className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-2">MISIÓN COMPLETADA</h2>
          <p className="text-white/40 font-mono text-sm tracking-widest uppercase mb-8">Puntaje Total Acumulado</p>
          
          <div className="text-6xl font-black text-emerald-500 mb-12 font-mono">
            {score}
          </div>
          
          <button
            onClick={() => onFinish(score)}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            FINALIZAR REPORTE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Search className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Sopa de Letras</h3>
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">Encontrá los conceptos de seguridad</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Tiempo</p>
            <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              <Timer className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Puntaje</p>
            <div className="text-emerald-500 font-mono font-bold text-xl">{score}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid Container */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-4 md:p-8 backdrop-blur-xl">
          <div className="grid grid-cols-10 gap-1 md:gap-2 aspect-square">
            {grid.map((row, r) => row.map((letter, c) => {
              const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`aspect-square flex items-center justify-center rounded-lg md:rounded-xl text-xs md:text-lg font-black transition-all ${
                    isSelected 
                      ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30' 
                      : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {letter}
                </button>
              );
            }))}
          </div>
        </div>

        {/* Word List */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Palabras a buscar</h4>
            <div className="space-y-3">
              {WORDS.map(word => {
                const isFound = foundWords.includes(word);
                return (
                  <div 
                    key={word} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isFound ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/5 text-white/40'
                    }`}
                  >
                    <span className={`font-bold tracking-widest ${isFound ? 'line-through opacity-50' : ''}`}>{word}</span>
                    {isFound && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
              Seleccioná las letras en orden para formar la palabra. Podés deseleccionar haciendo clic de nuevo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
