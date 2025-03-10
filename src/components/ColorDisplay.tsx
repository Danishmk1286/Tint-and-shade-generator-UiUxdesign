
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ColorCard from './ColorCard';
import { generateTints, generateShades, convertColor } from '@/utils/colorUtils';
import { Button } from './ui/button';

interface ColorDisplayProps {
  baseColor: string;
  tintCount: number;
  shadeCount: number;
  className?: string;
}

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const ColorDisplay: React.FC<ColorDisplayProps> = ({
  baseColor,
  tintCount,
  shadeCount,
  className,
}) => {
  const [activeFormat, setActiveFormat] = useState<ColorFormat>('hex');
  
  // Generate color variants
  const tints = generateTints(baseColor, tintCount);
  const shades = generateShades(baseColor, shadeCount);
  
  // Check if we have any variants to display
  const hasVariants = tintCount > 0 || shadeCount > 0;

  // Format button handler
  const handleFormatChange = (format: ColorFormat) => {
    setActiveFormat(format);
  };
  
  return (
    <div className={cn('space-y-8', className)}>
      {/* Format buttons */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {(['hex', 'rgb', 'hsl'] as const).map((format) => (
          <Button
            key={format}
            variant={activeFormat === format ? "default" : "outline"}
            size="sm"
            onClick={() => handleFormatChange(format)}
            className={cn(
              "transition-all duration-300 uppercase text-xs font-medium",
              activeFormat === format ? "shadow-md" : ""
            )}
          >
            {format}
          </Button>
        ))}
      </div>
      
      {/* Variants */}
      {hasVariants && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Tints */}
          {tintCount > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tints</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                {tints.map((color, index) => (
                  <ColorCard 
                    key={`tint-${index}`} 
                    color={color} 
                    index={index} 
                    type="tint"
                    delay={index}
                    format={activeFormat}
                    weight={(index + 1) * 50}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Shades */}
          {shadeCount > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shades</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
                {shades.map((color, index) => (
                  <ColorCard 
                    key={`shade-${index}`} 
                    color={color} 
                    index={index} 
                    type="shade"
                    delay={index}
                    format={activeFormat}
                    weight={(index + 1) * 50}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Instructions */}
      {!hasVariants && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground p-8"
        >
          <p>Adjust the sliders above to generate tints and shades</p>
        </motion.div>
      )}
    </div>
  );
};

export default ColorDisplay;
