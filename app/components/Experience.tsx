import {
  ScrollControls,
  useScroll,
  Float,
  Environment,
  GradientTexture,
  Sphere,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useCallback } from "react";
import * as THREE from "three";
import { easing } from "maath";
import WebsiteBuilder from "./WebsiteBuilder";
import Timeline3D, {
  type Experience as ExperienceType,
  experienceData,
} from "./Timeline3D";
import ExperienceDetail3D from "./ExperienceDetail3D";
import Portfolio3D from "./Portfolio3D";
import About3D from "./About3D";
import "../styles/global.css";

interface CameraRigProps {
  selectedExperience: ExperienceType | null;
  targetSection?: number | null;
  onNavigationComplete?: () => void;
  snapOffset: number | null;
  onRequestSnap: (offset: number) => void;
}

// Grid constants for camera positioning
const GRID_X = 3.2;
const GRID_Y = 2.5;

// Circular layout constants
// 4 main sections arranged at 90° intervals around Y axis
const ORBIT_RADIUS = 20; // Distance from center to each section (larger circle)
const CAMERA_DISTANCE = 8; // Distance camera sits from the content

// Section angles (in radians) - 4 sections at 90° apart
const SECTION_ANGLES = {
  skills: 0, // Front (0°)
  experience: Math.PI / 2, // 90°
  portfolio: Math.PI, // 180°
  about: (Math.PI * 3) / 2, // 270°
};

// Camera positions for each section
// Camera stays on Z axis, world rotates to bring content to front
// All positions are relative to content at z = ORBIT_RADIUS (after world rotation)
// Skills 3D elements are offset +3 on X axis to appear on the right
const SKILLS_X_OFFSET = 3;
const SECTION_CAMERA_POSITIONS: Record<number, { x: number; y: number; z: number; lookX: number; lookY: number; lookZ: number }> = {
  // Intro - far back view
  0: { x: 0, y: 0, z: ORBIT_RADIUS + 12, lookX: 0, lookY: 0, lookZ: 0 },

  // Skills sections - camera in front, looking at skills (which are at z = ORBIT_RADIUS, x offset +3)
  1: { x: SKILLS_X_OFFSET, y: 0, z: ORBIT_RADIUS + CAMERA_DISTANCE, lookX: SKILLS_X_OFFSET, lookY: 0, lookZ: ORBIT_RADIUS }, // FullStack Overview
  2: { x: -GRID_X + SKILLS_X_OFFSET, y: 0, z: ORBIT_RADIUS + CAMERA_DISTANCE, lookX: -GRID_X + SKILLS_X_OFFSET, lookY: 0, lookZ: ORBIT_RADIUS }, // Frontend Group
  3: { x: -GRID_X + SKILLS_X_OFFSET, y: GRID_Y, z: ORBIT_RADIUS + 4, lookX: -GRID_X + SKILLS_X_OFFSET, lookY: GRID_Y, lookZ: ORBIT_RADIUS }, // Site Web
  4: { x: -GRID_X + SKILLS_X_OFFSET, y: 0, z: ORBIT_RADIUS + 4, lookX: -GRID_X + SKILLS_X_OFFSET, lookY: 0, lookZ: ORBIT_RADIUS }, // Mobile
  5: { x: -GRID_X + SKILLS_X_OFFSET, y: -GRID_Y, z: ORBIT_RADIUS + 4, lookX: -GRID_X + SKILLS_X_OFFSET, lookY: -GRID_Y, lookZ: ORBIT_RADIUS }, // Backoffice
  6: { x: SKILLS_X_OFFSET, y: GRID_Y * 0.5, z: ORBIT_RADIUS + CAMERA_DISTANCE, lookX: SKILLS_X_OFFSET, lookY: GRID_Y * 0.5, lookZ: ORBIT_RADIUS }, // Backend Group
  7: { x: SKILLS_X_OFFSET, y: GRID_Y, z: ORBIT_RADIUS + 4, lookX: SKILLS_X_OFFSET, lookY: GRID_Y, lookZ: ORBIT_RADIUS }, // Server
  8: { x: SKILLS_X_OFFSET, y: 0, z: ORBIT_RADIUS + 4, lookX: SKILLS_X_OFFSET, lookY: 0, lookZ: ORBIT_RADIUS }, // Database
  9: { x: GRID_X + SKILLS_X_OFFSET, y: 0, z: ORBIT_RADIUS + CAMERA_DISTANCE, lookX: GRID_X + SKILLS_X_OFFSET, lookY: 0, lookZ: ORBIT_RADIUS }, // DevOps Group
  10: { x: GRID_X + SKILLS_X_OFFSET, y: GRID_Y, z: ORBIT_RADIUS + 4, lookX: GRID_X + SKILLS_X_OFFSET, lookY: GRID_Y, lookZ: ORBIT_RADIUS }, // CI/CD
  11: { x: GRID_X + SKILLS_X_OFFSET, y: 0, z: ORBIT_RADIUS + 4, lookX: GRID_X + SKILLS_X_OFFSET, lookY: 0, lookZ: ORBIT_RADIUS }, // Cloud
  12: { x: GRID_X + SKILLS_X_OFFSET, y: -GRID_Y, z: ORBIT_RADIUS + 4, lookX: GRID_X + SKILLS_X_OFFSET, lookY: -GRID_Y, lookZ: ORBIT_RADIUS }, // Architecture

  // Experience section
  13: { x: 0, y: 0, z: ORBIT_RADIUS + CAMERA_DISTANCE, lookX: 0, lookY: 0, lookZ: ORBIT_RADIUS },

  // Portfolio section - camera stays in front, world rotates to bring portfolio to front
  14: { x: 0, y: 0, z: ORBIT_RADIUS + CAMERA_DISTANCE, lookX: 0, lookY: 0, lookZ: ORBIT_RADIUS },

  // About section - camera stays in front, world rotates to bring about to front
  15: { x: 0, y: 0, z: ORBIT_RADIUS + CAMERA_DISTANCE, lookX: 0, lookY: 0, lookZ: ORBIT_RADIUS },
};

// Scroll offset snap points for each section
const SECTION_SNAP_OFFSETS: number[] = [
  0.0,    // 0: Intro
  0.04,   // 1: FullStack Overview
  0.10,   // 2: Frontend Slide
  0.14,   // 3: Site Web
  0.18,   // 4: Mobile
  0.22,   // 5: Backoffice
  0.26,   // 6: Backend Slide
  0.30,   // 7: Server
  0.34,   // 8: Database
  0.38,   // 9: DevOps Slide
  0.42,   // 10: CI/CD
  0.46,   // 11: Cloud
  0.50,   // 12: Architecture
  0.58,   // 13: Timeline
  0.72,   // 14: Portfolio
  0.88,   // 15: About
];

// Smoother easing for section transitions - quintic curve
function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

// Very smooth easing for major transitions - custom bezier-like curve
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// Map section number to scroll offset
function getSectionOffset(section: number): number {
  return SECTION_SNAP_OFFSETS[section] ?? 0;
}

// Get section from offset
function getSectionFromOffset(offset: number): number {
  for (let i = SECTION_SNAP_OFFSETS.length - 1; i >= 0; i--) {
    if (offset >= SECTION_SNAP_OFFSETS[i] - 0.02) {
      return i;
    }
  }
  return 0;
}

// Calculate camera position for a given section
function getCameraPositionForSection(section: number) {
  return SECTION_CAMERA_POSITIONS[section] ?? SECTION_CAMERA_POSITIONS[0];
}

// Sections that are group overview slides (require zoom-out transition)
const GROUP_TRANSITION_SECTIONS = new Set([2, 6, 9, 13]); // Frontend, Backend, DevOps, Timeline

// Get camera position with smooth interpolation between sections
// Camera stays on Z axis, pulls back during major transitions while world rotates
function getInterpolatedCameraPosition(offset: number) {
  const section = getSectionFromOffset(offset);
  const nextSection = Math.min(section + 1, SECTION_SNAP_OFFSETS.length - 1);

  const currentOffset = SECTION_SNAP_OFFSETS[section];
  const nextOffset = SECTION_SNAP_OFFSETS[nextSection];

  // Calculate progress between current and next section
  const range = nextOffset - currentOffset;
  const progress = range > 0 ? Math.max(0, Math.min(1, (offset - currentOffset) / range)) : 0;

  const currentPos = SECTION_CAMERA_POSITIONS[section];
  const nextPos = SECTION_CAMERA_POSITIONS[nextSection];

  if (!currentPos || !nextPos) {
    return { ...SECTION_CAMERA_POSITIONS[0], lookZ: 0 };
  }

  // Use quintic easing for smoother, more professional motion
  const t = easeInOutQuint(progress);

  // Check if this is a group transition (needs zoom-out effect)
  const isGroupTransition = GROUP_TRANSITION_SECTIONS.has(nextSection);

  // For transitions between major sections (skills->experience, experience->portfolio, etc.)
  // Camera pulls back smoothly while world rotates
  const isMajorTransition =
    (section <= 12 && nextSection === 13) ||
    (section === 13 && nextSection === 14) ||
    (section === 14 && nextSection === 15) ||
    (section === 13 && section > nextSection) ||
    (section === 14 && section > nextSection) ||
    (section === 15 && section > nextSection);

  // Calculate zoom-out curve for transitions with ultra-smooth bell curve
  let zoomOffset = 0;
  if ((isGroupTransition || isMajorTransition) && progress > 0) {
    // Use smoothstep for silky smooth acceleration and deceleration
    // smoothstep: 3t² - 2t³ gives S-curve with zero velocity at start/end
    const smoothstep = progress * progress * (3 - 2 * progress);
    // Apply sine for bell shape, then smooth the result
    const bellBase = Math.sin(smoothstep * Math.PI);
    // Extra smoothing with power curve for gentler attack/release
    const zoomCurve = Math.pow(bellBase, 0.8);
    zoomOffset = zoomCurve * (isMajorTransition ? 12 : 4);
  }

  // Special zoom-in effect for Experience section (13)
  // Camera zooms in closer as user scrolls through the section
  let experienceZoomIn = 0;
  if (section === 13) {
    // Zoom in progressively - get closer to the content
    // Start at current distance and zoom in by 4 units as we progress
    experienceZoomIn = -4 * easeOutExpo(progress);
  }

  return {
    x: THREE.MathUtils.lerp(currentPos.x, nextPos.x, t),
    y: THREE.MathUtils.lerp(currentPos.y, nextPos.y, t),
    z: THREE.MathUtils.lerp(currentPos.z, nextPos.z, t) + zoomOffset + experienceZoomIn,
    lookX: THREE.MathUtils.lerp(currentPos.lookX, nextPos.lookX, t),
    lookY: THREE.MathUtils.lerp(currentPos.lookY, nextPos.lookY, t),
    lookZ: THREE.MathUtils.lerp(currentPos.lookZ ?? 0, nextPos.lookZ ?? 0, t),
  };
}

function CameraRig({
  selectedExperience,
  targetSection,
  onNavigationComplete,
  snapOffset,
  onRequestSnap,
}: CameraRigProps) {
  const scroll = useScroll();
  const isInDetailView = selectedExperience !== null;
  const lastTargetSection = useRef<number | null>(null);
  const forcedOffset = useRef<number | null>(null);
  const forceFramesRemaining = useRef(0);
  const navigationCompleted = useRef(true);

  // Natural scroll snap - velocity-based detection
  const scrollHistory = useRef<number[]>([]);
  const isSnapping = useRef(false);
  const snapTarget = useRef<number | null>(null);

  // Animation state for menu navigation
  const navAnimationProgress = useRef(0);
  const navAnimationActive = useRef(false);
  const navStartPos = useRef(new THREE.Vector3());
  const navTargetPos = useRef(new THREE.Vector3());
  const navTargetLookAt = useRef(new THREE.Vector3());
  const navStartLookAt = useRef(new THREE.Vector3());
  const navAnimationDuration = useRef(1.2);

  useFrame((state, delta) => {
    const currentOffset = scroll.offset;

    // Track scroll velocity for natural snap detection
    scrollHistory.current.push(currentOffset);
    if (scrollHistory.current.length > 10) {
      scrollHistory.current.shift();
    }

    // Calculate scroll velocity
    const velocity = scrollHistory.current.length > 1
      ? Math.abs(scrollHistory.current[scrollHistory.current.length - 1] - scrollHistory.current[0]) / scrollHistory.current.length
      : 0;

    // Natural snap: only trigger when scroll velocity is very low (user stopped scrolling)
    const currentSec = getSectionFromOffset(currentOffset);
    const isInSkillsSection = currentSec >= 1 && currentSec <= 12;

    if (isInSkillsSection && !navAnimationActive.current && forcedOffset.current === null) {
      // User has nearly stopped scrolling
      if (velocity < 0.0003 && !isSnapping.current) {
        const targetSnapOffset = SECTION_SNAP_OFFSETS[currentSec];
        const distanceToSnap = Math.abs(currentOffset - targetSnapOffset);

        // Only snap if we're not already at the snap point
        if (distanceToSnap > 0.008) {
          isSnapping.current = true;
          snapTarget.current = targetSnapOffset;
          onRequestSnap(targetSnapOffset);
        }
      }
    }

    // Smooth snap animation - uses exponential easing for silky motion
    if (snapOffset !== null && scroll.el && !navAnimationActive.current && forcedOffset.current === null) {
      const targetScrollTop = snapOffset * (scroll.el.scrollHeight - scroll.el.clientHeight);
      const currentScrollTop = scroll.el.scrollTop;
      const diff = targetScrollTop - currentScrollTop;

      // Exponential decay for ultra-smooth snap with adaptive speed
      const distance = Math.abs(diff);
      const baseSpeed = 0.06;
      const adaptiveSpeed = baseSpeed + Math.min(0.08, distance * 0.00008);
      const decay = 1 - Math.exp(-adaptiveSpeed * 60); // Frame-rate independent

      if (distance > 0.5) {
        scroll.el.scrollTop = currentScrollTop + diff * decay;
      } else {
        // Snap complete
        scroll.el.scrollTop = targetScrollTop;
        isSnapping.current = false;
        snapTarget.current = null;
      }
    } else {
      isSnapping.current = false;
    }

    // Handle direct navigation from menu
    if (
      targetSection !== null &&
      targetSection !== undefined &&
      targetSection !== lastTargetSection.current
    ) {
      lastTargetSection.current = targetSection;
      const targetOffset = getSectionOffset(targetSection);

      forcedOffset.current = targetOffset;
      forceFramesRemaining.current = 90; // Reduced for snappier feel
      navigationCompleted.current = false;

      const pos = getCameraPositionForSection(targetSection);

      navStartPos.current.copy(state.camera.position);
      navTargetPos.current.set(pos.x, pos.y, pos.z);
      navTargetLookAt.current.set(pos.lookX, pos.lookY, pos.lookZ ?? 0);
      // Get current lookAt from camera direction
      const currentLookAt = new THREE.Vector3();
      state.camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(state.camera.position);
      navStartLookAt.current.copy(currentLookAt);

      const distance = navStartPos.current.distanceTo(navTargetPos.current);
      // Smoother, slightly longer animations for better visual quality
      const isSkillNavigation = targetSection >= 1 && targetSection <= 12;
      const baseDuration = isSkillNavigation ? 0.7 : 1.0;
      const maxDuration = isSkillNavigation ? 1.0 : 1.8;
      navAnimationDuration.current = Math.min(maxDuration, Math.max(baseDuration, baseDuration + distance * 0.025));

      navAnimationProgress.current = 0;
      navAnimationActive.current = true;
    }

    // Keep forcing scroll position while forcedOffset is active (menu navigation)
    if (forcedOffset.current !== null && scroll.el) {
      scroll.el.scrollTop =
        forcedOffset.current *
        (scroll.el.scrollHeight - scroll.el.clientHeight);

      forceFramesRemaining.current--;

      // Release when frames run out AND scroll has caught up AND animation is done
      const diff = Math.abs(scroll.offset - forcedOffset.current);
      if (
        forceFramesRemaining.current <= 0 &&
        diff < 0.01 &&
        !navAnimationActive.current
      ) {
        forcedOffset.current = null;
        // Only call onNavigationComplete when scroll is truly stable
        if (!navigationCompleted.current && onNavigationComplete) {
          navigationCompleted.current = true;
          onNavigationComplete();
        }
      }
    }

    // Animate camera during navigation - skip all other camera logic while animating
    if (navAnimationActive.current) {
      navAnimationProgress.current += delta / navAnimationDuration.current;

      if (navAnimationProgress.current >= 1) {
        navAnimationProgress.current = 1;
        navAnimationActive.current = false;
      }

      const t = navAnimationProgress.current;

      // Use exponential easing for smooth deceleration into position
      // Combined with quintic for initial acceleration
      const easeCustom = t < 0.3
        ? easeInOutQuint(t / 0.3) * 0.4  // Smooth start (40% of motion in first 30%)
        : 0.4 + easeOutExpo((t - 0.3) / 0.7) * 0.6;  // Smooth exponential finish

      // Calculate distance for adaptive zoom
      const distance = navStartPos.current.distanceTo(navTargetPos.current);
      // More zoom for longer distances, less for short ones
      const zoomOutAmount = Math.min(6, Math.max(2, distance * 0.25));

      // Ultra-smooth bell curve using smootherstep (Ken Perlin's improved version)
      // 6t⁵ - 15t⁴ + 10t³ gives even smoother S-curve
      const smootherstep = t * t * t * (t * (t * 6 - 15) + 10);
      const bellBase = Math.sin(smootherstep * Math.PI);
      const zoomCurve = Math.pow(bellBase, 0.7);

      const x = THREE.MathUtils.lerp(
        navStartPos.current.x,
        navTargetPos.current.x,
        easeCustom
      );
      const y = THREE.MathUtils.lerp(
        navStartPos.current.y,
        navTargetPos.current.y,
        easeCustom
      );
      const baseZ = THREE.MathUtils.lerp(
        navStartPos.current.z,
        navTargetPos.current.z,
        easeCustom
      );
      const z = baseZ + zoomCurve * zoomOutAmount;

      // Smooth lookAt interpolation
      const lookAtX = THREE.MathUtils.lerp(
        navStartLookAt.current.x,
        navTargetLookAt.current.x,
        easeCustom
      );
      const lookAtY = THREE.MathUtils.lerp(
        navStartLookAt.current.y,
        navTargetLookAt.current.y,
        easeCustom
      );
      const lookAtZ = THREE.MathUtils.lerp(
        navStartLookAt.current.z,
        navTargetLookAt.current.z,
        easeCustom
      );

      state.camera.position.set(x, y, z);
      state.camera.lookAt(lookAtX, lookAtY, lookAtZ);
      return; // Skip normal camera logic during animation
    }

    // Reset when targetSection becomes null
    if (targetSection === null && lastTargetSection.current !== null) {
      lastTargetSection.current = null;
    }

    // Use forced offset during navigation, otherwise use scroll offset
    const offset = forcedOffset.current !== null ? forcedOffset.current : scroll.offset;

    // Get interpolated camera position based on scroll
    const camPos = getInterpolatedCameraPosition(offset);
    let { x, y, z, lookX, lookY, lookZ } = camPos;

    // Override camera position when in detail view (experience selected)
    // Camera stays in front, world is already rotated to show experience
    if (isInDetailView) {
      x = 0;
      y = 0;
      z = ORBIT_RADIUS + 7;
      lookX = 0;
      lookY = 0;
      lookZ = ORBIT_RADIUS;
    }

    // Add subtle drift for life (only when idle and not snapping)
    if (!isInDetailView && forcedOffset.current === null && !isSnapping.current) {
      const time = state.clock.getElapsedTime();
      x += Math.sin(time * 0.15) * 0.03;
      y += Math.cos(time * 0.2) * 0.03;
    }

    const targetPos = new THREE.Vector3(x, y, z);
    const lookAt = new THREE.Vector3(lookX, lookY, lookZ);

    // Smooth camera movement - use lower damping for silkier motion
    const dampFactor = isSnapping.current ? 0.06 : 0.08;

    if (forcedOffset.current !== null) {
      // During menu navigation, move camera smoothly
      easing.damp3(state.camera.position, targetPos, 0.05, delta);
    } else {
      easing.damp3(state.camera.position, targetPos, dampFactor, delta);
    }

    state.camera.lookAt(lookAt);
  });

  return null;
}

// Animated Stars Background
function AnimatedStars() {
  const starsRef = useRef<THREE.Points>(null);
  const bigStarsRef = useRef<THREE.Points>(null);

  // Generate random star positions
  const [positions, bigPositions] = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    const bigPos = new Float32Array(50 * 3);

    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 15;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }

    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 25 + Math.random() * 10;
      bigPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bigPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bigPos[i * 3 + 2] = r * Math.cos(phi);
    }

    return [pos, bigPos];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
      starsRef.current.rotation.x = Math.sin(time * 0.005) * 0.1;
    }
    if (bigStarsRef.current) {
      bigStarsRef.current.rotation.y = -time * 0.008;
      bigStarsRef.current.rotation.z = Math.cos(time * 0.003) * 0.05;
    }
  });

  return (
    <>
      {/* Small twinkling stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Bigger brighter stars */}
      <points ref={bigStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bigPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#06b6d4"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </>
  );
}

// Realistic Shooting Star - simple bright streak like in real night sky
function ShootingStar({ delay }: { delay: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const startTime = useRef(delay);

  // Randomized timing for natural feel
  const duration = useMemo(() => 0.3 + Math.random() * 0.4, []); // 0.3-0.7s - fast like real meteors
  const pauseDuration = useMemo(() => 8 + Math.random() * 25, []); // 8-33s between appearances

  // Trail length in world units
  const trailLength = useMemo(() => 3 + Math.random() * 4, []); // Variable trail length

  const trajectory = useMemo(() => {
    // Random angle - mostly diagonal downward (real meteors come from various angles)
    const angle = Math.random() * Math.PI * 0.4 + Math.PI * 0.1; // 18-90 degrees

    // Random starting position - spread across the sky
    const startX = -25 + Math.random() * 50;
    const startY = 15 + Math.random() * 15;
    const startZ = -15 - Math.random() * 10;

    // Travel distance
    const distance = 15 + Math.random() * 20;

    const direction = new THREE.Vector3(
      Math.cos(angle),
      -Math.sin(angle),
      0.05 + Math.random() * 0.1
    ).normalize();

    return {
      start: new THREE.Vector3(startX, startY, startZ),
      direction,
      distance,
    };
  }, []);

  // Create geometry for the line trail
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 points x 3 coords
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!lineRef.current) return;

    const time = state.clock.elapsedTime;
    const cycleTime = (time - startTime.current) % (duration + pauseDuration);

    if (cycleTime < duration) {
      const t = cycleTime / duration;

      // Current head position along trajectory
      const progress = t * trajectory.distance;
      const headPos = trajectory.start
        .clone()
        .addScaledVector(trajectory.direction, progress);

      // Trail end position (behind the head)
      // Trail fades in at start, full length in middle, fades out at end
      let currentTrailLength = trailLength;
      if (t < 0.2) {
        currentTrailLength = trailLength * (t / 0.2); // Grow trail at start
      } else if (t > 0.7) {
        currentTrailLength = trailLength * (1 - (t - 0.7) / 0.3); // Shrink trail at end
      }

      const tailPos = headPos
        .clone()
        .addScaledVector(trajectory.direction, -currentTrailLength);

      // Update line geometry
      const positions = lineRef.current.geometry.attributes.position
        .array as Float32Array;
      positions[0] = tailPos.x;
      positions[1] = tailPos.y;
      positions[2] = tailPos.z;
      positions[3] = headPos.x;
      positions[4] = headPos.y;
      positions[5] = headPos.z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;

      // Opacity: fade in quickly, hold, fade out
      let opacity = 1;
      if (t < 0.1) opacity = t * 10;
      else if (t > 0.6) opacity = 1 - (t - 0.6) / 0.4;

      (lineRef.current.material as THREE.LineBasicMaterial).opacity =
        opacity * 0.9;
      lineRef.current.visible = true;
    } else {
      lineRef.current.visible = false;
    }
  });

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: "#ffffff",
            transparent: true,
            opacity: 0.9,
          })
        )
      }
      ref={lineRef}
    />
  );
}

// Brighter shooting star variant with subtle glow
function ShootingStarBright({ delay }: { delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(delay);

  const duration = useMemo(() => 0.25 + Math.random() * 0.35, []);
  const pauseDuration = useMemo(() => 12 + Math.random() * 30, []);
  const trailLength = useMemo(() => 4 + Math.random() * 5, []);

  const trajectory = useMemo(() => {
    const angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.05;
    const startX = -30 + Math.random() * 60;
    const startY = 18 + Math.random() * 12;
    const startZ = -12 - Math.random() * 8;
    const distance = 18 + Math.random() * 25;

    const direction = new THREE.Vector3(
      Math.cos(angle),
      -Math.sin(angle),
      0.08
    ).normalize();

    return {
      start: new THREE.Vector3(startX, startY, startZ),
      direction,
      distance,
    };
  }, []);

  // Create trail points for a gradient effect
  const trailPointsCount = 12;
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const cycleTime = (time - startTime.current) % (duration + pauseDuration);

    if (cycleTime < duration) {
      groupRef.current.visible = true;
      const t = cycleTime / duration;
      const progress = t * trajectory.distance;
      const headPos = trajectory.start
        .clone()
        .addScaledVector(trajectory.direction, progress);

      // Update each trail point
      for (let i = 0; i < trailPointsCount; i++) {
        const mesh = trailRefs.current[i];
        if (!mesh) continue;

        const trailT = i / (trailPointsCount - 1); // 0 = head, 1 = tail
        let effectiveTrailLength = trailLength;

        // Grow/shrink trail
        if (t < 0.15) effectiveTrailLength *= t / 0.15;
        else if (t > 0.65) effectiveTrailLength *= 1 - (t - 0.65) / 0.35;

        const pointPos = headPos
          .clone()
          .addScaledVector(
            trajectory.direction,
            -trailT * effectiveTrailLength
          );

        mesh.position.copy(pointPos);

        // Size decreases along trail (head is brightest)
        const baseSize = 0.015 + (1 - trailT) * 0.025;
        mesh.scale.setScalar(
          baseSize * (t < 0.1 ? t * 10 : t > 0.7 ? (1 - t) / 0.3 : 1)
        );

        // Opacity decreases along trail
        const mat = mesh.material as THREE.MeshBasicMaterial;
        let opacity = 1 - trailT * 0.9; // Head=1, tail=0.1
        if (t < 0.1) opacity *= t * 10;
        else if (t > 0.6) opacity *= 1 - (t - 0.6) / 0.4;
        mat.opacity = opacity;
      }
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {Array.from({ length: trailPointsCount }).map((_, i) => (
        <mesh key={i} ref={(el) => (trailRefs.current[i] = el)}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={i === 0 ? "#ffffff" : "#e0f0ff"}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Satellite orbiting
function Satellite({
  radius,
  speed,
  offset,
  tilt,
}: {
  radius: number;
  speed: number;
  offset: number;
  tilt: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const blinkRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime * speed + offset;

    // Orbital motion
    ref.current.position.x = Math.cos(time) * radius;
    ref.current.position.y = Math.sin(time) * radius * Math.cos(tilt);
    ref.current.position.z = Math.sin(time) * radius * Math.sin(tilt);

    // Rotate satellite body
    ref.current.rotation.y = time * 2;

    // Blinking light
    if (blinkRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 8) > 0.7;
      (blinkRef.current.material as THREE.MeshBasicMaterial).opacity = blink
        ? 1
        : 0.2;
    }
  });

  return (
    <group ref={ref}>
      {/* Satellite body */}
      <mesh>
        <boxGeometry args={[0.1, 0.05, 0.05]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.12, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Blinking light */}
      <mesh ref={blinkRef} position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={1} />
      </mesh>
    </group>
  );
}

// Floating particles / space dust
function SpaceDust() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#06b6d4"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function ScrollUpdater({
  onSectionChange,
  targetSection,
  onFirstSectionAnimationComplete,
}: {
  onSectionChange?: (s: number) => void;
  targetSection?: number | null;
  onFirstSectionAnimationComplete?: () => void;
}) {
  const scroll = useScroll();
  const lastSection = useRef(-1);
  const lastTargetSection = useRef<number | null>(null);
  const firstSectionAnimationFired = useRef(false);

  useFrame(() => {
    // If we have a target section from navigation, use it directly
    if (
      targetSection !== null &&
      targetSection !== undefined &&
      targetSection !== lastTargetSection.current
    ) {
      lastTargetSection.current = targetSection;
      lastSection.current = targetSection;
      if (onSectionChange) onSectionChange(targetSection);
      return;
    }

    // Reset when navigation is complete
    if (targetSection === null && lastTargetSection.current !== null) {
      lastTargetSection.current = null;
    }

    // Don't update section from scroll while navigating
    if (targetSection !== null) {
      return;
    }

    const offset = scroll.offset;

    // Use the centralized section detection function
    const newSection = getSectionFromOffset(offset);

    if (newSection !== lastSection.current) {
      lastSection.current = newSection;
      if (onSectionChange) onSectionChange(newSection);
    }

    // Detect when section 1 starts - trigger immediately when entering section 1
    // This triggers the FullStack card to appear quickly
    if (
      offset >= 0.001 &&
      !firstSectionAnimationFired.current &&
      lastSection.current === 1
    ) {
      firstSectionAnimationFired.current = true;
      if (onFirstSectionAnimationComplete) onFirstSectionAnimationComplete();
    }

    // Reset the flag when leaving section 1
    if (newSection !== 1) {
      firstSectionAnimationFired.current = false;
    }
  });

  return null;
}

interface ExperienceProps {
  onSectionChange?: (section: number) => void;
  onExperienceSelect?: (experience: ExperienceType | null) => void;
  selectedExperienceId?: string | null;
  detailScrollOffset?: number;
  targetSection?: number | null;
  onNavigationComplete?: () => void;
  onFirstSectionAnimationComplete?: () => void;
  onSkillClick?: (skillSection: number) => void;
}

// Determine which major section we're in (skills, experience, portfolio, about)
const getMajorSection = (section: number): 'skills' | 'experience' | 'portfolio' | 'about' => {
  if (section <= 12) return 'skills';
  if (section === 13) return 'experience';
  if (section === 14) return 'portfolio';
  return 'about';
};

// Get rotation angle for major section (to bring it to front)
const getRotationForSection = (majorSection: 'skills' | 'experience' | 'portfolio' | 'about'): number => {
  switch (majorSection) {
    case 'skills': return 0;
    case 'experience': return -SECTION_ANGLES.experience; // Rotate world so experience faces camera
    case 'portfolio': return -SECTION_ANGLES.portfolio; // Rotate world so portfolio faces camera
    case 'about': return -SECTION_ANGLES.about; // Rotate world so about faces camera
  }
};

// Helper to normalize angle to [0, 2PI)
const normalizeAngle = (angle: number): number => {
  const TWO_PI = Math.PI * 2;
  let normalized = angle % TWO_PI;
  if (normalized < 0) normalized += TWO_PI;
  return normalized;
};

// Helper to find shortest angular distance (returns signed value)
const shortestAngleDist = (from: number, to: number): number => {
  const TWO_PI = Math.PI * 2;
  // Normalize both angles to [0, 2PI)
  const fromNorm = normalizeAngle(from);
  const toNorm = normalizeAngle(to);

  // Calculate direct distance
  let diff = toNorm - fromNorm;

  // Wrap to [-PI, PI] for shortest path
  if (diff > Math.PI) diff -= TWO_PI;
  if (diff < -Math.PI) diff += TWO_PI;

  return diff;
};

// Component that rotates all content based on current major section
// Camera stays in place, world rotates to bring content to front
function RotatingWorld({
  children,
  currentSection,
  targetSection,
  onAnimatingChange,
}: {
  children: React.ReactNode;
  currentSection: number;
  targetSection: number | null;
  onAnimatingChange?: (isAnimating: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const currentMajorSection = useRef<'skills' | 'experience' | 'portfolio' | 'about'>('skills');
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startRotation = useRef(0);
  const endRotation = useRef(0);
  const lastAnimatingState = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Determine target section for rotation
    const effectiveSection = targetSection ?? currentSection;
    const majorSection = getMajorSection(effectiveSection);

    // Check if major section changed
    if (majorSection !== currentMajorSection.current && !isAnimating.current) {
      currentMajorSection.current = majorSection;

      const newTargetRotation = getRotationForSection(majorSection);
      startRotation.current = groupRef.current.rotation.y;

      // Calculate shortest path
      const shortestDist = shortestAngleDist(startRotation.current, newTargetRotation);
      endRotation.current = startRotation.current + shortestDist;

      isAnimating.current = true;
      animationProgress.current = 0;
    }

    // Animate rotation with smoother timing
    if (isAnimating.current) {
      animationProgress.current += delta * 0.6; // Slower for smoother rotation

      if (animationProgress.current >= 1) {
        animationProgress.current = 1;
        isAnimating.current = false;
        groupRef.current.rotation.y = endRotation.current;
      } else {
        // Use quintic easing for ultra-smooth rotation
        const t = animationProgress.current;
        const smoothEase = easeInOutQuint(t);

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          startRotation.current,
          endRotation.current,
          smoothEase
        );
      }
    }

    // Notify parent of animation state changes
    if (lastAnimatingState.current !== isAnimating.current) {
      lastAnimatingState.current = isAnimating.current;
      if (onAnimatingChange) {
        onAnimatingChange(isAnimating.current);
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Orbit rings that only appear during navigation or on hero section
function FadingOrbitRings({ isAnimating, currentSection }: { isAnimating: boolean; currentSection: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Visible during animation OR on hero section (section 0)
    const targetOpacity = (isAnimating || currentSection === 0) ? 1 : 0;

    // Linear fade - constant speed, no slowdown at end
    const fadeSpeed = 6; // Units per second
    const diff = targetOpacity - currentOpacity.current;
    const step = delta * fadeSpeed;

    if (Math.abs(diff) <= step) {
      currentOpacity.current = targetOpacity;
    } else {
      currentOpacity.current += Math.sign(diff) * step;
    }

    // Apply opacity to rings
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshBasicMaterial;
        if (material && 'opacity' in material) {
          const mat = material as unknown as { opacity: number; _originalOpacity?: number };
          if (mat._originalOpacity === undefined) {
            mat._originalOpacity = material.opacity;
          }
          material.opacity = mat._originalOpacity * currentOpacity.current;
        }
      }
    });

    groupRef.current.visible = currentOpacity.current > 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Main orbit ring - larger and more visible */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ORBIT_RADIUS, 0.04, 16, 120]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.35} />
      </mesh>
      {/* Secondary tilted ring */}
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[ORBIT_RADIUS * 0.92, 0.02, 16, 120]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
      </mesh>
      {/* Third decorative ring */}
      <mesh rotation={[Math.PI / 2.5, -0.15, 0.1]}>
        <torusGeometry args={[ORBIT_RADIUS * 1.05, 0.015, 16, 120]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

// Wrapper component that fades sections based on active state
function FadingSection({
  children,
  isActive,
  isAnimating,
  sectionType,
}: {
  children: React.ReactNode;
  isActive: boolean;
  isAnimating: boolean;
  sectionType: 'skills' | 'experience' | 'portfolio' | 'about';
}) {
  const groupRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(isActive ? 1 : 0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Target opacity: full if active OR animating, otherwise invisible
    const targetOpacity = (isActive || isAnimating) ? 1 : 0;

    // Smooth exponential fade for natural feel
    const fadeSpeed = isAnimating ? 4 : 3; // Slower for smoother transitions
    const diff = targetOpacity - currentOpacity.current;

    // Use exponential decay for smooth fade (never truly linear)
    const decay = 1 - Math.exp(-delta * fadeSpeed);
    currentOpacity.current += diff * decay;

    // Snap to target when very close
    if (Math.abs(diff) < 0.01) {
      currentOpacity.current = targetOpacity;
    }

    // Apply opacity to all materials in the group
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material && 'opacity' in material) {
            // Skip materials that are managed externally (category boxes start at 0 and are animated separately)
            // These materials have _externallyManaged flag or start with opacity 0 and use depthWrite false
            const mat = material as THREE.Material & { _externallyManaged?: boolean; depthWrite?: boolean };
            if (mat._externallyManaged) return;

            // Store original opacity if not yet stored
            if ((material as { _originalOpacity?: number })._originalOpacity === undefined) {
              // Don't store 0 as original - it means it's externally managed
              if (material.opacity === 0) {
                mat._externallyManaged = true;
                return;
              }
              (material as { _originalOpacity: number })._originalOpacity = material.opacity;
            }
            const originalOpacity = (material as { _originalOpacity: number })._originalOpacity;
            material.opacity = originalOpacity * currentOpacity.current;
            material.transparent = true;
          }
        });
      }
    });

    // Also update visibility for performance when fully hidden
    groupRef.current.visible = currentOpacity.current > 0.01;
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Experience({
  onSectionChange,
  onExperienceSelect,
  selectedExperienceId,
  detailScrollOffset = 0,
  targetSection,
  onNavigationComplete,
  onFirstSectionAnimationComplete,
  onSkillClick,
}: ExperienceProps) {
  const selectedExperience = selectedExperienceId
    ? experienceData.find(
        (e: ExperienceType) => e.id === selectedExperienceId
      ) || null
    : null;

  // Track current section for camera and highlight logic
  const [currentSection, setCurrentSection] = useState(0);

  // Track if world is rotating (for section visibility)
  const [isWorldAnimating, setIsWorldAnimating] = useState(false);

  // Scroll snap state
  const [snapOffset, setSnapOffset] = useState<number | null>(null);

  // Handle snap request from CameraRig
  const handleRequestSnap = useCallback((offset: number) => {
    setSnapOffset(offset);
    // Clear snap after animation completes
    setTimeout(() => setSnapOffset(null), 500);
  }, []);

  // Wrapper to track section changes locally and notify parent
  const handleSectionChange = (section: number) => {
    setCurrentSection(section);
    if (onSectionChange) onSectionChange(section);
  };

  // Determine active major section
  const activeMajorSection = getMajorSection(currentSection);

  return (
    <>
      {/* Gradient Background Sphere */}
      <Sphere args={[50, 64, 64]} scale={[-1, 1, 1]}>
        <meshBasicMaterial side={THREE.BackSide}>
          <GradientTexture
            stops={[0, 0.4, 0.7, 1]}
            colors={["#0a192f", "#0d2847", "#164e63", "#0891b2"]}
          />
        </meshBasicMaterial>
      </Sphere>

      {/* Animated background elements */}
      <AnimatedStars />
      <SpaceDust />

      {/* Realistic shooting stars - fast bright streaks */}
      <ShootingStar delay={2} />
      <ShootingStar delay={7} />
      <ShootingStar delay={12} />
      <ShootingStar delay={18} />
      <ShootingStar delay={24} />
      <ShootingStar delay={31} />

      {/* Brighter shooting stars with gradient trail */}
      <ShootingStarBright delay={5} />
      <ShootingStarBright delay={15} />
      <ShootingStarBright delay={28} />

      {/* Satellites orbiting */}
      <Satellite radius={18} speed={0.15} offset={0} tilt={0.3} />
      <Satellite radius={22} speed={0.1} offset={Math.PI} tilt={-0.5} />
      <Satellite radius={15} speed={0.2} offset={Math.PI / 2} tilt={0.8} />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#00f0ff"
      />
      <directionalLight
        position={[-10, 5, -5]}
        intensity={0.8}
        color="#06b6d4"
      />
      <directionalLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      <Environment preset="city" />

      <ScrollControls pages={25} damping={0.25}>
        <CameraRig
          selectedExperience={selectedExperience}
          targetSection={targetSection}
          onNavigationComplete={onNavigationComplete}
          snapOffset={snapOffset}
          onRequestSnap={handleRequestSnap}
        />
        <ScrollUpdater
          onSectionChange={handleSectionChange}
          targetSection={targetSection}
          onFirstSectionAnimationComplete={onFirstSectionAnimationComplete}
        />

        {/* Main content - hidden when in detail view */}
        {/* RotatingWorld rotates all content to bring the current section to front */}
        {!selectedExperience && (
          <RotatingWorld
            currentSection={currentSection}
            targetSection={targetSection ?? null}
            onAnimatingChange={setIsWorldAnimating}
          >
            {/* Skills section - at 0° on the circle (front) */}
            <FadingSection
              isActive={activeMajorSection === 'skills'}
              isAnimating={isWorldAnimating}
              sectionType="skills"
            >
              <group position={[3, 0, ORBIT_RADIUS]}>
                <Float rotationIntensity={0.05} floatIntensity={0.1} speed={1}>
                  <WebsiteBuilder currentSection={currentSection} onSkillClick={onSkillClick} />
                </Float>
              </group>
            </FadingSection>

            {/* Timeline 3D Experience - at 120° */}
            <FadingSection
              isActive={activeMajorSection === 'experience'}
              isAnimating={isWorldAnimating}
              sectionType="experience"
            >
              <Timeline3D
                onExperienceSelect={onExperienceSelect || (() => {})}
                selectedId={selectedExperienceId || null}
              />
            </FadingSection>

            {/* Portfolio 3D - at 180° */}
            <FadingSection
              isActive={activeMajorSection === 'portfolio'}
              isAnimating={isWorldAnimating}
              sectionType="portfolio"
            >
              <Portfolio3D />
            </FadingSection>

            {/* About 3D - at 270° */}
            <FadingSection
              isActive={activeMajorSection === 'about'}
              isAnimating={isWorldAnimating}
              sectionType="about"
            >
              <About3D
                isActive={activeMajorSection === 'about'}
                isAnimating={isWorldAnimating}
              />
            </FadingSection>

            {/* Central decoration - orbit rings (visible during navigation or hero section) */}
            <FadingOrbitRings isAnimating={isWorldAnimating} currentSection={currentSection} />
          </RotatingWorld>
        )}

        {/* Experience Detail View - completely separate view */}
        {selectedExperience && (
          <ExperienceDetail3D
            experience={selectedExperience}
            scrollOffset={detailScrollOffset}
          />
        )}
      </ScrollControls>
    </>
  );
}
