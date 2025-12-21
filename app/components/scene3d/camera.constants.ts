// Grid constants for camera positioning
export const GRID_X = 3.2;
export const GRID_Y = 2.5;

// Circular layout constants
// 4 main sections arranged at 90° intervals around Y axis
export const ORBIT_RADIUS = 20; // Distance from center to each section
export const CAMERA_DISTANCE = 8; // Distance camera sits from the content

// Section angles (in radians) - 4 sections at 90° apart
export const SECTION_ANGLES = {
  skills: 0, // Front (0°)
  experience: Math.PI / 2, // 90°
  portfolio: Math.PI, // 180°
  about: (Math.PI * 3) / 2, // 270°
} as const;

// Camera X offset to center view between card and 3D elements
const CAM_X_OFFSET = -0.5;

// Camera positions for each section
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

  // Skills sections - camera.x === lookX for perfectly frontal view
  1: {
    x: CAM_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: CAM_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  2: {
    x: -GRID_X + CAM_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: -GRID_X + CAM_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  3: {
    x: -GRID_X + CAM_X_OFFSET,
    y: GRID_Y,
    z: ORBIT_RADIUS + 4,
    lookX: -GRID_X + CAM_X_OFFSET,
    lookY: GRID_Y,
    lookZ: ORBIT_RADIUS,
  },
  4: {
    x: -GRID_X + CAM_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + 4,
    lookX: -GRID_X + CAM_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  5: {
    x: -GRID_X + CAM_X_OFFSET,
    y: -GRID_Y,
    z: ORBIT_RADIUS + 4,
    lookX: -GRID_X + CAM_X_OFFSET,
    lookY: -GRID_Y,
    lookZ: ORBIT_RADIUS,
  },
  6: {
    x: CAM_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: CAM_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  7: {
    x: CAM_X_OFFSET,
    y: GRID_Y * 0.5,
    z: ORBIT_RADIUS + 4,
    lookX: CAM_X_OFFSET,
    lookY: GRID_Y * 0.5,
    lookZ: ORBIT_RADIUS,
  },
  8: {
    x: CAM_X_OFFSET,
    y: -GRID_Y * 0.5,
    z: ORBIT_RADIUS + 4,
    lookX: CAM_X_OFFSET,
    lookY: -GRID_Y * 0.5,
    lookZ: ORBIT_RADIUS,
  },
  9: {
    x: GRID_X + CAM_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: GRID_X + CAM_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  10: {
    x: GRID_X + CAM_X_OFFSET,
    y: GRID_Y,
    z: ORBIT_RADIUS + 4,
    lookX: GRID_X + CAM_X_OFFSET,
    lookY: GRID_Y,
    lookZ: ORBIT_RADIUS,
  },
  11: {
    x: GRID_X + CAM_X_OFFSET,
    y: 0,
    z: ORBIT_RADIUS + 4,
    lookX: GRID_X + CAM_X_OFFSET,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
  12: {
    x: GRID_X + CAM_X_OFFSET,
    y: -GRID_Y,
    z: ORBIT_RADIUS + 4,
    lookX: GRID_X + CAM_X_OFFSET,
    lookY: -GRID_Y,
    lookZ: ORBIT_RADIUS,
  },

  // Experience section
  13: {
    x: 0,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: 0,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },

  // Portfolio section
  14: {
    x: 0,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: 0,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },

  // About section
  15: {
    x: 0,
    y: 0,
    z: ORBIT_RADIUS + CAMERA_DISTANCE,
    lookX: 0,
    lookY: 0,
    lookZ: ORBIT_RADIUS,
  },
};

// Scroll offset snap points for each section
export const SECTION_SNAP_OFFSETS: number[] = [
  0.0, // 0: Intro
  0.04, // 1: FullStack Overview
  0.1, // 2: Frontend Slide
  0.14, // 3: Site Web
  0.18, // 4: Mobile
  0.22, // 5: Backoffice
  0.26, // 6: Backend Slide
  0.3, // 7: Server
  0.34, // 8: Database
  0.38, // 9: DevOps Slide
  0.42, // 10: CI/CD
  0.46, // 11: Cloud
  0.5, // 12: Architecture
  0.58, // 13: Timeline
  0.72, // 14: Portfolio
  0.88, // 15: About
];

// Sections that are group overview slides (require zoom-out transition)
export const GROUP_TRANSITION_SECTIONS = new Set([2, 6, 9, 13]);
