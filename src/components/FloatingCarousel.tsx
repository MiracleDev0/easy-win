import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CarouselMessage } from '../types/game';

interface FloatingCarouselProps {
  messages: CarouselMessage[];
}

const FloatingCarousel: React.FC<FloatingCarouselProps> = ({ messages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="floating-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="floating-message"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {messages[currentIndex]?.text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FloatingCarousel;