import { MantineProvider, AppShell, Title, Text, Flex, Container } from '@mantine/core';
import '@mantine/core/styles.css';

import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RouteTransition } from './components/RouteTransition';
import { InstallPrompt } from './components/InstallPrompt';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { StoreProvider } from './stores/StoreProvider';

// Regular imports instead of lazy loading since we have HTML-based instant loader
import { HomePage } from './pages/HomePage';
import { GameSetup } from './pages/GameSetup';
import { GamePlay } from './pages/GamePlay';
import { GameSummary } from './pages/GameSummary';
import { theme } from './theme';

const AppWithHeaderControl: React.FC = () => {
  const location = useLocation();
  const showHeader = location.pathname === '/';
  const { t } = useTranslation();

  return (
    <AppShell
      header={showHeader ? { height: { base: 60, md: 70 } } : undefined}
      padding={{ base: 'xs', sm: 'md' }}
    >
      {showHeader && (
        <AppShell.Header withBorder px={{ base: 'md', sm: 'xl' }}>
          <Flex align="center" h="100%" justify="space-between">
            <Title order={2}>
              <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} fw={700} inherit>
                {t('common.appTitle')}
              </Text>
            </Title>
            <LanguageSwitcher />
          </Flex>
        </AppShell.Header>
      )}
      <AppShell.Main>
        <Container size="sm" px={{ base: 'xs', sm: 'md' }}>
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
  // Smooth transition from HTML loader to React app
  useEffect(() => {
    // Start fade out after React renders
    document.body.classList.add('app-loaded');
    
    // Complete removal after transition
    const timer = setTimeout(() => {
      document.body.classList.add('app-ready');
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <StoreProvider>
      <MantineProvider theme={theme}>
        <Router>
          <AppWithHeaderControl />
        </Router>
      </MantineProvider>
    </StoreProvider>
  );
}

export default App; 