
import React from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  // Format the score with leading zeros
  const formattedScore = score.toString().padStart(5, '0');
  const formattedHighScore = highScore.toString().padStart(5, '0');

  return (
    <div className="w-full flex justify-between items-center p-2 font-mono text-sm">
      <div className="score">
        <span className="font-bold mr-2">SCORE:</span>
        <span>{formattedScore}</span>
      </div>
      <div className="high-score">
        <span className="font-bold mr-2">HI:</span>
        <span>{formattedHighScore}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;
