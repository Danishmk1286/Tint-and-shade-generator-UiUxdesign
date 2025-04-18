
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isPaletteGenerator = location.pathname === '/palette-generator';
  
  return (
    <header className="text-center space-y-6">
      <Link to="/" className="inline-block">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Color Tools</h1>
      </Link>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Create beautiful, accessible color palettes and variations for your design projects
      </p>
      
      <Tabs 
        value={isHome ? 'tints' : (isPaletteGenerator ? 'palettes' : 'tints')}
        className="w-full max-w-md mx-auto"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="tints" asChild>
            <Link to="/">Tint & Shade Generator</Link>
          </TabsTrigger>
          <TabsTrigger value="palettes" asChild>
            <Link to="/palette-generator">Color Palette Generator</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
};

export default Header;
