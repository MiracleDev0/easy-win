import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="share-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="share-modal"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <button className="share-close" onClick={onClose}>
              x
            </button>

            <h2 className="share-title">Share</h2>
            <p className="share-text">
              Share this bet to your friends and share your happiness
            </p>

            <div className="share-icons">
              <button className="share-icon facebook">f</button>
              <button className="share-icon twitter">t</button>
              <button className="share-icon whatsapp">w</button>
              <button className="share-icon telegram">▶</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
