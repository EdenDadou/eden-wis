import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useLanguageAnimation } from "../../hooks/useLanguageAnimation";

// Optimized images (WebP with JPEG fallback, ~400KB total vs 12MB original)
const profileImages = [
  "/images/profile-optimized/1.webp",
  "/images/profile-optimized/2.webp",
  "/images/profile-optimized/3.webp",
  "/images/profile-optimized/4.webp",
  "/images/profile-optimized/5.webp",
  "/images/profile-optimized/6.webp",
  "/images/profile-optimized/7.webp",
  "/images/profile-optimized/8.webp",
  "/images/profile-optimized/9.webp",
  "/images/profile-optimized/10.webp",
];

interface AboutSectionProps {
  section: number;
  showCard: boolean;
  targetSection: number | null;
  isNavigating: boolean;
  onNavigateToContact?: () => void;
}

export function AboutSection({ section, showCard, targetSection, isNavigating, onNavigateToContact }: AboutSectionProps) {
  const { t } = useTranslation("common");
  const { animationKey } = useLanguageAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // About is now section 12
  const isVisible = section === 12 && (targetSection === null || showCard) && !isNavigating;

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.5, delay: 0.1 }
          }}
          exit={{
            opacity: 0,
            filter: "blur(8px)",
            transition: { duration: 0.3 }
          }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          {/* About Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.15
              }
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.95,
              transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
            }}
            className="max-w-xl w-full mx-4 pointer-events-auto"
          >
            {/* Liquid Glass Container */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)]">

              {/* Animated liquid gradient background */}
              <motion.div
                className="absolute inset-0 opacity-60"
                animate={{
                  background: [
                    "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 30% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse 80% 50% at 80% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 20% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                    "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Glass morphism base layer */}
              <div
                className="absolute inset-0 backdrop-blur-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.65) 100%)",
                }}
              />

              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Top edge highlight - Apple style light reflection */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Inner glow */}
              <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]" />

              {/* Refraction light spots */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
                animate={{
                  x: [0, 30, 0],
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
                animate={{
                  x: [0, -20, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Content */}
              <div className="relative p-8 md:p-10">
                {/* Header with photo */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  {/* Photo with liquid glass frame */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
                    className="relative shrink-0 group"
                  >
                    {/* Outer glow */}
                    <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-cyan-500/20 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Glass frame */}
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]">
                      {/* Glass border effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-white/10 p-[1.5px]">
                        <div className="w-full h-full rounded-[14px] overflow-hidden bg-gray-900/80 backdrop-blur-sm relative">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={currentImageIndex}
                              src={profileImages[currentImageIndex]}
                              alt="Eden Wisniewski"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover absolute inset-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            />
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Status indicator with glow */}
                    <motion.div
                      className="absolute -bottom-1 -right-1"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="absolute inset-0 w-5 h-5 rounded-full bg-emerald-400 blur-md opacity-60" />
                      <div className="relative w-5 h-5 rounded-full bg-emerald-500 border-2 border-white/20 shadow-lg" />
                    </motion.div>
                  </motion.div>

                  {/* Name & Title */}
                  <div className="text-center md:text-left">
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl md:text-4xl font-black tracking-tight"
                      style={{
                        background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 50%, #ffffff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 2px 20px rgba(255,255,255,0.1)",
                      }}
                    >
                      {t("about.name")}
                    </motion.h1>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`role-${animationKey}`}
                        initial={{ opacity: 0, x: -20, filter: 'blur(2px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 10, filter: 'blur(2px)' }}
                        transition={{ duration: 0.25 }}
                        className="text-lg font-semibold mt-1"
                        style={{
                          background: "linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {t("about.role")}
                      </motion.p>
                    </AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-center md:justify-start gap-2 mt-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`available-${animationKey}`}
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm text-white/60 font-medium"
                        >
                          {t("about.available")}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>

                {/* Bio */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`bio-${animationKey}`}
                    initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                    className="text-white/75 leading-relaxed text-base md:text-lg mb-6 font-light"
                  >
                    {t("about.bio")}
                  </motion.p>
                </AnimatePresence>

                {/* Experience highlight - Inner glass card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative p-4 rounded-2xl mb-6 overflow-hidden"
                >
                  {/* Inner card glass effect */}
                  <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md rounded-2xl" />
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.1)]" />
                  <div className="absolute inset-[1px] rounded-[15px] border border-white/[0.05]" />

                  <p className="relative text-white/65 text-sm leading-relaxed font-light">
                    {t("about.experience")}
                  </p>
                </motion.div>

                {/* CTA Button - Sexy Hire Me */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    onClick={onNavigateToContact}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative w-full group overflow-hidden rounded-2xl cursor-pointer"
                  >
                    {/* Animated gradient glow on hover */}
                    <motion.div
                      className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(90deg, rgba(6, 182, 212, 0.5), rgba(16, 185, 129, 0.5))",
                        filter: "blur(15px)",
                      }}
                      animate={{
                        background: [
                          "linear-gradient(90deg, rgba(6, 182, 212, 0.6), rgba(16, 185, 129, 0.4))",
                          "linear-gradient(90deg, rgba(16, 185, 129, 0.4), rgba(6, 182, 212, 0.6))",
                          "linear-gradient(90deg, rgba(6, 182, 212, 0.6), rgba(16, 185, 129, 0.4))",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Button with vertical gradient border - blue top, green bottom */}
                    <div className="relative p-[2px] rounded-2xl bg-gradient-to-b from-cyan-400 via-teal-400 to-emerald-400 group-hover:from-cyan-300 group-hover:via-teal-300 group-hover:to-emerald-300 transition-all duration-300">
                      {/* Inner button */}
                      <div className="relative px-6 py-4 rounded-[14px] bg-gray-900/90 backdrop-blur-md group-hover:bg-gray-900/70 transition-all duration-300 overflow-hidden">
                        {/* Shimmer effect on hover */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                          }}
                          initial={{ x: "-100%" }}
                          whileHover={{
                            x: "100%",
                            transition: { duration: 0.6, ease: "easeInOut" }
                          }}
                        />

                        {/* Text with horizontal gradient */}
                        <span
                          className="relative text-lg font-bold tracking-wide"
                          style={{
                            background: "linear-gradient(90deg, #22d3ee 0%, #2dd4bf 50%, #10b981 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("about.cta.hire")}
                        </span>
                      </div>
                    </div>

                    {/* Floating particles on hover */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            left: `${15 + i * 15}%`,
                            bottom: "20%",
                            background: i % 2 === 0 ? "#22d3ee" : "#10b981",
                          }}
                          animate={{
                            y: [-5, -25, -5],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
