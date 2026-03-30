
import { LOGS_SHEETS_URL } from '../constants';

export const recordGameResult = async (playerName: string, gameId: string, score: number, site: string, sector: string, udn: string, extra?: any) => {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      player: playerName,
      game: gameId,
      score: score,
      site: site,
      sector: sector,
      udn: udn,
      details: extra ? JSON.stringify(extra) : ''
    };

    await fetch(LOGS_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Error recording result:', error);
  }
};

export const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
