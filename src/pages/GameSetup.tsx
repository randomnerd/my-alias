import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(['setup', 'common']);
  const theme = useMantineTheme();
  
  // Team names state management
  const [teamNames, setTeamNames] = useState<string[]>([
    t('setup:teams.placeholder', { number: 1 }),
    t('setup:teams.placeholder', { number: 2 })
  ]);
  
  // Game settings state management
  const [roundTime, setRoundTime] = useState<number>(60);
  const [scoreLimit, setScoreLimit] = useState<number>(20);
  const [losePointOnSkip, setLosePointOnSkip] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<string>('mixed');
  
  // Add team button handler
  const handleAddTeam = () => {
    if (teamNames.length < 6) {
      setTeamNames([...teamNames, t('setup:teams.placeholder', { number: teamNames.length + 1 })]);
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
        throw { message: t('setup:validation.minTeams'), field: 'teamNames' };
      }

      // Check for empty team names
      if (trimmedTeamNames.some(name => name === '')) {
        throw { message: t('setup:validation.emptyTeamNames'), field: 'teamNames' };
      }
      
      // Check for duplicate team names
      const uniqueNames = new Set(trimmedTeamNames);
      if (uniqueNames.size !== trimmedTeamNames.length) {
        throw { message: t('setup:validation.duplicateTeamNames'), field: 'teamNames' };
      }

      // Validate round time range
      if (roundTime < 30 || roundTime > 300) {
        throw { message: t('setup:validation.invalidRoundTime'), field: 'roundTime' };
      }

      // Validate score limit
      if (scoreLimit < 10) {
        throw { message: t('setup:validation.invalidScoreLimit'), field: 'scoreLimit' };
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
            <Title order={2} ta="center" mt="lg">{t('setup:title')}</Title>
            
            <Paper withBorder p="md" radius="md" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' }}>
              <Stack gap="md">
                <Group wrap="nowrap" gap="md">
                  <ThemeIcon size={42} radius="md" color="blue">
                    <IconUsers size={24} />
                  </ThemeIcon>
                  <div>
                    <Title order={4}>{t('setup:teams.title')}</Title>
                    <Text size="sm" c="dimmed">
                      {t('setup:teams.description')}
                    </Text>
                  </div>
                </Group>
                
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  {teamNames.map((teamName, index) => (
                    <Group key={index} style={{ alignItems: 'center' }}>
                      <TextInput
                        value={teamName}
                        onChange={(e) => handleTeamNameChange(index, e.target.value)}
                        placeholder={t('setup:teams.placeholder', { number: index + 1 })}
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
                    {t('setup:buttons.addTeam')}
                  </Button>
                )}
              </Stack>
            </Paper>
            
            <Divider label={t('setup:gameSettings.title')} labelPosition="center" />
            
            <Paper withBorder p="md" radius="md" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)' }}>
              <Stack gap="lg">
                <Group wrap="nowrap" gap="md">
                  <ThemeIcon size={42} radius="md" color="cyan">
                    <IconClock size={24} />
                  </ThemeIcon>
                  
                  <Stack gap={5}>
                    <Title order={4}>{t('setup:gameSettings.roundTime.title', { time: roundTime })}</Title>
                    <Text size="sm" c="dimmed">{t('setup:gameSettings.roundTime.description')}</Text>
                    
                    <Slider
                      min={30}
                      max={300}
                      step={15}
                      value={roundTime}
                      onChange={setRoundTime}
                      marks={[
                        { value: 60, label: '1m' },
                        { value: 120, label: '2m' },
                        { value: 180, label: '3m' },
                        { value: 300, label: '5m' },
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
                    <Title order={4}>{t('setup:gameSettings.scoreLimit.title', { score: scoreLimit })}</Title>
                    <Text size="sm" c="dimmed">{t('setup:gameSettings.scoreLimit.description')}</Text>
                    
                    <Slider
                      min={10}
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
                    <Title order={4}>{t('setup:difficulty.title')}</Title>
                    <Text size="sm" c="dimmed" mb="xs">{t('setup:difficulty.description')}</Text>
                    
                    <Select
                      data={[
                        { value: 'easy', label: t('setup:difficulty.options.easy') },
                        { value: 'medium', label: t('setup:difficulty.options.medium') },
                        { value: 'hard', label: t('setup:difficulty.options.hard') },
                        { value: 'mixed', label: t('setup:difficulty.options.mixed') },
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
                    label={t('setup:settings.losePointOnSkip.label')}
                    description={t('setup:settings.losePointOnSkip.description')}
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
                {t('setup:buttons.back')}
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
                {t('setup:buttons.startGame')}
              </Button>
            </Group>
          </Stack>
        </form>
  );
}); 