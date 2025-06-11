import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CONFETTI_COLORS = ['#FF006E', '#8338EC', '#FB5607', '#06FFA5', '#FFBE0B', '#FF4365'];

function ResultsModal({ isOpen, result, method, onAccept, onRespin, onClose }) {
  const [confetti, setConfetti] = useState([]);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (isOpen && result) {
      // Trigger celebration
      setCelebrating(true);
      generateConfetti();
      
      // Auto-stop celebration after 3 seconds
      const timer = setTimeout(() => {
        setCelebrating(false);
        setConfetti([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, result]);

  const generateConfetti = () => {
    const newConfetti = Array(50).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4
    }));
    setConfetti(newConfetti);
  };

  const getMethodEmoji = (method) => {
    switch (method) {
      case 'wheel': return '🎡';
      case 'dice': return '🎲';
      case 'eightball': return '🎱';
      case 'coin': return '🪙';
      default: return '✨';
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case 'wheel': return 'Spinning Wheel';
      case 'dice': return 'Dice Roll';
      case 'eightball': return 'Magic 8-Ball';
      case 'coin': return 'Coin Flip';
      default: return 'Fate';
    }
  };

  if (!result) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4"
            onClick={onClose}
          />

          {/* Confetti */}
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            <AnimatePresence>
              {confetti.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ 
                    x: `${particle.x}vw`, 
                    y: '-10vh',
                    rotate: particle.rotation,
                    scale: 1,
                    opacity: 1
                  }}
                  animate={{ 
                    y: '110vh',
                    rotate: particle.rotation + 360,
                    scale: [1, 1.2, 0.8, 1],
                    opacity: [1, 1, 1, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 3,
                    ease: "easeOut"
                  }}
                  className="absolute"
                  style={{
                    backgroundColor: particle.color,
                    width: particle.size,
                    height: particle.size,
                    borderRadius: '2px'
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 border border-secondary/30 neon-glow">
              {/* Close button */}
              <Button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </Button>

              {/* Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-6"
              >
                <div className="text-6xl mb-4">
                  {getMethodEmoji(method)}
                </div>
                <h2 className="font-heading text-2xl text-white mb-2">
                  🎉 Fate Has Decided!
                </h2>
                <p className="text-gray-400 text-sm">
                  The {getMethodName(method)} has spoken
                </p>
              </motion.div>

              {/* Result */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl neon-glow"
                  style={{ backgroundColor: result.color }}
                >
                  ✨
                </div>
                <h3 className="font-heading text-3xl text-primary mb-2 break-words">
                  {result.text}
                </h3>
                <p className="text-gray-400 text-sm">
                  Your destiny awaits!
                </p>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAccept}
                  className="w-full bg-primary text-white py-3 px-6 rounded-xl font-heading text-lg neon-glow hover:bg-primary/90 transition-colors"
                >
                  ✅ Accept This Fate
                </Button>

                <div className="flex gap-3">
                  <Button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRespin}
                    className="flex-1 bg-secondary/20 text-secondary border border-secondary/30 py-3 px-4 rounded-xl font-medium hover:bg-secondary/30 transition-colors"
                  >
                    <ApperIcon name="RotateCcw" size={16} className="inline mr-2" />
                    Try Again
                  </Button>

                  <Button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 bg-white/10 text-white border border-white/20 py-3 px-4 rounded-xl font-medium hover:bg-white/20 transition-colors"
                  >
                    <ApperIcon name="ArrowLeft" size={16} className="inline mr-2" />
                    Back
                  </Button>
                </div>
              </motion.div>

              {/* Fun fact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 p-3 bg-accent/20 border border-accent/30 rounded-lg text-center"
              >
                <p className="text-accent text-xs">
                  🎪 "The best decisions are made with a little bit of magic!"
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ResultsModal;