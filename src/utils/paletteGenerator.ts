
import { Palette } from '@/types/palette';
import { v4 as uuidv4 } from 'uuid';
import { hexToRgb, rgbToHsl, rgbToHex } from './colorUtils';

// Calculate actual contrast ratio between two colors
const calculateContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  // Calculate relative luminance for both colors
  const luminance1 = calculateRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const luminance2 = calculateRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  // Calculate contrast ratio
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Calculate relative luminance as per WCAG formula
const calculateRelativeLuminance = (r: number, g: number, b: number): number => {
  const sRGB = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return sRGB[0] * 0.2126 + sRGB[1] * 0.7152 + sRGB[2] * 0.0722;
};

// Adjust color brightness to achieve target contrast with another color
const adjustColorForContrast = (color: string, referenceColor: string, targetContrast: number): string => {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Start with the original color
  let adjustedColor = color;
  let currentContrast = calculateContrastRatio(adjustedColor, referenceColor);
  let attempts = 0;
  const maxAttempts = 20;
  
  // Determine if we need to lighten or darken
  const needsLightening = currentContrast < targetContrast;
  
  // Adjust lightness until we reach target contrast or max attempts
  while (Math.abs(currentContrast - targetContrast) > 0.2 && attempts < maxAttempts) {
    attempts++;
    
    // Adjust lightness
    if (needsLightening && hsl.l < 95) {
      hsl.l += 5;
    } else if (!needsLightening && hsl.l > 5) {
      hsl.l -= 5;
    } else {
      // Can't adjust lightness further
      break;
    }
    
    // Convert back to RGB and hex
    const { r, g, b } = hslToRgb(hsl.h / 360, hsl.s / 100, hsl.l / 100);
    adjustedColor = rgbToHex(r, g, b);
    
    // Calculate new contrast
    currentContrast = calculateContrastRatio(adjustedColor, referenceColor);
  }
  
  return adjustedColor;
};

// Convert HSL to RGB
const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { 
    r: Math.round(r * 255), 
    g: Math.round(g * 255), 
    b: Math.round(b * 255) 
  };
};

// Color harmony algorithms based on color theory
const generateColorHarmony = (
  baseColor: string,
  harmonyType: 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'square' | 'monochromatic'
): string[] => {
  const { r, g, b } = hexToRgb(baseColor);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  const colors: string[] = [baseColor]; // Start with base color
  
  switch (harmonyType) {
    case 'complementary':
      // Add complementary color (180° opposite)
      colors.push(generateColorFromHsl((h + 180) % 360, s, l));
      // Add variations with different lightness/saturation for depth
      colors.push(generateColorFromHsl((h + 180) % 360, Math.max(20, s - 20), Math.min(80, l + 15)));
      colors.push(generateColorFromHsl(h, Math.max(20, s - 15), Math.max(20, l - 25)));
      break;
      
    case 'analogous':
      // Add adjacent colors (±30°, ±60°)
      colors.push(generateColorFromHsl((h + 30) % 360, s, l));
      colors.push(generateColorFromHsl((h - 30 + 360) % 360, s, l));
      colors.push(generateColorFromHsl((h + 60) % 360, Math.max(20, s - 10), Math.min(80, l + 10)));
      colors.push(generateColorFromHsl((h - 60 + 360) % 360, Math.max(20, s - 10), Math.max(30, l - 15)));
      break;
      
    case 'triadic':
      // Add colors at 120° intervals
      colors.push(generateColorFromHsl((h + 120) % 360, s, l));
      colors.push(generateColorFromHsl((h + 240) % 360, s, l));
      // Add variations for depth
      colors.push(generateColorFromHsl((h + 120) % 360, Math.max(20, s - 15), Math.min(80, l + 10)));
      colors.push(generateColorFromHsl((h + 240) % 360, Math.max(20, s - 15), Math.max(25, l - 20)));
      break;
      
    case 'split-complementary':
      // Add colors adjacent to complement (150°, 210°)
      colors.push(generateColorFromHsl((h + 150) % 360, s, l));
      colors.push(generateColorFromHsl((h + 210) % 360, s, l));
      colors.push(generateColorFromHsl((h + 150) % 360, Math.max(20, s - 10), Math.min(80, l + 15)));
      colors.push(generateColorFromHsl((h + 210) % 360, Math.max(20, s - 10), Math.max(30, l - 10)));
      break;
      
    case 'square':
      // Add colors at 90° intervals (square/tetradic)
      colors.push(generateColorFromHsl((h + 90) % 360, s, l));
      colors.push(generateColorFromHsl((h + 180) % 360, s, l));
      colors.push(generateColorFromHsl((h + 270) % 360, s, l));
      // Add a variation for the 5th color
      colors.push(generateColorFromHsl((h + 45) % 360, Math.max(20, s - 20), Math.min(80, l + 20)));
      break;
      
    case 'monochromatic':
      // Vary saturation and lightness while keeping hue constant
      colors.push(generateColorFromHsl(h, Math.max(20, s - 30), Math.min(85, l + 25)));
      colors.push(generateColorFromHsl(h, Math.min(100, s + 20), Math.max(20, l - 30)));
      colors.push(generateColorFromHsl(h, Math.max(10, s - 50), Math.min(90, l + 40)));
      colors.push(generateColorFromHsl(h, Math.min(80, s + 10), Math.max(15, l - 45)));
      break;
  }
  
  return colors.slice(0, 6); // Return up to 6 colors per harmony
};

// Helper function to generate color from HSL values
const generateColorFromHsl = (h: number, s: number, l: number): string => {
  // Ensure values are within valid ranges
  h = h % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  
  const { r, g, b } = hslToRgb(h / 360, s / 100, l / 100);
  return rgbToHex(r, g, b);
};

// Filter color combinations through WCAG contrast requirements
const filterByAccessibility = (colors: string[], referenceColors: string[] = ['#ffffff', '#000000']): string[] => {
  return colors.filter(color => {
    // Check if color has sufficient contrast with at least one reference color
    return referenceColors.some(refColor => {
      const contrast = calculateContrastRatio(color, refColor);
      return contrast >= 3.0; // Minimum for UI elements
    });
  });
};

// Generate a palette based on color theory and color relationships
const generatePaletteSet = (brandColors: string[], index: number): Palette => {
  // Use the first brand color as the primary
  const primaryColor = brandColors[0];
  const { r, g, b } = hexToRgb(primaryColor);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  // Define color harmony types for different palettes
  const harmonyTypes: Array<'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'square' | 'monochromatic'> = [
    'complementary',
    'analogous', 
    'triadic',
    'split-complementary',
    'square',
    'monochromatic'
  ];
  
  // Select harmony type based on index
  const harmonyType = harmonyTypes[index % harmonyTypes.length];
  
  // Generate harmonious colors using color theory
  const harmonyColors = generateColorHarmony(primaryColor, harmonyType);
  
  // Filter colors for accessibility before selecting secondary/accent
  const accessibleColors = filterByAccessibility(harmonyColors.slice(1), ['#ffffff', '#f8f9fa', '#212529']);
  
  // Select secondary and accent from the accessible harmonious colors
  const secondaryHex = accessibleColors[0] || harmonyColors[1];
  const accentHex = accessibleColors[1] || harmonyColors[2];
  
  // Generate neutral colors
  // Light neutral - high lightness, low saturation
  const neutralLightHsl = { 
    h: h, 
    s: Math.min(s, 15), // Low saturation
    l: Math.min(95, l + 40) // High lightness
  };
  
  // Dark neutral - low lightness, low saturation
  const neutralDarkHsl = { 
    h: h, 
    s: Math.min(s, 20), // Low saturation
    l: Math.max(15, l - 40) // Low lightness
  };
  
  // Convert neutrals to RGB and hex
  const neutralLightRgb = hslToRgb(neutralLightHsl.h / 360, neutralLightHsl.s / 100, neutralLightHsl.l / 100);
  const neutralDarkRgb = hslToRgb(neutralDarkHsl.h / 360, neutralDarkHsl.s / 100, neutralDarkHsl.l / 100);
  
  const neutralLightHex = rgbToHex(neutralLightRgb.r, neutralLightRgb.g, neutralLightRgb.b);
  const neutralDarkHex = rgbToHex(neutralDarkRgb.r, neutralDarkRgb.g, neutralDarkRgb.b);
  
  // Ensure good contrast for accessibility
  let secondaryColorAdjusted = secondaryHex;
  let accentColorAdjusted = accentHex;
  
  // Ensure accent has good contrast with both light and dark neutrals
  const accentOnLightContrast = calculateContrastRatio(accentHex, neutralLightHex);
  const accentOnDarkContrast = calculateContrastRatio(accentHex, neutralDarkHex);
  
  if (accentOnLightContrast < 4.5 && accentOnDarkContrast < 4.5) {
    // If contrast is poor on both neutrals, adjust accent to have good contrast with light neutral
    accentColorAdjusted = adjustColorForContrast(accentHex, neutralLightHex, 4.5);
  }
  
  // Ensure secondary has good contrast with neutrals if it's going to be used for text
  const secondaryOnLightContrast = calculateContrastRatio(secondaryHex, neutralLightHex);
  if (secondaryOnLightContrast < 4.5) {
    secondaryColorAdjusted = adjustColorForContrast(secondaryHex, neutralLightHex, 4.5);
  }
  
  // Create color info objects
  const primary = {
    name: getColorName(primaryColor, 'primary', index),
    hex: primaryColor,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    meaning: getColorMeaning(primaryColor, 'primary', h)
  };
  
  const secondaryRgb = hexToRgb(secondaryColorAdjusted);
  const secondaryHsl = rgbToHsl(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  const secondary = {
    name: getColorName(secondaryColorAdjusted, 'secondary', index),
    hex: secondaryColorAdjusted,
    rgb: `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`,
    hsl: `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, ${secondaryHsl.l}%)`,
    meaning: getColorMeaning(secondaryColorAdjusted, 'secondary', secondaryHsl.h)
  };
  
  const accentRgb = hexToRgb(accentColorAdjusted);
  const accentHsl = rgbToHsl(accentRgb.r, accentRgb.g, accentRgb.b);
  const accent = {
    name: getColorName(accentColorAdjusted, 'accent', index),
    hex: accentColorAdjusted,
    rgb: `rgb(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b})`,
    hsl: `hsl(${accentHsl.h}, ${accentHsl.s}%, ${accentHsl.l}%)`,
    meaning: getColorMeaning(accentColorAdjusted, 'accent', accentHsl.h)
  };
  
  const neutralLight = {
    name: "Neutral Light",
    hex: neutralLightHex,
    rgb: `rgb(${neutralLightRgb.r}, ${neutralLightRgb.g}, ${neutralLightRgb.b})`,
    hsl: `hsl(${neutralLightHsl.h}, ${neutralLightHsl.s}%, ${neutralLightHsl.l}%)`,
    meaning: "This light neutral creates breathing room and improves readability in text-heavy sections."
  };
  
  const neutralDark = {
    name: "Neutral Dark",
    hex: neutralDarkHex,
    rgb: `rgb(${neutralDarkRgb.r}, ${neutralDarkRgb.g}, ${neutralDarkRgb.b})`,
    hsl: `hsl(${neutralDarkHsl.h}, ${neutralDarkHsl.s}%, ${neutralDarkHsl.l}%)`,
    meaning: "This dark neutral provides strong contrast and depth, excellent for text and important UI elements."
  };
  
  // Calculate accessibility values
  const whiteOnPrimary = calculateContrastRatio("#ffffff", primary.hex);
  const blackOnPrimary = calculateContrastRatio("#000000", primary.hex);
  const whiteOnSecondary = calculateContrastRatio("#ffffff", secondary.hex);
  const blackOnSecondary = calculateContrastRatio("#000000", secondary.hex);
  const whiteOnAccent = calculateContrastRatio("#ffffff", accent.hex);
  const blackOnAccent = calculateContrastRatio("#000000", accent.hex);
  const primaryOnNeutral = calculateContrastRatio(primary.hex, neutralLight.hex);
  
  // Generate palette name based on color relationships and properties
  const paletteNames = [
    "Harmonious Flow", "Vibrant Balance", "Modern Elegance", "Digital Serenity",
    "Creative Spark", "Bold Statement", "Subtle Vision", "Classic Touch",
    "Tech Innovator", "Natural Perspective", "Urban Edge", "Refined Contrast",
    "Professional Grade", "Emotional Impact", "Balanced Horizon", "Dynamic Energy",
    "Soft Whisper", "Decisive Action", "Cultural Blend", "Futuristic Glow"
  ];
  
  return {
    id: uuidv4(),
    name: paletteNames[index % paletteNames.length],
    primary,
    secondary,
    accent,
    neutral: {
      light: neutralLight,
      dark: neutralDark,
    },
    accessibility: {
      textOnPrimary: {
        whiteContrast: whiteOnPrimary,
        blackContrast: blackOnPrimary,
        passesAA: whiteOnPrimary >= 4.5 || blackOnPrimary >= 4.5,
        passesAAA: whiteOnPrimary >= 7 || blackOnPrimary >= 7,
      },
      textOnSecondary: {
        whiteContrast: whiteOnSecondary,
        blackContrast: blackOnSecondary,
        passesAA: whiteOnSecondary >= 4.5 || blackOnSecondary >= 4.5,
        passesAAA: whiteOnSecondary >= 7 || blackOnSecondary >= 7,
      },
      textOnAccent: {
        whiteContrast: whiteOnAccent,
        blackContrast: blackOnAccent,
        passesAA: whiteOnAccent >= 4.5 || blackOnAccent >= 4.5,
        passesAAA: whiteOnAccent >= 7 || blackOnAccent >= 7,
      },
      primaryOnNeutral: {
        contrast: primaryOnNeutral,
        passesAA: primaryOnNeutral >= 4.5,
        passesAAA: primaryOnNeutral >= 7,
      },
      isColorBlindFriendly: isColorBlindFriendly(primary.hex, secondary.hex, accent.hex),
    },
    reasoning: {
      brandGoals: generateBrandGoalsExplanation(harmonyType, primary.hex, secondary.hex, accent.hex),
      accessibilityReasoning: generateAccessibilityExplanation(whiteOnPrimary, blackOnPrimary, whiteOnSecondary, blackOnSecondary, whiteOnAccent, blackOnAccent, primaryOnNeutral),
      harmonyExplanation: generateHarmonyExplanation(harmonyType, primary.hex, secondary.hex, accent.hex),
    }
  };
};

// Function to check if colors are colorblind-friendly
const isColorBlindFriendly = (primary: string, secondary: string, accent: string): boolean => {
  // This is a simplified check - would require more sophisticated algorithms for accurate detection
  const primaryRgb = hexToRgb(primary);
  const secondaryRgb = hexToRgb(secondary);
  const accentRgb = hexToRgb(accent);
  
  // Check if colors are too similar in red-green channels (for protanopia and deuteranopia)
  const primaryRGDiff = Math.abs(primaryRgb.r - primaryRgb.g);
  const secondaryRGDiff = Math.abs(secondaryRgb.r - secondaryRgb.g);
  const accentRGDiff = Math.abs(accentRgb.r - accentRgb.g);
  
  // Check if colors have enough luminance difference
  const primaryLuminance = calculateRelativeLuminance(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  const secondaryLuminance = calculateRelativeLuminance(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  const accentLuminance = calculateRelativeLuminance(accentRgb.r, accentRgb.g, accentRgb.b);
  
  const luminanceDiff1 = Math.abs(primaryLuminance - secondaryLuminance);
  const luminanceDiff2 = Math.abs(primaryLuminance - accentLuminance);
  const luminanceDiff3 = Math.abs(secondaryLuminance - accentLuminance);
  
  // If colors have sufficient differences in luminance and aren't too similar in red-green, they're more likely to be colorblind-friendly
  return (
    (primaryRGDiff > 30 || secondaryRGDiff > 30 || accentRGDiff > 30) && 
    (luminanceDiff1 > 0.2 || luminanceDiff2 > 0.2 || luminanceDiff3 > 0.2)
  );
};

// Generate meaningful color names based on hue and role
const getColorName = (hex: string, role: string, index: number): string => {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  // Color name arrays based on hue ranges
  const redNames = ["Ruby", "Crimson", "Scarlet", "Brick", "Cherry"];
  const orangeNames = ["Amber", "Tangerine", "Coral", "Terracotta", "Apricot"];
  const yellowNames = ["Gold", "Mustard", "Lemon", "Honey", "Buttercup"];
  const greenNames = ["Mint", "Forest", "Emerald", "Sage", "Olive"];
  const cyanNames = ["Teal", "Turquoise", "Aqua", "Seafoam", "Jade"];
  const blueNames = ["Sky", "Navy", "Azure", "Cobalt", "Cerulean"];
  const purpleNames = ["Violet", "Lavender", "Plum", "Orchid", "Amethyst"];
  const magentaNames = ["Fuchsia", "Raspberry", "Mulberry", "Magenta", "Pink"];
  
  // Select color name based on hue
  let nameOptions: string[];
  if (h >= 0 && h < 30) nameOptions = redNames;
  else if (h >= 30 && h < 60) nameOptions = orangeNames;
  else if (h >= 60 && h < 120) nameOptions = yellowNames;
  else if (h >= 120 && h < 180) nameOptions = greenNames;
  else if (h >= 180 && h < 210) nameOptions = cyanNames;
  else if (h >= 210 && h < 270) nameOptions = blueNames;
  else if (h >= 270 && h < 330) nameOptions = purpleNames;
  else nameOptions = magentaNames;
  
  // Adjust based on lightness and saturation
  let prefix = "";
  if (l > 80) prefix = "Pale ";
  else if (l > 60) prefix = "Light ";
  else if (l < 30) prefix = "Deep ";
  else if (l < 15) prefix = "Dark ";
  
  if (s < 20) prefix = "Muted ";
  else if (s > 80) prefix = "Vibrant ";
  
  // Get a color name using the index for variety
  const baseName = nameOptions[index % nameOptions.length];
  return `${prefix}${baseName}`.trim();
};

// Generate color meaning based on color psychology
const getColorMeaning = (hex: string, role: string, hue: number): string => {
  // Base meanings by hue range
  const meanings: Record<string, string[]> = {
    red: [
      "Evokes energy and passion, perfect for calls to action and highlighting important elements.",
      "Symbolizes strength and excitement, ideal for brands wanting to create a bold impression.",
      "Creates a sense of urgency and importance, effective for critical UI elements."
    ],
    orange: [
      "Represents creativity and enthusiasm, great for innovative and youthful brands.",
      "Conveys warmth and friendliness, making it welcoming for users.",
      "Balances energy with approachability, effective for encouraging user engagement."
    ],
    yellow: [
      "Communicates optimism and clarity, ideal for highlighting important information.",
      "Evokes happiness and mental stimulation, perfect for educational or creative contexts.",
      "Creates a sense of confidence and positivity, good for supportive messaging."
    ],
    green: [
      "Signifies growth and harmony, excellent for brands focused on well-being or sustainability.",
      "Creates a sense of balance and restoration, calming for users during complex tasks.",
      "Associated with health and nature, trustworthy for financial or wellness applications."
    ],
    cyan: [
      "Blends the calming effects of blue with the freshness of green, great for healthcare interfaces.",
      "Evokes clarity and clean precision, excellent for technical or scientific applications.",
      "Creates a sense of reliability with a fresh approach, balancing professionalism with approachability."
    ],
    blue: [
      "Inspires trust and dependability, ideal for professional services and security-focused interfaces.",
      "Creates a sense of calmness and stability, helpful for reducing cognitive load in complex interfaces.",
      "Associated with intelligence and communication, effective for technology and information-based services."
    ],
    purple: [
      "Conveys creativity with a touch of luxury, perfect for premium or innovative brands.",
      "Balances stimulation with sophistication, creating a thoughtful and quality impression.",
      "Associated with wisdom and imagination, excellent for educational or artistic contexts."
    ],
    magenta: [
      "Combines the energy of red with the creativity of purple, great for brands wanting to stand out.",
      "Creates a bold, contemporary impression while maintaining approachability.",
      "Effective for highlighting features or creating visual intrigue in your interface."
    ]
  };
  
  // Determine color category based on hue
  let category: string;
  if (hue >= 0 && hue < 30) category = "red";
  else if (hue >= 30 && hue < 60) category = "orange";
  else if (hue >= 60 && hue < 120) category = "yellow";
  else if (hue >= 120 && hue < 180) category = "green";
  else if (hue >= 180 && hue < 210) category = "cyan";
  else if (hue >= 210 && hue < 270) category = "blue";
  else if (hue >= 270 && hue < 330) category = "purple";
  else category = "magenta";
  
  // Role-specific meanings
  if (role === 'primary') {
    return meanings[category][0];
  } else if (role === 'secondary') {
    return meanings[category][1];
  } else {
    return meanings[category][2];
  }
};

// Generate brand goals explanation with detailed color theory reasoning
const generateBrandGoalsExplanation = (harmonyType: string, primary: string, secondary: string, accent: string): string => {
  const primaryRgb = hexToRgb(primary);
  const { h: primaryHue } = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  
  const explanations: Record<string, string> = {
    complementary: `This complementary palette uses colors opposite on the color wheel (${Math.round(primaryHue)}° and ${Math.round((primaryHue + 180) % 360)}°) to create maximum visual impact and energy. The high contrast naturally draws attention and creates a dynamic, confident brand presence. Perfect for brands wanting to stand out in competitive markets and convey boldness and innovation.`,
    
    analogous: `This analogous palette uses neighboring colors (${Math.round(primaryHue - 30)}°-${Math.round(primaryHue + 30)}°) to create natural harmony and visual flow. The gentle transitions between hues evoke feelings of calm, reliability, and sophisticated elegance. Ideal for brands focused on trust, stability, and creating a premium, cohesive experience.`,
    
    triadic: `This triadic palette uses three colors evenly spaced (${Math.round(primaryHue)}°, ${Math.round((primaryHue + 120) % 360)}°, ${Math.round((primaryHue + 240) % 360)}°) on the color wheel, creating vibrant diversity while maintaining perfect balance. This approach signals creativity, innovation, and versatility - perfect for brands that want to appear forward-thinking and dynamic while remaining approachable.`,
    
    'split-complementary': `This split-complementary palette combines your primary color with two colors adjacent to its complement (${Math.round((primaryHue + 150) % 360)}° and ${Math.round((primaryHue + 210) % 360)}°), offering strong contrast with more subtle sophistication than pure complementary schemes. This creates visual interest without tension, perfect for brands balancing professionalism with approachability.`,
    
    square: `This square (tetradic) palette uses four colors evenly distributed around the color wheel, offering maximum variety while maintaining harmonic balance. The rich color possibilities allow for complex visual hierarchies and diverse applications, ideal for brands with multiple product lines or services that need versatile yet cohesive identity systems.`,
    
    monochromatic: `This monochromatic palette explores the full range of your chosen hue through variations in saturation and lightness. This approach creates sophisticated unity and timeless elegance, allowing subtle distinctions while maintaining strong brand recognition. Perfect for luxury brands or those wanting to convey expertise, precision, and refined taste.`
  };
  
  return explanations[harmonyType] || "This scientifically-crafted palette balances color theory principles with practical usability, ensuring your brand communicates effectively while maintaining visual harmony across all applications.";
};

// Generate accessibility explanation
const generateAccessibilityExplanation = (
  whiteOnPrimary: number,
  blackOnPrimary: number,
  whiteOnSecondary: number,
  blackOnSecondary: number,
  whiteOnAccent: number,
  blackOnAccent: number,
  primaryOnNeutral: number
): string => {
  const passesAAPrimary = whiteOnPrimary >= 4.5 || blackOnPrimary >= 4.5;
  const passesAAAsPrimary = whiteOnPrimary >= 7 || blackOnPrimary >= 7;
  const passesAASecondary = whiteOnSecondary >= 4.5 || blackOnSecondary >= 4.5;
  const passesAAASecondary = whiteOnSecondary >= 7 || blackOnSecondary >= 7;
  const passesAAAccent = whiteOnAccent >= 4.5 || blackOnAccent >= 4.5;
  
  if (passesAAAsPrimary && passesAAASecondary && passesAAAccent && primaryOnNeutral >= 4.5) {
    return "This palette exceeds WCAG AAA standards for all primary text combinations, ensuring maximum readability and accessibility for all users, including those with visual impairments.";
  } else if (passesAAPrimary && passesAASecondary && passesAAAccent) {
    return "This palette meets WCAG AA standards for text contrast, providing good readability for most users. The color combinations ensure that content remains accessible while maintaining visual appeal.";
  } else if (passesAAPrimary || passesAASecondary) {
    return "This palette provides accessible text contrast for primary content areas, meeting WCAG AA standards where most critical. Some decorative elements may have lower contrast for visual impact.";
  } else {
    return "This palette prioritizes visual impact for UI elements and illustrations. For text content, consider using the neutral colors which provide better contrast and readability.";
  }
};

// Generate detailed harmony explanation with color theory insights
const generateHarmonyExplanation = (harmonyType: string, primary: string, secondary: string, accent: string): string => {
  const primaryRgb = hexToRgb(primary);
  const { h: primaryHue, s: primarySat, l: primaryLight } = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  const secondaryRgb = hexToRgb(secondary);
  const { h: secondaryHue, s: secondarySat, l: secondaryLight } = rgbToHsl(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  const accentRgb = hexToRgb(accent);
  const { h: accentHue, s: accentSat, l: accentLight } = rgbToHsl(accentRgb.r, accentRgb.g, accentRgb.b);
  
  const explanations: Record<string, string> = {
    complementary: `This complementary harmony positions colors exactly ${Math.round(Math.abs(primaryHue - secondaryHue))}° apart on the color wheel, creating maximum chromatic contrast. The opposing hues naturally create visual tension that energizes the design while the variations in saturation (${Math.round(primarySat)}% vs ${Math.round(secondarySat)}%) and lightness (${Math.round(primaryLight)}% vs ${Math.round(secondaryLight)}%) add subtle depth and hierarchy.`,
    
    analogous: `This analogous harmony uses colors within a ${Math.round(Math.max(Math.abs(primaryHue - secondaryHue), Math.abs(primaryHue - accentHue)))}° range on the color wheel, creating natural visual flow. The gentle hue transitions (${Math.round(primaryHue)}° → ${Math.round(secondaryHue)}° → ${Math.round(accentHue)}°) combined with strategic lightness variations (${Math.round(primaryLight)}%, ${Math.round(secondaryLight)}%, ${Math.round(accentLight)}%) create depth without discord.`,
    
    triadic: `This triadic harmony achieves perfect geometric balance with colors spaced approximately 120° apart (${Math.round(primaryHue)}°, ${Math.round(secondaryHue)}°, ${Math.round(accentHue)}°). The equal spacing ensures no single color dominates while varied saturation levels (${Math.round(primarySat)}%, ${Math.round(secondarySat)}%, ${Math.round(accentSat)}%) create visual hierarchy and prevent the palette from feeling overly vibrant.`,
    
    'split-complementary': `This split-complementary harmony takes your primary hue (${Math.round(primaryHue)}°) and pairs it with colors adjacent to its complement (${Math.round(secondaryHue)}° and ${Math.round(accentHue)}°), creating strong contrast with reduced tension. The strategic lightness distribution (${Math.round(primaryLight)}%, ${Math.round(secondaryLight)}%, ${Math.round(accentLight)}%) ensures readability while maintaining visual impact.`,
    
    square: `This square harmony creates perfect balance using four colors evenly distributed around the color wheel. The 90° intervals (${Math.round(primaryHue)}°, ${Math.round(secondaryHue)}°, etc.) provide maximum color diversity while the complementary pairs within the square ensure harmonious relationships. Varied saturation levels prevent overwhelming vibrancy.`,
    
    monochromatic: `This monochromatic harmony explores the full potential of the ${Math.round(primaryHue)}° hue through strategic saturation (${Math.round(primarySat)}%, ${Math.round(secondarySat)}%, ${Math.round(accentSat)}%) and lightness variations (${Math.round(primaryLight)}%, ${Math.round(secondaryLight)}%, ${Math.round(accentLight)}%). This creates sophisticated depth and hierarchy without chromatic discord, perfect for conveying refinement and brand consistency.`
  };
  
  return explanations[harmonyType] || "This color harmony follows established color theory principles, using mathematical relationships on the color wheel combined with strategic saturation and lightness adjustments to create both visual appeal and functional usability.";
};

// Main function to generate palettes
export const generatePalettes = async (brandColors: string[]): Promise<Palette[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const palettes: Palette[] = [];
  
  // Generate 20 palettes with improved color harmony based on input colors
  for (let i = 0; i < 20; i++) {
    palettes.push(generatePaletteSet(brandColors, i));
  }
  
  return palettes;
};
