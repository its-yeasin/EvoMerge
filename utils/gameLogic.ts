import { GRID_SIZE, INITIAL_TILES, GameState, Tile, Direction, DIRECTIONS, EVOLUTION_STAGES } from '@/constants/game';

const BEST_SCORE_KEY = '@EvoMerge:bestScore';

export const createEmptyGrid = (): (Tile | null)[][] => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

export const getEmptyPositions = (grid: (Tile | null)[][]): { row: number; col: number }[] => {
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col]) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
};

export const generateRandomTile = (grid: (Tile | null)[][]): Tile | null => {
  const emptyPositions = getEmptyPositions(grid);
  if (emptyPositions.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * emptyPositions.length);
  const position = emptyPositions[randomIndex];
  
  return {
    id: `${Date.now()}-${Math.random()}`,
    stage: 1, // Always start with Stone
    position,
    isNew: true,
  };
};

export const initializeGame = (): GameState => {
  const grid = createEmptyGrid();
  
  // Add initial tiles
  for (let i = 0; i < INITIAL_TILES; i++) {
    const tile = generateRandomTile(grid);
    if (tile) {
      grid[tile.position.row][tile.position.col] = tile;
    }
  }
  
  return {
    grid,
    score: 0,
    bestScore: 0,
    isGameOver: false,
    canUndo: false,
  };
};

export const canMove = (grid: (Tile | null)[][], direction: Direction): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = grid[row][col];
      if (!tile) continue;
      
      let nextRow = row;
      let nextCol = col;
      
      switch (direction) {
        case DIRECTIONS.UP:
          nextRow = row - 1;
          break;
        case DIRECTIONS.DOWN:
          nextRow = row + 1;
          break;
        case DIRECTIONS.LEFT:
          nextCol = col - 1;
          break;
        case DIRECTIONS.RIGHT:
          nextCol = col + 1;
          break;
      }
      
      if (nextRow >= 0 && nextRow < GRID_SIZE && nextCol >= 0 && nextCol < GRID_SIZE) {
        const nextTile = grid[nextRow][nextCol];
        if (!nextTile || (nextTile.stage === tile.stage && !nextTile.isMerged)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isGameOver = (grid: (Tile | null)[][]): boolean => {
  // Check if grid is full
  if (getEmptyPositions(grid).length > 0) return false;
  
  // Check if any moves are possible
  return !Object.values(DIRECTIONS).some(direction => canMove(grid, direction));
};

export const moveTiles = (grid: (Tile | null)[][], direction: Direction): {
  newGrid: (Tile | null)[][];
  scoreGained: number;
  moved: boolean;
} => {
  const newGrid = createEmptyGrid();
  let scoreGained = 0;
  let moved = false;
  
  // Clear merge flags
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = grid[row][col];
      if (tile) {
        tile.isMerged = false;
        tile.isNew = false;
      }
    }
  }
  
  const processLine = (line: (Tile | null)[]): { 
    newLine: (Tile | null)[]; 
    score: number; 
    lineMoved: boolean;
  } => {
    const nonNullTiles = line.filter(tile => tile !== null) as Tile[];
    const newLine: (Tile | null)[] = Array(GRID_SIZE).fill(null);
    let score = 0;
    let lineMoved = false;
    let writeIndex = 0;
    
    for (let i = 0; i < nonNullTiles.length; i++) {
      const currentTile = nonNullTiles[i];
      
      if (i < nonNullTiles.length - 1 && 
          nonNullTiles[i + 1].stage === currentTile.stage && 
          !currentTile.isMerged && 
          !nonNullTiles[i + 1].isMerged) {
        // Merge tiles
        const mergedTile: Tile = {
          ...currentTile,
          stage: currentTile.stage + 1,
          isMerged: true,
        };
        newLine[writeIndex] = mergedTile;
        const stageInfo = EVOLUTION_STAGES.find(s => s.id === mergedTile.stage);
        score += stageInfo ? stageInfo.points : mergedTile.stage * 10;
        i++; // Skip next tile as it's merged
        lineMoved = true;
      } else {
        newLine[writeIndex] = currentTile;
      }
      writeIndex++;
    }
    
    // Check if tiles moved positions
    for (let i = 0; i < GRID_SIZE; i++) {
      if ((line[i] === null) !== (newLine[i] === null) || 
          (line[i] && newLine[i] && line[i]!.id !== newLine[i]!.id)) {
        lineMoved = true;
      }
    }
    
    return { newLine, score, lineMoved };
  };
  
  if (direction === DIRECTIONS.LEFT || direction === DIRECTIONS.RIGHT) {
    for (let row = 0; row < GRID_SIZE; row++) {
      let line = [...grid[row]];
      if (direction === DIRECTIONS.RIGHT) {
        line.reverse();
      }
      
      const { newLine, score, lineMoved } = processLine(line);
      
      if (direction === DIRECTIONS.RIGHT) {
        newLine.reverse();
      }
      
      newGrid[row] = newLine;
      scoreGained += score;
      if (lineMoved) moved = true;
      
      // Update positions
      for (let col = 0; col < GRID_SIZE; col++) {
        const tile = newGrid[row][col];
        if (tile) {
          tile.position = { row, col };
        }
      }
    }
  } else {
    for (let col = 0; col < GRID_SIZE; col++) {
      let line: (Tile | null)[] = [];
      for (let row = 0; row < GRID_SIZE; row++) {
        line.push(grid[row][col]);
      }
      
      if (direction === DIRECTIONS.DOWN) {
        line.reverse();
      }
      
      const { newLine, score, lineMoved } = processLine(line);
      
      if (direction === DIRECTIONS.DOWN) {
        newLine.reverse();
      }
      
      for (let row = 0; row < GRID_SIZE; row++) {
        newGrid[row][col] = newLine[row];
        const tile = newGrid[row][col];
        if (tile) {
          tile.position = { row, col };
        }
      }
      
      scoreGained += score;
      if (lineMoved) moved = true;
    }
  }
  
  return { newGrid, scoreGained, moved };
};