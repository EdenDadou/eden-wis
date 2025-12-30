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

// Closer camera distance for skill detail views (lower = closer)
const SKILL_DETAIL_Z = 2.8;

// Model container offset in world space
const MODEL_OFFSET_X = -2;

// Skill local X positions (from WebsiteBuilder/constants.ts)
const FRONTEND_LOCAL_X = -GRID_X;           // -3.2
const BACKEND_LOCAL_X = -0.15;              // center
const DEVOPS_LOCAL_X = GRID_X - 0.3;        // 2.9

// Camera offset to shift view right (leave space for info card on left)
const CAM_RIGHT_OFFSET = 4.0;

// Camera X = model world position + right offset
const CAM_X_FRONTEND = MODEL_OFFSET_X + FRONTEND_LOCAL_X + CAM_RIGHT_OFFSET;  // -5.2 + 1 = -4.2
const CAM_X_BACKEND = MODEL_OFFSET_X + BACKEND_LOCAL_X + CAM_RIGHT_OFFSET;    // -2.15 + 1 = -1.15
const CAM_X_DEVOPS = MODEL_OFFSET_X + DEVOPS_LOCAL_X + CAM_RIGHT_OFFSET;      // 0.9 + 1 = 1.9

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

  // Skills Overview - 3D block centered-right on screen, card stays left
  1: {
    x: -1.5,
    y: 0.5,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: -1.5,
    lookY: 0.5,
    lookZ: ORBIT_RADIUS,
  },

  // ===== FRONTEND GROUP (sections 2-4) =====
  // Frontend (Site Web) - section 2
  2: {
    x: CAM_X_FRONTEND,
    y: GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_FRONTEND,
    lookY: GRID_Y,
    lookZ: ORBIT_RADIUS,
  },
  // Mobile - section 3
  3: {
    x: CAM_X_FRONTEND,
    y: 0,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_FRONTEND,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  // Backoffice - section 4
  4: {
    x: CAM_X_FRONTEND,
    y: -GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_FRONTEND,
    lookY: -GRID_Y,
    lookZ: ORBIT_RADIUS,
  },

  // ===== BACKEND GROUP (sections 5-6) =====
  // Server - section 5
  5: {
    x: CAM_X_BACKEND,
    y: 0,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_BACKEND,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  // Database - section 6
  6: {
    x: CAM_X_BACKEND,
    y: -GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_BACKEND,
    lookY: -GRID_Y,
    lookZ: ORBIT_RADIUS,
  },

  // ===== DEVOPS GROUP (sections 7-9) =====
  // CI/CD - section 7
  7: {
    x: CAM_X_DEVOPS,
    y: GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_DEVOPS,
    lookY: GRID_Y,
    lookZ: ORBIT_RADIUS,
  },
  // Cloud - section 8
  8: {
    x: CAM_X_DEVOPS,
    y: 0,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_DEVOPS,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  // Architecture - section 9
  9: {
    x: CAM_X_DEVOPS,
    y: -GRID_Y,
    z: ORBIT_RADIUS + SKILL_DETAIL_Z,
    lookX: CAM_X_DEVOPS,
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
