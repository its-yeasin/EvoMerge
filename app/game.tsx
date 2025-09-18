import React from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBoard } from '@/components/game/game-board';
import { ScoreDisplay } from '@/components/game/score-display';
import { GameOverModal } from '@/components/game/game-over-modal';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useGameState } from '@/hooks/use-game-state';
import { Direction } from '@/constants/game';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function GameScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { gameState, isLoading, makeMove, restartGame } = useGameState();

  const handleMove = (direction: Direction) => {
    makeMove(direction);
  };

  const handlePlayAgain = () => {
    restartGame();
  };

  const handleHome = () => {
    router.push('/');
  };

  if (isLoading || !gameState) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8f7a66" />
        <ThemedText style={styles.loadingText}>Initializing game...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: '2048 Evolution',
          headerShown: true,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
          },
          headerTintColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
        }}
      />
      
      <ThemedView style={styles.gameContainer}>
        {/* Header with scores and restart button */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.gameTitle}>2048 Evolution</ThemedText>
          </View>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <ThemedText style={styles.restartButtonText}>New Game</ThemedText>
          </TouchableOpacity>
        </View>

        <ScoreDisplay score={gameState.score} bestScore={gameState.bestScore} />

        {/* Game Board */}
        <View style={styles.boardContainer}>
          <GameBoard board={gameState.board} onMove={handleMove} />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <ThemedText style={styles.instructionText}>
            Swipe to move tiles. When two tiles with the same stage touch, they merge into one!
          </ThemedText>
        </View>

        {/* Game Over Modal */}
        <GameOverModal
          visible={gameState.isGameOver || gameState.isWon}
          isWon={gameState.isWon}
          score={gameState.score}
          bestScore={gameState.bestScore}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  gameContainer: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8f7a66',
  },
  restartButton: {
    backgroundColor: '#8f7a66',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
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