
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, Timer, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

interface Question {
  q: string;
  o: string[];
  a: string;
  exp: string;
}

const TRIVIA_QUESTIONS: Question[] = [
  {
    q: "¿Cuál es la jerarquía de controles de mayor a menor efectividad?",
    o: ["EPP, Administrativo, Ingeniería, Sustitución, Eliminación", "Eliminación, Sustitución, Ingeniería, Administrativo, EPP", "Ingeniería, EPP, Eliminación, Sustitución, Administrativo", "Administrativo, EPP, Ingeniería, Sustitución, Eliminación"],
    a: "Eliminación, Sustitución, Ingeniería, Administrativo, EPP",
    exp: "La eliminación del riesgo es siempre la medida más efectiva, mientras que el EPP es la última barrera."
  },
  {
    q: "¿Qué significa el color amarillo en la señalética de seguridad?",
    o: ["Prohibición", "Obligación", "Advertencia", "Información"],
    a: "Advertencia",
    exp: "El amarillo indica precaución o advertencia ante un riesgo potencial."
  },
  {
    q: "¿A partir de qué altura se considera 'Trabajo en Altura' según la normativa general?",
    o: ["1.0 metro", "1.5 metros", "1.8 metros", "2.0 metros"],
    a: "1.8 metros",
    exp: "A partir de 1.80m es obligatorio el uso de arnés y sistemas de protección contra caídas."
  },
  {
    q: "¿Qué tipo de extintor es el más adecuado para fuegos eléctricos (Clase C)?",
    o: ["Agua presurizada", "Espuma química", "Dióxido de Carbono (CO2)", "Arena seca"],
    a: "Dióxido de Carbono (CO2)",
    exp: "El CO2 no es conductor de electricidad y no deja residuos dañinos en equipos electrónicos."
  },
  {
    q: "¿Qué es un 'incidente' de trabajo?",
    o: ["Un accidente con lesión leve", "Un suceso que pudo ser un accidente pero no hubo lesión", "Una enfermedad profesional", "Una multa del ministerio"],
    a: "Un suceso que pudo ser un accidente pero no hubo lesión",
    exp: "Los incidentes son avisos críticos que permiten prevenir futuros accidentes reales."
  }
];

export const TriviaGame = ({ onGameOver, onFinish }: { onGameOver: (score: number) => void, onFinish: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !showFeedback && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleAnswer("");
    }
  }, [timeLeft, showFeedback, isFinished]);

  const handleAnswer = (option: string) => {
    const correct = option === TRIVIA_QUESTIONS[currentIdx].a;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      const points = 100 + (timeLeft * 10);
      setScore(prev => prev + points);
      onGameOver(points);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < TRIVIA_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(15);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
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
          <h2 className="text-4xl font-black text-white mb-2">VALIDACIÓN COMPLETADA</h2>
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

  const q = TRIVIA_QUESTIONS[currentIdx];

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Trivia Preventiva</h3>
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">Pregunta {currentIdx + 1} de {TRIVIA_QUESTIONS.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Tiempo</p>
            <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
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

      <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: "100%" }}
            animate={{ width: showFeedback ? "100%" : "0%" }}
            transition={{ duration: timeLeft, ease: "linear" }}
            key={currentIdx}
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 leading-tight">
          {q.q}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {q.o.map((option, i) => (
            <button
              key={i}
              disabled={showFeedback}
              onClick={() => handleAnswer(option)}
              className={`w-full p-6 rounded-2xl text-left transition-all flex items-center justify-between group ${
                showFeedback 
                  ? option === q.a 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                    : option === (isCorrect ? '' : option) // This is a bit hacky but works for feedback
                      ? 'bg-red-500/10 border-red-500/30 text-white/40'
                      : 'bg-white/5 border-white/10 text-white/40'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
              } border`}
            >
              <span className="text-sm md:text-base font-medium">{option}</span>
              {showFeedback && option === q.a && <CheckCircle2 className="w-5 h-5" />}
              {showFeedback && !isCorrect && option !== q.a && <XCircle className="w-5 h-5 text-red-500/50" />}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className={`w-5 h-5 ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`} />
                <h4 className={`text-sm font-bold uppercase tracking-widest ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isCorrect ? '¡Correcto!' : 'Respuesta Incorrecta'}
                </h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {q.exp}
              </p>
              <button
                onClick={nextQuestion}
                className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                Siguiente Pregunta
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
