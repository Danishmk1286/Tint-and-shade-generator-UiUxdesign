import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { hexToRgb, rgbToHex } from '@/utils/colorUtils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Normalize color input to ensure it's a valid hex color
  const normalizeColor = (input: string): string => {
    // If it's already a valid hex color, return it
    if (/^#[0-9A-F]{6}$/i.test(input)) {
      return input;
    }
    
    // If it's a 3-digit hex color, convert it to 6-digit
    if (/^#[0-9A-F]{3}$/i.test(input)) {
      return '#' + input[1] + input[1] + input[2] + input[2] + input[3] + input[3];
    }
    
    // If it's a hex color without #, add it
    if (/^[0-9A-F]{6}$/i.test(input)) {
      return '#' + input;
    }
    
    // If it's a 3-digit hex color without #, convert it to 6-digit with #
    if (/^[0-9A-F]{3}$/i.test(input)) {
      return '#' + input[0] + input[0] + input[1] + input[1] + input[2] + input[2];
    }
    
    // Try to interpret as RGB
    const rgbMatch = input.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return rgbToHex(r, g, b);
      }
    }
    
    // Default to the current color if input is invalid
    return color;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange(normalizeColor(value));
  };
  
  // Keep the input value in sync with the color prop
  useEffect(() => {
    if (inputRef.current) {
      // Only update the input value if it's different from the color prop
      // and the input doesn't have focus
      if (inputRef.current !== document.activeElement) {
        inputRef.current.value = color;
      }
    }
  }, [color]);
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center space-x-4">
        <div>
          <Label htmlFor="color-picker" className="text-sm font-medium">
            Base Color
          </Label>
          <div className="mt-1.5 flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded border overflow-hidden shadow-sm"
              style={{ backgroundColor: color }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer"
                aria-label="Color picker"
              />
            </div>
           
            <Input
              ref={inputRef}
              id="color-picker"
              type="text"
              defaultValue={color}
              onChange={handleInputChange}
              onBlur={(e) => {
                const normalizedColor = normalizeColor(e.target.value);
                e.target.value = normalizedColor;
                onChange(normalizedColor);
              }}
              className="w-32 h-10 font-mono"
              placeholder="#RRGGBB"
              aria-label="Color hex code"
            />


          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
