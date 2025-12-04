import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WinModalProps {
  isOpen: boolean;
  isWinner: boolean;
  prizeAmount: number;
  onClose: () => void;
  onTryAgain: () => void;
}

const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  isWinner,
  prizeAmount,
  onClose,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="win-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`win-modal ${isWinner ? 'winner' : ''}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isWinner ? (
              <>
                <div className="confetti-particles">🎉🎊🎉</div>
                <h2 className="win-title">CONGRATULATIONS!</h2>
                <div className="prize-won">+{prizeAmount} COINS</div>
                <button className="play-again-btn" onClick={onClose}>
                  PLAY AGAIN
                </button>
              </>
            ) : (
              <>
                <h2 className="lose-title">BETTER LUCK</h2>
                <p className="lose-subtitle">NEXT TIME!</p>
                <button className="try-again-btn" onClick={onClose}>
                  TRY AGAIN
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinModal;