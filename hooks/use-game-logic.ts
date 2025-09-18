import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  GameBoard, 
  GameState, 
  Tile, 
  TileValue, 
  Direction, 
  BOARD_SIZE, 
  INITIAL_TILES,
  EVOLUTION_STAGES 
} from '@/constants/game';

const BEST_SCORE_KEY = 'best_score';

/**
 * Creates an empty game board
 */
export function createEmptyBoard(): GameBoard {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
}

/**
 * Generates a unique tile ID
 */
function generateTileId(): string {
  return `tile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets all empty positions on the board
 */
function getEmptyPositions(board: GameBoard): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col]) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
}

/**
 * Adds a random tile to the board
 */
function addRandomTile(board: GameBoard): GameBoard {
  const emptyPositions = getEmptyPositions(board);
  if (emptyPositions.length === 0) return board;

  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const newBoard = board.map(row => [...row]);
  
  const newTile: Tile = {
    id: generateTileId(),
    value: 1, // Always start with Stone (stage 1)
    position: randomPosition,
    isNew: true,
  };

  newBoard[randomPosition.row][randomPosition.col] = newTile;
  return newBoard;
}

/**
 * Creates initial game state
 */
export async function createInitialGameState(): Promise<GameState> {
  const bestScore = await getBestScore();
  let board = createEmptyBoard();
  
  // Add initial tiles
  for (let i = 0; i < INITIAL_TILES; i++) {
    board = addRandomTile(board);
  }

  return {
    board,
    score: 0,
    bestScore,
    isGameOver: false,
    isWon: false,
    canUndo: false,
  };
}

/**
 * Moves tiles in a specific direction
 */
export function moveTiles(board: GameBoard, direction: Direction): { 
  newBoard: GameBoard; 
  scoreIncrease: number; 
  moved: boolean 
} {
  const newBoard = board.map(row => [...row]);
  let scoreIncrease = 0;
  let moved = false;

  // Clear merge flags
  newBoard.forEach(row => {
    row.forEach(tile => {
      if (tile) {
        tile.isMerged = false;
        tile.isNew = false;
      }
    });
  });

  const processLine = (line: (Tile | null)[]): { 
    newLine: (Tile | null)[]; 
    score: number; 
    lineMoved: boolean 
  } => {
    const filteredLine = line.filter(tile => tile !== null);
    const newLine: (Tile | null)[] = [];
    let lineScore = 0;
    let lineMoved = false;

    for (let i = 0; i < filteredLine.length; i++) {
      const currentTile = filteredLine[i];
      const nextTile = filteredLine[i + 1];

      if (nextTile && currentTile?.value === nextTile.value && !currentTile.isMerged) {
        // Merge tiles
        const mergedValue = (currentTile.value || 0) + 1;
        const mergedTile: Tile = {
          id: generateTileId(),
          value: Math.min(mergedValue, EVOLUTION_STAGES.length) as TileValue,
          position: currentTile.position,
          isMerged: true,
        };
        
        newLine.push(mergedTile);
        lineScore += EVOLUTION_STAGES[mergedValue - 1]?.score || 0;
        i++; // Skip next tile as it's merged
        lineMoved = true;
      } else {
        newLine.push(currentTile);
      }
    }

    // Fill remaining positions with null
    while (newLine.length < BOARD_SIZE) {
      newLine.push(null);
    }

    // Check if line moved
    if (!lineMoved) {
      for (let i = 0; i < line.length; i++) {
        if ((line[i] === null) !== (newLine[i] === null) || 
            (line[i] && newLine[i] && line[i]!.value !== newLine[i]!.value)) {
          lineMoved = true;
          break;
        }
      }
    }

    return { newLine, score: lineScore, lineMoved };
  };

  // Process based on direction
  if (direction === Direction.LEFT || direction === Direction.RIGHT) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      const line = direction === Direction.LEFT ? 
        newBoard[row] : 
        [...newBoard[row]].reverse();
      
      const { newLine, score, lineMoved } = processLine(line);
      
      if (lineMoved) moved = true;
      scoreIncrease += score;
      
      newBoard[row] = direction === Direction.LEFT ? newLine : newLine.reverse();
      
      // Update tile positions
      newBoard[row].forEach((tile, col) => {
        if (tile) {
          tile.position = { row, col };
        }
      });
    }
  } else {
    // UP or DOWN
    for (let col = 0; col < BOARD_SIZE; col++) {
      const line = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        line.push(newBoard[row][col]);
      }
      
      if (direction === Direction.DOWN) {
        line.reverse();
      }
      
      const { newLine, score, lineMoved } = processLine(line);
      
      if (lineMoved) moved = true;
      scoreIncrease += score;
      
      const finalLine = direction === Direction.DOWN ? newLine.reverse() : newLine;
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        newBoard[row][col] = finalLine[row];
        if (newBoard[row][col]) {
          newBoard[row][col]!.position = { row, col };
        }
      }
    }
  }

  return { newBoard, scoreIncrease, moved };
}

/**
 * Checks if there are any valid moves available
 */
export function hasValidMoves(board: GameBoard): boolean {
  // Check for empty cells
  if (getEmptyPositions(board).length > 0) return true;

  // Check for possible merges
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const currentTile = board[row][col];
      if (!currentTile) continue;

      // Check adjacent tiles
      const directions = [
        { row: row - 1, col }, // Up
        { row: row + 1, col }, // Down
        { row, col: col - 1 }, // Left
        { row, col: col + 1 }, // Right
      ];

      for (const { row: newRow, col: newCol } of directions) {
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
          const adjacentTile = board[newRow][newCol];
          if (adjacentTile && currentTile.value === adjacentTile.value) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Makes a move and returns new game state
 */
export function makeMove(gameState: GameState, direction: Direction): GameState {
  if (gameState.isGameOver) return gameState;

  const { newBoard, scoreIncrease, moved } = moveTiles(gameState.board, direction);
  
  if (!moved) return gameState;

  // Add new tile
  const boardWithNewTile = addRandomTile(newBoard);
  const newScore = gameState.score + scoreIncrease;
  const newBestScore = Math.max(gameState.bestScore, newScore);

  // Check for win condition (reaching Space Colony)
  const hasSpaceColony = boardWithNewTile.some(row => 
    row.some(tile => tile && tile.value === EVOLUTION_STAGES.length)
  );

  // Check game over
  const isGameOver = !hasValidMoves(boardWithNewTile);

  const newGameState: GameState = {
    board: boardWithNewTile,
    score: newScore,
    bestScore: newBestScore,
    isGameOver,
    isWon: hasSpaceColony,
    canUndo: true,
  };

  // Save best score
  if (newBestScore > gameState.bestScore) {
    saveBestScore(newBestScore);
  }

  return newGameState;
}

/**
 * Gets best score from storage
 */
export async function getBestScore(): Promise<number> {
  try {
    const score = await AsyncStorage.getItem(BEST_SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.warn('Failed to load best score:', error);
    return 0;
  }
}

/**
 * Saves best score to storage
 */
export async function saveBestScore(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(BEST_SCORE_KEY, score.toString());
  } catch (error) {
    console.warn('Failed to save best score:', error);
  }
}

/**
 * Gets stage info for a tile value
 */
export function getStageInfo(value: TileValue) {
  if (!value) return null;
  return EVOLUTION_STAGES[value - 1] || null;
}