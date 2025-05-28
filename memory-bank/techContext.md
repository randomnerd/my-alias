# Technical Context

## Technologies
- React 19 (UI library)
- TypeScript 5.8
- MobX 6 (state management)
- Mantine UI v8 (component library)
- React Router v7
- Tabler Icons React for iconography
- Web Storage API (localStorage) for state persistence
- i18next v24 (internationalization framework)
- react-i18next v15 (React integration for i18next)
- Browser language detection for automatic locale selection
- HTML/CSS for immediate loading spinner implementation

## Development Setup
- Node.js environment
- Vite for development and build tooling
- npm for package management
- TypeScript configuration with proper types
- MobX store implementation for state management
- Source maps enabled for better debugging
- ESLint for code quality assurance
- i18next configuration with namespace-based organization
- Translation file management in JSON format
- HTML-level loading optimization with CSS isolation

## Technical Constraints
- Browser storage limitations for localStorage
- Need for state synchronization between MobX and localStorage
- Requirements for reactive UI updates
- TypeScript type safety requirements
- Browser compatibility considerations
- Memory management in single-page applications
- Translation file loading performance for initial application startup
- Language switching responsiveness requirements
- Loading experience optimization requirements for instant visual feedback
- CSS isolation challenges to prevent React style conflicts
- Bundle size optimization requirements for fast initial load times
- Code splitting complexity for optimal caching strategies

## Dependencies
Major dependencies include:
- react and react-dom v19 for UI rendering
- react-router-dom v7 for navigation
- mobx and mobx-react-lite for state management
- @mantine/core and @mantine/hooks for UI components
- @tabler/icons-react for iconography
- @types/node for Node.js type definitions
- i18next v24.16 for internationalization core functionality
- react-i18next v15.1 for React hooks and component integration
- Built-in browser language detection capabilities

## State Management
- MobX for reactive state management
- Store-based architecture with domain separation
- RootStore pattern for store composition
- Context API for dependency injection
- Observer components for reactive UI updates
- Action methods for state mutations
- LocalStorageService for state persistence
- Autorun reactions for automatic state synchronization
- Proper reaction disposal to prevent memory leaks

## Data Persistence
- LocalStorageService for browser storage integration
- Automatic state saving with MobX autorun reactions
- State restoration on application startup
- Game state persistence between browser sessions
- Error handling for storage limitations or access issues
- Cleanup of autorun subscriptions on component unmount
- Language preference persistence in browser localStorage

## Internationalization Architecture
- Namespace-based translation file organization:
  - common.json: Shared UI elements and buttons
  - home.json: Homepage content and welcome messages
  - setup.json: Game setup forms and validation messages
  - game.json: Gameplay UI and round management
  - summary.json: Results display and statistics
- Translation loading configuration with fallback handling
- Browser language detection with English fallback
- Dynamic language switching with immediate UI updates
- Translation key interpolation for dynamic content (scores, time, team names)

## Loading Experience Architecture
- HTML-level spinner implementation for instant visual feedback:
  - CSS-only animation in index.html for 0ms delay guarantee
  - 40px x 40px spinner with locked dimensions using !important declarations
  - Hardware-accelerated rotation animation (spinner-spin keyframe)
  - CSS isolation preventing React style conflicts
- React integration optimization:
  - Simplified Suspense fallback strategy using fallback={null}
  - Class-based state management (.app-loaded/.app-ready) for smooth transitions
  - 300ms opacity transition for professional handoff timing
  - Optimized i18n initialization with initImmediate: true
- Performance optimizations:
  - Maintained lazy loading benefits while eliminating loading delays
  - Zero visual artifacts throughout loading process
  - Consistent cross-browser and cross-device behavior

## Type Safety
- TypeScript interfaces for all data models
- Type-safe event handlers
- Proper typing for React hooks and state
- Custom type definitions for external APIs (like BeforeInstallPromptEvent)
- Type-only imports where appropriate
- No use of 'any' type to ensure full type safety
- Type checking for error objects in catch blocks
- Type-safe translation function usage with namespace prefixes

## React Hooks Usage
- Proper dependency arrays in useEffect to prevent stale closures
- useCallback for memoized functions in dependency arrays
- Custom hooks for reusable logic
- Cleanup functions in useEffect for proper resource disposal
- Proper typing for useState and other hooks
- useTranslation hook for accessing localized content

## UI Component Library
- Mantine UI v8 used throughout the application
- Custom theme configuration in App.tsx
- Responsive design patterns with Mantine Grid system
- Element transitions and animations
- Consistent component usage:
  - Container for layout boundaries
  - Stack and Group for component arrangement
  - Card and Paper for content containers
  - Transition for animated element displays
  - Badge for status indicators
  - Alert for important notifications
  - Progress for timer visualization
  - Modal for confirmations
  - Select component for language switching dropdown

## Data Models
- Game: Contains teams, rounds, game settings (roundTime, difficulty, scoreLimit)
- Word: Includes text, category, difficulty, language
- Round: Tracks wordIds, statuses (correct/skipped/pending), team index
- Team: Stores name, score, and player information
- Translation namespaces: Organized content domains for localization

## Store Architecture
- GameStore: Manages game state, teams, rounds, scoring
- WordStore: Handles word data, filtering, and random selection
- RootStore: Combines all stores for centralized access
- StoreProvider: Makes stores available through React Context
- LocalStorageService: Manages state persistence with browser storage

## Translation File Structure
- src/locales/en/: English translations
- src/locales/ru/: Russian translations
- Namespace organization within each language:
  - common.json: UI elements, buttons, navigation
  - home.json: Welcome content, game introduction
  - setup.json: Team setup, game configuration
  - game.json: Gameplay interface, round management
  - summary.json: Results, statistics, rankings

## Loading Implementation Details
- index.html CSS architecture:
  - Fixed positioning with z-index: 9999 for overlay
  - Flexbox centering for perfect spinner alignment
  - !important declarations for complete style isolation
  - Professional 3px border with brand colors (#228be6)
- Animation specifications:
  - 1s linear infinite rotation for smooth movement
  - Hardware acceleration with GPU optimization
  - CSS keyframe animation (spinner-spin) for browser compatibility
- React integration timing:
  - Immediate .app-loaded class for fade start
  - 300ms transition duration matching CSS specifications
  - .app-ready class for complete cleanup after transition

## Error Handling
- Try/catch blocks for async operations
- Proper error type checking
- Conditional console logging for development only
- User-friendly error messages
- Graceful degradation on error conditions
- Fallback to default language when translations are missing
- Loading fallback patterns for network or resource failures

## Bundle Size Optimization Architecture
- **Advanced Vite build configuration with function-based manual chunking:**
  - **Function-based manualChunks implementation using module ID analysis**
  - **Strategic vendor library separation based on dependency type**
  - **External module exclusion (fsevents) to prevent build conflicts**
  - **Optimized dependency pre-bundling with include/exclude patterns**
  - **PWA integration with specific glob patterns for efficient file caching**
- **Dynamic import architecture for i18n resources:**
  - **Converted static translation imports to dynamic import() statements**
  - **Asynchronous translation loading with error handling and fallbacks**
  - **Language-specific resource bundles loaded on-demand**
  - **Enhanced changeLanguage function with automatic translation loading**
  - **Type-safe dynamic loading with TranslationRecord interface**
- **Chunk distribution strategy for optimal performance:**
  - **React ecosystem isolation (265.94 kB) for browser caching efficiency**
  - **Mantine UI separation into core and hooks chunks for modular loading**
  - **State management (MobX) isolation (56.58 kB) for independent caching**
  - **Internationalization libraries separated (48.85 kB) into dedicated chunk**
  - **Icon libraries isolated for optional loading based on usage**
  - **Page components split into 4-14 kB route-based chunks**
- **Build performance optimizations:**
  - **Tree-shaking optimization with proper ESM module resolution**
  - **CSS extraction and separation (213 kB total) for cache efficiency**
  - **Source map generation maintained for debugging capabilities**
  - **Rollup configuration optimized for production bundle splitting**
  - **Chunk size warning limits adjusted for optimized chunking strategy**
