
import React, { useState } from 'react';
import { Palette } from '@/types/palette';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, Download, Copy, Code } from 'lucide-react';
import { toast } from 'sonner';

interface PaletteDetailsProps {
  palette: Palette;
}

const PaletteDetails: React.FC<PaletteDetailsProps> = ({ palette }) => {
  const [exportFormat, setExportFormat] = useState<'css' | 'json' | 'png'>('css');
  
  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard`);
  };
  
  const handleExport = () => {
    if (exportFormat === 'css') {
      const cssVars = `
:root {
  --color-primary: ${palette.primary.hex};
  --color-secondary: ${palette.secondary.hex};
  --color-accent: ${palette.accent.hex};
  --color-neutral-light: ${palette.neutral.light.hex};
  --color-neutral-dark: ${palette.neutral.dark.hex};
}`;
      navigator.clipboard.writeText(cssVars);
      toast.success('CSS variables copied to clipboard');
    } else if (exportFormat === 'json') {
      const json = JSON.stringify({
        name: palette.name,
        colors: {
          primary: palette.primary.hex,
          secondary: palette.secondary.hex,
          accent: palette.accent.hex,
          neutralLight: palette.neutral.light.hex,
          neutralDark: palette.neutral.dark.hex
        }
      }, null, 2);
      navigator.clipboard.writeText(json);
      toast.success('JSON copied to clipboard');
    } else {
      toast.info('PNG export coming soon...');
    }
  };
  
  const getContrastClass = (contrast: number) => {
    if (contrast >= 7) return 'text-green-600';
    if (contrast >= 4.5) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getContrastIcon = (passesAA: boolean, passesAAA: boolean) => {
    if (passesAAA) return <Check className="h-4 w-4 text-green-600" />;
    if (passesAA) return <Check className="h-4 w-4 text-amber-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/2">
          <h3 className="text-xl font-semibold mb-4">{palette.name}</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <ColorSwatch 
              color={palette.primary}
              label="Primary"
              onCopy={() => handleCopyColor(palette.primary.hex)}
            />
            <ColorSwatch 
              color={palette.secondary}
              label="Secondary"
              onCopy={() => handleCopyColor(palette.secondary.hex)}
            />
            <ColorSwatch 
              color={palette.accent}
              label="Accent"
              onCopy={() => handleCopyColor(palette.accent.hex)}
            />
            <ColorSwatch 
              color={palette.neutral.light}
              label="Neutral Light"
              onCopy={() => handleCopyColor(palette.neutral.light.hex)}
            />
            <ColorSwatch 
              color={palette.neutral.dark}
              label="Neutral Dark"
              onCopy={() => handleCopyColor(palette.neutral.dark.hex)}
            />
          </div>
        </div>
        
        <div className="sm:w-1/2">
          <Tabs defaultValue="meaning">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meaning">Meaning</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="reasoning">AI Reasoning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meaning" className="space-y-4 py-4">
              <div>
                <h4 className="font-medium text-primary mb-2">Primary: {palette.primary.name}</h4>
                <p className="text-sm text-muted-foreground">{palette.primary.meaning}</p>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Secondary: {palette.secondary.name}</h4>
                <p className="text-sm text-muted-foreground">{palette.secondary.meaning}</p>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Accent: {palette.accent.name}</h4>
                <p className="text-sm text-muted-foreground">{palette.accent.meaning}</p>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Neutral: {palette.neutral.light.name} / {palette.neutral.dark.name}</h4>
                <p className="text-sm text-muted-foreground">{palette.neutral.light.meaning}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="accessibility" className="py-4">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Contrast Ratios</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">White text on Primary</span>
                        <span className={`font-medium ${getContrastClass(palette.accessibility.textOnPrimary.whiteContrast)}`}>
                          {palette.accessibility.textOnPrimary.whiteContrast.toFixed(2)}:1
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Black text on Primary</span>
                        <span className={`font-medium ${getContrastClass(palette.accessibility.textOnPrimary.blackContrast)}`}>
                          {palette.accessibility.textOnPrimary.blackContrast.toFixed(2)}:1
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Primary on Neutral</span>
                        <span className={`font-medium ${getContrastClass(palette.accessibility.primaryOnNeutral.contrast)}`}>
                          {palette.accessibility.primaryOnNeutral.contrast.toFixed(2)}:1
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">WCAG Compliance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WCAG AA (4.5:1)</span>
                        <span className="flex items-center">
                          {getContrastIcon(
                            palette.accessibility.textOnPrimary.passesAA || 
                            palette.accessibility.textOnSecondary.passesAA,
                            false
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WCAG AAA (7:1)</span>
                        <span className="flex items-center">
                          {getContrastIcon(
                            false,
                            palette.accessibility.textOnPrimary.passesAAA || 
                            palette.accessibility.textOnSecondary.passesAAA
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Colorblind Safe</span>
                        <span className="flex items-center">
                          {palette.accessibility.isColorBlindFriendly ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reasoning" className="space-y-4 py-4">
              <div>
                <h4 className="font-medium text-primary mb-2">Brand Goals</h4>
                <p className="text-sm text-muted-foreground">{palette.reasoning.brandGoals}</p>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Accessibility</h4>
                <p className="text-sm text-muted-foreground">{palette.reasoning.accessibilityReasoning}</p>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Color Harmony</h4>
                <p className="text-sm text-muted-foreground">{palette.reasoning.harmonyExplanation}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={exportFormat === 'css' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportFormat('css')}
            >
              CSS Variables
            </Button>
            <Button
              variant={exportFormat === 'json' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportFormat('json')}
            >
              JSON
            </Button>
            <Button
              variant={exportFormat === 'png' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setExportFormat('png')}
            >
              PNG
            </Button>
          </div>
          
          <Button onClick={handleExport} className="sm:ml-auto">
            {exportFormat === 'css' || exportFormat === 'json' ? (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy {exportFormat.toUpperCase()}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ColorSwatchProps {
  color: {
    name: string;
    hex: string;
    rgb: string;
    hsl: string;
  };
  label: string;
  onCopy: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, label, onCopy }) => {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-16 h-16 rounded border"
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}: {color.name}</span>
          <Button variant="ghost" size="sm" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm font-mono mt-1">{color.hex}</div>
        <div className="text-xs text-muted-foreground font-mono truncate">{color.rgb}</div>
      </div>
    </div>
  );
};

export default PaletteDetails;
