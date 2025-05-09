import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/RootStore';
import { 
  Title, 
  Text, 
  Button, 
  TextInput, 
  SimpleGrid, 
  Slider, 
  Stack,
  Group,
  Select,
  Switch,
  ThemeIcon,
  Paper,
  Divider,
  Box,
  rem,
  useMantineTheme
} from '@mantine/core';
import { IconUsers, IconClock, IconTarget, IconAdjustments, IconArrowLeft, IconCirclePlus, IconCircleMinus, IconPlayerPlay } from '@tabler/icons-react';

// Define a more specific type for error handling
interface SetupError {
  message: string;
  field?: string;
}

export const GameSetup: React.FC = observer(() => {
  const navigate = useNavigate();
  const { gameStore } = useStores();
  const theme = useMantineTheme();
  
  // Team names state management
  const [teamNames, setTeamNames] = useState<string[]>(['Team 1', 'Team 2']);
  
  // Game settings state management
  const [roundTime, setRoundTime] = useState<number>(60);
  const [scoreLimit, setScoreLimit] = useState<number>(20);
  const [losePointOnSkip, setLosePointOnSkip] = useState<boolean>(true);
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
      
      // Check for minimum number of teams
      if (trimmedTeamNames.length < 2) {
        throw { message: 'At least 2 teams are required', field: 'teamNames' };
      }

      // Check for empty team names
      if (trimmedTeamNames.some(name => name === '')) {
        throw { message: 'All teams must have names', field: 'teamNames' };
      }
      
      // Check for duplicate team names
      const uniqueNames = new Set(trimmedTeamNames);
      if (uniqueNames.size !== trimmedTeamNames.length) {
        throw { message: 'Team names must be unique', field: 'teamNames' };
      }

      // Validate round time range
      if (roundTime < 15 || roundTime > 180) {
        throw { message: 'Round time must be between 15 and 180 seconds', field: 'roundTime' };
      }

      // Validate score limit
      if (scoreLimit < 1) {
        throw { message: 'Score limit must be at least 10', field: 'scoreLimit' };
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
        <form onSubmit={handleSubmit}>
          <Stack gap="xl">
            <Title order={2} ta="center" mt="lg">Game Setup</Title>
            
            <Paper withBorder p="md" radius="md" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' }}>
              <Stack gap="md">
                <Group wrap="nowrap" gap="md">
                  <ThemeIcon size={42} radius="md" color="blue">
                    <IconUsers size={24} />
                  </ThemeIcon>
                  <div>
                    <Title order={4}>Teams</Title>
                    <Text size="sm" c="dimmed">
                      Add at least 2 teams. Each team will take turns explaining words.
                    </Text>
                  </div>
                </Group>
                
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  {teamNames.map((teamName, index) => (
                    <Group key={index} style={{ alignItems: 'center' }}>
                      <TextInput
                        value={teamName}
                        onChange={(e) => handleTeamNameChange(index, e.target.value)}
                        placeholder={`Team ${index + 1}`}
                        required
                        style={{ flexGrow: 1 }}
                        size="md"
                        radius="md"
                      />
                      {teamNames.length > 2 && (
                        <Button 
                          variant="light" 
                          color="red" 
                          onClick={() => handleRemoveTeam(index)}
                          size="md"
                          radius="xl"
                          p={0}
                          style={{ width: rem(36), height: rem(36) }}
                        >
                          <IconCircleMinus size={20} />
                        </Button>
                      )}
                    </Group>
                  ))}
                </SimpleGrid>
                
                {teamNames.length < 6 && (
                  <Button 
                    variant="light" 
                    color="blue"
                    onClick={handleAddTeam}
                    size="md"
                    leftSection={<IconCirclePlus size={20} />}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Add Team
                  </Button>
                )}
              </Stack>
            </Paper>
            
            <Divider label="Game Settings" labelPosition="center" />
            
            <Paper withBorder p="md" radius="md" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' }}>
              <Stack gap="lg">
                <Group wrap="nowrap" gap="md">
                  <ThemeIcon size={42} radius="md" color="cyan">
                    <IconClock size={24} />
                  </ThemeIcon>
                  
                  <Stack gap={5}>
                    <Title order={4}>Round Time: {roundTime} seconds</Title>
                    <Text size="sm" c="dimmed">How long each team has to guess words</Text>
                    
                    <Slider
                      min={15}
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
                      styles={{
                        mark: { width: rem(6), height: rem(6) },
                        markLabel: { fontSize: rem(12) },
                        thumb: { 
                          height: rem(20), 
                          width: rem(20),
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      mt="sm"
                    />
                  </Stack>
                </Group>
                
                <Group wrap="nowrap" gap="md">
                  <ThemeIcon size={42} radius="md" color="indigo">
                    <IconTarget size={24} />
                  </ThemeIcon>
                  
                  <Stack gap={5}>
                    <Title order={4}>Score Limit: {scoreLimit} points</Title>
                    <Text size="sm" c="dimmed">Game ends when a team reaches this score</Text>
                    
                    <Slider
                      min={5}
                      max={50}
                      step={5}
                      value={scoreLimit}
                      onChange={setScoreLimit}
                      marks={[
                        { value: 10, label: '10' },
                        { value: 20, label: '20' },
                        { value: 35, label: '35' },
                        { value: 50, label: '50' },
                      ]}
                      styles={{
                        mark: { width: rem(6), height: rem(6) },
                        markLabel: { fontSize: rem(12) },
                        thumb: { 
                          height: rem(20), 
                          width: rem(20),
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      mt="sm"
                    />
                  </Stack>
                </Group>
                
                <Group wrap="nowrap" gap="md">
                  <ThemeIcon size={42} radius="md" color="grape">
                    <IconAdjustments size={24} />
                  </ThemeIcon>
                  
                  <div style={{ flex: 1 }}>
                    <Title order={4}>Difficulty</Title>
                    <Text size="sm" c="dimmed" mb="xs">Choose the difficulty level of words</Text>
                    
                    <Select
                      data={[
                        { value: 'easy', label: 'Easy - Common everyday words' },
                        { value: 'medium', label: 'Medium - Moderate difficulty' },
                        { value: 'hard', label: 'Hard - Challenging words' },
                        { value: 'mixed', label: 'Mixed - Variety of difficulty levels' },
                      ]}
                      value={difficulty}
                      onChange={(value) => setDifficulty(value || 'mixed')}
                      size="md"
                      radius="md"
                    />
                  </div>
                </Group>
                
                <Box p="md" style={{ background: 'rgba(250, 250, 250, 0.7)', borderRadius: theme.radius.md }}>
                  <Switch
                    label="Lose point on skipping a word"
                    description="Teams will lose one point each time they skip a word"
                    checked={losePointOnSkip}
                    onChange={(e) => setLosePointOnSkip(e.currentTarget.checked)}
                    size="md"
                    radius="xl"
                    styles={{
                      thumb: { 
                        borderWidth: 2,
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
            
            <Group justify="space-between" mt="md">
              <Button 
                variant="light" 
                onClick={() => navigate('/')}
                leftSection={<IconArrowLeft size={18} />}
                size="lg"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                size="lg"
                rightSection={<IconPlayerPlay size={18} />}
                radius="md"
                style={{
                  boxShadow: '0 4px 14px rgba(34, 139, 230, 0.25)',
                }}
              >
                Start
              </Button>
            </Group>
          </Stack>
        </form>
  );
}); 