import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  style?: React.CSSProperties;
  staggerDelay?: number;
  glitchIntensity?: "low" | "medium" | "high";
}

// Elegant letter-by-letter reveal with subtle glow
export function RevealText({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
  style,
  staggerDelay = 0.03,
}: RevealTextProps) {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      style={style}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{
            whiteSpace: letter === " " ? "pre" : "normal",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Smooth gradient text with hover effect
export function GradientText({
  text,
  className = "",
  delay = 0,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`relative inline-block cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      <motion.span
        className="relative z-10 bg-clip-text text-transparent"
        style={{
          backgroundImage: isHovered
            ? "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
          backgroundSize: "200% 200%",
          transition: "background-image 0.5s ease",
        }}
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse",
        }}
      >
        {text}
      </motion.span>

      {/* Glow effect on hover */}
      <motion.span
        className="absolute inset-0 -z-10 blur-xl"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
          opacity: 0,
        }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.span>
  );
}

// Typewriter effect with cursor
export function TypewriterText({
  text,
  className = "",
  delay = 0,
  speed = 50,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  style?: React.CSSProperties;
}) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    const startTyping = () => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          // Hide cursor after typing is done
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, speed);

      return () => clearInterval(interval);
    };

    timeout = setTimeout(startTyping, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {displayText}
      {showCursor && (
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-cyan-400 ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </motion.span>
  );
}

// Floating text with subtle movement
export function FloatingText({
  text,
  className = "",
  delay = 0,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -5, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.6,
        },
      }}
    >
      {text}
    </motion.span>
  );
}

// Shimmer text effect - letter by letter with reveal
export function ShimmerText({
  text,
  className = "",
  delay = 0,
  style,
  staggerDelay = 0.03,
}: {
  text: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  staggerDelay?: number;
}) {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block relative"
          style={{
            whiteSpace: letter === " " ? "pre" : "normal",
            fontFamily: "inherit",
          }}
          variants={child}
          animate={{
            textShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 8px rgba(255,255,255,0.8)",
              "0 0 0px rgba(255,255,255,0)",
            ],
          }}
          transition={{
            textShadow: {
              duration: 1.5,
              delay: delay + 1 + index * 0.08,
              repeat: Infinity,
              repeatDelay: text.length * 0.08 + 2,
              ease: "easeInOut",
            },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Keep legacy exports for compatibility
export const GlitchText = RevealText;
export const CyberText = FloatingText;
