import { motion } from 'framer-motion';

const ANIMATIONS = [
  {
    id: 'wheel',
    name: 'Spinning Wheel',
    description: 'Classic carnival wheel with pointer',
    icon: '🎡',
    bestFor: '3+ options',
    minOptions: 2
  },
  {
    id: 'dice',
    name: 'Dice Roll',
    description: '3D dice with realistic physics',
    icon: '🎲',
    bestFor: '2-6 options',
    minOptions: 2,
    maxOptions: 6
  },
  {
    id: 'eightball',
    name: 'Magic 8-Ball',
    description: 'Mystical fortune-telling sphere',
    icon: '🎱',
    bestFor: 'Any amount',
    minOptions: 2
  },
  {
    id: 'coin',
    name: 'Coin Flip',
    description: 'Simple heads or tails',
    icon: '🪙',
    bestFor: 'Exactly 2 options',
    minOptions: 2,
    maxOptions: 2
  }
];

function AnimationSelector({ selected, onChange, optionCount }) {
  const getAvailability = (animation) => {
    if (optionCount < animation.minOptions) return 'disabled';
    if (animation.maxOptions && optionCount > animation.maxOptions) return 'disabled';
    if (animation.id === selected) return 'selected';
    return 'available';
  };

  const getRecommendation = (animation) => {
    if (animation.id === 'coin' && optionCount === 2) return 'perfect';
    if (animation.id === 'dice' && optionCount <= 6) return 'recommended';
    if (animation.id === 'wheel' && optionCount > 6) return 'recommended';
    return 'normal';
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-secondary/30 neon-glow">
      <h2 className="font-heading text-xl text-white mb-4">
        🎪 Choose Your Animation
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ANIMATIONS.map((animation) => {
          const availability = getAvailability(animation);
          const recommendation = getRecommendation(animation);
          const isDisabled = availability === 'disabled';
          const isSelected = availability === 'selected';
          
          return (
            <motion.div
              key={animation.id}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={() => !isDisabled && onChange(animation.id)}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/20 neon-glow'
                  : isDisabled
                  ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50'
                  : 'border-white/20 bg-white/5 hover:border-secondary hover:bg-secondary/20'
              }`}
            >
              {/* Recommendation Badge */}
              {recommendation === 'perfect' && !isDisabled && (
                <div className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full font-bold">
                  Perfect!
                </div>
              )}
              {recommendation === 'recommended' && !isDisabled && (
                <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-bold">
                  Best
                </div>
              )}

              {/* Animation Icon */}
              <div className="text-3xl mb-2 text-center">
                {animation.icon}
              </div>

              {/* Animation Info */}
              <h3 className="font-heading text-sm text-white mb-1 text-center">
                {animation.name}
              </h3>
              <p className="text-xs text-gray-400 text-center mb-2">
                {animation.description}
              </p>
              
              {/* Best For */}
              <div className="text-xs text-center">
                <span className={`px-2 py-1 rounded-full ${
                  isDisabled 
                    ? 'bg-error/20 text-error'
                    : recommendation === 'perfect'
                    ? 'bg-success/20 text-success'
                    : recommendation === 'recommended'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-info/20 text-info'
                }`}>
                  {isDisabled 
                    ? animation.maxOptions 
                      ? `Need ${animation.minOptions}-${animation.maxOptions} options`
                      : `Need ${animation.minOptions}+ options`
                    : animation.bestFor
                  }
                </span>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current Selection Info */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-primary/20 border border-primary/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-primary text-lg">
              {ANIMATIONS.find(a => a.id === selected)?.icon}
            </span>
            <span className="text-primary font-medium">
              {ANIMATIONS.find(a => a.id === selected)?.name} selected
            </span>
            <span className="text-gray-400 text-sm">
              • Ready for {optionCount} option{optionCount !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AnimationSelector;