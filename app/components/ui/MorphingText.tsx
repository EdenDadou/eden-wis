"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface MorphingTextProps {
  children: string;
  className?: string;
}

/**
 * MorphingText - Smooth blur morphing effect on language change
 * Inspired by Magic UI's MorphingText component
 */
export function MorphingText({ children, className = "" }: MorphingTextProps) {
  const { i18n } = useTranslation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={`${children}-${i18n.language}`}
        className={`inline-block ${className}`}
        initial={{
          opacity: 0,
          filter: "blur(8px)",
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
        }}
        exit={{
          opacity: 0,
          filter: "blur(8px)",
          scale: 1.05,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
