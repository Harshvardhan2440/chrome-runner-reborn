
import React from 'react';

interface GroundProps {
  gameSpeed: number;
}

const Ground: React.FC<GroundProps> = ({ gameSpeed }) => {
  // Animation speed based on game speed
  const animationDuration = 1000 / gameSpeed;
  
  return (
    <div className="absolute bottom-0 w-full h-[20px] overflow-hidden">
      <div 
        className="absolute bottom-0 w-full h-[1px] bg-black"
        style={{ boxShadow: '0px -2px 0px rgba(0,0,0,0.1)' }}
      />
      <div 
        className="absolute bottom-0 w-[200%] h-[5px]"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 0%, #000 15%, transparent 15%, transparent 20%, #000 20%, #000 35%, transparent 35%, transparent 40%, #000 40%, #000 55%, transparent 55%, transparent 60%, #000 60%, #000 75%, transparent 75%, transparent 80%, #000 80%, #000 95%, transparent 95%, transparent 100%)',
          backgroundSize: '120px 5px',
          animation: `groundMovement ${animationDuration}ms linear infinite`,
        }}
      />
    </div>
  );
};

export default Ground;
