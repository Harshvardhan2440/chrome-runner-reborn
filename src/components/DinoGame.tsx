
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Dino from './Dino';
import Obstacle from './Obstacle';
import Ground from './Ground';
import ScoreBoard from './ScoreBoard';
import GameOverScreen from './GameOverScreen';

const DinoGame: React.FC = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoPosition, setDinoPosition] = useState({ y: 0, isJumping: false });
  const [obstacles, setObstacles] = useState<{ id: number; x: number; width: number; height: number }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameSpeed = useRef(5);
  const animationFrameId = useRef(0);
  const lastObstacleTime = useRef(0);
  const { toast } = useToast();

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('dinoHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Handle jumping logic
  const handleJump = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    
    if (!dinoPosition.isJumping && !isGameOver) {
      setDinoPosition({ y: 0, isJumping: true });
      
      // Jump animation
      let jumpHeight = 0;
      const jumpInterval = setInterval(() => {
        jumpHeight += 1;
        
        if (jumpHeight <= 15) {
          // Going up
          setDinoPosition(prev => ({ ...prev, y: jumpHeight * 5 }));
        } else if (jumpHeight <= 30) {
          // Going down
          setDinoPosition(prev => ({ ...prev, y: (30 - jumpHeight) * 5 }));
        } else {
          // Jump complete
          setDinoPosition({ y: 0, isJumping: false });
          clearInterval(jumpInterval);
        }
      }, 15);
    }
  };

  // Handle keydown events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.key === 'ArrowUp') && !e.repeat) {
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, dinoPosition.isJumping, isGameOver]);

  // Game loop
  const gameLoop = (timestamp: number) => {
    if (!lastObstacleTime.current) {
      lastObstacleTime.current = timestamp;
    }

    // Update score
    setScore(prev => prev + 1);
    
    // Increase game speed gradually
    if (score > 0 && score % 500 === 0) {
      gameSpeed.current += 0.1;
    }

    // Generate obstacles
    const timeSinceLastObstacle = timestamp - lastObstacleTime.current;
    if (timeSinceLastObstacle > Math.random() * 2000 + 1000) {
      const newObstacle = {
        id: Date.now(),
        x: 800, // Start from outside right edge
        width: Math.floor(Math.random() * 20) + 20, // Random width between 20-40px
        height: Math.floor(Math.random() * 30) + 30, // Random height between 30-60px
      };
      
      setObstacles(prev => [...prev, newObstacle]);
      lastObstacleTime.current = timestamp;
    }

    // Move obstacles
    setObstacles(prevObstacles => 
      prevObstacles
        .map(obstacle => ({
          ...obstacle,
          x: obstacle.x - gameSpeed.current,
        }))
        .filter(obstacle => obstacle.x > -obstacle.width) // Remove obstacles that have gone off screen
    );

    // Check for collisions
    const dinoTop = 150 - dinoPosition.y;
    const dinoBottom = 180 - dinoPosition.y;
    const dinoLeft = 50;
    const dinoRight = 80;

    const collision = obstacles.some(obstacle => {
      const obstacleTop = 150;
      const obstacleBottom = 150 + obstacle.height;
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;

      return (
        dinoRight > obstacleLeft &&
        dinoLeft < obstacleRight &&
        dinoBottom > obstacleTop &&
        dinoTop < obstacleBottom
      );
    });

    if (collision) {
      gameOver();
    } else if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  };

  // Start game function
  const startGame = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setObstacles([]);
    setDinoPosition({ y: 0, isJumping: false });
    lastObstacleTime.current = 0;
    gameSpeed.current = 5;
    
    animationFrameId.current = requestAnimationFrame(gameLoop);
    toast({
      title: "Game Started!",
      description: "Press Space or tap to jump",
    });
  };

  // Game over function
  const gameOver = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    cancelAnimationFrame(animationFrameId.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('dinoHighScore', score.toString());
      toast({
        title: "New High Score!",
        description: `You scored ${score} points!`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <ScoreBoard score={score} highScore={highScore} />
      
      <div 
        ref={gameAreaRef}
        className="relative w-full h-[200px] mt-4 border-2 border-gray-800 overflow-hidden bg-white cursor-pointer"
        onClick={handleJump}
      >
        <Dino position={dinoPosition} isGameOver={isGameOver} />
        
        {obstacles.map(obstacle => (
          <Obstacle
            key={obstacle.id}
            x={obstacle.x}
            width={obstacle.width}
            height={obstacle.height}
          />
        ))}
        
        <Ground gameSpeed={gameSpeed.current} />
        
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Chrome Dino Runner</h2>
              <p className="mb-4">Press Space or Click/Tap to Start</p>
              <button 
                onClick={startGame}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
        
        {isGameOver && (
          <GameOverScreen score={score} highScore={highScore} onRestart={startGame} />
        )}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Press Space or Click/Tap to jump</p>
      </div>
    </div>
  );
};

export default DinoGame;
