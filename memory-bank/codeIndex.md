# Code Index

## Core TypeScript Interfaces (`src/types/index.ts`)

### Team Interface
```typescript
export interface Team {
  name: string;
  score: number;
  players: string[];
}
```

### Word Interface
```typescript
export interface Word {
  _id: string;
  text: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  language: string;
}
```

### Round Interface
```typescript
export interface Round {
  teamIndex: number;
  words: {
    wordId: string;
    text: string;
    status: 'correct' | 'skipped' | 'pending';
  }[];
}
```

### Game Interface
```typescript
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
```

## MobX Store Patterns

### GameStore Key Methods (`src/stores/GameStore.ts`)
```typescript
class GameStore {
  // Observable state
  @observable currentGame: Game | null = null;
  @observable isGameActive: boolean = false;
  @observable currentWordIndex: number = 0;
  @observable timeLeft: number = 0;
  @observable roundStarted: boolean = false;
  @observable isPaused: boolean = false;

  // Key actions
  @action createGame(teams: Team[], settings: GameSettings): void
  @action startRound(): void
  @action markWordCorrect(): void
  @action markWordSkipped(): void
  @action endRound(): void
  @action pauseGame(): void
  @action resumeGame(): void
  @action resetGame(): void
}
```

### WordStore Key Methods (`src/stores/WordStore.ts`)
```typescript
class WordStore {
  @observable words: Word[] = [];
  @observable currentWords: Word[] = [];

  @action loadWords(): void
  @action getWordsByDifficulty(difficulty: string): Word[]
  @action shuffleWords(): void
  @action getCurrentWord(): Word | null
}
```

## Component Prop Types

### Common Component Props
```typescript
// GamePlay component props
interface GamePlayProps {
  // No props - uses stores via context
}

// GameSetup component props  
interface GameSetupProps {
  // No props - uses stores via context
}

// LanguageSwitcher component props
interface LanguageSwitcherProps {
  // No props - internal state only
}
```

## Store Provider Pattern (`src/stores/StoreProvider.tsx`)
```typescript
const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store] = useState(() => new RootStore());
  
  useEffect(() => {
    // Auto-save to localStorage
    const disposer = autorun(() => {
      LocalStorageService.saveGameState(store.gameStore.currentGame);
    });
    return disposer;
  }, [store]);

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const stores = useContext(StoreContext);
  if (!stores) throw new Error('useStores must be used within StoreProvider');
  return stores;
};
```

## Internationalization Patterns (`src/i18n.ts`)

### i18next Configuration
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const supportedLanguages = ['en', 'ru'] as const;
export const namespaces = ['common', 'home', 'setup', 'game', 'summary'] as const;

export type SupportedLanguage = typeof supportedLanguages[number];
export type SupportedNamespace = typeof namespaces[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: namespaces,
    defaultNS: 'common',
    interpolation: { escapeValue: false }
  });
```

### Translation Usage Patterns
```typescript
// In components
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('namespace');
const text = t('translationKey');
const textWithInterpolation = t('key', { variable: value });
```

## Router Configuration (`src/App.tsx`)
```typescript
import { HashRouter, Routes, Route } from 'react-router-dom';

// HashRouter for static hosting compatibility
<HashRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/setup" element={<GameSetup />} />
    <Route path="/play/:gameId" element={<GamePlay />} />
    <Route path="/summary/:gameId" element={<GameSummary />} />
  </Routes>
</HashRouter>
```

## Mantine Theme Configuration
```typescript
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {
    brand: [
      '#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc',
      '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1',
      '#075985', '#0c4a6e'
    ]
  },
  primaryColor: 'brand'
});

<MantineProvider theme={theme}>
  {/* App content */}
</MantineProvider>
```

## LocalStorage Service Pattern (`src/stores/LocalStorageService.ts`)
```typescript
class LocalStorageService {
  private static readonly GAME_STORAGE_KEY = 'alias-game-state';
  private static readonly LANGUAGE_STORAGE_KEY = 'alias-language';

  static saveGameState(game: Game | null): void {
    try {
      if (game) {
        localStorage.setItem(this.GAME_STORAGE_KEY, JSON.stringify(game));
      } else {
        localStorage.removeItem(this.GAME_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  static loadGameState(): Game | null {
    try {
      const stored = localStorage.getItem(this.GAME_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }
}
```

## Common Validation Patterns

### Game Setup Validation
```typescript
// Team name validation
const isValidTeamName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 50;
};

// Round time validation (30-300 seconds)
const isValidRoundTime = (time: number): boolean => {
  return time >= 30 && time <= 300 && Number.isInteger(time);
};

// Score limit validation (minimum 1)
const isValidScoreLimit = (limit: number): boolean => {
  return limit >= 1 && Number.isInteger(limit);
};
```

## Error Handling Patterns
```typescript
// Standard error handling in components
try {
  await gameStore.performAction();
} catch (error) {
  if (error instanceof Error) {
    console.error('Action failed:', error.message);
    setErrorMessage(error.message);
  } else {
    console.error('Unknown error:', error);
    setErrorMessage('An unexpected error occurred');
  }
}

// MobX action error handling
@action
async performAction() {
  try {
    // Action logic
  } catch (error) {
    runInAction(() => {
      this.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    });
    throw error;
  }
}
```

## Performance Optimization Patterns
```typescript
// useCallback for event handlers
const handleButtonClick = useCallback(() => {
  gameStore.performAction();
}, [gameStore]);

// MobX observer pattern
import { observer } from 'mobx-react-lite';

const GameComponent = observer(() => {
  const { gameStore } = useStores();
  
  // Component automatically re-renders when observables change
  return <div>{gameStore.currentGame?.status}</div>;
});
```

## Bundle Optimization Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-ui': ['react', 'react-dom', 'react-router-dom', '@mantine/core', '@mantine/hooks', 'react-i18next'],
          'mobx': ['mobx', 'mobx-react-lite'],
          'icons': ['@tabler/icons-react'],
          'i18n': ['i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
});
```

## Translation File Structure
```json
// src/locales/en/common.json
{
  "appTitle": "Alias Game",
  "buttons": {
    "start": "Start",
    "next": "Next",
    "back": "Back",
    "pause": "Pause",
    "resume": "Resume"
  },
  "validation": {
    "required": "This field is required",
    "teamNameTooLong": "Team name is too long",
    "invalidRoundTime": "Round time must be between {{min}} and {{max}} seconds"
  }
}
```

## Common Constants
```typescript
// Game configuration constants
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 10;
export const MIN_ROUND_TIME = 30; // seconds
export const MAX_ROUND_TIME = 300; // seconds
export const MIN_SCORE_LIMIT = 1;
export const DEFAULT_ROUND_TIME = 60;
export const DEFAULT_SCORE_LIMIT = 50;

// Word difficulties
export const WORD_DIFFICULTIES = ['easy', 'medium', 'hard', 'mixed'] as const;
export type WordDifficulty = typeof WORD_DIFFICULTIES[number];
``` 