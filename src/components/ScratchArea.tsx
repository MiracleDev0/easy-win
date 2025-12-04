import React, { useRef, useEffect, useState } from 'react';
import type { ScratchCard, GameSymbol } from '../types/game';

interface ScratchAreaProps {
  scratchCard: ScratchCard;
  onScratchComplete: (isWinner: boolean, prizeAmount: number) => void;
}

const ScratchArea: React.FC<ScratchAreaProps> = ({ scratchCard, onScratchComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 200;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText('TO REVEAL', canvas.width / 2, canvas.height / 2 + 15);
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    x = (x / rect.width) * canvas.width;
    y = (y / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    setScratchPercentage(percentage);

    if (percentage >= 50) {
      handleScratchComplete();
    }
  };

  const handleScratchComplete = () => {

    const symbolCounts: { [key: string]: number } = {};
    scratchCard.symbols.forEach((symbol: GameSymbol) => {
      symbolCounts[symbol.name] = (symbolCounts[symbol.name] || 0) + 1;
    });

    const hasThreeIdentical = Object.values(symbolCounts).some(count => count >= 3);
    let prizeAmount = 0;

    if (hasThreeIdentical) {
      const winningSymbol = scratchCard.symbols.find((symbol: GameSymbol) => 
        symbolCounts[symbol.name] >= 3
      );
      if (winningSymbol) {
        prizeAmount = winningSymbol.multiplier * 10;
      }
    }

    setTimeout(() => {
      onScratchComplete(hasThreeIdentical, prizeAmount);
    }, 500);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) {
      scratch(e);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsScratching(true);
    scratch(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isScratching) {
      scratch(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsScratching(false);
  };

  return (
    <div className="scratch-area">
      {scratchPercentage < 50 && (
        <div className="scratch-hint">
          <div className="hint-content">
            {/* <span>Scratch to reveal symbols</span> */}
          </div>
        </div>
      )}
      
      <div className="revealed-grid">
        {scratchCard.symbols.slice(0, 9).map((symbol: GameSymbol, index: number) => (
          <div key={index} className="revealed-cell">
            <img src={symbol.image} alt={symbol.name} />
          </div>
        ))}
      </div>
      
      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '100%',
          height: '100%',
          cursor: isScratching ? 'grabbing' : 'grab'
        }}
      />
    </div>
  );
};

export default ScratchArea;