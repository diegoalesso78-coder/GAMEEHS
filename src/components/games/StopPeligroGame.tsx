
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  StopCircle, 
  Trophy, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Dices,
  Shield,
  Settings,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { STOP_PELIGRO_SHEETS_URL } from '../../constants';

// --- Types ---
interface StopData {
  letra: string;
  columna: string;
  respuesta: string;
  descripcion: string;
  accion: string;
  dificultad: number;
}

type RoundResult = {
  category: string;
  letter: string;
  guess: string;
  correctAnswer: string;
  isValid: boolean;
  points: number;
  descripcion: string;
  accion: string;
};

// --- Constants ---
const CATEGORIES = [
  { id: 'EPP', label: 'EPP', desc: 'Protección Personal', icon: Shield, color: 'bg-blue-500' },
  { id: 'CONTROL', label: 'CONTROL', desc: 'Medida de Riesgo', icon: Settings, color: 'bg-emerald-500' },
  { id: 'PELIGRO', label: 'PELIGRO', desc: 'Riesgo Detectado', icon: AlertTriangle, color: 'bg-amber-500' }
];

const ALPHABET = "ABCDEFGHILMNOPQRSTUVZ".split("");

export const StopPeligroGame = ({ onGameOver, onFinish }: { onGameOver: (score: number) => void, onFinish: (score: number) => void }) => {
  const [view, setView] = useState<'START' | 'CATEGORY_SELECT' | 'DICE_ROLL' | 'GUESS' | 'ROUND_RESULT' | 'FINAL_RESULT'>('START');
  const [totalRounds, setTotalRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [letter, setLetter] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<StopData | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalScore, setTotalScore] = useState(0);
  const [allData, setAllData] = useState<StopData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [displayLetter, setDisplayLetter] = useState('');
  const [results, setResults] = useState<RoundResult[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(STOP_PELIGRO_SHEETS_URL);
        const csv = await response.text();
        
        const parseCSV = (text: string) => {
          const rows: string[][] = [];
          let currentRow: string[] = [];
          let currentCell = '';
          let inQuotes = false;
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
              currentRow.push(currentCell.trim());
              currentCell = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
              if (currentCell || currentRow.length > 0) {
                currentRow.push(currentCell.trim());
                rows.push(currentRow);
                currentRow = [];
                currentCell = '';
              }
              if (char === '\r' && text[i+1] === '\n') i++;
            } else currentCell += char;
          }
          if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
          }
          return rows;
        };

        const rows = parseCSV(csv);
        if (rows.length < 2) throw new Error('Empty CSV');

        const headers = rows[0].map(h => h.toLowerCase());
        const getIdx = (name: string) => headers.findIndex(h => h.includes(name));
        
        const idx = {
          letra: getIdx('letra'),
          columna: getIdx('columna'),
          respuesta: getIdx('respuesta_ok'),
          descripcion: getIdx('descripcion'),
          accion: getIdx('accion_preventiva'),
          dificultad: getIdx('dificultad')
        };

        const data: StopData[] = rows.slice(1).map(row => {
          const catRaw = (row[idx.columna] || '').trim().toUpperCase();
          let catId = '';
          if (catRaw.includes('EPP')) catId = 'EPP';
          else if (catRaw.includes('CONTROL')) catId = 'CONTROL';
          else if (catRaw.includes('PELIGRO')) catId = 'PELIGRO';

          return {
            letra: (row[idx.letra] || '').trim().toUpperCase(),
            columna: catId,
            respuesta: (row[idx.respuesta] || '').trim().toUpperCase(),
            descripcion: row[idx.descripcion] || '',
            accion: row[idx.accion] || (row[idx.descripcion] || ''),
            dificultad: (row[idx.dificultad] || '').toLowerCase().includes('dificil') ? 300 : 100
          };
        }).filter(d => d.letra && d.columna && d.respuesta);

        setAllData(data);
        setIsLoading(false);
      } catch (e) {
        console.error('Error fetching StopPeligro data:', e);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const startGame = (rounds: number) => {
    setTotalRounds(rounds);
    setCurrentRound(1);
    setTotalScore(0);
    setResults([]);
    setView('CATEGORY_SELECT');
  };

  const handleCategorySelect = (cat: typeof CATEGORIES[0]) => {
    setSelectedCategory(cat);
    setView('DICE_ROLL');
    rollDice(cat.id);
  };

  const rollDice = (catId: string) => {
    setIsRolling(true);
    // Filter available letters for this category
    const availableData = allData.filter(d => d.columna === catId);
    const availableLetters = Array.from(new Set(availableData.map(d => d.letra)));
    
    const finalLetter = availableLetters.length > 0 
      ? availableLetters[Math.floor(Math.random() * availableLetters.length)]
      : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

    let rolls = 0;
    const interval = setInterval(() => {
      setDisplayLetter(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
      rolls++;
      if (rolls > 20) {
        clearInterval(interval);
        setLetter(finalLetter);
        setDisplayLetter(finalLetter);
        setIsRolling(false);
        
        // Pick a question
        const questions = allData.filter(d => d.columna === catId && d.letra === finalLetter);
        if (questions.length > 0) {
          setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
        } else {
          // Fallback if no data for that letter/cat
          setCurrentQuestion({
            letra: finalLetter,
            columna: catId,
            respuesta: 'ERROR',
            descripcion: 'No hay datos para esta combinación. Presiona Continuar.',
            accion: 'Reportar a EHS',
            dificultad: 0
          });
        }

        setTimeout(() => {
          setView('GUESS');
          setTimeLeft(30);
          setUserGuess('');
        }, 1000);
      }
    }, 50);
  };

  useEffect(() => {
    if (view === 'GUESS' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    } else if (view === 'GUESS' && timeLeft === 0) {
      submitGuess();
    }
  }, [view, timeLeft]);

  const submitGuess = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const isCorrect = userGuess.trim().toUpperCase() === currentQuestion?.respuesta;
    const points = isCorrect ? (currentQuestion?.dificultad || 100) + (timeLeft * 2) : 0;

    const result: RoundResult = {
      category: selectedCategory?.label || '',
      letter,
      guess: userGuess,
      correctAnswer: currentQuestion?.respuesta || '',
      isValid: isCorrect,
      points,
      descripcion: currentQuestion?.descripcion || '',
      accion: currentQuestion?.accion || ''
    };

    setResults(prev => [...prev, result]);
    setTotalScore(prev => prev + points);
    setView('ROUND_RESULT');
  };

  const nextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setView('CATEGORY_SELECT');
    } else {
      setView('FINAL_RESULT');
      onGameOver(totalScore);
    }
  };

  const renderStart = () => (
    <div className="p-8 max-w-2xl mx-auto text-center space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-red-600/20 rotate-12">
          <StopCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">STOP AL PELIGRO</h1>
        <p className="text-emerald-500 font-mono text-sm tracking-[0.3em] uppercase">Desafío de Vocabulario EHS</p>
      </motion.div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl text-left space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">¿Cómo jugar?</h3>
        </div>
        <div className="space-y-4 text-white/60 text-sm leading-relaxed">
          <p>1. <span className="text-white font-bold">Elige una categoría</span>: EPP, Control o Peligro.</p>
          <p>2. <span className="text-white font-bold">Lanza el dado</span> para obtener una letra aleatoria.</p>
          <p>3. <span className="text-white font-bold">Adivina la palabra</span> basándote en la descripción técnica.</p>
          <p>4. <span className="text-white font-bold">Aprende</span> la acción preventiva asociada.</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Seleccionar Rondas</p>
        <div className="flex justify-center gap-4">
          {[3, 5, 10].map(r => (
            <button
              key={r}
              onClick={() => setTotalRounds(r)}
              className={`w-16 h-16 rounded-2xl font-black text-xl transition-all ${
                totalRounds === r ? 'bg-emerald-500 text-slate-950 scale-110' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button
          onClick={() => startGame(totalRounds)}
          disabled={isLoading}
          className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isLoading ? 'CARGANDO DATOS...' : <><Play className="w-6 h-6 fill-current" /> COMENZAR DESAFÍO</>}
        </button>
      </div>
    </div>
  );

  const renderCategorySelect = () => (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <p className="text-emerald-500 font-mono text-xs tracking-[0.4em] uppercase">Ronda {currentRound} de {totalRounds}</p>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Elige tu Categoría</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategorySelect(cat)}
            className="relative group h-64 rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden flex flex-col items-center justify-center gap-4 p-8"
          >
            <div className={`absolute inset-0 ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className={`w-20 h-20 rounded-3xl ${cat.color} flex items-center justify-center shadow-2xl shadow-black/40`}>
              <cat.icon className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{cat.label}</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{cat.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderDiceRoll = () => (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-8">
      <div className="relative w-64 h-64 mb-12">
        <motion.div
          animate={isRolling ? { 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1]
          } : { rotate: 0 }}
          transition={isRolling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : {}}
          className="w-full h-full rounded-[2.5rem] border-8 border-white/10 bg-slate-900 flex items-center justify-center relative shadow-[0_0_50px_rgba(220,38,38,0.3)]"
        >
          <div className="absolute inset-4 border-2 border-white/5 rounded-[1.5rem]" />
          <motion.span 
            key={displayLetter}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {displayLetter}
          </motion.span>
        </motion.div>
        
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-red-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
          <Dices className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <p className="text-emerald-500 font-mono text-sm tracking-[0.4em] uppercase animate-pulse">
        {isRolling ? 'Lanzando Dado...' : '¡Letra Seleccionada!'}
      </p>
    </div>
  );

  const renderGuess = () => {
    const timerColor = timeLeft > 15 ? 'text-emerald-500' : timeLeft > 5 ? 'text-amber-500' : 'text-red-500';
    
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${selectedCategory?.color} flex items-center justify-center`}>
              {selectedCategory && <selectedCategory.icon className="w-6 h-6 text-white" />}
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{selectedCategory?.label}</p>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Letra {letter}</h2>
            </div>
          </div>
          <div className={`text-3xl font-mono font-black ${timerColor}`}>
            {timeLeft}s
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Lightbulb className="w-32 h-32 text-white" />
          </div>

          <div className="space-y-4 relative z-10">
            <p className="text-emerald-500 font-mono text-xs tracking-widest uppercase">Descripción:</p>
            <p className="text-2xl font-medium text-white leading-relaxed">
              {currentQuestion?.descripcion}
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">Tu Respuesta:</p>
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
              placeholder={`Empieza con ${letter}...`}
              autoFocus
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-6 text-3xl font-black text-white placeholder:text-white/5 outline-none focus:border-emerald-500 transition-colors uppercase"
            />
          </div>

          <button
            onClick={submitGuess}
            className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
          >
            ENVIAR RESPUESTA
          </button>
        </motion.div>
      </div>
    );
  };

  const renderRoundResult = () => {
    const lastResult = results[results.length - 1];
    
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${lastResult.isValid ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {lastResult.isValid ? <CheckCircle2 className="w-12 h-12 text-slate-950" /> : <XCircle className="w-12 h-12 text-white" />}
        </motion.div>

        <div className="space-y-2">
          <h2 className={`text-5xl font-black uppercase tracking-tighter ${lastResult.isValid ? 'text-emerald-500' : 'text-red-500'}`}>
            {lastResult.isValid ? '¡CORRECTO!' : '¡INCORRECTO!'}
          </h2>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
            {lastResult.isValid ? `Ganaste ${lastResult.points} puntos` : 'No sumaste puntos en esta ronda'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-left space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Tu respuesta</p>
              <p className={`text-xl font-black uppercase ${lastResult.isValid ? 'text-emerald-500' : 'text-red-500'}`}>
                {lastResult.guess || '---'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Respuesta Correcta</p>
              <p className="text-xl font-black text-white uppercase">{lastResult.correctAnswer}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Acción Preventiva</h3>
            </div>
            <p className="text-lg text-white/80 italic leading-relaxed">
              "{lastResult.accion}"
            </p>
          </div>
        </div>

        <button
          onClick={nextRound}
          className="w-full py-6 bg-white text-slate-950 font-black tracking-[0.3em] rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
        >
          {currentRound < totalRounds ? 'SIGUIENTE RONDA' : 'VER RESULTADO FINAL'}
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    );
  };

  const renderFinalResult = () => (
    <div className="p-8 max-w-2xl mx-auto text-center space-y-12">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
        <Trophy className="w-24 h-24 text-emerald-500 mx-auto" />
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">DESAFÍO COMPLETADO</h2>
        <p className="text-white/40 font-mono text-sm tracking-[0.4em] uppercase">Puntaje Total Acumulado</p>
        <div className="text-8xl font-black text-emerald-500 font-mono">{totalScore}</div>
      </motion.div>

      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-widest">¡Excelente trabajo preventivo!</h3>
        <p className="text-white/60 text-sm leading-relaxed italic">
          "En Mabe Córdoba, la seguridad no es una opción, es nuestra forma de trabajar. Conocer el vocabulario es el primer paso para identificar peligros y actuar a tiempo."
        </p>
        <div className="pt-6">
          <button
            onClick={() => onFinish(totalScore)}
            className="w-full py-6 bg-emerald-500 text-slate-950 font-black tracking-[0.3em] rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
          >
            FINALIZAR REPORTE
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-500 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'START' && renderStart()}
        {view === 'CATEGORY_SELECT' && renderCategorySelect()}
        {view === 'DICE_ROLL' && renderDiceRoll()}
        {view === 'GUESS' && renderGuess()}
        {view === 'ROUND_RESULT' && renderRoundResult()}
        {view === 'FINAL_RESULT' && renderFinalResult()}
      </AnimatePresence>
    </div>
  );
};
