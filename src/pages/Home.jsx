import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import HistorySidebar from '../components/HistorySidebar';
import { decisionService } from '../services';

function Home() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await decisionService.getAll();
      setDecisions(result);
    } catch (err) {
      setError(err.message || 'Failed to load decisions');
    } finally {
      setLoading(false);
    }
  };

  const handleNewDecision = async (decision) => {
    try {
      const saved = await decisionService.create(decision);
      setDecisions(prev => [saved, ...prev]);
      toast.success('Decision saved to history!');
    } catch (err) {
      toast.error('Failed to save decision');
    }
  };

  const handleRepeatDecision = (decision) => {
    // This will be handled by MainFeature component
    toast.info('Repeating previous decision...');
  };

  const handleClearHistory = async () => {
    try {
      const clearedDecisions = await decisionService.clearAll();
      setDecisions(clearedDecisions);
      toast.success('History cleared!');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  return (
    <div className="h-full flex max-w-full overflow-hidden bg-background">
      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-6xl">
          <MainFeature onDecisionMade={handleNewDecision} />
        </div>
      </div>

      {/* History Sidebar Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHistory(!showHistory)}
        className="fixed top-20 right-4 z-30 bg-surface text-white p-3 rounded-full neon-glow border border-secondary lg:hidden"
      >
        <span className="text-lg">📜</span>
      </motion.button>

      {/* Desktop History Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0 border-l border-surface">
        <HistorySidebar
          decisions={decisions}
          loading={loading}
          error={error}
          onRepeat={handleRepeatDecision}
          onClear={handleClearHistory}
          onRetry={loadDecisions}
        />
      </div>

      {/* Mobile History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] z-50 lg:hidden"
            >
              <HistorySidebar
                decisions={decisions}
                loading={loading}
                error={error}
                onRepeat={handleRepeatDecision}
                onClear={handleClearHistory}
                onRetry={loadDecisions}
                onClose={() => setShowHistory(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;