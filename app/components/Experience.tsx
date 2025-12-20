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

// Camera positions for each section - perfectly defined
const SECTION_CAMERA_POSITIONS: Record<number, { x: number; y: number; z: number; lookX: number; lookY: number }> = {
  0: { x: 0, y: 0, z: 5, lookX: 0, lookY: 0 }, // Intro
  1: { x: -5.5, y: 0, z: 7, lookX: -5.5, lookY: 0 }, // FullStack Overview
  2: { x: -GRID_X, y: 0, z: 8, lookX: -GRID_X, lookY: 0 }, // Frontend Group
  3: { x: -GRID_X, y: GRID_Y, z: 3.2, lookX: -GRID_X, lookY: GRID_Y }, // Site Web
  4: { x: -GRID_X, y: 0, z: 3.2, lookX: -GRID_X, lookY: 0 }, // Mobile
  5: { x: -GRID_X, y: -GRID_Y, z: 3.2, lookX: -GRID_X, lookY: -GRID_Y }, // Backoffice
  6: { x: 0, y: GRID_Y * 0.5, z: 8, lookX: 0, lookY: GRID_Y * 0.5 }, // Backend Group
  7: { x: 0, y: GRID_Y, z: 3.2, lookX: 0, lookY: GRID_Y }, // Server
  8: { x: 0, y: 0, z: 3.2, lookX: 0, lookY: 0 }, // Database
  9: { x: GRID_X, y: 0, z: 8, lookX: GRID_X, lookY: 0 }, // DevOps Group
  10: { x: GRID_X, y: GRID_Y, z: 3.2, lookX: GRID_X, lookY: GRID_Y }, // CI/CD
  11: { x: GRID_X, y: 0, z: 3.2, lookX: GRID_X, lookY: 0 }, // Cloud
  12: { x: GRID_X, y: -GRID_Y, z: 3.2, lookX: GRID_X, lookY: -GRID_Y }, // Architecture
  13: { x: 0, y: -12, z: 8, lookX: 0, lookY: -12 }, // Timeline
  14: { x: 0, y: -24, z: 8, lookX: 0, lookY: -24 }, // Portfolio
};

// Scroll offset snap points for each section
const SECTION_SNAP_OFFSETS: number[] = [
  0.0,    // 0: Intro
  0.05,   // 1: FullStack Overview
  0.12,   // 2: Frontend Slide
  0.16,   // 3: Site Web
  0.20,   // 4: Mobile
  0.24,   // 5: Backoffice
  0.28,   // 6: Backend Slide
  0.32,   // 7: Server
  0.36,   // 8: Database
  0.40,   // 9: DevOps Slide
  0.44,   // 10: CI/CD
  0.48,   // 11: Cloud
  0.52,   // 12: Architecture
  0.63,   // 13: Timeline
  0.80,   // 14: Portfolio
];

// Easing function for smooth camera interpolation
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
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
// Includes zoom-out effect for group transitions
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
    return SECTION_CAMERA_POSITIONS[0];
  }

  // Smooth easing for professional feel
  const t = easeInOutCubic(progress);

  // Check if this is a group transition (needs zoom-out effect)
  const isGroupTransition = GROUP_TRANSITION_SECTIONS.has(nextSection);

  // Calculate zoom-out curve for group transitions
  // This creates a "pull back and push forward" effect
  let zoomOffset = 0;
  if (isGroupTransition && progress > 0) {
    // Bell curve: peaks at 50% progress, adds extra z distance
    const zoomCurve = Math.sin(progress * Math.PI);
    zoomOffset = zoomCurve * 4; // Max 4 units of extra zoom
  }

  return {
    x: THREE.MathUtils.lerp(currentPos.x, nextPos.x, t),
    y: THREE.MathUtils.lerp(currentPos.y, nextPos.y, t),
    z: THREE.MathUtils.lerp(currentPos.z, nextPos.z, t) + zoomOffset,
    lookX: THREE.MathUtils.lerp(currentPos.lookX, nextPos.lookX, t),
    lookY: THREE.MathUtils.lerp(currentPos.lookY, nextPos.lookY, t),
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

    // Smooth snap animation - uses spring-like easing
    if (snapOffset !== null && scroll.el && !navAnimationActive.current && forcedOffset.current === null) {
      const targetScrollTop = snapOffset * (scroll.el.scrollHeight - scroll.el.clientHeight);
      const currentScrollTop = scroll.el.scrollTop;
      const diff = targetScrollTop - currentScrollTop;

      // Spring-like easing: faster when far, slower when close
      const springFactor = 0.08 + Math.min(0.12, Math.abs(diff) * 0.0001);

      if (Math.abs(diff) > 1) {
        scroll.el.scrollTop = currentScrollTop + diff * springFactor;
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
      navTargetLookAt.current.set(pos.lookX, pos.lookY, 0);
      navStartLookAt.current.set(
        state.camera.position.x,
        state.camera.position.y,
        0
      );

      const distance = navStartPos.current.distanceTo(navTargetPos.current);
      navAnimationDuration.current = Math.min(1.5, Math.max(0.8, 0.8 + distance * 0.05));

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

      // Custom easing: slow start, smooth middle, gentle end
      // Using a combination of ease-in-out with extra smoothness
      const easeInOutQuart =
        t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

      // Calculate distance for adaptive zoom
      const distance = navStartPos.current.distanceTo(navTargetPos.current);
      // More zoom for longer distances, less for short ones
      const zoomOutAmount = Math.min(5, Math.max(2, distance * 0.3));

      // Use a smoother bell curve for zoom
      const zoomCurve = Math.sin(t * Math.PI) * Math.sin(t * Math.PI * 0.5);

      const x = THREE.MathUtils.lerp(
        navStartPos.current.x,
        navTargetPos.current.x,
        easeInOutQuart
      );
      const y = THREE.MathUtils.lerp(
        navStartPos.current.y,
        navTargetPos.current.y,
        easeInOutQuart
      );
      const baseZ = THREE.MathUtils.lerp(
        navStartPos.current.z,
        navTargetPos.current.z,
        easeInOutQuart
      );
      const z = baseZ + zoomCurve * zoomOutAmount;

      // Smooth lookAt interpolation
      const lookAtX = THREE.MathUtils.lerp(
        navStartLookAt.current.x,
        navTargetLookAt.current.x,
        easeInOutQuart
      );
      const lookAtY = THREE.MathUtils.lerp(
        navStartLookAt.current.y,
        navTargetLookAt.current.y,
        easeInOutQuart
      );
      const lookAtZ = THREE.MathUtils.lerp(
        navStartLookAt.current.z,
        navTargetLookAt.current.z,
        easeInOutQuart
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
    let { x, y, z, lookX, lookY } = camPos;

    // Override camera position when in detail view (experience selected)
    if (isInDetailView) {
      x = 0;
      y = 0;
      z = 7;
      lookX = 0;
      lookY = 0;
    }

    // Add subtle drift for life (only when idle and not snapping)
    if (!isInDetailView && forcedOffset.current === null && !isSnapping.current) {
      const time = state.clock.getElapsedTime();
      x += Math.sin(time * 0.15) * 0.03;
      y += Math.cos(time * 0.2) * 0.03;
    }

    const targetPos = new THREE.Vector3(x, y, z);
    const lookAt = new THREE.Vector3(lookX, lookY, 0);

    // Smooth camera movement - adjust damping based on state
    const dampFactor = isSnapping.current ? 0.08 : 0.12;

    if (forcedOffset.current !== null) {
      // During menu navigation, move camera smoothly but faster
      easing.damp3(state.camera.position, targetPos, 0.06, delta);
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

    // Detect when section 1 starts (synchronized with 3D elements at offset >= 0.035)
    // This triggers the FullStack card to appear at the same time as 3D elements
    if (
      offset >= 0.035 &&
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
}

export default function Experience({
  onSectionChange,
  onExperienceSelect,
  selectedExperienceId,
  detailScrollOffset = 0,
  targetSection,
  onNavigationComplete,
  onFirstSectionAnimationComplete,
}: ExperienceProps) {
  const selectedExperience = selectedExperienceId
    ? experienceData.find(
        (e: ExperienceType) => e.id === selectedExperienceId
      ) || null
    : null;

  // Track current section for camera and highlight logic
  const [currentSection, setCurrentSection] = useState(0);

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
        {!selectedExperience && (
          <>
            <Float rotationIntensity={0.05} floatIntensity={0.1} speed={1}>
              <WebsiteBuilder currentSection={currentSection} />
            </Float>

            {/* Timeline 3D Experience */}
            <Timeline3D
              onExperienceSelect={onExperienceSelect || (() => {})}
              selectedId={selectedExperienceId || null}
            />

            {/* Portfolio 3D */}
            <Portfolio3D />
          </>
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
