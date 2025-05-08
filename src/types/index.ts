export interface Team {
  name: string;
  score: number;
  players: string[];
}

export interface Word {
  _id: string;
  text: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  language: string;
}

export interface Round {
  teamIndex: number;
  words: {
    wordId: string;
    text: string;
    status: 'correct' | 'skipped' | 'pending';
  }[];
}

export interface Game {
  _id: string;
  teams: Team[];
  rounds: Round[];
  currentRound: number;
  roundTime: number; // in seconds
  status: 'setup' | 'playing' | 'roundEnd' | 'gameEnd';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  scoreLimit: number;
  scoreLimitReached?: boolean;
  scoreLimitRound?: number;
  losePointOnSkip?: boolean;
  createdAt: Date;
  createdBy?: string;
} 