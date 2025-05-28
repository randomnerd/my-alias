import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  primaryColor: 'blue',
  colors: {
    // Custom colors for the app
    blue: [
      '#e9f0ff',
      '#cfdcff',
      '#9db3f5',
      '#6889eb',
      '#3e67e3',
      '#2554e0',
      '#1a48df',
      '#0c38c7',
      '#032fb3',
      '#00259f'
    ]
  },
  defaultRadius: 'md',
  // Enhanced typography with fluid scaling and mobile-first approach
  fontSizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',     // 12px -> 14px
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',       // 14px -> 16px
    md: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',         // 16px -> 18px
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',      // 18px -> 20px
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',       // 20px -> 24px
  },
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.5',
    lg: '1.55',
    xl: '1.6',
  },
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',        // 32px -> 48px
        lineHeight: '1.2',
      },
      h2: {
        fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)', // 24px -> 36px
        lineHeight: '1.25',
      },
      h3: {
        fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)', // 20px -> 28px
        lineHeight: '1.3',
      },
      h4: {
        fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',  // 18px -> 24px
        lineHeight: '1.35',
      },
      h5: {
        fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',     // 16px -> 20px
        lineHeight: '1.4',
      },
      h6: {
        fontSize: 'clamp(0.875rem, 0.8rem + 0.375vw, 1.125rem)', // 14px -> 18px
        lineHeight: '1.45',
      },
    },
  },
  // Enhanced component defaults for better mobile experience
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: '500',
          letterSpacing: '0.01em',
          '@media (maxWidth: 576px)': {
            minHeight: rem(44), // Larger touch targets on mobile
            fontSize: rem(16),   // Prevent iOS zoom
            padding: `${rem(12)} ${rem(20)}`,
          },
          '@media (minWidth: 768px)': {
            letterSpacing: '0.025em', // Improved readability on desktop
            lineHeight: '1.45',
          }
        }
      }
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        padding: 'md',
      },
      styles: {
        root: {
          '@media (maxWidth: 576px)': {
            padding: rem(16), // Adjust padding on mobile
          },
          '@media (minWidth: 768px)': {
            padding: rem(24), // More generous padding on desktop
          }
        }
      }
    },
    Container: {
      defaultProps: {
        px: 'md',
      },
      styles: {
        root: {
          '@media (maxWidth: 576px)': {
            padding: `0 ${rem(16)}`, // Optimal mobile padding
          },
          '@media (minWidth: 768px)': {
            padding: `0 ${rem(32)}`, // Better desktop margins
          }
        }
      }
    },
    Input: {
      styles: {
        input: {
          fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
          lineHeight: '1.5',
          '@media (maxWidth: 576px)': {
            minHeight: rem(44), // Larger input height on mobile
            fontSize: rem(16),  // Prevent iOS zoom on focus
            padding: `${rem(12)} ${rem(16)}`,
          }
        }
      }
    },
    Text: {
      styles: {
        root: {
          lineHeight: '1.6',
          letterSpacing: '0.005em',
          // Improve text rendering
          textRendering: 'optimizeLegibility',
          fontFeatureSettings: '"kern" 1',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          '@media (minWidth: 768px)': {
            lineHeight: '1.65', // Better line height for desktop reading
            letterSpacing: '0.01em', // Improved character spacing
            fontSize: 'clamp(1rem, 0.9rem + 0.3vw, 1.125rem)', // Responsive desktop sizing
          },
          '@media (minWidth: 1200px)': {
            lineHeight: '1.7', // Optimal reading line height for large screens
            maxWidth: '65ch', // Optimal reading width
            letterSpacing: '0.015em',
          }
        }
      }
    },
    Title: {
      styles: {
        root: {
          // Improve heading rendering
          textRendering: 'optimizeLegibility',
          fontFeatureSettings: '"kern" 1',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }
      }
    },
    Paper: {
      styles: {
        root: {
          '@media (maxWidth: 576px)': {
            padding: rem(16),
          }
        }
      }
    },
    Stack: {
      defaultProps: {
        gap: { base: 'sm', sm: 'md' },
      }
    },
    Group: {
      defaultProps: {
        gap: { base: 'sm', sm: 'md' },
      }
    }
  },
});