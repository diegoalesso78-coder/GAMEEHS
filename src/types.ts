
export type View = 
  | 'START' 
  | 'MENU' 
  | 'GAME_TRUCO' 
  | 'GAME_OCA' 
  | 'GAME_CARRERA' 
  | 'GAME_MATCH' 
  | 'GAME_ESCAPE' 
  | 'GAME_MEMORY' 
  | 'GAME_MEMORY_V2' 
  | 'GAME_MEMORY_V3' 
  | 'GAME_WORDLE' 
  | 'GAME_JENGA' 
  | 'GAME_DECISIONES' 
  | 'GAME_CAZADOR' 
  | 'GAME_PARE' 
  | 'GAME_PROTOCOLO' 
  | 'GAME_ESPEJO' 
  | 'GAME_RESOLVE'
  | 'GAME_SOPA'
  | 'GAME_TRIVIA'
  | 'GAME_EPP'
  | 'GAME_STOP'
  | 'GAME_MISSIONS';

export type DisplayMode = 'MOBILE' | 'DESKTOP';

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export interface Avatar {
  id: string;
  icon: string;
  label: string;
  color: string;
}

export interface FeedbackData {
  timestamp: string;
  juego: string;
  tipo_comentario: 'JUEGO' | 'EHS' | 'MEJORA_PUESTO' | 'RIESGO' | 'SUGERENCIA' | 'FELICITACION';
  comentario: string;
  udn?: string;
  area?: string;
  categoria?: string;
}

export interface PlayerData {
  nombre: string;
  sitio: string;
  sector: string;
  udn: string;
  edad: string;
  score: number;
  streak?: number;
  badges?: Badge[];
  avatar?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  xp?: number;
}

export interface UserStats {
  totalScore: number;
  gamesPlayed: number;
  achievements: string[];
  xp: number;
  level: number;
  victories: number;
  missionProgress: { [key: string]: number };
  userProfile?: PlayerData;
  lastPlayed?: string;
  gamesCompleted?: string[];
}

export interface Game {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  active: boolean;
  color: string;
  level: string;
  stats: string;
  img: string;
  desc?: string;
  obj?: string;
  rules?: string[];
  recommendedSectors?: string[];
}
