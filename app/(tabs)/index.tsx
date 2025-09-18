import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GameBoard } from '@/components/game/GameBoard';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GameOverModal } from '@/components/game/GameOverModal';
import { GameState, Direction, EVOLUTION_STAGES } from '@/constants/game';
import { 
  initializeGame, 
  moveTiles, 
  generateRandomTile, 
  isGameOver as checkGameOver 
} from '@/utils/gameLogic';

const BEST_SCORE_KEY = '@EvoMerge:bestScore';

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    loadBestScore();
  }, []);

  useEffect(() => {
    if (gameState.isGameOver && !showGameOver) {
      setShowGameOver(true);
    }
  }, [gameState.isGameOver, showGameOver]);

  const loadBestScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem(BEST_SCORE_KEY);
      if (savedScore) {
        setGameState(prev => ({ ...prev, bestScore: parseInt(savedScore, 10) }));
      }
    } catch (error) {
      console.error('Error loading best score:', error);
    }
  };

  const saveBestScore = async (score: number) => {
    try {
      await AsyncStorage.setItem(BEST_SCORE_KEY, score.toString());
    } catch (error) {
      console.error('Error saving best score:', error);
    }
  };

  const handleMove = (direction: Direction) => {
    if (gameState.isGameOver) return;

    const { newGrid, scoreGained, moved } = moveTiles(gameState.grid, direction);
    
    if (!moved) return;

    // Add new tile
    const newTile = generateRandomTile(newGrid);
    if (newTile) {
      newGrid[newTile.position.row][newTile.position.col] = newTile;
    }

    const newScore = gameState.score + scoreGained;
    const newBestScore = Math.max(gameState.bestScore, newScore);
    
    if (newBestScore > gameState.bestScore) {
      saveBestScore(newBestScore);
    }

    const isOver = checkGameOver(newGrid);

    setGameState({
      grid: newGrid,
      score: newScore,
      bestScore: newBestScore,
      isGameOver: isOver,
      canUndo: false, // TODO: Implement undo functionality
    });
  };

  const startNewGame = () => {
    const newGame = initializeGame();
    newGame.bestScore = gameState.bestScore;
    setGameState(newGame);
    setShowGameOver(false);
    setGameStarted(true);
  };

  const showHowToPlay = () => {
    Alert.alert(
      '🎮 How to Play',
      '🪨 Swipe to move tiles\n🔥 Merge same tiles to evolve\n🛖 Reach higher civilizations\n🏠 Beat your best score!\n\nEvolution stages:\n🪨 Stone → 🔥 Fire → 🛖 Hut → 🏠 House → 🏙️ City → 🏢 Skyscraper → 🛰️ Satellite → 🪐 Space Colony',
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  if (!gameStarted) {
    return (
      <ThemedView style={styles.splashContainer}>
        <ThemedText style={styles.title}>🌍 2048 Evolution 🚀</ThemedText>
        <ThemedText style={styles.subtitle}>Build Civilization Through Time</ThemedText>
        
        <View style={styles.stagesPreview}>
          {EVOLUTION_STAGES.slice(0, 4).map((stage, index) => (
            <View key={stage.id} style={styles.stageItem}>
              <ThemedText style={styles.stageEmoji}>{stage.emoji}</ThemedText>
              <ThemedText style={styles.stageName}>{stage.name}</ThemedText>
            </View>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.playButton} onPress={startNewGame}>
            <ThemedText style={styles.buttonText}>🎮 Play</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.howToPlayButton} onPress={showHowToPlay}>
            <ThemedText style={styles.buttonText}>❓ How to Play</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.scoresButton} onPress={() => Alert.alert('High Score', `Best Score: ${gameState.bestScore.toLocaleString()}`)}>
            <ThemedText style={styles.buttonText}>🏆 High Scores</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.gameContainer}>
        <ThemedText style={styles.gameTitle}>2048 Evolution</ThemedText>
        
        <ScoreBoard score={gameState.score} bestScore={gameState.bestScore} />
        
        <GameBoard gameState={gameState} onMove={handleMove} />
        
        <View style={styles.gameButtonContainer}>
          <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
            <ThemedText style={styles.newGameButtonText}>New Game</ThemedText>
          </TouchableOpacity>
        </View>
        
        <GameOverModal
          visible={showGameOver}
          score={gameState.score}
          bestScore={gameState.bestScore}
          onPlayAgain={startNewGame}
          onHome={() => {
            setGameStarted(false);
            setShowGameOver(false);
          }}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#8B4513',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#8B4513',
  },
  stagesPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  stageItem: {
    alignItems: 'center',
  },
  stageEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  stageName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  howToPlayButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  scoresButton: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameButtonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  newGameButton: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
