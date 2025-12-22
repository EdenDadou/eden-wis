import { ScrollControls, Float } from "@react-three/drei";
import { useState, useCallback } from "react";
import WebsiteBuilder from "./WebsiteBuilder";
import Timeline3D, {
  type Experience as ExperienceType,
  experienceData,
} from "./Timeline3D";
import ExperienceDetail3D from "./ExperienceDetail3D";
import Portfolio3D from "./Portfolio3D";
import About3D from "./About3D";
import Contact3D from "./Contact3D";
import "../styles/global.css";

// Scene3D components
import {
  CameraRig,
  ScrollUpdater,
  PixelHeart3D,
  AnimatedStars,
  SpaceDust,
  Satellite,
  RotatingWorld,
  FadingSection,
  ShootingStar,
  ShootingStarBright,
  GradientSky,
  SceneLighting,
  ORBIT_RADIUS,
  getMajorSection,
} from "./scene3d";

interface ExperienceProps {
  onSectionChange?: (section: number) => void;
  onExperienceSelect?: (experience: ExperienceType | null) => void;
  selectedExperienceId?: string | null;
  detailScrollOffset?: number;
  targetSection?: number | null;
  onNavigationComplete?: () => void;
  onFirstSectionAnimationComplete?: () => void;
  onSkillClick?: (skillSection: number) => void;
}

export default function Experience({
  onSectionChange,
  onExperienceSelect,
  selectedExperienceId,
  detailScrollOffset = 0,
  targetSection,
  onNavigationComplete,
  onFirstSectionAnimationComplete,
  onSkillClick,
}: ExperienceProps) {
  const selectedExperience = selectedExperienceId
    ? experienceData.find(
        (e: ExperienceType) => e.id === selectedExperienceId
      ) || null
    : null;

  const [currentSection, setCurrentSection] = useState(0);
  const [isWorldAnimating, setIsWorldAnimating] = useState(false);
  const [snapOffset, setSnapOffset] = useState<number | null>(null);

  const handleRequestSnap = useCallback((offset: number) => {
    setSnapOffset(offset);
    setTimeout(() => setSnapOffset(null), 500);
  }, []);

  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
    if (onSectionChange) onSectionChange(section);
  };

  const activeMajorSection = getMajorSection(currentSection);
  // Calculate incoming section during animation (based on targetSection)
  const targetMajorSection = targetSection !== null && targetSection !== undefined
    ? getMajorSection(targetSection)
    : null;

  return (
    <>
      <GradientSky />

      {/* Animated background elements */}
      <AnimatedStars />
      <SpaceDust />

      {/* Shooting stars */}
      <ShootingStar delay={2} />
      <ShootingStar delay={7} />
      <ShootingStar delay={12} />
      <ShootingStar delay={18} />
      <ShootingStar delay={24} />
      <ShootingStar delay={31} />

      {/* Brighter shooting stars */}
      <ShootingStarBright delay={5} />
      <ShootingStarBright delay={15} />
      <ShootingStarBright delay={28} />

      {/* Satellites */}
      <Satellite radius={18} speed={0.15} offset={0} tilt={0.3} />
      <Satellite radius={22} speed={0.1} offset={Math.PI} tilt={-0.5} />
      <Satellite radius={15} speed={0.2} offset={Math.PI / 2} tilt={0.8} />

      <SceneLighting />

      <ScrollControls pages={25} damping={0.25}>
        <CameraRig
          selectedExperience={selectedExperience}
          targetSection={targetSection}
          onNavigationComplete={onNavigationComplete}
          snapOffset={snapOffset}
          onRequestSnap={handleRequestSnap}
        />
        <ScrollUpdater
          onSectionChange={handleSectionChange}
          targetSection={targetSection}
          onFirstSectionAnimationComplete={onFirstSectionAnimationComplete}
        />

        {/* Main content - hidden when in detail view */}
        {!selectedExperience && (
          <RotatingWorld
            currentSection={currentSection}
            targetSection={targetSection ?? null}
            onAnimatingChange={setIsWorldAnimating}
          >
            {/* Skills section - at 0° on the circle (front) */}
            <FadingSection
              isActive={activeMajorSection === "skills"}
              isAnimating={isWorldAnimating}
              isIncoming={targetMajorSection === "skills"}
              sectionType="skills"
            >
              <group position={[0, 0, ORBIT_RADIUS]}>
                <Float rotationIntensity={0.05} floatIntensity={0.1} speed={1}>
                  <WebsiteBuilder
                    currentSection={currentSection}
                    onSkillClick={onSkillClick}
                  />
                </Float>
              </group>
            </FadingSection>

            {/* Timeline 3D Experience - at 120° */}
            <FadingSection
              isActive={activeMajorSection === "experience"}
              isAnimating={isWorldAnimating}
              isIncoming={targetMajorSection === "experience"}
              sectionType="experience"
            >
              <Timeline3D
                onExperienceSelect={onExperienceSelect || (() => {})}
                selectedId={selectedExperienceId || null}
              />
            </FadingSection>

            {/* Portfolio 3D - at 180° */}
            <FadingSection
              isActive={activeMajorSection === "portfolio"}
              isAnimating={isWorldAnimating}
              isIncoming={targetMajorSection === "portfolio"}
              sectionType="portfolio"
            >
              <Portfolio3D />
            </FadingSection>

            {/* About 3D - at 216° */}
            <FadingSection
              isActive={activeMajorSection === "about"}
              isAnimating={isWorldAnimating}
              isIncoming={targetMajorSection === "about"}
              sectionType="about"
            >
              <About3D />
            </FadingSection>

            {/* Contact 3D - at 288° */}
            <FadingSection
              isActive={activeMajorSection === "contact"}
              isAnimating={isWorldAnimating}
              isIncoming={targetMajorSection === "contact"}
              sectionType="contact"
            >
              <Contact3D />
            </FadingSection>

            {/* Central decoration - 3D pixel heart */}
            <PixelHeart3D />
          </RotatingWorld>
        )}

        {/* Experience Detail View */}
        {selectedExperience && (
          <ExperienceDetail3D
            experience={selectedExperience}
            scrollOffset={detailScrollOffset}
          />
        )}
      </ScrollControls>
    </>
  );
}
