import React, { type ReactNode } from 'react';
import { Transition } from '@mantine/core';

interface RouteTransitionProps {
  children: ReactNode;
  transitionType?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({ 
  children, 
  transitionType = 'fade' 
}) => {
  return (
    <Transition mounted={true} transition={transitionType} duration={300}>
      {(styles) => (
        <div style={{ ...styles }}>
          {children}
        </div>
      )}
    </Transition>
  );
}; 