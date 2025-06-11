import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Dice1, 
  User, 
  Settings, 
  Activity,
  Zap
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  return (
    <motion.nav
      className={`fixed left-0 top-0 h-full bg-surface border-r border-primary/30 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-primary/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="w-8 h-8 text-primary neon-glow" />
              <h1 className="text-xl font-bold text-white neon-text">
                Fate Spinner
              </h1>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="w-5 h-5 text-primary" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="py-6">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30 neon-glow'
                      : 'text-text-secondary hover:text-white hover:bg-primary/10'
                  }`}
                  aria-label={item.name}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 w-1 h-full bg-primary neon-glow"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} transition-colors`} />
                  
                  {!isCollapsed && (
                    <motion.span
                      className="font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-primary/30 rounded-md text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          className="absolute bottom-6 left-6 right-6"
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
      )}
    </motion.nav>
  );
};

export default Navigation;