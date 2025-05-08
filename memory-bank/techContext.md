# Technical Context

## Technologies
- React 19 (UI library)
- TypeScript 5.8
- MobX 6 (state management)
- Mantine UI v8 (component library)
- React Router v7
- Tabler Icons React for iconography
- Web Storage API (localStorage) for state persistence

## Development Setup
- Node.js environment
- Vite for development and build tooling
- npm for package management
- TypeScript configuration with proper types
- MobX store implementation for state management
- Source maps enabled for better debugging
- ESLint for code quality assurance

## Technical Constraints
- Browser storage limitations for localStorage
- Need for state synchronization between MobX and localStorage
- Requirements for reactive UI updates
- TypeScript type safety requirements
- Browser compatibility considerations
- Memory management in single-page applications

## Dependencies
Major dependencies include:
- react and react-dom v19 for UI rendering
- react-router-dom v7 for navigation
- mobx and mobx-react-lite for state management
- @mantine/core and @mantine/hooks for UI components
- @tabler/icons-react for iconography
- @types/node for Node.js type definitions

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

## Type Safety
- TypeScript interfaces for all data models
- Type-safe event handlers
- Proper typing for React hooks and state
- Custom type definitions for external APIs (like BeforeInstallPromptEvent)
- Type-only imports where appropriate
- No use of 'any' type to ensure full type safety
- Type checking for error objects in catch blocks

## React Hooks Usage
- Proper dependency arrays in useEffect to prevent stale closures
- useCallback for memoized functions in dependency arrays
- Custom hooks for reusable logic
- Cleanup functions in useEffect for proper resource disposal
- Proper typing for useState and other hooks

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

## Data Models
- Game: Contains teams, rounds, game settings (roundTime, difficulty, scoreLimit)
- Word: Includes text, category, difficulty, language
- Round: Tracks wordIds, statuses (correct/skipped/pending), team index
- Team: Stores name, score, and player information

## Store Architecture
- GameStore: Manages game state, teams, rounds, scoring
- WordStore: Handles word data, filtering, and random selection
- RootStore: Combines all stores for centralized access
- StoreProvider: Makes stores available through React Context
- LocalStorageService: Manages state persistence with browser storage

## Error Handling
- Try/catch blocks for async operations
- Proper error type checking
- Conditional console logging for development only
- User-friendly error messages
- Graceful degradation on error conditions
