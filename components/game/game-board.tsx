import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, runOnJS } from 'react-native-reanimated';
import { Tile } from './tile';
import { GameBoard as GameBoardType, Direction, BOARD_SIZE } from '@/constants/game';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface GameBoardProps {
  board: GameBoardType;
  onMove: (direction: Direction) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const BOARD_PADDING = 20;
const BOARD_WIDTH = SCREEN_WIDTH - (BOARD_PADDING * 2);
const CELL_SIZE = (BOARD_WIDTH - (BOARD_SIZE + 1) * 4) / BOARD_SIZE;
const TILE_SIZE = CELL_SIZE - 4;

export function GameBoard({ board, onMove }: GameBoardProps) {
  const colorScheme = useColorScheme();

  const gestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      'worklet';
      const { velocityX, velocityY, translationX, translationY } = event;
      
      // Determine if the gesture is more horizontal or vertical
      const isHorizontal = Math.abs(velocityX) > Math.abs(velocityY);
      const threshold = 50;
      
      if (isHorizontal) {
        if (Math.abs(translationX) > threshold) {
          if (translationX > 0) {
            runOnJS(onMove)(Direction.RIGHT);
          } else {
            runOnJS(onMove)(Direction.LEFT);
          }
        }
      } else {
        if (Math.abs(translationY) > threshold) {
          if (translationY > 0) {
            runOnJS(onMove)(Direction.DOWN);
          } else {
            runOnJS(onMove)(Direction.UP);
          }
        }
      }
    },
  });

  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const cellBackgroundColor = colorScheme === 'dark' ? '#3a3a3a' : '#cdc1b4';

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.board, { backgroundColor }]}>
          {/* Background grid */}
          {Array.from({ length: BOARD_SIZE }, (_, row) =>
            Array.from({ length: BOARD_SIZE }, (_, col) => (
              <View
                key={`cell-${row}-${col}`}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cellBackgroundColor,
                    left: col * (CELL_SIZE + 4) + 4,
                    top: row * (CELL_SIZE + 4) + 4,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  },
                ]}
              />
            ))
          )}
          
          {/* Tiles */}
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => {
              if (!tile) return null;
              
              return (
                <View
                  key={tile.id}
                  style={[
                    styles.tileContainer,
                    {
                      left: colIndex * (CELL_SIZE + 4) + 4 + 2,
                      top: rowIndex * (CELL_SIZE + 4) + 4 + 2,
                    },
                  ]}
                >
                  <Tile tile={tile} size={TILE_SIZE} />
                </View>
              );
            })
          )}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_WIDTH,
    backgroundColor: '#bbada0',
    borderRadius: 8,
    position: 'relative',
    padding: 4,
  },
  cell: {
    position: 'absolute',
    borderRadius: 4,
  },
  tileContainer: {
    position: 'absolute',
  },
});