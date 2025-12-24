import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  minDisplayTime?: number;
}

export default function LoadingScreen({
  onLoadingComplete,
  minDisplayTime = 800,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState<"assets" | "scene" | "ready">("assets");

  const startFadeOut = useCallback(() => {
    setLoadingPhase("ready");
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 500);
    }, 300);
  }, [onLoadingComplete]);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;

    const preloadAssets = async () => {
      // Phase 1: Import and initialize asset cache (0-40%)
      setLoadingPhase("assets");

      try {
        const { preloadAllAssets } = await import("./scene3d/cache");
        setProgress(20);

        await preloadAllAssets();
        setProgress(40);
      } catch (e) {
        console.warn("Asset preload warning:", e);
        setProgress(40);
      }

      // Phase 2: Preload PixelHeart3D geometry (40-70%)
      setLoadingPhase("scene");
      try {
        await import("./scene3d/PixelHeart3D");
        setProgress(70);
      } catch (e) {
        setProgress(70);
      }

      // Phase 3: Preload main Experience component (70-90%)
      try {
        await import("./Experience");
        setProgress(90);
      } catch (e) {
        setProgress(90);
      }

      // Phase 4: Final progress (90-100%)
      setProgress(100);

      // Ensure minimum display time
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      setTimeout(startFadeOut, remainingTime);
    };

    // Animate progress smoothly
    const animateProgress = () => {
      setProgress((prev) => {
        if (prev < 15) return prev + 0.5;
        return prev;
      });
      animationFrame = requestAnimationFrame(animateProgress);
    };

    animationFrame = requestAnimationFrame(animateProgress);
    preloadAssets();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [minDisplayTime, startFadeOut]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a192f] via-[#0d2847] to-[#164e63]"
        >
          {/* Animated background stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Logo / Heart animation */}
          <motion.div
            className="relative mb-8"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <motion.path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#22c55e"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Loading text */}
          <motion.p
            className="text-cyan-400/80 text-sm mb-4 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {loadingPhase === "assets" && "Chargement des assets..."}
            {loadingPhase === "scene" && "Initialisation de la scène..."}
            {loadingPhase === "ready" && "Prêt !"}
          </motion.p>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Progress percentage */}
          <motion.p
            className="text-slate-500 text-xs mt-2 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
