import React, { useState, useCallback } from 'react';
// import { motion } from 'framer-motion';
import GameHeader from '../components/GameHeader';
import FloatingCarousel from '../components/FloatingCarousel';
import GameCard from '../components/GameCard';
import BottomControls from '../components/BottomControls';
import WinModal from '../components/WinModal';
import ShareModal from '../components/ShareModal';
import { GAME_SYMBOLS, INITIAL_MESSAGES } from '../data/gameData';
import type { ScratchCard as ScratchCardType, CarouselMessage } from '../types/game';
import '../styles/game.css';

const Index: React.FC = () => {
  const [balance, setBalance] = useState(500);
  const [messages, setMessages] = useState<CarouselMessage[]>(INITIAL_MESSAGES);
  const [scratchCard, setScratchCard] = useState<ScratchCardType | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState({ isWinner: false, prizeAmount: 0 });
  const [showShare, setShowShare] = useState(false);
  const [hasGoldenOverlay, setHasGoldenOverlay] = useState(false);
  const [showScratchedResult, setShowScratchedResult] = useState(false);


  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const generateRandomSymbols = (): ScratchCardType => {
    const symbols = [];
    
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * GAME_SYMBOLS.length);
      symbols.push(GAME_SYMBOLS[randomIndex]);
    }

    const shouldWin = Math.random() < 0.3;
    if (shouldWin) {
      const winningSymbol = GAME_SYMBOLS[Math.floor(Math.random() * GAME_SYMBOLS.length)];
      symbols[0] = winningSymbol;
      symbols[1] = winningSymbol;
      symbols[2] = winningSymbol;
    }

    return {
      symbols,
      isScratched: new Array(9).fill(false),
      isWinner: false,
      prizeAmount: 0
    };
  };

  const handleNewTicket = useCallback(() => {
    const newScratchCard = generateRandomSymbols();
    setScratchCard(newScratchCard);
    setIsScratching(true);
    setHasGoldenOverlay(true);
    setShowShare(false);
    setShowModal(false);
    setShowScratchedResult(false);
  }, []);

  const handleCheckTicket = useCallback(() => {
    if (!scratchCard) return;
    
    const symbolCounts: { [key: string]: number } = {};
    scratchCard.symbols.forEach(symbol => {
      symbolCounts[symbol.name] = (symbolCounts[symbol.name] || 0) + 1;
    });

    const hasThreeIdentical = Object.values(symbolCounts).some(count => count >= 3);
    let prizeAmount = 0;

    if (hasThreeIdentical) {
      const winningSymbol = scratchCard.symbols.find(symbol => 
        symbolCounts[symbol.name] >= 3
      );
      if (winningSymbol) {
        prizeAmount = winningSymbol.multiplier * 10;
      }
    }

    setGameResult({ isWinner: hasThreeIdentical, prizeAmount });
    setIsScratching(false);
    setHasGoldenOverlay(false);
    setShowModal(true);
    setShowShare(true);
    
    if (hasThreeIdentical) {
      setBalance(prev => prev + prizeAmount);
    }
  }, [scratchCard]);

  const handleScratchComplete = useCallback((isWinner: boolean, prizeAmount: number) => {
    setGameResult({ isWinner, prizeAmount });
    setIsScratching(false);
    setHasGoldenOverlay(false);
    setShowModal(true);
    setShowShare(true);
    
    if (isWinner) {
      setBalance(prev => prev + prizeAmount);
    }
  }, []);

  const handleAddMessage = useCallback((message: string) => {
    const newMessage: CarouselMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setShowScratchedResult(true);
  }, []);

  const handleTryAgain = useCallback(() => {
    setShowModal(false);
    setIsScratching(false);
    setScratchCard(null);
    setHasGoldenOverlay(false);
    setShowShare(false);
    setShowScratchedResult(false);
  }, []);

  const handleShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  return (
    <div className="game-app">
      <div className="game-bg" />
      
      <GameHeader balance={balance} />
      
      <div className="game-content">
        <div className="game-center">
          <div className="game-card-container">
            <FloatingCarousel messages={messages} />
            
            <GameCard 
              scratchCard={scratchCard}
              isScratching={isScratching}
              onScratchComplete={handleScratchComplete}
              hasGoldenOverlay={hasGoldenOverlay}
              showScratchedResult={showScratchedResult}
            />
          </div>
        </div>
        
        <BottomControls
          onNewTicket={handleNewTicket}
          onCheckTicket={handleCheckTicket}
          onAddMessage={handleAddMessage}
          onShare={handleShare}
          showShare={showShare}
          hasGoldenOverlay={hasGoldenOverlay}
        />
      </div>

      <WinModal
        isOpen={showModal}
        isWinner={gameResult.isWinner}
        prizeAmount={gameResult.prizeAmount}
        onClose={handleModalClose}
        onTryAgain={handleTryAgain}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
      />
    </div>
  );
};

export default Index;
