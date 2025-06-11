import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function SpinningWheel({ options, isSpinning, result }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);

  useEffect(() => {
    drawWheel();
  }, [options]);

  useEffect(() => {
    if (isSpinning && result) {
      startSpinAnimation();
    }
  }, [isSpinning, result]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas || options.length === 0) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const sliceAngle = (2 * Math.PI) / options.length;

    options.forEach((option, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = option.color;
      ctx.fill();

      // Draw border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px "DM Sans"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const text = option.text.length > 12 ? option.text.substring(0, 12) + '...' : option.text;
      ctx.fillText(text, radius * 0.7, 0);
      ctx.restore();
    });

    // Restore context
    ctx.restore();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX - 15, centerY - radius - 15);
    ctx.lineTo(centerX + 15, centerY - radius - 15);
    ctx.lineTo(centerX, centerY - radius + 5);
    ctx.closePath();
    ctx.fillStyle = '#FF006E';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add glow to pointer
    ctx.shadowColor = '#FF006E';
    ctx.shadowBlur = 10;
    ctx.fill();
  };

  const startSpinAnimation = () => {
    if (!result) return;

    const resultIndex = options.findIndex(opt => opt.id === result.id);
    const sliceAngle = 360 / options.length;
    const targetAngle = 360 - (resultIndex * sliceAngle + sliceAngle / 2);
    const spins = 5 + Math.random() * 3; // 5-8 full spins
    const finalAngle = targetAngle + spins * 360;

    setFinalRotation(finalAngle);

    let startTime = null;
    const duration = 4000; // 4 seconds

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = rotation + (finalAngle - rotation) * easeOut;

      setRotation(currentRotation);
      drawWheel();
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-400">Add options to see the wheel</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="drop-shadow-2xl"
        />
        
        {/* Center button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center font-heading text-gray-800 text-sm">
          SPIN
        </div>
      </motion.div>

      {/* Wheel base */}
      <div className="w-8 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-lg mt-2" />
      
      {isSpinning && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-heading mt-4 text-lg"
        >
          🎡 The wheel is spinning...
        </motion.p>
      )}
    </div>
  );
}

export default SpinningWheel;