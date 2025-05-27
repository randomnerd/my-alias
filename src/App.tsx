import { createTheme, MantineProvider, AppShell, Title, Text, Flex, Container, rem } from '@mantine/core';
import '@mantine/core/styles.css';

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { RouteTransition } from './components/RouteTransition';
import { InstallPrompt } from './components/InstallPrompt';
import { StoreProvider } from './stores/StoreProvider';

// Lazy load components for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const GameSetup = lazy(() => import('./pages/GameSetup').then(module => ({ default: module.GameSetup })));
const GamePlay = lazy(() => import('./pages/GamePlay').then(module => ({ default: module.GamePlay })));
const GameSummary = lazy(() => import('./pages/GameSummary').then(module => ({ default: module.GameSummary })));

const theme = createTheme({
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  primaryColor: 'blue',
  colors: {
    // Custom colors for the app
    blue: [
      '#e9f0ff',
      '#cfdcff',
      '#9db3f5',
      '#6889eb',
      '#3e67e3',
      '#2554e0',
      '#1a48df',
      '#0c38c7',
      '#032fb3',
      '#00259f'
    ]
  },
  defaultRadius: 'md',
  // Enhanced component defaults for better mobile experience
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          '@media (max-width: 576px)': {
            minHeight: rem(42), // Larger touch targets on mobile
          }
        }
      }
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        padding: 'md',
      },
      styles: {
        root: {
          '@media (max-width: 576px)': {
            padding: rem(16), // Adjust padding on mobile
          }
        }
      }
    },
    Container: {
      defaultProps: {
        px: 'md',
      },
      styles: {
        root: {
          '@media (max-width: 576px)': {
            padding: `0 ${rem(12)}`, // Less horizontal padding on mobile
          }
        }
      }
    },
    Input: {
      styles: {
        input: {
          '@media (max-width: 576px)': {
            minHeight: rem(42), // Larger input height on mobile
            fontSize: rem(16), // Prevent iOS zoom on focus
          }
        }
      }
    },
  },
  // Responsive font sizes
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
});

const AppWithHeaderControl: React.FC = () => {
  const location = useLocation();
  const showHeader = location.pathname === '/';
  
  // Add viewport meta tag to ensure proper scaling on mobile
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <AppShell
      header={showHeader ? { height: { base: 60, md: 70 } } : undefined}
      padding={{ base: 'xs', sm: 'md' }}
    >
      {showHeader && (
        <AppShell.Header withBorder px={{ base: 'md', sm: 'xl' }}>
          <Flex align="center" h="100%">
            <Title order={2}>
              <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} fw={700} inherit>
                Alias
              </Text>{' '}
              Game
            </Title>
          </Flex>
        </AppShell.Header>
      )}
      <AppShell.Main>
        <Container size="sm" px={{ base: 'xs', sm: 'md' }}>
          <InstallPrompt />
          <Suspense fallback={
            <Center style={{ height: '50vh' }}>
              <Loader size="xl" color="blue" />
            </Center>
          }>
            <Routes>
              <Route path="/" element={
                <RouteTransition transitionType="fade">
                  <HomePage />
                </RouteTransition>
              } />
              <Route path="/setup" element={
                <RouteTransition transitionType="slide-up">
                  <GameSetup />
                </RouteTransition>
              } />
              <Route path="/play/:gameId" element={
                <RouteTransition transitionType="slide-left">
                  <GamePlay />
                </RouteTransition>
              } />
              <Route path="/summary/:gameId" element={
                <RouteTransition transitionType="slide-left">
                  <GameSummary />
                </RouteTransition>
              } />
            </Routes>
          </Suspense>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

function App() {
  return (
    <StoreProvider>
      <MantineProvider theme={theme}>
        <Router basename={import.meta.env.DEV ? '' : '/my-alias/'}>
          <AppWithHeaderControl />
        </Router>
      </MantineProvider>
    </StoreProvider>
  );
}

export default App; 