import type { Route } from "./+types/home";
import Scene from "../components/Scene";
import "../styles/global.css";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Text } from "../components/Text";
import { ParticleText } from "../components/ParticleText";
import type { Experience } from "../components/Timeline3D";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eden Wisniewski - Full-Stack Developer" },
    { name: "description", content: "Portfolio - Solutions IT complètes" },
  ];
}

export default function Home() {
  const [section, setSection] = useState(0);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [detailScrollOffset, setDetailScrollOffset] = useState(0);
  const { t, i18n } = useTranslation("common");

  // Handle scroll for project detail view
  useEffect(() => {
    if (!selectedExperience) {
      setDetailScrollOffset(0);
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      if (selectedExperience) {
        e.preventDefault();
        const maxScroll = Math.max(0, selectedExperience.projects.length - 2);
        setDetailScrollOffset((prev) => {
          const newOffset = prev + e.deltaY * 0.001;
          return Math.max(0, Math.min(maxScroll, newOffset));
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [selectedExperience]);

  const handleBackToTimeline = useCallback(() => {
    setSelectedExperience(null);
    setDetailScrollOffset(0);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const variants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Animation variants for language change
  const langTextVariants: Variants = {
    initial: { opacity: 0, y: 10, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(4px)",
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const langItemVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
  };

  // Section 0 is now the hero intro screen (centered)
  // Determine text position based on 3D element location
  // Position text on opposite side of 3D element for visibility
  const getTextPosition = () => {
    switch (section) {
      case 0:
        return "center"; // Hero intro - centered
      case 1:
        return "right"; // Frontend - left, text right
      case 2:
        return "left"; // Backend - center, text left
      case 3:
        return "left"; // Database - top, text left
      case 4:
        return "right"; // Mobile - text right
      case 5:
        return "right"; // Backoffice - text right
      case 6:
        return "left"; // CI/CD - text left
      case 7:
        return "left"; // Cloud - text left
      case 8:
        return "right"; // Testing - text right
      case 9:
        return "center"; // Overview - centered
      default:
        return "left";
    }
  };

  const textPosition = getTextPosition();
  const positionClass =
    textPosition === "left"
      ? "justify-start pl-12 md:pl-20"
      : textPosition === "right"
        ? "justify-end pr-12 md:pr-20"
        : "justify-center";

  // Content for each section - aligned with 3D camera sequence
  const sectionContent: Record<
    number,
    { title: string; subtitle: string; category: string; items?: string[] }
  > = {
    0: {
      title: t("home.name"),
      subtitle: t("cards.hero.title"),
      category: t("sections.introduction"),
      items: [
        t("content.intro.passionateDev"),
        t("content.intro.customSolutions"),
        t("content.intro.fromConceptToDeployment"),
      ],
    },
    1: {
      title: t("content.frontend.title"),
      subtitle: t("content.frontend.subtitle"),
      category: t("sections.interface"),
      items: t("content.frontend.items", { returnObjects: true }) as string[],
    },
    2: {
      title: t("content.backend.title"),
      subtitle: t("content.backend.subtitle"),
      category: t("sections.server"),
      items: t("content.backend.items", { returnObjects: true }) as string[],
    },
    3: {
      title: t("content.database.title"),
      subtitle: t("content.database.subtitle"),
      category: t("sections.data"),
      items: t("content.database.items", { returnObjects: true }) as string[],
    },
    4: {
      title: t("content.mobile.title"),
      subtitle: t("content.mobile.subtitle"),
      category: t("sections.mobile"),
      items: t("content.mobile.items", { returnObjects: true }) as string[],
    },
    5: {
      title: t("content.backoffice.title"),
      subtitle: t("content.backoffice.subtitle"),
      category: t("sections.administration"),
      items: t("content.backoffice.items", { returnObjects: true }) as string[],
    },
    6: {
      title: t("content.cicd.title"),
      subtitle: t("content.cicd.subtitle"),
      category: t("sections.pipeline"),
      items: t("content.cicd.items", { returnObjects: true }) as string[],
    },
    7: {
      title: t("content.cloud.title"),
      subtitle: t("content.cloud.subtitle"),
      category: t("sections.hosting"),
      items: t("content.cloud.items", { returnObjects: true }) as string[],
    },
    8: {
      title: t("content.testing.title"),
      subtitle: t("content.testing.subtitle"),
      category: t("sections.quality"),
      items: t("content.testing.items", { returnObjects: true }) as string[],
    },
    9: {
      title: t("content.fullstack.title"),
      subtitle: t("content.fullstack.subtitle"),
      category: t("sections.overview"),
      items: t("content.fullstack.items", { returnObjects: true }) as string[],
    },
    10: {
      title: t("content.experience.title"),
      subtitle: t("content.experience.subtitle"),
      category: t("sections.timelineSection"),
      items: t("content.experience.items", { returnObjects: true }) as string[],
    },
  };

  const content = sectionContent[section] || sectionContent[0];

  return (
    <main className="w-full h-screen bg-gradient-to-b from-[#0a192f] via-[#0d2847] to-[#164e63] relative overflow-hidden">
      <Scene
        onSectionChange={setSection}
        onExperienceSelect={setSelectedExperience}
        selectedExperienceId={selectedExperience?.id || null}
        detailScrollOffset={detailScrollOffset}
      />

      {/* Back button - shown when in detail view */}
      <AnimatePresence>
        {selectedExperience && section === 10 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackToTimeline}
            className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">{t("sections.back")}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Language Switcher */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          {/* Globe icon */}
          <motion.button
            className="group flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => changeLanguage(i18n.language === "fr" ? "en" : "fr")}
          >
            {/* Globe SVG */}
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

            {/* Language indicator */}
            <div className="relative flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={i18n.language}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium text-white/90 min-w-[24px]"
                >
                  {i18n.language === "fr" ? "FR" : "EN"}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Switch arrows */}
            <svg
              className="w-3 h-3 text-white/40 group-hover:text-cyan-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </motion.button>

          {/* Subtle glow effect */}
          <div className="absolute -inset-1 bg-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </div>
      </motion.div>

      {/* Section Progress Indicator */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-50">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              section === i
                ? "h-6 bg-cyan-400"
                : section > i
                  ? "h-2 bg-cyan-400/50"
                  : "h-2 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Phase Label */}
      <div className="fixed top-4 left-4 z-50">
        <span className="text-xs text-white/40 font-mono">
          {t("sections.phase")} {section + 1}/11
        </span>
      </div>

      {/* Hero Intro Screen - Section 0 */}
      <AnimatePresence>
        {section === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 w-full h-full z-20 pointer-events-none flex flex-col items-center justify-center"
          >
            <div
              style={{
                filter:
                  "drop-shadow(0 0 60px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 120px rgba(6, 182, 212, 0.3))",
              }}
            >
              <ParticleText
                text="Eden Wisniewski"
                fontSize={80}
                mouseRadius={120}
              />
            </div>

            <div
              className="mt-4"
              style={{ textShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
            >
              <Text text={t("sections.letsGoReal")} size="s" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="mt-12 flex flex-col items-center"
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
        )}
      </AnimatePresence>

      {/* Content Overlay - Position alternates (hidden on section 0) */}
      {section > 0 && (
        <div
          className={`absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center ${positionClass}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${section}-${i18n.language}`}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-lg"
            >
              <div className="backdrop-blur-md bg-black/40 px-8 py-8 rounded-2xl border border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`cat-${i18n.language}`}
                    variants={langTextVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="block text-xs font-mono text-cyan-400/70 uppercase tracking-wider"
                  >
                    {content.category}
                  </motion.span>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`title-${i18n.language}`}
                    variants={langTextVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tight"
                  >
                    {content.title}
                  </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`sub-${i18n.language}`}
                    variants={langTextVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-xl text-cyan-400 mt-1 font-medium"
                  >
                    {content.subtitle}
                  </motion.h2>
                </AnimatePresence>

                {content.items && (
                  <AnimatePresence mode="wait">
                    <motion.ul
                      key={`items-${i18n.language}`}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="mt-6 space-y-2"
                    >
                      {content.items.map((item, i) => (
                        <motion.li
                          key={`${i}-${i18n.language}`}
                          variants={langItemVariants}
                          custom={i}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                )}

                {section === 9 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all pointer-events-auto"
                  >
                    {t("home.cta")}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Scroll indicator when in detail view */}
      <AnimatePresence>
        {selectedExperience &&
          section === 10 &&
          selectedExperience.projects.length > 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-white/40"
            >
              <span className="text-xs mb-2">
                {t("sections.scrollToSeeProjects")}
              </span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </main>
  );
}
