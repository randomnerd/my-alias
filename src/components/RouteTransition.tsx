import React, { type ReactNode } from 'react';
import { Transition } from '@mantine/core';

interface RouteTransitionProps {
  children: ReactNode;
  transitionType?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
}

// Define custom transition properties for better animations
const getTransitionProps = (type: string) => {
  const transitions = {
    fade: {
      duration: 300,
      timingFunction: 'ease',
    },
    'slide-up': {
      duration: 400,
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    'slide-down': {
      duration: 400,
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    'slide-left': {
      duration: 350,
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    'slide-right': {
      duration: 350,
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };
  
  return transitions[type as keyof typeof transitions] || transitions.fade;
};

export const RouteTransition: React.FC<RouteTransitionProps> = ({ 
  children, 
  transitionType = 'fade' 
}) => {
  const { duration, timingFunction } = getTransitionProps(transitionType);
  
  return (
    <Transition 
      mounted={true} 
      transition={transitionType} 
      duration={duration}
      timingFunction={timingFunction}
    >
      {(styles) => (
        <div style={{ ...styles }}>
          {children}
        </div>
      )}
    </Transition>
  );
}; 