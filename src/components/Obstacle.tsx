
import React from 'react';

interface ObstacleProps {
  x: number;
  width: number;
  height: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ x, width, height }) => {
  // Obstacle styles
  const obstacleStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x}px`,
    bottom: '0px',
    width: `${width}px`,
    height: `${height}px`,
  };

  // Create a cactus-like obstacle
  return (
    <div style={obstacleStyle} className="obstacle">
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
    </div>
  );
};

export default Obstacle;
