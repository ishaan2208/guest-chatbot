// Design tokens and theme system for the guest chatbot

export interface ColorPalette {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

export interface SpacingScale {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

export interface TypographyScale {
  xs: { fontSize: string; lineHeight: string };
  sm: { fontSize: string; lineHeight: string };
  base: { fontSize: string; lineHeight: string };
  lg: { fontSize: string; lineHeight: string };
  xl: { fontSize: string; lineHeight: string };
  '2xl': { fontSize: string; lineHeight: string };
  '3xl': { fontSize: string; lineHeight: string };
  '4xl': { fontSize: string; lineHeight: string };
  '5xl': { fontSize: string; lineHeight: string };
  '6xl': { fontSize: string; lineHeight: string };
  '7xl': { fontSize: string; lineHeight: string };
  '8xl': { fontSize: string; lineHeight: string };
  '9xl': { fontSize: string; lineHeight: string };
}

export interface BorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface BoxShadow {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface Theme {
  name: string;
  colors: ColorPalette;
  spacing: SpacingScale;
  typography: TypographyScale;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  animation: {
    fast: string;
    normal: string;
    slow: string;
  };
}

// Base spacing scale (4px grid system)
export const spacing: SpacingScale = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
};

// Typography scale
export const typography: TypographyScale = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },      // 12px
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },   // 14px
  base: { fontSize: '1rem', lineHeight: '1.5rem' },      // 16px
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },   // 18px
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },    // 20px
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },     // 24px
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' }, // 30px
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },   // 36px
  '5xl': { fontSize: '3rem', lineHeight: '1' },           // 48px
  '6xl': { fontSize: '3.75rem', lineHeight: '1' },        // 60px
  '7xl': { fontSize: '4.5rem', lineHeight: '1' },         // 72px
  '8xl': { fontSize: '6rem', lineHeight: '1' },           // 96px
  '9xl': { fontSize: '8rem', lineHeight: '1' },           // 128px
};

// Border radius scale
export const borderRadius: BorderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// Box shadow scale
export const boxShadow: BoxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

// Light theme colors
export const lightColors: ColorPalette = {
  primary: 'hsl(210 100% 50%)',           // Blue 500
  primaryForeground: 'hsl(0 0% 100%)',    // White
  secondary: 'hsl(210 40% 96%)',          // Blue 50
  secondaryForeground: 'hsl(210 40% 8%)',  // Blue 950
  accent: 'hsl(210 40% 94%)',             // Blue 100
  accentForeground: 'hsl(210 40% 11%)',   // Blue 900
  background: 'hsl(0 0% 100%)',           // White
  foreground: 'hsl(210 40% 8%)',          // Blue 950
  muted: 'hsl(210 40% 96%)',              // Blue 50
  mutedForeground: 'hsl(210 40% 38%)',    // Blue 600
  card: 'hsl(0 0% 100%)',                 // White
  cardForeground: 'hsl(210 40% 8%)',      // Blue 950
  border: 'hsl(210 40% 89%)',             // Blue 200
  input: 'hsl(210 40% 89%)',              // Blue 200
  ring: 'hsl(210 100% 50%)',              // Blue 500
  destructive: 'hsl(0 85% 60%)',          // Red 500
  destructiveForeground: 'hsl(0 0% 100%)', // White
  success: 'hsl(142 71% 45%)',            // Green 600
  successForeground: 'hsl(0 0% 100%)',    // White
  warning: 'hsl(45 93% 47%)',             // Yellow 500
  warningForeground: 'hsl(45 93% 8%)',    // Yellow 950
  info: 'hsl(199 89% 48%)',               // Sky 500
  infoForeground: 'hsl(0 0% 100%)',       // White
};

// Dark theme colors
export const darkColors: ColorPalette = {
  primary: 'hsl(210 100% 50%)',           // Blue 500
  primaryForeground: 'hsl(0 0% 100%)',    // White
  secondary: 'hsl(217 33% 17%)',          // Blue 900
  secondaryForeground: 'hsl(210 40% 96%)', // Blue 50
  accent: 'hsl(217 33% 17%)',             // Blue 900
  accentForeground: 'hsl(210 40% 96%)',   // Blue 50
  background: 'hsl(224 71% 4%)',          // Blue 950
  foreground: 'hsl(210 40% 96%)',         // Blue 50
  muted: 'hsl(217 33% 17%)',              // Blue 900
  mutedForeground: 'hsl(210 40% 65%)',    // Blue 400
  card: 'hsl(224 71% 4%)',                // Blue 950
  cardForeground: 'hsl(210 40% 96%)',     // Blue 50
  border: 'hsl(217 33% 17%)',             // Blue 900
  input: 'hsl(217 33% 17%)',              // Blue 900
  ring: 'hsl(210 100% 50%)',              // Blue 500
  destructive: 'hsl(0 63% 31%)',          // Red 800
  destructiveForeground: 'hsl(0 0% 96%)', // Gray 50
  success: 'hsl(142 71% 45%)',            // Green 600
  successForeground: 'hsl(0 0% 100%)',    // White
  warning: 'hsl(45 93% 47%)',             // Yellow 500
  warningForeground: 'hsl(45 93% 8%)',    // Yellow 950
  info: 'hsl(199 89% 48%)',               // Sky 500
  infoForeground: 'hsl(0 0% 100%)',       // White
};

// Theme definitions
export const lightTheme: Theme = {
  name: 'light',
  colors: lightColors,
  spacing,
  typography,
  borderRadius,
  boxShadow,
  animation: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: darkColors,
  spacing,
  typography,
  borderRadius,
  boxShadow,
  animation: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Hotel brand theme variants
export const luxuryTheme: Theme = {
  ...darkTheme,
  name: 'luxury',
  colors: {
    ...darkColors,
    primary: 'hsl(45 100% 70%)',           // Gold
    primaryForeground: 'hsl(24 71% 4%)',   // Dark brown
    accent: 'hsl(24 71% 8%)',              // Rich brown
    accentForeground: 'hsl(45 100% 70%)',  // Gold
    background: 'hsl(24 71% 4%)',          // Deep brown
    card: 'hsl(24 71% 8%)',                // Rich brown
  },
};

export const boutiqueTheme: Theme = {
  ...lightTheme,
  name: 'boutique',
  colors: {
    ...lightColors,
    primary: 'hsl(340 82% 52%)',           // Pink 500
    primaryForeground: 'hsl(0 0% 100%)',   // White
    accent: 'hsl(340 100% 97%)',           // Pink 50
    accentForeground: 'hsl(340 82% 52%)',  // Pink 500
    secondary: 'hsl(270 40% 96%)',         // Purple 50
    secondaryForeground: 'hsl(270 40% 8%)', // Purple 950
  },
};

// Theme utilities
export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
  });

  // Apply theme class
  root.classList.remove('light', 'dark', 'luxury', 'boutique');
  root.classList.add(theme.name);
}

export function getTheme(name: string): Theme {
  switch (name) {
    case 'dark':
      return darkTheme;
    case 'luxury':
      return luxuryTheme;
    case 'boutique':
      return boutiqueTheme;
    default:
      return lightTheme;
  }
}

// Animation presets
export const animations = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideInFromRight: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  slideInFromLeft: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  slideInFromBottom: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },

  // Hover animations
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 10 },
  },
  tap: {
    scale: 0.95,
    transition: { type: 'spring', stiffness: 600, damping: 15 },
  },

  // Loading animations
  spin: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity },
  },
  bounce: {
    y: [0, -10, 0],
    transition: { duration: 0.6, repeat: Infinity },
  },
};

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Media queries
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;