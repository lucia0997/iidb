/**
 * Airbus Brand Color Palette
 * 
 * Official Airbus color palette with CMYK, RGB, Hex, Pantone, and NCS values.
 * These colors are used throughout the application for consistent branding.
 */

export const AirbusColors = {
  // Lime Green
  limeGreen: {
    hex: '#84bd00',
    rgb: { r: 132, g: 189, b: 0 },
    cmyk: { c: 54, m: 0, y: 100, k: 0 },
    pantone: '376 C',
    ncs: 'S 1075-G40Y',
  },

  // Bright Yellow
  brightYellow: {
    hex: '#e1e000',
    rgb: { r: 225, g: 224, b: 0 },
    cmyk: { c: 10, m: 0, y: 95, k: 0 },
    pantone: '396 C',
    ncs: 'S 0570-G80Y',
  },

  // Orange
  orange: {
    hex: '#fe5000',
    rgb: { r: 254, g: 80, b: 0 },
    cmyk: { c: 0, m: 65, y: 100, k: 0 },
    pantone: '021 C',
    ncs: 'S 0585-Y60R',
  },

  // Red
  red: {
    hex: '#e4002b',
    rgb: { r: 228, g: 0, b: 43 },
    cmyk: { c: 0, m: 93, y: 79, k: 0 },
    pantone: '185 C',
    ncs: 'S 0580-Y90R',
  },

  // Magenta
  magenta: {
    hex: '#da1884',
    rgb: { r: 218, g: 24, b: 132 },
    cmyk: { c: 1, m: 92, y: 4, k: 0 },
    pantone: '219 C',
    ncs: 'S 1070-R20B',
  },

  // Purple
  purple: {
    hex: '#a51890',
    rgb: { r: 165, g: 24, b: 144 },
    cmyk: { c: 42, m: 100, y: 0, k: 0 },
    pantone: '248 C',
    ncs: 'S 2060-R40B',
  },

  // Cyan/Teal
  cyan: {
    hex: '#00aec7',
    rgb: { r: 0, g: 174, b: 199 },
    cmyk: { c: 84, m: 0, y: 18, k: 0 },
    pantone: '3125 C',
    ncs: 'S 2050-B20G',
  },

  // Airbus Blue Palette (Main brand colors)
  white: {
    hex: '#ffffff',
    rgb: { r: 255, g: 255, b: 255 },
    cmyk: { c: 0, m: 0, y: 0, k: 0 },
    pantone: 'White',
  },

  black: {
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0 },
    cmyk: { c: 0, m: 0, y: 0, k: 100 },
    pantone: 'Black C',
  },

  // Main colour: Airbus blue
  airbusBlue: {
    hex: '#00205b',
    rgb: { r: 0, g: 32, b: 91 },
    cmyk: { c: 100, m: 85, y: 5, k: 36 },
    pantone: '281 C',
    ncs: 'S 6030-R80B',
  },

  mediumBlue: {
    hex: '#005587',
    rgb: { r: 0, g: 85, b: 135 },
    cmyk: { c: 100, m: 45, y: 0, k: 45 },
    pantone: '7692 C',
    ncs: 'S 5040-R90B',
  },

  tealBlue: {
    hex: '#0085ad',
    rgb: { r: 0, g: 133, b: 173 },
    cmyk: { c: 93, m: 4, y: 8, k: 24 },
    pantone: '7704 C',
    ncs: 'S 4050-B',
  },

  slateBlue: {
    hex: '#6399ae',
    rgb: { r: 99, g: 153, b: 174 },
    cmyk: { c: 56, m: 9, y: 9, k: 21 },
    pantone: '7696 C',
    ncs: 'S 4030-B',
  },

  lightGrayishBlue: {
    hex: '#b7c9d3',
    rgb: { r: 183, g: 201, b: 211 },
    cmyk: { c: 21, m: 5, y: 4, k: 8 },
    pantone: '5445 C',
    ncs: 'S 1515-R90B',
  },
} as const;

/**
 * Helper function to get hex color value
 */
export const getAirbusColor = (colorName: keyof typeof AirbusColors): string => {
  return AirbusColors[colorName].hex;
};

/**
 * Helper function to get hover color (darker version)
 * Returns a darker shade for hover effects
 */
export const getAirbusColorHover = (colorName: keyof typeof AirbusColors): string => {
  const hoverColors: Record<keyof typeof AirbusColors, string> = {
    limeGreen: '#6fa000',
    brightYellow: '#c8c800',
    orange: '#e44600',
    red: '#cc0026',
    magenta: '#c01573',
    purple: '#8b1478',
    cyan: '#0099b0',
    white: '#f5f5f5',
    black: '#1a1a1a',
    airbusBlue: '#001a3d',
    mediumBlue: '#004469',
    tealBlue: '#00708a',
    slateBlue: '#52808f',
    lightGrayishBlue: '#9fb4c0',
  };
  return hoverColors[colorName];
};

/**
 * Table-specific color mapping
 * Maps each table to its designated Airbus color
 * Order: Cyan, Purple, Orange, Red, Green
 */
export const TableColors = {
  technologies: AirbusColors.cyan.hex,        // Cyan/Teal
  strategies: AirbusColors.purple.hex,         // Purple
  processes: AirbusColors.orange.hex,          // Orange
  projects: AirbusColors.red.hex,              // Red
  plantProgrammes: AirbusColors.limeGreen.hex, // Lime Green
} as const;

/**
 * Table hover colors
 */
export const TableColorsHover = {
  technologies: getAirbusColorHover('cyan'),
  strategies: getAirbusColorHover('purple'),
  processes: getAirbusColorHover('orange'),
  projects: getAirbusColorHover('red'),
  plantProgrammes: getAirbusColorHover('limeGreen'),
} as const;

/**
 * Action button colors
 * Used for common actions like Create, Modify, Edit, Delete, etc.
 */
export const ActionColors = {
  create: AirbusColors.tealBlue.hex,      // 4th color - Teal Blue
  modify: AirbusColors.slateBlue.hex,      // 5th color - Slate Blue
  edit: AirbusColors.mediumBlue.hex,       // Medium Blue
  delete: AirbusColors.red.hex,           // Red
  cancel: AirbusColors.lightGrayishBlue.hex, // Light Grayish Blue
  save: AirbusColors.airbusBlue.hex,       // Main Airbus Blue
  primary: AirbusColors.airbusBlue.hex,   // Main Airbus Blue
  secondary: AirbusColors.slateBlue.hex,  // Slate Blue
} as const;

/**
 * Action button hover colors
 */
export const ActionColorsHover = {
  create: '#00708a',      // Darker teal blue
  modify: '#52808f',       // Darker slate blue
  edit: '#004469',         // Darker medium blue
  delete: getAirbusColorHover('red'),
  cancel: '#9fb4c0',       // Darker light grayish blue
  save: '#001a3d',         // Darker airbus blue
  primary: '#001a3d',      // Darker airbus blue
  secondary: '#52808f',    // Darker slate blue
} as const;

/**
 * Color variants for UI components
 * Provides light, clear, dark variations for backgrounds, text, etc.
 */
export const ColorVariants = {
  // Technology/Cyan color variants
  technology: {
    main: AirbusColors.cyan.hex,           // #00aec7 - Main color
    dark: '#007a8f',                        // Darker for hover/active
    light: '#e0f7fa',                       // Very light for backgrounds
    clear: '#f0fbfc',                       // Very clear/light for subtle backgrounds
    text: '#002d33',                        // Dark text on light background
    textLight: '#ffffff',                   // Light text on dark background
  },
  
  // Strategies/Purple color variants
  strategies: {
    main: AirbusColors.purple.hex,         // #a51890
    dark: '#8b1478',
    light: '#f5e6f2',
    clear: '#faf5f9',
    text: '#3d0d35',
    textLight: '#ffffff',
  },
  
  // Processes/Orange color variants
  processes: {
    main: AirbusColors.orange.hex,         // #fe5000
    dark: '#e44600',
    light: '#ffe8e0',
    clear: '#fff5f0',
    text: '#4d1a00',
    textLight: '#ffffff',
  },
  
  // Projects/Red color variants
  projects: {
    main: AirbusColors.red.hex,            // #e4002b
    dark: '#cc0026',
    light: '#ffe0e5',
    clear: '#fff0f2',
    text: '#4d000f',
    textLight: '#ffffff',
  },
  
  // Plant Programmes/Green color variants
  plantProgrammes: {
    main: AirbusColors.limeGreen.hex,      // #84bd00
    dark: '#6fa000',
    light: '#f0f8e0',
    clear: '#f7fbf0',
    text: '#2d3f00',
    textLight: '#ffffff',
  },
} as const;

