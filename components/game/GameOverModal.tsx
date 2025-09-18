import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  bestScore: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function GameOverModal({ 
  visible, 
  score, 
  bestScore, 
  onPlayAgain, 
  onHome 
}: GameOverModalProps) {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.modal, { backgroundColor }]}>
          <ThemedText style={styles.title}>🌍 Civilization Collapsed! 🌍</ThemedText>
          
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreLabel}>Final Score</ThemedText>
            <ThemedText style={styles.scoreValue}>{score.toLocaleString()}</ThemedText>
          </View>
          
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreLabel}>Best Score</ThemedText>
            <ThemedText style={styles.scoreValue}>{bestScore.toLocaleString()}</ThemedText>
          </View>
          
          {score === bestScore && score > 0 && (
            <ThemedText style={styles.newRecord}>🎉 New Record! 🎉</ThemedText>
          )}
          
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
              <ThemedText style={styles.buttonText}>Home</ThemedText>
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
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  newRecord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    minWidth: 100,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  homeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});