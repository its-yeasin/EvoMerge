import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GameOverModalProps {
  visible: boolean;
  hasWon: boolean;
  score: number;
  bestScore: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  hasWon,
  score,
  bestScore,
  onPlayAgain,
  onGoHome,
}) => {
  const colorScheme = useColorScheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ThemedView style={[
          styles.modal,
          { backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF' }
        ]}>
          <Text style={styles.emoji}>
            {hasWon ? '🎉' : '💥'}
          </Text>
          
          <ThemedText style={styles.title}>
            {hasWon ? 'Civilization Evolved!' : 'Civilization Collapsed!'}
          </ThemedText>
          
          <ThemedText style={styles.subtitle}>
            {hasWon 
              ? 'You reached the Space Colony! Amazing work!' 
              : 'No more moves available. The civilization has fallen.'
            }
          </ThemedText>

          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>Final Score: {score.toLocaleString()}</ThemedText>
            {score === bestScore && score > 0 && (
              <ThemedText style={styles.newRecord}>🏆 New Best Score!</ThemedText>
            )}
            <ThemedText style={styles.scoreText}>Best Score: {bestScore.toLocaleString()}</ThemedText>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.playAgainButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint }
              ]}
              onPress={onPlayAgain}
            >
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.homeButton,
                { 
                  backgroundColor: 'transparent',
                  borderColor: Colors[colorScheme ?? 'light'].tint,
                  borderWidth: 2,
                }
              ]}
              onPress={onGoHome}
            >
              <Text style={[
                styles.homeButtonText,
                { color: Colors[colorScheme ?? 'light'].tint }
              ]}>
                Home
              </Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
    lineHeight: 22,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 4,
  },
  newRecord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginVertical: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainButton: {
    marginBottom: 8,
  },
  playAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {},
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});