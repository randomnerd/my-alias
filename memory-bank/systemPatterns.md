# System Patterns

## Architecture
- React for frontend UI components
- MobX for state management
- TypeScript for type safety
- Mantine UI component library for consistent design
- React Router for navigation
- Web Storage API (localStorage) for state persistence

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

## Component Relationships
- Main application entry point: src/main.tsx
- UI components in src/components/
- Pages in src/pages/
- State management stores in src/stores/
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

## Error Handling Patterns
- Try/catch blocks for async operations
- Type checking for error objects
- Conditional console logging for development
- User feedback for error states
- Graceful fallbacks when operations fail