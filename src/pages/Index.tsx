import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import ColorPicker from '@/components/ColorPicker';
import VariantSlider from '@/components/VariantSlider';
import ColorDisplay from '@/components/ColorDisplay';
import FAQSection from '@/components/FAQSection';
import { Separator } from '@/components/ui/separator';

const MAX_VARIANTS = 20;

const Index = () => {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [tintCount, setTintCount] = useState(10);
  const [shadeCount, setShadeCount] = useState(10);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Toaster position="top-center" />
      
      <div className="container max-w-5xl mx-auto px-4 py-12 sm:py-16 md:py-24 space-y-12">
        <Header />
        
        <main className="space-y-16">
          <article className="text-center space-y-4 max-w-4xl mx-auto">
            <p className="text-muted-foreground">
              Easily create color tints and shades for web design, UI mockups, branding palettes and more. 
              Our tool supports HEX and RGB values, making it perfect for designers and developers who need 
              accessible color variations.
            </p>
          </article>
          
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

          <FAQSection />
        </main>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground pt-6 border-t space-y-3"
        >
          <div>
            <p>
              Hover on any color to see the code format, click to copy to clipboard.
            </p>
            <p className="mt-1">
              Use the format buttons to switch between HEX, RGB, and HSL display modes.
            </p>
          </div>
          <div className="pt-4 border-t">
            <p>&copy; 2024 Shade Tint Genie. All rights reserved.</p>
            <p className="mt-1">
              Created by <a href="http://linkedin.com/danishmk286" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Danish Khan</a>
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
