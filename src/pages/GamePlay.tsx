import React, { useState, useEffect, useCallback } from 'react';
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
  Grid,
  Paper,
  Progress,
  Badge,
  Box,
  Loader,
  Center,
  Alert,
  Flex,
  rem,
  Table,
  Transition
} from '@mantine/core';
import { 
  IconAlertTriangle, 
  IconPlayerPlay, 
  IconCheck, 
  IconPlayerSkipForward,
  IconHome,
} from '@tabler/icons-react';

interface GamePlayParams {
  gameId: string;
}

interface TeamType {
  name: string;
  score: number;
}

// Define custom card animation
const wordCardAnimation = {
  in: { opacity: 1, transform: 'translateY(0)' },
  out: { opacity: 0, transform: 'translateY(-20px)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};

// Define page transition animation
const pageTransition = {
  in: { opacity: 1, transform: 'scale(1)' },
  out: { opacity: 0, transform: 'scale(0.98)' },
  common: { transformOrigin: 'center' },
  transitionProperty: 'transform, opacity',
};

export const GamePlay: React.FC = observer(() => {
  const { gameId } = useParams<keyof GamePlayParams>() as GamePlayParams;
  const navigate = useNavigate();
  const { gameStore } = useStores();
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [roundStarted, setRoundStarted] = useState(false);
  const [lastAction, setLastAction] = useState<{type: 'correct' | 'skipped', word: string} | null>(null);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [wordTransition, setWordTransition] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
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
  const getTeamColor = (index: number) => {
    const colors = ['blue', 'teal', 'grape', 'orange', 'pink'];
    return colors[index % colors.length];
  };

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
  const startRound = async () => {
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
      if (error instanceof Error) {
        console.error('Error starting round:', error);
        alert(`Failed to start round: ${error.message}`);
      } else {
        console.error('Error starting round:', error);
        alert('Failed to start round: Unknown error');
      }
    }
  };

  // Handle word result (correct or skip)
  const handleWordResult = async (status: 'correct' | 'skipped') => {
    if (!game || !roundStarted) return;
    
    const currentWord = game.rounds[game.currentRound]?.words[currentWordIndex];
    if (currentWord) {
      setLastAction({ type: status, word: currentWord.text });
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
      }, 200);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error marking word as ${status}:`, error);
        alert(`Failed to update word status: ${error.message}`);
      } else {
        console.error(`Error marking word as ${status}:`, error);
        alert('Failed to update word status: Unknown error');
      }
      setWordTransition(true); // Ensure the word is visible in case of error
    }
  };

  // Handle toggling word status in round summary
  const toggleWordStatus = async (wordIndex: number, currentStatus: 'correct' | 'skipped') => {
    if (!game) return;
    
    const newStatus = currentStatus === 'correct' ? 'skipped' : 'correct';
    try {
      gameStore.updateWordStatusInRound(game.currentRound, wordIndex, newStatus);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error toggling word status:', error);
        alert(`Failed to update word status: ${error.message}`);
      } else {
        console.error('Error toggling word status:', error);
        alert('Failed to update word status: Unknown error');
      }
    }
  };

  const getTimerColor = (): string => {
    if (timeLeft <= 10) return 'red';
    if (timeLeft <= 30) return 'orange';
    return 'blue';
  };

  if (isLoading) {
    return (
      <Container size="xs" py="md">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" gap="md">
            <Loader size="xl" />
            <Text>Loading game...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container size="xs" py="md">
        <Alert 
          icon={<IconAlertTriangle size={24} />} 
          title="Game not found"
          color="red"
          radius="md"
        >
          <Text mb="md">The game you're looking for doesn't exist or has been removed.</Text>
          <Button onClick={() => navigate('/')} leftSection={<IconHome size={18} />}>
            Return to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  // Display score limit at the top of the gameplay screen
  const ScoreLimitBanner = () => (
    <Box mb="md" style={{ textAlign: 'center' }}>
      <Badge color="grape" size="lg" radius="sm" variant="filled">
        Score Limit: {game.scoreLimit} points
      </Badge>
      {game.scoreLimitReached && (
        <Box mt="xs">
          <Badge color="yellow" size="lg" radius="sm" variant="filled">
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
        <Stack>
          <Title order={3} ta="center">Round Summary</Title>
          
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between">
              <Text fw={500} size="lg" style={{ color: `var(--mantine-color-${teamColor}-6)` }}>
                {currentTeam.name}
              </Text>
              <Text fw={700} size="lg">
                Score: {currentTeam.score}
              </Text>
            </Group>
          </Paper>
          
          <div>
            <Text ta="center" size="sm" c="dimmed" mb="xs">
              Click on a word's status to toggle between correct and skipped
            </Text>
            
            {game.losePointOnSkip && (
              <Alert color="yellow" radius="md" mb="md">
                <Text size="sm">
                  <b>Scoring changes:</b>
                </Text>
                <Text size="sm" mt="xs">
                  • Changing from <b>correct → skipped</b> will deduct 2 points (1 for removing the correct guess + 1 penalty point)
                </Text>
                <Text size="sm" mt="xs">
                  • Changing from <b>skipped → correct</b> will add 2 points (1 for the correct guess + returning 1 penalty point)
                </Text>
              </Alert>
            )}
          </div>
          
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Word</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredWords.map((word, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{word.text}</Table.Td>
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Button
                      size="sm"
                      color={word.status === 'correct' ? 'green' : 'gray'}
                      variant={word.status === 'correct' ? 'filled' : 'light'}
                      leftSection={
                        word.status === 'correct' 
                          ? <IconCheck size={16} /> 
                          : <IconPlayerSkipForward size={16} />
                      }
                      onClick={() => toggleWordStatus(index, word.status as 'correct' | 'skipped')}
                    >
                      {word.status === 'correct' ? 'Correct' : 'Skipped'}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          
          <Group justify="center" mt="md">
            <Button 
              variant="gradient" 
              gradient={{ from: 'blue', to: 'cyan' }}
              onClick={() => setShowRoundSummary(false)}
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
    
    return (
      <Transition mounted={true} transition={pageTransition} duration={300}>
        {(styles) => (
          <Container size="xs" py="md" style={styles}>
            <ScoreLimitBanner />
            <Grid mb="md">
              {game.teams.map((team: TeamType, index: number) => (
                <Grid.Col key={index} span={{ base: 6, md: 3 }}>
                  <Paper p="md" radius="md" withBorder>
                    <Stack align="center" gap="xs">
                      <Text fw={500} size="lg" style={{ color: `var(--mantine-color-${getTeamColor(index)}-6)` }}>
                        {team.name}
                      </Text>
                      <Title order={2}>{team.score}</Title>
                    </Stack>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>

            <Card shadow="md" padding="md" radius="lg" withBorder>
              <Stack align="center" gap="lg">
                <Box 
                  style={{ 
                    fontSize: rem(48),
                    marginBottom: rem(10) 
                  }}
                >
                  {isFirstRound ? '🎮' : '🔄'}
                </Box>
                
                <Title order={2} ta="center">
                  {isFirstRound ? 'Game Ready!' : 'Round Ended'}
                </Title>
                
                <Paper p="md" radius="md" withBorder w="100%">
                  <Flex justify="space-between" align="center">
                    <Text size="lg" fw={500}>
                      {isFirstRound ? 'First Team:' : 'Next Team:'}
                    </Text>
                    <Badge size="xl" color={getTeamColor(currentTeam)} variant="filled" radius="sm">
                      {teamName}
                    </Badge>
                  </Flex>
                </Paper>
                
                <Box>
                  <Text ta="center" mb="xs">
                    Get ready! The player who will explain the words should take the device.
                  </Text>
                  <Text ta="center" mb="xs">
                    You will have <Text span fw={700}>{game.roundTime} seconds</Text> to explain as many words as possible.
                  </Text>
                  <Text ta="center" fw={700} c="red">
                    Remember: don't use the word itself or its parts!
                  </Text>
                </Box>
                
                <Group justify="space-between" w="100%" mt="md">
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Exit Game
                  </Button>
                  {!isFirstRound && (
                    <Button
                      variant="outline"
                      color="teal"
                      onClick={() => setShowRoundSummary(true)}
                    >
                      Review Last Round
                    </Button>
                  )}
                  <Button 
                    variant="gradient" 
                    gradient={{ from: 'blue', to: 'cyan' }}
                    size="lg" 
                    onClick={startRound}
                    rightSection={<IconPlayerPlay size={18} />}
                  >
                    {isFirstRound ? 'Start Game' : 'Start Round'}
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
          <Container size="xs" py="md" style={styles}>
            <ScoreLimitBanner />
            <Grid mb="md">
              {game.teams.map((team: TeamType, index: number) => (
                <Grid.Col key={index} span={{ base: 6, md: 3 }}>
                  <Paper p="md" radius="md" withBorder>
                    <Stack align="center" gap="xs">
                      <Text fw={500} size="lg" style={{ color: `var(--mantine-color-${getTeamColor(index)}-6)` }}>
                        {team.name}
                      </Text>
                      <Title order={2}>{team.score}</Title>
                    </Stack>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
            
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
            <Container size="xs" py="md" style={styles}>
              <Card shadow="md" padding="md" radius="lg" withBorder>
                <Stack align="center" gap="lg">
                  <Box style={{ fontSize: rem(48) }}>🎯</Box>
                  <Title order={2}>Get Ready!</Title>
                  <Title order={3} c={teamColor}>It's {currentTeam.name}'s turn</Title>
                  <Button 
                    size="xl" 
                    variant="gradient" 
                    gradient={{ from: teamColor, to: 'cyan' }}
                    rightSection={<IconPlayerPlay size={24} />}
                    onClick={startRound}
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
          <Container size="xs" py="md" style={styles}>
            <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
              <Group justify="space-between" mb="md">
                <Stack gap={0}>
                  <Text fw={500} size="lg" style={{ color: `var(--mantine-color-${teamColor}-6)` }}>
                    {currentTeam.name}
                  </Text>
                  <Text>Score: {currentTeam.score}</Text>
                </Stack>
                
                <Box>
                  <Text fw={700} size="xl" ta="right" mb={5} 
                    style={{ color: `var(--mantine-color-${getTimerColor()}-6)` }}
                  >
                    {timeLeft}s
                  </Text>
                  <Progress 
                    value={(timeLeft / game.roundTime) * 100} 
                    color={getTimerColor()} 
                    size="lg" 
                    radius="xl"
                    w={150}
                  />
                </Box>
              </Group>
            </Card>
            
            <Transition 
              mounted={wordTransition} 
              transition={wordCardAnimation} 
              duration={300}
            >
              {(cardStyles) => (
                <Card 
                  shadow="md" 
                  padding="md" 
                  radius="md" 
                  withBorder 
                  mb="md"
                  style={{ 
                    ...cardStyles,
                    textAlign: 'center',
                    fontSize: rem(32),
                    fontWeight: 700,
                    minHeight: rem(120),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `var(--mantine-color-${teamColor}-0)`
                  }}
                >
                  {currentWord.text}
                </Card>
              )}
            </Transition>
            
            <Group gap="md" grow>
              <Button 
                variant="outline" 
                color="red" 
                size="lg"
                leftSection={<IconPlayerSkipForward size={20} />}
                onClick={() => handleWordResult('skipped')}
              >
                Skip
              </Button>
              
              <Button 
                variant="outline" 
                color="teal" 
                size="lg"
                leftSection={<IconCheck size={20} />}
                onClick={() => handleWordResult('correct')}
              >
                Correct
              </Button>
            </Group>
            
            {lastAction && (
              <Card 
                withBorder 
                radius="md" 
                mt="md" 
                p="sm"
                style={{
                  backgroundColor: lastAction.type === 'correct' 
                    ? 'var(--mantine-color-teal-0)' 
                    : 'var(--mantine-color-red-0)'
                }}
              >
                <Group>
                  <Box 
                    style={{ 
                      backgroundColor: lastAction.type === 'correct' ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-red-6)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {lastAction.type === 'correct' ? <IconCheck size={18} /> : <IconPlayerSkipForward size={18} />}
                  </Box>
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">Last word:</Text>
                    <Text fw={500}>{lastAction.word}</Text>
                  </Stack>
                </Group>
              </Card>
            )}
            
            <Center mt="lg">
              <Button 
                variant="outline" 
                color="red"
                onClick={endRound}
              >
                End Round Early
              </Button>
            </Center>
          </Container>
        )}
      </Transition>
    );
  }

  return (
    <Container size="xs" py="md">
      <Alert 
        icon={<IconAlertTriangle size={24} />} 
        title="Unexpected game state"
        color="yellow"
      >
        <Text mb="md">Something unexpected happened with the game state.</Text>
        <Button onClick={() => navigate('/')} leftSection={<IconHome size={18} />}>
          Return to Home
        </Button>
      </Alert>
    </Container>
  );
}); 