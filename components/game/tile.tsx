import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Tile as TileType, STAGE_COLORS } from '@/constants/game';
import { getStageInfo } from '@/hooks/use-game-logic';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface TileProps {
  tile: TileType;
  size: number;
}

export function Tile({ tile, size }: TileProps) {
  const colorScheme = useColorScheme();
  const stageInfo = getStageInfo(tile.value);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = tile.isNew || tile.isMerged ? 
      withSequence(
        withTiming(1.1, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      ) : 
      1;

    return {
      transform: [{ scale }],
    };
  });
  
  if (!stageInfo) return null;

  const backgroundColor = STAGE_COLORS[stageInfo.id as keyof typeof STAGE_COLORS] || '#cdc1b4';

  return (
    <Animated.View 
      style={[
        styles.tile, 
        { 
          width: size, 
          height: size, 
          backgroundColor,
        },
        animatedStyle
      ]}
    >
      <Text style={styles.emoji}>{stageInfo.emoji}</Text>
      <Text style={[
        styles.stageName,
        { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
      ]}>
        {stageInfo.name}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  stageName: {
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
});