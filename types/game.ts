export interface Tile {
  id: string;
  stage: number;
  value: number;
  position: { row: number; col: number };
  isNew?: boolean;
  isMerged?: boolean;
}

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  bestScore: number;
  isGameOver: boolean;
  hasWon: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export const EVOLUTION_STAGES = [
  { stage: 1, emoji: '🪨', name: 'Stone', value: 10 },
  { stage: 2, emoji: '🔥', name: 'Fire', value: 20 },
  { stage: 3, emoji: '🛖', name: 'Hut', value: 30 },
  { stage: 4, emoji: '🏠', name: 'House', value: 40 },
  { stage: 5, emoji: '🏙️', name: 'City', value: 50 },
  { stage: 6, emoji: '🏢', name: 'Skyscraper', value: 60 },
  { stage: 7, emoji: '🛰️', name: 'Satellite', value: 70 },
  { stage: 8, emoji: '🪐', name: 'Space Colony', value: 80 },
] as const;

export const BOARD_SIZE = 4;
export const WINNING_STAGE = 8; // Space Colony