import { useState, useEffect, useCallback } from 'react';
import { GameState, Direction } from '@/constants/game';
import { 
  createInitialGameState, 
  makeMove as makeGameMove, 
  getBestScore,
  saveBestScore 
} from '@/hooks/use-game-logic';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize game
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    try {
      const newGameState = await createInitialGameState();
      setGameState(newGameState);
    } catch (error) {
      console.error('Failed to initialize game:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Make a move
  const makeMove = useCallback((direction: Direction) => {
    if (!gameState) return;
    
    const newGameState = makeGameMove(gameState, direction);
    setGameState(newGameState);
  }, [gameState]);

  // Restart game
  const restartGame = useCallback(async () => {
    await initializeGame();
  }, [initializeGame]);

  // Update best score
  const updateBestScore = useCallback(async (score: number) => {
    if (!gameState) return;
    
    const newBestScore = Math.max(gameState.bestScore, score);
    if (newBestScore > gameState.bestScore) {
      await saveBestScore(newBestScore);
      setGameState(prev => prev ? { ...prev, bestScore: newBestScore } : null);
    }
  }, [gameState]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    gameState,
    isLoading,
    makeMove,
    restartGame,
    updateBestScore,
  };
}