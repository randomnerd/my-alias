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

## Mantine Theme Configuration (`src/App.tsx`)
```typescript
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  primaryColor: 'blue',
  
  // Responsive typography system with clamp() functions
  fontSizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',     // 12px → 14px
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',       // 14px → 16px
    md: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',         // 16px → 18px
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',      // 18px → 20px
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',       // 20px → 24px
  },
  
  lineHeights: {
    xs: '1.4', sm: '1.45', md: '1.5', lg: '1.55', xl: '1.6',
  },
  
  // Responsive heading hierarchy
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3rem)', lineHeight: '1.2' },        // 32px → 48px
      h2: { fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)', lineHeight: '1.25' }, // 24px → 36px
      h3: { fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)', lineHeight: '1.3' },  // 20px → 28px
      h4: { fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)', lineHeight: '1.35' },  // 18px → 24px
      h5: { fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)', lineHeight: '1.4' },      // 16px → 20px
      h6: { fontSize: 'clamp(0.875rem, 0.8rem + 0.375vw, 1.125rem)', lineHeight: '1.45' }, // 14px → 18px
    },
  },
  
  // Enhanced component defaults for mobile-first design
  components: {
    Button: {
      styles: {
        root: {
          fontWeight: '500',
          letterSpacing: '0.01em',
          '@media (maxWidth: 576px)': {
            minHeight: rem(44), // Mobile touch targets
            fontSize: rem(16),   // Prevent iOS zoom
            padding: `${rem(12)} ${rem(20)}`,
          },
          '@media (minWidth: 768px)': {
            letterSpacing: '0.025em', // Desktop readability
            lineHeight: '1.45',
          }
        }
      }
    },
    
    Text: {
      styles: {
        root: {
          lineHeight: '1.6',
          letterSpacing: '0.005em',
          textRendering: 'optimizeLegibility',
          fontFeatureSettings: '"kern" 1',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          '@media (minWidth: 768px)': {
            lineHeight: '1.65',
            letterSpacing: '0.01em',
            fontSize: 'clamp(1rem, 0.9rem + 0.3vw, 1.125rem)',
          },
          '@media (minWidth: 1200px)': {
            lineHeight: '1.7',
            maxWidth: '65ch', // Optimal reading width
            letterSpacing: '0.015em',
          }
        }
      }
    }
  }
});
```

## Typography Patterns and Utilities

### CSS Custom Properties (`src/index.css`)
```css
:root {
  /* Fluid typography variables */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-md: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  
  /* Enhanced color system */
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --text-dimmed: #9ca3af;
  
  /* Typography hierarchy */
  --heading-h1: clamp(2rem, 1.5rem + 2.5vw, 3rem);
  --heading-h2: clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);
  --heading-h3: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
}

/* Professional text rendering */
body, .mantine-Text-root, .mantine-Title-root {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "kern" 1;
}

/* Mobile-first responsive breakpoints */
@media (maxWidth: 576px) {
  /* Mobile optimizations */
  .word-card { font-size: clamp(1.75rem, 4vw + 0.5rem, 3rem); }
  .timer-display { font-size: clamp(2.5rem, 4vw + 1.5rem, 4rem); }
  .action-button { min-height: 3rem; }
}

@media (minWidth: 768px) {
  /* Desktop typography enhancements */
  .word-card { font-size: clamp(2.5rem, 3vw + 1rem, 3.5rem); }
  .content-text { max-width: 65ch; line-height: 1.65; }
}

@media (minWidth: 1200px) {
  /* Large desktop optimizations */
  .word-card { font-size: clamp(3.5rem, 2vw + 2rem, 4.5rem); }
  .content-text { max-width: 70ch; line-height: 1.8; }
}
```

### Feature Card Alignment Pattern (`src/pages/HomePage.tsx`)
```typescript
// Fixed-height title containers for perfect vertical alignment
<Stack align="center" gap="md" style={{ height: '100%' }}>
  <ThemeIcon size={60} radius="xl" color="blue">
    <IconVocabulary size={36} />
  </ThemeIcon>
  
  {/* Fixed 80px height ensures all descriptions align vertically */}
  <div style={{ 
    height: '80px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    <Title order={4} ta="center">{t('home:features.vocabulary.title')}</Title>
  </div>
  
  <Text 
    ta="center" 
    c="dimmed" 
    size="sm"
    lh={{ base: 1.5, md: 1.6 }}
    style={{ 
      fontSize: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
      letterSpacing: '0.005em',
      maxWidth: '100%'
    }}
  >
    {t('home:features.vocabulary.description')}
  </Text>
</Stack>
```

### Responsive Typography Utility Patterns
```typescript
// Responsive text alignment
<Text ta={{ base: 'center', md: 'left' }}>...</Text>

// Responsive line heights
<Text lh={{ base: 1.5, md: 1.6, lg: 1.7 }}>...</Text>

// Fluid font sizing with clamp()
style={{ fontSize: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)' }}

// Mobile-first spacing
style={{ padding: 'clamp(1rem, 2vw, 2rem)' }}

// Desktop-optimized reading width
style={{ maxWidth: '65ch', lineHeight: '1.65' }}
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

## Core Application Patterns

### App.tsx - Simplified Architecture (97 lines)
```typescript
// Synchronous imports (no Suspense needed)
import { HomePage } from './pages/HomePage';
import { GameSetup } from './pages/GameSetup';
import { GamePlay } from './pages/GamePlay';
import { GameSummary } from './pages/GameSummary';
import { theme } from './theme';

// HTML loader transition management
function App() {
  useEffect(() => {
    document.body.classList.add('app-loaded');
    const timer = setTimeout(() => {
      document.body.classList.add('app-ready');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StoreProvider>
      <MantineProvider theme={theme}>
        <Router>
          <AppWithHeaderControl />
        </Router>
      </MantineProvider>
    </StoreProvider>
  );
}

// Direct routing without Suspense
<Routes>
  <Route path="/" element={
    <RouteTransition transitionType="fade">
      <HomePage />
    </RouteTransition>
  } />
  {/* ... other routes */}
</Routes>
```

### Theme Configuration (src/theme.ts)
```typescript
import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  // Fluid typography with clamp functions
  fontSizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
    md: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
  },
  
  // Enhanced component defaults
  components: {
    Button: {
      styles: {
        root: {
          '@media (maxWidth: 576px)': {
            minHeight: rem(44), // Touch-friendly
            fontSize: rem(16),   // Prevent iOS zoom
          }
        }
      }
    },
    
    Text: {
      styles: {
        root: {
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          '@media (minWidth: 1200px)': {
            maxWidth: '65ch', // Optimal reading width
          }
        }
      }
    }
  }
});
``` 