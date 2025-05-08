import { createContext, useContext } from 'react';
import { gameStore } from './GameStore';
import { wordStore } from './WordStore';
import LocalStorageService from './LocalStorageService';

/**
 * Root store that combines all application stores
 */
export class RootStore {
  gameStore = gameStore;
  wordStore = wordStore;
  localStorageService: LocalStorageService;
  
  constructor() {
    this.localStorageService = new LocalStorageService(this);
    
    // Initialize localStorage sync
    if (typeof window !== 'undefined') {
      this.localStorageService.initialize();
    }
  }
}

// Create a single instance of the root store
export const rootStore = new RootStore();

// Create React context
export const StoreContext = createContext<RootStore>(rootStore);

// Hook to use the store in components
export const useStores = () => useContext(StoreContext); 