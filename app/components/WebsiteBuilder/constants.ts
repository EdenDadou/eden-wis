// Grid Layout Constants
export const GRID_X = 3.2;
export const GRID_Y = 2.5;

// Position Constants - Organized by Category
// FRONTEND GROUP (LEFT column, x = -GRID_X)
export const POS_FRONTEND = [-GRID_X, GRID_Y, 0] as [number, number, number];
export const POS_MOBILE = [-GRID_X, 0, 0] as [number, number, number];
export const POS_BACKOFFICE = [-GRID_X, -GRID_Y, 0] as [number, number, number];

// BACKEND GROUP (CENTER column, x = 0)
export const POS_SERVER = [0, GRID_Y * 0.5, 0] as [number, number, number];
export const POS_DATABASE = [0, -GRID_Y * 0.5, 0] as [number, number, number];

// DEVOPS GROUP (RIGHT column, x = GRID_X)
export const POS_CICD = [GRID_X, GRID_Y, 0] as [number, number, number];
export const POS_CLOUD = [GRID_X, 0, 0] as [number, number, number];
export const POS_ARCHI = [GRID_X, -GRID_Y, 0] as [number, number, number];

// Connection Points (for ParticleStream)
export const P_FRONT = [-GRID_X, GRID_Y, 0];
export const P_MOBILE = [-GRID_X, 0, 0];
export const P_BACK = [-GRID_X, -GRID_Y, 0];
export const P_SERVER = [0, GRID_Y * 0.5, 0];
export const P_DB = [0, -GRID_Y * 0.5, 0];
export const P_CICD = [GRID_X, GRID_Y, 0];
export const P_CLOUD = [GRID_X, 0, 0];
export const P_ARCHI = [GRID_X, -GRID_Y, 0];

// Skill Colors
export const C_FRONT = "#3b82f6"; // Blue (Frontend)
export const C_MOBILE = "#8b5cf6"; // Purple (Mobile)
export const C_BACK = "#ffaa00"; // Gold/Orange (Backoffice)
export const C_SERVER = "#10b981"; // Green (Node)
export const C_DB = "#ef4444"; // Red (Database)
export const C_CICD = "#ff6600"; // Orange (CI/CD)
export const C_CLOUD = "#1e3a5f"; // Dark Blue (Cloud)
export const C_ARCHI = "#06b6d4"; // Cyan (Architecture)

// Group Colors for category boxes
export const C_GROUP_FRONTEND = "#1e3a8a";
export const C_GROUP_BACKEND = "#065f46";
export const C_GROUP_DEVOPS = "#ff6600";

// Highlight/Glow Colors
export const C_HIGHLIGHT = "#ffffff";
export const C_GLOW_FRONTEND = "#2563eb";
export const C_GLOW_BACKEND = "#059669";
export const C_GLOW_DEVOPS = "#ff8c00";

// Element appearance thresholds (for scroll-based animations)
export const T_FRONT = 0.15;
export const T_MOBILE = 0.22;
export const T_BACK = 0.29;
export const T_SERVER = 0.4;
export const T_DB = 0.48;
export const T_CICD = 0.58;
export const T_CLOUD = 0.66;
export const T_ARCHI = 0.74;

// Animation Constants
export const FACE_CAMERA_ROTATION = -0.1;
export const DEZOOM_START = 0.93;
export const DEZOOM_END = 0.97;
export const BASE_X_OFFSET = 3;

// Section Mapping
export const SECTION_MAP = {
  FRONTEND: 3,
  MOBILE: 4,
  BACKOFFICE: 5,
  SERVER: 7,
  DATABASE: 8,
  CICD: 10,
  CLOUD: 11,
  ARCHITECTURE: 12,
} as const;
