import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ScoreDisplayProps {
  currentScore: number;
  bestScore: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ currentScore, bestScore }) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <ThemedView style={[
        styles.scoreBox,
        { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }
      ]}>
        <ThemedText style={styles.scoreLabel}>SCORE</ThemedText>
        <ThemedText style={styles.scoreValue}>{currentScore.toLocaleString()}</ThemedText>
      </ThemedView>
      
      <ThemedView style={[
        styles.scoreBox,
        { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }
      ]}>
        <ThemedText style={styles.scoreLabel}>BEST</ThemedText>
        <ThemedText style={styles.scoreValue}>{bestScore.toLocaleString()}</ThemedText>
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scoreBox: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});