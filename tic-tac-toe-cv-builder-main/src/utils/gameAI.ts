export type Player = 'X' | 'O' | null;
export type Board = Player[];

// Check if there's a winner
export const checkWinner = (board: Board): { winner: Player; line: number[] } => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  return { winner: null, line: [] };
};

// Get available moves
export const getAvailableMoves = (board: Board): number[] => {
  return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
};

// Easy AI - Random move
export const getEasyAIMove = (board: Board): number => {
  const availableMoves = getAvailableMoves(board);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Hard AI - Minimax algorithm
export const getHardAIMove = (board: Board, aiPlayer: 'X' | 'O'): number => {
  const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
  
  const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
    const { winner } = checkWinner(board);
    
    if (winner === aiPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (getAvailableMoves(board).length === 0) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board];
        newBoard[move] = aiPlayer;
        const score = minimax(newBoard, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board];
        newBoard[move] = humanPlayer;
        const score = minimax(newBoard, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  let bestMove = -1;
  let bestScore = -Infinity;
  
  for (const move of getAvailableMoves(board)) {
    const newBoard = [...board];
    newBoard[move] = aiPlayer;
    const score = minimax(newBoard, 0, false);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
};