import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Volume1, Settings, Music } from 'lucide-react';
import Button from '@/components/atoms/Button';
import soundService from '@/services/soundService';

function SoundControlPanel({ isOpen, onClose }) {
  const [soundState, setSoundState] = useState(soundService.getState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = soundService.addListener(setSoundState);
    return unsubscribe;
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    soundService.setVolume(newVolume);
    // Play a test sound when adjusting volume
    if (!soundState.isMuted && newVolume > 0) {
      setTimeout(() => soundService.playSound('click'), 100);
    }
  };

  const handleMuteToggle = () => {
    soundService.toggleMute();
  };

  const handleSoundPackChange = async (packId) => {
    if (packId === soundState.currentSoundPack) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await soundService.setSoundPack(packId);
      // Play a test sound from the new pack
      setTimeout(() => soundService.playSound('success'), 200);
    } catch (err) {
      setError(`Failed to load sound pack: ${err.message}`);
      console.error('Sound pack change error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getVolumeIcon = () => {
    if (soundState.isMuted || soundState.volume === 0) {
      return VolumeX;
    } else if (soundState.volume < 50) {
      return Volume1;
    } else {
      return Volume2;
    }
  };

  const VolumeIcon = getVolumeIcon();

  const getVolumeLevel = () => {
    if (soundState.isMuted) return 0;
    return soundState.volume;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-surface border border-primary/30 rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-heading text-white">Sound Control</h2>
            </div>
            <Button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <VolumeX className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Volume</label>
              <span className="text-sm text-primary font-medium">
                {soundState.isMuted ? 'Muted' : `${soundState.volume}%`}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mute Button */}
              <Button
                onClick={handleMuteToggle}
                className={`p-3 rounded-lg transition-all ${
                  soundState.isMuted
                    ? 'bg-error/20 text-error border border-error/30 hover:bg-error/30'
                    : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <VolumeIcon className="w-5 h-5" />
              </Button>

              {/* Volume Slider */}
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getVolumeLevel()}
                  onChange={handleVolumeChange}
                  disabled={soundState.isMuted}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed slider"
                  style={{
                    background: `linear-gradient(to right, #FF006E 0%, #FF006E ${getVolumeLevel()}%, rgba(255,255,255,0.1) ${getVolumeLevel()}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                
                {/* Volume Level Indicators */}
                <div className="flex justify-between mt-2 px-1">
                  {[0, 25, 50, 75, 100].map(level => (
                    <div
                      key={level}
                      className={`w-1 h-3 rounded-full transition-colors ${
                        getVolumeLevel() >= level
                          ? 'bg-primary'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sound Pack Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-secondary" />
              <label className="text-sm font-medium text-gray-300">Sound Pack</label>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-error/20 border border-error/30 rounded-lg text-error text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              {soundState.soundPacks.map(pack => (
                <motion.div
                  key={pack.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      pack.id === soundState.currentSoundPack
                        ? 'bg-secondary/20 border-secondary text-secondary'
                        : pack.available
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                        : 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <input
                      type="radio"
                      name="soundPack"
                      value={pack.id}
                      checked={pack.id === soundState.currentSoundPack}
                      onChange={() => handleSoundPackChange(pack.id)}
                      disabled={!pack.available || isLoading}
                      className="sr-only"
                    />
                    
                    {/* Custom Radio Button */}
                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                      pack.id === soundState.currentSoundPack
                        ? 'border-secondary bg-secondary'
                        : 'border-gray-400'
                    }`}>
                      {pack.id === soundState.currentSoundPack && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{pack.name}</div>
                      {!pack.available && (
                        <div className="text-xs text-gray-500 mt-1">
                          Sound pack unavailable
                        </div>
                      )}
                    </div>
                    
                    {pack.id === soundState.currentSoundPack && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-secondary rounded-full"
                      />
                    )}
                  </label>
                </motion.div>
              ))}
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                />
                <span className="ml-2 text-sm text-gray-400">Loading sound pack...</span>
              </div>
            )}
          </div>

          {/* Test Sound Button */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <Button
              onClick={() => soundService.playSound('success')}
              disabled={soundState.isMuted || soundState.volume === 0}
              className="w-full py-3 bg-accent/20 text-accent border border-accent/30 rounded-lg font-medium hover:bg-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Music className="w-4 h-4 mr-2" />
              Test Sound
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SoundControlPanel;