
import { RESULTS_WEB_APP_URL } from '../lib/constants';
import { UserStats, Achievement } from '../types';

const STORAGE_KEY = 'ehs_user_stats';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_game', title: 'PRIMER PASO', description: 'Completá tu primer juego de seguridad.', icon: 'rocket', xp: 100, unlocked: false },
  { id: 'perfect_score', title: 'EXCELENCIA EHS', description: 'Lográ un puntaje perfecto en cualquier misión.', icon: 'star', xp: 250, unlocked: false },
  { id: 'five_games', title: 'VETERANO DE PLANTA', description: 'Completá 5 misiones diferentes.', icon: 'shield', xp: 500, unlocked: false },
  { id: 'truco_master', title: 'MAESTRO DEL TRUCO', description: 'Ganale al bot en el Truco Seguro.', icon: 'gavel', xp: 300, unlocked: false },
  { id: 'quick_solver', title: 'REFLEJOS DE ACERO', description: 'Completá una misión en tiempo récord.', icon: 'bolt', xp: 200, unlocked: false },
];

export const PersistenceService = {
  getUserStats(): UserStats {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      totalScore: 0,
      xp: 0,
      level: 1,
      gamesPlayed: 0,
      victories: 0,
      achievements: [],
      lastPlayed: new Date().toISOString(),
      missionProgress: {},
      gamesCompleted: [],
    };
  },

  saveUserStats(stats: UserStats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  },

  saveUserProfile(profile: { name: string; site: string; sector: string; udn: string }) {
    const stats = this.getUserStats();
    stats.userProfile = profile;
    this.saveUserStats(stats);
  },

  async recordResult(data: {
    user: { name: string; site: string; area: string };
    gameId: string;
    score: number;
    total: number;
    timeSeconds: number;
  }) {
    // 1. Update Local Stats
    const stats = this.getUserStats();
    stats.gamesPlayed += 1;
    if (data.score === data.total && data.total > 0) stats.victories += 1;
    
    // Track unique games completed
    if (!stats.gamesCompleted) stats.gamesCompleted = [];
    if (!stats.gamesCompleted.includes(data.gameId)) {
      stats.gamesCompleted.push(data.gameId);
    }

    // XP Calculation: Base 50 XP + (Score/Total * 100)
    const percentage = data.total > 0 ? Math.floor((data.score / data.total) * 100) : 0;
    const earnedXp = 50 + percentage;
    stats.xp += earnedXp;
    
    // Level Up logic: Every 1000 XP is a level
    stats.level = Math.floor(stats.xp / 1000) + 1;
    stats.lastPlayed = new Date().toISOString();
    
    // Mission Progress Logic
    if (!stats.missionProgress) stats.missionProgress = {};
    
    // Mission 1: Inspector Novato (3 unique games)
    stats.missionProgress['m1'] = stats.gamesCompleted.length;
    
    // Mission 2: Maestro del Orden (2 perfect scores)
    if (percentage === 100) {
      stats.missionProgress['m2'] = (stats.missionProgress['m2'] || 0) + 1;
    }
    
    // Mission 3: Persistencia EHS (10 games total)
    stats.missionProgress['m3'] = stats.gamesPlayed;

    // Check for Achievements
    const newAchievements = this.checkAchievements(stats, data);
    stats.achievements = [...new Set([...stats.achievements, ...newAchievements])];
    
    this.saveUserStats(stats);

    // 2. Send to Google Sheets (Async)
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        userName: data.user.name,
        site: data.user.site,
        area: data.user.area,
        gameId: data.gameId,
        score: data.score,
        total: data.total,
        percentage: Math.floor((data.score / data.total) * 100),
        timeSeconds: data.timeSeconds,
        xpEarned: earnedXp,
        level: stats.level
      };

      // We use no-cors to avoid preflight issues if the script is not configured for CORS
      // but the data will still reach the server if it's a simple POST
      await fetch(RESULTS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error recording result to Sheets:', error);
    }

    return { stats, earnedXp, newAchievements };
  },

  checkAchievements(stats: UserStats, lastGame: any): string[] {
    const unlocked: string[] = [];
    
    // First Game
    if (stats.gamesPlayed >= 1 && !stats.achievements.includes('first_game')) {
      unlocked.push('first_game');
    }
    
    // Perfect Score
    if (lastGame.score === lastGame.total && lastGame.total > 0 && !stats.achievements.includes('perfect_score')) {
      unlocked.push('perfect_score');
    }
    
    // 5 Games
    if (stats.gamesPlayed >= 5 && !stats.achievements.includes('five_games')) {
      unlocked.push('five_games');
    }

    // Truco Master
    if (lastGame.gameId === 'truco' && lastGame.score >= 15 && !stats.achievements.includes('truco_master')) {
      unlocked.push('truco_master');
    }

    // Quick Solver (under 30s and perfect score)
    if (lastGame.timeSeconds < 30 && lastGame.score === lastGame.total && lastGame.total > 0 && !stats.achievements.includes('quick_solver')) {
      unlocked.push('quick_solver');
    }

    return unlocked;
  }
};
