import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming 
} from 'react-native-reanimated';
import { Tile, EVOLUTION_STAGES } from '@/constants/game';
import { useThemeColor } from '@/hooks/use-theme-color';

interface TileComponentProps {
  tile: Tile | null;
  size: number;
}

export function TileComponent({ tile, size }: TileComponentProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');
  
  const animatedStyle = useAnimatedStyle(() => {
    if (!tile) return {};
    
    const scale = tile.isNew 
      ? withSequence(withTiming(1.2, { duration: 100 }), withSpring(1))
      : tile.isMerged 
        ? withSequence(withTiming(1.1, { duration: 100 }), withSpring(1))
        : withSpring(1);
    
    return {
      transform: [{ scale }],
    };
  });

  if (!tile) {
    return (
      <View 
        style={[
          styles.emptyTile, 
          { 
            width: size, 
            height: size,
            backgroundColor: backgroundColor + '40',
            borderColor: borderColor + '20',
          }
        ]} 
      />
    );
  }

  const stageInfo = EVOLUTION_STAGES.find(s => s.id === tile.stage);

  const getTileColor = (stage: number): string => {
    const colors = [
      '#8B4513', // Stone - Brown
      '#FF4500', // Fire - Red Orange
      '#8B4513', // Hut - Brown
      '#4682B4', // House - Steel Blue
      '#708090', // City - Slate Gray
      '#2F4F4F', // Skyscraper - Dark Slate Gray
      '#191970', // Satellite - Midnight Blue
      '#4B0082', // Space Colony - Indigo
    ];
    return colors[stage - 1] || '#000000';
  };

  return (
    <Animated.View 
      style={[
        styles.tile, 
        { 
          width: size, 
          height: size,
          backgroundColor: getTileColor(tile.stage),
        },
        animatedStyle
      ]}
    >
      <Text style={styles.emoji}>{stageInfo?.emoji || '❓'}</Text>
      <Text style={styles.stageName}>{stageInfo?.name || `Stage ${tile.stage}`}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  emptyTile: {
    borderRadius: 8,
    borderWidth: 1,
    margin: 2,
  },
  tile: {
    borderRadius: 8,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  stageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});