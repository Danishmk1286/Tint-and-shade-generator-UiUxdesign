
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
      {/* Format selector with heading */}
      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-6">
        <span className="text-base font-medium">Color Format:</span>
        <div className="flex items-center gap-3">
          {(['hex', 'rgb', 'hsl'] as const).map((format) => (
            <Button
              key={format}
              variant={activeFormat === format ? "default" : "outline"}
              size="sm"
              onClick={() => handleFormatChange(format)}
              className={cn(
                "transition-all duration-300 uppercase text-sm font-medium min-w-[70px] sm:min-w-[80px]",
                activeFormat === format ? "shadow-md" : ""
              )}
            >
              {format}
            </Button>
          ))}
        </div>
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
              <h3 className="text-xl font-semibold">Tints</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 md:gap-4">
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
              <h3 className="text-xl font-semibold">Shades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 md:gap-4">
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
