import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-6"
        >
          🎪
        </motion.div>
        <h1 className="font-heading text-4xl text-primary mb-4">Oops!</h1>
        <p className="text-gray-400 mb-6 max-w-md">
          Looks like this page got lost in the carnival. Let's get you back to the main show!
        </p>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium neon-glow hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Home" className="w-5 h-5 inline mr-2" />
          Back to Fate Spinner
        </Button>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;