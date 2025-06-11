import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptionInput from './OptionInput';
import AnimationSelector from './AnimationSelector';
import SpinningWheel from './SpinningWheel';
import DiceRoller from './DiceRoller';
import MagicEightBall from './MagicEightBall';
import CoinFlipper from './CoinFlipper';
import ResultsModal from './ResultsModal';

const ANIMATION_TYPES = {
  wheel: 'wheel',
  dice: 'dice',
  eightball: 'eightball',
  coin: 'coin'
};

function MainFeature({ onDecisionMade }) {
  const [options, setOptions] = useState([
    { id: '1', text: '', color: '#FF006E', weight: 1 },
    { id: '2', text: '', color: '#8338EC', weight: 1 }
  ]);
  const [selectedAnimation, setSelectedAnimation] = useState('wheel');
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const validOptions = options.filter(opt => opt.text.trim() !== '');

  const handleSpin = async () => {
    if (validOptions.length < 2) {
      return;
    }

    setIsAnimating(true);
    setResult(null);

    // Simulate animation duration
    const duration = selectedAnimation === 'dice' ? 3000 : 
                    selectedAnimation === 'eightball' ? 2500 :
                    selectedAnimation === 'coin' ? 2000 : 4000;

    setTimeout(() => {
      // Select random winner
      const winner = validOptions[Math.floor(Math.random() * validOptions.length)];
      setResult(winner);
      setIsAnimating(false);
      setShowResult(true);

      // Save decision to history
      const decision = {
        id: `decision_${Date.now()}`,
        options: [...validOptions],
        winner,
        method: selectedAnimation,
        timestamp: new Date()
      };
      
      onDecisionMade(decision);
    }, duration);
  };

  const handleAcceptResult = () => {
    setShowResult(false);
    setResult(null);
  };

  const handleRespin = () => {
    setShowResult(false);
    setResult(null);
    setTimeout(() => handleSpin(), 100);
  };

  const canSpin = validOptions.length >= 2 && !isAnimating;

  const getRecommendedAnimation = () => {
    const count = validOptions.length;
    if (count === 2) return 'coin';
    if (count <= 6) return 'dice';
    return 'wheel';
  };

  return (
    <div className="space-y-8">
      {/* Option Input Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface rounded-xl p-6 border border-secondary/30 neon-glow"
      >
        <h2 className="font-heading text-xl text-white mb-4">
          ✨ Enter Your Options
        </h2>
        <OptionInput 
          options={options}
          onChange={setOptions}
          maxOptions={20}
        />
        
        {validOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-info/20 border border-info/30 rounded-lg"
          >
            <p className="text-sm text-info">
              📊 {validOptions.length} option{validOptions.length !== 1 ? 's' : ''} ready • 
              Recommended: <strong className="capitalize">{getRecommendedAnimation()}</strong>
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Animation Selector */}
      {validOptions.length >= 2 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AnimationSelector
            selected={selectedAnimation}
            onChange={setSelectedAnimation}
            optionCount={validOptions.length}
          />
        </motion.div>
      )}

      {/* Animation Display */}
      {validOptions.length >= 2 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface/50 rounded-xl p-8 border border-secondary/20 min-h-[400px] flex flex-col items-center justify-center"
        >
          {selectedAnimation === 'wheel' && (
            <SpinningWheel
              options={validOptions}
              isSpinning={isAnimating}
              result={result}
            />
          )}
          
          {selectedAnimation === 'dice' && (
            <DiceRoller
              options={validOptions}
              isRolling={isAnimating}
              result={result}
            />
          )}
          
          {selectedAnimation === 'eightball' && (
            <MagicEightBall
              options={validOptions}
              isShaking={isAnimating}
              result={result}
            />
          )}
          
          {selectedAnimation === 'coin' && (
            <CoinFlipper
              options={validOptions}
              isFlipping={isAnimating}
              result={result}
            />
          )}

          {/* Spin Button */}
          <motion.button
            whileHover={canSpin ? { scale: 1.05 } : {}}
            whileTap={canSpin ? { scale: 0.95 } : {}}
            onClick={handleSpin}
            disabled={!canSpin}
            className={`mt-8 px-8 py-4 rounded-xl font-heading text-lg transition-all ${
              canSpin
                ? 'bg-primary text-white neon-glow hover:bg-primary/90 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAnimating ? (
              <span className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Spinning...
              </span>
            ) : (
              `🎲 ${selectedAnimation === 'wheel' ? 'Spin the Wheel' :
                     selectedAnimation === 'dice' ? 'Roll the Dice' :
                     selectedAnimation === 'eightball' ? 'Shake the 8-Ball' :
                     'Flip the Coin'}!`
            )}
          </motion.button>

          {!canSpin && !isAnimating && (
            <p className="text-gray-400 text-sm mt-2">
              {validOptions.length < 2 ? 'Add at least 2 options to begin' : ''}
            </p>
          )}
        </motion.div>
      )}

      {/* Results Modal */}
      <ResultsModal
        isOpen={showResult}
        result={result}
        method={selectedAnimation}
        onAccept={handleAcceptResult}
        onRespin={handleRespin}
        onClose={() => setShowResult(false)}
      />
    </div>
  );
}

export default MainFeature;