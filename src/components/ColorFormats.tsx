
import React from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { hexToRgb, rgbToHsl } from '@/utils/colorUtils';

interface ColorFormatProps {
  color: string;
  className?: string;
}

const ColorFormats: React.FC<ColorFormatProps> = ({ color, className }) => {
  // Generate all the different formats
  const hexCode = color.toUpperCase();
  const rgbValues = hexToRgb(color);
  const rgbCode = `RGB(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;
  const hslValues = rgbToHsl(rgbValues.r, rgbValues.g, rgbValues.b);
  const hslCode = `HSL(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`;
  
  // Additional formats
  const cmykValues = hexToCmyk(color);
  const cmykCode = `CMYK(${cmykValues.c}%, ${cmykValues.m}%, ${cmykValues.y}%, ${cmykValues.k}%)`;
  const hsvValues = rgbToHsv(rgbValues.r, rgbValues.g, rgbValues.b);
  const hsvCode = `HSV(${hsvValues.h}, ${hsvValues.s}%, ${hsvValues.v}%)`;
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied`,
      description: `${text} has been copied to clipboard.`,
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8", className)}
    >
      <ColorFormatCard label="HEX" value={hexCode} onClick={() => copyToClipboard(hexCode, "HEX")} />
      <ColorFormatCard label="RGB" value={rgbCode} onClick={() => copyToClipboard(rgbCode, "RGB")} />
      <ColorFormatCard label="HSL" value={hslCode} onClick={() => copyToClipboard(hslCode, "HSL")} />
      <ColorFormatCard label="CMYK" value={cmykCode} onClick={() => copyToClipboard(cmykCode, "CMYK")} />
      <ColorFormatCard label="HSV" value={hsvCode} onClick={() => copyToClipboard(hsvCode, "HSV")} />
    </motion.div>
  );
};

interface ColorFormatCardProps {
  label: string;
  value: string;
  onClick: () => void;
}

const ColorFormatCard: React.FC<ColorFormatCardProps> = ({ label, value, onClick }) => {
  return (
    <div 
      className="bg-secondary/50 rounded-lg p-3 flex flex-col space-y-1 hover:bg-secondary transition-colors cursor-pointer border"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        <Copy size={14} className="text-muted-foreground" />
      </div>
      <div className="font-mono text-sm truncate">{value}</div>
    </div>
  );
};

// Helper functions for additional color formats
function hexToCmyk(hex: string): { c: number; m: number; y: number; k: number } {
  const { r, g, b } = hexToRgb(hex);
  
  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;
  
  const k = 1 - Math.max(rNormalized, gNormalized, bNormalized);
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  
  const c = Math.round(((1 - rNormalized - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNormalized - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNormalized - k) / (1 - k)) * 100);
  const kPercent = Math.round(k * 100);
  
  return { c, m, y, k: kPercent };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;
  
  const max = Math.max(rNormalized, gNormalized, bNormalized);
  const min = Math.min(rNormalized, gNormalized, bNormalized);
  const delta = max - min;
  
  let h = 0;
  
  if (delta !== 0) {
    if (max === rNormalized) {
      h = ((gNormalized - bNormalized) / delta) % 6;
    } else if (max === gNormalized) {
      h = (bNormalized - rNormalized) / delta + 2;
    } else {
      h = (rNormalized - gNormalized) / delta + 4;
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  
  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);
  
  return { h, s, v };
}

export default ColorFormats;
