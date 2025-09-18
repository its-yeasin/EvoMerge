import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { GameTile } from './GameTile';
import { Tile, Direction, BOARD_SIZE } from '@/types/game';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GameBoardProps {
  board: (Tile | null)[][];
  onMove: (direction: Direction) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const BOARD_MARGIN = 20;
const TILE_MARGIN = 8;
const BOARD_WIDTH = screenWidth - (BOARD_MARGIN * 2);
const TILE_SIZE = (BOARD_WIDTH - (TILE_MARGIN * (BOARD_SIZE + 1))) / BOARD_SIZE;

export const GameBoard: React.FC<GameBoardProps> = ({ board, onMove }) => {
  const colorScheme = useColorScheme();

  const handleGesture = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    const threshold = 50;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      // Horizontal movement
      if (Math.abs(translationX) > threshold) {
        if (translationX > 0) {
          onMove('right');
        } else {
          onMove('left');
        }
      }
    } else {
      // Vertical movement
      if (Math.abs(translationY) > threshold) {
        if (translationY > 0) {
          onMove('down');
        } else {
          onMove('up');
        }
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View
          style={[
            styles.board,
            {
              backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#E5E5EA',
              width: BOARD_WIDTH,
              height: BOARD_WIDTH,
            },
          ]}
        >
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <GameTile
                key={`${rowIndex}-${colIndex}`}
                tile={tile}
                size={TILE_SIZE}
              />
            ))
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderRadius: 12,
    padding: TILE_MARGIN / 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});