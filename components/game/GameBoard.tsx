import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { TileComponent } from './TileComponent';
import { GameState, Direction, DIRECTIONS, GRID_SIZE } from '@/constants/game';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width: screenWidth } = Dimensions.get('window');
const BOARD_PADDING = 20;
const TILE_MARGIN = 4;
const BOARD_SIZE = screenWidth - BOARD_PADDING * 2;
const TILE_SIZE = (BOARD_SIZE - TILE_MARGIN * (GRID_SIZE + 1)) / GRID_SIZE;

interface GameBoardProps {
  gameState: GameState;
  onMove: (direction: Direction) => void;
}

export function GameBoard({ gameState, onMove }: GameBoardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');

  const swipeGesture = Gesture.Pan()
    .minDistance(50)
    .onEnd((event) => {
      const { translationX, translationY } = event;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      if (absX > absY) {
        // Horizontal swipe
        if (translationX > 0) {
          onMove(DIRECTIONS.RIGHT);
        } else {
          onMove(DIRECTIONS.LEFT);
        }
      } else {
        // Vertical swipe
        if (translationY > 0) {
          onMove(DIRECTIONS.DOWN);
        } else {
          onMove(DIRECTIONS.UP);
        }
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={[
        styles.board, 
        { 
          backgroundColor: backgroundColor + '80',
          borderColor: borderColor + '40',
          width: BOARD_SIZE,
          height: BOARD_SIZE,
        }
      ]}>
        {gameState.grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.tileContainer,
                {
                  top: rowIndex * (TILE_SIZE + TILE_MARGIN) + TILE_MARGIN,
                  left: colIndex * (TILE_SIZE + TILE_MARGIN) + TILE_MARGIN,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                }
              ]}
            >
              <TileComponent tile={tile} size={TILE_SIZE} />
            </View>
          ))
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  board: {
    borderRadius: 12,
    borderWidth: 2,
    position: 'relative',
    alignSelf: 'center',
  },
  tileContainer: {
    position: 'absolute',
  },
});