import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { EVOLUTION_STAGES } from '@/constants/game';

export default function HowToPlayScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'How to Play',
          headerShown: true,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
          },
          headerTintColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>How to Play 2048 Evolution</ThemedText>
          
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>🎯 Goal</ThemedText>
            <ThemedText style={styles.sectionText}>
              Guide civilization through evolution by merging tiles. Start with Stone and evolve all the way to Space Colony!
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>🕹️ How to Play</ThemedText>
            <ThemedText style={styles.sectionText}>
              • Swipe up, down, left, or right to move all tiles{'\n'}
              • When two tiles of the same stage touch, they merge into the next evolution stage{'\n'}
              • After each move, a new Stone tile appears randomly{'\n'}
              • The game ends when the board is full and no moves are possible
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>📊 Scoring</ThemedText>
            <ThemedText style={styles.sectionText}>
              Each merge gives you points equal to the stage level × 10. Higher evolution stages give more points!
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>🧬 Evolution Path</ThemedText>
            <View style={styles.evolutionGrid}>
              {EVOLUTION_STAGES.map((stage, index) => (
                <View key={stage.id} style={styles.evolutionItem}>
                  <Text style={styles.evolutionEmoji}>{stage.emoji}</Text>
                  <ThemedText style={styles.evolutionName}>{stage.name}</ThemedText>
                  <ThemedText style={styles.evolutionScore}>{stage.score} pts</ThemedText>
                  {index < EVOLUTION_STAGES.length - 1 && (
                    <Text style={styles.evolutionArrow}>↓</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>💡 Tips</ThemedText>
            <ThemedText style={styles.sectionText}>
              • Keep your highest tiles in corners{'\n'}
              • Build up tiles in one direction{'\n'}
              • Plan ahead - don&apos;t just focus on immediate merges{'\n'}
              • Try to keep one corner free for maneuvering{'\n'}
              • Think about the consequences of each move
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>🏆 Victory</ThemedText>
            <ThemedText style={styles.sectionText}>
              Reach the Space Colony 🪐 to achieve evolution victory! But the game continues - see how high you can score!
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#8f7a66',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#8f7a66',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  evolutionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    marginTop: 12,
  },
  evolutionItem: {
    alignItems: 'center',
    width: '20%',
    minWidth: 60,
  },
  evolutionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  evolutionName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  evolutionScore: {
    fontSize: 8,
    opacity: 0.6,
    textAlign: 'center',
  },
  evolutionArrow: {
    fontSize: 16,
    opacity: 0.4,
    marginTop: 4,
  },
});