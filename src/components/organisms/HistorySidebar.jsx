import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function HistorySidebar({ decisions, loading, error, onRepeat, onClear, onRetry, onClose }) {
  const getMethodEmoji = (method) => {
    switch (method) {
      case 'wheel': return '🎡';
      case 'dice': return '🎲';
      case 'eightball': return '🎱';
      case 'coin': return '🪙';
      default: return '✨';
    }
  };

  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-lg p-4">
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2 mb-2" />
          <div className="h-3 bg-white/10 rounded w-2/3" />
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-6"
    >
      <div className="text-4xl mb-4">😵</div>
      <h3 className="text-error font-heading mb-2">Oops!</h3>
      <p className="text-gray-400 text-sm mb-4">{error}</p>
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="bg-error/20 text-error border border-error/30 px-4 py-2 rounded-lg hover:bg-error/30 transition-colors"
      >
        <ApperIcon name="RotateCcw" size={16} className="inline mr-2" />
        Try Again
      </Button>
    </motion.div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-6"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-4xl mb-4"
      >
        📜
      </motion.div>
      <h3 className="text-gray-300 font-heading mb-2">No Decisions Yet</h3>
      <p className="text-gray-400 text-sm">
        Your decision history will appear here after you spin the wheel!
      </p>
    </motion.div>
  );

  return (
    <div className="h-full bg-surface border-l border-secondary/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-secondary/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg text-white flex items-center gap-2">
            <span className="text-xl">📜</span>
            Decision History
          </h2>
          {onClose && (
            <Button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          )}
        </div>
        
        {decisions.length > 0 && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              {decisions.length} decision{decisions.length !== 1 ? 's' : ''}
            </p>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="text-xs text-error hover:bg-error/20 px-2 py-1 rounded transition-colors"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {loading && <SkeletonLoader />}
        
        {error && <ErrorState />}
        
        {!loading && !error && decisions.length === 0 && <EmptyState />}
        
        {!loading && !error && decisions.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence>
              {decisions.map((decision, index) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-secondary/30 transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMethodEmoji(decision.method)}</span>
                      <span className="text-xs text-gray-400 capitalize">
                        {decision.method}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(decision.timestamp), 'MMM d, HH:mm')}
                    </span>
                  </div>

                  {/* Winner */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: decision.winner.color }}
                      />
                      <p className="text-white font-medium text-sm truncate">
                        {decision.winner.text}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">
                      From {decision.options.length} option{decision.options.length !== 1 ? 's' : ''}:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {decision.options.slice(0, 3).map((option) => (
                        <span
                          key={option.id}
                          className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-full truncate max-w-20"
                        >
                          {option.text}
                        </span>
                      ))}
                      {decision.options.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-full">
                          +{decision.options.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Repeat button */}
                  <Button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onRepeat(decision)}
                    className="w-full text-xs bg-secondary/20 text-secondary border border-secondary/30 py-2 px-3 rounded-lg hover:bg-secondary/30 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ApperIcon name="RotateCcw" size={12} className="inline mr-1" />
                    Repeat Decision
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {decisions.length > 0 && (
        <div className="p-4 border-t border-secondary/30 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            🎪 Decisions are stored locally and automatically cleared after 50 entries
          </p>
        </div>
      )}
    </div>
  );
}

export default HistorySidebar;