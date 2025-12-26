import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface SectionIndicatorProps {
  currentSection: number;
  totalSections?: number;
}

// Composant pour un segment individuel avec effet liquide
function LiquidSegment({
  index,
  currentSection,
  isActive,
  globalWaveOffset,
}: {
  index: number;
  currentSection: number;
  isActive: boolean;
  globalWaveOffset: number;
}) {
  const isFilled = currentSection > index;

  const width = 12;
  const height = 24;

  const liquidLevel = isFilled ? 100 : isActive ? 50 : 0;

  return (
    <div
      className="relative"
      style={{ width, height }}
    >
      {/* Container du tube */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isActive
            ? "0 0 12px rgba(34, 211, 238, 0.4), inset 0 0 8px rgba(34, 211, 238, 0.1)"
            : "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Liquide */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          animate={{ height: `${liquidLevel}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: isActive
              ? "linear-gradient(to top, rgba(6, 182, 212, 1), rgba(34, 211, 238, 0.9))"
              : isFilled
                ? "linear-gradient(to top, rgba(6, 182, 212, 0.85), rgba(34, 211, 238, 0.7))"
                : "transparent",
            borderRadius: "0 0 6px 6px",
            boxShadow: liquidLevel > 5
              ? "inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.2)"
              : "none",
          }}
        >
          {/* Surface ondulante du liquide */}
          {liquidLevel > 0 && liquidLevel < 98 && (
            <svg
              className="absolute -top-1 left-0 right-0"
              width={width}
              height="6"
              viewBox={`0 0 ${width} 6`}
              preserveAspectRatio="none"
            >
              <path
                d={`
                  M 0 3
                  Q ${width * 0.25} ${3 + Math.sin(globalWaveOffset) * 0.5}
                    ${width * 0.5} 3
                  Q ${width * 0.75} ${3 + Math.sin(globalWaveOffset + Math.PI) * 0.5}
                    ${width} 3
                  L ${width} 6
                  L 0 6
                  Z
                `}
                fill={isActive ? "rgba(34, 211, 238, 0.95)" : "rgba(34, 211, 238, 0.75)"}
              />
            </svg>
          )}

          {/* Reflet du liquide */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 rounded-bl-full"
            style={{
              background: "linear-gradient(to right, rgba(255, 255, 255, 0.25), transparent)",
            }}
          />
        </motion.div>

        {/* Reflet du verre */}
        <div
          className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent)",
            borderRadius: "6px 0 0 6px",
          }}
        />

        {/* Point lumineux en haut */}
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{
            background: "rgba(255, 255, 255, 0.4)",
          }}
        />
      </div>

      {/* Glow pulsant pour section active */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-full pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 8px rgba(34, 211, 238, 0.3)",
              "0 0 16px rgba(34, 211, 238, 0.5)",
              "0 0 8px rgba(34, 211, 238, 0.3)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

export function SectionIndicator({
  currentSection,
  totalSections = 14,
}: SectionIndicatorProps) {
  const waveOffset = useMotionValue(0);
  const [currentWaveOffset, setCurrentWaveOffset] = useState(0);

  // Animation continue des vagues
  useEffect(() => {
    const controls = animate(waveOffset, [0, Math.PI * 2], {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    });
    return () => controls.stop();
  }, [waveOffset]);

  useEffect(() => {
    const unsubscribe = waveOffset.on("change", setCurrentWaveOffset);
    return unsubscribe;
  }, [waveOffset]);

  return (
    <motion.div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative flex flex-col gap-1">
        {/* Ligne de connexion subtile */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px"
          style={{
            top: 12,
            height: `calc(100% - 24px)`,
            background: "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.06), transparent)",
          }}
        />

        {/* Segments */}
        {Array.from({ length: totalSections }, (_, i) => (
          <LiquidSegment
            key={i}
            index={i}
            currentSection={currentSection}
            isActive={currentSection === i}
            globalWaveOffset={currentWaveOffset}
          />
        ))}
      </div>

      {/* Numéro de section */}
      <motion.div
        className="mt-3 text-center"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        key={currentSection}
        transition={{ duration: 0.2 }}
      >
        <span className="text-[10px] font-mono text-cyan-400/70 tracking-wider">
          {String(currentSection + 1).padStart(2, "0")}
        </span>
        <span className="text-[8px] text-white/20 mx-0.5">/</span>
        <span className="text-[8px] font-mono text-white/25">
          {String(totalSections).padStart(2, "0")}
        </span>
      </motion.div>
    </motion.div>
  );
}
