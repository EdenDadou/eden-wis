import {
  SECTION_CAMERA_POSITIONS,
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

// Calculate camera position for a given section
export function getCameraPositionForSection(section: number) {
  return SECTION_CAMERA_POSITIONS[section] ?? SECTION_CAMERA_POSITIONS[0];
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
