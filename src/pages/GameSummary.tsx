import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Card,
  Button,
  Stack,
  Title,
  Text,
  Group,
  Paper,
  Badge,
  ThemeIcon,
  List,
  Box,
  Divider,
  RingProgress,
  Center,
  Container,
  useMantineTheme,
  SimpleGrid,
} from '@mantine/core';
import { 
  IconTrophy, 
  IconHome, 
  IconRefresh,
  IconConfetti,
  IconMedal, 
  IconChartBar,
  IconCircleCheck,
  IconPlayerSkipForward,
  IconListNumbers
} from '@tabler/icons-react';
import { useStores } from '../stores/RootStore';

export const GameSummary: React.FC = observer(() => {
  const { gameId } = useParams<{ gameId: string }>();
  const { gameStore } = useStores();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [showStats, setShowStats] = useState(false);
  const [animateWinner, setAnimateWinner] = useState(false);
  
  // Set the current game on component mount
  useEffect(() => {
    if (gameId) {
      gameStore.setCurrentGameId(gameId);
      
      // Delay showing stats for animation
      const statsTimer = setTimeout(() => {
        setShowStats(true);
      }, 600);
      
      // Start trophy animation
      const animationTimer = setTimeout(() => {
        setAnimateWinner(true);
      }, 300);
      
      return () => {
        clearTimeout(statsTimer);
        clearTimeout(animationTimer);
      };
    }
  }, [gameId, gameStore]);
  
  const game = gameStore.currentGame;
  
  // Handle case when game is not found
  if (!game) {
    return (
      <Container size="sm" py="md">
        <Card shadow="md" withBorder p="lg" radius="lg">
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" color="red">
              <IconHome size={32} />
            </ThemeIcon>
            <Title order={2}>Game not found</Title>
            <Text>The game you're looking for doesn't exist or has been removed.</Text>
            <Button 
              onClick={() => navigate('/')} 
              leftSection={<IconHome size={18} />}
              size="md"
              variant="light"
            >
              Return Home
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }
  
  // Sort teams by score (descending)
  const sortedTeams = [...game.teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];
  const isTie = sortedTeams.length > 1 && sortedTeams[0].score === sortedTeams[1].score;
  
  // Calculate game stats
  const totalWords = game.rounds.reduce((sum, round) => sum + round.words.length, 0);
  const correctWords = game.rounds.reduce((sum, round) => {
    return sum + round.words.filter(w => w.status === 'correct').length;
  }, 0);
  const skippedWords = game.rounds.reduce((sum, round) => {
    return sum + round.words.filter(w => w.status === 'skipped').length;
  }, 0);
  
  // Calculate success rate
  const successRate = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  
  // Start a new game
  const handleNewGame = () => {
    navigate('/setup');
  };

  return (
    <Container size="sm" py="md">
      <Card shadow="md" withBorder p={{ base: 'md', sm: 'lg' }} radius="lg">
        <Stack gap="xl">
          <Title order={2} ta="center" mb="md" style={{
            background: 'linear-gradient(45deg, #228be6 0%, #40c4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Game Results
          </Title>
          
          <Paper withBorder p="xl" radius="lg" bg={isTie ? 'gray.0' : 'blue.0'} style={{
            overflow: 'hidden',
            position: 'relative'
          }}>
            {!isTie && animateWinner && (
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at center, rgba(255, 217, 0, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
                  zIndex: 0,
                  animation: 'pulse 2s infinite ease-in-out'
                }}
              />
            )}
            
            <Stack align="center" gap="sm" style={{ position: 'relative', zIndex: 1 }}>
              {isTie ? (
                <>
                  <ThemeIcon size={80} radius={100} color="gray" style={{
                    transform: animateWinner ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.5s ease-in-out'
                  }}>
                    <IconConfetti size={50} />
                  </ThemeIcon>
                  <Title order={2} ta="center">It's a Tie!</Title>
                  <Group gap="xs">
                    {sortedTeams.filter(team => team.score === winner.score).map((team, i) => (
                      <Badge key={i} size="xl" variant="filled" radius="md" color="blue">
                        {team.name}
                      </Badge>
                    ))}
                  </Group>
                  <Text size="lg">Multiple teams tied with {winner.score} points!</Text>
                </>
              ) : (
                <>
                  <ThemeIcon 
                    size={90} 
                    radius={100} 
                    color="yellow" 
                    style={{
                      boxShadow: '0 0 30px rgba(255, 213, 0, 0.6)',
                      transform: animateWinner ? 'scale(1.1) rotate(10deg)' : 'scale(1) rotate(0deg)',
                      transition: 'transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out',
                    }}
                  >
                    <IconTrophy size={55} />
                  </ThemeIcon>
                  <Title order={2} ta="center" style={{ 
                    color: theme.colors.yellow[5],
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {winner.name} Wins!
                  </Title>
                  <Paper p="md" radius="md" withBorder shadow="sm" style={{ minWidth: '140px' }}>
                    <Stack align="center" gap={5}>
                      <Text size="sm" c="dimmed">Final Score</Text>
                      <Title order={1} style={{ color: theme.colors.blue[6] }}>{winner.score}</Title>
                      <Text size="xs" c="dimmed">points</Text>
                    </Stack>
                  </Paper>
                </>
              )}
            </Stack>
          </Paper>
          
          <Divider 
            label={<Group gap="xs"><IconListNumbers size={16} />Final Scores</Group>} 
            labelPosition="center" 
            size="md"
          />
          
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {sortedTeams.map((team, index) => (
              <Paper 
                key={index} 
                p="md" 
                radius="md" 
                withBorder 
                style={{
                  background: index === 0 && !isTie 
                    ? 'linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 255, 255, 0) 100%)' 
                    : undefined,
                  borderColor: index === 0 && !isTie ? theme.colors.yellow[5] : undefined,
                  borderWidth: index === 0 && !isTie ? '2px' : '1px',
                }}
              >
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Group wrap="nowrap" gap="md">
                    <ThemeIcon 
                      size={40} 
                      radius="xl" 
                      color={index === 0 ? 'yellow' : index === 1 ? 'gray' : index === 2 ? 'orange' : 'blue'}
                    >
                      {index === 0 ? (
                        <IconTrophy size={22} />
                      ) : (
                        <IconMedal size={22} />
                      )}
                    </ThemeIcon>
                    <div>
                      <Text fw={500} size="lg">{team.name}</Text>
                      <Text size="xs" c="dimmed">
                        Rank: {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
                      </Text>
                    </div>
                  </Group>
                  <Title order={2}>{team.score}</Title>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
          
          {showStats && (
            <>
              <Divider 
                label={<Group gap="xs"><IconChartBar size={16} />Game Statistics</Group>}
                labelPosition="center" 
                size="md"
              />
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                  <Stack align="center">
                    <Title order={4} mb="xs">Success Rate</Title>
                    <RingProgress
                      sections={[{ value: successRate, color: 'blue' }]}
                      label={
                        <Center>
                          <Text fw={700} size="xl" ta="center">
                            {successRate}%
                          </Text>
                        </Center>
                      }
                      size={160}
                      thickness={16}
                      roundCaps
                    />
                    <Group justify="space-between" mt="xs" style={{ width: '100%' }}>
                      <Group gap={5}>
                        <IconCircleCheck size={16} color={theme.colors.green[6]} />
                        <Text size="sm">Correct: {correctWords}</Text>
                      </Group>
                      <Group gap={5}>
                        <IconPlayerSkipForward size={16} color={theme.colors.gray[6]} />
                        <Text size="sm">Skipped: {skippedWords}</Text>
                      </Group>
                    </Group>
                  </Stack>
                </Paper>
                
                <Paper p="md" radius="md" withBorder style={{ height: '100%' }}>
                  <Stack>
                    <Title order={4} mb="xs">Game Overview</Title>
                    <List spacing="sm">
                      <List.Item icon={
                        <ThemeIcon color="blue" size={22} radius="xl">
                          <IconListNumbers size={14} />
                        </ThemeIcon>
                      }>
                        <Text>Rounds Played: <Text span fw={500}>{game.rounds.length}</Text></Text>
                      </List.Item>
                      <List.Item icon={
                        <ThemeIcon color="indigo" size={22} radius="xl">
                          <IconChartBar size={14} />
                        </ThemeIcon>
                      }>
                        <Text>Total Words: <Text span fw={500}>{totalWords}</Text></Text>
                      </List.Item>
                      <List.Item icon={
                        <ThemeIcon color="green" size={22} radius="xl">
                          <IconCircleCheck size={14} />
                        </ThemeIcon>
                      }>
                        <Text>
                          Correct Guesses: <Text span fw={500}>{correctWords}</Text>
                          <Text size="xs" c="dimmed" mt={3}>
                            Average {(correctWords / Math.max(1, game.rounds.length)).toFixed(1)} per round
                          </Text>
                        </Text>
                      </List.Item>
                      {game.losePointOnSkip && (
                        <List.Item icon={
                          <ThemeIcon color="red" size={22} radius="xl">
                            <IconPlayerSkipForward size={14} />
                          </ThemeIcon>
                        }>
                          <Text>
                            Points Lost on Skips: <Text span fw={500}>{skippedWords}</Text>
                          </Text>
                        </List.Item>
                      )}
                    </List>
                  </Stack>
                </Paper>
              </SimpleGrid>
            </>
          )}
          
          <Group justify="center" mt="md">
            <Button
              leftSection={<IconHome size={20} />}
              variant="light"
              onClick={() => navigate('/')}
              radius="md"
              size="md"
            >
              Home
            </Button>
            
            <Button
              leftSection={<IconRefresh size={20} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              onClick={handleNewGame}
              radius="md"
              size="md"
              style={{
                boxShadow: '0 4px 14px rgba(34, 139, 230, 0.25)',
              }}
            >
              New Game
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}); 