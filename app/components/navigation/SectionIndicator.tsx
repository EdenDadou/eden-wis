import { motion, useSpring, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface SectionIndicatorProps {
  currentSection: number;
  totalSections?: number;
}

// Composant pour un segment individuel avec effet liquide
function LiquidSegment({
  index,
  currentSection,
  fillProgress,
  isActive,
  globalWaveOffset,
}: {
  index: number;
  currentSection: number;
  fillProgress: number;
  isActive: boolean;
  globalWaveOffset: number;
}) {
  const isFilled = currentSection > index;
  const isCurrentlyFilling = currentSection === index;

  // État local pour le rendu du liquide
  const [displayFill, setDisplayFill] = useState(isFilled ? 100 : 0);
  const [wavePhase, setWavePhase] = useState(0);

  // Valeurs animées avec spring
  const targetFill = isFilled ? 1 : isCurrentlyFilling ? fillProgress : 0;
  const animatedFill = useSpring(targetFill, {
    stiffness: 60,
    damping: 12,
    mass: 0.8
  });

  // Écouter les changements de animatedFill pour mettre à jour le state
  useEffect(() => {
    const unsubscribe = animatedFill.on("change", (v) => {
      setDisplayFill(v * 100);
    });
    return unsubscribe;
  }, [animatedFill]);

  // Mettre à jour la phase de vague
  useEffect(() => {
    setWavePhase(globalWaveOffset);
  }, [globalWaveOffset]);

  // Bulles aléatoires
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; size: number; delay: number }>>([]);

  useEffect(() => {
    if (isCurrentlyFilling && fillProgress > 0.1 && fillProgress < 0.95) {
      const interval = setInterval(() => {
        if (Math.random() > 0.5) {
          setBubbles(prev => [
            ...prev.slice(-4),
            {
              id: Date.now() + Math.random(),
              x: 15 + Math.random() * 70,
              size: 2 + Math.random() * 3,
              delay: Math.random() * 0.2,
            },
          ]);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isCurrentlyFilling, fillProgress]);

  // Nettoyer les bulles quand on quitte
  useEffect(() => {
    if (!isCurrentlyFilling && !isFilled) {
      setBubbles([]);
    }
  }, [isCurrentlyFilling, isFilled]);

  const width = 12;
  const height = 24;

  // Calculer le niveau du liquide et l'ondulation
  const liquidLevel = Math.max(0, Math.min(100, displayFill));
  const waveIntensity = isCurrentlyFilling ? Math.min(1, fillProgress * 1.5) : (isFilled ? 0.3 : 0);

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
        {/* Liquide avec effet ondulant */}
        <div
          className="absolute inset-x-0 bottom-0 transition-none"
          style={{
            height: `${liquidLevel}%`,
            background: isActive
              ? "linear-gradient(to top, rgba(6, 182, 212, 1), rgba(34, 211, 238, 0.9))"
              : isFilled || isCurrentlyFilling
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
                  Q ${width * 0.25} ${3 + Math.sin(wavePhase) * waveIntensity * 2}
                    ${width * 0.5} 3
                  Q ${width * 0.75} ${3 + Math.sin(wavePhase + Math.PI) * waveIntensity * 2}
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
        </div>

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

      {/* Bulles qui montent */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            bottom: 2,
            background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2))",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          initial={{ y: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: -(height * (liquidLevel / 100)) + 4,
            opacity: [0, 0.8, 0.6, 0],
            scale: [0.5, 1, 0.8, 0.3],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.3,
            delay: bubble.delay,
            ease: "easeOut",
          }}
          onAnimationComplete={() => {
            setBubbles(prev => prev.filter(b => b.id !== bubble.id));
          }}
        />
      ))}

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

// Goutte qui tombe avec splash
function FallingDrop({
  fromIndex,
  toIndex,
  onComplete,
}: {
  fromIndex: number;
  toIndex: number;
  onComplete: () => void;
}) {
  const segmentHeight = 28;
  const travelDistance = (toIndex - fromIndex) * segmentHeight;
  const [phase, setPhase] = useState<"falling" | "splash" | "done">("falling");

  useEffect(() => {
    if (phase === "splash") {
      const timer = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <>
      {/* Goutte qui tombe */}
      {phase === "falling" && (
        <motion.div
          className="absolute left-1/2 z-20 pointer-events-none"
          style={{
            top: fromIndex * segmentHeight + 20,
            width: 5,
            height: 7,
            marginLeft: -2.5,
            background: "linear-gradient(to bottom, rgba(34, 211, 238, 0.95), rgba(6, 182, 212, 1))",
            borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
            boxShadow: "0 2px 6px rgba(34, 211, 238, 0.6)",
          }}
          initial={{ y: 0, scaleY: 1, scaleX: 1 }}
          animate={{
            y: travelDistance,
            scaleY: [1, 1.5, 1.3, 0.6],
            scaleX: [1, 0.7, 0.8, 1.4],
          }}
          transition={{
            duration: 0.35,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationComplete={() => setPhase("splash")}
        />
      )}

      {/* Effet de splash */}
      {phase === "splash" && (
        <div
          className="absolute left-1/2 z-20 pointer-events-none"
          style={{
            top: toIndex * segmentHeight + 2,
            marginLeft: -8,
          }}
        >
          {/* Particules */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                left: 8,
                background: "rgba(34, 211, 238, 0.9)",
                boxShadow: "0 0 4px rgba(34, 211, 238, 0.6)",
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * 12,
                y: [0, Math.sin((i / 6) * Math.PI * 2) * 8 - 6, 8],
                opacity: [1, 0.8, 0],
                scale: [1, 0.8, 0.3],
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Ripple */}
          <motion.div
            className="absolute rounded-full border-2 border-cyan-400/60"
            style={{
              left: 4,
              top: 2,
            }}
            initial={{ width: 8, height: 4, opacity: 1 }}
            animate={{
              width: 24,
              height: 10,
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}
    </>
  );
}

// Débordement entre sections
function LiquidOverflow({
  fromIndex,
  intensity,
}: {
  fromIndex: number;
  intensity: number;
}) {
  const segmentHeight = 28;

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      style={{
        top: fromIndex * segmentHeight + 22,
        width: 3,
        background: "linear-gradient(to bottom, rgba(6, 182, 212, 0.9), rgba(6, 182, 212, 0.3), transparent)",
        borderRadius: "0 0 2px 2px",
      }}
      animate={{
        height: Math.min(intensity * 12, 10),
        opacity: Math.min(intensity, 1),
      }}
      transition={{ duration: 0.15 }}
    />
  );
}

export function SectionIndicator({
  currentSection,
  totalSections = 16,
}: SectionIndicatorProps) {
  const [fillProgress, setFillProgress] = useState(0);
  const [drops, setDrops] = useState<Array<{ id: number; from: number; to: number }>>([]);
  const [overflowIntensity, setOverflowIntensity] = useState(0);
  const prevSectionRef = useRef(currentSection);
  const scrollAccumulatorRef = useRef(0);
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

  // Écouter le scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        scrollAccumulatorRef.current += e.deltaY * 0.003;
        const newProgress = Math.min(1.3, scrollAccumulatorRef.current);
        setFillProgress(Math.min(1, newProgress));
        setOverflowIntensity(Math.max(0, newProgress - 0.85));
      } else {
        scrollAccumulatorRef.current = Math.max(0, scrollAccumulatorRef.current + e.deltaY * 0.005);
        setFillProgress(Math.max(0, scrollAccumulatorRef.current));
        setOverflowIntensity(0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Changement de section
  useEffect(() => {
    if (currentSection !== prevSectionRef.current) {
      if (currentSection > prevSectionRef.current) {
        setDrops(prev => [
          ...prev,
          {
            id: Date.now(),
            from: prevSectionRef.current,
            to: currentSection,
          },
        ]);
      }

      scrollAccumulatorRef.current = 0;
      setFillProgress(0);
      setOverflowIntensity(0);
      prevSectionRef.current = currentSection;
    }
  }, [currentSection]);

  const removeDrop = (id: number) => {
    setDrops(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
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
            fillProgress={fillProgress}
            isActive={currentSection === i}
            globalWaveOffset={currentWaveOffset}
          />
        ))}

        {/* Overflow */}
        {overflowIntensity > 0 && currentSection < totalSections - 1 && (
          <LiquidOverflow
            fromIndex={currentSection}
            intensity={overflowIntensity}
          />
        )}

        {/* Gouttes */}
        {drops.map(drop => (
          <FallingDrop
            key={drop.id}
            fromIndex={drop.from}
            toIndex={drop.to}
            onComplete={() => removeDrop(drop.id)}
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
    </div>
  );
}
