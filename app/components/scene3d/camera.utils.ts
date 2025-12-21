import * as THREE from "three";
import {
  SECTION_SNAP_OFFSETS,
  SECTION_CAMERA_POSITIONS,
  GROUP_TRANSITION_SECTIONS,
} from "./camera.constants";

// Easing functions
export function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Map section number to scroll offset
export function getSectionOffset(section: number): number {
  return SECTION_SNAP_OFFSETS[section] ?? 0;
}

// Get section from offset
export function getSectionFromOffset(offset: number): number {
  for (let i = SECTION_SNAP_OFFSETS.length - 1; i >= 0; i--) {
    if (offset >= SECTION_SNAP_OFFSETS[i] - 0.02) {
      return i;
    }
  }
  return 0;
}

// Calculate camera position for a given section
export function getCameraPositionForSection(section: number) {
  return SECTION_CAMERA_POSITIONS[section] ?? SECTION_CAMERA_POSITIONS[0];
}

// Get camera position with smooth interpolation between sections
export function getInterpolatedCameraPosition(offset: number) {
  const section = getSectionFromOffset(offset);
  const nextSection = Math.min(section + 1, SECTION_SNAP_OFFSETS.length - 1);

  const currentOffset = SECTION_SNAP_OFFSETS[section];
  const nextOffset = SECTION_SNAP_OFFSETS[nextSection];

  // Calculate progress between current and next section
  const range = nextOffset - currentOffset;
  const progress =
    range > 0 ? Math.max(0, Math.min(1, (offset - currentOffset) / range)) : 0;

  const currentPos = SECTION_CAMERA_POSITIONS[section];
  const nextPos = SECTION_CAMERA_POSITIONS[nextSection];

  if (!currentPos || !nextPos) {
    return { ...SECTION_CAMERA_POSITIONS[0], lookZ: 0 };
  }

  const t = easeInOutQuint(progress);

  // Check if this is a group transition (needs zoom-out effect)
  const isGroupTransition = GROUP_TRANSITION_SECTIONS.has(nextSection);

  // For transitions between major sections
  const isMajorTransition =
    (section <= 12 && nextSection === 13) ||
    (section === 13 && nextSection === 14) ||
    (section === 14 && nextSection === 15) ||
    (section === 13 && section > nextSection) ||
    (section === 14 && section > nextSection) ||
    (section === 15 && section > nextSection);

  // Calculate zoom-out curve for transitions
  let zoomOffset = 0;
  if ((isGroupTransition || isMajorTransition) && progress > 0) {
    const smoothstep = progress * progress * (3 - 2 * progress);
    const bellBase = Math.sin(smoothstep * Math.PI);
    const zoomCurve = Math.pow(bellBase, 0.8);
    zoomOffset = zoomCurve * (isMajorTransition ? 12 : 4);
  }

  // Special zoom-in effect for Experience section (13)
  let experienceZoomIn = 0;
  if (section === 13) {
    experienceZoomIn = -4 * easeOutExpo(progress);
  }

  return {
    x: THREE.MathUtils.lerp(currentPos.x, nextPos.x, t),
    y: THREE.MathUtils.lerp(currentPos.y, nextPos.y, t),
    z:
      THREE.MathUtils.lerp(currentPos.z, nextPos.z, t) +
      zoomOffset +
      experienceZoomIn,
    lookX: THREE.MathUtils.lerp(currentPos.lookX, nextPos.lookX, t),
    lookY: THREE.MathUtils.lerp(currentPos.lookY, nextPos.lookY, t),
    lookZ: THREE.MathUtils.lerp(currentPos.lookZ ?? 0, nextPos.lookZ ?? 0, t),
  };
}

// Determine which major section we're in
export type MajorSection = "skills" | "experience" | "portfolio" | "about";

export function getMajorSection(section: number): MajorSection {
  if (section <= 12) return "skills";
  if (section === 13) return "experience";
  if (section === 14) return "portfolio";
  return "about";
}
