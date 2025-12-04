import type { GameSymbol, PrizeLevel, CarouselMessage } from '../types/game';

export const GAME_SYMBOLS: GameSymbol[] = [
  {
    id: 'trophy',
    name: 'Trophy',
    image: '/assets/trophy-gold.png',
    multiplier: 2000
  },
  {
    id: 'football',
    name: 'Football',
    image: '/assets/football-soccer.png',
    multiplier: 50
  },
  {
    id: 'gloves',
    name: 'Gloves',
    image: '/assets/gloves-goalkeeper.png',
    multiplier: 10
  },
  {
    id: 'whistle',
    name: 'Whistle',
    image: '/assets/whistle-referee.png',
    multiplier: 5
  },
  {
    id: 'boots',
    name: 'Boots',
    image: '/assets/boots-soccer.png',
    multiplier: 2
  },
  {
    id: 'medal',
    name: 'Medal',
    image: '/assets/medal-gold.png',
    multiplier: 1
  }
];

export const PRIZE_LEVELS: PrizeLevel[] = [
  {
    symbols: GAME_SYMBOLS[0], // Trophy
    count: 3,
    multiplier: 2000,
    prize: 'x2000'
  },
  {
    symbols: GAME_SYMBOLS[1], // Football
    count: 3,
    multiplier: 50,
    prize: 'x50'
  },
  {
    symbols: GAME_SYMBOLS[2], // Gloves
    count: 3,
    multiplier: 10,
    prize: 'x10'
  },
  {
    symbols: GAME_SYMBOLS[3], // Whistle
    count: 3,
    multiplier: 5,
    prize: 'x5'
  },
  {
    symbols: GAME_SYMBOLS[4], // Boots
    count: 3,
    multiplier: 2,
    prize: 'x2'
  },
  {
    symbols: GAME_SYMBOLS[5], // Medal
    count: 3,
    multiplier: 1,
    prize: 'x1'
  }
];

export const INITIAL_MESSAGES: CarouselMessage[] = [
  { id: '1', text: 'Welcome to Lucky World Cup!', timestamp: Date.now() },
  { id: '2', text: 'Win up to 1,000,000 coins!', timestamp: Date.now() + 1000 },
  { id: '3', text: 'Scratch to reveal your prize!', timestamp: Date.now() + 2000 },
  { id: '4', text: 'Good luck player!', timestamp: Date.now() + 3000 },
  { id: '5', text: 'Match 3 symbols to win!', timestamp: Date.now() + 4000 }
];