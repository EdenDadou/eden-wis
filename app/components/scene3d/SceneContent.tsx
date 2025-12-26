import { Float } from "@react-three/drei";
import { useState } from "react";
import WebsiteBuilder from "../WebsiteBuilder";
import Timeline3D, { type Experience as ExperienceType } from "../Timeline3D";
import Portfolio3D from "../Portfolio3D";
import About3D from "../About3D";
import Contact3D from "../Contact3D";
import PixelHeart3D from "./PixelHeart3D";
import { RotatingWorld, FadingSection } from "./world";
import { ORBIT_RADIUS } from "./camera.constants";
import { getMajorSection } from "./camera.utils";

interface SceneContentProps {
  section: number;
  onExperienceSelect?: (experience: ExperienceType | null) => void;
  selectedExperienceId?: string | null;
  onSkillClick?: (skillSection: number) => void;
}

export default function SceneContent({
  section,
  onExperienceSelect,
  selectedExperienceId,
  onSkillClick,
}: SceneContentProps) {
  const [isWorldAnimating, setIsWorldAnimating] = useState(false);
  const activeMajorSection = getMajorSection(section);

  return (
    <RotatingWorld
      currentSection={section}
      targetSection={section}
      onAnimatingChange={setIsWorldAnimating}
    >
      {/* Skills section - at 0° on the circle (front) */}
      <FadingSection
        isActive={activeMajorSection === "skills"}
        isAnimating={isWorldAnimating}
        isIncoming={false}
        sectionType="skills"
      >
        <group position={[0, 0, ORBIT_RADIUS]}>
          <Float rotationIntensity={0.05} floatIntensity={0.1} speed={1}>
            <WebsiteBuilder
              currentSection={section}
              onSkillClick={onSkillClick}
            />
          </Float>
        </group>
      </FadingSection>

      {/* Timeline 3D Experience - at 120° */}
      <FadingSection
        isActive={activeMajorSection === "experience"}
        isAnimating={isWorldAnimating}
        isIncoming={false}
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
        isIncoming={false}
        sectionType="portfolio"
      >
        <Portfolio3D />
      </FadingSection>

      {/* About 3D - at 216° */}
      <FadingSection
        isActive={activeMajorSection === "about"}
        isAnimating={isWorldAnimating}
        isIncoming={false}
        sectionType="about"
      >
        <About3D />
      </FadingSection>

      {/* Contact 3D - at 288° */}
      <FadingSection
        isActive={activeMajorSection === "contact"}
        isAnimating={isWorldAnimating}
        isIncoming={false}
        sectionType="contact"
      >
        <Contact3D />
      </FadingSection>

      {/* Central decoration - 3D pixel heart */}
      <PixelHeart3D />
    </RotatingWorld>
  );
}
