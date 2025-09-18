import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameBoard } from '@/components/game/GameBoard';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { GameOverModal } from '@/components/game/GameOverModal';

import { GameState, Direction } from '@/types/game';
import { 
  initializeGame, 
  moveTiles, 
  generateRandomTile, 
  checkGameOver, 
  checkWin,
  saveBestScore,
  loadBestScore
} from '@/utils/gameLogic';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [showGameOver, setShowGameOver] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadBestScore().then(score => {
      setGameState(prev => ({ ...prev, bestScore: score }));
    });
  }, []);

  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      setGameState(prev => ({ ...prev, bestScore: prev.score }));
      saveBestScore(gameState.score);
    }
  }, [gameState.score, gameState.bestScore]);

  useEffect(() => {
    if (gameState.isGameOver || gameState.hasWon) {
      setShowGameOver(true);
    }
  }, [gameState.isGameOver, gameState.hasWon]);

  const handleMove = (direction: Direction) => {
    if (gameState.isGameOver || gameState.hasWon) return;

    const { newBoard, scoreIncrease, moved } = moveTiles(gameState.board, direction);
    
    if (!moved) return;

    // Clear animation flags
    for (let row = 0; row < newBoard.length; row++) {
      for (let col = 0; col < newBoard[row].length; col++) {
        if (newBoard[row][col]) {
          newBoard[row][col]!.isNew = false;
          newBoard[row][col]!.isMerged = false;
        }
      }
    }

    // Add new tile
    const newTile = generateRandomTile(newBoard);
    if (newTile) {
      newBoard[newTile.position.row][newTile.position.col] = newTile;
    }

    const newScore = gameState.score + scoreIncrease;
    const isGameOver = checkGameOver(newBoard);
    const hasWon = checkWin(newBoard);

    setGameState({
      board: newBoard,
      score: newScore,
      bestScore: Math.max(gameState.bestScore, newScore),
      isGameOver,
      hasWon,
    });
  };

  const resetGame = () => {
    const newGame = initializeGame();
    newGame.bestScore = gameState.bestScore;
    setGameState(newGame);
    setShowGameOver(false);
  };

  const goToHome = () => {
    // For now, just reset the game since we're already on the home tab
    resetGame();
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>2048 Evolution</ThemedText>
        <ThemedText style={styles.subtitle}>
          Merge civilization stages to evolve from Stone to Space Colony!
        </ThemedText>
      </ThemedView>

      <ScoreDisplay 
        currentScore={gameState.score} 
        bestScore={gameState.bestScore} 
      />

      <GameBoard 
        board={gameState.board} 
        onMove={handleMove}
      />

      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={resetGame}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.instructions}>
        <ThemedText style={styles.instructionText}>
          Swipe to move tiles. When two tiles with the same stage touch, they merge into one!
        </ThemedText>
      </ThemedView>

      <GameOverModal
        visible={showGameOver}
        hasWon={gameState.hasWon}
        score={gameState.score}
        bestScore={gameState.bestScore}
        onPlayAgain={resetGame}
        onGoHome={goToHome}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  controls: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});
