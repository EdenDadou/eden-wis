import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface ShuffleTextProps {
  children: string;
  className?: string;
}

/**
 * Composant qui anime le texte lettre par lettre lors du changement de langue
 */
export function ShuffleText({
  children,
  className = '',
}: ShuffleTextProps) {
  const { i18n } = useTranslation();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 200,
      }
    },
    exit: {
      opacity: 0,
      y: -15,
      rotateX: -60,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      }
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={`${children}-${i18n.language}`}
        className={className}
        style={{ display: 'inline-flex', perspective: '500px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children.split('').map((char, i) => (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              transformOrigin: 'center bottom',
            }}
            variants={letterVariants}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}
