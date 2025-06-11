class SoundService {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.volume = this.getStoredVolume();
    this.isMuted = this.getStoredMuteState();
    this.currentSoundPack = this.getStoredSoundPack();
    this.soundPacks = {
      classic: {
        name: 'Classic',
        sounds: {
          click: '/sounds/classic/click.mp3',
          success: '/sounds/classic/success.mp3',
          error: '/sounds/classic/error.mp3',
          notification: '/sounds/classic/notification.mp3'
        },
        available: true
      },
      upbeat: {
        name: 'Upbeat',
        sounds: {
          click: '/sounds/upbeat/click.mp3',
          success: '/sounds/upbeat/success.mp3',
          error: '/sounds/upbeat/error.mp3',
          notification: '/sounds/upbeat/notification.mp3'
        },
        available: true
      },
      futuristic: {
        name: 'Futuristic',
        sounds: {
          click: '/sounds/futuristic/click.mp3',
          success: '/sounds/futuristic/success.mp3',
          error: '/sounds/futuristic/error.mp3',
          notification: '/sounds/futuristic/notification.mp3'
        },
        available: true
      }
    };
    this.audioElements = {};
    this.listeners = [];
    
    this.initializeAudioContext();
    this.preloadSounds();
  }

  // Initialize Web Audio API context
  async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.updateGainValue();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Preload sound files for current sound pack
  async preloadSounds() {
    const soundPack = this.soundPacks[this.currentSoundPack];
    if (!soundPack || !soundPack.available) return;

    try {
      for (const [soundType, soundPath] of Object.entries(soundPack.sounds)) {
        const audio = new Audio(soundPath);
        audio.preload = 'auto';
        audio.volume = this.isMuted ? 0 : this.volume / 100;
        
        // Test if sound can be loaded
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        
        this.audioElements[soundType] = audio;
      }
    } catch (error) {
      console.warn(`Failed to preload sounds for ${this.currentSoundPack}:`, error);
      this.soundPacks[this.currentSoundPack].available = false;
      this.notifyListeners();
    }
  }

  // Get volume from localStorage
  getStoredVolume() {
    const stored = localStorage.getItem('soundVolume');
    return stored ? parseInt(stored, 10) : 50;
  }

  // Get mute state from localStorage
  getStoredMuteState() {
    const stored = localStorage.getItem('soundMuted');
    return stored === 'true';
  }

  // Get sound pack from localStorage
  getStoredSoundPack() {
    const stored = localStorage.getItem('soundPack');
    return stored && this.soundPacks[stored] ? stored : 'classic';
  }

  // Set volume (0-100)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(100, volume));
    localStorage.setItem('soundVolume', this.volume.toString());
    this.updateGainValue();
    this.updateAudioElements();
    this.notifyListeners();
  }

  // Get current volume
  getVolume() {
    return this.volume;
  }

  // Toggle mute state
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('soundMuted', this.isMuted.toString());
    this.updateGainValue();
    this.updateAudioElements();
    this.notifyListeners();
    return this.isMuted;
  }

  // Get mute state
  isMuted() {
    return this.isMuted;
  }

  // Set sound pack
  async setSoundPack(packName) {
    if (!this.soundPacks[packName]) {
      throw new Error(`Sound pack "${packName}" not found`);
    }

    this.currentSoundPack = packName;
    localStorage.setItem('soundPack', packName);
    
    // Clear existing audio elements
    this.audioElements = {};
    
    // Preload new sound pack
    await this.preloadSounds();
    this.notifyListeners();
  }

  // Get current sound pack
  getCurrentSoundPack() {
    return this.currentSoundPack;
  }

  // Get all available sound packs
  getSoundPacks() {
    return Object.entries(this.soundPacks).map(([key, pack]) => ({
      id: key,
      name: pack.name,
      available: pack.available
    }));
  }

  // Play a sound
  playSound(soundType) {
    if (this.isMuted || this.volume === 0) return;

    const audio = this.audioElements[soundType];
    if (!audio) return;

    try {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn(`Failed to play sound ${soundType}:`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound ${soundType}:`, error);
    }
  }

  // Update gain node value
  updateGainValue() {
    if (this.gainNode) {
      const gainValue = this.isMuted ? 0 : this.volume / 100;
      this.gainNode.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }
  }

  // Update all audio elements volume
  updateAudioElements() {
    const volume = this.isMuted ? 0 : this.volume / 100;
    Object.values(this.audioElements).forEach(audio => {
      audio.volume = volume;
    });
  }

  // Add change listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          volume: this.volume,
          isMuted: this.isMuted,
          currentSoundPack: this.currentSoundPack,
          soundPacks: this.getSoundPacks()
        });
      } catch (error) {
        console.warn('Error in sound service listener:', error);
      }
    });
  }

  // Test if sound pack is available
  async testSoundPack(packName) {
    const soundPack = this.soundPacks[packName];
    if (!soundPack) return false;

    try {
      // Test loading one sound file
      const testAudio = new Audio(Object.values(soundPack.sounds)[0]);
      await new Promise((resolve, reject) => {
        testAudio.addEventListener('canplaythrough', resolve, { once: true });
        testAudio.addEventListener('error', reject, { once: true });
        testAudio.load();
      });
      return true;
    } catch (error) {
      console.warn(`Sound pack ${packName} is not available:`, error);
      return false;
    }
  }

  // Get current state
  getState() {
    return {
      volume: this.volume,
      isMuted: this.isMuted,
      currentSoundPack: this.currentSoundPack,
      soundPacks: this.getSoundPacks()
    };
  }
}

// Create and export singleton instance
const soundService = new SoundService();
export default soundService;