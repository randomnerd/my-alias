# System Patterns

## Architecture
- React for frontend UI components
- MobX for state management
- TypeScript for type safety
- Mantine UI component library for consistent design
- React Router with HashRouter for universal static hosting compatibility
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
- **Merged Locale Structure**: Single JSON file per language with nested namespace organization
- **Static Import Strategy**: Direct imports for immediate translation availability
- **Simplified Configuration**: Minimal i18n setup without dynamic loading complexity
- **Dot Notation Keys**: Translation keys use nested structure (e.g., 'home.welcome.title')
- **Browser Language Detection**: Automatic language detection with English fallback
- **Language Preference Persistence**: User language choice saved in localStorage
- **Key Interpolation**: Dynamic content using {{variable}} syntax
- **Cultural Adaptation**: Content adapted beyond literal translation for Russian users

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
- Conservative chunking approach for production stability:
  - React-ui chunk pattern: Grouping React-dependent libraries to prevent race conditions
  - Core i18n chunk pattern: Isolating non-React dependencies for independent loading
  - Strategic dependency grouping to ensure proper loading order
  - Production build stability through conservative library grouping

## Routing Patterns
- HashRouter implementation for universal deployment compatibility:
  - Hash-based routing pattern eliminating server configuration requirements
  - Static hosting compatibility with GitHub Pages, Netlify, Vercel
  - Direct URL access and bookmarking functionality maintained
  - Simplified router configuration without environment dependencies
  - Clean routing implementation without conditional logic or debugging

## Translation Loading Patterns
- Hybrid translation loading strategy for optimal performance:
  - Static imports for critical translations ensuring immediate availability
  - Dynamic loading for non-critical namespaces preserving optimization
  - Error handling and fallback mechanisms for translation loading failures
  - Type-safe translation loading with enhanced error recovery
  - Common translation preloading pattern preventing translation key visibility

## Interactive UI Patterns
- Clickable ThemeIcon components for intuitive interaction:
  - Dual interaction pattern: buttons + clickable icons for enhanced UX
  - Hover animation patterns with scale transform and shadow effects
  - Visual feedback indicators for interactive elements
  - Accessibility-enhanced interactive patterns with clear visual cues
  - Enhanced gameplay flow with icon-based controls

## Production Build Patterns
- React dependency resolution patterns:
  - Conservative chunking strategy preventing race conditions
  - Proper loading order through strategic chunk grouping
  - Production-specific dependency resolution patterns
  - Consistency patterns across browsers and deployment environments
- Simplified translation architecture:
  - Immediate availability for all translations on app startup
  - No dynamic loading complexity or race conditions
  - Professional loading experience with instant localized content

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

## Warning Resolution and Clean Code Patterns
- **npm Deprecation Warning Resolution Patterns:**
  - **Strategic npm overrides pattern for dependency management**
  - **Modern package replacement pattern maintaining compatibility**
  - **Dependency tree analysis pattern for identifying problematic packages**
  - **Future-proof override configuration preventing regression**
- **Vite Build Warning Elimination Patterns:**
  - **Static/dynamic import conflict resolution through explicit loader maps**
  - **Template literal avoidance pattern in dynamic imports**
  - **Plugin compatibility management with documentation for future restoration**
  - **Build output validation pattern ensuring zero warnings**
- **Professional Translation Loading Patterns:**
  - **Type-safe loader map pattern with explicit import organization:**
    ```typescript
    const translationLoaders = {
      [language]: {
        [namespace]: () => import('./path/to/translation.json')
      }
    } as const;
    ```
  - **Derived TypeScript types pattern for compile-time safety**
  - **Maintainable code organization replacing verbose conditional logic**
  - **Performance preservation pattern maintaining dynamic loading benefits**

## Code Quality and Maintainability Patterns
- **Clean Code Architecture Patterns:**
  - **Elimination of repetitive switch statement patterns**
  - **Type-safe configuration objects with derived types**
  - **Organized import structures with clear separation of concerns**
  - **Comprehensive error handling with meaningful error messages**
- **Enterprise-Grade Build Patterns:**
  - **Zero-warning build validation for professional deployment**
  - **Dependency management patterns preventing future compatibility issues**
  - **Clean build output patterns suitable for enterprise environments**
  - **Professional development workflow patterns without build conflicts**
- **Extensibility and Maintenance Patterns:**
  - **Easy addition patterns for new languages and namespaces**
  - **Structured configuration patterns preventing code duplication**
  - **Clear documentation patterns for future development**
  - **Backward compatibility patterns when updating dependencies**

## Loading Architecture

### HTML-Based Instant Loader System
- **Immediate Loading Display**: HTML spinner in index.html provides 0ms delay loading experience
- **CSS Isolation**: Protected styling with !important declarations prevents React conflicts
- **Smooth Transition**: 300ms fade transition from HTML loader to React application
- **No React Suspense**: Eliminated lazy loading in favor of synchronous imports
- **Simplified Architecture**: Direct component imports aligned with HTML loader approach

### Component Loading Strategy
```typescript
// Synchronous imports (no lazy loading needed with HTML instant loader)
import { HomePage } from './pages/HomePage';
import { GameSetup } from './pages/GameSetup';
import { GamePlay } from './pages/GamePlay';
import { GameSummary } from './pages/GameSummary';

// Direct routing without Suspense wrapper
<Routes>
  <Route path="/" element={<RouteTransition><HomePage /></RouteTransition>} />
  {/* ... other routes */}
</Routes>
```

### Loading Transition Management
```typescript
// HTML loader to React app transition
useEffect(() => {
  document.body.classList.add('app-loaded');    // Start fade
  setTimeout(() => {
    document.body.classList.add('app-ready');   // Complete cleanup
  }, 300);
}, []);
```

## Theme Architecture

### Dedicated Theme Module (src/theme.ts)
- **Separation of Concerns**: Theme configuration isolated from application logic
- **Comprehensive Configuration**: 187 lines of responsive design system
- **Reusable Export**: Clean import pattern for theme consumption
- **Maintainability**: Easier updates and modifications to design system

### Theme Structure
```typescript
export const theme = createTheme({
  // Typography with fluid scaling
  fontSizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
    // ... responsive scaling for all sizes
  },
  
  // Component defaults with mobile-first approach
  components: {
    Button: { /* touch-friendly defaults */ },
    Input: { /* iOS zoom prevention */ },
    // ... comprehensive component system
  }
});
```

## Simplified Translation Architecture
- **Static Import Pattern**: Direct imports of merged locale files for immediate availability
- **Merged Locale Structure**: Single JSON file per language with nested namespace organization
- **Simplified i18n Configuration**: Minimal setup without dynamic loading complexity
- **Dot Notation Access**: Translation keys use nested structure (e.g., 'home.welcome.title')
- **Zero Loading Delays**: All translations available immediately on app startup
- **Maintainable Structure**: Easy to add new languages and modify existing translations