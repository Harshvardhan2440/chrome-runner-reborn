
import React from 'react';
import { Star } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  coins: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore, coins }) => {
  // Format the score with leading zeros
  const formattedScore = score.toString().padStart(5, '0');
  const formattedHighScore = highScore.toString().padStart(5, '0');

  return (
    <div className="w-full flex justify-between items-center p-2 font-mono text-sm">
      <div className="score">
        <span className="font-bold mr-2">SCORE:</span>
        <span>{formattedScore}</span>
      </div>
      <div className="coins flex items-center">
        <Star size={16} fill="#FFD700" color="#FFD700" className="mr-1" />
        <span className="font-bold">{coins}</span>
      </div>
      <div className="high-score">
        <span className="font-bold mr-2">HI:</span>
        <span>{formattedHighScore}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;
