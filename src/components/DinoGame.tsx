
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Dino from './Dino';
import Obstacle from './Obstacle';
import Coin from './Coin';
import Ground from './Ground';
import ScoreBoard from './ScoreBoard';
import GameOverScreen from './GameOverScreen';

interface ObstacleObject {
  id: number;
  x: number;
  width: number;
  height: number;
  type: 'cactus' | 'rock' | 'bird';
}

interface CoinObject {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

const DinoGame: React.FC = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoPosition, setDinoPosition] = useState({ y: 0, isJumping: false });
  const [obstacles, setObstacles] = useState<ObstacleObject[]>([]);
  const [coinObjects, setCoinObjects] = useState<CoinObject[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameSpeed = useRef(5);
  const animationFrameId = useRef(0);
  const lastObstacleTime = useRef(0);
  const lastCoinTime = useRef(0);
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

  // Generate random obstacle type
  const generateObstacleType = (): 'cactus' | 'rock' | 'bird' => {
    const types: ('cactus' | 'rock' | 'bird')[] = ['cactus', 'rock', 'bird'];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Add function to generate initial obstacles and coins
  const generateInitialElements = () => {
    // Generate 2-3 initial obstacles at different distances
    const initialObstacles: ObstacleObject[] = [];
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      const obstacleType = generateObstacleType();
      let height = Math.floor(Math.random() * 30) + 30; // Random height between 30-60px
      
      if (obstacleType === 'bird') {
        height = 20;
      }
      
      initialObstacles.push({
        id: Date.now() + i,
        x: 800 + (i * 400), // Spaced out along the course
        width: Math.floor(Math.random() * 20) + 20, // Random width between 20-40px
        height,
        type: obstacleType
      });
    }
    setObstacles(initialObstacles);
    
    // Generate 1-2 initial coins
    const initialCoins: CoinObject[] = [];
    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
      initialCoins.push({
        id: Date.now() + 100 + i, // Different ID range than obstacles
        x: 1000 + (i * 350), // Spaced out differently than obstacles
        y: Math.floor(Math.random() * 80) + 20, // Random height between 20-100px
        collected: false
      });
    }
    setCoinObjects(initialCoins);
  };

  // Game loop
  const gameLoop = (timestamp: number) => {
    if (!lastObstacleTime.current) {
      lastObstacleTime.current = timestamp;
    }
    
    if (!lastCoinTime.current) {
      lastCoinTime.current = timestamp;
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
      const obstacleType = generateObstacleType();
      let height = Math.floor(Math.random() * 30) + 30; // Random height between 30-60px
      
      // Adjust height for birds (smaller)
      if (obstacleType === 'bird') {
        height = 20;
      }
      
      const newObstacle = {
        id: Date.now(),
        x: 800, // Start from outside right edge
        width: Math.floor(Math.random() * 20) + 20, // Random width between 20-40px
        height,
        type: obstacleType
      };
      
      setObstacles(prev => [...prev, newObstacle]);
      lastObstacleTime.current = timestamp;
    }

    // Generate coins
    const timeSinceLastCoin = timestamp - lastCoinTime.current;
    if (timeSinceLastCoin > Math.random() * 2000 + 1000) {
      const newCoin = {
        id: Date.now(),
        x: 800, // Start from outside right edge
        y: Math.floor(Math.random() * 80) + 20, // Random height between 20-100px
        collected: false
      };
      
      setCoinObjects(prev => [...prev, newCoin]);
      lastCoinTime.current = timestamp;
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

    // Move coins
    setCoinObjects(prevCoins => 
      prevCoins
        .map(coin => ({
          ...coin,
          x: coin.x - gameSpeed.current,
        }))
        .filter(coin => coin.x > -20 || coin.collected) // Remove coins that have gone off screen and not collected
    );

    // Check for collisions with obstacles
    const dinoTop = 150 - dinoPosition.y;
    const dinoBottom = 180 - dinoPosition.y;
    const dinoLeft = 50;
    const dinoRight = 80;

    const obstacleCollision = obstacles.some(obstacle => {
      const obstacleTop = obstacle.type === 'bird' ? 90 : 150;
      const obstacleBottom = obstacleTop + obstacle.height;
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;

      return (
        dinoRight > obstacleLeft &&
        dinoLeft < obstacleRight &&
        dinoBottom > obstacleTop &&
        dinoTop < obstacleBottom
      );
    });

    // Check for coin collections
    setCoinObjects(prevCoins => 
      prevCoins.map(coin => {
        // If already collected, just return it
        if (coin.collected) return coin;
        
        const coinTop = 150 - coin.y;
        const coinBottom = 170 - coin.y;
        const coinLeft = coin.x;
        const coinRight = coin.x + 20;
        
        const collected = (
          dinoRight > coinLeft &&
          dinoLeft < coinRight &&
          dinoBottom > coinTop &&
          dinoTop < coinBottom
        );
        
        if (collected) {
          // Increment coins
          setCoins(prev => prev + 1);
          // Add bonus score
          setScore(prev => prev + 50);
          // Show toast
          toast({
            title: "Coin collected!",
            description: "+50 points",
            duration: 1000,
          });
        }
        
        return { ...coin, collected };
      })
    );

    if (obstacleCollision) {
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
    setCoins(0);
    setObstacles([]);
    setCoinObjects([]);
    setDinoPosition({ y: 0, isJumping: false });
    lastObstacleTime.current = 0;
    lastCoinTime.current = 0;
    gameSpeed.current = 5;
    
    // Generate initial obstacles and coins
    generateInitialElements();
    
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
    
    // Calculate final score including coin bonuses
    const finalScore = score + (coins * 50);
    setScore(finalScore);
    
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('dinoHighScore', finalScore.toString());
      toast({
        title: "New High Score!",
        description: `You scored ${finalScore} points with ${coins} coins!`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <ScoreBoard score={score} highScore={highScore} coins={coins} />
      
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
            type={obstacle.type}
          />
        ))}
        
        {coinObjects.map(coin => (
          <Coin
            key={coin.id}
            x={coin.x}
            y={coin.y}
            collected={coin.collected}
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
        <p>Collect stars for bonus points!</p>
      </div>
    </div>
  );
};

export default DinoGame;
