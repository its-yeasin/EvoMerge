/**
 * Game constants and configuration for 2048 Evolution
 */

export const BOARD_SIZE = 4;
export const INITIAL_TILES = 2;

// Evolution stages with emojis and scores
export const EVOLUTION_STAGES = [
  { id: 1, name: 'Stone', emoji: '🪨', score: 10 },
  { id: 2, name: 'Fire', emoji: '🔥', score: 20 },
  { id: 3, name: 'Hut', emoji: '🛖', score: 30 },
  { id: 4, name: 'House', emoji: '🏠', score: 40 },
  { id: 5, name: 'City', emoji: '🏙️', score: 50 },
  { id: 6, name: 'Skyscraper', emoji: '🏢', score: 60 },
  { id: 7, name: 'Satellite', emoji: '🛰️', score: 70 },
  { id: 8, name: 'Space Colony', emoji: '🪐', score: 80 },
] as const;

export type EvolutionStage = typeof EVOLUTION_STAGES[number];
export type TileValue = EvolutionStage['id'] | null;

export interface Tile {
  id: string;
  value: TileValue;
  position: { row: number; col: number };
  isNew?: boolean;
  isMerged?: boolean;
}

export type GameBoard = (Tile | null)[][];

export interface GameState {
  board: GameBoard;
  score: number;
  bestScore: number;
  isGameOver: boolean;
  isWon: boolean;
  canUndo: boolean;
}

// Directions for tile movement
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// Colors for different stages
export const STAGE_COLORS = {
  1: '#8f7a66', // Stone
  2: '#f65e3b', // Fire
  3: '#f67c5f', // Hut
  4: '#f9c74f', // House
  5: '#90e0ef', // City
  6: '#4cc9f0', // Skyscraper
  7: '#7209b7', // Satellite
  8: '#c77dff', // Space Colony
} as const;