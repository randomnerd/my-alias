# Project Structure

## Root Directory
```
my-alias/
├── .git/                     # Git version control
├── .github/workflows/        # GitHub Actions CI/CD
├── .cursor/                  # Cursor IDE configuration
├── dist/                     # Production build output
├── node_modules/             # npm dependencies
├── public/                   # Static assets served by Vite
├── memory-bank/              # AI context preservation system
├── src/                      # Source code (main application)
│
├── package.json              # Dependencies, scripts, npm configuration
├── package-lock.json         # Locked dependency versions  
├── vite.config.ts           # Vite build tool configuration
├── index.html               # HTML entry point with loading spinner
├── README.md                # Project documentation
├── .gitignore              # Git ignore patterns
├── tsconfig.json           # TypeScript configuration (root)
├── tsconfig.app.json       # TypeScript config for app
├── tsconfig.node.json      # TypeScript config for Node.js tools
└── eslint.config.js        # ESLint configuration
```

## Source Directory (`src/`)
```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Main app component with routing
├── App.css                  # Global app styles
├── index.css               # Global CSS styles (1,252 lines)
├── i18n.ts                 # Internationalization configuration (simplified, 25 lines)
├── vite-env.d.ts           # Vite environment type definitions
│
├── components/             # Reusable UI components
│   ├── InstallPrompt.tsx   # PWA installation prompt
│   ├── LanguageSwitcher.tsx # Language selection dropdown
│   └── RouteTransition.tsx # Page transition animations
│
├── pages/                  # Main application pages
│   ├── HomePage.tsx        # Landing page (248 lines)
│   ├── GameSetup.tsx       # Team setup and game configuration (337 lines)
│   ├── GamePlay.tsx        # Active gameplay interface (893 lines)
│   └── GameSummary.tsx     # Game results and statistics (399 lines)
│
├── stores/                 # MobX state management
│   ├── RootStore.ts        # Root store combining all stores
│   ├── StoreProvider.tsx   # React context provider for stores
│   ├── GameStore.ts        # Game state management (303 lines)
│   ├── WordStore.ts        # Word data management (130 lines)
│   ├── LocalStorageService.ts # Persistence layer (99 lines)
│   ├── useLocalStorage.ts  # Custom hook for localStorage
│   └── words.ts            # Word database (3,406 lines, 120KB)
│
├── types/                  # TypeScript type definitions
│   └── index.ts            # Core interfaces (Game, Team, Word, Round)
│
├── locales/               # Internationalization translations
│   ├── en.json            # English translations (merged, 245 lines, 7.2KB)
│   └── ru.json            # Russian translations (merged, 245 lines, 10KB)
│
└── assets/                # Static assets (images, icons, etc.)
```

## Memory Bank (`memory-bank/`)
```
memory-bank/
├── projectbrief.md         # Core project overview and goals
├── productContext.md       # Product vision and user experience
├── activeContext.md        # Current work focus and recent changes
├── systemPatterns.md       # Architecture patterns and design decisions
├── techContext.md          # Technology stack and development setup
├── progress.md             # Implementation status and next steps
├── projectStructure.md     # This file - complete directory mapping
├── codeIndex.md           # Key interfaces, types, and code snippets
├── fileMap.md             # File relationships and dependencies
├── commonTasks.md         # Frequent operations and file locations
└── environmentContext.md  # Tools, configs, commands, and setup
```

## File Size Overview
- **Large Files (>10KB):**
  - `src/stores/words.ts` - 120KB (3,406 lines) - Word database
  - `src/pages/GamePlay.tsx` - 32KB (893 lines) - Core gameplay
  - `memory-bank/activeContext.md` - 22KB (368 lines) - Recent changes
  - `memory-bank/progress.md` - 21KB (347 lines) - Implementation status
  - `src/index.css` - 20KB (1,252 lines) - Global styles
  - `src/pages/GameSummary.tsx` - 15KB (399 lines) - Results display
  - `memory-bank/techContext.md` - 14KB (296 lines) - Technology details
  - `src/pages/GameSetup.tsx` - 12KB (337 lines) - Game configuration
  - `memory-bank/systemPatterns.md` - 11KB (224 lines) - Architecture

- **Medium Files (5-10KB):**
  - `src/pages/HomePage.tsx` - 9.3KB (248 lines) - Landing page
  - `src/stores/GameStore.ts` - 9.1KB (303 lines) - Game state
  - `src/App.tsx` - 5.3KB (189 lines) - Main app component
  - `memory-bank/productContext.md` - 5.3KB (104 lines) - Product context
  - `src/i18n.ts` - 1.1KB (25 lines) - Simplified internationalization setup

## Key Architectural Components
1. **Entry Points:**
   - `index.html` - HTML with immediate loading spinner
   - `src/main.tsx` - React application bootstrap
   - `src/App.tsx` - Main component with routing and providers

2. **Game Flow:**
   - HomePage → GameSetup → GamePlay → GameSummary
   - State managed through MobX stores
   - Persistence via localStorage

3. **Internationalization:**
   - 2 merged locale files (English, Russian) with nested namespace structure
   - Static imports for immediate availability
   - Browser language detection with localStorage persistence

4. **Build System:**
   - Vite with React SWC plugin
   - Advanced chunking strategy for 82% bundle size reduction
   - HashRouter for static hosting compatibility
   - TypeScript with strict configuration

## Dependencies Overview
- **React Ecosystem:** React 19.1.0, React Router 7.6.1, React-DOM 19.1.0
- **UI Library:** Mantine 8.0.2 with hooks and Tabler icons
- **State Management:** MobX 6.13.7 with React integration
- **Internationalization:** i18next 25.2.1 with React integration
- **Build Tools:** Vite 6.3.5, TypeScript 5.8.3, ESLint 9.27.0
- **PWA:** vite-plugin-pwa 1.0.0 (currently disabled for compatibility)

## src/ Directory (14 files, ~85KB total)

### Core Application Files
- **`App.tsx`** (3.2KB, 97 lines) - Main application component with routing, layout management, and HTML loader integration
  - Simplified architecture with direct imports (no Suspense/lazy loading)
  - HashRouter configuration for static hosting compatibility
  - Theme provider integration and store provider setup
  - HTML loader transition management
  - Header visibility control and language switcher integration

- **`theme.ts`** (5.8KB, 187 lines) - Comprehensive Mantine theme configuration
  - Responsive typography with fluid scaling (clamp functions)
  - Enhanced component defaults for mobile/desktop optimization
  - Custom color palette and design system
  - Mobile-first approach with touch-friendly targets
  - Advanced text rendering and accessibility features

- **`main.tsx`** (1.2KB, 25 lines) - React application entry point and i18n initialization
  - i18next configuration with browser language detection
  - Translation loading and initialization
  - React DOM rendering setup
  - Development mode configuration 