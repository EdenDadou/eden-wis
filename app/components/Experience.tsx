import { ScrollControls, useScroll, Float, Environment, GradientTexture, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { easing } from 'maath';
import WebsiteBuilder from './WebsiteBuilder';
import Timeline3D, { type Experience as ExperienceType, experienceData } from './Timeline3D';
import ExperienceDetail3D from './ExperienceDetail3D';
import Portfolio3D from './Portfolio3D';
import '../styles/global.css';

interface CameraRigProps {
  selectedExperience: ExperienceType | null;
  detailScrollOffset: number;
  targetSection?: number | null;
  onNavigationComplete?: () => void;
}

// Map section number to scroll offset - must match ScrollUpdater thresholds
function getSectionOffset(section: number): number {
  switch (section) {
    case 0: return 0;       // Intro
    case 1: return 0.07;    // FullStack Overview
    case 2: return 0.14;    // Frontend Slide
    case 3: return 0.19;    // Site Web
    case 4: return 0.24;    // Mobile
    case 5: return 0.29;    // Backoffice
    case 6: return 0.34;    // Backend Slide
    case 7: return 0.39;    // Server
    case 8: return 0.44;    // Database
    case 9: return 0.49;    // DevOps Slide
    case 10: return 0.54;   // CI/CD
    case 11: return 0.59;   // Cloud
    case 12: return 0.64;   // Architecture
    case 13: return 0.74;   // Timeline
    case 14: return 0.90;   // Portfolio
    default: return 0;
  }
}

// Calculate camera position for a given scroll offset (for menu navigation)
function getCameraPositionForOffset(offset: number, GRID_X: number, GRID_Y: number) {
  let x = 0, y = 0, z = 5;
  let lookX = 0, lookY = 0;

  // Match CameraRig timings exactly for consistent navigation
  if (offset < 0.05) {
    // Intro
    x = 0; y = 0; z = 5; lookX = 0; lookY = 0;
  } else if (offset < 0.12) {
    // FullStack Overview
    x = 0; y = 0; z = 10; lookX = 0; lookY = 0;
  } else if (offset < 0.17) {
    // Frontend Slide (LEFT column)
    x = -GRID_X; y = 0; z = 6; lookX = -GRID_X; lookY = 0;
  } else if (offset < 0.22) {
    // Site Web (-GRID_X, GRID_Y)
    x = -GRID_X; y = GRID_Y; z = 2.8; lookX = -GRID_X; lookY = GRID_Y;
  } else if (offset < 0.27) {
    // Mobile (-GRID_X, 0)
    x = -GRID_X; y = 0; z = 2.8; lookX = -GRID_X; lookY = 0;
  } else if (offset < 0.32) {
    // Backoffice (-GRID_X, -GRID_Y)
    x = -GRID_X; y = -GRID_Y; z = 2.8; lookX = -GRID_X; lookY = -GRID_Y;
  } else if (offset < 0.37) {
    // Backend Slide (CENTER)
    x = 0; y = GRID_Y * 0.5; z = 5; lookX = 0; lookY = GRID_Y * 0.5;
  } else if (offset < 0.42) {
    // Server (0, GRID_Y)
    x = 0; y = GRID_Y; z = 2.8; lookX = 0; lookY = GRID_Y;
  } else if (offset < 0.47) {
    // Database (0, 0)
    x = 0; y = 0; z = 2.8; lookX = 0; lookY = 0;
  } else if (offset < 0.52) {
    // DevOps Slide (RIGHT column)
    x = GRID_X; y = 0; z = 6; lookX = GRID_X; lookY = 0;
  } else if (offset < 0.57) {
    // CI/CD (GRID_X, GRID_Y)
    x = GRID_X; y = GRID_Y; z = 2.8; lookX = GRID_X; lookY = GRID_Y;
  } else if (offset < 0.62) {
    // Cloud (GRID_X, 0)
    x = GRID_X; y = 0; z = 2.8; lookX = GRID_X; lookY = 0;
  } else if (offset < 0.67) {
    // Architecture (GRID_X, -GRID_Y)
    x = GRID_X; y = -GRID_Y; z = 2.8; lookX = GRID_X; lookY = -GRID_Y;
  } else if (offset < 0.82) {
    // Timeline
    x = 0; y = -12; z = 8; lookX = 0; lookY = -12;
  } else {
    // Portfolio
    x = 0; y = -24; z = 8; lookX = 0; lookY = -24;
  }

  return { x, y, z, lookX, lookY };
}

function CameraRig({ selectedExperience, detailScrollOffset, targetSection, onNavigationComplete }: CameraRigProps) {
  const scroll = useScroll();
  const isInDetailView = selectedExperience !== null;
  const lastTargetSection = useRef<number | null>(null);
  const forcedOffset = useRef<number | null>(null);
  const forceFramesRemaining = useRef(0);
  const navigationCompleted = useRef(true);

  // Animation state for menu navigation
  const navAnimationProgress = useRef(0);
  const navAnimationActive = useRef(false);
  const navStartPos = useRef(new THREE.Vector3());
  const navTargetPos = useRef(new THREE.Vector3());
  const navTargetLookAt = useRef(new THREE.Vector3());
  const navStartLookAt = useRef(new THREE.Vector3());
  const navAnimationDuration = useRef(1.2); // seconds - will be adjusted based on distance

  useFrame((state, delta) => {
    // Handle direct navigation - start animation
    if (targetSection !== null && targetSection !== undefined && targetSection !== lastTargetSection.current) {
      lastTargetSection.current = targetSection;
      const targetOffset = getSectionOffset(targetSection);

      // Force the offset for many frames to let scroll catch up
      forcedOffset.current = targetOffset;
      forceFramesRemaining.current = 120; // Force for ~2 seconds at 60fps
      navigationCompleted.current = false;

      // Start camera animation
      const GRID_X = 3.2;
      const GRID_Y = 2.5;
      const pos = getCameraPositionForOffset(targetOffset, GRID_X, GRID_Y);

      navStartPos.current.copy(state.camera.position);
      navTargetPos.current.set(pos.x, pos.y, pos.z);
      navTargetLookAt.current.set(pos.lookX, pos.lookY, 0);
      // Use current position as start lookAt (camera is looking at what it's positioned over)
      // This prevents the jarring rotation at the start
      navStartLookAt.current.set(
        state.camera.position.x,
        state.camera.position.y,
        0
      );

      // Calculate distance and adjust animation duration
      const distance = navStartPos.current.distanceTo(navTargetPos.current);
      // Longer duration for longer distances (1.2s base, up to 2s for very long)
      navAnimationDuration.current = Math.min(2.0, Math.max(1.0, 1.0 + distance * 0.08));

      navAnimationProgress.current = 0;
      navAnimationActive.current = true;
    }

    // Keep forcing scroll position while forcedOffset is active
    if (forcedOffset.current !== null && scroll.el) {
      scroll.el.scrollTop = forcedOffset.current * (scroll.el.scrollHeight - scroll.el.clientHeight);

      forceFramesRemaining.current--;

      // Release when frames run out AND scroll has caught up AND animation is done
      const diff = Math.abs(scroll.offset - forcedOffset.current);
      if (forceFramesRemaining.current <= 0 && diff < 0.01 && !navAnimationActive.current) {
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
      const easeInOutQuart = t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;

      // Calculate distance for adaptive zoom
      const distance = navStartPos.current.distanceTo(navTargetPos.current);
      // More zoom for longer distances, less for short ones
      const zoomOutAmount = Math.min(5, Math.max(2, distance * 0.3));

      // Use a smoother bell curve for zoom
      const zoomCurve = Math.sin(t * Math.PI) * Math.sin(t * Math.PI * 0.5);

      const x = THREE.MathUtils.lerp(navStartPos.current.x, navTargetPos.current.x, easeInOutQuart);
      const y = THREE.MathUtils.lerp(navStartPos.current.y, navTargetPos.current.y, easeInOutQuart);
      const baseZ = THREE.MathUtils.lerp(navStartPos.current.z, navTargetPos.current.z, easeInOutQuart);
      const z = baseZ + zoomCurve * zoomOutAmount;

      // Smooth lookAt interpolation
      const lookAtX = THREE.MathUtils.lerp(navStartLookAt.current.x, navTargetLookAt.current.x, easeInOutQuart);
      const lookAtY = THREE.MathUtils.lerp(navStartLookAt.current.y, navTargetLookAt.current.y, easeInOutQuart);
      const lookAtZ = THREE.MathUtils.lerp(navStartLookAt.current.z, navTargetLookAt.current.z, easeInOutQuart);

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
    
    // === CAMERA SEQUENCE (15 sections) ===
    // 0: Intro (Eden Wisniewski) - Start zoomed out
    // 1: FullStack Overview - See all skills with category boxes
    // 2: Frontend Slide - Zoom to Frontend group (LEFT column, x=-GRID_X)
    // 3: Site Web detail (-GRID_X, GRID_Y)
    // 4: Mobile detail (-GRID_X, 0)
    // 5: Backoffice detail (-GRID_X, -GRID_Y)
    // 6: Backend Slide - Zoom to Backend group (CENTER, x=0)
    // 7: Server detail (0, GRID_Y)
    // 8: Database detail (0, 0)
    // 9: DevOps Slide - Zoom to DevOps group (RIGHT column, x=GRID_X)
    // 10: CI/CD detail (GRID_X, GRID_Y)
    // 11: Cloud detail (GRID_X, 0)
    // 12: Architecture detail (GRID_X, -GRID_Y)
    // 13: Timeline
    // 14: Portfolio

    const GRID_X = 3.2;
    const GRID_Y = 2.5;

    let x = 0, y = 0, z = 5; // Default far
    let lookX = 0, lookY = 0;

    // NEW TIMING MAP (0.0 - 1.0) - 15 sections total
    // 0: Intro:        0.00 - 0.05
    // 1: FullStack:    0.05 - 0.12 (overview, all visible)
    // 2: Frontend:     0.12 - 0.17 (zoom to frontend group)
    // 3: Site Web:     0.17 - 0.22
    // 4: Mobile:       0.22 - 0.27
    // 5: Backoffice:   0.27 - 0.32
    // 6: Backend:      0.32 - 0.37 (zoom to backend group)
    // 7: Server:       0.37 - 0.42
    // 8: Database:     0.42 - 0.47
    // 9: DevOps:       0.47 - 0.52 (zoom to devops group)
    // 10: CI/CD:       0.52 - 0.57
    // 11: Cloud:       0.57 - 0.62
    // 12: Archi:       0.62 - 0.67
    // 13: Timeline:    0.67 - 0.82
    // 14: Portfolio:   0.82 - 1.00

    // 0. Intro [0.0 - 0.05] - Start centered, slightly zoomed
    if (offset < 0.05) {
       x = 0; y = 0; z = 5;
       lookX = 0; lookY = 0;
    }
    // 1. FullStack Overview [0.05 - 0.12] - Dezoom to see all
    else if (offset < 0.12) {
       const t = (offset - 0.05) / 0.07;
       x = 0; y = 0;
       z = THREE.MathUtils.lerp(5, 10, easeOutCubic(t));
       lookX = 0; lookY = 0;
    }
    // 2. Frontend Slide [0.12 - 0.17] - Zoom to Frontend group (LEFT column, x=-GRID_X)
    else if (offset < 0.17) {
       const t = (offset - 0.12) / 0.05;
       x = THREE.MathUtils.lerp(0, -GRID_X, easeInOutCubic(t));
       y = 0;
       z = THREE.MathUtils.lerp(10, 6, easeInOutCubic(t));
       lookX = -GRID_X; lookY = 0;
    }
    // 3. Site Web detail [0.17 - 0.22] - Frontend top (-GRID_X, GRID_Y)
    else if (offset < 0.22) {
       const t = (offset - 0.17) / 0.05;
       x = -GRID_X;
       y = THREE.MathUtils.lerp(0, GRID_Y, easeInOutCubic(t));
       z = THREE.MathUtils.lerp(6, 2.8, easeInOutCubic(t));
       lookX = x; lookY = y;
    }
    // 4. Mobile detail [0.22 - 0.27] - Mobile at (-GRID_X, 0)
    else if (offset < 0.27) {
       const t = (offset - 0.22) / 0.05;
       x = -GRID_X;
       y = THREE.MathUtils.lerp(GRID_Y, 0, easeInOutCubic(t));
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 5. Backoffice detail [0.27 - 0.32] - Backoffice at (-GRID_X, -GRID_Y)
    else if (offset < 0.32) {
       const t = (offset - 0.27) / 0.05;
       x = -GRID_X;
       y = THREE.MathUtils.lerp(0, -GRID_Y, easeInOutCubic(t));
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 6. Backend Slide [0.32 - 0.37] - Zoom out to Backend group (CENTER column)
    else if (offset < 0.37) {
       const t = (offset - 0.32) / 0.05;
       x = THREE.MathUtils.lerp(-GRID_X, 0, easeInOutCubic(t));
       y = THREE.MathUtils.lerp(-GRID_Y, GRID_Y * 0.5, easeInOutCubic(t));
       z = THREE.MathUtils.lerp(2.8, 5, easeInOutCubic(t));
       lookX = 0; lookY = GRID_Y * 0.5;
    }
    // 7. Server detail [0.37 - 0.42] - Server at (0, GRID_Y)
    else if (offset < 0.42) {
       const t = (offset - 0.37) / 0.05;
       x = 0;
       y = THREE.MathUtils.lerp(GRID_Y * 0.5, GRID_Y, easeInOutCubic(t));
       z = THREE.MathUtils.lerp(5, 2.8, easeInOutCubic(t));
       lookX = 0; lookY = y;
    }
    // 8. Database detail [0.42 - 0.47] - Database at (0, 0)
    else if (offset < 0.47) {
       const t = (offset - 0.42) / 0.05;
       x = 0;
       y = THREE.MathUtils.lerp(GRID_Y, 0, easeInOutCubic(t));
       z = 2.8;
       lookX = 0; lookY = y;
    }
    // 9. DevOps Slide [0.47 - 0.52] - Zoom out to DevOps group (RIGHT column, x=GRID_X)
    else if (offset < 0.52) {
       const t = (offset - 0.47) / 0.05;
       x = THREE.MathUtils.lerp(0, GRID_X, easeInOutCubic(t));
       y = 0;
       z = THREE.MathUtils.lerp(2.8, 6, easeInOutCubic(t));
       lookX = GRID_X; lookY = 0;
    }
    // 10. CI/CD detail [0.52 - 0.57] - CI/CD at (GRID_X, GRID_Y)
    else if (offset < 0.57) {
       const t = (offset - 0.52) / 0.05;
       x = GRID_X;
       y = THREE.MathUtils.lerp(0, GRID_Y, easeInOutCubic(t));
       z = THREE.MathUtils.lerp(6, 2.8, easeInOutCubic(t));
       lookX = x; lookY = y;
    }
    // 11. Cloud detail [0.57 - 0.62] - Cloud at (GRID_X, 0)
    else if (offset < 0.62) {
       const t = (offset - 0.57) / 0.05;
       x = GRID_X;
       y = THREE.MathUtils.lerp(GRID_Y, 0, easeInOutCubic(t));
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 12. Architecture detail [0.62 - 0.67] - Archi at (GRID_X, -GRID_Y)
    else if (offset < 0.67) {
       const t = (offset - 0.62) / 0.05;
       x = GRID_X;
       y = THREE.MathUtils.lerp(0, -GRID_Y, easeInOutCubic(t));
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 13. Timeline Experience [0.67 - 0.82]
    else if (offset < 0.82) {
       const t = Math.min((offset - 0.67) / 0.15, 1);
       const smoothT = easeInOutCubic(t);
       x = THREE.MathUtils.lerp(GRID_X, 0, smoothT);
       y = THREE.MathUtils.lerp(-GRID_Y, -12, smoothT);
       z = THREE.MathUtils.lerp(2.8, 8, easeOutCubic(t * 0.5)) + (1 - t) * 2;
       lookX = 0;
       lookY = THREE.MathUtils.lerp(-GRID_Y, -12, smoothT);
    }
    // 14. Portfolio [0.82 - 1.0]
    else {
       const t = Math.min((offset - 0.82) / 0.18, 1);
       const smoothT = easeInOutCubic(t);
       x = 0;
       y = THREE.MathUtils.lerp(-12, -24, smoothT);
       z = 8;
       lookX = 0;
       lookY = THREE.MathUtils.lerp(-12, -24, smoothT);
    }

    // Override camera position when in detail view (experience selected)
    // This creates a completely separate view - centered on the detail panel
    if (isInDetailView) {
       // Camera faces the detail view directly, centered
       x = 0;
       y = 0;
       z = 7; // Good distance to see the full detail
       lookX = 0;
       lookY = 0;
    }

    // Add subtle slight drift for life (only when not in detail view and not during forced navigation)
    if (!isInDetailView && forcedOffset.current === null) {
      const time = state.clock.getElapsedTime();
      x += Math.sin(time * 0.2) * 0.1;
      y += Math.cos(time * 0.3) * 0.1;
    }

    const targetPos = new THREE.Vector3(x, y, z);
    const lookAt = new THREE.Vector3(lookX, lookY, 0);

    // Skip interpolation during direct navigation - jump immediately
    if (forcedOffset.current !== null) {
      state.camera.position.copy(targetPos);
    } else {
      easing.damp3(state.camera.position, targetPos, 0.15, delta);
    }
    state.camera.lookAt(lookAt);
  });

  return null;
}

// Easing functions
function easeInCubic(x: number): number {
  return x * x * x;
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
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
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
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
      distance
    };
  }, []);

  // Create geometry for the line trail
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6); // 2 points x 3 coords
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
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
      const headPos = trajectory.start.clone().addScaledVector(trajectory.direction, progress);

      // Trail end position (behind the head)
      // Trail fades in at start, full length in middle, fades out at end
      let currentTrailLength = trailLength;
      if (t < 0.2) {
        currentTrailLength = trailLength * (t / 0.2); // Grow trail at start
      } else if (t > 0.7) {
        currentTrailLength = trailLength * (1 - (t - 0.7) / 0.3); // Shrink trail at end
      }

      const tailPos = headPos.clone().addScaledVector(trajectory.direction, -currentTrailLength);

      // Update line geometry
      const positions = lineRef.current.geometry.attributes.position.array as Float32Array;
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

      (lineRef.current.material as THREE.LineBasicMaterial).opacity = opacity * 0.9;
      lineRef.current.visible = true;
    } else {
      lineRef.current.visible = false;
    }
  });

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9 }))} ref={lineRef} />
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

    return { start: new THREE.Vector3(startX, startY, startZ), direction, distance };
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
      const headPos = trajectory.start.clone().addScaledVector(trajectory.direction, progress);

      // Update each trail point
      for (let i = 0; i < trailPointsCount; i++) {
        const mesh = trailRefs.current[i];
        if (!mesh) continue;

        const trailT = i / (trailPointsCount - 1); // 0 = head, 1 = tail
        let effectiveTrailLength = trailLength;

        // Grow/shrink trail
        if (t < 0.15) effectiveTrailLength *= t / 0.15;
        else if (t > 0.65) effectiveTrailLength *= (1 - (t - 0.65) / 0.35);

        const pointPos = headPos.clone().addScaledVector(
          trajectory.direction,
          -trailT * effectiveTrailLength
        );

        mesh.position.copy(pointPos);

        // Size decreases along trail (head is brightest)
        const baseSize = 0.015 + (1 - trailT) * 0.025;
        mesh.scale.setScalar(baseSize * (t < 0.1 ? t * 10 : t > 0.7 ? (1 - t) / 0.3 : 1));

        // Opacity decreases along trail
        const mat = mesh.material as THREE.MeshBasicMaterial;
        let opacity = (1 - trailT * 0.9); // Head=1, tail=0.1
        if (t < 0.1) opacity *= t * 10;
        else if (t > 0.6) opacity *= (1 - (t - 0.6) / 0.4);
        mat.opacity = opacity;
      }
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {Array.from({ length: trailPointsCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
        >
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
function Satellite({ radius, speed, offset, tilt }: { radius: number; speed: number; offset: number; tilt: number }) {
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
      (blinkRef.current.material as THREE.MeshBasicMaterial).opacity = blink ? 1 : 0.2;
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
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

function ScrollUpdater({ onSectionChange, targetSection }: { onSectionChange?: (s: number) => void; targetSection?: number | null }) {
    const scroll = useScroll();
    const lastSection = useRef(-1);
    const lastTargetSection = useRef<number | null>(null);

    useFrame(() => {
        // If we have a target section from navigation, use it directly
        if (targetSection !== null && targetSection !== undefined && targetSection !== lastTargetSection.current) {
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

        // Thresholds aligned with getSectionOffset and CameraRig timings
        // NEW 15-section layout

        let newSection = 0;

        if (offset < 0.05) newSection = 0;         // Intro
        else if (offset < 0.12) newSection = 1;    // FullStack Overview
        else if (offset < 0.17) newSection = 2;    // Frontend Slide
        else if (offset < 0.22) newSection = 3;    // Site Web
        else if (offset < 0.27) newSection = 4;    // Mobile
        else if (offset < 0.32) newSection = 5;    // Backoffice
        else if (offset < 0.37) newSection = 6;    // Backend Slide
        else if (offset < 0.42) newSection = 7;    // Server
        else if (offset < 0.47) newSection = 8;    // Database
        else if (offset < 0.52) newSection = 9;    // DevOps Slide
        else if (offset < 0.57) newSection = 10;   // CI/CD
        else if (offset < 0.62) newSection = 11;   // Cloud
        else if (offset < 0.67) newSection = 12;   // Architecture
        else if (offset < 0.82) newSection = 13;   // Timeline
        else newSection = 14;                       // Portfolio

        if (newSection !== lastSection.current) {
            lastSection.current = newSection;
            if (onSectionChange) onSectionChange(newSection);
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
}

export default function Experience({ onSectionChange, onExperienceSelect, selectedExperienceId, detailScrollOffset = 0, targetSection, onNavigationComplete }: ExperienceProps) {
  const selectedExperience = selectedExperienceId
    ? experienceData.find((e: ExperienceType) => e.id === selectedExperienceId) || null
    : null;

  return (
    <>
      {/* Gradient Background Sphere */}
      <Sphere args={[50, 64, 64]} scale={[-1, 1, 1]}>
        <meshBasicMaterial side={THREE.BackSide}>
          <GradientTexture
            stops={[0, 0.4, 0.7, 1]}
            colors={['#0a192f', '#0d2847', '#164e63', '#0891b2']}
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
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#00f0ff" />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} color="#06b6d4" />
      <directionalLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      <Environment preset="city" />

      <ScrollControls pages={18} damping={0.4}>
        <CameraRig
          selectedExperience={selectedExperience}
          detailScrollOffset={detailScrollOffset}
          targetSection={targetSection}
          onNavigationComplete={onNavigationComplete}
        />
        <ScrollUpdater onSectionChange={onSectionChange} targetSection={targetSection} />

        {/* Main content - hidden when in detail view */}
        {!selectedExperience && (
          <>
            <Float rotationIntensity={0.05} floatIntensity={0.1} speed={1}>
                <WebsiteBuilder />
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
