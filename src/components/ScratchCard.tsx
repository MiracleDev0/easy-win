import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScratchCard as ScratchCardType, GameSymbol } from '../types/game';
import { GAME_SYMBOLS } from '../data/gameData';

interface ScratchCardProps {
  scratchCard: ScratchCardType;
  onScratchComplete: (isWinner: boolean, prizeAmount: number) => void;
  onClose: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ scratchCard, onScratchComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFA500';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i, j, 10, 10);
        }
      }
    }

    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText('YOUR PRIZE!', canvas.width / 2, canvas.height / 2 + 20);
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchedPercentage(percentage);

    if (percentage > 60 && showInstructions) {
      setShowInstructions(false);
      setTimeout(() => {
        checkWinCondition();
      }, 1000);
    }
  };

  const checkWinCondition = () => {

    const symbolCounts: { [key: string]: number } = {};
    scratchCard.symbols.forEach(symbol => {
      symbolCounts[symbol.id] = (symbolCounts[symbol.id] || 0) + 1;
    });

    let isWinner = false;
    let prizeAmount = 0;
    let winningSymbol: GameSymbol | undefined;

    Object.entries(symbolCounts).forEach(([symbolId, count]) => {
      if (count >= 3) {
        isWinner = true;
        winningSymbol = GAME_SYMBOLS.find(s => s.id === symbolId);
        if (winningSymbol) {
          prizeAmount = winningSymbol.multiplier * 100;
        }
      }
    });

    setTimeout(() => {
      onScratchComplete(isWinner, prizeAmount);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="scratch-card-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="scratch-card-container"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="close-button" onClick={onClose}>×</button>
          
          {showInstructions && (
            <motion.div 
              className="scratch-instructions"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="instruction-content">
                <div className="hand-icon">👆</div>
                <p>Slide finger to reveal Numbers</p>
              </div>
            </motion.div>
          )}

          <div className="scratch-area">
            <div className="revealed-symbols">
              {scratchCard.symbols.map((symbol, index) => (
                <div key={index} className="revealed-symbol">
                  <img src={symbol.image} alt={symbol.name} />
                </div>
              ))}
            </div>
            
            <canvas
              ref={canvasRef}
              className="scratch-canvas"
              onMouseDown={() => setIsScratching(true)}
              onMouseUp={() => setIsScratching(false)}
              onMouseMove={(e) => isScratching && handleScratch(e)}
              onMouseLeave={() => setIsScratching(false)}
            />
          </div>

          <div className="scratch-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${scratchedPercentage}%` }}
              />
            </div>
            <p>Scratch Progress: {Math.round(scratchedPercentage)}%</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScratchCard;