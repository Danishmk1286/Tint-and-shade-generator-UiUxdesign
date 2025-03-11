
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
  
  // Format the color based on requested format
  const formattedColor = formatColorValue(color, format);
  const isLight = isColorLight(color);
  
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formattedColor);
    setCopied(true);
    
    toast(`${formattedColor} has been copied to clipboard.`, {
      description: 'Color copied',
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
                'relative group h-16 sm:h-20 md:h-24 rounded-lg overflow-hidden transition-all duration-300 w-full',
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
      
      <div className="text-xs mt-2 font-medium text-center w-full">
        {weight && (
          <p className="text-sm opacity-70 mb-1">
            {weight}
          </p>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-[11px] sm:text-xs whitespace-nowrap overflow-hidden text-ellipsis px-1 max-w-full cursor-pointer">
              {formattedColor}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formattedColor}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

// Helper function to format color values with fixed decimal places
function formatColorValue(color: string, format: 'hex' | 'rgb' | 'hsl'): string {
  try {
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
  } catch (error) {
    console.error("Error formatting color:", error);
    // Return the original color if there's an error
    return color;
  }
}

export default ColorCard;
