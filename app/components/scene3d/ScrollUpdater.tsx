import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { getSectionFromOffset } from "./camera.utils";

interface ScrollUpdaterProps {
  onSectionChange?: (s: number) => void;
  targetSection?: number | null;
  onFirstSectionAnimationComplete?: () => void;
}

export default function ScrollUpdater({
  onSectionChange,
  targetSection,
  onFirstSectionAnimationComplete,
}: ScrollUpdaterProps) {
  const scroll = useScroll();
  const lastSection = useRef(-1);
  const lastTargetSection = useRef<number | null>(null);
  const firstSectionAnimationFired = useRef(false);

  useFrame(() => {
    // If we have a target section from navigation, use it directly
    if (
      targetSection !== null &&
      targetSection !== undefined &&
      targetSection !== lastTargetSection.current
    ) {
      lastTargetSection.current = targetSection;
      lastSection.current = targetSection;
      if (onSectionChange) onSectionChange(targetSection);
      return;
    }

    // Reset when navigation is complete
    if (targetSection === null && lastTargetSection.current !== null) {
      lastTargetSection.current = null;
    }

    // Don't update section from scroll while navigating
    if (targetSection !== null) {
      return;
    }

    const offset = scroll.offset;
    const newSection = getSectionFromOffset(offset);

    if (newSection !== lastSection.current) {
      lastSection.current = newSection;
      if (onSectionChange) onSectionChange(newSection);
    }

    // Detect when section 1 starts
    if (
      offset >= 0.001 &&
      !firstSectionAnimationFired.current &&
      lastSection.current === 1
    ) {
      firstSectionAnimationFired.current = true;
      if (onFirstSectionAnimationComplete) onFirstSectionAnimationComplete();
    }

    // Reset the flag when leaving section 1
    if (newSection !== 1) {
      firstSectionAnimationFired.current = false;
    }
  });

  return null;
}
