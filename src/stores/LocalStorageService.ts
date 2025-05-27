import { autorun } from 'mobx';
import { RootStore } from './RootStore';
import type { Game } from '../types';

/**
 * Service for syncing store state with localStorage
 */
class LocalStorageService {
  private rootStore: RootStore;
  private disposers: (() => void)[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Initialize localStorage sync
   */
  initialize(): void {
    // First, try to load state from localStorage
    this.loadState();

    // Setup autorun reactions to watch for changes and persist them
    this.setupPersistence();
  }

  /**
   * Setup persistence by watching store changes
   */
  private setupPersistence(): void {
    // Watch game store changes
    this.disposers.push(
      autorun(() => {
        const gameState = {
          games: Array.from(this.rootStore.gameStore.games.entries()),
          currentGameId: this.rootStore.gameStore.currentGameId
        };
        
        try {
          localStorage.setItem('alias-react-gameStore', JSON.stringify(gameState));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Failed to save game state to localStorage:', errorMessage);
          // Inform the user if in development mode
          if (import.meta.env.DEV) {
            console.warn('LocalStorage may be unavailable or quota exceeded. Game progress might not be saved.');
          }
        }
      })
    );

    // No need to persist WordStore as it's initialized from a static source
  }

  /**
   * Load state from localStorage
   */
  private loadState(): void {
    try {
      // Load game state
      const gameStateJSON = localStorage.getItem('alias-react-gameStore');
      if (gameStateJSON) {
        const gameState = JSON.parse(gameStateJSON);
        
        // Restore games map
        if (gameState.games && Array.isArray(gameState.games)) {
          const gamesMap = new Map(gameState.games) as Map<string, Game>;
          this.rootStore.gameStore.games = gamesMap;
        }
        
        // Restore current game ID
        if (gameState.currentGameId) {
          this.rootStore.gameStore.setCurrentGameId(gameState.currentGameId);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load state from localStorage:', errorMessage);
      // If loading fails, we just continue with default state
    }
  }

  /**
   * Clear persisted state
   */
  clearPersistedState(): void {
    localStorage.removeItem('alias-react-gameStore');
  }

  /**
   * Dispose all autorun reactions
   */
  dispose(): void {
    this.disposers.forEach(dispose => dispose());
    this.disposers = [];
  }
}

export default LocalStorageService; 