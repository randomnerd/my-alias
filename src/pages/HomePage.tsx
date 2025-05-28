import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Collapse,
  Box,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconVocabulary, IconUsers, IconClock, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { t } = useTranslation(['home', 'common']);
  const [loadedItems, setLoadedItems] = useState<boolean[]>([false, false, false]);
  const [loadedFeatures, setLoadedFeatures] = useState<boolean[]>([false, false, false]);
  const [rulesExpanded, setRulesExpanded] = useState(true);

  // Sequential animation for the sections
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    // Stagger the animations for each section
    [false, false, false].forEach((_, index) => {
      const timer = setTimeout(() => {
        setLoadedItems(current => {
          const updated = [...current];
          updated[index] = true;
          return updated;
        });
      }, 150 + (index * 150)); // Faster staggering (150ms)
      
      timers.push(timer);
    });

    // Features appear after all sections are loaded
    const featuresTimer = setTimeout(() => {
      // Stagger the animations for each feature
      [false, false, false].forEach((_, index) => {
        const timer = setTimeout(() => {
          setLoadedFeatures(current => {
            const updated = [...current];
            updated[index] = true;
            return updated;
          });
        }, 300 + (index * 80)); // Faster staggering (80ms)
        
        timers.push(timer);
      });
    }, 300);
    
    timers.push(featuresTimer);
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []); // Animation should only run once on mount

  // On small screens, collapse rules by default
  useEffect(() => {
    const handleResize = () => {
      setRulesExpanded(window.innerWidth >= 768);
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container py="md">
      <Transition mounted={loadedItems[0]} transition="fade" duration={400}>
        {(styles) => (
          <Card shadow="md" padding="md" radius="lg" withBorder mb="md" style={styles}>
            <Stack gap="md">
              <Title order={2} ta="center" 
                style={{ 
                  fontSize: theme.other.isMobile ? rem(24) : rem(28),
                  background: 'linear-gradient(45deg, #228be6 0%, #40c4ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t('home:welcome.title')}
              </Title>
              <Text ta="center" size="lg" c="dimmed">
                {t('home:welcome.subtitle')}
              </Text>
              
              <Group justify="center" mt="md">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/setup')}
                  variant="gradient" 
                  gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                  radius="md"
                  style={{
                    boxShadow: '0 4px 14px rgba(34, 139, 230, 0.25)',
                    transform: 'translateY(0)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(34, 139, 230, 0.3)'
                    }
                  }}
                >
                  {t('common:buttons.startNewGame')}
                </Button>
              </Group>
            </Stack>
          </Card>
        )}
      </Transition>
      
      <Transition mounted={loadedItems[1]} transition="fade" duration={400}>
        {(styles) => (
          <Card shadow="md" padding="md" radius="lg" withBorder mb="md" style={styles}>
            <Group justify="space-between" mb="md">
              <Title order={3}>{t('home:rules.title')}</Title>
              <Button 
                variant="subtle" 
                size="sm"
                onClick={() => setRulesExpanded(!rulesExpanded)}
                rightSection={rulesExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                styles={{
                  root: {
                    '@media (minWidth: 768px)': {
                      display: 'none',
                    }
                  }
                }}
              >
                {rulesExpanded ? t('common:buttons.hide') : t('common:buttons.show')}
              </Button>
            </Group>
            
            <Collapse in={rulesExpanded}>
              <List spacing="sm" size="md" mb="xs" styles={{ item: { fontSize: rem(15) } }}>
                {(t('home:rules.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <List.Item key={index}>{item}</List.Item>
                ))}
              </List>
            </Collapse>
          </Card>
        )}
      </Transition>
      
      <Transition mounted={loadedItems[2]} transition="fade" duration={400}>
        {(styles) => (
          <Card shadow="md" padding="md" radius="lg" withBorder style={styles}>
            <Title order={3} mb="md" ta="center">{t('home:features.title')}</Title>
            <Grid>
              <Grid.Col span={{ base: 12, xs: 12, sm: 4 }}>
                <Transition mounted={loadedFeatures[0]} transition="slide-up" duration={400}>
                  {(cardStyles) => (
                    <Paper p="md" radius="md" withBorder style={{
                      ...cardStyles,
                      height: '100%',
                      background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)'
                    }}>
                      <Stack align="center" gap="sm">
                        <ThemeIcon size={60} radius="xl" color="blue" styles={{ root: { boxShadow: '0 4px 8px rgba(34, 139, 230, 0.2)' } }}>
                          <IconVocabulary size={36} />
                        </ThemeIcon>
                        <Title order={4}>{t('home:features.vocabulary.title')}</Title>
                        <Text ta="center" c="dimmed">{t('home:features.vocabulary.description')}</Text>
                      </Stack>
                    </Paper>
                  )}
                </Transition>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, xs: 12, sm: 4 }}>
                <Transition mounted={loadedFeatures[1]} transition="slide-up" duration={400}>
                  {(cardStyles) => (
                    <Paper p="md" radius="md" withBorder style={{
                      ...cardStyles,
                      height: '100%',
                      background: 'linear-gradient(180deg, #ffffff 0%, #f0fcff 100%)'
                    }}>
                      <Stack align="center" gap="sm">
                        <ThemeIcon size={60} radius="xl" color="cyan" styles={{ root: { boxShadow: '0 4px 8px rgba(34, 195, 230, 0.2)' } }}>
                          <IconUsers size={36} />
                        </ThemeIcon>
                        <Title order={4}>{t('home:features.groups.title')}</Title>
                        <Text ta="center" c="dimmed">{t('home:features.groups.description')}</Text>
                      </Stack>
                    </Paper>
                  )}
                </Transition>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, xs: 12, sm: 4 }}>
                <Transition mounted={loadedFeatures[2]} transition="slide-up" duration={400}>
                  {(cardStyles) => (
                    <Paper p="md" radius="md" withBorder style={{
                      ...cardStyles,
                      height: '100%',
                      background: 'linear-gradient(180deg, #ffffff 0%, #f3f0ff 100%)'
                    }}>
                      <Stack align="center" gap="sm">
                        <ThemeIcon size={60} radius="xl" color="indigo" styles={{ root: { boxShadow: '0 4px 8px rgba(92, 73, 216, 0.2)' } }}>
                          <IconClock size={36} />
                        </ThemeIcon>
                        <Title order={4}>{t('home:features.quickRounds.title')}</Title>
                        <Text ta="center" c="dimmed">{t('home:features.quickRounds.description')}</Text>
                      </Stack>
                    </Paper>
                  )}
                </Transition>
              </Grid.Col>
            </Grid>
            
            <Box mt="xl" ta="center">
              <Button 
                onClick={() => navigate('/setup')} 
                variant="light" 
                color="blue" 
                size="lg"
                radius="md"
                style={{
                  width: '100%',
                  maxWidth: '320px'
                }}
              >
                {t('common:buttons.getStarted')}
              </Button>
            </Box>
          </Card>
        )}
      </Transition>
    </Container>
  );
}; 