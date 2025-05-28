# Environment Context

## Development Environment

### System Requirements
- **Node.js:** v16+ (for Vite 6.3.5 compatibility)
- **npm:** v7+ (for package.json workspaces and overrides support)
- **Browser:** Modern browser with ES2020+ support
- **IDE:** VS Code recommended (with TypeScript, ESLint extensions)

### User Environment
- **OS:** macOS (darwin 24.4.0)
- **Shell:** /bin/zsh
- **Workspace:** /Users/randomnerd/Projects/ai/my-alias

## Package Scripts (`package.json`)

### Development Commands
```bash
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # TypeScript compilation + Vite build
npm run lint       # ESLint check across all TypeScript/React files
npm run preview    # Preview production build locally
```

### Script Details
```json
{
  "scripts": {
    "dev": "vite",                    # Development server with HMR
    "build": "tsc -b && vite build",  # Type check then build
    "lint": "eslint .",               # Lint with ESLint 9.27.0
    "preview": "vite preview"         # Preview dist/ build
  }
}
```

## Dependencies Overview

### Runtime Dependencies
```json
{
  "@mantine/core": "^8.0.2",           # UI component library
  "@mantine/hooks": "^8.0.2",          # Utility hooks for Mantine
  "@tabler/icons-react": "^3.33.0",    # Icon library (2,500+ icons)
  "i18next": "^25.2.1",                # Internationalization framework
  "i18next-browser-languagedetector": "^8.1.0", # Browser language detection
  "mobx": "^6.13.7",                   # State management library
  "mobx-react-lite": "^4.1.0",         # React integration for MobX
  "react": "^19.1.0",                  # React framework
  "react-dom": "^19.1.0",              # React DOM renderer
  "react-i18next": "^15.5.2",          # React hooks for i18next
  "react-router-dom": "^7.6.1",        # Client-side routing
  "vite-plugin-pwa": "^1.0.0"          # PWA capabilities (currently disabled)
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.27.0",             # ESLint core rules
  "@types/react": "^19.1.6",           # React TypeScript types
  "@types/react-dom": "^19.1.5",       # React DOM TypeScript types
  "@vitejs/plugin-react-swc": "^3.10.0", # Vite React plugin with SWC
  "eslint": "^9.27.0",                 # JavaScript/TypeScript linter
  "eslint-plugin-react-hooks": "^5.2.0", # React hooks linting rules
  "eslint-plugin-react-refresh": "^0.4.20", # React refresh linting
  "globals": "^16.2.0",                # Global variables for ESLint
  "postcss": "^8.5.3",                 # CSS processor
  "postcss-preset-mantine": "^1.17.0", # Mantine PostCSS configuration
  "postcss-simple-vars": "^7.0.1",     # CSS variables support
  "typescript": "~5.8.3",              # TypeScript compiler
  "typescript-eslint": "^8.33.0",      # TypeScript ESLint integration
  "vite": "^6.3.5"                     # Build tool and dev server
}
```

### npm Overrides (Dependency Resolution)
```json
{
  "overrides": {
    "glob": "^11.0.0",                           # Modern file globbing
    "inflight": "npm:@eslint/object-schema@^2.1.4", # Replace deprecated inflight
    "sourcemap-codec": "npm:@jridgewell/sourcemap-codec@^1.5.0", # Modern sourcemap
    "magic-string": "^0.30.17"                   # Enhanced string manipulation
  }
}
```

## Build Configuration

### Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  base: '',                    # Empty base for universal deployment
  plugins: [
    react(),                   # React SWC plugin for fast compilation
    // VitePWA temporarily disabled for glob@11 compatibility
  ],
  build: {
    sourcemap: true,           # Generate source maps for debugging
    chunkSizeWarningLimit: 1000, # Increase warning limit for optimized chunks
    rollupOptions: {
      external: ['fsevents'],  # Exclude native dependencies
      output: {
        manualChunks: {        # Strategic code splitting
          'react-ui': [        # React ecosystem chunk
            'react', 'react-dom', 'react-router-dom', 
            '@mantine/core', '@mantine/hooks', 'react-i18next'
          ],
          'mobx': ['mobx', 'mobx-react-lite'],
          'icons': ['@tabler/icons-react'],
          'i18n': ['i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],     # Exclude from pre-bundling
    include: [                 # Force pre-bundling for these
      'react', 'react-dom', '@mantine/core', 
      '@mantine/hooks', 'react-router-dom'
    ],
  },
})
```

### TypeScript Configuration

#### `tsconfig.json` (Root)
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

#### `tsconfig.app.json` (Application)
```json
{
  "compilerOptions": {
    "strict": true,              # Strict type checking
    "target": "ES2020",          # Modern JavaScript target
    "module": "ESNext",          # ESM modules
    "moduleResolution": "bundler", # Bundler-style resolution
    "allowImportingTsExtensions": true,
    "noEmit": true,              # No compilation output (Vite handles)
    "jsx": "react-jsx",          # React 17+ JSX transform
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src"]
}
```

#### `tsconfig.node.json` (Node.js Tools)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

## ESLint Configuration (`eslint.config.js`)

```javascript
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactHooks.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: { react: { version: '18.3' } },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
```

## Development Server

### Vite Dev Server
- **URL:** http://localhost:5173
- **Features:**
  - Hot Module Replacement (HMR)
  - Fast TypeScript compilation with SWC
  - Instant server start
  - Built-in proxy support
  - CSS preprocessing with PostCSS

### Development Features
- **Source Maps:** Enabled for debugging
- **React Fast Refresh:** Automatic component reload
- **TypeScript:** Real-time type checking
- **ESLint Integration:** Live linting feedback
- **PostCSS:** Mantine CSS preprocessing

## Build Process

### Development Build
```bash
npm run dev
# Starts development server with:
# - Hot reloading
# - Source maps
# - Fast compilation
# - Error overlay
```

### Production Build
```bash
npm run build
# Process:
# 1. TypeScript compilation check
# 2. Vite build with optimizations
# 3. Code splitting and chunking
# 4. Asset optimization
# 5. Output to dist/ directory
```

### Build Output (`dist/`)
```
dist/
├── index.html                    # Optimized HTML with inline spinner
├── assets/
│   ├── react-ui.[hash].js        # React ecosystem chunk (~290KB)
│   ├── mobx.[hash].js            # State management chunk (~56KB)
│   ├── i18n.[hash].js            # Internationalization chunk (~48KB)
│   ├── icons.[hash].js           # Icon library chunk
│   ├── HomePage.[hash].js        # Individual page chunks (4-14KB each)
│   ├── GameSetup.[hash].js
│   ├── GamePlay.[hash].js
│   ├── GameSummary.[hash].js
│   ├── [lang]-[namespace].[hash].js # Translation chunks (1-2KB each)
│   ├── index.[hash].css          # Compiled styles
│   └── [other assets]
└── [other build artifacts]
```

## Deployment Configuration

### Static Hosting Ready
- **Router:** HashRouter for universal compatibility
- **Base URL:** Empty (`base: ''`) for flexible deployment
- **Assets:** Relative paths for any subdirectory deployment
- **Compatible with:**
  - GitHub Pages
  - Netlify
  - Vercel
  - Any static file hosting

### Deployment Commands
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ directory to hosting platform
```

## Development Workflow

### Starting Development
```bash
cd /Users/randomnerd/Projects/ai/my-alias
npm install          # Install dependencies
npm run dev          # Start development server
```

### Code Quality Checks
```bash
npm run lint         # Check for linting errors
npm run build        # Verify build succeeds
```

### Adding Dependencies
```bash
npm install package-name           # Runtime dependency
npm install -D package-name        # Development dependency

# For large libraries, update vite.config.ts manualChunks
```

## IDE Configuration

### VS Code Extensions (Recommended)
- **TypeScript and JavaScript Language Features** (built-in)
- **ESLint** - Real-time linting
- **Prettier** - Code formatting
- **Auto Rename Tag** - HTML/JSX tag synchronization
- **GitLens** - Enhanced Git integration
- **Thunder Client** - API testing (if adding backend)

### VS Code Settings (`.vscode/settings.json`)
```json
{
  "typescript.preferences.useAliasesForRenames": false,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "files.associations": {
    "*.css": "postcss"
  }
}
```

## Environment Variables

### Vite Environment Variables
- **Development:** `import.meta.env.DEV` (boolean)
- **Production:** `import.meta.env.PROD` (boolean)
- **Mode:** `import.meta.env.MODE` ('development' | 'production')

### Usage in Code
```typescript
// Conditional logging
if (import.meta.env.DEV) {
  console.log('Development mode');
}

// Environment-specific configuration
const apiUrl = import.meta.env.PROD 
  ? 'https://api.production.com' 
  : 'http://localhost:3000';
```

## Performance Monitoring

### Bundle Analysis
```bash
npm run build
# Outputs chunk sizes and warnings
# Current optimization: 82% bundle size reduction
```

### Development Performance
- **Initial build:** <3 seconds
- **HMR updates:** <100ms
- **TypeScript compilation:** Real-time with SWC
- **Memory usage:** Optimized with proper cleanup

### Production Performance
- **Initial load:** 107KB main bundle (28KB gzipped)
- **Total chunks:** ~500KB (optimized chunking)
- **Loading strategy:** Progressive with lazy routes
- **Cache efficiency:** Vendor chunk separation

## Browser Compatibility

### Target Browsers
- **Chrome:** 88+
- **Firefox:** 87+
- **Safari:** 14+
- **Edge:** 88+

### Features Used
- **ES2020:** Modern JavaScript features
- **CSS:** PostCSS with Mantine preprocessing
- **Storage:** localStorage (with fallbacks)
- **Routing:** Hash-based for universal compatibility

## Security Considerations

### Dependencies
- **Regular updates:** npm audit and dependency updates
- **Overrides:** Strategic package replacement for security
- **No known vulnerabilities:** Clean dependency audit

### Build Security
- **Source maps:** Enabled for debugging (disable for sensitive production)
- **No sensitive data:** Environment variables for sensitive config
- **Static hosting:** No server-side vulnerabilities 