import type { Route } from "./+types/home";
import { lazy, Suspense } from "react";
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

      if ((isFromOverview || isFromSkillDetail) && isValidTarget && isDifferentSkill) {
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
  const handleExperienceSelect = useCallback((experience: Experience | null) => {
    setSelectedExperience(experience);
    setDetailScrollOffset(0);
    if (experience) {
      maxScrollRef.current = Math.max(0, experience.projects.length - 1);
    }
  }, []);

  const handleBackToTimeline = useCallback(() => {
    setSelectedExperience(null);
    setDetailScrollOffset(0);
  }, []);

  // Portfolio scroll ref
  const portfolioScrollRef = useRef<HTMLDivElement>(null);

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
        targetSection={null}
        isNavigating={isNavigating}
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
