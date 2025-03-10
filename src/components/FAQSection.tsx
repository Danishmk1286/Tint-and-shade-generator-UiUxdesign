
import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-12 bg-secondary/20 rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="what-are-tints">
          <AccordionTrigger className="text-left font-medium text-lg">
            What are tints?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              Tints are lighter variations of a base color, created by mixing the original color with white. 
              Each tint maintains the same hue as the original color but has increased lightness. 
              Tints are often perceived as softer and more gentle versions of the base color.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tint-use-cases">
          <AccordionTrigger className="text-left font-medium text-lg">
            Where are tints used?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              Tints have many applications in design and digital products:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Creating lighter background variants while maintaining brand colors</li>
              <li>Designing accessible hover and active states for buttons and interactive elements</li>
              <li>Building color hierarchies for information visualization</li>
              <li>Establishing a cohesive UI color system with consistent variations</li>
              <li>Creating gradients and subtle color transitions</li>
              <li>Designing form fields, cards, and secondary UI components</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="what-are-shades">
          <AccordionTrigger className="text-left font-medium text-lg">
            What are shades?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p>
              Shades are darker variations of a base color, created by mixing the original color with black.
              Like tints, shades maintain the same hue as the base color but have decreased lightness.
              Shades are generally perceived as stronger, more intense, and more dramatic than the original color.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="shade-use-cases">
          <AccordionTrigger className="text-left font-medium text-lg">
            Where are shades used?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              Shades are valuable across many design contexts:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Creating darker text that maintains brand color identity while ensuring readability</li>
              <li>Designing active or pressed states for buttons and interactive elements</li>
              <li>Adding depth and dimension to UI elements through shadows and layering</li>
              <li>Creating visual emphasis for important elements or calls to action</li>
              <li>Establishing visual contrast between different sections of a design</li>
              <li>Designing footer backgrounds, borders, and dividers</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="color-terminology">
          <AccordionTrigger className="text-left font-medium text-lg">
            Understanding color terminology
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              When working with colors, it's helpful to understand these basic terms:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hue:</strong> The pure color itself (red, yellow, green, etc.)</li>
              <li><strong>Saturation:</strong> The intensity or purity of a color (vibrant vs. muted)</li>
              <li><strong>Lightness/Value:</strong> How light or dark a color is</li>
              <li><strong>Tint:</strong> A color mixed with white, increasing lightness</li>
              <li><strong>Shade:</strong> A color mixed with black, decreasing lightness</li>
              <li><strong>Tone:</strong> A color mixed with gray, reducing saturation</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.section>
  );
};

export default FAQSection;
