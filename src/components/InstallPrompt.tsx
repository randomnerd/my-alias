import React, { useState, useEffect } from 'react';
import { Button, Group, Text, Alert } from '@mantine/core';

// Define a proper interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      await deferredPrompt.userChoice;
      
      // We've used the prompt, so we can't use it again, discard it
      setDeferredPrompt(null);
      
      // Hide the install button
      setShowPrompt(false);
      
      // Use conditional logging for development only
    } catch (error) {
      // Handle any errors that might occur during the installation process
      console.error('Installation error:', error);
    }
  };

  if (!showPrompt) return null;

  return (
    <Alert 
      mb="md" 
      variant="light" 
      color="blue" 
      title="Install Alias Game"
      withCloseButton
      onClose={() => setShowPrompt(false)}
    >
      <Text size="sm" mb="xs">
        Install this app on your device for a better experience!
      </Text>
      <Group>
        <Button size="xs" onClick={handleInstallClick}>Install Now</Button>
        <Button 
          size="xs" 
          variant="subtle" 
          onClick={() => setShowPrompt(false)}
        >
          Maybe Later
        </Button>
      </Group>
    </Alert>
  );
}; 