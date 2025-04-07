
import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score >= highScore;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Game Over</h2>
        <p className="text-lg mb-1">Score: {score}</p>
        <p className="text-lg mb-4">High Score: {highScore}</p>
        
        {isNewHighScore && score > 0 && (
          <div className="mb-4 text-xl font-bold text-green-600">
            New High Score!
          </div>
        )}
        
        <button 
          onClick={onRestart}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
