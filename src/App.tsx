import { createTheme, MantineProvider, AppShell, Title, Text, Flex, Container } from '@mantine/core';
import '@mantine/core/styles.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RouteTransition } from './components/RouteTransition';
import { InstallPrompt } from './components/InstallPrompt';
import { StoreProvider } from './stores/StoreProvider';

// We'll import these components as we create them
import { HomePage } from './pages/HomePage';
import { GameSetup } from './pages/GameSetup';
import { GamePlay } from './pages/GamePlay';
import { GameSummary } from './pages/GameSummary';

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
  components: {
    Button: {
      defaultProps: {
        size: 'md'
      }
    },
    Card: {
      defaultProps: {
        shadow: 'sm'
      }
    }
  }
});

const AppWithHeaderControl: React.FC = () => {
  const location = useLocation();
  const showHeader = location.pathname === '/';

  return (
    <AppShell
      header={showHeader ? { height: 70 } : undefined}
      padding="md"
    >
      {showHeader && (
        <AppShell.Header withBorder px="xl">
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
        <Container>
          <InstallPrompt />
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
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

function App() {
  return (
    <StoreProvider>
      <MantineProvider theme={theme}>
        <Router basename={import.meta.env.BASE_URL}>
          <AppWithHeaderControl />
        </Router>
      </MantineProvider>
    </StoreProvider>
  );
}

export default App; 