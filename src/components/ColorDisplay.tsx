
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ColorCard from './ColorCard';
import ColorFormats from './ColorFormats';
import { generateTints, generateShades, convertColor } from '@/utils/colorUtils';

interface ColorDisplayProps {
  baseColor: string;
  tintCount: number;
  shadeCount: number;
  className?: string;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({
  baseColor,
  tintCount,
  shadeCount,
  className,
}) => {
  // Generate color variants
  const tints = generateTints(baseColor, tintCount);
  const shades = generateShades(baseColor, shadeCount);
  
  // Check if we have any variants to display
  const hasVariants = tintCount > 0 || shadeCount > 0;
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Color formats display */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Color Formats</h3>
        <ColorFormats color={baseColor} />
      </div>
      
      {/* Base color */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Your Color</h3>
        <div className="grid grid-cols-1 gap-4">
          <ColorCard color={baseColor} index={0} type="base" />
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
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Tints</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {tints.map((color, index) => (
                  <ColorCard 
                    key={`tint-${index}`} 
                    color={color} 
                    index={index} 
                    type="tint"
                    delay={index}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Shades */}
          {shadeCount > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Shades</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {shades.map((color, index) => (
                  <ColorCard 
                    key={`shade-${index}`} 
                    color={color} 
                    index={index} 
                    type="shade"
                    delay={index}
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
