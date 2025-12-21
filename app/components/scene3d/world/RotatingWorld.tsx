import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SECTION_ANGLES } from "../camera.constants";
import { easeInOutQuint, getMajorSection, type MajorSection } from "../camera.utils";

// Get rotation angle for major section (to bring it to front)
function getRotationForSection(majorSection: MajorSection): number {
  switch (majorSection) {
    case "skills":
      return 0;
    case "experience":
      return -SECTION_ANGLES.experience;
    case "portfolio":
      return -SECTION_ANGLES.portfolio;
    case "about":
      return -SECTION_ANGLES.about;
  }
}

// Helper to normalize angle to [0, 2PI)
function normalizeAngle(angle: number): number {
  const TWO_PI = Math.PI * 2;
  let normalized = angle % TWO_PI;
  if (normalized < 0) normalized += TWO_PI;
  return normalized;
}

// Helper to find shortest angular distance (returns signed value)
function shortestAngleDist(from: number, to: number): number {
  const TWO_PI = Math.PI * 2;
  const fromNorm = normalizeAngle(from);
  const toNorm = normalizeAngle(to);
  let diff = toNorm - fromNorm;
  if (diff > Math.PI) diff -= TWO_PI;
  if (diff < -Math.PI) diff += TWO_PI;
  return diff;
}

interface RotatingWorldProps {
  children: React.ReactNode;
  currentSection: number;
  targetSection: number | null;
  onAnimatingChange?: (isAnimating: boolean) => void;
}

export default function RotatingWorld({
  children,
  currentSection,
  targetSection,
  onAnimatingChange,
}: RotatingWorldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentMajorSection = useRef<MajorSection>("skills");
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startRotation = useRef(0);
  const endRotation = useRef(0);
  const lastAnimatingState = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const effectiveSection = targetSection ?? currentSection;
    const majorSection = getMajorSection(effectiveSection);

    if (majorSection !== currentMajorSection.current && !isAnimating.current) {
      currentMajorSection.current = majorSection;

      const newTargetRotation = getRotationForSection(majorSection);
      startRotation.current = groupRef.current.rotation.y;

      const shortestDist = shortestAngleDist(
        startRotation.current,
        newTargetRotation
      );
      endRotation.current = startRotation.current + shortestDist;

      isAnimating.current = true;
      animationProgress.current = 0;
    }

    if (isAnimating.current) {
      animationProgress.current += delta * 0.6;

      if (animationProgress.current >= 1) {
        animationProgress.current = 1;
        isAnimating.current = false;
        groupRef.current.rotation.y = endRotation.current;
      } else {
        const t = animationProgress.current;
        const smoothEase = easeInOutQuint(t);

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          startRotation.current,
          endRotation.current,
          smoothEase
        );
      }
    }

    if (lastAnimatingState.current !== isAnimating.current) {
      lastAnimatingState.current = isAnimating.current;
      if (onAnimatingChange) {
        onAnimatingChange(isAnimating.current);
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
