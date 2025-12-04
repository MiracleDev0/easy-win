import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BottomControlsProps {
  onNewTicket: () => void;
  onCheckTicket: () => void;
  onAddMessage: (message: string) => void;
  onShare: () => void;
  showShare: boolean;
  hasGoldenOverlay: boolean;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  onNewTicket,
  onCheckTicket,
  onAddMessage,
  onShare,
  showShare,
  hasGoldenOverlay,
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      onAddMessage(message.trim());
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bottom-controls">
      <div className="controls-row">
        <motion.button
          className={`new-ticket-btn ${hasGoldenOverlay ? 'check-btn' : 'new-btn'}`}
          onClick={hasGoldenOverlay ? onCheckTicket : onNewTicket}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {hasGoldenOverlay ? 'CHECK TICKET' : 'NEW TICKET'}
        </motion.button>

        <div className="input-section">
          {!showShare ? (
            <>
              <motion.input
                type="text"
                className={`message-input ${isExpanded ? 'expanded' : ''}`}
                placeholder="Input barage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                animate={{
                  width: isExpanded ? 200 : 120,
                  opacity: isExpanded ? 1 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              />

              {!isExpanded ? (
                <motion.button
                  className="expand-btn"
                  onClick={() => setIsExpanded(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  B
                </motion.button>
              ) : (
                <motion.button
                  className="send-btn"
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ➤
                </motion.button>
              )}
            </>
          ) : (
            <motion.button
              className="share-btn-under-card"
              onClick={onShare}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SHARE RESULT
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomControls;
