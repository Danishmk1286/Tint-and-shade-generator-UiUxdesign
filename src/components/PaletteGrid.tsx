
import React from 'react';
import { Palette } from '@/types/palette';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaletteGridProps {
  palettes: Palette[];
  onSelectPalette: (palette: Palette) => void;
}

const PaletteGrid: React.FC<PaletteGridProps> = ({ palettes, onSelectPalette }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {palettes.map((palette) => (
        <Card key={palette.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-16 grid grid-cols-5">
            <div style={{ backgroundColor: palette.primary.hex }} className="col-span-1" />
            <div style={{ backgroundColor: palette.secondary.hex }} className="col-span-1" />
            <div style={{ backgroundColor: palette.accent.hex }} className="col-span-1" />
            <div style={{ backgroundColor: palette.neutral.light.hex }} className="col-span-1" />
            <div style={{ backgroundColor: palette.neutral.dark.hex }} className="col-span-1" />
          </div>
          
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">{palette.name}</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Primary</div>
                <div className="text-sm font-mono">{palette.primary.hex}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Secondary</div>
                <div className="text-sm font-mono">{palette.secondary.hex}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Accent</div>
                <div className="text-sm font-mono">{palette.accent.hex}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Neutral</div>
                <div className="text-sm font-mono">{palette.neutral.light.hex}</div>
              </div>
            </div>
            
            <Button 
              onClick={() => onSelectPalette(palette)}
              className="w-full"
              variant="outline"
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaletteGrid;
