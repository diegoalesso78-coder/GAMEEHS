import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Monitor, Play, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAZADOR_SHEETS_URL, CAZADOR_FALLBACK } from '../../constants';

const getDirectImageUrl = (url: string) => {
  if (!url) return '';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('drive.google.com')) {
    let fileId = '';
    const match = url.match(/\/d\/([^/]+)/i) || url.match(/id=([^&]+)/i);
    if (match) fileId = match[1];
    if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
};

export const CazadorDeRiesgosGame = ({ onExit, onGameOver, onFinish }: { onExit: () => void, onGameOver: (score: number) => void, onFinish?: () => void }) => {
  const [scenes, setScenes] = useState<any[]>([]);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'SELECT' | 'PLAY' | 'RESULT'>('SELECT');
  const [lastClick, setLastClick] = useState<{ x: number, y: number, success: boolean } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch(CAZADOR_SHEETS_URL);
        const csv = await response.text();
        const rows = csv.split('\n').filter(row => row.trim() !== '').slice(1);
        
        const grouped: { [key: string]: any } = {};
        rows.forEach(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          
          const escena = cols[0] || "Escena Desconocida";
          const imgUrl = getDirectImageUrl(cols[1]); 
          if (!imgUrl) return;
          
          if (!grouped[imgUrl]) {
            grouped[imgUrl] = {
              id: Math.random().toString(36).substring(7),
              escena: escena,
              imagen_url: imgUrl,
              peligros: []
            };
          }
          
          const x = parseFloat(cols[3]);
          const y = parseFloat(cols[4]);
          const radio = parseFloat(cols[5]) || 35;
          
          if (!isNaN(x) && !isNaN(y)) {
            grouped[imgUrl].peligros.push({
              id: Math.random(),
              peligro: cols[2] || "Riesgo No Identificado",
              x: x,
              y: y,
              radio: radio,
              medida: cols[6] || "Sin medida preventiva registrada",
              norma: cols[7] || "Normativa General EHS"
            });
          }
        });
        
        const parsed = Object.values(grouped);
        if (parsed.length > 0) {
          setScenes(parsed);
          if (parsed.length === 1) {
            handleStartScene(parsed[0]);
          }
        } else {
          setScenes(CAZADOR_FALLBACK);
        }
      } catch (error) {
        console.error("Error fetching scenes:", error);
        setScenes(CAZADOR_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchScenes();
  }, []);

  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAY' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'PLAY') {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStartScene = (scene: any) => {
    setSelectedScene(scene);
    setFoundIds([]);
    setTimeLeft(60);
    setScore(0);
    setGameState('PLAY');
  };

  const [scannerPos, setScannerPos] = useState({ x: 0, y: 0 });
  const [showScanner, setShowScanner] = useState(false);
  const [activePeligro, setActivePeligro] = useState<any>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState !== 'PLAY' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setScannerPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowScanner(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (gameState !== 'PLAY' || !selectedScene || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const refX = (clickX / rect.width) * 800;
    const refY = (clickY / rect.height) * 500;
    
    let found = false;
    
    selectedScene.peligros.forEach((p: any) => {
      if (foundIds.includes(p.id)) return;
      
      const dist = Math.sqrt(Math.pow(refX - p.x, 2) + Math.pow(refY - p.y, 2));
      if (dist <= p.radio) {
        setFoundIds(prev => [...prev, p.id]);
        setScore(s => s + 100);
        found = true;
        setActivePeligro(p);
        setTimeout(() => setActivePeligro(null), 4000);
      }
    });

    setLastClick({ x: clickX, y: clickY, success: found });
    setTimeout(() => setLastClick(null), 800);

    if (found && foundIds.length + 1 === selectedScene.peligros.length) {
      setTimeout(handleGameOver, 2000);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== 'PLAY' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setScannerPos({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setShowScanner(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'PLAY' || !selectedScene || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clickX = touch.clientX - rect.left;
    const clickY = touch.clientY - rect.top;
    
    const refX = (clickX / rect.width) * 800;
    const refY = (clickY / rect.height) * 500;
    
    let found = false;
    
    selectedScene.peligros.forEach((p: any) => {
      if (foundIds.includes(p.id)) return;
      
      const dist = Math.sqrt(Math.pow(refX - p.x, 2) + Math.pow(refY - p.y, 2));
      if (dist <= p.radio) {
        setFoundIds(prev => [...prev, p.id]);
        setScore(s => s + 100);
        found = true;
        setActivePeligro(p);
        setTimeout(() => setActivePeligro(null), 4000);
      }
    });

    setLastClick({ x: clickX, y: clickY, success: found });
    setTimeout(() => setLastClick(null), 800);

    if (found && foundIds.length + 1 === selectedScene.peligros.length) {
      setTimeout(handleGameOver, 2000);
    }
  };

  const handleGameOver = () => {
    const timeBonus = timeLeft * 5;
    const finalScore = score + timeBonus;
    setScore(finalScore);
    setGameState('RESULT');
    onGameOver(finalScore);
    
    const localRanking = JSON.parse(localStorage.getItem(`ranking_cazador_${selectedScene.escena}`) || '[]');
    const newRanking = [...localRanking, { score: finalScore, date: new Date().toLocaleDateString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    localStorage.setItem(`ranking_cazador_${selectedScene.escena}`, JSON.stringify(newRanking));
    setRanking(newRanking);

    if (foundIds.length === selectedScene.peligros.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const renderFallbackSVG = (sceneName: string) => {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-full bg-slate-900">
        <rect x="0" y="400" width="800" height="100" fill="#1e293b" />
        <rect x="50" y="100" width="700" height="300" fill="#0f172a" stroke="#334155" />
        
        {sceneName === "Taller de Mantenimiento" ? (
          <>
            <path d="M100,400 Q150,350 200,400" stroke="#fbbf24" strokeWidth="4" fill="none" strokeDasharray="8 4" />
            <rect x="680" y="320" width="60" height="60" fill="#92400e" />
            <text x="710" y="310" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">SALIDA</text>
            <rect x="40" y="180" width="20" height="50" fill="#ef4444" rx="5" />
            <circle cx="400" cy="150" r="20" fill="#fde68a" />
            <rect x="380" y="170" width="40" height="60" fill="#3b82f6" />
          </>
        ) : (
          <>
            <ellipse cx="300" cy="450" rx="60" ry="20" fill="#475569" opacity="0.6" />
            <rect x="550" y="50" width="100" height="20" fill="#ef4444" />
            <rect x="550" y="80" width="100" height="20" fill="#ef4444" />
            <rect x="550" y="110" width="100" height="20" fill="#ef4444" />
            <circle cx="400" cy="50" r="15" fill="#1e293b" stroke="#334155" />
          </>
        )}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-rose-500 font-black tracking-widest uppercase text-xs">Escaneando Planta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-rose-500 selection:text-black flex flex-col">
      <div className="px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/40">
            <Search className="text-rose-600" size={20} />
          </div>
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase text-white/40">Misión_10</h2>
            <h1 className="text-sm font-black tracking-tight uppercase">Cazador de Riesgos</h1>
          </div>
        </div>
        
        {gameState === 'PLAY' && (
          <div className="flex items-center gap-12">
            <div className="text-center">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Peligros</p>
              <p className="text-xl font-black text-white tabular-nums">{foundIds.length} / {selectedScene.peligros.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tiempo</p>
              <p className={`text-xl font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : timeLeft < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {timeLeft}s
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Puntaje</p>
            <p className="text-xl font-black text-rose-500 tabular-nums">{score.toLocaleString()}</p>
          </div>
          <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'SELECT' && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 p-8 pt-12 overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Seleccioná una <span className="text-rose-600">Escena</span></h2>
                <p className="text-white/40 font-medium tracking-widest uppercase text-xs">Inspección Visual de Seguridad Industrial</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scenes.map((scene, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartScene(scene)}
                    className="group cursor-pointer bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-rose-500/40 transition-all"
                  >
                    <div className="h-48 bg-slate-900 relative">
                      {scene.imagen_url ? (
                        <img src={scene.imagen_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                           <Monitor size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{scene.peligros.length} Peligros</p>
                        <h3 className="text-xl font-black uppercase tracking-tight">{scene.escena}</h3>
                      </div>
                    </div>
                    <div className="p-6 flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nivel: Experto</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-black transition-colors">
                        <Play size={16} fill="currentColor" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'PLAY' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col lg:flex-row overflow-hidden"
          >
            <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                 <div className="flex items-center gap-2 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">SISTEMA_SCAN_ACTIVO</p>
                 </div>
              </div>

              <div 
                ref={containerRef}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowScanner(false)}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
                className="relative max-w-[1000px] w-full aspect-[800/500] bg-slate-900 rounded-3xl overflow-hidden cursor-none shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group"
              >
                {selectedScene.imagen_url ? (
                  <img 
                    src={selectedScene.imagen_url} 
                    className="w-full h-full object-contain pointer-events-none z-0" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="z-0 w-full h-full">
                    {renderFallbackSVG(selectedScene.escena)}
                  </div>
                )}

                {showScanner && (
                  <motion.div 
                    className="absolute pointer-events-none z-[100]"
                    animate={{ x: scannerPos.x - 60, y: scannerPos.y - 60 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  >
                    <div className="w-32 h-32 border-2 border-rose-500 rounded-full relative flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                      <div className="absolute inset-0 bg-rose-500/5 rounded-full animate-pulse"></div>
                      <div className="w-full h-[1px] bg-rose-500/30 absolute top-1/2"></div>
                      <div className="h-full w-[1px] bg-rose-500/30 absolute left-1/2"></div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-rose-500 uppercase tracking-widest whitespace-nowrap bg-black/80 px-2 py-0.5 rounded">MODO_ESCÁNER_EHS</div>
                    </div>
                  </motion.div>
                )}

                {selectedScene.peligros.map((p: any) => foundIds.includes(p.id) && (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute w-10 h-10 border-2 border-emerald-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{ left: `${(p.x / 800) * 100}%`, top: `${(p.y / 500) * 100}%` }}
                  >
                    <div className="w-full h-full bg-emerald-500/20 rounded-full animate-pulse"></div>
                    <ShieldCheck size={16} className="text-emerald-500" />
                  </motion.div>
                ))}

                {lastClick && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    className={`absolute w-12 h-12 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-40 ${lastClick.success ? 'border-emerald-500' : 'border-rose-500'}`}
                    style={{ left: lastClick.x, top: lastClick.y }}
                  >
                    {lastClick.success ? <ShieldCheck size={24} className="text-emerald-500" /> : <AlertTriangle size={24} className="text-rose-500" />}
                  </motion.div>
                )}

                <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 m-4 rounded-2xl"></div>
                <div className="absolute bottom-4 right-4 text-[7px] font-mono text-white/20 uppercase tracking-[0.5em]">EHS_SCANNER_v4.2.0</div>
              </div>

              <AnimatePresence>
                {activePeligro && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
                  >
                    <div className="glass-panel-heavy p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                          <ShieldCheck size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Riesgo Neutralizado</h4>
                          <h3 className="text-lg font-black uppercase tracking-tight leading-tight">{activePeligro.peligro}</h3>
                          <div className="h-px w-full bg-white/10 my-2"></div>
                          <p className="text-[10px] font-bold text-white/80 leading-relaxed">
                            <span className="text-emerald-500/60 uppercase mr-1">Medida:</span> {activePeligro.medida}
                          </p>
                          <p className="text-[9px] font-mono text-white/40 mt-2 italic">Ref: {activePeligro.norma}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full lg:w-80 bg-black/60 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Inventario de Riesgos</h3>
                <p className="text-white/40 text-[9px] font-mono uppercase">Detectar {selectedScene.peligros.length} condiciones críticas</p>
              </div>

              <div className="space-y-3">
                {selectedScene.peligros.map((p: any, idx: number) => (
                  <div 
                    key={p.id}
                    className={`p-3 rounded-xl border transition-all duration-500 ${
                      foundIds.includes(p.id) 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-white/5 border-white/5 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                        foundIds.includes(p.id) ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${
                          foundIds.includes(p.id) ? 'text-white' : 'text-white/20'
                        }`}>
                          {foundIds.includes(p.id) ? p.peligro : '????????????'}
                        </p>
                        {foundIds.includes(p.id) && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[8px] font-mono text-emerald-500/60 uppercase mt-1"
                          >
                            Identificado
                          </motion.p>
                        )}
                      </div>
                      {foundIds.includes(p.id) && <ShieldCheck size={12} className="text-emerald-500" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                 <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-2">Estado de Auditoría</p>
                    <div className="flex justify-between items-end">
                       <p className="text-2xl font-black text-white tabular-nums">{Math.round((foundIds.length / selectedScene.peligros.length) * 100)}%</p>
                       <p className="text-[10px] font-mono text-white/40 uppercase">Completado</p>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                       <motion.div 
                        className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        animate={{ width: `${(foundIds.length / selectedScene.peligros.length) * 100}%` }}
                       />
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center p-8 bg-[#050505]"
          >
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel-heavy p-8 rounded-[2rem] border border-white/10 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <ShieldCheck size={200} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Informe de Auditoría</h3>
                  <h2 className="text-4xl font-black uppercase tracking-tight leading-none">Inspección <span className="text-rose-600">Finalizada</span></h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Riesgos Hallados</p>
                    <p className="text-3xl font-black text-emerald-500">{foundIds.length} / {selectedScene.peligros.length}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Puntaje Final</p>
                    <p className="text-3xl font-black text-rose-500">{score.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[11px] font-mono text-white/60 uppercase leading-relaxed">
                      La inspección en <span className="text-white font-bold">{selectedScene.escena}</span> ha sido completada exitosamente. Se han identificado las condiciones inseguras y se han registrado las medidas preventivas correspondientes en la base de datos central.
                   </p>
                </div>

                <div className="flex flex-col gap-3">
                  {onFinish && (
                    <button 
                      onClick={onFinish}
                      className="w-full py-5 bg-emerald-600 text-black font-black rounded-xl uppercase tracking-widest hover:bg-emerald-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={20} /> FINALIZAR Y REGISTRAR
                    </button>
                  )}
                  <button 
                    onClick={() => setGameState('SELECT')}
                    className="w-full py-5 bg-white/10 text-white font-black rounded-xl uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all"
                  >
                    Nueva Inspección
                  </button>
                  <button 
                    onClick={onExit}
                    className="w-full py-5 bg-rose-600/20 text-rose-500 font-black rounded-xl border border-rose-500/30 uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                  >
                    Salir
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel-heavy p-10 rounded-[2rem] border border-white/10 bg-rose-500/5 h-full flex flex-col justify-center">
                   <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 mb-6">
                      <ShieldAlert size={32} />
                   </div>
                   <h3 className="text-[12px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">Recomendación Estratégica</h3>
                   <p className="text-lg font-medium text-white/90 leading-relaxed italic mb-8">
                      "La seguridad no es un destino, es un viaje continuo. Tu capacidad de observación hoy previene el accidente de mañana."
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
