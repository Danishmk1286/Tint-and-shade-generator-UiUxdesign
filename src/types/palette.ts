
export interface ColorInfo {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  meaning: string;
}

export interface PaletteAccessibility {
  textOnPrimary: {
    whiteContrast: number;
    blackContrast: number;
    passesAA: boolean;
    passesAAA: boolean;
  };
  textOnSecondary: {
    whiteContrast: number;
    blackContrast: number;
    passesAA: boolean;
    passesAAA: boolean;
  };
  textOnAccent: {
    whiteContrast: number;
    blackContrast: number;
    passesAA: boolean;
    passesAAA: boolean;
  };
  primaryOnNeutral: {
    contrast: number;
    passesAA: boolean;
    passesAAA: boolean;
  };
  isColorBlindFriendly: boolean;
}

export interface Palette {
  id: string;
  name: string;
  primary: ColorInfo;
  secondary: ColorInfo;
  accent: ColorInfo;
  neutral: {
    light: ColorInfo;
    dark: ColorInfo;
  };
  accessibility: PaletteAccessibility;
  reasoning: {
    brandGoals: string;
    accessibilityReasoning: string;
    harmonyExplanation: string;
  };
}
