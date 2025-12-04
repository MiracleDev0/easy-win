import React from 'react';
import { motion } from 'framer-motion';
import { GAME_SYMBOLS, PRIZE_LEVELS } from '../data/gameData';

interface GameTicketProps {
  onNewTicket: () => void;
  showNewTicketButton: boolean;
}

const GameTicket: React.FC<GameTicketProps> = ({ onNewTicket, showNewTicketButton }) => {
  return (
    <div className="game-ticket-container">
      <motion.div 
        className="game-ticket"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="ticket-header">
          <div className="balance-display">💰500</div>
          <div className="ticket-title">
            <h1>LUCKY</h1>
            <h1>WORLD CUP</h1>
            <p>WIN UP TO 1,000,000</p>
          </div>
        </div>

        <div className="ticket-content">
          <div className="prize-table">
            {PRIZE_LEVELS.map((level, index) => (
              <div key={index} className="prize-row">
                <div className="prize-symbols">
                  {[...Array(3)].map((_, i) => (
                    <img 
                      key={i}
                      src={level.symbols.image} 
                      alt={level.symbols.name}
                      className="prize-symbol"
                    />
                  ))}
                </div>
                <div className="prize-multiplier">{level.prize}</div>
              </div>
            ))}
          </div>

          <div className="main-game-area">
            <div className="symbols-grid">
                {GAME_SYMBOLS.map((symbol) => (
                  <motion.div 
                    key={symbol.id}
                    className="symbol-slot"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={symbol.image} 
                      alt={symbol.name}
                      className="symbol-image"
                    />
                  </motion.div>
                ))}
              </div>
            <div className="ticket-number">
              #000000 Lucky World Cup / 0000000
            </div>
          </div>
        </div>
      </motion.div>

      {showNewTicketButton && (
        <motion.button
          className="new-ticket-button"
          onClick={onNewTicket}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          NEW TICKET
        </motion.button>
      )}
    </div>
  );
};

export default GameTicket;