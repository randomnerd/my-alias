import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/RootStore';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  TextInput, 
  SimpleGrid, 
  Slider, 
  Stack,
  Group,
  Select,
  Switch,
} from '@mantine/core';

// Define a more specific type for error handling
interface SetupError {
  message: string;
  field?: string;
}

export const GameSetup: React.FC = observer(() => {
  const navigate = useNavigate();
  const { gameStore } = useStores();
  
  // Team names state management
  const [teamNames, setTeamNames] = useState<string[]>(['Team 1', 'Team 2']);
  
  // Game settings state management
  const [roundTime, setRoundTime] = useState<number>(60);
  const [scoreLimit, setScoreLimit] = useState<number>(20);
  const [losePointOnSkip, setLosePointOnSkip] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>('mixed');
  
  // Add team button handler
  const handleAddTeam = () => {
    if (teamNames.length < 6) {
      setTeamNames([...teamNames, `Team ${teamNames.length + 1}`]);
    }
  };
  
  // Remove team button handler
  const handleRemoveTeam = (index: number) => {
    if (teamNames.length > 2) {
      const updatedTeams = [...teamNames];
      updatedTeams.splice(index, 1);
      setTeamNames(updatedTeams);
    }
  };
  
  // Team name change handler
  const handleTeamNameChange = (index: number, value: string) => {
    const updatedTeams = [...teamNames];
    updatedTeams[index] = value;
    setTeamNames(updatedTeams);
  };
  
  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const trimmedTeamNames = teamNames.map(name => name.trim());
      
      // Check for empty team names
      if (trimmedTeamNames.some(name => name === '')) {
        throw { message: 'All teams must have names', field: 'teamNames' };
      }
      
      // Check for duplicate team names
      const uniqueNames = new Set(trimmedTeamNames);
      if (uniqueNames.size !== trimmedTeamNames.length) {
        throw { message: 'Team names must be unique', field: 'teamNames' };
      }
      
      // Create the game
      const gameId = await gameStore.createGame({
        teamNames: trimmedTeamNames,
        roundTime,
        difficulty: difficulty as 'easy' | 'medium' | 'hard' | 'mixed',
        scoreLimit,
        losePointOnSkip
      });
      
      // Navigate to the game play screen
      navigate(`/play/${gameId}`);
    } catch (error: unknown) {
      // Properly handle errors with type checking
      if (error instanceof Error) {
        alert(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        // Handle our custom error type
        alert((error as SetupError).message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };
  
  return (
    <Container size="sm" py="md">
      <Card shadow="md" padding="md" radius="md" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Title order={2} ta="center">Game Setup</Title>
            
            <Stack gap="xs">
              <Title order={4}>Teams</Title>
              <Text size="sm" c="dimmed" mb="xs">
                Add at least 2 teams. Each team will take turns explaining words.
              </Text>
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {teamNames.map((teamName, index) => (
                  <Group key={index} justify="space-between">
                    <TextInput
                      value={teamName}
                      onChange={(e) => handleTeamNameChange(index, e.target.value)}
                      placeholder={`Team ${index + 1}`}
                      required
                      style={{ flexGrow: 1 }}
                    />
                    {teamNames.length > 2 && (
                      <Button 
                        variant="subtle" 
                        color="red" 
                        onClick={() => handleRemoveTeam(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </Group>
                ))}
              </SimpleGrid>
              
              {teamNames.length < 6 && (
                <Button 
                  variant="light" 
                  onClick={handleAddTeam}
                  mb="md"
                >
                  Add Team
                </Button>
              )}
            </Stack>
            
            <Stack gap="xs">
              <Title order={4}>Game Settings</Title>
              
              <Text size="sm" fw={500}>Round Time: {roundTime} seconds</Text>
              <Slider
                min={30}
                max={180}
                step={15}
                value={roundTime}
                onChange={setRoundTime}
                marks={[
                  { value: 30, label: '30s' },
                  { value: 60, label: '1m' },
                  { value: 120, label: '2m' },
                  { value: 180, label: '3m' },
                ]}
                mb="md"
              />
              
              <Text size="sm" fw={500}>Score Limit: {scoreLimit} points</Text>
              <Slider
                min={5}
                max={50}
                step={5}
                value={scoreLimit}
                onChange={setScoreLimit}
                marks={[
                  { value: 5, label: '5' },
                  { value: 20, label: '20' },
                  { value: 35, label: '35' },
                  { value: 50, label: '50' },
                ]}
                mb="md"
              />
              
              <Text size="sm" fw={500}>Difficulty</Text>
              <Select
                data={[
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'hard', label: 'Hard' },
                  { value: 'mixed', label: 'Mixed' },
                ]}
                value={difficulty}
                onChange={(value) => setDifficulty(value || 'mixed')}
                mb="md"
              />
              
              <Switch
                label="Lose point on skipping a word"
                checked={losePointOnSkip}
                onChange={(e) => setLosePointOnSkip(e.currentTarget.checked)}
                mb="xl"
              />
            </Stack>
            
            <Group justify="space-between">
              <Button variant="light" onClick={() => navigate('/')}>
                Back
              </Button>
              <Button type="submit" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                Start Game
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}); 