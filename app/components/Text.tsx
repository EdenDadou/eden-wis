"use client";

import { motion } from "framer-motion";

type TextSize = "s" | "m" | "l";

const sizeClasses: Record<TextSize, string> = {
  s: "text-3xl sm:text-4xl md:text-5xl tracking-[3px]",
  m: "text-4xl sm:text-6xl md:text-7xl tracking-tighter",
  l: "text-5xl sm:text-7xl md:text-8xl tracking-tighter",
};

export function Text({ text, size = "l" }: { text: string; size?: TextSize }) {
  const words = text.split(" ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className={`${sizeClasses[size]} font-bold`}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block">
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={`${wordIndex}-${letterIndex}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: wordIndex * 0.1 + letterIndex * 0.03,
                  type: "spring",
                  stiffness: 150,
                  damping: 25,
                }}
                className="inline-block text-transparent bg-clip-text
                      bg-linear-to-r from-white to-white/80"
              >
                {letter}
              </motion.span>
            ))}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </h1>
    </motion.div>
  );
}
