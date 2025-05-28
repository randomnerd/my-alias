# System Patterns

## Architecture
- React for frontend UI components
- MobX for state management
- TypeScript for type safety
- Mantine UI component library for consistent design
- React Router for navigation
- Web Storage API (localStorage) for state persistence
- i18next for internationalization and localization
- react-i18next for React integration with translation hooks
- HTML-level loading optimization for instant visual feedback

## Key Design Patterns
- Reactive state management with MobX observables and actions
- Component-based UI architecture with React
- Store-based data modeling (GameStore, WordStore)
- Observer pattern for reactive UI updates
- Functional React components with hooks
- Context API for store injection
- Step-by-step game flow with state transitions
- Score-limit based game progression
- Service pattern for localStorage persistence
- Animation and transition patterns for UI elements
- Memory leak prevention with proper cleanup functions
- Type-safe event handling and state management
- Namespace-based translation organization pattern
- Translation key interpolation for dynamic content
- Language switching with preference persistence
- HTML-level loading with CSS isolation pattern
- Professional loading experience with smooth transitions

## Component Relationships
- Main application entry point: src/main.tsx
- UI components in src/components/
- Pages in src/pages/
- State management stores in src/stores/
- Internationalization setup in src/i18n.ts
- Translation files in src/locales/ organized by language and namespace
- Loading spinner implementation in index.html for instant display
- Game flow: HomePage → GameSetup → GamePlay → GameSummary
- Store structure:
  - RootStore: Combines all stores
  - GameStore: Manages game state
  - WordStore: Manages word data
  - LocalStorageService: Handles state persistence
- Core game components:
  - App: Overall layout with routes and providers
  - HomePage: Introduction and start
  - GameSetup: Team creation and game settings
  - GamePlay: Active gameplay with word guessing
  - GameSummary: Results and winner display
  - LanguageSwitcher: Language selection dropdown component

## UI Architecture
- MobX observers for reactive component updates
- Mantine UI components for consistent design
- Transition components for animated UI elements
- Responsive layouts using Container and Grid
- Theme customization via MantineProvider
- Custom color scheme with brand colors
- Color-coded team representation throughout UI
- Consistent spacing and typography patterns
- Type-safe component props and event handlers
- useTranslation hook for accessing translations in components
- Translation namespaces for organized content (common, home, setup, game, summary)
- HTML-level spinner with CSS isolation for instant loading feedback
- Professional loading transitions with opacity-based animations

## State Management
- MobX stores with clear domain separation
- Centralized store access through RootStore
- React Context API for dependency injection
- Observable state with automatic UI updates
- Action-based state mutations
- Computed values for derived state
- Autorun reactions for localStorage synchronization
- State persistence with Web Storage API
- Proper cleanup of MobX reactions to prevent memory leaks
- Type-safe state updates with TypeScript interfaces

## Game Logic
- Score-limit based game end condition
- Word difficulty levels (easy, medium, hard, mixed)
- Team-based scoring system
- Optional penalties for skipped words
- Post-round word status adjustment
- Winner determination based on highest score
- Word hiding during game pauses

## Data Persistence
- LocalStorageService for browser storage integration
- Automatic state serialization and deserialization
- State recovery on page reload or application restart
- Session continuity across browser refreshes
- Map data structure serialization handling
- Error handling for storage limitations
- Language preference persistence in localStorage

## Internationalization Patterns
- Namespace-based translation organization (common, home, setup, game, summary)
- Key interpolation pattern for dynamic content: {{variable}}
- Browser language detection with fallback to English
- Translation loading with React Suspense support
- Consistent translation key naming conventions
- Cultural adaptation of content beyond literal translation

## Loading Experience Patterns
- HTML-level immediate spinner display pattern (index.html implementation)
- CSS isolation using !important declarations to prevent style conflicts
- Hardware-accelerated animation with CSS keyframes (spinner-spin)
- Smooth opacity-based transitions for professional handoff
- React integration with class-based state management (.app-loaded/.app-ready)
- Suspense fallback elimination pattern (fallback={null})
- Optimized i18n initialization for faster React startup
- Zero visual artifacts loading architecture

## Bundle Optimization Patterns
- Function-based manual chunking strategy for optimal vendor separation
- Dynamic import() pattern for translation resources and lazy components
- Strategic module ID analysis for intelligent chunk distribution
- Vendor library isolation pattern for browser caching optimization
- Route-based code splitting with lazy loading components
- CSS extraction and separation pattern for cache efficiency
- Tree-shaking optimization with proper ESM module resolution
- Progressive loading architecture with optimal resource utilization

## Build Configuration Patterns
- Advanced Vite configuration with rollupOptions optimization
- External module exclusion pattern for native dependencies (fsevents)
- Dependency pre-bundling with include/exclude optimization
- PWA integration with specific glob patterns for file caching
- Source map generation maintaining debugging capabilities
- Chunk size warning limit adjustment for production optimization
- Function-based manualChunks replacing static object configuration
- Build performance optimization with strategic dependency handling

## Error Handling Patterns
- Try/catch blocks for async operations
- Type checking for error objects
- Conditional console logging for development
- User feedback for error states
- Graceful fallbacks when operations fail