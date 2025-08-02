import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type GameMode = 'easy' | 'hard' | 'multiplayer';

interface GameModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
}

export const GameModeSelection = ({ onSelectMode }: GameModeSelectionProps) => {
  const modes = [
    {
      id: 'easy' as GameMode,
      title: 'Easy Mode',
      description: 'Play against a basic AI opponent',
      icon: '🟢',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
      borderColor: 'border-green-500/30 hover:border-green-500/50'
    },
    {
      id: 'hard' as GameMode,
      title: 'Hard Mode',
      description: 'Challenge a smart AI opponent',
      icon: '🔴',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 hover:bg-red-500/20',
      borderColor: 'border-red-500/30 hover:border-red-500/50'
    },
    {
      id: 'multiplayer' as GameMode,
      title: 'Multiplayer',
      description: 'Play with a friend locally',
      icon: '👥',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      borderColor: 'border-blue-500/30 hover:border-blue-500/50'
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
          Choose Game Mode
        </h1>
        <p className="text-muted-foreground">Select your preferred difficulty level</p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid gap-6 w-full max-w-2xl animate-slide-up">
        {modes.map((mode, index) => (
          <Card 
            key={mode.id}
            className={`
              p-6 cursor-pointer transition-all duration-300 hover:scale-105
              ${mode.bgColor} ${mode.borderColor}
              animate-fade-in
            `}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onSelectMode(mode.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{mode.icon}</div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold ${mode.color} mb-1`}>
                  {mode.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {mode.description}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="hover-scale"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode(mode.id);
                }}
              >
                Select
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Feature Info */}
      <Card className="p-4 w-full max-w-2xl bg-muted/50 animate-slide-up">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">✨ Features included:</p>
          <div className="flex justify-center space-x-6 text-xs">
            <span>🏆 Score Tracking</span>
            <span>🎯 Win Detection</span>
            <span>🔄 Quick Restart</span>
            <span>📱 Touch Friendly</span>
          </div>
        </div>
      </Card>
    </div>
  );
};