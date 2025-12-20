import type { Route } from "./+types/home";
import Scene from "../components/Scene";
import "../styles/global.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { TopNav, SectionIndicator } from "../components/navigation";
import {
  HeroSection,
  SkillsSection,
  ExperienceSection,
  PortfolioSection,
  AboutSection,
} from "../components/sections";
import type { Experience } from "../components/Timeline3D";
import type { Project } from "../types";
import { projects } from "../constants";

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
  const [isFirstCardReady, setIsFirstCardReady] = useState(false);
  const prevSectionRef = useRef(0);

  // Handle when section 1 3D animation is complete
  const handleFirstSectionAnimationComplete = useCallback(() => {
    setIsFirstCardReady(true);
  }, []);

  // Reset isFirstCardReady when leaving section 1
  useEffect(() => {
    if (section !== 1) {
      setIsFirstCardReady(false);
    }
    prevSectionRef.current = section;
  }, [section]);

  // Navigation functions for menu
  const navigateToSection = useCallback((sectionNumber: number) => {
    setSection(sectionNumber);
    setTargetSection(sectionNumber);
    setShowCard(false);

    // Faster card appearance for Skills section (section 1)
    const cardDelay = sectionNumber === 1 ? 150 : 200;
    setTimeout(() => {
      setShowCard(true);
    }, cardDelay);
  }, []);

  // Handle skill click - navigate to that skill's detail view
  const handleSkillClick = useCallback(
    (skillSection: number) => {
      // Only navigate if we're in the skills overview (section 1)
      if (section === 1 && skillSection >= 3 && skillSection <= 12) {
        setSection(skillSection);
        setTargetSection(skillSection);
        setShowCard(false);

        // Show card faster for skill clicks
        setTimeout(() => {
          setShowCard(true);
        }, 400);
      }
    },
    [section]
  );

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
        return prev + diff * 0.15;
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
    if (!selectedExperience) {
      setDetailScrollOffset(0);
      maxScrollRef.current = 0;
      return;
    }

    const projectCount = selectedExperience.projects.length;
    maxScrollRef.current = Math.max(0, projectCount - 1);

    const snapToNearest = (offset: number) => {
      const nearestSnap = Math.round(offset);
      const clampedSnap = Math.max(
        0,
        Math.min(maxScrollRef.current, nearestSnap)
      );

      targetOffsetRef.current = clampedSnap;
      isSnappingRef.current = true;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      isSnappingRef.current = false;

      setDetailScrollOffset((prev) => {
        const delta = e.deltaY * 0.003;
        const newOffset = prev + delta;
        return Math.max(0, Math.min(maxScrollRef.current, newOffset));
      });

      scrollTimeoutRef.current = setTimeout(() => {
        setDetailScrollOffset((current) => {
          snapToNearest(current);
          return current;
        });
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const direction = e.key === "ArrowDown" ? 1 : -1;
        setDetailScrollOffset((current) => {
          const currentSnap = Math.round(current);
          const nextSnap = Math.max(
            0,
            Math.min(maxScrollRef.current, currentSnap + direction)
          );
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
    if (section !== 14) {
      portfolioScrollAccumulator.current = 0;
      return;
    }

    const handlePortfolioWheel = (e: WheelEvent) => {
      const container = portfolioScrollRef.current;
      if (!container) return;

      if (e.deltaY < 0 && container.scrollTop <= 0) {
        e.preventDefault();
        portfolioScrollAccumulator.current += Math.abs(e.deltaY);

        if (portfolioScrollAccumulator.current > 100) {
          portfolioScrollAccumulator.current = 0;
          navigateToSection(13);
        }
      } else {
        portfolioScrollAccumulator.current = 0;
      }
    };

    const container = portfolioScrollRef.current;
    if (container) {
      container.addEventListener("wheel", handlePortfolioWheel, {
        passive: false,
      });
      return () => {
        container.removeEventListener("wheel", handlePortfolioWheel);
      };
    }
  }, [section, navigateToSection]);

  return (
    <main className="w-full h-screen bg-linear-to-b from-[#0a192f] via-[#0d2847] to-[#164e63] relative overflow-hidden">
      <Scene
        onSectionChange={setSection}
        onExperienceSelect={setSelectedExperience}
        selectedExperienceId={selectedExperience?.id || null}
        detailScrollOffset={detailScrollOffset}
        targetSection={targetSection}
        onNavigationComplete={handleNavigationComplete}
        onFirstSectionAnimationComplete={handleFirstSectionAnimationComplete}
        onSkillClick={handleSkillClick}
      />

      {/* Top Navigation Menu */}
      <TopNav section={section} onNavigate={navigateToSection} />

      {/* Section Progress Indicator */}
      <SectionIndicator currentSection={section} />

      {/* Section 0 - Accueil */}
      <AnimatePresence>
        {section === 0 && <HeroSection isVisible={section === 0} />}
      </AnimatePresence>

      {/* Sections 1-12 - Compétences */}
      <SkillsSection
        section={section}
        showCard={showCard}
        targetSection={targetSection}
        isFirstCardReady={isFirstCardReady}
      />

      {/* Section 13 - Expérience */}
      <ExperienceSection
        section={section}
        selectedExperience={selectedExperience}
        detailScrollOffset={detailScrollOffset}
        targetOffsetRef={targetOffsetRef}
        isSnappingRef={isSnappingRef}
        onBackToTimeline={handleBackToTimeline}
      />

      {/* Section 14 - Portfolio */}
      <PortfolioSection
        section={section}
        showCard={showCard}
        targetSection={targetSection}
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        scrollRef={portfolioScrollRef}
      />

      {/* Section 15 - About */}
      <AboutSection
        section={section}
        showCard={showCard}
        targetSection={targetSection}
      />
    </main>
  );
}
