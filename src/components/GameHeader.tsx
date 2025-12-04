import React from 'react';
import { motion } from 'framer-motion';

interface GameHeaderProps {
  balance: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ balance }) => {
  return (
    <motion.div 
      className="game-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="header-left">
          <span className="back-arrow">←</span>
          <span className="logo">Easy Win</span>
        </div>
        <div className="header-right">
          <div className="balance">
            <span className="balance-icon">💰</span>
            <span className="balance-amount">{balance.toLocaleString()}</span>
          </div>
          <div className="help-icon">?</div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameHeader;