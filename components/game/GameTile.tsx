import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Tile, EVOLUTION_STAGES } from '@/types/game';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GameTileProps {
  tile: Tile | null;
  size: number;
}

const TILE_MARGIN = 8;

export const GameTile: React.FC<GameTileProps> = ({ tile, size }) => {
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  React.useEffect(() => {
    if (tile?.isNew) {
      scale.value = 0;
      scale.value = withSpring(1);
    } else if (tile?.isMerged) {
      scale.value = withSpring(1.1, {}, () => {
        scale.value = withSpring(1);
      });
    }
  }, [tile?.isNew, tile?.isMerged, scale]);

  if (!tile) {
    return (
      <View
        style={[
          styles.emptyTile,
          {
            width: size,
            height: size,
            backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
          },
        ]}
      />
    );
  }

  const stageData = EVOLUTION_STAGES[tile.stage - 1];
  const backgroundColor = getTileColor(tile.stage, colorScheme);

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor,
        },
        animatedStyle,
      ]}
    >
      <Text style={styles.emoji}>{stageData.emoji}</Text>
      <Text
        style={[
          styles.stageName,
          { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' },
        ]}
      >
        {stageData.name}
      </Text>
    </Animated.View>
  );
};

const getTileColor = (stage: number, colorScheme: string | null | undefined): string => {
  const colors = [
    '#8F7A66', // Stone - Brown
    '#F65E3B', // Fire - Red
    '#EDC22E', // Hut - Yellow
    '#7FB069', // House - Green
    '#4E9DF5', // City - Blue
    '#9B59B6', // Skyscraper - Purple
    '#E67E22', // Satellite - Orange
    '#E74C3C', // Space Colony - Deep Red
  ];
  
  const baseColor = colors[Math.min(stage - 1, colors.length - 1)];
  return colorScheme === 'dark' ? baseColor : baseColor;
};

const styles = StyleSheet.create({
  emptyTile: {
    borderRadius: 8,
    margin: TILE_MARGIN / 2,
  },
  tile: {
    borderRadius: 8,
    margin: TILE_MARGIN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  stageName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});