import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface SectionIndicatorProps {
  currentSection: number;
  totalSections?: number;
}

function Dot({
  index,
  currentSection,
  isActive,
}: {
  index: number;
  currentSection: number;
  isActive: boolean;
}) {
  const isPassed = currentSection > index;

  return (
    <motion.button
      className="relative flex items-center justify-center"
      style={{ width: 16, height: 16 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Cercle de base */}
      <motion.div
        className="rounded-full"
        animate={{
          width: isActive ? 10 : 6,
          height: isActive ? 10 : 6,
          backgroundColor: isActive
            ? "rgb(34, 211, 238)"
            : isPassed
              ? "rgba(34, 211, 238, 0.6)"
              : "rgba(255, 255, 255, 0.2)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Glow pour l'élément actif */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.button>
  );
}

export function SectionIndicator({
  currentSection,
  totalSections = 14,
}: SectionIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastSection, setLastSection] = useState(currentSection);

  // Détecte les changements de section (scroll)
  const handleSectionChange = useCallback(() => {
    // Clear le timeout précédent
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    // Affiche l'indicateur
    setIsVisible(true);

    // Cache après 2 secondes d'inactivité
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    setHideTimeout(timeout);
  }, [hideTimeout]);

  // Réagit aux changements de section
  useEffect(() => {
    if (currentSection !== lastSection) {
      setLastSection(currentSection);
      handleSectionChange();
    }
  }, [currentSection, lastSection, handleSectionChange]);

  // Écoute les événements de scroll/wheel
  useEffect(() => {
    const handleWheel = () => {
      handleSectionChange();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchmove", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleWheel);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [handleSectionChange, hideTimeout]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Container principal */}
          <motion.div
            className="relative flex flex-col items-center gap-2 py-3 px-2 rounded-full"
            style={{
              background: "rgba(10, 25, 47, 0.6)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Ligne de progression */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-px"
              style={{
                top: 20,
                height: `calc(100% - 40px)`,
                background: "rgba(255, 255, 255, 0.06)",
              }}
            />

            {/* Ligne de progression active */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-px rounded-full"
              style={{
                top: 20,
                background: "linear-gradient(to bottom, rgba(34, 211, 238, 0.8), rgba(34, 211, 238, 0.3))",
              }}
              animate={{
                height: `${(currentSection / (totalSections - 1)) * 100}%`,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* Dots */}
            {Array.from({ length: totalSections }, (_, i) => (
              <Dot
                key={i}
                index={i}
                currentSection={currentSection}
                isActive={currentSection === i}
              />
            ))}
          </motion.div>

          {/* Numéro de section */}
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentSection}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[10px] font-mono text-cyan-400/80 tracking-wider">
              {String(currentSection + 1).padStart(2, "0")}
            </span>
            <span className="text-[8px] text-white/30 mx-0.5">/</span>
            <span className="text-[8px] font-mono text-white/40">
              {String(totalSections).padStart(2, "0")}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
