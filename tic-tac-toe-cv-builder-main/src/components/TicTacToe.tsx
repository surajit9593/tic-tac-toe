import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GameModeSelection, GameMode } from './GameModeSelection';
import { checkWinner, getEasyAIMove, getHardAIMove } from '@/utils/gameAI';

type Player = 'X' | 'O' | null;
type GameResult = Player | 'draw';
type Board = Player[];

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

export const TicTacToe = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<GameResult>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [stats, setStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0 });
  const [isAIThinking, setIsAIThinking] = useState(false);
  const { toast } = useToast();

  // AI Move Effect
  useEffect(() => {
    if (!gameMode || gameMode === 'multiplayer' || winner || currentPlayer === 'X') return;
    
    const makeAIMove = async () => {
      setIsAIThinking(true);
      
      // Add delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let aiMove: number;
      if (gameMode === 'easy') {
        aiMove = getEasyAIMove(board);
      } else {
        aiMove = getHardAIMove(board, 'O');
      }
      
      if (aiMove !== -1) {
        handleCellClick(aiMove, true);
      }
      
      setIsAIThinking(false);
    };

    makeAIMove();
  }, [currentPlayer, gameMode, board, winner]);

  const handleCellClick = useCallback((index: number, isAIMove = false) => {
    if (board[index] || winner) return;
    if (!isAIMove && isAIThinking) return;
    if (!isAIMove && gameMode !== 'multiplayer' && currentPlayer === 'O') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: newWinner, line } = checkWinner(newBoard);
    
    if (newWinner) {
      setWinner(newWinner);
      setWinningLine(line);
      setStats(prev => ({
        ...prev,
        [newWinner === 'X' ? 'xWins' : 'oWins']: prev[newWinner === 'X' ? 'xWins' : 'oWins'] + 1
      }));
      
      const playerName = gameMode === 'multiplayer' ? `Player ${newWinner}` : 
                        newWinner === 'X' ? 'You' : 'AI';
      
      toast({
        title: `${playerName} Win${newWinner === 'X' && gameMode !== 'multiplayer' ? '' : 's'}! 🎉`,
        description: gameMode === 'multiplayer' ? "Congratulations!" : 
                    newWinner === 'X' ? "Great job!" : "Better luck next time!",
      });
    } else if (newBoard.every(cell => cell !== null)) {
      setWinner('draw');
      setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      toast({
        title: "It's a Draw! 🤝",
        description: "Well played!",
      });
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, winner, gameMode, isAIThinking, toast]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setIsAIThinking(false);
  }, []);

  const resetStats = useCallback(() => {
    setStats({ xWins: 0, oWins: 0, draws: 0 });
    toast({
      title: "Statistics Reset",
      description: "Game statistics have been cleared.",
    });
  }, [toast]);

  const backToModeSelection = useCallback(() => {
    setGameMode(null);
    resetGame();
  }, [resetGame]);

  const getCellContent = (index: number) => {
    const player = board[index];
    if (!player) return '';
    
    return (
      <span 
        className={`text-4xl font-bold animate-fade-in ${
          player === 'X' ? 'text-game-x' : 'text-game-o'
        } ${winningLine.includes(index) ? 'animate-winner-pulse' : ''}`}
      >
        {player}
      </span>
    );
  };

  const getGameStatus = () => {
    if (winner === 'draw') return "It's a Draw!";
    if (winner) {
      if (gameMode === 'multiplayer') return `Player ${winner} Wins!`;
      return winner === 'X' ? 'You Win!' : 'AI Wins!';
    }
    
    if (isAIThinking) return 'AI is thinking...';
    
    if (gameMode === 'multiplayer') {
      return `Player ${currentPlayer}'s Turn`;
    }
    return currentPlayer === 'X' ? 'Your Turn' : "AI's Turn";
  };

  const getModeDisplayName = () => {
    switch (gameMode) {
      case 'easy': return 'Easy Mode';
      case 'hard': return 'Hard Mode';
      case 'multiplayer': return 'Multiplayer';
      default: return '';
    }
  };

  // Show mode selection if no mode is selected
  if (!gameMode) {
    return <GameModeSelection onSelectMode={setGameMode} />;
  }

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      {/* Header */}
      <div className="text-center animate-slide-up">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
          Tic Tac Toe
        </h1>
        <p className="text-muted-foreground">{getModeDisplayName()}</p>
      </div>

      {/* Game Status */}
      <Card className="px-6 py-4 animate-slide-up">
        <h2 className={`text-2xl font-semibold text-center ${
          winner ? 'text-game-winner' : 
          isAIThinking ? 'text-muted-foreground' :
          currentPlayer === 'X' ? 'text-game-x' : 'text-game-o'
        }`}>
          {getGameStatus()}
        </h2>
      </Card>

      {/* Game Board */}
      <div className={`grid grid-cols-3 gap-2 p-4 bg-game-board rounded-lg shadow-lg animate-slide-up transition-opacity duration-300 ${
        isAIThinking && !winner ? 'opacity-70' : 'opacity-100'
      }`}>
        {board.map((_, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!!board[index] || !!winner || isAIThinking}
            className={`
              w-20 h-20 bg-game-cell hover:bg-game-cell-hover
              border border-border rounded-lg
              flex items-center justify-center
              transition-all duration-200
              disabled:cursor-not-allowed
              hover:scale-105 active:scale-95
              ${winningLine.includes(index) ? 'bg-game-winner/20 border-game-winner' : ''}
              ${!board[index] && !winner && !isAIThinking ? 'hover:shadow-md' : ''}
              ${isAIThinking ? 'cursor-wait' : ''}
            `}
            aria-label={`Cell ${index + 1}`}
          >
            {getCellContent(index)}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      <div className="flex gap-4 animate-slide-up">
        <Button 
          onClick={backToModeSelection}
          variant="outline"
          className="px-6 py-2"
        >
          Change Mode
        </Button>
        <Button 
          onClick={resetGame}
          variant="outline"
          className="px-6 py-2"
        >
          New Game
        </Button>
        <Button 
          onClick={resetStats}
          variant="secondary"
          className="px-6 py-2"
        >
          Reset Stats
        </Button>
      </div>

      {/* Statistics */}
      <Card className="p-6 w-full max-w-md animate-slide-up">
        <h3 className="text-lg font-semibold mb-4 text-center">Game Statistics</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-game-x">{stats.xWins}</div>
            <div className="text-sm text-muted-foreground">
              {gameMode === 'multiplayer' ? 'X Wins' : 'Your Wins'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-muted-foreground">{stats.draws}</div>
            <div className="text-sm text-muted-foreground">Draws</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-game-o">{stats.oWins}</div>
            <div className="text-sm text-muted-foreground">
              {gameMode === 'multiplayer' ? 'O Wins' : 'AI Wins'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};