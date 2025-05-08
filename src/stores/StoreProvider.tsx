import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { StoreContext, rootStore } from './RootStore';

/**
 * Store provider component that makes the stores available throughout the app
 * and handles proper cleanup when the app unmounts
 */
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  // Add effect for cleanup on unmount
  useEffect(() => {
    // Return cleanup function to dispose of autorun reactions
    return () => {
      if (rootStore.localStorageService) {
        rootStore.localStorageService.dispose();
      }
    };
  }, []);

  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
}; 