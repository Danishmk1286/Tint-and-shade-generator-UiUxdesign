
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import ColorPickerMultiple from '@/components/ColorPickerMultiple';
import PaletteGrid from '@/components/PaletteGrid';
import PaletteDetails from '@/components/PaletteDetails';
import { Palette } from '@/types/palette';
import { generatePalettes } from '@/utils/paletteGenerator';

const PaletteGenerator = () => {
  const [brandColors, setBrandColors] = useState<string[]>(['#3b82f6']);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState<'input' | 'grid' | 'details'>('input');

  const handleAddColor = () => {
    if (brandColors.length < 3) {
      setBrandColors([...brandColors, '#ffffff']);
    }
  };

  const handleRemoveColor = (index: number) => {
    if (brandColors.length > 1) {
      const newColors = [...brandColors];
      newColors.splice(index, 1);
      setBrandColors(newColors);
    }
  };

  const handleUpdateColor = (index: number, color: string) => {
    const newColors = [...brandColors];
    newColors[index] = color;
    setBrandColors(newColors);
  };

  const handleGeneratePalettes = async () => {
    setIsGenerating(true);
    try {
      // Generate palettes based on brand colors
      const generatedPalettes = await generatePalettes(brandColors);
      setPalettes(generatedPalettes);
      setCurrentView('grid');
    } catch (error) {
      console.error('Error generating palettes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPalette = (palette: Palette) => {
    setSelectedPalette(palette);
    setCurrentView('details');
  };

  const handleBack = () => {
    if (currentView === 'details') {
      setCurrentView('grid');
    } else if (currentView === 'grid') {
      setCurrentView('input');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Toaster position="top-center" />
      
      <div className="container max-w-5xl mx-auto px-4 py-12 sm:py-16 md:py-24 space-y-12">
        <Header />
        
        <main className="space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-xl shadow-sm border p-6"
          >
            {currentView === 'input' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Brand Colors</h2>
                  <p className="text-muted-foreground mb-6">
                    Enter up to 3 brand colors to generate harmonious palette suggestions.
                  </p>
                  
                  <div className="space-y-4">
                    {brandColors.map((color, index) => (
                      <ColorPickerMultiple
                        key={index}
                        color={color}
                        onChange={(color) => handleUpdateColor(index, color)}
                        onRemove={() => handleRemoveColor(index)}
                        canRemove={brandColors.length > 1}
                        index={index}
                      />
                    ))}
                    
                    {brandColors.length < 3 && (
                      <Button 
                        onClick={handleAddColor}
                        variant="outline"
                        className="mt-2"
                      >
                        Add Another Color
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={handleGeneratePalettes}
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Palettes'}
                </Button>
              </div>
            )}
            
            {currentView === 'grid' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">AI Generated Palettes</h2>
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                  >
                    Back to Colors
                  </Button>
                </div>
                <PaletteGrid 
                  palettes={palettes} 
                  onSelectPalette={handleSelectPalette} 
                />
              </div>
            )}
            
            {currentView === 'details' && selectedPalette && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Palette Details</h2>
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                  >
                    Back to Palettes
                  </Button>
                </div>
                <PaletteDetails palette={selectedPalette} />
              </div>
            )}
          </motion.section>
        </main>
      </div>
    </div>
  );
};

export default PaletteGenerator;
