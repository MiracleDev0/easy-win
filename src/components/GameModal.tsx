import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameModalProps {
  isOpen: boolean;
  isWinner: boolean;
  prizeAmount: number;
  onClose: () => void;
  onTryAgain: () => void;
  onShare?: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ 
  isOpen, 
  isWinner, 
  prizeAmount, 
  onTryAgain,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={`game-modal ${isWinner ? 'winner' : 'loser'}`}
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            {isWinner ? (
              <div className="winner-content">
                <motion.div 
                  className="confetti"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  🎉✨🎊
                </motion.div>
                
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  CONGRATULATIONS!
                </motion.h2>
                
                <motion.div 
                  className="prize-display"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <div className="prize-amount">
                    💰 {prizeAmount.toLocaleString()}
                  </div>
                  <p>You won!</p>
                </motion.div>

                <motion.div 
                  className="modal-buttons"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <button className="try-again-button" onClick={onTryAgain}>
                    PLAY AGAIN
                  </button>
                 
                </motion.div>
              </div>
            ) : (
              <div className="loser-content">
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  ONE STEP AWAY
                </motion.h2>
                
                <motion.h3
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  FROM WINNING
                </motion.h3>

                <motion.button 
                  className="try-again-button"
                  onClick={onTryAgain}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  TRY AGAIN
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModal;