
import React from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface VariantSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  type: 'tint' | 'shade';
  className?: string;
}

const VariantSlider: React.FC<VariantSliderProps> = ({
  value,
  onChange,
  max = 20,
  type,
  className,
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={`${type}-count`} className="text-sm font-medium">
          {type === 'tint' ? 'Tint Variants' : 'Shade Variants'}
        </Label>
        <span className="text-sm font-medium tabular-nums">{value}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= 0}
          className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:opacity-50 transition-colors"
          aria-label={`Decrease ${type} count`}
        >
          <MinusCircle size={20} />
        </button>
        
        <Slider
          id={`${type}-count`}
          value={[value]}
          max={max}
          step={1}
          onValueChange={(values) => onChange(values[0])}
          className="flex-1"
          aria-label={`${type} variants count slider`}
        />
        
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:opacity-50 transition-colors"
          aria-label={`Increase ${type} count`}
        >
          <PlusCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default VariantSlider;
