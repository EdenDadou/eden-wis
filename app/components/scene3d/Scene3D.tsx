import { experienceData, type Experience as ExperienceType } from "../Timeline3D";
import SceneEnvironment from "./SceneEnvironment";
import SceneContent from "./SceneContent";
import CameraRig from "./CameraRig";
import "../../styles/global.css";

interface Scene3DProps {
  section: number;
  onExperienceSelect?: (experience: ExperienceType | null) => void;
  selectedExperienceId?: string | null;
  detailScrollOffset?: number;
  onNavigationComplete?: () => void;
  onSkillClick?: (skillSection: number) => void;
}

export default function Scene3D({
  section,
  onExperienceSelect,
  selectedExperienceId,
  onNavigationComplete,
  onSkillClick,
}: Scene3DProps) {
  const selectedExperience = selectedExperienceId
    ? experienceData.find(
        (e: ExperienceType) => e.id === selectedExperienceId
      ) || null
    : null;

  return (
    <>
      <SceneEnvironment />

      <CameraRig
        selectedExperience={null}
        targetSection={section}
        onNavigationComplete={onNavigationComplete}
      />

      {/* Main content - always visible, modal handles experience detail */}
      <SceneContent
        section={section}
        onExperienceSelect={onExperienceSelect}
        selectedExperienceId={selectedExperienceId}
        onSkillClick={onSkillClick}
      />
    </>
  );
}
