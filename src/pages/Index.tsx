
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import ColorPicker from '@/components/ColorPicker';
import VariantSlider from '@/components/VariantSlider';
import ColorDisplay from '@/components/ColorDisplay';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';

const MAX_VARIANTS = 10;

const Index = () => {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [tintCount, setTintCount] = useState(3);
  const [shadeCount, setShadeCount] = useState(3);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Toaster position="top-center" />
      
      <div className="container max-w-5xl mx-auto px-4 py-12 sm:py-16 md:py-24 space-y-12">
        <Header />
        
        <main className="space-y-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-xl shadow-sm border p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Color picker */}
              <div className="md:col-span-5">
                <ColorPicker 
                  color={baseColor} 
                  onChange={setBaseColor} 
                />
              </div>
              
              <div className="md:col-span-1 flex justify-center items-center py-4">
                <Separator className="md:hidden" />
                <Separator orientation="vertical" className="hidden md:block h-full" />
              </div>
              
              {/* Variant controls */}
              <div className="md:col-span-6 space-y-6">
                <VariantSlider
                  value={tintCount}
                  onChange={setTintCount}
                  max={MAX_VARIANTS}
                  type="tint"
                />
                
                <VariantSlider
                  value={shadeCount}
                  onChange={setShadeCount}
                  max={MAX_VARIANTS}
                  type="shade"
                />
              </div>
            </div>
          </motion.section>
          
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pb-12"
          >
            <ColorDisplay
              baseColor={baseColor}
              tintCount={tintCount}
              shadeCount={shadeCount}
            />
          </motion.section>
        </main>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground pt-6 border-t"
        >
          <p>
            Click on any color to cycle through HEX, RGB, and HSL formats.
          </p>
          <p className="mt-1">
            Click the copy icon to copy the color code to your clipboard.
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
