import React, { useState, useCallback } from 'react';
import GameHeader from '../components/GameHeader';
import FloatingCarousel from '../components/FloatingCarousel';
import GameCard from '../components/GameCard';
import BottomControls from '../components/BottomControls';
import WinModal from '../components/WinModal';
import ShareModal from '../components/ShareModal';
import { GAME_SYMBOLS, INITIAL_MESSAGES } from '../data/gameData';
import type { ScratchCard as ScratchCardType, CarouselMessage } from '../types/game';
import '../styles/game.css';


function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const generateRandomSymbols = (): ScratchCardType => {
  const createLosingBoard = () => {
    const symbols: (typeof GAME_SYMBOLS)[number][] = [];
    const counts: Record<string, number> = {};

    for (let i = 0; i < 9; i++) {
      const candidates = GAME_SYMBOLS.filter((s) => {
        const current = counts[s.id] || 0;
        return current < 2;
      });

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      symbols.push(chosen);
      counts[chosen.id] = (counts[chosen.id] || 0) + 1;
    }

    return symbols;
  };

  const createWinningBoard = () => {
    const symbols: (typeof GAME_SYMBOLS)[number][] = [];
    const counts: Record<string, number> = {};

    const winningSymbol =
      GAME_SYMBOLS[Math.floor(Math.random() * GAME_SYMBOLS.length)];

    for (let i = 0; i < 3; i++) {
      symbols.push(winningSymbol);
    }
    counts[winningSymbol.id] = 3;

    for (let i = 0; i < 6; i++) {
      const candidates = GAME_SYMBOLS.filter((s) => {
        if (s.id === winningSymbol.id) return false;
        const current = counts[s.id] || 0;
        return current < 2;
      });

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      symbols.push(chosen);
      counts[chosen.id] = (counts[chosen.id] || 0) + 1;
    }

    return shuffleArray(symbols);
  };

  const shouldWin = Math.random() < 0.3;
  const symbols = shouldWin ? createWinningBoard() : createLosingBoard();

  return {
    symbols,
    isScratched: new Array(9).fill(false),
    isWinner: false,
    prizeAmount: 0,
  };
};

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

  const [winningIndices, setWinningIndices] = useState<number[]>([]);

  const handleNewTicket = useCallback(() => {
    const newScratchCard = generateRandomSymbols();
    setScratchCard(newScratchCard);
    setIsScratching(true);
    setHasGoldenOverlay(true);
    setShowShare(false);
    setShowModal(false);
    setShowScratchedResult(false);
    setWinningIndices([]);
  }, []);

  const handleCheckTicket = useCallback(() => {
    if (!scratchCard) return;

    const symbolCounts: Record<string, number> = {};

    scratchCard.symbols.forEach((symbol) => {
      symbolCounts[symbol.id] = (symbolCounts[symbol.id] || 0) + 1;
    });

    const tripleSymbolIds = Object.entries(symbolCounts)
      .filter(([, count]) => count === 3)
      .map(([id]) => id);

    const isWinner = tripleSymbolIds.length === 1;
    let prizeAmount = 0;
    let indices: number[] = [];

    if (isWinner) {
      const winningSymbolId = tripleSymbolIds[0];

      indices = scratchCard.symbols
        .map((s, i) => (s.id === winningSymbolId ? i : -1))
        .filter((i) => i !== -1);

      const winningSymbol = scratchCard.symbols.find(
        (symbol) => symbol.id === winningSymbolId
      );

      if (winningSymbol) {
        prizeAmount = winningSymbol.multiplier * 10;
      }
    }

    setWinningIndices(indices);
    setGameResult({ isWinner, prizeAmount });
    setIsScratching(false);
    setHasGoldenOverlay(false);
    setShowModal(true);
    setShowShare(true);

    if (isWinner) {
      setBalance((prev) => prev + prizeAmount);
    }
  }, [scratchCard]);

  const handleScratchComplete = useCallback(
    (isWinner: boolean, prizeAmount: number) => {
      let indices: number[] = [];

      if (isWinner && scratchCard) {
        const symbolCounts: Record<string, number> = {};

        scratchCard.symbols.forEach((symbol) => {
          symbolCounts[symbol.id] = (symbolCounts[symbol.id] || 0) + 1;
        });

        const tripleSymbolIds = Object.entries(symbolCounts)
          .filter(([, count]) => count === 3)
          .map(([id]) => id);

        if (tripleSymbolIds.length === 1) {
          const winningSymbolId = tripleSymbolIds[0];

          indices = scratchCard.symbols
            .map((s, i) => (s.id === winningSymbolId ? i : -1))
            .filter((i) => i !== -1);
        }
      }

      setWinningIndices(indices);
      setGameResult({ isWinner, prizeAmount });
      setIsScratching(false);
      setHasGoldenOverlay(false);
      setShowModal(true);
      setShowShare(true);

      if (isWinner) {
        setBalance((prev) => prev + prizeAmount);
      }
    },
    [scratchCard]
  );

  const handleAddMessage = useCallback((message: string) => {
    const newMessage: CarouselMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
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
    setWinningIndices([]);
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
              winningIndices={winningIndices}
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

      <ShareModal isOpen={isShareModalOpen} onClose={handleCloseShareModal} />
    </div>
  );
};

export default Index;
