import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CyberText,
  FloatingText,
  RevealText,
  ShimmerText,
  TypewriterText,
} from "../GlitchText";
import { ParticleText } from "../ParticleText";
import { RotatingParticleText } from "../RotatingParticleText";

interface HeroSectionProps {
  isVisible: boolean;
}

export function HeroSection({ isVisible }: HeroSectionProps) {
  const { t } = useTranslation("common");

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        },
      }}
      exit={{
        opacity: 0,
        y: "-30vh",
        scale: 0.95,
        filter: "blur(15px)",
        transition: {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      className="absolute inset-0 w-full h-screen z-20 pointer-events-none flex flex-col items-center px-4 justify-between py-6"
    >
      {/* Name - TOP with ParticleText */}
      <div className="pt-24 pointer-events-none flex flex-col items-center">
        <ParticleText
          text="Eden Wisniewski"
          fontSize={80}
          particleSize={2}
          particleGap={3}
          mouseRadius={40}
          returnSpeed={0.05}
        />
        <RotatingParticleText
          texts={[
            "developer",
            "freelance",
            "digital lover",
            "consultant",
            "bug whisperer",
            "digital nomad",
            "coffee to code converter",
          ]}
          fontSize={40}
          particleSize={2}
          particleGap={3}
          mouseRadius={40}
          returnSpeed={0.05}
          rotationInterval={2500}
        />
      </div>

      {/* Slogan - CENTER */}
      <div className="flex flex-col items-center justify-center gap-4 pointer-events-none">
        {/* "You have an idea?" - handwritten style */}
        <TypewriterText
          text={t("sections.youHaveAnIdea")}
          className="text-white text-xl md:text-3xl font-story"
        />

        <h1
          className="relative text-2xl md:text-3xl lg:text-5xl font-lucky text-white"
          style={{
            textShadow: `
              0 0 5px #00d4ff,
              0 0 2px #00d4ff,
              0 0 5px #0066ff
            `,
            letterSpacing: "0.08em",
          }}
        >
          <RevealText text={`${t("sections.letsGoReal")}!`} delay={1} />
        </h1>
      </div>

      {/* Scroll indicator - BOTTOM */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="pb-8 flex flex-col items-center"
      >
        <span className="text-white/50 text-sm mb-2">
          {t("sections.scrollToExplore")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
