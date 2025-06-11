import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function CoinFlipper({ options, isFlipping, result }) {
  const [currentSide, setCurrentSide] = useState('heads');
  const [flips, setFlips] = useState(0);

  useEffect(() => {
    if (isFlipping && result) {
      startFlipping();
    }
  }, [isFlipping, result]);

  const startFlipping = () => {
    let flipCount = 0;
    const maxFlips = 10 + Math.floor(Math.random() * 5); // 10-15 flips

    const flipInterval = setInterval(() => {
      setCurrentSide(flipCount % 2 === 0 ? 'tails' : 'heads');
      flipCount++;
      setFlips(flipCount);

      if (flipCount >= maxFlips) {
        clearInterval(flipInterval);
        // Set final result
        const finalSide = result.id === options[0]?.id ? 'heads' : 'tails';
        setCurrentSide(finalSide);
      }
    }, 150);
  };

  if (options.length !== 2) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Coin flip requires exactly 2 options</p>
          <div className="text-4xl">🪙</div>
        </div>
      </div>
    );
  }

  const headsOption = options[0];
  const tailsOption = options[1];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="perspective-1000"
      >
        <motion.div
          animate={isFlipping ? {
            rotateY: [0, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620, 1800],
            y: [0, -50, -100, -120, -100, -80, -60, -40, -20, -10, 0]
          } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="preserve-3d relative"
        >
          {/* Coin */}
          <div className="w-32 h-32 relative">
            {/* Heads side */}
            <div className={`absolute inset-0 w-32 h-32 rounded-full border-4 border-yellow-600 flex items-center justify-center text-4xl font-bold transition-all duration-150 ${
              currentSide === 'heads' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' : 'opacity-0'
            }`}>
              👑
            </div>
            
            {/* Tails side */}
            <div className={`absolute inset-0 w-32 h-32 rounded-full border-4 border-yellow-600 flex items-center justify-center text-4xl font-bold transition-all duration-150 ${
              currentSide === 'tails' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-yellow-100' : 'opacity-0'
            }`}>
              🦅
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        animate={isFlipping ? {
          scale: [1, 0.8, 0.6, 0.4, 0.6, 0.8, 1],
          opacity: [0.3, 0.2, 0.1, 0.05, 0.1, 0.2, 0.3]
        } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-24 h-8 bg-black/30 rounded-full mt-4 blur-sm"
      />

      {/* Options display */}
      <div className="mt-6 flex gap-8 text-center">
        <div className={`transition-all ${
          !isFlipping && result && result.id === headsOption.id 
            ? 'text-primary font-bold scale-110' 
            : 'text-gray-400'
        }`}>
          <div className="text-2xl mb-2">👑</div>
          <div className="text-sm font-medium">Heads</div>
          <div className="text-xs text-gray-500 mt-1 truncate max-w-20">
            {headsOption.text}
          </div>
        </div>

        <div className="text-gray-600 self-center text-2xl">VS</div>

        <div className={`transition-all ${
          !isFlipping && result && result.id === tailsOption.id 
            ? 'text-primary font-bold scale-110' 
            : 'text-gray-400'
        }`}>
          <div className="text-2xl mb-2">🦅</div>
          <div className="text-sm font-medium">Tails</div>
          <div className="text-xs text-gray-500 mt-1 truncate max-w-20">
            {tailsOption.text}
          </div>
        </div>
      </div>

      {isFlipping && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent font-heading mt-4 text-lg"
        >
          🪙 Flipping coin... ({flips} flips)
        </motion.p>
      )}
    </div>
  );
}

export default CoinFlipper;