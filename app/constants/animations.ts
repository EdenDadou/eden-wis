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
// Position text on opposite side of 3D element for visibility
export const sectionTextPositions: Record<number, "left" | "right" | "center"> = {
  0: "center",  // Hero intro - centered
  1: "left",    // FullStack Overview - card left
  2: "left",    // Frontend Slide - card left (3D on right)
  3: "left",    // Site Web - card left (3D on right)
  4: "right",   // Mobile - card right (3D center)
  5: "left",    // Backoffice - card left (3D on right)
  6: "right",   // Backend Slide - card right (3D center)
  7: "right",   // Server - card right (3D center)
  8: "right",   // Database - card right (3D center-top)
  9: "right",   // DevOps Slide - card right (3D on left)
  10: "right",  // CI/CD - card right (3D on left)
  11: "right",  // Cloud - card right (3D on left)
  12: "left",   // Architecture - card left (3D on right)
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
