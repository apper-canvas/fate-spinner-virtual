import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function DiceRoller({ options, isRolling, result }) {
  const [diceValues, setDiceValues] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initialize dice based on number of options (max 6)
    const numDice = Math.min(options.length, 6);
    setDiceValues(Array(numDice).fill(0).map(() => Math.floor(Math.random() * 6)));
  }, [options.length]);

  useEffect(() => {
    if (isRolling && result) {
      startRolling();
    }
  }, [isRolling, result]);

  const startRolling = () => {
    setIsAnimating(true);
    
    // Animate dice rolling for 2.5 seconds
    const rollInterval = setInterval(() => {
      setDiceValues(prev => prev.map(() => Math.floor(Math.random() * 6)));
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      
      // Set final result
      const resultIndex = options.findIndex(opt => opt.id === result.id);
      const finalValues = Array(diceValues.length).fill(0).map(() => Math.floor(Math.random() * 6));
      finalValues[0] = resultIndex % 6; // First die shows the result
      
      setDiceValues(finalValues);
      setIsAnimating(false);
    }, 2500);
  };

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-400">Add options to see the dice</p>
      </div>
    );
  }

  const numDice = Math.min(options.length, 6);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="perspective-1000"
      >
        <div className="flex gap-4 flex-wrap justify-center">
          {Array(numDice).fill(0).map((_, index) => (
            <motion.div
              key={index}
              animate={isAnimating ? {
                rotateX: [0, 360, 720, 1080],
                rotateY: [0, 180, 360, 540],
                rotateZ: [0, 90, 180, 270],
                scale: [1, 1.2, 1, 1.1, 1]
              } : {}}
              transition={{
                duration: 2.5,
                times: [0, 0.3, 0.6, 0.9, 1],
                ease: "easeOut"
              }}
              className="preserve-3d"
            >
              <div className={`w-16 h-16 bg-white rounded-lg shadow-xl border-2 border-gray-300 flex items-center justify-center text-3xl transition-all ${
                isAnimating ? 'shadow-2xl' : ''
              }`}>
                {DICE_FACES[diceValues[index] || 0]}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dice tray */}
      <div className="w-full max-w-xs h-4 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg mt-6 border border-amber-500" />

      {/* Options mapping */}
      {!isRolling && diceValues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            {options.slice(0, 6).map((option, index) => (
              <div 
                key={option.id}
                className={`flex items-center gap-2 px-2 py-1 rounded ${
                  result && result.id === option.id 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-gray-400'
                }`}
              >
                <span className="text-lg">{DICE_FACES[index]}</span>
                <span className="truncate">{option.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {isRolling && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-secondary font-heading mt-4 text-lg"
        >
          🎲 Rolling the dice...
        </motion.p>
      )}
    </div>
  );
}

export default DiceRoller;