
import { Palette } from '@/types/palette';
import { v4 as uuidv4 } from 'uuid';
import { hexToRgb, rgbToHsl } from './colorUtils';

// Mock function to calculate contrast ratio between two colors
const calculateContrastRatio = (color1: string, color2: string): number => {
  // In a real implementation, this would calculate the actual contrast ratio
  // For now, we'll return a random value between 2 and 10
  return 2 + Math.random() * 8;
};

// This is a mock implementation that generates random palettes
// In a real implementation, this would use AI algorithms or color theory
export const generatePalettes = async (brandColors: string[]): Promise<Palette[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const palettes: Palette[] = [];
  
  // Generate 20 palettes
  for (let i = 0; i < 20; i++) {
    const paletteNames = [
      "Oceanic Harmony", "Digital Bloom", "Urban Elegance", "Sunset Gradient",
      "Forest Whisper", "Tech Innovator", "Royal Contrast", "Earthy Balance",
      "Vivid Dimension", "Subtle Professional", "Cosmic Journey", "Mellow Tones",
      "Bold Statement", "Tranquil Space", "Vibrant Clarity", "Minimal Contrast",
      "Deep Ocean", "Soft Dawn", "Electric Vision", "Classic Refined"
    ];
    
    const colorNames = [
      "Ocean Blue", "Coral Pink", "Forest Green", "Sunset Orange", "Royal Purple",
      "Slate Gray", "Ruby Red", "Emerald Green", "Sapphire Blue", "Amethyst Purple",
      "Charcoal Gray", "Mint Green", "Crimson Red", "Sky Blue", "Lavender Purple",
      "Golden Yellow", "Turquoise Blue", "Magenta Pink", "Olive Green", "Navy Blue"
    ];
    
    // Generate a random primary color, slightly modified from the brand color
    const primaryBase = brandColors[0];
    const { r, g, b } = hexToRgb(primaryBase);
    
    // Create random variations for the palette
    const primary = {
      name: colorNames[Math.floor(Math.random() * colorNames.length)],
      hex: brandColors[0],
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${rgbToHsl(r, g, b).h}, ${rgbToHsl(r, g, b).s}%, ${rgbToHsl(r, g, b).l}%)`,
      meaning: "This color evokes trust and reliability, making it ideal for establishing brand authority."
    };
    
    // Generate secondary color (complementary to primary)
    const secondaryR = Math.floor(Math.random() * 255);
    const secondaryG = Math.floor(Math.random() * 255);
    const secondaryB = Math.floor(Math.random() * 255);
    const secondary = {
      name: colorNames[Math.floor(Math.random() * colorNames.length)],
      hex: `#${secondaryR.toString(16).padStart(2, '0')}${secondaryG.toString(16).padStart(2, '0')}${secondaryB.toString(16).padStart(2, '0')}`,
      rgb: `rgb(${secondaryR}, ${secondaryG}, ${secondaryB})`,
      hsl: `hsl(${rgbToHsl(secondaryR, secondaryG, secondaryB).h}, ${rgbToHsl(secondaryR, secondaryG, secondaryB).s}%, ${rgbToHsl(secondaryR, secondaryG, secondaryB).l}%)`,
      meaning: "This color creates a balanced contrast with the primary color, enhancing visual hierarchy."
    };
    
    // Generate accent color (vibrant and attention-grabbing)
    const accentR = Math.floor(Math.random() * 255);
    const accentG = Math.floor(Math.random() * 255);
    const accentB = Math.floor(Math.random() * 255);
    const accent = {
      name: colorNames[Math.floor(Math.random() * colorNames.length)],
      hex: `#${accentR.toString(16).padStart(2, '0')}${accentG.toString(16).padStart(2, '0')}${accentB.toString(16).padStart(2, '0')}`,
      rgb: `rgb(${accentR}, ${accentG}, ${accentB})`,
      hsl: `hsl(${rgbToHsl(accentR, accentG, accentB).h}, ${rgbToHsl(accentR, accentG, accentB).s}%, ${rgbToHsl(accentR, accentG, accentB).l}%)`,
      meaning: "This vibrant color draws attention to key elements, perfect for calls-to-action and highlights."
    };
    
    // Generate neutral light
    const neutralLightR = 240 + Math.floor(Math.random() * 15);
    const neutralLightG = 240 + Math.floor(Math.random() * 15);
    const neutralLightB = 240 + Math.floor(Math.random() * 15);
    const neutralLight = {
      name: "Soft White",
      hex: `#${neutralLightR.toString(16).padStart(2, '0')}${neutralLightG.toString(16).padStart(2, '0')}${neutralLightB.toString(16).padStart(2, '0')}`,
      rgb: `rgb(${neutralLightR}, ${neutralLightG}, ${neutralLightB})`,
      hsl: `hsl(${rgbToHsl(neutralLightR, neutralLightG, neutralLightB).h}, ${rgbToHsl(neutralLightR, neutralLightG, neutralLightB).s}%, ${rgbToHsl(neutralLightR, neutralLightG, neutralLightB).l}%)`,
      meaning: "This light neutral creates breathing room and improves readability in text-heavy sections."
    };
    
    // Generate neutral dark
    const neutralDarkR = 30 + Math.floor(Math.random() * 30);
    const neutralDarkG = 30 + Math.floor(Math.random() * 30);
    const neutralDarkB = 30 + Math.floor(Math.random() * 30);
    const neutralDark = {
      name: "Deep Charcoal",
      hex: `#${neutralDarkR.toString(16).padStart(2, '0')}${neutralDarkG.toString(16).padStart(2, '0')}${neutralDarkB.toString(16).padStart(2, '0')}`,
      rgb: `rgb(${neutralDarkR}, ${neutralDarkG}, ${neutralDarkB})`,
      hsl: `hsl(${rgbToHsl(neutralDarkR, neutralDarkG, neutralDarkB).h}, ${rgbToHsl(neutralDarkR, neutralDarkG, neutralDarkB).s}%, ${rgbToHsl(neutralDarkR, neutralDarkG, neutralDarkB).l}%)`,
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
    
    palettes.push({
      id: uuidv4(),
      name: paletteNames[i % paletteNames.length],
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
        isColorBlindFriendly: Math.random() > 0.3, // 70% chance of being colorblind friendly
      },
      reasoning: {
        brandGoals: "This palette aims to create a balanced visual identity that conveys professionalism while maintaining a modern appeal. The contrast between colors provides clear hierarchy for interface elements.",
        accessibilityReasoning: "The palette has been designed with accessibility in mind, ensuring text remains readable across different color combinations. The high contrast between primary colors and neutrals makes important information stand out.",
        harmonyExplanation: "The colors in this palette follow a complementary relationship, creating visual interest while maintaining harmony. The accent provides a strategic highlight for important elements without overwhelming the overall design.",
      }
    });
  }
  
  return palettes;
};
