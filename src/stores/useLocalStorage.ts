import { useStores } from "./RootStore";

/**
 * Hook to access localStorage service functionality
 */
export const useLocalStorage = () => {
  const { localStorageService } = useStores();
  
  return {
    // Clear all persisted state
    clearPersistedState: () => localStorageService.clearPersistedState(),
  };
}; 