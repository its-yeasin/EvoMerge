import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Link } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const gridOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    gridOpacity.value = withRepeat(
      withTiming(0.7, { duration: 2000 }),
      -1,
      true
    );
  }, [gridOpacity]);

  const animatedGridStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
  }));

  return (
    <ThemedView style={styles.container}>
      {/* Animated background grid */}
      <Animated.View style={[styles.backgroundGrid, animatedGridStyle]}>
        {Array.from({ length: 16 }, (_, i) => (
          <View 
            key={i} 
            style={[
              styles.gridCell,
              { backgroundColor: colorScheme === 'dark' ? '#3a3a3a' : '#cdc1b4' }
            ]} 
          />
        ))}
      </Animated.View>

      <View style={styles.content}>
        <ThemedText style={styles.title}>2048 Evolution</ThemedText>
        <ThemedText style={styles.subtitle}>
          Guide civilization from Stone Age to Space Colony
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Link href="/game" asChild>
            <TouchableOpacity style={[styles.button, styles.playButton]}>
              <ThemedText style={[styles.buttonText, { color: '#ffffff' }]}>
                Play
              </ThemedText>
            </TouchableOpacity>
          </Link>

          <Link href="/how-to-play" asChild>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <ThemedText style={[styles.buttonText, { color: '#8f7a66' }]}>
                How to Play
              </ThemedText>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <ThemedText style={[styles.buttonText, { color: '#8f7a66' }]}>
              High Scores
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.stagesPreview}>
          <ThemedText style={styles.previewTitle}>Evolution Path</ThemedText>
          <View style={styles.stagesRow}>
            <Text style={styles.stageEmoji}>🪨</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.stageEmoji}>🔥</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.stageEmoji}>🛖</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.stageEmoji}>🏠</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.stageEmoji}>🪐</Text>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 8,
  },
  gridCell: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#8f7a66',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
    maxWidth: 280,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#8f7a66',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8f7a66',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  stagesPreview: {
    marginTop: 40,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.8,
  },
  stagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageEmoji: {
    fontSize: 24,
  },
  arrow: {
    fontSize: 16,
    opacity: 0.6,
  },
});
