import { makeAutoObservable, runInAction } from 'mobx';
import type { Game, Round, Word } from '../types';
import { wordStore } from './WordStore';

class GameStore {
  games: Map<string, Game> = new Map();
  currentGameId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get currentGame(): Game | undefined {
    if (!this.currentGameId) return undefined;
    return this.games.get(this.currentGameId);
  }

  setCurrentGameId(gameId: string | null) {
    this.currentGameId = gameId;
  }

  async createGame(options: { 
    teamNames: string[],
    roundTime: number,
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
    scoreLimit: number,
    losePointOnSkip?: boolean
  }): Promise<string> {
    // Input validation
    if (options.teamNames.length < 2) {
      throw new Error('At least 2 teams are required');
    }
    
    if (options.roundTime < 30 || options.roundTime > 300) {
      throw new Error('Round time must be between 30 and 300 seconds');
    }
    
    if (options.scoreLimit < 10) {
      throw new Error('Score limit must be at least 10');
    }
    
    const teams = options.teamNames.map(name => ({
      name,
      score: 0,
      players: []
    }));

    const gameId = this.generateId();
    
    runInAction(() => {
      const newGame: Game = {
        _id: gameId,
        teams,
        rounds: [],
        currentRound: 0,
        roundTime: options.roundTime,
        status: 'setup',
        difficulty: options.difficulty,
        scoreLimit: options.scoreLimit,
        losePointOnSkip: options.losePointOnSkip || false,
        createdAt: new Date(),
      };
      
      this.games.set(gameId, newGame);
      this.currentGameId = gameId;
    });

    return gameId;
  }

  async startRound(): Promise<Round | undefined> {
    if (!this.currentGame) {
      throw new Error('No active game');
    }

    const game = this.currentGame;
    
    // Determine which team is playing this round
    const teamIndex = game.rounds.length % game.teams.length;
    
    // Get words from the WordStore
    const words = await wordStore.getRandomWords(
      game.scoreLimit * 2, 
      game.difficulty !== 'mixed' ? { difficulty: game.difficulty } : {}
    );
    
    if (!words || words.length === 0) {
      throw new Error('No words available for the selected difficulty');
    }
    
    const round: Round = {
      teamIndex,
      words: words.map((w: Word) => ({
        wordId: w._id,
        text: w.text,
        status: 'pending'
      }))
    };

    runInAction(() => {
      const updatedRounds = [...game.rounds, round];
      const updatedGame = {
        ...game,
        rounds: updatedRounds,
        status: 'playing' as const,
        currentRound: game.rounds.length
      };
      
      this.games.set(game._id, updatedGame);
    });

    return round;
  }

  // Helper method for deep copying game objects in a type-safe way
  private deepCopyGame(game: Game): Game {
    return {
      ...game,
      teams: game.teams.map(team => ({ ...team, players: [...team.players] })),
      rounds: game.rounds.map(round => ({
        ...round,
        words: round.words.map(word => ({ ...word }))
      })),
    };
  }

  async updateWordStatus(wordIndex: number, status: 'correct' | 'skipped'): Promise<void> {
    if (!this.currentGame) {
      throw new Error('No active game');
    }
    
    const game = this.currentGame;
    const currentRoundIndex = game.currentRound;
    const currentRound = game.rounds[currentRoundIndex];
    
    if (!currentRound) {
      throw new Error('Current round not found');
    }
    
    // Validate word index
    if (wordIndex < 0 || wordIndex >= currentRound.words.length) {
      throw new Error('Word index out of bounds');
    }

    try {
      runInAction(() => {
        // Create a deep copy of the game to modify
        const updatedGame = this.deepCopyGame(game);
        
        // Update word status
        updatedGame.rounds[currentRoundIndex].words[wordIndex].status = status;
        
        // Score updates
        const teamIndex = currentRound.teamIndex;
        
        if (status === 'correct') {
          updatedGame.teams[teamIndex].score += 1;
          
          // Check if team now meets or exceeds the score limit
          const newScore = updatedGame.teams[teamIndex].score;
          
          if (!updatedGame.scoreLimitReached && newScore >= updatedGame.scoreLimit) {
            updatedGame.scoreLimitReached = true;
            updatedGame.scoreLimitRound = updatedGame.rounds.length;
          }
        } else if (status === 'skipped' && game.losePointOnSkip) {
          // Decrement score but not below zero
          if (updatedGame.teams[teamIndex].score > 0) {
            updatedGame.teams[teamIndex].score -= 1;
          }
        }
        
        this.games.set(game._id, updatedGame);
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error marking word as ${status}:`, errorMessage);
      throw new Error(`Failed to update word status: ${errorMessage}`);
    }
  }

  async endRound(): Promise<'roundEnd' | 'gameEnd'> {
    if (!this.currentGame) {
      throw new Error('No active game');
    }
    
    const game = this.currentGame;

    // If score limit has been reached, check if all teams have played in this round
    if (game.scoreLimitReached) {
      // All teams have played in the round if rounds.length % teams.length === 0
      if ((game.rounds.length % game.teams.length) === 0) {
        runInAction(() => {
          this.games.set(game._id, {
            ...game,
            status: 'gameEnd'
          });
        });
        return 'gameEnd';
      }
    }

    // Otherwise, just end the round
    runInAction(() => {
      this.games.set(game._id, {
        ...game,
        status: 'roundEnd'
      });
    });
    return 'roundEnd';
  }

  // Helper method to update a word's status in any round (for corrections)
  updateWordStatusInRound(roundIndex: number, wordIndex: number, newStatus: 'correct' | 'skipped'): void {
    if (!this.currentGame) {
      throw new Error('No active game');
    }
    
    const game = this.currentGame;
    const round = game.rounds[roundIndex];
    
    if (!round) {
      throw new Error('Round not found');
    }

    const word = round.words[wordIndex];
    if (!word) {
      throw new Error('Word not found');
    }

    // Skip if status hasn't changed
    if (word.status === newStatus) {
      return;
    }

    try {
      runInAction(() => {
        // Deep copy the game
        const updatedGame = this.deepCopyGame(game);
        
        // Original status to calculate score changes
        const oldStatus = updatedGame.rounds[roundIndex].words[wordIndex].status;
        
        // Update status
        updatedGame.rounds[roundIndex].words[wordIndex].status = newStatus;
        
        // Update score based on status change
        const teamIndex = round.teamIndex;
        
        // Handle score changes based on the game's skip penalty setting
        if (oldStatus === 'correct' && newStatus === 'skipped') {
          // Removed a correct word, lose the +1 point from correct
          if (updatedGame.teams[teamIndex].score > 0) {
            updatedGame.teams[teamIndex].score -= 1;
          }
          
          // If skip penalty is enabled, lose an additional point for the skip
          if (game.losePointOnSkip && updatedGame.teams[teamIndex].score > 0) {
            updatedGame.teams[teamIndex].score -= 1;
          }
          
          // Check if score limit is no longer reached
          if (updatedGame.scoreLimitReached && 
              updatedGame.teams[teamIndex].score < updatedGame.scoreLimit) {
            updatedGame.scoreLimitReached = false;
            updatedGame.scoreLimitRound = undefined;
          }
        } 
        else if (oldStatus === 'skipped' && newStatus === 'correct') {
          // If skip penalty was enabled, regain the point lost from skip
          if (game.losePointOnSkip) {
            updatedGame.teams[teamIndex].score += 1;
          }
          
          // Add the +1 point for correct
          updatedGame.teams[teamIndex].score += 1;
          
          // Check if team now meets or exceeds the score limit
          const newScore = updatedGame.teams[teamIndex].score;
          
          if (!updatedGame.scoreLimitReached && newScore >= updatedGame.scoreLimit) {
            updatedGame.scoreLimitReached = true;
            updatedGame.scoreLimitRound = updatedGame.rounds.length;
          }
        }
        // For pending to correct/skipped, that would happen during normal gameplay
        
        this.games.set(game._id, updatedGame);
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error updating word status:', errorMessage);
      throw new Error(`Failed to update word status: ${errorMessage}`);
    }
  }

  // Helper to generate unique IDs
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export const gameStore = new GameStore(); 