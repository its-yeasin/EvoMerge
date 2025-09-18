import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

export function ScoreBoard({ score, bestScore }: ScoreBoardProps) {
  return (
    <View style={styles.container}>
      <ThemedView style={styles.scoreContainer}>
        <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
        <ThemedText style={styles.scoreValue}>{score.toLocaleString()}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.scoreContainer}>
        <ThemedText style={styles.scoreLabel}>BEST</ThemedText>
        <ThemedText style={styles.scoreValue}>{bestScore.toLocaleString()}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scoreContainer: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});