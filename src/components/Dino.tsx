
import React from 'react';

interface DinoProps {
  position: {
    y: number;
    isJumping: boolean;
  };
  isGameOver: boolean;
}

const Dino: React.FC<DinoProps> = ({ position, isGameOver }) => {
  // Dinosaur character styles
  const dinoStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50px',
    bottom: `${position.y}px`,
    width: '30px', 
    height: '30px',
    transition: position.isJumping ? 'none' : 'transform 0.1s',
    transform: isGameOver ? 'rotate(90deg)' : 'none',
  };

  return (
    <div style={dinoStyle} className="dino">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="0" width="20" height="5" fill="black" />
        <rect x="5" y="5" width="30" height="5" fill="black" />
        <rect x="5" y="10" width="30" height="5" fill="black" />
        <rect x="5" y="15" width="25" height="5" fill="black" />
        <rect x="10" y="20" width="20" height="5" fill="black" />
        <rect x="5" y="25" width="10" height="5" fill="black" />
        <rect x="20" y="25" width="10" height="5" fill="black" />
        <rect x="5" y="30" width="5" height="5" fill="black" />
        <rect x="15" y="30" width="5" height="5" fill="black" />
        <rect x="25" y="30" width="5" height="5" fill="black" />
      </svg>
    </div>
  );
};

export default Dino;
