import { AnimatePresence } from "framer-motion";
import type { Experience } from "../Timeline3D";
import { ExperienceModal } from "../experience";

interface ExperienceSectionProps {
  section: number;
  selectedExperience: Experience | null;
  showModal?: boolean;
  onCloseModal?: () => void;
}

export function ExperienceSection({
  section,
  selectedExperience,
  showModal = false,
  onCloseModal,
}: ExperienceSectionProps) {
  return (
    <AnimatePresence>
      {showModal && selectedExperience && onCloseModal && (
        <ExperienceModal
          experience={selectedExperience}
          onClose={onCloseModal}
        />
      )}
    </AnimatePresence>
  );
}
