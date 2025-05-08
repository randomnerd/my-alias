import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  List, 
  Grid, 
  Paper, 
  Stack,
  Group,
  ThemeIcon,
  Transition,
} from '@mantine/core';
import { IconVocabulary, IconUsers, IconClock } from '@tabler/icons-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loadedItems, setLoadedItems] = useState<boolean[]>([false, false, false]);
  const [loadedFeatures, setLoadedFeatures] = useState<boolean[]>([false, false, false]);

  // Sequential animation for the sections
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Stagger the animations for each section
    loadedItems.forEach((_, index) => {
      const timer = setTimeout(() => {
        setLoadedItems(current => {
          const updated = [...current];
          updated[index] = true;
          return updated;
        });
      }, 200 + (index * 200)); // Stagger by 200ms
      
      timers.push(timer);
    });

    // Features appear after all sections are loaded
    const featuresTimer = setTimeout(() => {
      // Stagger the animations for each feature
      loadedFeatures.forEach((_, index) => {
        const timer = setTimeout(() => {
          setLoadedFeatures(current => {
            const updated = [...current];
            updated[index] = true;
            return updated;
          });
        }, 800 + (index * 100)); // Stagger by 100ms
        
        timers.push(timer);
      });
    }, 800);
    
    timers.push(featuresTimer);
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [loadedItems, loadedFeatures]);

  return (
    <Container size="xs" py="md">
      <Transition mounted={loadedItems[0]} transition="fade" duration={400}>
        {(styles) => (
          <Card shadow="sm" padding="md" radius="md" withBorder mb="md" style={styles}>
            <Stack gap="md">
              <Title order={2} ta="center">Welcome to Alias</Title>
              <Text ta="center" size="lg" c="dimmed">
                Alias is a word-guessing game where players explain words to teammates without using the word itself. Perfect for gatherings with friends, family, or colleagues.
              </Text>
              
              <Group justify="center" mt="md">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/setup')}
                  variant="gradient" 
                  gradient={{ from: 'blue', to: 'cyan' }}
                >
                  Start New Game
                </Button>
              </Group>
            </Stack>
          </Card>
        )}
      </Transition>
      
      <Transition mounted={loadedItems[1]} transition="fade" duration={400}>
        {(styles) => (
          <Card shadow="sm" padding="md" radius="md" withBorder mb="md" style={styles}>
            <Title order={3} mb="md">Game Rules</Title>
            
            <List spacing="sm" size="md" mb="md">
              <List.Item>Players are organized into teams</List.Item>
              <List.Item>Each round, one player explains words to teammates</List.Item>
              <List.Item>Teams gain points for correctly guessed words</List.Item>
              <List.Item>Teams lose points for skipped words <b>(optional setting)</b></List.Item>
              <List.Item>Rounds are timed</List.Item>
              <List.Item>The game continues until a team reaches the score limit</List.Item>
              <List.Item>When a team reaches the score limit, all teams finish the current round</List.Item>
              <List.Item>The team with the highest score at the end of that round wins</List.Item>
            </List>
          </Card>
        )}
      </Transition>
      
      <Transition mounted={loadedItems[2]} transition="fade" duration={400}>
        {(styles) => (
          <Card shadow="sm" padding="md" radius="md" withBorder style={styles}>
            <Title order={3} mb="md" ta="center">Why Play Alias?</Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Transition mounted={loadedFeatures[0]} transition="slide-up" duration={400}>
                  {(cardStyles) => (
                    <Paper p="md" radius="md" withBorder style={cardStyles}>
                      <Stack align="center" gap="sm">
                        <ThemeIcon size={48} radius="xl" color="blue">
                          <IconVocabulary size={24} />
                        </ThemeIcon>
                        <Title order={4}>Improve Vocabulary</Title>
                        <Text ta="center" c="dimmed">Enhance your language skills by finding creative ways to describe words</Text>
                      </Stack>
                    </Paper>
                  )}
                </Transition>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Transition mounted={loadedFeatures[1]} transition="slide-up" duration={400}>
                  {(cardStyles) => (
                    <Paper p="md" radius="md" withBorder style={cardStyles}>
                      <Stack align="center" gap="sm">
                        <ThemeIcon size={48} radius="xl" color="cyan">
                          <IconUsers size={24} />
                        </ThemeIcon>
                        <Title order={4}>Perfect for Groups</Title>
                        <Text ta="center" c="dimmed">Designed for friends, family gatherings, or team-building events</Text>
                      </Stack>
                    </Paper>
                  )}
                </Transition>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Transition mounted={loadedFeatures[2]} transition="slide-up" duration={400}>
                  {(cardStyles) => (
                    <Paper p="md" radius="md" withBorder style={cardStyles}>
                      <Stack align="center" gap="sm">
                        <ThemeIcon size={48} radius="xl" color="indigo">
                          <IconClock size={24} />
                        </ThemeIcon>
                        <Title order={4}>Quick Rounds</Title>
                        <Text ta="center" c="dimmed">Fast-paced gameplay keeps everyone engaged and entertained</Text>
                      </Stack>
                    </Paper>
                  )}
                </Transition>
              </Grid.Col>
            </Grid>
          </Card>
        )}
      </Transition>
    </Container>
  );
}; 