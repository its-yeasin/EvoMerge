export interface EvolutionStage {
  id: number;
  name: string;
  emoji: string;
  points: number;
}

export const EVOLUTION_STAGES: EvolutionStage[] = [
  { id: 1, name: 'Stone', emoji: '🪨', points: 10 },
  { id: 2, name: 'Fire', emoji: '🔥', points: 20 },
  { id: 3, name: 'Hut', emoji: '🛖', points: 30 },
  { id: 4, name: 'House', emoji: '🏠', points: 40 },
  { id: 5, name: 'City', emoji: '🏙️', points: 50 },
  { id: 6, name: 'Skyscraper', emoji: '🏢', points: 60 },
  { id: 7, name: 'Satellite', emoji: '🛰️', points: 70 },
  { id: 8, name: 'Space Colony', emoji: '🪐', points: 80 },
];

export interface Tile {
  id: string;
  stage: number;
  position: { row: number; col: number };
  isNew?: boolean;
  isMerged?: boolean;
}

export interface GameState {
  grid: (Tile | null)[][];
  score: number;
  bestScore: number;
  isGameOver: boolean;
  canUndo: boolean;
}

export const GRID_SIZE = 4;
export const INITIAL_TILES = 2;

export const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS];