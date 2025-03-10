
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { convertColor, isColorLight } from '@/utils/colorUtils';
import { Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColorCardProps {
  color: string;
  index: number;
  type: 'tint' | 'shade' | 'base';
  delay?: number;
  format: 'hex' | 'rgb' | 'hsl';
  weight?: number;
}

const ColorCard: React.FC<ColorCardProps> = ({ 
  color, 
  index, 
  type, 
  delay = 0,
  format = 'hex',
  weight
}) => {
  const [copied, setCopied] = React.useState(false);
  
  // Format the color and fix to 2 decimal places for HSL and RGB
  const formattedColor = formatColorValue(color, format);
  const isLight = isColorLight(color);
  
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formattedColor);
    setCopied(true);
    
    toast({
      title: 'Color copied',
      description: `${formattedColor} has been copied to clipboard.`,
      duration: 2000,
    });
    
    setTimeout(() => setCopied(false), 1000);
  };
  
  return (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: delay * 0.05 }}
              className={cn(
                'relative group h-16 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 w-full',
                'hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg'
              )}
              style={{ backgroundColor: color }}
              onClick={copyToClipboard}
              tabIndex={0}
              role="button"
              aria-label={`${type} color ${formattedColor}`}
            >
              <div 
                className={cn(
                  'absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100',
                  'transition-opacity duration-200 flex items-center justify-center'
                )}
              >
                <button
                  className={cn(
                    'p-2 rounded-full',
                    isLight ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
                  )}
                  aria-label="Copy color code"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formattedColor}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="text-xs mt-1 font-medium text-center w-full">
        {weight && (
          <p className="text-xs opacity-70 mb-0.5">
            {weight}
          </p>
        )}
        <p className="truncate max-w-full text-[10px] font-mono">
          {formattedColor}
        </p>
      </div>
    </div>
  );
};

// Helper function to format color values with fixed decimal places
function formatColorValue(color: string, format: 'hex' | 'rgb' | 'hsl'): string {
  const formattedColor = convertColor(color, format);
  
  if (format === 'hex') {
    return formattedColor;
  }
  
  // For RGB format, fix decimal places
  if (format === 'rgb') {
    return formattedColor.replace(/(\d+\.\d{3,})/g, (match) => parseFloat(match).toFixed(2));
  }
  
  // For HSL format, fix decimal places
  if (format === 'hsl') {
    return formattedColor.replace(/(\d+\.\d{3,}%)/g, (match) => {
      const value = parseFloat(match);
      return value.toFixed(2) + '%';
    });
  }
  
  return formattedColor;
}

export default ColorCard;
