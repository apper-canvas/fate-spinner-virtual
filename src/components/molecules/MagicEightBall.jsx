import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function MagicEightBall({ options, isShaking, result }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    if (isShaking) {
      setShowAnswer(false);
      setTimeout(() => {
        if (result) {
          setCurrentAnswer(result.text);
          setShowAnswer(true);
        }
      }, 2000);
    }
  }, [isShaking, result]);

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-400">Add options to see the Magic 8-Ball</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative"
      >
        {/* 8-Ball */}
        <motion.div
          animate={isShaking ? {
            x: [-5, 5, -5, 5, -3, 3, -3, 3, 0],
            y: [-3, 3, -3, 3, -2, 2, -2, 2, 0],
            rotate: [-2, 2, -2, 2, -1, 1, -1, 1, 0]
          } : {}}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl border-4 border-gray-700 relative overflow-hidden"
        >
          {/* Highlight */}
          <div className="absolute top-8 left-12 w-8 h-12 bg-white/20 rounded-full blur-sm" />
          
          {/* Number 8 */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-black text-xl">
            8
          </div>

          {/* Answer window */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-blue-900 to-purple-900 rounded-full flex items-center justify-center border-2 border-blue-800">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: showAnswer ? 1 : 0, 
                scale: showAnswer ? 1 : 0.5,
                y: showAnswer ? 0 : 10
              }}
              transition={{ duration: 0.5, delay: showAnswer ? 0.5 : 0 }}
              className="text-center px-2"
            >
              {showAnswer ? (
                <div className="text-white">
                  <div className="text-xs font-bold mb-1">IT IS</div>
                  <div className="text-xs leading-tight break-words">
                    {currentAnswer.length > 10 
                      ? currentAnswer.substring(0, 10) + '...'
                      : currentAnswer
                    }
                  </div>
                </div>
              ) : (
                <motion.div
                  animate={isShaking ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: isShaking ? Infinity : 0 }}
                  className="text-blue-300 text-xl"
                >
                  ?
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Base/Stand */}
      <div className="w-32 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full mt-4 shadow-lg" />

      {/* Instructions or status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-center"
      >
        {isShaking ? (
          <p className="text-secondary font-heading text-lg animate-pulse">
            🔮 The spirits are deciding...
          </p>
        ) : showAnswer ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary/20 border border-secondary/30 rounded-lg p-4 max-w-xs"
          >
            <p className="text-secondary font-heading mb-2">✨ The Magic 8-Ball has spoken!</p>
            <p className="text-white font-medium text-lg">"{result?.text}"</p>
          </motion.div>
        ) : (
          <p className="text-gray-400">
            Ask your question and shake the Magic 8-Ball
          </p>
        )}
      </motion.div>

      {/* All possible answers preview */}
      {!isShaking && !showAnswer && options.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-xs text-gray-500 mb-2">Possible answers:</p>
          <div className="flex flex-wrap gap-1 justify-center max-w-md">
            {options.map((option) => (
              <span
                key={option.id}
                className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-full"
              >
                {option.text}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default MagicEightBall;