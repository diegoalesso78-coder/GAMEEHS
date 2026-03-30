
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
import IndustrialMemoryGame from './components/games/IndustrialMemoryGame';
import { View, PlayerData, DisplayMode } from './types';

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
  const [missionId, setMissionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const CONFIG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2102419216&single=true&output=csv';
        const response = await fetch(CONFIG_SHEET_URL);
        const csv = await response.text();
        const rows = csv.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        
        // Find mission_id row
        const missionRow = rows.find(row => row[0] === 'mission_id');
        if (missionRow && missionRow[1]) {
          setMissionId(missionRow[1].toLowerCase());
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

    const result = {
      nombre: playerData.nombre,
      fecha: new Date().toLocaleString(),
      sitio: playerData.sitio,
      sector: playerData.sector,
      udn: playerData.udn,
      edad: playerData.edad,
      numeroPartida: Date.now(),
      juego: gameId,
      puntaje: score
    };

    console.log('Recording game result:', result);
    
    try {
      const LOGS_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwZuRbqYuD1zrXZuLX0SDGYV6cDe2wbKLDVIXVgLJ5EjkIW3SU9ZITg-_jC5fRoYRBsSQ/exec';
      await fetch(LOGS_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });
      console.log('Game result sent to Google Sheets');
    } catch (error) {
      console.error('Error recording game result:', error);
    }
  };

  const handleStart = (data: PlayerData) => {
    setLoadingMessage("VINCULANDO OPERADOR...");
    setIsLoading(true);
    setTimeout(() => {
      setPlayerData(data);
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
        'cazador': 'GAME_CAZADOR'
      };
      const nextView = viewMap[id];
      if (nextView) setView(nextView);
      setIsLoading(false);
    }, 1500);
  };

  const handleGameOver = (score: number) => {
    setSessionScore(prev => prev + score);
    setPlayerData((prev: PlayerData | null) => {
      if (!prev) return null;
      return {
        ...prev,
        score: (prev.score || 0) + score
      };
    });
    // recordGameResult(view, score); // Removed to record only on Finish
  };

  const handleFinish = (score?: number) => {
    const finalScore = score !== undefined ? score : sessionScore;
    recordGameResult(view, finalScore);
    setView('MENU');
    setSessionScore(0);
  };

  const renderView = () => {
    const commonProps = { onExit: () => setView('MENU'), onGameOver: handleGameOver, onFinish: handleFinish };
    
    switch (view) {
      case 'START': return <StartScreen onStart={handleStart} />;
      case 'MENU': return <EnhancedGameMenu onSelectGame={handleSelectGame} playerData={playerData!} onLogout={() => setView('START')} missionId={missionId} />;
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
      </div>
    </ErrorBoundary>
  );
}
