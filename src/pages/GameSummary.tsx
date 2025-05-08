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
  Table,
  Paper,
  Badge,
  ThemeIcon,
  List,
  Flex,
  Box,
  Divider,
  RingProgress,
  Center,
} from '@mantine/core';
import { IconTrophy, IconHome, IconRefresh } from '@tabler/icons-react';
import { useStores } from '../stores/RootStore';

export const GameSummary: React.FC = observer(() => {
  const { gameId } = useParams<{ gameId: string }>();
  const { gameStore } = useStores();
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);
  
  // Set the current game on component mount
  useEffect(() => {
    if (gameId) {
      gameStore.setCurrentGameId(gameId);
      
      // Delay showing stats for animation
      const timer = setTimeout(() => {
        setShowStats(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [gameId, gameStore]);
  
  const game = gameStore.currentGame;
  
  // Handle case when game is not found
  if (!game) {
    return (
      <Card shadow="md" withBorder p="lg">
        <Text color="red">Game not found</Text>
        <Button onClick={() => navigate('/')} mt="md">Return Home</Button>
      </Card>
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
    <Card shadow="md" withBorder p="lg">
      <Stack gap="xl">
        <Title order={2} ta="center">Game Results</Title>
        
        <Paper withBorder p="xl" radius="md" bg="blue.0">
          <Stack align="center" gap="sm">
            {isTie ? (
              <>
                <Title order={2} ta="center">It's a Tie!</Title>
                <Group gap="xs">
                  {sortedTeams.filter(team => team.score === winner.score).map((team, i) => (
                    <Badge key={i} size="xl" variant="filled" color="blue">
                      {team.name}
                    </Badge>
                  ))}
                </Group>
                <Text>Multiple teams tied with {winner.score} points!</Text>
              </>
            ) : (
              <>
                <ThemeIcon size={80} radius={100} color="yellow">
                  <IconTrophy size={50} />
                </ThemeIcon>
                <Title order={2} ta="center">{winner.name} Wins!</Title>
                <Text size="xl" fw={500}>Score: {winner.score} points</Text>
              </>
            )}
          </Stack>
        </Paper>
        
        <Divider label="Final Scores" labelPosition="center" />
        
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rank</Table.Th>
              <Table.Th>Team</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Score</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedTeams.map((team, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  {index === 0 ? (
                    <Badge color="yellow">1st</Badge>
                  ) : index === 1 ? (
                    <Badge color="gray">2nd</Badge>
                  ) : index === 2 ? (
                    <Badge color="orange">3rd</Badge>
                  ) : (
                    <Badge color="blue">{index + 1}th</Badge>
                  )}
                </Table.Td>
                <Table.Td>{team.name}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>{team.score}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        
        {showStats && (
          <>
            <Divider label="Game Statistics" labelPosition="center" />
            
            <Flex justify="space-around" align="center" wrap="wrap" gap="md">
              <Box>
                <Center>
                  <RingProgress
                    sections={[{ value: successRate, color: 'blue' }]}
                    label={
                      <Text ta="center">
                        <Text fw={700} size="xl">{successRate}%</Text>
                        <Text size="xs">Success Rate</Text>
                      </Text>
                    }
                    size={120}
                  />
                </Center>
              </Box>
              
              <Stack>
                <List spacing="xs" center icon={<ThemeIcon color="blue" size={20} radius="xl" />}>
                  <List.Item>Rounds Played: {game.rounds.length}</List.Item>
                  <List.Item>Total Words: {totalWords}</List.Item>
                  <List.Item>Correct Guesses: {correctWords}</List.Item>
                  <List.Item>Skipped Words: {skippedWords}</List.Item>
                </List>
              </Stack>
            </Flex>
          </>
        )}
        
        <Group mt="md" justify="center">
          <Button
            leftSection={<IconHome size={20} />}
            variant="light"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          
          <Button
            leftSection={<IconRefresh size={20} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={handleNewGame}
          >
            New Game
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}); 