import { Tile, GameState, Direction, Position, BOARD_SIZE, EVOLUTION_STAGES, WINNING_STAGE } from '@/types/game';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = 'evo_merge_best_score';

export const createEmptyBoard = (): (Tile | null)[][] => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

export const generateRandomTile = (board: (Tile | null)[][]): Tile | null => {
  const emptyCells: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  if (emptyCells.length === 0) return null;
  
  const randomPosition = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    stage: 1,
    value: EVOLUTION_STAGES[0].value,
    position: randomPosition,
    isNew: true,
  };
};

export const initializeGame = (): GameState => {
  const board = createEmptyBoard();
  
  // Add two initial tiles
  const firstTile = generateRandomTile(board);
  if (firstTile) {
    board[firstTile.position.row][firstTile.position.col] = firstTile;
  }
  
  const secondTile = generateRandomTile(board);
  if (secondTile) {
    board[secondTile.position.row][secondTile.position.col] = secondTile;
  }
  
  return {
    board,
    score: 0,
    bestScore: 0,
    isGameOver: false,
    hasWon: false,
  };
};

export const moveTiles = (board: (Tile | null)[][], direction: Direction): { 
  newBoard: (Tile | null)[][], 
  scoreIncrease: number, 
  moved: boolean 
} => {
  const newBoard = board.map(row => [...row]);
  let scoreIncrease = 0;
  let moved = false;

  const moveRow = (row: (Tile | null)[], reverse = false): { 
    newRow: (Tile | null)[], 
    score: number, 
    hasMoved: boolean 
  } => {
    const filteredRow = row.filter(tile => tile !== null);
    if (reverse) filteredRow.reverse();

    const mergedRow: (Tile | null)[] = [];
    let rowScore = 0;
    let i = 0;

    while (i < filteredRow.length) {
      const currentTile = filteredRow[i];
      const nextTile = filteredRow[i + 1];

      if (currentTile && nextTile && currentTile.stage === nextTile.stage) {
        // Merge tiles
        const newStage = Math.min(currentTile.stage + 1, EVOLUTION_STAGES.length);
        const mergedTile: Tile = {
          id: Math.random().toString(36).substr(2, 9),
          stage: newStage,
          value: EVOLUTION_STAGES[newStage - 1].value,
          position: currentTile.position,
          isMerged: true,
        };
        mergedRow.push(mergedTile);
        rowScore += mergedTile.value;
        i += 2; // Skip next tile as it's merged
      } else {
        mergedRow.push(currentTile);
        i++;
      }
    }

    // Fill the rest with nulls
    while (mergedRow.length < BOARD_SIZE) {
      mergedRow.push(null);
    }

    if (reverse) mergedRow.reverse();

    const hasMoved = JSON.stringify(row) !== JSON.stringify(mergedRow);
    return { newRow: mergedRow, score: rowScore, hasMoved };
  };

  switch (direction) {
    case 'left':
      for (let row = 0; row < BOARD_SIZE; row++) {
        const { newRow, score, hasMoved } = moveRow(newBoard[row]);
        newBoard[row] = newRow;
        scoreIncrease += score;
        moved = moved || hasMoved;
      }
      break;

    case 'right':
      for (let row = 0; row < BOARD_SIZE; row++) {
        const { newRow, score, hasMoved } = moveRow(newBoard[row], true);
        newBoard[row] = newRow;
        scoreIncrease += score;
        moved = moved || hasMoved;
      }
      break;

    case 'up':
      for (let col = 0; col < BOARD_SIZE; col++) {
        const column = newBoard.map(row => row[col]);
        const { newRow, score, hasMoved } = moveRow(column);
        for (let row = 0; row < BOARD_SIZE; row++) {
          newBoard[row][col] = newRow[row];
        }
        scoreIncrease += score;
        moved = moved || hasMoved;
      }
      break;

    case 'down':
      for (let col = 0; col < BOARD_SIZE; col++) {
        const column = newBoard.map(row => row[col]);
        const { newRow, score, hasMoved } = moveRow(column, true);
        for (let row = 0; row < BOARD_SIZE; row++) {
          newBoard[row][col] = newRow[row];
        }
        scoreIncrease += score;
        moved = moved || hasMoved;
      }
      break;
  }

  // Update tile positions
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard[row][col]) {
        newBoard[row][col]!.position = { row, col };
      }
    }
  }

  return { newBoard, scoreIncrease, moved };
};

export const checkGameOver = (board: (Tile | null)[][]): boolean => {
  // Check for empty cells
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col]) return false;
    }
  }

  // Check for possible merges
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const currentTile = board[row][col];
      if (!currentTile) continue;

      // Check right
      if (col < BOARD_SIZE - 1) {
        const rightTile = board[row][col + 1];
        if (rightTile && currentTile.stage === rightTile.stage) return false;
      }

      // Check down
      if (row < BOARD_SIZE - 1) {
        const downTile = board[row + 1][col];
        if (downTile && currentTile.stage === downTile.stage) return false;
      }
    }
  }

  return true;
};

export const checkWin = (board: (Tile | null)[][]): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = board[row][col];
      if (tile && tile.stage >= WINNING_STAGE) return true;
    }
  }
  return false;
};

export const saveBestScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(BEST_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Failed to save best score:', error);
  }
};

export const loadBestScore = async (): Promise<number> => {
  try {
    const score = await AsyncStorage.getItem(BEST_SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Failed to load best score:', error);
    return 0;
  }
};