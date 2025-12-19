import type { Route } from "./+types/home";
import Scene from "../components/Scene";
import "../styles/global.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { GlitchText, CyberText } from "../components/GlitchText";
import { FeaturedProjectCard, ProjectCard, ProjectModal } from "../components/portfolio";
import { TopNav, SectionIndicator } from "../components/navigation";
import type { Experience } from "../components/Timeline3D";
import type { Project } from "../types";
import { projects, langTextVariants, langItemVariants, getTextPosition, getPositionClass } from "../constants";
import { useSectionContent } from "../hooks";

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
  const [targetSection, setTargetSection] = useState<number | null>(null);
  const [showCard, setShowCard] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t, i18n } = useTranslation("common");

  // Navigation functions for menu
  const navigateToSection = useCallback((sectionNumber: number) => {
    setSection(sectionNumber); // Set section immediately to prevent card animations
    setTargetSection(sectionNumber);
    setShowCard(false);

    // Show card with fade-in after 70% of animation (840ms of 1200ms)
    setTimeout(() => {
      setShowCard(true);
    }, 840);
  }, []);

  const handleNavigationComplete = useCallback(() => {
    setTargetSection(null);
  }, []);

  // Handle scroll for project detail view with snap
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSnappingRef = useRef(false);
  const targetOffsetRef = useRef(0);

  // Smooth snap animation
  useEffect(() => {
    if (!isSnappingRef.current) return;

    const animateSnap = () => {
      setDetailScrollOffset((prev) => {
        const diff = targetOffsetRef.current - prev;
        if (Math.abs(diff) < 0.01) {
          isSnappingRef.current = false;
          return targetOffsetRef.current;
        }
        return prev + diff * 0.15; // Smooth easing
      });

      if (isSnappingRef.current) {
        requestAnimationFrame(animateSnap);
      }
    };

    requestAnimationFrame(animateSnap);
  }, [isSnappingRef.current]);

  // Store maxScroll in a ref to avoid dependency issues
  const maxScrollRef = useRef(0);

  useEffect(() => {
    // Only add custom scroll handling when in experience detail view
    if (!selectedExperience) {
      setDetailScrollOffset(0);
      maxScrollRef.current = 0;
      return;
    }

    const projectCount = selectedExperience.projects.length;
    maxScrollRef.current = Math.max(0, projectCount - 1);

    const snapToNearest = (offset: number) => {
      // Calculate nearest snap point (each project = 1 unit)
      const nearestSnap = Math.round(offset);
      const clampedSnap = Math.max(0, Math.min(maxScrollRef.current, nearestSnap));

      targetOffsetRef.current = clampedSnap;
      isSnappingRef.current = true;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Cancel any pending snap
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      isSnappingRef.current = false;

      setDetailScrollOffset((prev) => {
        const delta = e.deltaY * 0.003;
        const newOffset = prev + delta;
        return Math.max(0, Math.min(maxScrollRef.current, newOffset));
      });

      // Snap after user stops scrolling (150ms debounce)
      scrollTimeoutRef.current = setTimeout(() => {
        setDetailScrollOffset((current) => {
          snapToNearest(current);
          return current;
        });
      }, 150);
    };

    // Keyboard navigation for snap points
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const direction = e.key === "ArrowDown" ? 1 : -1;
        setDetailScrollOffset((current) => {
          const currentSnap = Math.round(current);
          const nextSnap = Math.max(0, Math.min(maxScrollRef.current, currentSnap + direction));
          targetOffsetRef.current = nextSnap;
          isSnappingRef.current = true;
          return current;
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [selectedExperience]);

  const handleBackToTimeline = useCallback(() => {
    setSelectedExperience(null);
    setDetailScrollOffset(0);
  }, []);

  // Portfolio scroll ref and handler for going back to previous section
  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const portfolioScrollAccumulator = useRef(0);

  useEffect(() => {
    // Only activate this handler when actually in portfolio section (14)
    // and only for the portfolio HTML container scroll behavior
    if (section !== 14) {
      portfolioScrollAccumulator.current = 0;
      return;
    }

    const handlePortfolioWheel = (e: WheelEvent) => {
      const container = portfolioScrollRef.current;
      if (!container) return;

      // Only intercept if we're at the very top and trying to scroll up
      // This lets the user go back to section 13
      if (e.deltaY < 0 && container.scrollTop <= 0) {
        e.preventDefault();
        portfolioScrollAccumulator.current += Math.abs(e.deltaY);

        // Threshold to go back (need to scroll up ~100px worth)
        if (portfolioScrollAccumulator.current > 100) {
          portfolioScrollAccumulator.current = 0;
          navigateToSection(13);
        }
      } else {
        portfolioScrollAccumulator.current = 0;
        // Don't call preventDefault() for normal scrolling within portfolio
      }
    };

    // Only add listener when the portfolio container exists and section is 14
    const container = portfolioScrollRef.current;
    if (container) {
      container.addEventListener("wheel", handlePortfolioWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handlePortfolioWheel);
      };
    }
  }, [section, navigateToSection]);

  const textPosition = getTextPosition(section);
  const positionClass = getPositionClass(textPosition);
  const content = useSectionContent(section);

  return (
    <main className="w-full h-screen bg-linear-to-b from-[#0a192f] via-[#0d2847] to-[#164e63] relative overflow-hidden">
      <Scene
        onSectionChange={setSection}
        onExperienceSelect={setSelectedExperience}
        selectedExperienceId={selectedExperience?.id || null}
        detailScrollOffset={detailScrollOffset}
        targetSection={targetSection}
        onNavigationComplete={handleNavigationComplete}
      />

      {/* Back button - shown when in detail view */}
      <AnimatePresence>
        {selectedExperience && section === 13 && (
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

      {/* Top Navigation Menu */}
      <TopNav section={section} onNavigate={navigateToSection} />

      {/* Section Progress Indicator */}
      <SectionIndicator currentSection={section} />

      {/* Hero Intro Screen - Section 0 */}
      <AnimatePresence>
        {section === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 w-full h-screen z-20 pointer-events-none flex flex-col items-center px-4"
          >
            {/* Name - TOP */}
            <div className="pt-24 pointer-events-auto">
              <GlitchText
                text="Eden Wisniewski"
                className="text-xl md:text-2xl font-light tracking-widest uppercase text-white/80"
                style={{
                  textShadow: "0 0 30px rgba(6, 182, 212, 0.4)",
                }}
                delay={0.3}
                glitchIntensity="low"
              />
            </div>

            {/* Slogan - CENTER */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 pointer-events-auto">
              {/* "You have an idea?" - handwritten style */}
              <CyberText
                text={t("sections.youHaveAnIdea")}
                className="text-white/70 text-2xl md:text-3xl italic"
                delay={0.5}
              />

              {/* "Let's make it real" - Big and bold with glitch */}
              <GlitchText
                text={t("sections.letsGoReal")}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
                style={{
                  textShadow: "0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)",
                }}
                delay={0.7}
                glitchIntensity="high"
                as="h1"
              />
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
        )}
      </AnimatePresence>

      {/* Content Overlay - Position alternates (hidden on section 0 and 14) */}
      {section > 0 && section !== 14 && (targetSection === null || showCard) && (
        <div
          className={`absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center ${positionClass}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${section}-${i18n.language}-${showCard}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94] // Custom ease for smooth entrance
                }
              }}
              exit={{ opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }}
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
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                )}

                {section === 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all pointer-events-auto"
                  >
                    {t("home.cta")}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Portfolio Section - Section 14 */}
      <AnimatePresence>
        {section === 14 && (targetSection === null || showCard) && (
          <motion.div
            ref={portfolioScrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 overflow-y-auto pointer-events-auto"
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-sm" />

            <div className="relative min-h-screen px-4 sm:px-6 py-24">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-sm text-white/60">{t("portfolio.subtitle")}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
                    {t("portfolio.heading")}
                  </h1>
                  <p className="text-base text-white/50 max-w-xl mx-auto">
                    {t("portfolio.description")}
                  </p>
                </motion.div>

                {/* Projects */}
                <div className="space-y-6">
                  {/* Featured */}
                  <FeaturedProjectCard
                    project={projects[0]}
                    onClick={() => setSelectedProject(projects[0])}
                  />

                  {/* Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.slice(1).map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        onClick={() => setSelectedProject(project)}
                      />
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-900/80 to-gray-900/40 border border-white/10 p-8 md:p-12 text-center">
                    <div className="absolute inset-0 bg-linear-to-r from-violet-600/10 via-transparent to-cyan-600/10" />
                    <div className="relative">
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">{t("portfolio.cta.title")}</h3>
                      <p className="text-white/50 mb-6 max-w-lg mx-auto">{t("portfolio.cta.description")}</p>
                      <button className="px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 font-bold rounded-xl text-white hover:scale-105 active:scale-95 transition-transform">
                        {t("portfolio.cta.button")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* Project pagination indicator when in detail view */}
      <AnimatePresence>
        {selectedExperience && section === 13 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3"
          >
            {selectedExperience.projects.map((_, i) => {
              const currentProject = Math.round(detailScrollOffset);
              const isActive = i === currentProject;
              const isPast = i < currentProject;

              return (
                <motion.button
                  key={i}
                  onClick={() => {
                    targetOffsetRef.current = i;
                    isSnappingRef.current = true;
                  }}
                  className={`relative w-3 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "h-8 bg-cyan-400"
                      : isPast
                        ? "h-3 bg-cyan-400/50"
                        : "h-3 bg-white/20 hover:bg-white/40"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              );
            })}

            {/* Project counter */}
            <div className="mt-2 text-xs text-white/50 font-mono">
              {Math.round(detailScrollOffset) + 1}/{selectedExperience.projects.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint when in detail view */}
      <AnimatePresence>
        {selectedExperience &&
          section === 13 &&
          detailScrollOffset < 0.1 &&
          selectedExperience.projects.length > 1 && (
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
