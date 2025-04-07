
import React from 'react';
import { Star } from 'lucide-react';

interface CoinProps {
  x: number;
  y: number;
  collected: boolean;
}

const Coin: React.FC<CoinProps> = ({ x, y, collected }) => {
  // Coin styles
  const coinStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x}px`,
    bottom: `${y + 20}px`, // Position above the ground
    opacity: collected ? 0 : 1,
    transition: 'opacity 0.3s ease-out',
  };

  return (
    <div style={coinStyle} className="coin">
      <Star size={20} fill="#FFD700" color="#FFD700" className={collected ? "animate-scale-out" : "animate-pulse"} />
    </div>
  );
};

export default Coin;
