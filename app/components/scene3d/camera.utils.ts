import * as THREE from "three";
import {
  SECTION_SNAP_OFFSETS,
  SECTION_CAMERA_POSITIONS,
  GROUP_TRANSITION_SECTIONS,
  SKILL_SECTION_BOUNDARIES,
} from "./camera.constants";

// Easing functions for smooth animations
export function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Smooth step function for natural transitions
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
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

  // Use smooth easing for all transitions
  const t = easeInOutCubic(progress);

  // Check if transitioning between skill groups (for subtle zoom effect)
  const isEnteringNewGroup = checkGroupTransition(section, nextSection);

  // Check if this is a major section transition (skills → timeline, etc.)
  const isMajorTransition = GROUP_TRANSITION_SECTIONS.has(nextSection);

  // Calculate smooth zoom curve for group transitions
  let zoomOffset = 0;

  if (isMajorTransition && progress > 0) {
    // Major transition (skills → experience): larger zoom-out
    const bellCurve = Math.sin(progress * Math.PI);
    zoomOffset = bellCurve * 8;
  } else if (isEnteringNewGroup && progress > 0) {
    // Subtle zoom when moving between skill groups (Frontend→Backend, Backend→DevOps)
    const bellCurve = Math.sin(progress * Math.PI);
    zoomOffset = bellCurve * 2;
  }

  // Smooth vertical arc for transitions between skills in different rows
  const yDiff = Math.abs(nextPos.y - currentPos.y);
  let arcOffset = 0;
  if (yDiff > 0.5) {
    // Add subtle arc when moving vertically between skills
    const arcCurve = Math.sin(progress * Math.PI);
    arcOffset = arcCurve * 0.5;
  }

  return {
    x: THREE.MathUtils.lerp(currentPos.x, nextPos.x, t),
    y: THREE.MathUtils.lerp(currentPos.y, nextPos.y, t) + arcOffset,
    z: THREE.MathUtils.lerp(currentPos.z, nextPos.z, t) + zoomOffset,
    lookX: THREE.MathUtils.lerp(currentPos.lookX, nextPos.lookX, t),
    lookY: THREE.MathUtils.lerp(currentPos.lookY, nextPos.lookY, t) + arcOffset * 0.5,
    lookZ: THREE.MathUtils.lerp(currentPos.lookZ ?? 0, nextPos.lookZ ?? 0, t),
  };
}

// Check if transitioning between skill groups
function checkGroupTransition(currentSection: number, nextSection: number): boolean {
  const { FRONTEND_END, BACKEND_START, BACKEND_END, DEVOPS_START } = SKILL_SECTION_BOUNDARIES;

  // Frontend → Backend transition
  if (currentSection === FRONTEND_END && nextSection === BACKEND_START) return true;
  // Backend → DevOps transition
  if (currentSection === BACKEND_END && nextSection === DEVOPS_START) return true;
  // Reverse transitions
  if (currentSection === BACKEND_START && nextSection === FRONTEND_END) return true;
  if (currentSection === DEVOPS_START && nextSection === BACKEND_END) return true;

  return false;
}

// Determine which major section we're in
export type MajorSection = "skills" | "experience" | "portfolio" | "about" | "contact";

export function getMajorSection(section: number): MajorSection {
  const { SKILLS_END, TIMELINE, PORTFOLIO, ABOUT, CONTACT } = SKILL_SECTION_BOUNDARIES;

  if (section <= SKILLS_END) return "skills";
  if (section === TIMELINE) return "experience";
  if (section === PORTFOLIO) return "portfolio";
  if (section === ABOUT) return "about";
  if (section === CONTACT) return "contact";
  return "about";
}

// Get the skill group for a given section
export type SkillGroup = "overview" | "frontend" | "backend" | "devops" | "none";

export function getSkillGroup(section: number): SkillGroup {
  const { FRONTEND_START, FRONTEND_END, BACKEND_START, BACKEND_END, DEVOPS_START, DEVOPS_END } = SKILL_SECTION_BOUNDARIES;

  if (section === 1) return "overview";
  if (section >= FRONTEND_START && section <= FRONTEND_END) return "frontend";
  if (section >= BACKEND_START && section <= BACKEND_END) return "backend";
  if (section >= DEVOPS_START && section <= DEVOPS_END) return "devops";
  return "none";
}
