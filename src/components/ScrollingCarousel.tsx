import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CarouselMessage } from '../types/game';

interface ScrollingCarouselProps {
  messages: CarouselMessage[];
  onAddMessage: (message: string) => void;
}

const ScrollingCarousel: React.FC<ScrollingCarouselProps> = ({ messages, onAddMessage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputExpanded, setInputExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onAddMessage(inputValue.trim());
      setInputValue('');
      setInputExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="scrolling-carousel">
      <div className="carousel-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="carousel-message"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {messages[currentIndex]?.text}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="input-container">
        <motion.input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`carousel-input ${inputExpanded ? 'expanded' : ''}`}
          placeholder="Input message..."
          animate={{ width: inputExpanded ? '300px' : '150px' }}
          transition={{ duration: 0.3 }}
        />
        
        {!inputExpanded ? (
          <button 
            className="toggle-button"
            onClick={() => setInputExpanded(true)}
          >
            B
          </button>
        ) : (
          <button 
            className="send-button"
            onClick={handleSendMessage}
          >
            📤
          </button>
        )}
      </div>
    </div>
  );
};

export default ScrollingCarousel;