
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import { convertColor, isColorLight } from '@/utils/colorUtils';
import { Copy, Check } from 'lucide-react';

interface ColorCardProps {
  color: string;
  index: number;
  type: 'tint' | 'shade' | 'base';
  delay?: number;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, index, type, delay = 0 }) => {
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [copied, setCopied] = useState(false);
  
  const formattedColor = convertColor(color, format);
  const isLight = isColorLight(color);
  
  // Rotate through color formats on click
  const toggleFormat = () => {
    const formats: ('hex' | 'rgb' | 'hsl')[] = ['hex', 'rgb', 'hsl'];
    const currentIndex = formats.indexOf(format);
    const nextIndex = (currentIndex + 1) % formats.length;
    setFormat(formats[nextIndex]);
  };
  
  // Copy color code to clipboard
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formattedColor);
    setCopied(true);
    
    toast('Color copied', {
      description: `${formattedColor} has been copied to clipboard.`,
      duration: 2000,
    });
    
    setTimeout(() => setCopied(false), 1000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.05 }}
      className={cn(
        'relative group h-24 sm:h-32 rounded-lg overflow-hidden transition-all duration-300',
        'hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg',
        type === 'base' && 'col-span-2 h-36 sm:h-48 sm:col-span-2'
      )}
      style={{ backgroundColor: color }}
      onClick={toggleFormat}
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
          onClick={copyToClipboard}
          className={cn(
            'p-2 rounded-full',
            isLight ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
          )}
          aria-label="Copy color code"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
      
      <div 
        className={cn(
          'absolute inset-x-0 bottom-0 p-3 text-xs sm:text-sm font-medium',
          isLight ? 'text-gray-800' : 'text-white'
        )}
      >
        <p 
          className="truncate transition-all duration-200 transform"
        >
          {formattedColor}
        </p>
        {type !== 'base' && (
          <p className="text-xs opacity-70">
            {type === 'tint' ? `Tint ${index + 1}` : `Shade ${index + 1}`}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ColorCard;
