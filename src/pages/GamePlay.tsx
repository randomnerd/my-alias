import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/RootStore';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Group, 
  Stack,
  Paper,
  Progress,
  Badge,
  Box,
  Loader,
  Center,
  Flex,
  rem,
  Table,
  Transition,
  ThemeIcon,
  useMantineTheme,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import { 
  IconAlertTriangle, 
  IconPlayerPlay, 
  IconCircleCheck, 
  IconPlayerSkipForward,
  IconHome,
  IconCircleX,
  IconClock,
  IconChevronRight,
} from '@tabler/icons-react';

interface GamePlayParams {
  gameId: string;
}

interface TeamType {
  name: string;
  score: number;
}

// Define custom card animation with enhanced effects
const wordCardAnimation = {
  in: { opacity: 1, transform: 'translateY(0) scale(1)' },
  out: { opacity: 0, transform: 'translateY(-20px) scale(0.95)' },
  common: { transformOrigin: 'center', transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' },
  transitionProperty: 'transform, opacity',
} as const;

// Define page transition animation
const pageTransition = {
  in: { opacity: 1, transform: 'scale(1)' },
  out: { opacity: 0, transform: 'scale(0.98)' },
  common: { transformOrigin: 'center' },
  transitionProperty: 'transform, opacity',
} as const;

export const GamePlay: React.FC = observer(() => {
  const { gameId } = useParams<keyof GamePlayParams>() as GamePlayParams;
  const navigate = useNavigate();
  const { gameStore } = useStores();
  const theme = useMantineTheme();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [roundStarted, setRoundStarted] = useState(false);
  const [lastAction, setLastAction] = useState<{type: 'correct' | 'skipped', word: string} | null>(null);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [wordTransition, setWordTransition] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  
  // Set the current game in the store
  useEffect(() => {
    if (gameId) {
      gameStore.setCurrentGameId(gameId);
      setIsLoading(false);
    }
  }, [gameId, gameStore]);
  
  // Get the current game from the store
  const game = gameStore.currentGame;

  // Helper function to get team colors consistently throughout the component
  const getTeamColor = useCallback((index: number) => {
    const colors = ['blue', 'teal', 'grape', 'orange', 'pink'];
    return colors[index % colors.length];
  }, []);

  // Calculate timer percentage for better visualization
  const timerPercentage = useMemo(() => {
    if (!game) return 0;
    return (timeLeft / game.roundTime) * 100;
  }, [timeLeft, game]);

  // Define endRound using useCallback before it's used in other effects
  const endRound = useCallback(async () => {
    setTimerActive(false);
    
    try {
      const result = await gameStore.endRound();
      setShowRoundSummary(true);
      
      if (result === 'gameEnd') {
        navigate(`/summary/${gameId}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error ending round:', error);
        alert(`Failed to end round: ${error.message}`);
      } else {
        console.error('Error ending round:', error);
        alert('Failed to end round: Unknown error');
      }
    }
  }, [gameId, navigate, gameStore]);

  // Timer effect
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    
    if (timerActive && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        
        if (timeLeft === 1) {
          // Time's up, end the round
          endRound();
        }
      }, 1000);
    }
    
    // Always clear the timer on component unmount or when dependencies change
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timerActive, timeLeft, endRound]);

  // Handle starting the round
  const startRound = useCallback(async () => {
    setShowRoundSummary(false);
    try {
      await gameStore.startRound();
      setRoundStarted(true);
      setTimeLeft(game?.roundTime || 60);
      setTimerActive(true);
      setCurrentWordIndex(0);
      setLastAction(null);
      setWordTransition(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error starting round:', errorMessage);
      alert(`Failed to start round: ${errorMessage}`);
    }
  }, [game, gameStore]);

  // Handle word result (correct or skip)
  const handleWordResult = useCallback(async (status: 'correct' | 'skipped') => {
    if (!game || !roundStarted) return;
    
    const currentWord = game.rounds[game.currentRound]?.words[currentWordIndex];
    if (currentWord) {
      setLastAction({ type: status, word: currentWord.text });
    }
    
    // Show correct animation
    if (status === 'correct') {
      setShowCorrectAnimation(true);
      setTimeout(() => setShowCorrectAnimation(false), 500);
    }
    
    // Trigger exit animation
    setWordTransition(false);
    
    try {
      await gameStore.updateWordStatus(currentWordIndex, status);
      
      // Short delay before moving to the next word for animation
      setTimeout(() => {
        // Move to next word
        if (currentWordIndex < game.rounds[game.currentRound]?.words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          // Trigger entrance animation for next word
          setTimeout(() => setWordTransition(true), 50);
        } else {
          // End of words, end the round
          endRound();
        }
      }, 250);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error marking word as ${status}:`, errorMessage);
      alert(`Failed to update word status: ${errorMessage}`);
      setWordTransition(true); // Ensure the word is visible in case of error
    }
  }, [game, roundStarted, currentWordIndex, gameStore, endRound]);

  // Handle toggling word status in round summary
  const toggleWordStatus = useCallback(async (wordIndex: number, currentStatus: 'correct' | 'skipped') => {
    if (!game) return;
    
    const newStatus = currentStatus === 'correct' ? 'skipped' : 'correct';
    try {
      gameStore.updateWordStatusInRound(game.currentRound, wordIndex, newStatus);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error toggling word status:', errorMessage);
      alert(`Failed to update word status: ${errorMessage}`);
    }
  }, [game, gameStore]);

  const getTimerColor = useCallback((): string => {
    if (timeLeft <= 10) return 'red';
    if (timeLeft <= 30) return 'orange';
    return 'blue';
  }, [timeLeft]);

  if (isLoading) {
    return (
      <Container size="sm" py="md">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" gap="md">
            <Loader size="xl" color="blue" />
            <Text size="lg">Loading game...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container size="sm" py="md">
        <Card shadow="md" withBorder p="lg" radius="lg">
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" color="red">
              <IconAlertTriangle size={32} />
            </ThemeIcon>
            <Title order={2}>Game not found</Title>
            <Text mb="md">The game you're looking for doesn't exist or has been removed.</Text>
            <Button 
              onClick={() => navigate('/')} 
              leftSection={<IconHome size={18} />}
              size="md"
              variant="light"
            >
              Return to Home
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  // Display score limit at the top of the gameplay screen
  const ScoreLimitBanner = () => (
    <Box mb="md" style={{ textAlign: 'center' }}>
      <Badge color="grape" size="lg" radius="md" variant="filled">
        Score Limit: {game.scoreLimit} points
      </Badge>
      {game.scoreLimitReached && (
        <Box mt="xs">
          <Badge color="yellow" size="lg" radius="md" variant="filled">
            Score limit reached! Game will end after this round.
          </Badge>
        </Box>
      )}
    </Box>
  );

  // Round Summary Component
  const RoundSummary = () => {
    if (!game || game.currentRound < 0 || !game.rounds[game.currentRound]) return null;
    
    const currentRound = game.rounds[game.currentRound];
    const currentTeam = game.teams[currentRound.teamIndex];
    const roundWords = currentRound.words;
    const filteredWords = roundWords.filter(word => word.status !== 'pending');
    
    const teamColor = getTeamColor(currentRound.teamIndex);
    
    return (
      <Card shadow="md" padding="md" radius="lg" withBorder mb="md">
        <Stack gap="md">
          <Title order={3} ta="center">Round Summary</Title>
          
          <Paper p="md" radius="md" withBorder style={{
            background: `linear-gradient(45deg, ${theme.colors[teamColor][0]} 0%, rgba(255, 255, 255, 0.8) 100%)`
          }}>
            <Group justify="space-between" wrap="nowrap">
              <Text 
                fw={500} 
                size="lg" 
                style={{ 
                  color: `var(--mantine-color-${teamColor}-6)`,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                  flex: 1
                }}
              >
                {currentTeam.name}
              </Text>
              <Text fw={700} size="lg" style={{ flexShrink: 0 }}>
                Score: {currentTeam.score}
              </Text>
            </Group>
          </Paper>
          
          <Text ta="center" size="sm" c="dimmed" mb="md">
            Click on a word's status to toggle between correct and skipped
          </Text>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: '60%' }}>Word</Table.Th>
                  <Table.Th style={{ textAlign: 'center', width: '40%' }}>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredWords.map((word, index) => (
                  <Table.Tr key={index}>
                    <Table.Td style={{ wordBreak: 'break-word', maxWidth: 0 }}>
                      <Text fw={500} size="sm">{word.text}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'center', padding: '8px 4px' }}>
                      <Button
                        size="xs"
                        color={word.status === 'correct' ? 'green' : 'gray'}
                        variant={word.status === 'correct' ? 'filled' : 'light'}
                        radius="lg"
                        onClick={() => toggleWordStatus(index, word.status as 'correct' | 'skipped')}
                        styles={{
                          root: {
                            fontSize: rem(11),
                            height: rem(28),
                            padding: '0 8px',
                            minWidth: 'auto',
                            '@media (max-width: 576px)': {
                              fontSize: rem(10),
                              height: rem(26),
                              padding: '0 6px',
                            }
                          }
                        }}
                      >
                        {word.status === 'correct' ? '✓' : '✗'}
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
          
          <Group justify="center" mt="md">
            <Button 
              variant="gradient" 
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              size="lg"
              radius="md"
              rightSection={<IconChevronRight size={18} />}
              onClick={() => setShowRoundSummary(false)}
              style={{ boxShadow: '0 4px 14px rgba(34, 139, 230, 0.25)' }}
            >
              Continue to Next Round
            </Button>
          </Group>
        </Stack>
      </Card>
    );
  };

  // If game is in the roundEnd or setup state, show next round prompt
  if (game.status === 'roundEnd' && !showRoundSummary || game.status === 'setup') {
    const currentTeam = game.status === 'setup' 
      ? 0 
      : (game.currentRound + 1) % game.teams.length;
    
    const teamName = game.teams[currentTeam]?.name || `Team ${currentTeam + 1}`;
    const isFirstRound = game.status === 'setup';
    const teamColor = getTeamColor(currentTeam);
    
    return (
      <Transition mounted={true} transition={pageTransition} duration={300}>
        {(styles) => (
          <Container size="sm" py="md" style={styles} mt="xs">
            <ScoreLimitBanner />
            
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="lg">
              {game.teams.map((team: TeamType, index: number) => (
                <Paper 
                  key={index} 
                  p="md" 
                  radius="md" 
                  withBorder
                  style={{
                    background: index === currentTeam 
                      ? `linear-gradient(45deg, ${theme.colors[getTeamColor(index)][0]} 0%, rgba(255, 255, 255, 0.8) 100%)` 
                      : undefined,
                    borderColor: index === currentTeam ? theme.colors[getTeamColor(index)][5] : undefined,
                    borderWidth: index === currentTeam ? '2px' : '1px',
                  }}
                >
                  <Stack align="center" gap="xs">
                    <Text 
                      fw={600} 
                      size="md" 
                      style={{ 
                        color: `var(--mantine-color-${getTeamColor(index)}-6)`,
                        textAlign: 'center',
                      }}
                    >
                      {team.name}
                    </Text>
                    <Title order={2}>{team.score}</Title>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>

            <Card shadow="md" padding="lg" radius="lg" withBorder>
              <Stack align="center" gap="lg">
                <ThemeIcon 
                  size={80} 
                  radius={100} 
                  color={teamColor}
                  style={{
                    boxShadow: `0 4px 14px ${theme.colors[teamColor][3]}80`,
                  }}
                >
                  {isFirstRound ? (
                    <IconPlayerPlay size={40} />
                  ) : (
                    <IconClock size={40} />
                  )}
                </ThemeIcon>
                
                <Title order={2} ta="center">
                  {isFirstRound ? 'Game Ready!' : 'Round Ended'}
                </Title>

                {!isFirstRound && (
                    <Button
                      variant="light"
                      color="teal"
                      w="100%"
                      size="sm"
                      onClick={() => setShowRoundSummary(true)}
                    >
                      Review Last Round
                    </Button>
                  )}
                
                <Paper p="md" radius="md" withBorder w="100%" shadow="sm">
                  <Flex justify="space-between" align="center">
                    <Text size="lg" fw={500}>
                      {isFirstRound ? 'First Team:' : 'Next Team:'}
                    </Text>
                    <Badge size="xl" color={teamColor} variant="filled" radius="md">
                      {teamName}
                    </Badge>
                  </Flex>
                </Paper>
                
                <Paper 
                  p="md" 
                  radius="md" 
                  withBorder 
                  style={{
                    background: 'rgba(250, 250, 250, 0.7)',
                  }}
                >
                  <Stack gap="xs">
                    <Text ta="center">
                      You will have <Text span fw={700}>{game.roundTime} seconds</Text> to explain as many words as possible.
                    </Text>
                  </Stack>
                </Paper>
                
                <Group justify="space-between" w="100%" mt="md">
                  <Button 
                    variant="light"
                    size="md"
                    onClick={() => navigate('/')}
                    leftSection={<IconHome size={18} />}
                  >
                    Exit
                  </Button>
                  <Button 
                    variant="gradient" 
                    gradient={{ from: teamColor, to: 'cyan', deg: 45 }}
                    size="md"
                    radius="md" 
                    onClick={startRound}
                    rightSection={<IconPlayerPlay size={18} />}
                    style={{ boxShadow: `0 4px 14px ${theme.colors[teamColor][3]}80` }}
                  >
                    Start
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Container>
        )}
      </Transition>
    );
  }

  // Show round summary
  if (game.status === 'roundEnd' && showRoundSummary) {
    return (
      <Transition mounted={true} transition={pageTransition} duration={300}>
        {(styles) => (
          <Container size="sm" py="md" style={styles}>
            <ScoreLimitBanner />
            
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="lg">
              {game.teams.map((team: TeamType, index: number) => (
                <Paper 
                  key={index} 
                  p="md" 
                  radius="md" 
                  withBorder
                  style={{
                    background: `linear-gradient(45deg, ${theme.colors[getTeamColor(index)][0]} 0%, rgba(255, 255, 255, 0.8) 100%)`,
                  }}
                >
                  <Stack align="center" gap="xs">
                    <Text 
                      fw={600} 
                      size="md"
                      style={{ 
                        color: `var(--mantine-color-${getTeamColor(index)}-6)`,
                        textAlign: 'center',
                      }}
                    >
                      {team.name}
                    </Text>
                    <Title order={2}>{team.score}</Title>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
            
            <RoundSummary />
          </Container>
        )}
      </Transition>
    );
  }

  if (game.status === 'playing') {
    const currentRound = game.rounds[game.currentRound];
    if (!currentRound) return <Text>Round not found</Text>;
    
    const currentTeam = game.teams[currentRound.teamIndex];
    const currentWord = currentRound.words[currentWordIndex];
    
    const teamColor = getTeamColor(currentRound.teamIndex);
    
    if (!roundStarted) {
      return (
        <Transition mounted={true} transition={pageTransition} duration={300}>
          {(styles) => (
            <Container size="sm" py="md" style={styles}>
              <Card shadow="md" padding="lg" radius="lg" withBorder>
                <Stack align="center" gap="lg">
                  <ThemeIcon 
                    size={80} 
                    radius={100} 
                    color={teamColor}
                    style={{
                      boxShadow: `0 4px 14px ${theme.colors[teamColor][3]}80`,
                    }}
                  >
                    <IconPlayerPlay size={40} />
                  </ThemeIcon>
                  <Title order={2}>Get Ready!</Title>
                  <Title order={3} c={teamColor}>It's {currentTeam.name}'s turn</Title>
                  <Button 
                    size="xl" 
                    variant="gradient" 
                    gradient={{ from: teamColor, to: 'cyan', deg: 45 }}
                    rightSection={<IconPlayerPlay size={24} />}
                    radius="md"
                    onClick={startRound}
                    style={{ boxShadow: `0 4px 14px ${theme.colors[teamColor][3]}80` }}
                  >
                    Start Round
                  </Button>
                </Stack>
              </Card>
            </Container>
          )}
        </Transition>
      );
    }
    
    return (
      <Transition mounted={true} transition={pageTransition} duration={300}>
        {(styles) => (
          <div 
            style={{
              ...styles,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              overflowX: 'hidden',
              width: '100%'
            }}
            className="gameplay-container"
          >
            <Container 
              size="sm" 
              py="md" 
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                margin: '0 auto'
              }}
              className="gameplay-inner"
            >
              <Card 
                shadow="md" 
                padding="md" 
                radius="lg" 
                withBorder 
                mb="md"
                style={{
                  background: `linear-gradient(45deg, ${theme.colors[teamColor][0]} 0%, rgba(255, 255, 255, 0.8) 100%)`,
                  overflow: 'hidden',
                }}
              >
                <Group justify="space-between" align="center" mb="md">
                  <Stack gap={0}>
                    <Text fw={600} size="lg" style={{ color: `var(--mantine-color-${teamColor}-6)` }}>
                      {currentTeam.name}
                    </Text>
                    <Text>Score: {currentTeam.score}</Text>
                  </Stack>
                  
                  <Stack align="flex-end" gap={0}>
                    <Text fw={700} size="xl" ta="right" style={{ color: `var(--mantine-color-${getTimerColor()}-6)` }}>
                      {timeLeft}s
                    </Text>
                    <Progress 
                      value={timerPercentage} 
                      color={getTimerColor()} 
                      size="lg" 
                      radius="xl"
                      w={150}
                      striped={timeLeft <= 10}
                      animated={timeLeft <= 10}
                    />
                  </Stack>
                </Group>
              </Card>
              
              <div style={{ 
                position: 'relative', 
                margin: '10px 0 30px', 
                minHeight: rem(180),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '1 0 auto'
              }}>
                {showCorrectAnimation && (
                  <ThemeIcon 
                    size={100} 
                    radius={100} 
                    color="green" 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      opacity: 0.9,
                      animation: 'pulse 0.5s infinite alternate',
                    }}
                  >
                    <IconCircleCheck size={60} />
                  </ThemeIcon>
                )}
                
                <Transition 
                  mounted={wordTransition} 
                  transition={wordCardAnimation} 
                  duration={300}
                >
                  {(cardStyles) => (
                    <Card 
                      shadow="lg" 
                      padding="xl" 
                      radius="lg" 
                      
                      withBorder 
                      style={{ 
                        ...cardStyles,
                        textAlign: 'center',
                        fontSize: rem(36),
                        fontWeight: 700,
                        minHeight: rem(160),
                        paddingLeft: rem(20),
                        paddingRight: rem(20),
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${theme.colors[teamColor][0]} 0%, white 100%)`,
                        border: `2px solid ${theme.colors[teamColor][3]}`,
                        boxShadow: `0 8px 20px ${theme.colors[teamColor][1]}`,
                      }}
                    >
                      {currentWord.text}
                    </Card>
                  )}
                </Transition>
              </div>
              
              {/* Bottom section that sticks to bottom on mobile */}
              <div 
                style={{
                  marginTop: 'auto'
                }}
                className="gameplay-bottom"
              >
                {/* Last action card - always reserve space to prevent layout shift */}
                <div style={{ minHeight: rem(80), marginBottom: rem(16) }}>
                  {lastAction && (
                    <Card 
                      withBorder 
                      radius="md" 
                      p="md"
                      style={{
                        backgroundColor: lastAction.type === 'correct' 
                          ? theme.colors.teal[0]
                          : theme.colors.red[0],
                        borderColor: lastAction.type === 'correct' 
                          ? theme.colors.teal[3]
                          : theme.colors.red[3],
                        borderWidth: 2,
                      }}
                    >
                      <Group align="center" gap="md">
                        <ThemeIcon 
                          size={42} 
                          radius={100} 
                          color={lastAction.type === 'correct' ? 'teal' : 'red'}
                        >
                          {lastAction.type === 'correct' ? 
                            <IconCircleCheck size={24} /> : 
                            <IconPlayerSkipForward size={24} />
                          }
                        </ThemeIcon>
                        <Stack gap={0}>
                          <Text size="sm" c="dimmed">Last word:</Text>
                          <Text fw={600} size="lg" style={{ wordBreak: 'break-word' }}>{lastAction.word}</Text>
                          <Text size="xs" c="dimmed">
                            Marked as <b>{lastAction.type}</b>
                          </Text>
                        </Stack>
                      </Group>
                    </Card>
                  )}
                </div>
                
                <SimpleGrid cols={2} spacing="md" mb="md">
                  <Button 
                    variant="light" 
                    color="red" 
                    size="xl"
                    radius="md"
                    h={80}
                    onClick={() => handleWordResult('skipped')}
                    aria-label="Skip this word"
                    styles={{
                      root: {
                        borderWidth: 2,
                        borderColor: theme.colors.red[3],
                        ':hover': {
                          backgroundColor: theme.colors.red[0],
                        }
                      }
                    }}
                  >
                    <IconCircleX size={48} />
                  </Button>
                  
                  <Button 
                    variant="light" 
                    color="teal" 
                    size="xl"
                    radius="md"
                    h={80}
                    onClick={() => handleWordResult('correct')}
                    aria-label="Mark word as correct"
                    styles={{
                      root: {
                        borderWidth: 2,
                        borderColor: theme.colors.teal[3],
                        ':hover': {
                          backgroundColor: theme.colors.teal[0],
                        }
                      }
                    }}
                  >
                    <IconCircleCheck size={48} />
                  </Button>
                </SimpleGrid>
                
                <Divider my="md" />
                
                <Center mt="md">
                  <Button 
                    variant="light" 
                    color="red"
                    onClick={endRound}
                    leftSection={<IconClock size={18} />}
                    radius="md"
                  >
                    End Round Early
                  </Button>
                </Center>
              </div>
            </Container>
          </div>
        )}
      </Transition>
    );
  }

  return (
    <Container size="sm" py="md">
      <Card shadow="md" withBorder p="lg" radius="lg">
        <Stack align="center" gap="md">
          <ThemeIcon size={60} radius="xl" color="yellow">
            <IconAlertTriangle size={32} />
          </ThemeIcon>
          <Title order={2}>Unexpected game state</Title>
          <Text>Something unexpected happened with the game state.</Text>
          <Button 
            onClick={() => navigate('/')} 
            leftSection={<IconHome size={18} />}
            variant="light"
            size="md"
          >
            Return to Home
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}); 