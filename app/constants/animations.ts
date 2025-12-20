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
// NEW LAYOUT: Section 1 (FullStack) has 3D on RIGHT, so card on LEFT
// Frontend elements (sections 2-5): 3D on LEFT column, card on RIGHT
// Backend elements (sections 6-8): 3D CENTER, card position varies
// DevOps elements (sections 9-12): 3D on RIGHT column, card on LEFT
export const sectionTextPositions: Record<number, "left" | "right" | "center"> = {
  0: "center",  // Hero intro - centered
  1: "left",    // FullStack Overview - 3D tableau on RIGHT, card on LEFT
  2: "right",   // Frontend Slide - 3D on LEFT, card on RIGHT
  3: "right",   // Site Web - 3D on LEFT, card on RIGHT
  4: "right",   // Mobile - 3D on LEFT, card on RIGHT
  5: "right",   // Backoffice - 3D on LEFT, card on RIGHT
  6: "left",    // Backend Slide - 3D CENTER, card on LEFT (or right)
  7: "left",    // Server - 3D CENTER, card on LEFT
  8: "left",    // Database - 3D CENTER, card on LEFT
  9: "left",    // DevOps Slide - 3D on RIGHT, card on LEFT
  10: "left",   // CI/CD - 3D on RIGHT, card on LEFT
  11: "left",   // Cloud - 3D on RIGHT, card on LEFT
  12: "left",   // Architecture - 3D on RIGHT, card on LEFT
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
