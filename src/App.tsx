
import * as React from 'react';
import { useState, useEffect, Component, ReactNode, ErrorInfo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanlineOverlay, SystemLoader, GlobalHeader } from './components/shared/UIComponents';
import { StartScreen } from './components/shared/StartScreen';
import { EnhancedGameMenu } from './components/shared/EnhancedGameMenu';
import { TrucoGame } from './components/games/TrucoGame';
import { EscapeRoomGame } from './components/games/EscapeRoomGame';
import { WordleGame } from './components/games/WordleGame';
import { JengaGame } from './components/games/JengaGame';
import { OcaGame } from './components/games/OcaGame';
import { MatchGame } from './components/games/MatchGame';
import { CarreraGame } from './components/games/CarreraGame';
import { DecisionesSegurasGame } from './components/games/DecisionesSegurasGame';
import { EspejoDelTurnoGame } from './components/games/EspejoDelTurnoGame';
import { PareYPidaAyudaGame } from './components/games/PareYPidaAyudaGame';
import { ProtocoloEmergenciaGame } from './components/games/ProtocoloEmergenciaGame';
import { ResolveEnElPuestoGame } from './components/games/ResolveEnElPuestoGame';
import { CazadorDeRiesgosGame } from './components/games/CazadorDeRiesgosGame';
import { TriviaGame } from './components/games/TriviaGame';
import { EPPSimulatorGame } from './components/games/EPPSimulatorGame';
import { SopaLetrasGame } from './components/games/SopaLetrasGame';
import { StopPeligroGame } from './components/games/StopPeligroGame';
import { HierarchyGame } from './components/games/HierarchyGame';
import IndustrialMemoryGame from './components/games/IndustrialMemoryGame';
import { FeedbackCard } from './components/FeedbackCard';
import { Trophy, X } from 'lucide-react';
import { View, PlayerData, DisplayMode, Badge, FeedbackData } from './types';
import { LOGS_SHEETS_URL, LOGS_READ_URL, CONFIG_SHEET_URL } from './constants';
import { PersistenceService } from './services/PersistenceService';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Game Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border-red-500/30">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <div className="text-3xl font-bold">!</div>
            </div>
            <h2 className="text-2xl font-black text-white uppercase mb-2 tracking-tighter">Error de Sistema</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Se ha detectado una anomalía en el módulo de entrenamiento. 
              Por favor, reiniciá la misión.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Reiniciar Misión
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [view, setView] = useState<View>('START');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [displayMode, setDisplayMode] = useState<DisplayMode>('MOBILE');
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionGamesCompleted, setSessionGamesCompleted] = useState<string[]>([]);
  const [missionIds, setMissionIds] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingFinishData, setPendingFinishData] = useState<{ gameId: string, score: number } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Add a timestamp as a cache buster to force Google to provide the latest data
        const cacheBuster = `&t=${Date.now()}`;
        const CONFIG_SHEET_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2102419216&single=true&output=csv${cacheBuster}`;
        
        const response = await fetch(CONFIG_SHEET_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const csv = await response.text();
        console.log('Config CSV fetched successfully');
        
        // Robust CSV parsing handling different line endings and separators
        const rows = csv.split(/\r?\n/).filter(row => row.trim()).map(row => {
          const separator = row.includes(';') ? ';' : ',';
          return row.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
        });
        
        console.log('Raw Config Data Received:', rows);

        // Super flexible search: Look for "mission_id" anywhere in the CSV
        const foundIds: string[] = [];
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          for (let j = 0; j < row.length; j++) {
            const cell = row[j].toLowerCase();
            
            if (cell.includes('mission_id')) {
              // Found a key!
              
              // 1. Check cells to the right
              for (let k = j + 1; k < row.length; k++) {
                if (row[k] && row[k].trim()) {
                  const parts = row[k].split(/[,;]/);
                  parts.forEach(p => {
                    const clean = p.trim().toLowerCase();
                    if (clean && clean !== 'mission_id') foundIds.push(clean);
                  });
                }
              }
              
              // 2. Check rows below (collecting from multiple columns to handle tables)
              let nextRowIdx = i + 1;
              while (rows[nextRowIdx]) {
                const nextRow = rows[nextRowIdx];
                // Stop if we hit another key
                if (nextRow[j] && nextRow[j].toLowerCase().includes('_id') && !nextRow[j].toLowerCase().includes('mission_id')) break;
                
                // Collect from the same column and the next two columns (to catch IDs in Col B/C)
                for (let colOffset = 0; colOffset <= 2; colOffset++) {
                  const val = nextRow[j + colOffset];
                  if (val && val.trim()) {
                    const clean = val.trim().toLowerCase();
                    if (clean && clean !== 'mission_id') foundIds.push(clean);
                  }
                }
                nextRowIdx++;
                if (nextRowIdx > i + 20) break;
              }
            }
          }
        }
        
        if (foundIds.length > 0) {
          // Process and clean all found IDs
          const processedIds = foundIds
            .map(rawId => rawId.replace(/[^a-z0-9]/g, ''))
            .filter(id => id.length > 0);
          
          const uniqueIds = Array.from(new Set(processedIds));
          console.log('Final Mission IDs identified:', uniqueIds);
          setMissionIds(uniqueIds);
        } else {
          setMissionIds([]);
          console.warn('No active mission_ids found in config');
        }
      } catch (error) {
        console.error('Error fetching mission config:', error);
      }
    };
    fetchConfig();
  }, []);

  const toggleDisplayMode = () => {
    setDisplayMode(prev => prev === 'MOBILE' ? 'DESKTOP' : 'MOBILE');
  };

  const recordGameResult = async (gameId: string, score: number) => {
    if (!playerData) return;

    // Map game IDs to readable names
    const gameNames: Record<string, string> = {
      'carrera': 'Carrera de Autoelevadores',
      'cazador': 'Cazador de Riesgos',
      'decisiones': 'Decisiones Seguras',
      'escape': 'Escape Room',
      'espejo': 'Espejo del Turno',
      'jenga': 'Jenga de Seguridad',
      'match': 'Match de Seguridad',
      'oca': 'La Oca Logística',
      'pare': 'Pare y Pida Ayuda',
      'protocolo': 'Protocolo de Emergencia',
      'resolve': 'Resolve en el Puesto',
      'truco': 'Truco de Seguridad',
      'wordle': 'Wordle de Seguridad',
      'memoria': 'Memoria Industrial',
      'memory': 'Memoria Industrial',
      'stop': 'Stop al Peligro',
      'trivia': 'Trivia de Seguridad',
      'epp': 'Simulador EPP',
      'sopa': 'Sopa de Letras',
      'jerarquia': 'Jerarquía de Control'
    };

    const result = {
      nombre: playerData.nombre,
      fecha: new Date().toLocaleString('es-AR').replace(',', ''),
      sitio: playerData.sitio,
      sector: playerData.sector,
      udn: playerData.udn,
      edad: playerData.edad,
      numeroPartida: Date.now(),
      juego: gameNames[gameId] || gameId,
      puntaje: score
    };

    console.log('Recording game result:', result);
    
    try {
      await fetch(LOGS_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(result),
      });
    } catch (error) {
      console.error('Error recording game result:', error);
    }
  };

  const recordFeedback = async (data: FeedbackData) => {
    if (!playerData) return;

    const feedbackPayload = {
      ...data,
      usuario: playerData.nombre,
      sector: playerData.sector,
      sitio: playerData.sitio
    };

    console.log('Recording feedback:', feedbackPayload);

    try {
      // Using the same pattern as game results
      await fetch(LOGS_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ ...feedbackPayload, type: 'FEEDBACK' }),
      });
    } catch (error) {
      console.error('Error recording feedback:', error);
    }
  };

  const handleStart = async (data: PlayerData) => {
    setLoadingMessage("VINCULANDO OPERADOR...");
    setIsLoading(true);
    setSessionGamesCompleted([]); // Reset session progress
    
    // Streak Logic
    const today = new Date().toLocaleDateString('es-AR');
    const streakKey = `streak_${data.nombre.replace(/\s+/g, '_')}`;
    const lastPlayKey = `lastPlay_${data.nombre.replace(/\s+/g, '_')}`;
    
    const lastPlayDate = localStorage.getItem(lastPlayKey);
    let currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
    
    if (lastPlayDate) {
      const lastDate = new Date(lastPlayDate.split('/').reverse().join('-'));
      const todayDate = new Date();
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        if (lastPlayDate !== today) {
          currentStreak += 1;
        }
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    localStorage.setItem(streakKey, currentStreak.toString());
    localStorage.setItem(lastPlayKey, today);

    // Save profile for persistence
    PersistenceService.saveUserProfile(data);

    // Badge Calculation Logic
    let badges: Badge[] = [];
    try {
      const logsRes = await fetch(`${LOGS_READ_URL}&t=${Date.now()}`);
      const logsText = await logsRes.text();
      const rows = logsText.split(/\r?\n/).filter(row => row.trim()).map(row => {
        const separator = row.includes(';') ? ';' : ',';
        return row.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
      });

      if (rows.length > 1) {
        const headers = rows[0].map(h => h.toLowerCase());
        const nameIdx = headers.findIndex(h => h.includes('nombre') || h.includes('operador'));
        const gameIdx = headers.findIndex(h => h.includes('juego') || h.includes('módulo'));
        
        const userLogs = rows.slice(1).filter(row => row[nameIdx]?.toUpperCase() === data.nombre.toUpperCase());
        const totalGames = userLogs.length;
        const gameCounts: Record<string, number> = {};
        userLogs.forEach(row => {
          const g = row[gameIdx];
          if (g) gameCounts[g] = (gameCounts[g] || 0) + 1;
        });

        if (totalGames >= 1) badges.push({ id: 'novato', title: 'NOVATO', icon: 'Shield', description: 'Primera misión completada', color: 'bg-slate-500' });
        if (totalGames >= 10) badges.push({ id: 'veterano', title: 'VETERANO', icon: 'Trophy', description: '10 misiones completadas', color: 'bg-blue-500' });
        if (totalGames >= 50) badges.push({ id: 'maestro', title: 'MAESTRO', icon: 'Zap', description: '50 misiones completadas', color: 'bg-amber-500' });
        if (currentStreak >= 3) badges.push({ id: 'racha', title: 'RACHA FUEGO', icon: 'Flame', description: '3 días seguidos entrenando', color: 'bg-orange-500' });
        
        Object.entries(gameCounts).forEach(([game, count]) => {
          if (count >= 5) {
            badges.push({ 
              id: `spec_${game}`, 
              title: `ESPECIALISTA ${game.toUpperCase()}`, 
              icon: 'Star', 
              description: `Maestría en ${game}`, 
              color: 'bg-emerald-500' 
            });
          }
        });
      }
    } catch (e) {
      console.error("Error calculating badges:", e);
    }
    
    setTimeout(() => {
      setPlayerData({ ...data, streak: currentStreak, badges });
      setView('MENU');
      setIsLoading(false);
    }, 2000);
  };

  const handleSelectGame = (id: string) => {
    setLoadingMessage("CARGANDO PROTOCOLO DE MISIÓN...");
    setIsLoading(true);
    setSessionScore(0);
    setTimeout(() => {
      const viewMap: Record<string, View> = {
        'truco': 'GAME_TRUCO',
        'oca': 'GAME_OCA',
        'carrera': 'GAME_CARRERA',
        'match': 'GAME_MATCH',
        'escape': 'GAME_ESCAPE',
        'wordle': 'GAME_WORDLE',
        'jenga': 'GAME_JENGA',
        'decisiones': 'GAME_DECISIONES',
        'pare': 'GAME_PARE',
        'protocolo': 'GAME_PROTOCOLO',
        'espejo': 'GAME_ESPEJO',
        'resolve': 'GAME_RESOLVE',
        'cazador': 'GAME_CAZADOR',
        'memoria': 'GAME_MEMORY',
        'sopa': 'GAME_SOPA',
        'trivia': 'GAME_TRIVIA',
        'epp': 'GAME_EPP',
        'stop': 'GAME_STOP',
        'jerarquia': 'GAME_JERARQUIA'
      };
      const nextView = viewMap[id];
      if (nextView) setView(nextView);
      setIsLoading(false);
    }, 1500);
  };

  const [showBadgeNotification, setShowBadgeNotification] = useState<Badge | null>(null);

  const checkNewBadges = (updatedPlayerData: PlayerData) => {
    // This is a simplified check. In a real app, we'd compare with previous badges.
    // For now, we'll just show the latest one if it's new in this session.
  };

  const handleGameOver = (score: number) => {
    setSessionScore(prev => prev + score);
    
    // Track session progress
    const currentGameId = view.replace('GAME_', '').toLowerCase();
    if (!sessionGamesCompleted.includes(currentGameId)) {
      setSessionGamesCompleted(prev => [...prev, currentGameId]);
    }

    setPlayerData((prev: PlayerData | null) => {
      if (!prev) return null;
      const newScore = (prev.score || 0) + score;
      return {
        ...prev,
        score: newScore
      };
    });
  };

  const handleFinish = (score?: number) => {
    const finalScore = typeof score === 'number' ? score : sessionScore;
    const gameId = view.replace('GAME_', '').toLowerCase();
    
    // Store data to record after feedback
    setPendingFinishData({ gameId, score: finalScore });
    setShowFeedback(true);
  };

  const finalizeSession = () => {
    if (pendingFinishData) {
      recordGameResult(pendingFinishData.gameId, pendingFinishData.score);
      
      // Optional: Check for new badges here if we wanted to be super precise
      // For now, the start-up calculation is the most reliable way to sync with the Sheet
    }
    setView('MENU');
    setSessionScore(0);
    setPendingFinishData(null);
    setShowFeedback(false);
  };

  const renderView = () => {
    const commonProps = { onExit: () => setView('MENU'), onGameOver: handleGameOver, onFinish: handleFinish };
    
    switch (view) {
      case 'START': return <StartScreen onStart={handleStart} />;
      case 'MENU': return (
        <EnhancedGameMenu 
          onSelectGame={handleSelectGame} 
          playerData={playerData!} 
          onLogout={() => setView('START')} 
          missionIds={missionIds} 
          sessionGamesCompleted={sessionGamesCompleted}
          onViewMissions={() => setView('GAME_MISSIONS')}
          userStats={PersistenceService.getUserStats()}
        />
      );
      case 'GAME_TRUCO': return <TrucoGame {...commonProps} />;
      case 'GAME_OCA': return <OcaGame {...commonProps} />;
      case 'GAME_CARRERA': return <CarreraGame {...commonProps} />;
      case 'GAME_MATCH': return <MatchGame {...commonProps} />;
      case 'GAME_ESCAPE': return <EscapeRoomGame {...commonProps} />;
      case 'GAME_WORDLE': return <WordleGame {...commonProps} />;
      case 'GAME_JENGA': return <JengaGame {...commonProps} />;
      case 'GAME_DECISIONES': return <DecisionesSegurasGame {...commonProps} />;
      case 'GAME_PARE': return <PareYPidaAyudaGame {...commonProps} />;
      case 'GAME_PROTOCOLO': return <ProtocoloEmergenciaGame {...commonProps} />;
      case 'GAME_ESPEJO': return <EspejoDelTurnoGame {...commonProps} />;
      case 'GAME_RESOLVE': return <ResolveEnElPuestoGame {...commonProps} />;
      case 'GAME_CAZADOR': return <CazadorDeRiesgosGame {...commonProps} />;
      case 'GAME_SOPA': return <SopaLetrasGame {...commonProps} />;
      case 'GAME_TRIVIA': return <TriviaGame {...commonProps} />;
      case 'GAME_EPP': return <EPPSimulatorGame {...commonProps} />;
      case 'GAME_STOP': return <StopPeligroGame {...commonProps} />;
      case 'GAME_JERARQUIA': return <HierarchyGame playerData={playerData!} onFinish={handleFinish} />;
      case 'GAME_MEMORY':
      case 'GAME_MEMORY_V2':
      case 'GAME_MEMORY_V3':
        return <IndustrialMemoryGame {...commonProps} />;
      default: return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="font-sans text-white bg-[#0a1f14] min-h-screen selection:bg-secondary selection:text-black">
        <ScanlineOverlay />
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div key="loader-container">
              <SystemLoader message={loadingMessage} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {view !== 'START' && (
          <GlobalHeader 
            playerData={playerData} 
            onBackToMenu={() => setView('MENU')} 
            onFinish={handleFinish}
            isGameActive={view.startsWith('GAME_')}
            displayMode={displayMode}
            onToggleDisplayMode={toggleDisplayMode}
          />
        )}
        
        <main className={`relative z-10 transition-all duration-500 ${
          displayMode === 'DESKTOP' 
            ? `max-w-6xl mx-auto px-4 ${view !== 'START' ? 'pt-20 pb-10' : ''}` 
            : 'w-full'
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={displayMode === 'DESKTOP' ? 'glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/5 border-white/10' : ''}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {showFeedback && (
          <FeedbackCard 
            gameName={view.replace('GAME_', '').replace('_', ' ')}
            onClose={finalizeSession}
            onSubmit={recordFeedback}
          />
        )}
        {showBadgeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-slate-950 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-white/20"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">¡Insignia Desbloqueada!</p>
              <h4 className="text-lg font-black leading-tight">{showBadgeNotification.title}</h4>
              <p className="text-xs font-bold opacity-80">{showBadgeNotification.description}</p>
            </div>
            <button 
              onClick={() => setShowBadgeNotification(null)}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}
