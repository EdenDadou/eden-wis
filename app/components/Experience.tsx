import { ScrollControls, useScroll, Float, Environment, GradientTexture, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { easing } from 'maath';
import WebsiteBuilder from './WebsiteBuilder';
import Timeline3D, { type Experience as ExperienceType, experienceData } from './Timeline3D';
import ExperienceDetail3D from './ExperienceDetail3D';
import '../styles/global.css';

interface CameraRigProps {
  selectedExperience: ExperienceType | null;
  detailScrollOffset: number;
}

function CameraRig({ selectedExperience, detailScrollOffset }: CameraRigProps) {
  const scroll = useScroll();
  const isInDetailView = selectedExperience !== null;

  useFrame((state, delta) => {
    const offset = scroll.offset;
    
    // === 8-STEP CAMERA SEQUENCE (User Request) ===
    // 1. Frontend (Bot Left)
    // 2. Backend (Mid Center)
    // 3. BDD (Top Center)
    // 4. Mobile (Bot Center)
    // 5. Backoffice (Bot Right)
    // 6. CI/CD (Mid Left)
    // 7. Cloud (Top Left)
    // 8. Testing (Mid Right)
    
    const GRID_X = 3.2;
    const GRID_Y = 2.5;
    
    let x = 0, y = 0, z = 5; // Default far
    let lookX = 0, lookY = 0;
    
    // Total phases = 8 + 1 (Overview) = 9 segments approx
    // Customized timings to give more space between elements
    
    // TIMING MAP (0.0 - 1.0)
    // 1. Frontend: 0.00 - 0.16 (Extended)
    // 2. Server:   0.16 - 0.27
    // 3. DB:       0.27 - 0.38
    // 4. Mobile:   0.38 - 0.49
    // 5. Back:     0.49 - 0.60
    // 6. CICD:     0.60 - 0.71
    // 7. Cloud:    0.71 - 0.82
    // 8. Test:     0.82 - 0.93
    // 9. Overview: 0.93 - 1.00

    const S1 = 0.16; // Frontend end
    const STEP = 0.11; // Standard step size for others
    
    // 1. Frontend (-3.2, -2.5) [0.0 - 0.16]
    if (offset < S1) {
       const t = offset / S1;
       // Start slightly zoomed out then move in
       x = THREE.MathUtils.lerp(0, -GRID_X, easeInOutCubic(t));
       y = THREE.MathUtils.lerp(0, -GRID_Y, easeInOutCubic(t));
       z = THREE.MathUtils.lerp(5, 2.8, easeOutCubic(t));
       lookX = x; lookY = y;
    }
    // 2. Backend (0, 0) [0.16 - 0.27]
    else if (offset < S1 + STEP) {
       const t = (offset - S1) / STEP;
       x = THREE.MathUtils.lerp(-GRID_X, 0, easeInOutCubic(t));
       y = THREE.MathUtils.lerp(-GRID_Y, 0, easeInOutCubic(t));
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 3. Database (0, 2.5) [0.27 - 0.38]
    else if (offset < S1 + STEP * 2) {
       const t = (offset - (S1 + STEP)) / STEP;
       x = 0;
       y = THREE.MathUtils.lerp(0, GRID_Y, easeInOutCubic(t));
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 4. Mobile (0, -2.5) [0.38 - 0.49] - BIG JUMP DOWN
    else if (offset < S1 + STEP * 3) {
       const t = (offset - (S1 + STEP * 2)) / STEP;
       // Zoom out in middle of jump
       if (t < 0.5) {
         z = THREE.MathUtils.lerp(2.8, 5, easeOutCubic(t * 2));
         y = THREE.MathUtils.lerp(GRID_Y, 0, t * 2);
       } else {
         z = THREE.MathUtils.lerp(5, 2.8, easeInCubic((t - 0.5) * 2));
         y = THREE.MathUtils.lerp(0, -GRID_Y, (t - 0.5) * 2);
       }
       x = 0;
       lookX = x; lookY = y;
    }
    // 5. Backoffice (3.2, -2.5) [0.49 - 0.60]
    else if (offset < S1 + STEP * 4) {
       const t = (offset - (S1 + STEP * 3)) / STEP;
       x = THREE.MathUtils.lerp(0, GRID_X, easeInOutCubic(t));
       y = -GRID_Y;
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 6. CI/CD (-3.2, 0) [0.60 - 0.71] - LONG DIAGONAL
    else if (offset < S1 + STEP * 5) {
       const t = (offset - (S1 + STEP * 4)) / STEP;
       x = THREE.MathUtils.lerp(GRID_X, -GRID_X, easeInOutCubic(t));
       y = THREE.MathUtils.lerp(-GRID_Y, 0, easeInOutCubic(t));
       z = THREE.MathUtils.lerp(2.8, 4, Math.sin(t * Math.PI)); // Arc out
       lookX = x; lookY = y;
    }
    // 7. Cloud (-3.2, 2.5) [0.71 - 0.82]
    else if (offset < S1 + STEP * 6) {
       const t = (offset - (S1 + STEP * 5)) / STEP;
       x = -GRID_X;
       y = THREE.MathUtils.lerp(0, GRID_Y, easeInOutCubic(t));
       z = 2.8;
       lookX = x; lookY = y;
    }
    // 8. Testing (3.2, 0) [0.82 - 0.93] - LONG DIAGONAL
    else if (offset < S1 + STEP * 7) {
       const t = (offset - (S1 + STEP * 6)) / STEP;
       x = THREE.MathUtils.lerp(-GRID_X, GRID_X, easeInOutCubic(t));
       y = THREE.MathUtils.lerp(GRID_Y, 0, easeInOutCubic(t));
       // Smooth arc that ends at 2.8 for seamless transition to overview
       z = 2.8 + Math.sin(t * Math.PI) * 1.2;
       lookX = x; lookY = y;
    }
    // 9. Overview [0.93 - 0.97] - Smooth dezoom to see full architecture
    else if (offset < 0.97) {
       const S_LAST = S1 + STEP * 7;
       const t = Math.min((offset - S_LAST) / (0.97 - S_LAST), 1);
       const smoothT = easeOutCubic(t);
       x = THREE.MathUtils.lerp(GRID_X, 0, smoothT);
       y = THREE.MathUtils.lerp(0, 0, smoothT);
       z = THREE.MathUtils.lerp(2.8, 9, smoothT);
       lookX = THREE.MathUtils.lerp(GRID_X, 0, smoothT);
       lookY = 0;
    }
    // 10. Timeline Experience [0.97 - 1.0] - Architecture rises up, camera descends to timeline
    else {
       const t = Math.min((offset - 0.97) / 0.03, 1);
       const smoothT = easeInOutCubic(t);
       x = 0;
       // Camera stays centered horizontally, moves down to face timeline
       y = THREE.MathUtils.lerp(0, -12, smoothT);
       // Zoom in closer to timeline for full-screen effect
       z = THREE.MathUtils.lerp(9, 8, smoothT);
       lookX = 0;
       lookY = THREE.MathUtils.lerp(0, -12, smoothT);
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

    // Add subtle slight drift for life (only when not in detail view)
    if (!isInDetailView) {
      const time = state.clock.getElapsedTime();
      x += Math.sin(time * 0.2) * 0.1;
      y += Math.cos(time * 0.3) * 0.1;
    }

    const targetPos = new THREE.Vector3(x, y, z);
    const lookAt = new THREE.Vector3(lookX, lookY, 0);

    easing.damp3(state.camera.position, targetPos, 0.15, delta);
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
            count={500}
            array={positions}
            itemSize={3}
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
            count={50}
            array={bigPositions}
            itemSize={3}
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
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.9}
        linewidth={1}
      />
    </line>
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
          count={200}
          array={positions}
          itemSize={3}
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

function ScrollUpdater({ onSectionChange }: { onSectionChange?: (s: number) => void }) {
    const scroll = useScroll();
    const lastSection = useRef(-1);

    useFrame(() => {
        const offset = scroll.offset;

        // Camera timings from CameraRig:
        // S1 = 0.16, STEP = 0.11
        // 1. Frontend: 0.00 - 0.16 (arrives at element ~0.12-0.14)
        // 2. Backend:  0.16 - 0.27 (arrives at element ~0.23-0.25)
        // 3. Database: 0.27 - 0.38 (arrives at element ~0.34-0.36)
        // 4. Mobile:   0.38 - 0.49 (arrives at element ~0.46-0.48)
        // 5. Backoffice: 0.49 - 0.60 (arrives at element ~0.56-0.58)
        // 6. CI/CD:    0.60 - 0.71 (arrives at element ~0.67-0.69)
        // 7. Cloud:    0.71 - 0.82 (arrives at element ~0.78-0.80)
        // 8. Testing:  0.82 - 0.93 (arrives at element ~0.89-0.91)
        // 9. Overview: 0.93 - 1.00

        // Text appears ONLY when camera has arrived on element
        // Show text at ~80% of transition, hide when next transition starts

        let newSection = 0;

        if (offset < 0.08) newSection = 0;         // Intro - camera still far
        else if (offset < 0.22) newSection = 1;    // Frontend - show after camera arrives (~0.12)
        else if (offset < 0.33) newSection = 2;    // Backend - show after camera arrives (~0.23)
        else if (offset < 0.44) newSection = 3;    // Database - show after camera arrives (~0.34)
        else if (offset < 0.55) newSection = 4;    // Mobile - show after camera arrives (~0.46)
        else if (offset < 0.66) newSection = 5;    // Backoffice - show after camera arrives (~0.56)
        else if (offset < 0.77) newSection = 6;    // CI/CD - show after camera arrives (~0.67)
        else if (offset < 0.88) newSection = 7;    // Cloud - show after camera arrives (~0.78)
        else if (offset < 0.94) newSection = 8;    // Testing - show after camera arrives (~0.89)
        else if (offset < 0.98) newSection = 9;    // Overview (dezoom)
        else newSection = 10;                       // Timeline Experience

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
}

export default function Experience({ onSectionChange, onExperienceSelect, selectedExperienceId, detailScrollOffset = 0 }: ExperienceProps) {
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

      <ScrollControls pages={15} damping={0.4}>
        <CameraRig
          selectedExperience={selectedExperience}
          detailScrollOffset={detailScrollOffset}
        />
        <ScrollUpdater onSectionChange={onSectionChange} />

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
