import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, LogOut, Trophy, ArrowRight } from 'lucide-react';
import { OCA_SHEETS_URL, OCA_FALLBACK } from '../../constants';

export const OcaSetup = ({ onStart, onBack }: { onStart: (p: any[]) => void, onBack: () => void }) => {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(['Operador 1', 'Operador 2', 'Operador 3', 'Operador 4']);
  return (
    <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-heavy w-full max-w-lg p-10 rounded-2xl border border-secondary/30 hard-shadow relative z-10"
      >
        <button onClick={onBack} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 mb-6 flex items-center gap-2 transition-opacity">
          <ArrowRight className="rotate-180" size={12} /> Volver
        </button>
        
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-headline font-black mb-1 md:mb-2 tracking-tighter">LA <span className="text-secondary">OCA</span></h2>
          <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-[0.2em] md:tracking-[0.3em] text-secondary opacity-70">Logística de Prevención</p>
        </div>

        <div className="mb-6 md:mb-10">
          <p className="text-[8px] md:text-[10px] font-headline uppercase font-black mb-3 md:mb-4 opacity-50 text-center tracking-widest">Configuración de Escuadrón</p>
          <div className="flex gap-2 md:gap-4 justify-center">
            {[2, 3, 4].map(n => (
              <button 
                key={n} 
                onClick={() => setCount(n)} 
                className={`w-10 h-10 md:w-14 md:h-14 rounded-sm font-headline font-black transition-all border-2 ${count === n ? 'bg-secondary text-black border-secondary hard-shadow-sm scale-110' : 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-10">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 rounded-sm flex items-center justify-center text-[8px] md:text-[10px] font-headline font-black bg-white/10 text-secondary group-focus-within:bg-secondary group-focus-within:text-black transition-colors">
                {i + 1}
              </div>
              <input 
                type="text" 
                value={names[i]} 
                onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }} 
                className="w-full bg-black/40 border border-white/10 focus:border-secondary/50 outline-none py-3 md:py-4 pl-10 md:pl-12 pr-4 uppercase font-headline font-black text-[10px] md:text-xs tracking-widest transition-all rounded-sm" 
                placeholder={`ID Op ${i+1}`} 
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => onStart(names.slice(0, count).map(n => ({ name: n })))} 
          className="btn-industrial-orange w-full py-5 text-black font-headline font-black uppercase tracking-widest text-sm"
        >
          INICIAR OPERACIÓN
        </button>
      </motion.div>
    </div>
  );
};

export const OcaWinner = ({ player, onRestart, onFinish }: { player: any, onRestart: () => void, onFinish?: (score?: number) => void }) => {
  return (
    <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel-heavy w-full max-w-lg p-10 rounded-2xl border-2 border-secondary text-center hard-shadow relative z-10"
      >
        <Trophy className="mx-auto text-secondary mb-6" size={80} />
        <h2 className="text-4xl md:text-6xl font-headline font-black mb-2 tracking-tighter uppercase">¡MISIÓN CUMPLIDA!</h2>
        <p className="text-xl md:text-2xl font-headline font-black text-secondary mb-8 uppercase tracking-widest">{player.name} ha llegado a la meta</p>
        
        <div className="bg-black/40 p-6 rounded-xl border border-white/10 mb-8">
          <p className="text-sm opacity-70 font-body italic">"La seguridad no es un destino, es un viaje que hacemos todos los días. ¡Excelente trabajo!"</p>
        </div>

        <div className="flex flex-col gap-3">
          {onFinish && (
            <button 
              onClick={() => onFinish()}
              className="btn-industrial-orange w-full py-5 text-black font-headline font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <Trophy size={18} /> FINALIZAR Y REGISTRAR
            </button>
          )}
          <button 
            onClick={onRestart}
            className="w-full py-5 bg-white/10 hover:bg-white/20 text-white font-headline font-black uppercase tracking-widest text-sm rounded-sm transition-all"
          >
            NUEVA OPERACIÓN
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const OcaGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: (score?: number) => void }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'WINNER'>('SETUP');
  const [players, setPlayers] = useState<any[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [modal, setModal] = useState<any>(null);
  const [gameData, setGameData] = useState(OCA_FALLBACK);

  useEffect(() => {
    fetch(OCA_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = { riesgos: [], barreras: [], trivias: [], preguntas: [] as any[] };
        
        lines.forEach(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 6) return;
          
          const [tipo, pregunta, respuesta, opciones, nivel, casilla] = cols;
          const squareNum = parseInt(casilla);
          const typeLower = tipo.toLowerCase();
          
          if (typeLower === 'riesgo') {
            if (!isNaN(squareNum)) (parsed.riesgos as any).push(squareNum);
            parsed.preguntas.push({ q: pregunta, a: respuesta, sq: squareNum, tipo: 'riesgo' });
          } else if (typeLower === 'barrera') {
            if (!isNaN(squareNum)) (parsed.barreras as any).push(squareNum);
            parsed.preguntas.push({ q: pregunta, a: respuesta, sq: squareNum, tipo: 'barrera' });
          } else if (typeLower === 'trivia') {
            if (!isNaN(squareNum)) (parsed.trivias as any).push(squareNum);
            parsed.preguntas.push({
              q: pregunta,
              a: respuesta,
              o: opciones.split('|').map(o => o.trim()),
              sq: squareNum,
              tipo: 'trivia'
            });
          }
        });

        if (parsed.trivias.length === 0 && parsed.preguntas.some(p => p.tipo === 'trivia')) {
          parsed.trivias = [4, 10, 17, 24, 33, 40, 47, 53, 59].filter(s => 
            !parsed.riesgos.includes(s as never) && !parsed.barreras.includes(s as never)
          ) as any;
        }

        if (parsed.preguntas.length > 0) {
          setGameData(parsed as any);
        }
      })
      .catch(err => console.warn("Usando fallback data:", err));
  }, []);

  const board = useMemo(() => {
    const b = [];
    for (let i = 1; i <= 63; i++) {
      let type = 'normal';
      let icon = null;
      if (gameData.riesgos.includes(i)) { type = 'riesgo'; icon = '⚠️'; }
      else if (gameData.barreras.includes(i)) { type = 'barrera'; icon = '🛡️'; }
      else if (gameData.trivias.includes(i)) { type = 'trivia'; icon = '❓'; }
      b.push({ id: i, type, icon });
    }
    return b;
  }, [gameData]);

  const handleStart = (pData: any[]) => {
    setPlayers(pData.map((p, i) => ({ 
      ...p, 
      pos: 1, 
      color: ['#ec6a06', '#f7be1d', '#3b82f6', '#10b981', '#a855f7', '#f43f5e'][i] 
    })));
    setGameState('PLAYING');
  };

  const rollDice = () => {
    if (isRolling || modal) return;
    setIsRolling(true);
    setTimeout(() => {
      const res = Math.floor(Math.random() * 6) + 1;
      setDice(res);
      setIsRolling(false);
      setTimeout(() => movePlayer(res), 600);
    }, 1200);
  };

  const movePlayer = (steps: number) => {
    const currentPos = players[currentPlayer].pos;
    let newPos = currentPos + steps;
    
    if (newPos > 63) {
      newPos = 63 - (newPos - 63);
    }
    
    setPlayers(prev => {
      const next = [...prev];
      next[currentPlayer].pos = newPos;
      return next;
    });

    setTimeout(() => checkSquare(newPos), 800);
  };

  const checkSquare = (pos: number) => {
    const sq = board[pos - 1];
    if (pos === 63) { 
      setGameState('WINNER'); 
      onGameOver(100);
      return; 
    }

    if (sq.type === 'riesgo') {
      const riskData = gameData.preguntas.find(p => p.sq === pos && p.tipo === 'riesgo');
      const backMatch = riskData?.a.match(/\d+/);
      const back = backMatch ? parseInt(backMatch[0]) : Math.floor(Math.random() * 4) + 3;
      
      setModal({
        title: '¡RIESGO DETECTADO!',
        text: riskData ? `${riskData.q}. Retrocedés ${back} casillas.` : `Condición insegura. Retrocedés ${back} casillas.`,
        icon: '⚠️',
        color: 'text-error-rose',
        onConfirm: () => {
          setPlayers(prev => {
            const next = [...prev];
            next[currentPlayer].pos = Math.max(1, pos - back);
            return next;
          });
          setModal(null);
          nextTurn();
        }
      });
    } else if (sq.type === 'barrera') {
      const barrierData = gameData.preguntas.find(p => p.sq === pos && p.tipo === 'barrera');
      const fwdMatch = barrierData?.a.match(/\d+/);
      const fwd = fwdMatch ? parseInt(fwdMatch[0]) : Math.floor(Math.random() * 3) + 3;
      
      setModal({
        title: '¡BARRERA ACTIVA!',
        text: barrierData ? `${barrierData.q}. Avanzás ${fwd} casillas.` : `Control efectivo. Avanzás ${fwd} casillas.`,
        icon: '🛡️',
        color: 'text-emerald-400',
        onConfirm: () => {
          setPlayers(prev => {
            const next = [...prev];
            next[currentPlayer].pos = Math.min(63, pos + fwd);
            return next;
          });
          setModal(null);
          nextTurn();
        }
      });
    } else if (sq.type === 'trivia') {
      const triviaQuestions = gameData.preguntas.filter(p => p.tipo === 'trivia');
      let questionData = triviaQuestions.find(p => p.sq === pos) || 
                         triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
      
      if (!questionData) {
        const fallback = OCA_FALLBACK.preguntas[Math.floor(Math.random() * OCA_FALLBACK.preguntas.length)];
        questionData = { ...fallback, sq: pos, tipo: 'trivia' };
      }
      
      setModal({
        type: 'TRIVIA',
        title: 'DESAFÍO TÉCNICO',
        text: questionData.q,
        options: questionData.o,
        answer: questionData.a,
        icon: '❓',
        color: 'text-tertiary',
        onConfirm: (sel: string) => {
          if (sel === questionData.a) {
            setPlayers(prev => {
              const next = [...prev];
              next[currentPlayer].pos = Math.min(63, pos + 2);
              return next;
            });
            setModal({ title: '¡CORRECTO!', text: 'Avanzás 2 casillas extra.', icon: '✅', color: 'text-emerald-400', onConfirm: () => { setModal(null); nextTurn(); } });
          } else {
            setModal({ title: 'INCORRECTO', text: `La respuesta era: ${questionData.a}. Te quedás en esta posición.`, icon: '❌', color: 'text-error-rose', onConfirm: () => { setModal(null); nextTurn(); } });
          }
        }
      });
    } else {
      nextTurn();
    }
  };

  const nextTurn = () => setCurrentPlayer((currentPlayer + 1) % players.length);

  if (gameState === 'SETUP') return <OcaSetup onStart={handleStart} onBack={onExit} />;
  if (gameState === 'WINNER') return <OcaWinner player={players[currentPlayer]} onRestart={() => window.location.reload()} onFinish={onFinish} />;

  return (
    <div className="h-screen flex flex-col lg:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden obsidian-table relative">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
      
      <aside className="w-full lg:w-80 glass-panel-heavy p-4 md:p-6 rounded-xl hard-shadow flex flex-col gap-2 md:gap-4 relative z-10 shrink-0">
        <div className="flex justify-between items-center lg:flex-col lg:items-stretch gap-2">
          <button 
            onClick={() => {
              const score = Math.floor((players[currentPlayer].pos / 63) * 100);
              onGameOver(score);
              if (onFinish) {
                onFinish(score);
              } else {
                onExit();
              }
            }}
            className="flex-1 lg:flex-none px-4 md:px-6 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all"
          >
            Finalizar
          </button>
          <button onClick={onExit} className="flex-1 lg:flex-none justify-center lg:justify-start text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-2 transition-opacity">
            <LogOut size={12} /> Salir
          </button>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 my-1 md:my-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary flex items-center justify-center rounded-sm hard-shadow-sm shrink-0">
            <LayoutGrid className="text-black" size={20} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-headline font-black tracking-tighter leading-none">LA <span className="text-secondary">OCA</span></h2>
            <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-50">Logística de Seguridad</p>
          </div>
        </div>

        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[20vh] lg:max-h-[40vh] pb-2 lg:pr-2 custom-scrollbar">
          {players.map((p, i) => (
            <div key={i} className={`p-2 md:p-3 rounded-sm border-l-4 flex items-center gap-2 md:gap-3 transition-all min-w-[120px] lg:min-w-0 ${currentPlayer === i ? 'bg-secondary/10 border-secondary hard-shadow-sm' : 'bg-white/5 border-transparent opacity-50'}`}>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-sm flex items-center justify-center text-black font-black hard-shadow-sm shrink-0 text-[10px] md:text-xs" style={{ backgroundColor: p.color }}>{p.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs font-headline font-black uppercase truncate">{p.name}</p>
                <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${(p.pos / 63) * 100}%` }} />
                  </div>
                  <span className="text-[8px] md:text-[10px] font-mono opacity-60">{p.pos}/63</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center lg:flex-col gap-3 md:gap-4 p-3 md:p-6 bg-black/40 rounded-xl border border-white/5 hard-shadow">
          <div className="relative shrink-0">
            <div className={`w-12 h-12 md:w-20 md:h-20 bg-white rounded-xl flex items-center justify-center text-2xl md:text-4xl text-black font-black hard-shadow transition-transform ${isRolling ? 'animate-spin' : ''}`}>
              {dice}
            </div>
            {isRolling && (
              <div className="absolute -inset-2 md:-inset-4 border-2 border-secondary/30 rounded-full animate-ping pointer-events-none" />
            )}
          </div>
          
          <button 
            onClick={rollDice} 
            disabled={isRolling || !!modal} 
            className="btn-industrial-orange flex-1 lg:w-full py-3 md:py-4 disabled:opacity-30 text-black font-headline font-black uppercase tracking-widest text-[10px] md:text-xs"
          >
            {isRolling ? '...' : 'LANZAR DADO'}
          </button>
        </div>
      </aside>

      <main className="flex-1 glass-panel-heavy rounded-xl p-2 md:p-6 overflow-hidden flex items-center justify-center border border-white/10 relative z-10">
        <div className="absolute top-2 right-2 flex items-center gap-2 md:gap-4 text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-30 z-20">
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-error-rose rounded-full" /> Riesgo</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full" /> Barrera</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-400 rounded-full" /> Trivia</div>
        </div>

        <div className="grid grid-cols-9 gap-0.5 md:gap-1 w-full max-w-4xl aspect-[9/7] p-1 md:p-2 bg-black/20 rounded-lg border border-white/5 overflow-auto">
          {Array.from({ length: 7 }).map((_, r) => {
            const rowIdx = 6 - r;
            let rowSquares = board.slice(rowIdx * 9, (rowIdx + 1) * 9);
            if (rowIdx % 2 !== 0) rowSquares = [...rowSquares].reverse();
            return rowSquares.map(sq => (
              <div key={sq.id} className={`relative border border-white/5 flex flex-col items-center justify-center rounded-sm text-center transition-colors
                ${sq.type === 'riesgo' ? 'bg-error-rose/10 border-error-rose/20' : 
                  sq.type === 'barrera' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                  sq.type === 'trivia' ? 'bg-amber-500/10 border-amber-500/20' : 
                  'bg-white/5'}
                ${sq.id === 63 ? 'bg-secondary/20 border-secondary/40' : ''}
              `}>
                <span className="absolute top-0.5 left-1 text-[8px] font-mono opacity-30">{sq.id}</span>
                <span className={`text-lg filter drop-shadow-md ${isRolling ? 'blur-[1px]' : ''}`}>{sq.icon}</span>
                
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1">
                  {players.map((p, pi) => p.pos === sq.id && (
                    <motion.div 
                      layoutId={`player-${pi}`} 
                      key={pi} 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-xs font-black text-white hard-shadow-sm z-20" 
                      style={{ 
                        backgroundColor: p.color,
                        boxShadow: `0 0 15px ${p.color}80`,
                        transform: `translate(${(pi % 2) * 4}px, ${(pi > 1 ? 4 : 0)}px)`
                      }}
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {p.name[0]}
                    </motion.div>
                  ))}
                </div>
                
                {sq.id === 63 && <Trophy className="absolute bottom-1 right-1 text-secondary opacity-20" size={12} />}
              </div>
            ));
          })}
        </div>
      </main>

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel-heavy w-full max-w-md p-8 rounded-2xl border-2 border-secondary text-center">
              <div className="text-5xl mb-4">{modal.icon}</div>
              <h3 className={`text-2xl font-headline font-black mb-2 uppercase tracking-tighter ${modal.color}`}>{modal.title}</h3>
              <p className="text-sm text-on-surface-variant mb-6 font-body">{modal.text}</p>
              {modal.type === 'TRIVIA' ? (
                <div className="flex flex-col gap-2">
                  {modal.options.map((o: string, i: number) => (
                    <button key={i} onClick={() => modal.onConfirm(o)} className="w-full bg-white/5 hover:bg-white/10 text-white p-3 rounded-lg text-xs font-headline font-bold transition-all border border-white/10">{o}</button>
                  ))}
                </div>
              ) : (
                <button onClick={modal.onConfirm} className="btn-industrial-orange text-black font-headline font-black px-8 py-3 rounded-sm hard-shadow uppercase text-xs tracking-widest">Continuar</button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
