import { experienceData, type Experience as ExperienceType } from "../Timeline3D";
import ExperienceDetail3D from "../ExperienceDetail3D";
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
  detailScrollOffset = 0,
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
        selectedExperience={selectedExperience}
        targetSection={section}
        onNavigationComplete={onNavigationComplete}
      />

      {/* Main content - hidden when in detail view */}
      {!selectedExperience && (
        <SceneContent
          section={section}
          onExperienceSelect={onExperienceSelect}
          selectedExperienceId={selectedExperienceId}
          onSkillClick={onSkillClick}
        />
      )}

      {/* Experience Detail View */}
      {selectedExperience && (
        <ExperienceDetail3D
          experience={selectedExperience}
          scrollOffset={detailScrollOffset}
        />
      )}
    </>
  );
}
