import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';
interface HeaderProps {
  className?: string;
}
const Header: React.FC<HeaderProps> = ({
  className
}) => {
  return <motion.header initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className={cn('text-center space-y-2', className)}>
      <div className="flex items-center justify-center gap-2">
        <Palette className="w-8 h-8 text-primary" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tint & Shade Generator</h1>
      </div>
      
      <p className="text-muted-foreground max-w-xl mx-auto">
        Create beautiful tints and shades from any color. Customize the number of variants and copy color codes with a single click.
      </p>
    </motion.header>;
};
export default Header;