import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import Navigation from '@/components/organisms/Navigation';
import MobileNavigation from '@/components/organisms/MobileNavigation';
import SoundControlPanel from '@/components/organisms/SoundControlPanel';
import Button from '@/components/atoms/Button';

function Layout() {
  const [isSoundPanelOpen, setIsSoundPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Navigation />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>

      {/* Sound Control Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsSoundPanelOpen(true)}
          className="p-4 bg-surface border border-primary/30 rounded-full shadow-lg hover:shadow-primary/20 transition-all neon-glow"
          title="Sound Settings"
        >
          <Settings className="w-6 h-6 text-primary" />
        </Button>
      </motion.div>

      {/* Sound Control Panel */}
      <SoundControlPanel
        isOpen={isSoundPanelOpen}
        onClose={() => setIsSoundPanelOpen(false)}
      />
{/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;