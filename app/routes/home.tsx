import type { Route } from "./+types/home";
import { lazy, Suspense, useEffect } from "react";
import "../styles/global.css";
import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";

// Lazy load the heavy 3D Scene component
const Scene = lazy(() => import("../components/Scene"));
import { TopNav, SectionIndicator } from "../components/navigation";
import {
  HeroSection,
  SkillsSection,
  ExperienceSection,
  PortfolioSection,
  AboutSection,
  ContactSection,
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
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState(0);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [detailScrollOffset, setDetailScrollOffset] = useState(0);
  const [showCard, setShowCard] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Navigation function
  const navigateToSection = useCallback((sectionNumber: number) => {
    setSection(sectionNumber);
    setShowCard(false);
    setIsNavigating(true);

    setTimeout(() => {
      setShowCard(true);
    }, 200);
  }, []);

  // Fast navigation back to skills menu
  const navigateBackToSkillsMenu = useCallback(() => {
    setSection(1);
    setShowCard(true);
    setIsNavigating(false);
  }, []);

  // Handle skill click - navigate to that skill's detail view
  const handleSkillClick = useCallback(
    (skillSection: number) => {
      const isFromOverview = section === 1;
      const isFromSkillDetail = section >= 2 && section <= 9;
      const isValidTarget = skillSection >= 2 && skillSection <= 9;
      const isDifferentSkill = skillSection !== section;

      if (
        (isFromOverview || isFromSkillDetail) &&
        isValidTarget &&
        isDifferentSkill
      ) {
        setSection(skillSection);
        setShowCard(false);

        setTimeout(() => {
          setShowCard(true);
        }, 400);
      }
    },
    [section]
  );

  const handleNavigationComplete = useCallback(() => {
    setIsNavigating(false);
    setShowCard(true);
  }, []);

  // Experience detail scroll handling
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSnappingRef = useRef(false);
  const targetOffsetRef = useRef(0);
  const maxScrollRef = useRef(0);

  // Handle experience selection
  const handleExperienceSelect = useCallback(
    (experience: Experience | null) => {
      setSelectedExperience(experience);
      setDetailScrollOffset(0);
      if (experience) {
        maxScrollRef.current = Math.max(0, experience.projects.length - 1);
      }
    },
    []
  );

  const handleBackToTimeline = useCallback(() => {
    setSelectedExperience(null);
    setDetailScrollOffset(0);
  }, []);

  // Portfolio scroll ref
  const portfolioScrollRef = useRef<HTMLDivElement>(null);

  // Scroll timing to prevent rapid section changes
  const lastScrollTimeRef = useRef(0);

  // Main sections for scroll navigation (simplified flow)
  // 0=Hero, 1=Skills, 10=Experience, 11=Portfolio, 12=About, 13=Contact
  const MAIN_SECTIONS = [0, 1, 10, 11, 12, 13];

  // Handle wheel scroll to navigate between main sections
  useEffect(() => {
    if (isLoading) return;

    const handleWheel = (e: WheelEvent) => {
      // Skip if we're in a detail view or navigating
      if (selectedExperience || selectedProject || isNavigating) return;

      // Skip if scrolling inside a scrollable element (except portfolio which we handle specially)
      const target = e.target as HTMLElement;
      if (target.closest("[data-scrollable]")) return;

      const deltaY = e.deltaY;
      const threshold = 50; // Minimum scroll delta to trigger

      if (Math.abs(deltaY) < threshold) return;

      // Special handling for Portfolio section (11) - allow scrolling the content
      if (section === 11 && portfolioScrollRef.current) {
        const el = portfolioScrollRef.current;
        const isAtTop = el.scrollTop <= 0;
        const isAtBottom =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

        // Allow natural scroll if not at edges
        if (deltaY > 0 && !isAtBottom) {
          return; // Let the portfolio scroll naturally
        }
        if (deltaY < 0 && !isAtTop) {
          return; // Let the portfolio scroll naturally
        }

        // At edge - apply cooldown before section change
        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollTimeRef.current;
        if (timeSinceLastScroll < 600) return;
        lastScrollTimeRef.current = now;

        // Navigate to next/prev section
        if (deltaY > 0 && isAtBottom) {
          navigateToSection(12); // Go to About
        } else if (deltaY < 0 && isAtTop) {
          navigateToSection(10); // Go to Experience
        }
        return;
      }

      // Normal section navigation with cooldown
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      if (timeSinceLastScroll < 600) return;
      lastScrollTimeRef.current = now;

      // Skills section: scroll through each skill (1 -> 2 -> 3 -> ... -> 9 -> 10)
      // Section 1 = Skills Overview, Sections 2-9 = Individual skills
      if (section >= 1 && section <= 9) {
        if (deltaY > 0) {
          // Scroll down
          if (section < 9) {
            // Go to next skill (or first skill if on overview)
            navigateToSection(section === 1 ? 2 : section + 1);
          } else {
            // At last skill (9), go to Experience (10)
            navigateToSection(10);
          }
        } else {
          // Scroll up
          if (section > 2) {
            // Go to previous skill
            navigateToSection(section - 1);
          } else if (section === 2) {
            // At first skill, go back to overview
            navigateToSection(1);
          } else {
            // At overview (1), go to Hero (0)
            navigateToSection(0);
          }
        }
        return;
      }

      // Experience section (10) - scroll up goes to last skill
      if (section === 10 && deltaY < 0) {
        navigateToSection(9); // Go back to last skill
        return;
      }

      // Other sections: use main sections array
      const effectiveIndex = MAIN_SECTIONS.indexOf(section);

      if (deltaY > 0) {
        // Scroll down - go to next section
        const nextIndex = Math.min(
          effectiveIndex + 1,
          MAIN_SECTIONS.length - 1
        );
        if (MAIN_SECTIONS[nextIndex] !== section) {
          navigateToSection(MAIN_SECTIONS[nextIndex]);
        }
      } else {
        // Scroll up - go to previous section
        const prevIndex = Math.max(effectiveIndex - 1, 0);
        if (MAIN_SECTIONS[prevIndex] !== section) {
          navigateToSection(MAIN_SECTIONS[prevIndex]);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [
    isLoading,
    section,
    selectedExperience,
    selectedProject,
    isNavigating,
    navigateToSection,
  ]);

  return (
    <main className="w-full h-screen bg-linear-to-b from-[#0a192f] via-[#0d2847] to-[#164e63] relative overflow-hidden">
      {/* Loading screen with preloading */}
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      <Suspense fallback={null}>
        <Scene
          section={section}
          onExperienceSelect={handleExperienceSelect}
          selectedExperienceId={selectedExperience?.id || null}
          detailScrollOffset={detailScrollOffset}
          onNavigationComplete={handleNavigationComplete}
          onSkillClick={handleSkillClick}
        />
      </Suspense>

      {/* Top Navigation Menu */}
      <TopNav section={section} onNavigate={navigateToSection} />

      {/* Section Progress Indicator */}
      <SectionIndicator currentSection={section} />

      {/* Section 0 - Accueil */}
      <AnimatePresence>
        {section === 0 && <HeroSection isVisible={section === 0} />}
      </AnimatePresence>

      {/* Sections 1-9 - Compétences */}
      <SkillsSection
        section={section}
        showCard={showCard}
        targetSection={null}
        isFirstCardReady={section >= 1}
        isNavigating={isNavigating}
        onBackToSkillsMenu={navigateBackToSkillsMenu}
        onNavigateSkill={handleSkillClick}
        onNavigateToPortfolio={() => navigateToSection(11)}
      />

      {/* Section 10 - Expérience */}
      <ExperienceSection
        section={section}
        selectedExperience={selectedExperience}
        detailScrollOffset={detailScrollOffset}
        targetOffsetRef={targetOffsetRef}
        isSnappingRef={isSnappingRef}
        onBackToTimeline={handleBackToTimeline}
      />

      {/* Section 11 - Portfolio */}
      <PortfolioSection
        section={section}
        showCard={showCard}
        targetSection={null}
        isNavigating={isNavigating}
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        scrollRef={portfolioScrollRef}
      />

      {/* Section 12 - About */}
      <AboutSection
        section={section}
        showCard={showCard}
        targetSection={null}
        isNavigating={isNavigating}
        onNavigateToContact={() => navigateToSection(13)}
      />

      {/* Section 13 - Contact */}
      <ContactSection
        section={section}
        showCard={showCard}
        targetSection={null}
        isNavigating={isNavigating}
      />
    </main>
  );
}
