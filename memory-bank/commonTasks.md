# Common Tasks and File Locations

## Game Functionality Tasks

### Starting a New Game
**Files to modify:**
- `src/stores/GameStore.ts` - `createGame()` method
- `src/pages/GameSetup.tsx` - Form handling and validation
- `src/pages/HomePage.tsx` - "Start Game" button navigation

**Key methods:**
```typescript
// GameStore.ts
createGame(teams: Team[], settings: GameSettings): void

// GameSetup.tsx  
const handleStartGame = useCallback(() => {
  gameStore.createGame(teams, settings);
  navigate(`/play/${gameId}`);
}, [teams, settings]);
```

### Adding Game Features
**Primary files:**
- `src/stores/GameStore.ts` - Core game logic
- `src/pages/GamePlay.tsx` - UI implementation
- `src/types/index.ts` - Type definitions if new data needed

### Word Management
**Files involved:**
- `src/stores/WordStore.ts` - Word selection and filtering
- `src/stores/words.ts` - Word database (3,406 lines)
- `src/pages/GamePlay.tsx` - Word display logic

**Key operations:**
```typescript
// WordStore.ts
getWordsByDifficulty(difficulty: string): Word[]
getCurrentWord(): Word | null
shuffleWords(): void
```

### Scoring System Changes
**Primary file:** `src/stores/GameStore.ts`
**Key methods:**
```typescript
markWordCorrect(): void    // +1 point to current team
markWordSkipped(): void    // -1 point if losePointOnSkip enabled
updateTeamScore(teamIndex: number, points: number): void
```

## UI/UX Tasks

### Adding New Pages
**Required steps:**
1. Create component in `src/pages/`
2. Add lazy import in `src/App.tsx`
3. Add route in `<Routes>` section
4. Add navigation links in existing components

**Example pattern:**
```typescript
// In App.tsx
const NewPage = lazy(() => import('./pages/NewPage'));

// In Routes
<Route path="/newpage" element={<NewPage />} />
```

### Styling Changes
**Global styles:** `src/index.css` (1,252 lines)
**Component styles:** `src/App.css`
**Theme configuration:** `src/App.tsx` (createTheme function)

**Mantine theme modification:**
```typescript
const theme = createTheme({
  colors: {
    brand: [...], // Modify brand colors
  },
  primaryColor: 'brand'
});
```

### Adding UI Components
**Location:** `src/components/`
**Import in:** `src/App.tsx` or relevant page components
**Common pattern:**
```typescript
// New component file structure
import { ComponentProps } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const NewComponent = () => {
  const { t } = useTranslation('namespace');
  // Component logic
};
```

## Internationalization Tasks

### Adding New Languages
**Steps:**
1. Create language folder: `src/locales/[lang]/`
2. Copy translation files from `src/locales/en/`
3. Translate content in new files
4. Update `src/i18n.ts` supportedLanguages array
5. Update LanguageSwitcher options

**Files to modify:**
- `src/i18n.ts` - Add language to supportedLanguages
- `src/components/LanguageSwitcher.tsx` - Add option to dropdown
- `src/locales/[newlang]/` - Create translation files

### Adding New Translation Keys
**Process:**
1. Add key to appropriate namespace file in `src/locales/en/[namespace].json`
2. Add translations to all other language folders
3. Use in components with `t('namespace:key')`

**Namespace organization:**
- `common.json` - Buttons, navigation, general UI
- `home.json` - Homepage content
- `setup.json` - Game setup interface
- `game.json` - Gameplay interface  
- `summary.json` - Results and statistics

### Translation Usage
**In components:**
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('namespace');
const text = t('key');
const interpolated = t('key', { variable: value });
```

## State Management Tasks

### Adding New Store
**Steps:**
1. Create store file in `src/stores/NewStore.ts`
2. Import in `src/stores/RootStore.ts`
3. Add as property to RootStore class
4. Use via `useStores().newStore` in components

**Store pattern:**
```typescript
import { makeAutoObservable } from 'mobx';

class NewStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable property = initialValue;
  
  @action
  updateProperty(value: any) {
    this.property = value;
  }
}
```

### Modifying Existing Store State
**GameStore:** `src/stores/GameStore.ts`
**WordStore:** `src/stores/WordStore.ts`
**Pattern:** Add observable properties and action methods

### Adding Persistence
**File:** `src/stores/LocalStorageService.ts`
**Auto-save setup:** `src/stores/StoreProvider.tsx` (autorun function)

## Build and Configuration Tasks

### Bundle Optimization
**File:** `vite.config.ts`
**Key areas:**
- `manualChunks` configuration for code splitting
- `optimizeDeps` for dependency pre-bundling
- `rollupOptions` for advanced bundling

### Adding Dependencies
**Process:**
1. Run `npm install package-name`
2. Add to appropriate chunk in `vite.config.ts` if large library
3. Import and use in relevant files

### Environment Configuration
**Development:** `npm run dev`
**Build:** `npm run build`
**Preview:** `npm run preview`
**Lint:** `npm run lint`

### TypeScript Configuration
**Main config:** `tsconfig.json`
**App config:** `tsconfig.app.json`
**Node config:** `tsconfig.node.json`

## Performance Optimization Tasks

### Component Optimization
**Techniques:**
- Add `observer` wrapper for MobX components
- Use `useCallback` for event handlers
- Implement `React.memo` for expensive renders

**Example:**
```typescript
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

const OptimizedComponent = observer(() => {
  const handleClick = useCallback(() => {
    // Event handler logic
  }, [dependencies]);
  
  return <div onClick={handleClick}>Content</div>;
});
```

### Bundle Size Optimization
**Current chunking strategy in `vite.config.ts`:**
- `react-ui` - React ecosystem (290KB)
- `mobx` - State management (56KB)
- `icons` - Tabler icons
- `i18n` - Internationalization core

### Loading Performance
**HTML-level spinner:** `index.html` (immediate display)
**React loading:** `src/App.tsx` (Suspense with lazy loading)
**Translation loading:** `src/i18n.ts` (dynamic imports)

## Testing Tasks

### Adding Tests (Future)
**Structure to create:**
```
src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   ├── stores/
│   └── utils/
└── test-utils/
    └── test-setup.ts
```

**Files to test first:**
1. `src/stores/GameStore.ts` - Core game logic
2. `src/stores/WordStore.ts` - Word management
3. `src/pages/GamePlay.tsx` - Main gameplay
4. `src/components/LanguageSwitcher.tsx` - Language switching

## Debugging Tasks

### Common Debug Locations
**State issues:** Browser DevTools → MobX DevTools
**Translation issues:** `src/i18n.ts` and translation files
**Routing issues:** `src/App.tsx` Routes configuration
**Build issues:** `vite.config.ts` and console output

### Error Handling
**Pattern in components:**
```typescript
try {
  await store.action();
} catch (error) {
  if (error instanceof Error) {
    setErrorMessage(error.message);
  }
}
```

**Store error handling:**
```typescript
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

## Deployment Tasks

### Static Hosting Setup
**Router:** HashRouter (already configured for static hosting)
**Build command:** `npm run build`
**Output:** `dist/` directory
**Compatible with:** GitHub Pages, Netlify, Vercel, any static hosting

### PWA Configuration (Currently Disabled)
**File:** `vite.config.ts` (VitePWA plugin commented out)
**Reason:** Compatibility issues with glob@11
**To re-enable:** Uncomment VitePWA configuration when plugin updates

## File Size Management

### Large Files to Monitor
- `src/stores/words.ts` - 120KB (word database)
- `src/pages/GamePlay.tsx` - 32KB (complex component)
- `src/index.css` - 20KB (global styles)

### Bundle Analysis
**Command:** `npm run build` (outputs chunk sizes)
**Current optimization:** 82% reduction from original bundle size
**Target chunks:** <1MB total, individual chunks <300KB 