import React from 'react';
import ScratchArea from './ScratchArea';
import type { ScratchCard, GameSymbol } from '../types/game';
import { GAME_SYMBOLS } from '../data/gameData';

interface GameCardProps {
  scratchCard: ScratchCard | null;
  isScratching: boolean;
  onScratchComplete: (isWinner: boolean, prizeAmount: number) => void;
  hasGoldenOverlay: boolean;
  showScratchedResult?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ 
  scratchCard,  
  onScratchComplete,
  hasGoldenOverlay,
  showScratchedResult = false
}) => {
  const generateTicketId = () => {
    return `WC${Date.now().toString().slice(-6)}`;
  };

  const renderSymbolsDisplay = () => {
    if (!scratchCard) {
      return (
        <div className="symbols-display">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="symbol-cell">
              <span style={{ fontSize: '24px', opacity: 0.5 }}>?</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="symbols-display">
        {scratchCard.symbols.slice(0, 6).map((symbol: GameSymbol, index: number) => (
          <div key={index} className="symbol-cell">
            <img 
              src={symbol.image} 
              alt={symbol.name}
              className="symbol-img"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderScratchedResult = () => {
    if (!scratchCard) return null;

    return (
      <div className="scratched-result-display">
        <div className="result-grid">
          {scratchCard.symbols.slice(0, 9).map((symbol: GameSymbol, index: number) => (
            <div key={index} className="result-cell">
              <img 
                src={symbol.image} 
                alt={symbol.name}
                className="result-symbol"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="game-card">
      <div className="card-header">
        <div className="balance-coin">💰 500</div>
        <div className="card-title">
          <h1>WIN UP TO 1,000,000</h1>
        </div>
        <div style={{ width: '60px' }} />
      </div>

      <div className="prize-sidebar">
        {GAME_SYMBOLS.slice(0, 6).map((symbol, index) => (
          <div key={index} className="prize-row">
            <div className="prize-icons">
              {Array.from({ length: 3 }, (_, i) => (
                <img 
                  key={i}
                  src={symbol.image} 
                  alt={symbol.name}
                  className="prize-icon"
                />
              ))}
            </div>
            <span className="prize-value">{symbol.multiplier}</span>
          </div>
        ))}
      </div>

      <div className="main-play-area">
        {hasGoldenOverlay && scratchCard ? (
          <ScratchArea 
            scratchCard={scratchCard}
            onScratchComplete={onScratchComplete}
          />
        ) : showScratchedResult ? (
          renderScratchedResult()
        ) : (
          renderSymbolsDisplay()
        )}
      </div>

      <div className="ticket-id">
        Ticket ID: {generateTicketId()}
      </div>
    </div>
  );
};

export default GameCard;