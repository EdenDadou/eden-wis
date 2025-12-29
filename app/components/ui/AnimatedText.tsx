import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageAnimation } from '../../hooks/useLanguageAnimation';
import type { ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  delay?: number;
}

/**
 * Composant qui anime le texte lors d'un changement de langue
 * avec un effet de fade + slide subtil
 */
export function AnimatedText({
  children,
  className = '',
  as = 'span',
  delay = 0
}: AnimatedTextProps) {
  const { animationKey } = useLanguageAnimation();

  const MotionComponent = motion[as];

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        key={animationKey}
        className={className}
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
        transition={{
          duration: 0.3,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {children}
      </MotionComponent>
    </AnimatePresence>
  );
}
