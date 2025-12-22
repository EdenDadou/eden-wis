import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import PixelHeart from "../PixelHeart";

interface TopNavProps {
  section: number;
  onNavigate: (section: number) => void;
}

// Section mapping: 0=Intro, 1=Overview, 2-9=Skills, 10=Timeline, 11=Portfolio, 12=About, 13=Contact
const NAV_ITEMS = [
  { key: "skills", sectionCheck: (s: number) => s >= 1 && s <= 9, targetSection: 1 },
  { key: "experience", sectionCheck: (s: number) => s === 10, targetSection: 10 },
  { key: "portfolio", sectionCheck: (s: number) => s === 11, targetSection: 11 },
  { key: "about", sectionCheck: (s: number) => s === 12, targetSection: 12 },
  { key: "contact", sectionCheck: (s: number) => s === 13, targetSection: 13 },
];

type Direction = "left" | "right";

// Variants pour l'indicateur - utilise custom pour la direction
const indicatorVariants: Variants = {
  initial: (direction: Direction) => ({
    x: direction === "right" ? "-100%" : "100%",
    opacity: 0,
  }),
  animate: {
    x: "0%",
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    x: direction === "right" ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function TopNav({ section, onNavigate }: TopNavProps) {
  const { t, i18n } = useTranslation("common");
  const [direction, setDirection] = useState<Direction>("right");
  const prevIndexRef = useRef(-1);

  const activeIndex = NAV_ITEMS.findIndex((item) => item.sectionCheck(section));

  // Calculer la direction optimale (chemin le plus court en circulaire)
  useEffect(() => {
    if (activeIndex === -1 || prevIndexRef.current === -1) {
      prevIndexRef.current = activeIndex;
      return;
    }

    const prevIndex = prevIndexRef.current;
    const total = NAV_ITEMS.length;

    // Distance directe (sans wrap)
    const directDistance = activeIndex - prevIndex;

    // Distance en faisant le tour
    const wrapDistance = directDistance > 0
      ? directDistance - total  // wrap par la gauche
      : directDistance + total; // wrap par la droite

    // Choisir le chemin le plus court
    let newDirection: Direction;
    if (Math.abs(directDistance) <= Math.abs(wrapDistance)) {
      // Chemin direct est plus court
      newDirection = directDistance > 0 ? "right" : "left";
    } else {
      // Faire le tour est plus court
      newDirection = wrapDistance > 0 ? "right" : "left";
    }

    setDirection(newDirection);
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo/Name - Click to go back to intro */}
        <motion.button
          onClick={() => onNavigate(0)}
          className="flex items-center gap-2 text-white/90 font-bold text-lg tracking-tight cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelHeart size={20} />
          EW
        </motion.button>

        {/* Navigation Links */}
        <div className="relative flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.key}
              onClick={() => onNavigate(item.targetSection)}
              className={`relative text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer overflow-hidden ${
                item.sectionCheck(section) ? "text-cyan-400" : "text-white/70 hover:text-cyan-400"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t(`nav.${item.key}`)}
              {/* Indicateur sous chaque bouton avec AnimatePresence */}
              <AnimatePresence mode="wait" custom={direction}>
                {item.sectionCheck(section) && (
                  <motion.div
                    key={`indicator-${item.key}`}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"
                    variants={indicatorVariants}
                    custom={direction}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          {/* Language Switcher */}
          <div className="relative ml-4">
            <motion.button
              className="group flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={changeLanguage}
            >
              <svg
                className="w-4 h-4 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.6 9h16.8M3.6 15h16.8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z"
                />
              </svg>
              <AnimatePresence mode="wait">
                <motion.span
                  key={i18n.language}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium text-white/90 min-w-6"
                >
                  {i18n.language === "fr" ? "FR" : "EN"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
