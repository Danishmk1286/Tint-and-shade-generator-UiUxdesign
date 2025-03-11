
/**
 * Converts a hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove the hash if it exists
  const cleanHex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);
  
  return { r, g, b };
}

/**
 * Converts RGB values to a hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Generates tints (lighter variations) of a color
 */
export function generateTints(hex: string, count: number): string[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  const tints: string[] = [];
  const maxLightness = 95; // Max lightness value
  
  // Calculate the step size between each tint
  const step = (maxLightness - l) / (count + 1);
  
  // Generate each tint
  for (let i = 1; i <= count; i++) {
    const newLightness = l + step * i;
    tints.push(`hsl(${h}, ${s}%, ${newLightness}%)`);
  }
  
  return tints;
}

/**
 * Generates shades (darker variations) of a color
 */
export function generateShades(hex: string, count: number): string[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  const shades: string[] = [];
  const minLightness = 5; // Min lightness value
  
  // Calculate the step size between each shade
  const step = (l - minLightness) / (count + 1);
  
  // Generate each shade
  for (let i = 1; i <= count; i++) {
    const newLightness = l - step * i;
    shades.push(`hsl(${h}, ${s}%, ${newLightness}%)`);
  }
  
  return shades;
}

/**
 * Converts a color to a different format
 */
export function convertColor(color: string, format: 'hex' | 'rgb' | 'hsl'): string {
  try {
    // Handle HSL format
    if (color.startsWith('hsl')) {
      // Improved HSL regex to catch different HSL formats
      const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+\.?\d*)%\)/i) || 
                      color.match(/hsl\((\d+)\s+(\d+)%\s+(\d+\.?\d*)%\)/i) ||
                      color.match(/hsl\((\d+),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/i);
      
      if (!matches) {
        console.warn("HSL format not recognized:", color);
        return color;
      }
      
      const h = parseInt(matches[1]);
      const s = parseFloat(matches[2]) / 100;
      const l = parseFloat(matches[3]) / 100;
      
      if (format === 'hsl') {
        return `hsl(${h}, ${(s * 100).toFixed(2)}%, ${(l * 100).toFixed(2)}%)`;
      }
      
      let r, g, b;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hueToRgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hueToRgb(p, q, h / 360 + 1/3);
        g = hueToRgb(p, q, h / 360);
        b = hueToRgb(p, q, h / 360 - 1/3);
      }
      
      r = Math.min(255, Math.max(0, Math.round(r * 255)));
      g = Math.min(255, Math.max(0, Math.round(g * 255)));
      b = Math.min(255, Math.max(0, Math.round(b * 255)));
      
      if (format === 'rgb') {
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        return rgbToHex(r, g, b);
      }
    }
    
    // Handle hex format
    if (color.startsWith('#')) {
      const { r, g, b } = hexToRgb(color);
      
      if (format === 'hex') {
        return color;
      } else if (format === 'rgb') {
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        const { h, s, l } = rgbToHsl(r, g, b);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
    }
    
    // Handle RGB format
    if (color.startsWith('rgb')) {
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i) || 
                     color.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\)/i);
      
      if (!matches) {
        console.warn("RGB format not recognized:", color);
        return color;
      }
      
      const r = parseInt(matches[1]);
      const g = parseInt(matches[2]);
      const b = parseInt(matches[3]);
      
      if (format === 'rgb') {
        return color;
      } else if (format === 'hex') {
        return rgbToHex(r, g, b);
      } else {
        const { h, s, l } = rgbToHsl(r, g, b);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
    }
    
    // If we couldn't identify the color format, return the original
    console.warn("Unknown color format:", color);
    return color;
  } catch (error) {
    console.error("Error converting color:", error);
    return color;
  }
}

/**
 * Determines if a color is light or dark
 */
export function isColorLight(color: string): boolean {
  let r, g, b;
  
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
  } else if (color.startsWith('rgb')) {
    const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i) || 
                   color.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\)/i);
    
    if (!matches) {
      return true;
    }
    
    r = parseInt(matches[1]);
    g = parseInt(matches[2]);
    b = parseInt(matches[3]);
  } else if (color.startsWith('hsl')) {
    const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+\.?\d*)%\)/i) || 
                   color.match(/hsl\((\d+)\s+(\d+)%\s+(\d+\.?\d*)%\)/i);
    
    if (!matches) {
      return true;
    }
    
    // For HSL, we can just use the lightness value
    const l = parseFloat(matches[3]);
    return l > 50;
  } else {
    return true;
  }
  
  // Calculate the perceived brightness using the formula:
  // (R * 0.299 + G * 0.587 + B * 0.114) / 255
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  
  // If brightness is greater than 0.5, the color is considered light
  return brightness > 0.5;
}
