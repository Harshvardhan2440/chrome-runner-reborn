
import React from 'react';

interface ObstacleProps {
  x: number;
  width: number;
  height: number;
  type: 'cactus' | 'rock' | 'bird';
}

const Obstacle: React.FC<ObstacleProps> = ({ x, width, height, type }) => {
  // Obstacle styles
  const obstacleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x}px`,
    bottom: type === 'bird' ? '60px' : '0px', // Birds fly higher
    width: `${width}px`,
    height: `${height}px`,
  };

  // Render different obstacle types
  const renderObstacle = () => {
    switch (type) {
      case 'cactus':
        return (
          <svg
            viewBox="0 0 20 40"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <rect x="7" y="0" width="6" height="40" fill="black" />
            <rect x="0" y="10" width="7" height="4" fill="black" />
            <rect x="13" y="15" width="7" height="4" fill="black" />
            <rect x="0" y="10" width="3" height="15" fill="black" />
            <rect x="17" y="15" width="3" height="15" fill="black" />
          </svg>
        );
      case 'rock':
        return (
          <svg
            viewBox="0 0 20 20"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <path 
              d="M2,20 L18,20 L20,15 L18,8 L13,5 L7,7 L2,10 Z" 
              fill="#666" 
              stroke="black" 
              strokeWidth="1"
            />
          </svg>
        );
      case 'bird':
        return (
          <svg
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <path 
              d="M5,5 Q10,0 15,5 Q20,10 25,5" 
              stroke="black" 
              strokeWidth="1" 
              fill="transparent"
            />
            <circle cx="25" cy="5" r="2" fill="black" />
            <path 
              d="M25,5 L28,3 L28,7 Z" 
              fill="black" 
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={obstacleStyle} className="obstacle">
      {renderObstacle()}
    </div>
  );
};

export default Obstacle;
