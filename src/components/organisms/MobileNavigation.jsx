import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Dice1, 
  User, 
  Settings, 
  Activity,
  Zap
} from 'lucide-react';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: Home,
    },
    {
      name: 'Fate Spinner',
      path: '/spinner',
      icon: Dice1,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: Activity,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-primary/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-primary neon-glow" />
            <h1 className="text-lg font-bold text-white neon-text">
              Fate Spinner
            </h1>
          </div>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-16 left-0 right-0 bg-surface border-b border-primary/30 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="py-4">
              <ul className="space-y-1 px-4">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={closeMenu}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
                          isActive
                            ? 'bg-primary/20 text-primary border border-primary/30 neon-glow'
                            : 'text-text-secondary hover:text-white hover:bg-primary/10'
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 w-1 h-full bg-primary neon-glow"
                            layoutId="mobileActiveIndicator"
                            transition={{ duration: 0.2 }}
                          />
                        )}

                        <Icon className="w-5 h-5 mr-3 transition-colors" />
                        <span className="font-medium">{item.name}</span>

                        {/* Active arrow */}
                        {isActive && (
                          <motion.div
                            className="ml-auto text-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Zap className="w-4 h-4" />
                          </motion.div>
                        )}
                      </NavLink>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Mobile Footer */}
              <motion.div
                className="px-4 py-4 mt-6 border-t border-primary/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-xs text-text-secondary">
                    Fate Spinner v1.0
                  </p>
                  <p className="text-xs text-primary mt-1">
                    Spin your destiny
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default MobileNavigation;