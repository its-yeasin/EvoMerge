import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface ScoreDisplayProps {
  score: number;
  bestScore: number;
}

export function ScoreDisplay({ score, bestScore }: ScoreDisplayProps) {
  return (
    <View style={styles.container}>
      <ThemedView style={styles.scoreBox}>
        <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
        <ThemedText style={styles.scoreValue}>{score.toLocaleString()}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.scoreBox}>
        <ThemedText style={styles.scoreLabel}>BEST</ThemedText>
        <ThemedText style={styles.scoreValue}>{bestScore.toLocaleString()}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scoreBox: {
    backgroundColor: '#bbada0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f9f6f2',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});