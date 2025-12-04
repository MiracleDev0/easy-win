export interface GameSymbol {
  id: string;
  name: string;
  image: string;
  multiplier: number;
}

export interface PrizeLevel {
  symbols: GameSymbol;
  count: number;
  multiplier: number;
  prize: string;
}

export interface ScratchCard {
  symbols: GameSymbol[];
  isScratched: boolean[];
  winningSymbol?: GameSymbol;
  isWinner: boolean;
  prizeAmount: number;
}

export interface CarouselMessage {
  id: string;
  text: string;
  timestamp: number;
}