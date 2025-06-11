import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const COLORS = [
  '#FF006E', '#8338EC', '#FB5607', '#06FFA5', '#FFBE0B', 
  '#FF4365', '#3A86FF', '#FF8500', '#7209B7', '#F72585'
];

function OptionInput({ options, onChange, maxOptions = 20 }) {
  const [focusedId, setFocusedId] = useState(null);

  const updateOption = (id, updates) => {
    onChange(options.map(opt => 
      opt.id === id ? { ...opt, ...updates } : opt
    ));
  };

  const addOption = () => {
    if (options.length >= maxOptions) return;
    
    const newOption = {
      id: `option_${Date.now()}`,
      text: '',
      color: COLORS[options.length % COLORS.length],
      weight: 1
    };
    onChange([...options, newOption]);
  };

  const removeOption = (id) => {
    if (options.length <= 2) return;
    onChange(options.filter(opt => opt.id !== id));
  };

  const clearAll = () => {
    onChange(options.map(opt => ({ ...opt, text: '' })));
  };

  const addQuickOptions = (type) => {
    let quickOptions = [];
    
    switch (type) {
      case 'yesno':
        quickOptions = ['Yes', 'No'];
        break;
      case 'food':
        quickOptions = ['Pizza', 'Burgers', 'Sushi', 'Tacos', 'Pasta'];
        break;
      case 'activity':
        quickOptions = ['Movie Night', 'Go Out', 'Stay Home', 'Exercise', 'Read a Book'];
        break;
      case 'weekend':
        quickOptions = ['Beach', 'Mountains', 'City Trip', 'Stay Local', 'Visit Friends'];
        break;
    }

    const updatedOptions = [...options];
    quickOptions.forEach((text, index) => {
      if (index < updatedOptions.length) {
        updatedOptions[index] = {
          ...updatedOptions[index],
          text
        };
      } else if (updatedOptions.length < maxOptions) {
        updatedOptions.push({
          id: `option_${Date.now()}_${index}`,
          text,
          color: COLORS[index % COLORS.length],
          weight: 1
        });
      }
    });
    
    onChange(updatedOptions);
  };

  const validOptions = options.filter(opt => opt.text.trim() !== '');

  return (
    <div className="space-y-4">
      {/* Quick Options */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-400 mr-2">Quick fill:</span>
        {[
          { key: 'yesno', label: 'Yes/No', icon: '✅' },
          { key: 'food', label: 'Food', icon: '🍕' },
          { key: 'activity', label: 'Activities', icon: '🎯' },
          { key: 'weekend', label: 'Weekend', icon: '🌟' }
        ].map(({ key, label, icon }) => (
          <Button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addQuickOptions(key)}
            className="px-3 py-1 text-xs bg-secondary/20 text-secondary border border-secondary/30 rounded-full hover:bg-secondary/30 transition-colors"
          >
            {icon} {label}
          </Button>
        ))}
      </div>

      {/* Option List */}
      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <div className="flex items-center gap-3">
                {/* Color Picker */}
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                    onClick={() => {
                      const colorIndex = COLORS.indexOf(option.color);
                      const nextColor = COLORS[(colorIndex + 1) % COLORS.length];
                      updateOption(option.id, { color: nextColor });
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Input Field */}
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                    onFocus={() => setFocusedId(option.id)}
                    onBlur={() => setFocusedId(null)}
                    placeholder={`Option ${index + 1}...`}
                    maxLength={50}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none ${
                      focusedId === option.id
                        ? 'border-primary glow-effect'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  />
                  {option.text.length > 40 && (
                    <div className="absolute -bottom-5 right-0 text-xs text-gray-400">
                      {option.text.length}/50
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                {options.length > 2 && (
                  <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeOption(option.id)}
                    className="p-2 text-error hover:bg-error/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addOption}
          disabled={options.length >= maxOptions}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            options.length >= maxOptions
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-success/20 text-success border border-success/30 hover:bg-success/30 neon-glow'
          }`}
        >
          <ApperIcon name="Plus" size={16} />
          Add Option ({options.length}/{maxOptions})
        </Button>

        {validOptions.length > 0 && (
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-error/20 text-error border border-error/30 rounded-lg font-medium hover:bg-error/30 transition-all"
          >
            <ApperIcon name="Trash2" size={16} />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}

export default OptionInput;