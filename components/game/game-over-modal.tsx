import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface GameOverModalProps {
  visible: boolean;
  isWon: boolean;
  score: number;
  bestScore: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function GameOverModal({ 
  visible, 
  isWon, 
  score, 
  bestScore, 
  onPlayAgain, 
  onHome 
}: GameOverModalProps) {
  const colorScheme = useColorScheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ThemedView style={[
          styles.modal,
          { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
        ]}>
          <ThemedText style={[
            styles.title,
            { color: isWon ? '#f9c74f' : '#f65e3b' }
          ]}>
            {isWon ? 'Civilization Evolved!' : 'Civilization Collapsed!'}
          </ThemedText>
          
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreLabel}>Final Score</ThemedText>
            <ThemedText style={styles.scoreValue}>{score.toLocaleString()}</ThemedText>
            
            <ThemedText style={[styles.scoreLabel, { marginTop: 10 }]}>Best Score</ThemedText>
            <ThemedText style={styles.scoreValue}>{bestScore.toLocaleString()}</ThemedText>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.playAgainButton]} 
              onPress={onPlayAgain}
            >
              <ThemedText style={styles.buttonText}>Play Again</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.homeButton]} 
              onPress={onHome}
            >
              <ThemedText style={[styles.buttonText, { color: '#8f7a66' }]}>Home</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#8f7a66',
  },
  homeButton: {
    backgroundColor: '#f9f6f2',
    borderWidth: 1,
    borderColor: '#8f7a66',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});