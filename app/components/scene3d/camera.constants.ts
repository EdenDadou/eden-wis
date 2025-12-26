// Grid constants for camera positioning
export const GRID_X = 3.2;
export const GRID_Y = 2.5;

// Circular layout constants
export const ORBIT_RADIUS = 20;
export const CAMERA_DISTANCE = 8;

// Section angles (in radians) - 5 sections at 72° apart
export const SECTION_ANGLES = {
  skills: 0,
  experience: (Math.PI * 2) / 5,        // 72°
  portfolio: (Math.PI * 4) / 5,          // 144°
  about: (Math.PI * 6) / 5,              // 216°
  contact: (Math.PI * 8) / 5,            // 288°
} as const;

// Camera X offset to center view between card and 3D elements
const CAM_X_OFFSET = -0.5;

// Skills container X offset (from WebsiteBuilder)
const SKILLS_X_OFFSET = 3;

// Closer camera distance for skill detail views
const SKILL_DETAIL_Z = 4;

// Camera positions for each section
// 0: Intro, 1: Overview, 2-4: Frontend details, 5-6: Backend details, 7-9: DevOps details
// 10: Timeline, 11: Portfolio, 12: About, 13: Contact
export const SECTION_CAMERA_POSITIONS: Record<
  number,
  {
    x: number;
    y: number;
    z: number;
    lookX: number;
    lookY: number;
    lookZ: number;
  }
> = {
  // Intro - far back view
  0: { x: 0, y: 0, z: ORBIT_RADIUS + 12, lookX: 0, lookY: 0, lookZ: 0 },

  // Skills Overview - wide view of all skills
  1: {
    x: CAM_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: CAM_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },

  // ===== FRONTEND GROUP (sections 2-4) =====
  // Frontend (Site Web) - section 2
  2: {
    x: -GRID_X + SKILLS_X_OFFSET,
    y: GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: -GRID_X + SKILLS_X_OFFSET,
    lookY: GRID_Y,
    lookZ: ORBIT_RADIUS,
  },
  // Mobile - section 3
  3: {
    x: -GRID_X + SKILLS_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: -GRID_X + SKILLS_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  // Backoffice - section 4
  4: {
    x: -GRID_X + SKILLS_X_OFFSET,
    y: -GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: -GRID_X + SKILLS_X_OFFSET,
    lookY: -GRID_Y,
    lookZ: ORBIT_RADIUS,
  },

  // ===== BACKEND GROUP (sections 5-6) =====
  // Server - section 5
  5: {
    x: SKILLS_X_OFFSET,
    y: GRID_Y * 0.5,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: SKILLS_X_OFFSET,
    lookY: GRID_Y * 0.5,
    lookZ: ORBIT_RADIUS,
  },
  // Database - section 6
  6: {
    x: SKILLS_X_OFFSET,
    y: -GRID_Y * 0.5,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: SKILLS_X_OFFSET,
    lookY: -GRID_Y * 0.5,
    lookZ: ORBIT_RADIUS,
  },

  // ===== DEVOPS GROUP (sections 7-9) =====
  // CI/CD - section 7
  7: {
    x: GRID_X + SKILLS_X_OFFSET,
    y: GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: GRID_X + SKILLS_X_OFFSET,
    lookY: GRID_Y,
    lookZ: ORBIT_RADIUS,
  },
  // Cloud - section 8
  8: {
    x: GRID_X + SKILLS_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: GRID_X + SKILLS_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  // Architecture - section 9
  9: {
    x: GRID_X + SKILLS_X_OFFSET,
    y: -GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: GRID_X + SKILLS_X_OFFSET,
    lookY: -GRID_Y,
    lookZ: ORBIT_RADIUS,
  },

  // ===== OTHER SECTIONS =====
  // Experience/Timeline section - 10
  10: {
    x: 0,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: 0,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },

  // Portfolio section - 11
  11: {
    x: 0,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: 0,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },

  // About section - 12
  12: {
    x: 0,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: 0,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },

  // Contact section - 13
  13: {
    x: 0,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: 0,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
};

// Section boundaries for navigation
export const SKILL_SECTION_BOUNDARIES = {
  FRONTEND_START: 2,
  FRONTEND_END: 4,
  BACKEND_START: 5,
  BACKEND_END: 6,
  DEVOPS_START: 7,
  DEVOPS_END: 9,
  SKILLS_END: 9,
  TIMELINE: 10,
  PORTFOLIO: 11,
  ABOUT: 12,
  CONTACT: 13,
} as const;
