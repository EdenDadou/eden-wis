import type { Variants } from "framer-motion";

export const langTextVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const langItemVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" },
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
};

// Text position mapping based on section
// Section mapping (without transition slides):
// 0: Intro, 1: Overview, 2-4: Frontend, 5-6: Backend, 7-9: DevOps
// 10: Timeline, 11: Portfolio, 12: About
export const sectionTextPositions: Record<number, "left" | "right" | "center"> = {
  0: "center",  // Hero intro - centered
  1: "left",    // FullStack Overview - card LEFT, 3D RIGHT
  2: "left",    // Site Web (Frontend) - card LEFT, 3D RIGHT
  3: "left",    // Mobile - card LEFT, 3D RIGHT
  4: "left",    // Backoffice - card LEFT, 3D RIGHT
  5: "left",    // Server (Backend) - card LEFT, 3D RIGHT
  6: "left",    // Database - card LEFT, 3D RIGHT
  7: "left",    // CI/CD (DevOps) - card LEFT, 3D RIGHT
  8: "left",    // Cloud - card LEFT, 3D RIGHT
  9: "left",    // Architecture - card LEFT, 3D RIGHT
};

export const getTextPosition = (section: number): "left" | "right" | "center" => {
  return sectionTextPositions[section] ?? "left";
};

export const getPositionClass = (position: "left" | "right" | "center"): string => {
  switch (position) {
    case "left":
      return "justify-start pl-12 md:pl-20";
    case "right":
      return "justify-end pr-12 md:pr-20";
    case "center":
      return "justify-center";
  }
};
