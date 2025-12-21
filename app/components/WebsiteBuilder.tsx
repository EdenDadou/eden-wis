import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Line, Billboard } from "@react-three/drei";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

// Particle Stream Component for animated connections (Bidirectional + Dual Colors)
function ParticleStream({
  start,
  end,
  startColor = "#ffffff",
  endColor = "#ffffff",
  speed = 0.5,
  count = 10,
  showParticles = true,
  opacity = 1,
}: {
  start: number[];
  end: number[];
  startColor?: string;
  endColor?: string;
  speed?: number;
  count?: number;
  showParticles?: boolean;
  opacity?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  const color1 = useMemo(() => new THREE.Color(startColor), [startColor]);
  const color2 = useMemo(() => new THREE.Color(endColor), [endColor]);

  // Random offsets and direction for each particle
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      offset: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      reverse: Math.random() > 0.5,
    }));
  }, [count]);

  useLayoutEffect(() => {
    const applyColors = (ref: React.RefObject<THREE.InstancedMesh | null>) => {
      if (!ref.current) return;
      particles.forEach((p, i) => {
        ref.current?.setColorAt(i, p.reverse ? color2 : color1);
      });
      ref.current.instanceColor!.needsUpdate = true;
    };

    if (showParticles) {
      applyColors(meshRef);
      applyColors(glowRef);
    }
  }, [particles, color1, color2, showParticles]);

  useFrame((state) => {
    if (!showParticles) return;

    // Update core particles
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        const direction = particle.reverse ? -1 : 1;
        const t =
          (state.clock.getElapsedTime() * speed * particle.speed * direction +
            particle.offset) %
          1;
        const normalizedT = t < 0 ? 1 + t : t;

        dummy.position.lerpVectors(startVec, endVec, normalizedT);
        const scale =
          0.8 + Math.sin(state.clock.getElapsedTime() * 5 + i) * 0.3;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update glow particles
    if (glowRef.current && meshRef.current) {
      particles.forEach((particle, i) => {
        const direction = particle.reverse ? -1 : 1;
        const t =
          (state.clock.getElapsedTime() * speed * particle.speed * direction +
            particle.offset) %
          1;
        const normalizedT = t < 0 ? 1 + t : t;

        dummy.position.lerpVectors(startVec, endVec, normalizedT);
        const scale =
          0.8 + Math.sin(state.clock.getElapsedTime() * 5 + i) * 0.3;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        glowRef.current?.setMatrixAt(i, dummy.matrix);
      });
      glowRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Base solid line - ALWAYS VISIBLE if component is rendered */}
      <Line
        points={[startVec, endVec]}
        color={undefined}
        vertexColors={[color1, color2]}
        opacity={0.15 * opacity}
        transparent
        lineWidth={2}
        dashed={false}
      />

      {/* Particles - CONDITIONALLY VISIBLE */}
      {showParticles && (
        <>
          {/* Outer Glow (Blur) */}
          <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial
              toneMapped={false}
              transparent
              opacity={0.15 * opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </instancedMesh>

          {/* Inner Core */}
          <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              toneMapped={false}
              transparent
              opacity={0.6 * opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </instancedMesh>
        </>
      )}
    </>
  );
}

interface WebsiteBuilderProps {
  currentSection?: number;
  onSkillClick?: (skillSection: number) => void;
}

export default function WebsiteBuilder({
  currentSection = 0,
  onSkillClick,
}: WebsiteBuilderProps) {
  const sceneRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // Track when we first enter section 1 (FullStack) for time-based animations
  const enteredSection1Time = useRef<number | null>(null);
  const hasTriggeredEntryAnimation = useRef(false);

  // Block refs
  const serverRef = useRef<THREE.Group>(null);
  const databaseRef = useRef<THREE.Group>(null);
  const backofficeRef = useRef<THREE.Group>(null);
  const archiRef = useRef<THREE.Group>(null); // Architecture (replaces testing)
  const cloudRef = useRef<THREE.Group>(null);
  const mobileRef = useRef<THREE.Group>(null);
  const frontendRef = useRef<THREE.Group>(null);
  const cicdRef = useRef<THREE.Group>(null);

  // Group box refs for the 3 category containers
  const frontendGroupRef = useRef<THREE.Group>(null);
  const backendGroupRef = useRef<THREE.Group>(null);
  const devopsGroupRef = useRef<THREE.Group>(null);

  // Material refs for direct opacity updates in useFrame
  const frontendBoxMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const backendBoxMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const devopsBoxMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const frontendLabelRef = useRef<any>(null);
  const backendLabelRef = useRef<any>(null);
  const devopsLabelRef = useRef<any>(null);

  // Category box opacity for fade-in effect
  const categoryBoxOpacity = useRef(0);

  // Skills container ref for dezoom offset
  const skillsContainerRef = useRef<THREE.Group>(null);

  // Server Blade Refs
  const bladeRefs = useRef<(THREE.Group | null)[]>([]);
  // Database Ring Refs
  const databaseRingRefs = useRef<(THREE.Mesh | null)[]>([]);

  const serverVisibleTime = useRef<number | null>(null);
  const databaseVisibleTime = useRef<number | null>(null);
  const mobileVisibleTime = useRef<number | null>(null);
  const backofficeVisibleTime = useRef<number | null>(null);
  const cicdVisibleTime = useRef<number | null>(null);
  const cloudVisibleTime = useRef<number | null>(null);
  const archiVisibleTime = useRef<number | null>(null);

  const serverLedIntensity = useRef(0);

  // Sub-element Refs
  const chatBubbleRefs = useRef<(THREE.Group | null)[]>([]);
  const chartRefs = useRef<(THREE.Line | THREE.Mesh | THREE.Group | null)[]>(
    []
  );
  const pipelineNodeRefs = useRef<(THREE.Group | null)[]>([]);
  const cloudNodeRefs = useRef<(THREE.Mesh | THREE.Group | null)[]>([]);
  const checklistRefs = useRef<(THREE.Group | null)[]>([]);

  // Frontend UI Block Refs for Fly-in animation
  const uiBlock1 = useRef<THREE.Group>(null);
  const uiBlock2 = useRef<THREE.Group>(null);
  const uiBlock3 = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sceneRef.current) return;
    const offset = scroll.offset;

    // ============ TIME-BASED ENTRY ANIMATION FOR SECTION 1 ============
    // Trigger entry animation when we reach section 1 (currentSection >= 1)
    // This makes elements fly in automatically, not tied to scroll position

    if (currentSection >= 1 && enteredSection1Time.current === null) {
      enteredSection1Time.current = state.clock.elapsedTime;
      hasTriggeredEntryAnimation.current = true;
    }

    // Reset if we go back to section 0
    if (currentSection === 0) {
      enteredSection1Time.current = null;
      hasTriggeredEntryAnimation.current = false;
      categoryBoxOpacity.current = 0;
    }

    // ============ CATEGORY BOX FADE-IN (same time as 3D elements) ============
    // Fade in category boxes at the same time as 3D elements
    if (enteredSection1Time.current !== null) {
      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      const fadeDelay = 0.3; // Same as initialDelay for 3D elements
      const fadeDuration = 0.6; // Faster fade to match element animations
      const fadeProgress = Math.max(
        0,
        Math.min((elapsed - fadeDelay) / fadeDuration, 1)
      );
      categoryBoxOpacity.current = easeOutCubic(fadeProgress);

      // Update material opacities directly (not via React props)
      const baseOpacity = categoryBoxOpacity.current;
      const isFrontendActive = currentSection >= 2 && currentSection <= 5;
      const isBackendActive = currentSection >= 6 && currentSection <= 8;
      const isDevopsActive = currentSection >= 9 && currentSection <= 12;

      // Check if we're in a detail section (not overview or group slides)
      const isInDetailSection =
        (currentSection >= 3 && currentSection <= 5) ||
        (currentSection >= 7 && currentSection <= 8) ||
        (currentSection >= 10 && currentSection <= 12);

      // Dimmed opacity for non-active categories when in detail view
      const dimmedOpacity = 0.08;

      if (frontendBoxMatRef.current) {
        const activeOpacity = isFrontendActive ? 0.35 : 0.15;
        const finalOpacity =
          isInDetailSection && !isFrontendActive
            ? dimmedOpacity
            : activeOpacity;
        frontendBoxMatRef.current.opacity = finalOpacity * baseOpacity;
      }
      if (backendBoxMatRef.current) {
        const activeOpacity = isBackendActive ? 0.35 : 0.15;
        const finalOpacity =
          isInDetailSection && !isBackendActive ? dimmedOpacity : activeOpacity;
        backendBoxMatRef.current.opacity = finalOpacity * baseOpacity;
      }
      if (devopsBoxMatRef.current) {
        const activeOpacity = isDevopsActive ? 0.35 : 0.15;
        const finalOpacity =
          isInDetailSection && !isDevopsActive ? dimmedOpacity : activeOpacity;
        devopsBoxMatRef.current.opacity = finalOpacity * baseOpacity;
      }
      // Update label opacities - dim non-active categories in detail view
      if (frontendLabelRef.current) {
        const labelOpacity = isInDetailSection && !isFrontendActive ? 0.3 : 1;
        frontendLabelRef.current.fillOpacity = labelOpacity * baseOpacity;
      }
      if (backendLabelRef.current) {
        const labelOpacity = isInDetailSection && !isBackendActive ? 0.3 : 1;
        backendLabelRef.current.fillOpacity = labelOpacity * baseOpacity;
      }
      if (devopsLabelRef.current) {
        const labelOpacity = isInDetailSection && !isDevopsActive ? 0.3 : 1;
        devopsLabelRef.current.fillOpacity = labelOpacity * baseOpacity;
      }
    }

    // Time-based animation helper for entry animations
    const animateElementByTime = (
      ref: React.RefObject<THREE.Group | null>,
      delaySeconds: number,
      durationSeconds: number = 0.6,
      fromZ: number = 4,
      fromX: number = 0 // Allow lateral entry
    ) => {
      if (!ref.current || enteredSection1Time.current === null) {
        // Keep hidden until triggered
        if (ref.current) {
          ref.current.scale.setScalar(0);
        }
        return;
      }

      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      const progress = Math.max(
        0,
        Math.min((elapsed - delaySeconds) / durationSeconds, 1)
      );
      const eased = easeOutCubic(progress);

      // Animate from starting position to final position
      ref.current.position.z = THREE.MathUtils.lerp(fromZ, 0, eased);
      if (fromX !== 0) {
        // For lateral animations, we need to track original position
        const originalX =
          ref.current.userData.originalX ?? ref.current.position.x;
        ref.current.userData.originalX = originalX;
        ref.current.position.x = THREE.MathUtils.lerp(
          originalX + fromX,
          originalX,
          eased
        );
      }
      ref.current.scale.setScalar(eased);
    };

    // Helper for Fly In animation (time-based)
    const flyInByTime = (
      ref: React.RefObject<THREE.Group | null>,
      delaySeconds: number,
      durationSeconds: number = 0.4,
      distance: number = 2
    ) => {
      if (!ref.current || enteredSection1Time.current === null) return;

      const elapsed = state.clock.elapsedTime - enteredSection1Time.current;
      const progress = Math.max(
        0,
        Math.min((elapsed - delaySeconds) / durationSeconds, 1)
      );
      const eased = easeOutCubic(progress);

      ref.current.position.z = THREE.MathUtils.lerp(distance, 0.02, eased);
      ref.current.scale.setScalar(eased);
    };

    // ============ STAGGERED ENTRY ANIMATIONS ============
    // All elements animate in when entering section 1
    // Staggered delays for a cascading effect
    // Added initial delay (0.3s) to let camera settle after Hero transition

    const initialDelay = 0.3; // Let camera transition settle first

    // Frontend group (LEFT column) - enters from left
    animateElementByTime(frontendRef, initialDelay + 0.0, 0.8, 4, -3);
    animateElementByTime(mobileRef, initialDelay + 0.12, 0.8, 4, -3);
    animateElementByTime(backofficeRef, initialDelay + 0.24, 0.8, 4, -3);

    // Backend group (CENTER) - enters from front
    animateElementByTime(serverRef, initialDelay + 0.08, 0.9, 5);
    animateElementByTime(databaseRef, initialDelay + 0.2, 0.8, 5);

    // DevOps group (RIGHT column) - enters from right
    animateElementByTime(cicdRef, initialDelay + 0.16, 0.8, 4, 3);
    animateElementByTime(cloudRef, initialDelay + 0.28, 0.8, 4, 3);
    animateElementByTime(archiRef, initialDelay + 0.4, 0.8, 4, 3);

    // Frontend UI blocks fly-in (after main element appears)
    flyInByTime(uiBlock1, initialDelay + 0.5, 0.5, 1.5);
    flyInByTime(uiBlock2, initialDelay + 0.6, 0.5, 2.0);
    flyInByTime(uiBlock3, initialDelay + 0.7, 0.5, 2.5);

    // Server Blades Animation (Time-based, triggered when entering section 1)
    // Use currentSection instead of scroll offset
    if (currentSection >= 1 && serverVisibleTime.current === null) {
      serverVisibleTime.current = state.clock.elapsedTime;
    }
    // Reset if back to section 0
    if (currentSection === 0) {
      serverVisibleTime.current = null;
    }

    // Database Rings Animation (Time-based)
    if (currentSection >= 1 && databaseVisibleTime.current === null) {
      databaseVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      databaseVisibleTime.current = null;
    }

    if (serverVisibleTime.current !== null) {
      // Global pulsing for server LEDs
      serverLedIntensity.current =
        1 + Math.sin(state.clock.elapsedTime * 8) * 0.5;

      bladeRefs.current.forEach((blade, i) => {
        if (!blade) return;

        // Animation params
        const now = state.clock.elapsedTime;
        const startTime = serverVisibleTime.current!;
        const delay = i * 0.15; // Stagger per blade
        const duration = 0.6; // Duration of slide-in

        // Calculate progress
        const timeProgress = Math.max(
          0,
          Math.min((now - startTime - delay) / duration, 1)
        );
        const eased = easeOutCubic(timeProgress);

        // Target positions
        const y = 0.55 - i * 0.155;
        const zStart = 2.5; // Reduced from 5 for more grounded "pop"
        const zEnd = 0.255;

        // Apply Position & Scale
        blade.position.set(0, y, THREE.MathUtils.lerp(zStart, zEnd, eased));
        blade.scale.setScalar(eased);

        // Apply LED Intensity to children (assuming structure is consistent)
        // Traverse is safe here as it's shallow
        blade.traverse((child) => {
          if (
            (child as any).isMesh &&
            (child as any).material &&
            (child as any).material.color
          ) {
            // Check if it's one of our LEDs (by color check approx)
            const m = (child as any).material;
            // Green LEDs
            if (m.name === "led_green") {
              m.color.setHSL(0.33, 1, 0.5 * serverLedIntensity.current);
            }
          }
        });
      });
    }

    // Database Rings Animation
    if (databaseVisibleTime.current !== null) {
      databaseRingRefs.current.forEach((ring, i) => {
        if (!ring) return;
        const now = state.clock.elapsedTime;
        const startTime = databaseVisibleTime.current!;
        const delay = i * 0.2; // Stagger rings top to bottom or vice versa

        // 1. Scale Up Animation + Fly In (Like App Web)
        const timeProgress = Math.max(
          0,
          Math.min((now - startTime - delay) / 0.5, 1)
        );
        const eased = easeOutCubic(timeProgress);

        ring.scale.setScalar(eased);

        // Fly In from Z+ (Front)
        const zStart = 2;
        const zEnd = 0;
        ring.position.z = THREE.MathUtils.lerp(zStart, zEnd, eased);

        // 2. Pulse Intensity
        if (timeProgress >= 1) {
          // Pulse based on index
          const pulse = 1 + Math.sin(now * 3 + i) * 0.5;
          if ((ring.material as THREE.MeshStandardMaterial).emissive) {
            (ring.material as THREE.MeshStandardMaterial).emissiveIntensity =
              2 * pulse;
          }
        }
      });
    }

    // --- MOBILE ANIMATION (Bubbles Fly-In) ---
    if (currentSection >= 1 && mobileVisibleTime.current === null) {
      mobileVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      mobileVisibleTime.current = null;
    }
    if (mobileVisibleTime.current !== null) {
      chatBubbleRefs.current.forEach((bubble, i) => {
        if (!bubble) return;
        const now = state.clock.elapsedTime;
        const startTime = mobileVisibleTime.current!;
        const delay = i * 0.15;
        const timeProgress = Math.max(
          0,
          Math.min((now - startTime - delay) / 0.5, 1)
        );
        const eased = easeOutCubic(timeProgress);

        bubble.scale.setScalar(eased);
        bubble.position.z = THREE.MathUtils.lerp(2, 0, eased);
      });
    }

    // --- BACKOFFICE ANIMATION (Charts Grow) ---
    if (currentSection >= 1 && backofficeVisibleTime.current === null) {
      backofficeVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      backofficeVisibleTime.current = null;
    }
    if (backofficeVisibleTime.current !== null) {
      chartRefs.current.forEach((chart, i) => {
        if (!chart) return;
        const now = state.clock.elapsedTime;
        const startTime = backofficeVisibleTime.current!;
        const delay = i * 0.15;
        const timeProgress = Math.max(
          0,
          Math.min((now - startTime - delay) / 0.6, 1)
        );
        const eased = easeOutCubic(timeProgress);

        // Scale up + Fly In
        chart.scale.setScalar(eased);
        chart.position.z = THREE.MathUtils.lerp(2, 0, eased);
        // Spin/draw effect for charts could be tricky with generic mesh target, scale is safest
      });
    }

    // --- CI/CD ANIMATION (Pipeline Nodes Sequence) ---
    if (currentSection >= 1 && cicdVisibleTime.current === null) {
      cicdVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      cicdVisibleTime.current = null;
    }
    if (cicdVisibleTime.current !== null) {
      pipelineNodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const now = state.clock.elapsedTime;
        const startTime = cicdVisibleTime.current!;
        const delay = i * 0.2; // Distinct sequential pop
        const timeProgress = Math.max(
          0,
          Math.min((now - startTime - delay) / 0.4, 1)
        );
        const eased = easeOutCubic(timeProgress);

        node.scale.setScalar(eased * 0.5); // restore to original scale (was 0.5 in map) or 1?
        // In original JSX: scale={0.5} on container? No, nodes are group
        // Actually nodes are inside a map, let's assume they scale to 1 relative to parent
        node.scale.setScalar(THREE.MathUtils.lerp(0, 1, eased));
        node.position.z = THREE.MathUtils.lerp(2, 0, eased);
      });
    }

    // --- CLOUD ANIMATION (Nodes Fly & Float) ---
    if (currentSection >= 1 && cloudVisibleTime.current === null) {
      cloudVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      cloudVisibleTime.current = null;
    }
    if (cloudVisibleTime.current !== null) {
      cloudNodeRefs.current.forEach((node, i) => {
        if (!node) return;
        const now = state.clock.elapsedTime;
        const startTime = cloudVisibleTime.current!;
        const delay = i * 0.1;
        const timeProgress = Math.max(
          0,
          Math.min((now - startTime - delay) / 0.6, 1)
        );
        const eased = easeOutCubic(timeProgress);

        // Fly In
        const zStart = 2;
        const zEnd = 0;
        const currentZ = THREE.MathUtils.lerp(zStart, zEnd, eased);

        // Float (looping)
        const float = Math.sin(now * 2 + i) * 0.05;

        // Reconstruct position (original positions: 0,1,2 => sin/cos logic)
        // Original: [Math.sin(i * 2) * 0.5, Math.cos(i * 2) * 0.4, 0]
        const baseX = Math.sin(i * 2) * 0.5;
        const baseY = Math.cos(i * 2) * 0.4;

        node.position.set(baseX, baseY + float, currentZ);
        node.scale.setScalar(0.5 * eased); // Original scale was 0.5
      });
    }

    // --- ARCHITECTURE ANIMATION (Items Tick) ---
    if (currentSection >= 1 && archiVisibleTime.current === null) {
      archiVisibleTime.current = state.clock.elapsedTime;
    }
    if (currentSection === 0) {
      archiVisibleTime.current = null;
    }
    if (archiVisibleTime.current !== null) {
      checklistRefs.current.forEach((item, i) => {
        if (!item) return;
        const now = state.clock.elapsedTime;
        const startTime = archiVisibleTime.current!;
        const delay = i * 0.2;
        const timeProgress = Math.max(
          0,
          Math.min((now - startTime - delay) / 0.4, 1)
        );
        const eased = easeOutCubic(timeProgress);

        item.scale.setScalar(eased);
        // Fly in from right? or just Z? Z for consistency
        item.position.z = THREE.MathUtils.lerp(2, 0.03, eased); // 0.03 was original z
      });
    }

    // --- DEZOOM LAYOUT SHIFT (Skills further right) ---
    const DEZOOM_START = 0.93;
    const DEZOOM_END = 0.97;
    const BASE_X_OFFSET = 3; // Base position (offset right so content appears on right of screen)
    if (offset > DEZOOM_START) {
      const dezoomProgress = Math.min(
        (offset - DEZOOM_START) / (DEZOOM_END - DEZOOM_START),
        1
      );
      const easedDezoom = easeOutCubic(dezoomProgress);

      // Shift skills container further right during dezoom
      if (skillsContainerRef.current) {
        skillsContainerRef.current.position.x = THREE.MathUtils.lerp(
          BASE_X_OFFSET,
          BASE_X_OFFSET + 3,
          easedDezoom
        );
      }
    } else {
      // Reset to base position when not in dezoom
      if (skillsContainerRef.current) {
        skillsContainerRef.current.position.x = BASE_X_OFFSET;
      }
    }

    // --- ELEMENT DIMMING IN DETAIL VIEW ---
    // When in a detail section (3-5, 7-8, 10-12), dim non-selected elements
    const isDetailView =
      (currentSection >= 3 && currentSection <= 5) ||
      (currentSection >= 7 && currentSection <= 8) ||
      (currentSection >= 10 && currentSection <= 12);

    // Map of section to ref
    const skillRefs = [
      { section: 3, ref: frontendRef },
      { section: 4, ref: mobileRef },
      { section: 5, ref: backofficeRef },
      { section: 7, ref: serverRef },
      { section: 8, ref: databaseRef },
      { section: 10, ref: cicdRef },
      { section: 11, ref: cloudRef },
      { section: 12, ref: archiRef },
    ];

    skillRefs.forEach(({ section, ref }) => {
      if (!ref.current) return;

      const isSelected = currentSection === section;
      const targetOpacity = isDetailView ? (isSelected ? 1 : 0.1) : 1;

      // Initialize or update smooth opacity
      if (ref.current.userData._smoothOp === undefined) {
        ref.current.userData._smoothOp = 1;
      }
      ref.current.userData._smoothOp = THREE.MathUtils.lerp(
        ref.current.userData._smoothOp,
        targetOpacity,
        0.1
      );

      const finalOp = ref.current.userData._smoothOp;

      // Apply opacity to the entire group by setting visible or modifying materials
      ref.current.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          materials.forEach((mat) => {
            // Cast to any to access opacity
            const m = mat as THREE.MeshStandardMaterial;
            if (m) {
              // Store original values
              if ((m as any).__baseOpacity === undefined) {
                (m as any).__baseOpacity =
                  m.opacity !== undefined ? m.opacity : 1;
                (m as any).__wasTransparent = m.transparent;
              }
              m.opacity = (m as any).__baseOpacity * finalOp;
              m.transparent = true;
              m.needsUpdate = true;
            }
          });
        }
      });
    });
  });

  const offset = scroll?.offset || 0;

  // Visibility thresholds - All elements appear from section 1 (FullStack) onwards
  // Use currentSection instead of offset to ensure elements are visible when animations trigger
  const showElements = currentSection >= 1;
  const showFrontend = showElements;
  const showMobile = showElements;
  const showBackoffice = showElements;
  const showServer = showElements;
  const showDatabase = showElements;
  const showCICD = showElements;
  const showCloud = showElements;
  const showArchi = showElements;

  // Category boxes also only show from FullStack overview onwards
  const showCategoryBoxes = currentSection >= 1;

  // ... rest of layout constants ...

  // ═══════════════════════════════════════════════════════════
  // NEW GRID LAYOUT - Organized by Category
  //
  // FRONTEND (LEFT)    BACKEND (CENTER)    DEVOPS (RIGHT)
  // ─────────────────────────────────────────────────────────
  // Row 1 (Top):    SITE WEB         SERVER           CI/CD
  // Row 2 (Mid):    MOBILE           DATABASE         CLOUD
  // Row 3 (Bot):    BACKOFFICE       (empty)          ARCHITECTURE
  //
  // ═══════════════════════════════════════════════════════════

  const GRID_X = 3.2;
  const GRID_Y = 2.5;

  // FRONTEND GROUP (LEFT column, x = -GRID_X)
  const POS_FRONTEND = [-GRID_X, GRID_Y, 0] as [number, number, number]; // Site Web (top)
  const POS_MOBILE = [-GRID_X, 0, 0] as [number, number, number]; // Mobile (middle)
  const POS_BACKOFFICE = [-GRID_X, -GRID_Y, 0] as [number, number, number]; // Backoffice (bottom)

  // BACKEND GROUP (CENTER column, x = 0) - Only 2 elements, centered vertically
  const POS_SERVER = [0, GRID_Y * 0.5, 0] as [number, number, number]; // Server (top)
  const POS_DATABASE = [0, -GRID_Y * 0.5, 0] as [number, number, number]; // Database (bottom)

  // DEVOPS GROUP (RIGHT column, x = GRID_X)
  const POS_CICD = [GRID_X, GRID_Y, 0] as [number, number, number]; // CI/CD (top)
  const POS_CLOUD = [GRID_X, 0, 0] as [number, number, number]; // Cloud (middle)
  const POS_ARCHI = [GRID_X, -GRID_Y, 0] as [number, number, number]; // Architecture (bottom)

  // Connection Points (Z=0 for drawing logic)
  // FRONTEND GROUP
  const P_FRONT = [-GRID_X, GRID_Y, 0];
  const P_MOBILE = [-GRID_X, 0, 0];
  const P_BACK = [-GRID_X, -GRID_Y, 0];
  // BACKEND GROUP
  const P_SERVER = [0, GRID_Y * 0.5, 0];
  const P_DB = [0, -GRID_Y * 0.5, 0];
  // DEVOPS GROUP
  const P_CICD = [GRID_X, GRID_Y, 0];
  const P_CLOUD = [GRID_X, 0, 0];
  const P_ARCHI = [GRID_X, -GRID_Y, 0];

  // Colors
  const C_FRONT = "#3b82f6"; // Blue (Frontend)
  const C_MOBILE = "#8b5cf6"; // Purple (Mobile)
  const C_BACK = "#ffaa00"; // Gold/Orange (Backoffice)
  const C_SERVER = "#10b981"; // Green (Node)
  const C_DB = "#ef4444"; // Red (Database)
  const C_CICD = "#ff6600"; // Orange (CI/CD)
  const C_CLOUD = "#1e3a5f"; // Dark Blue (Cloud)
  const C_ARCHI = "#06b6d4"; // Cyan (Architecture) - replaces Testing

  // Group colors for category boxes
  const C_GROUP_FRONTEND = "#3b82f6"; // Blue
  const C_GROUP_BACKEND = "#10b981"; // Green
  const C_GROUP_DEVOPS = "#ff6600"; // Orange

  // Highlight colors (brighter versions for active sections)
  const C_HIGHLIGHT = "#ffffff";
  const C_GLOW_FRONTEND = "#60a5fa";
  const C_GLOW_BACKEND = "#34d399";
  const C_GLOW_DEVOPS = "#ff8c00";

  // Section to element mapping:
  // Section 3: Site Web (Frontend), Section 4: Mobile, Section 5: Backoffice
  // Section 7: Server (Backend), Section 8: Database
  // Section 10: CI/CD (DevOps), Section 11: Cloud, Section 12: Architecture

  // Determine which group is active based on currentSection
  // Sections 2-5: Frontend, Sections 6-8: Backend, Sections 9-12: DevOps
  const isFrontendGroupActive = currentSection >= 2 && currentSection <= 5;
  const isBackendGroupActive = currentSection >= 6 && currentSection <= 8;
  const isDevopsGroupActive = currentSection >= 9 && currentSection <= 12;

  // Determine which specific element is active
  const isElementActive = (elementSection: number) =>
    currentSection === elementSection;

  // Check if we're in a detail section (not overview or group slides)
  const isInDetailSection =
    (currentSection >= 3 && currentSection <= 5) ||
    (currentSection >= 7 && currentSection <= 8) ||
    (currentSection >= 10 && currentSection <= 12);

  // Get element label color with highlight
  const getElementLabelColor = (elementSection: number, baseColor: string) => {
    if (!isInDetailSection) {
      return isElementActive(elementSection) ? C_HIGHLIGHT : baseColor;
    }
    // In detail section: bright for active, very dim for others
    return isElementActive(elementSection) ? C_HIGHLIGHT : "#444444";
  };

  // Get element opacity - full for selected, dimmed for others in detail view
  const getElementOpacity = (elementSection: number) => {
    if (!isInDetailSection) return 1;
    return currentSection === elementSection ? 1 : 0.15;
  };

  // Opacity Calculation Helper
  const getLinkOpacity = (threshold: number) => {
    // Fade in over 0.05 units after the threshold
    return Math.max(0, Math.min((offset - threshold) / 0.05, 1));
  };

  // NEW TIMING MAP for 13 sections (0-12):
  // 0: Intro (Eden Wisniewski)
  // 1: FullStack Overview (all visible)
  // 2: Frontend slide (zoom to frontend group)
  // 3: Site Web detail
  // 4: App Mobile detail
  // 5: Backoffice detail
  // 6: Backend slide (zoom to backend group)
  // 7: Server detail
  // 8: Database detail
  // 9: DevOps slide (zoom to devops group)
  // 10: CI/CD detail
  // 11: Cloud detail
  // 12: Architecture detail

  // Element appearance thresholds (all appear early for overview)
  const T_FRONT = 0.15; // Frontend group
  const T_MOBILE = 0.22;
  const T_BACK = 0.29;
  const T_SERVER = 0.4; // Backend group
  const T_DB = 0.48;
  const T_CICD = 0.58; // DevOps group
  const T_CLOUD = 0.66;
  const T_ARCHI = 0.74;

  // 20 degrees in radians = 0.349
  const FACE_CAMERA_ROTATION = -0.1; // Rotation towards camera (positive Y = turn right towards viewer)

  return (
    <group ref={sceneRef}>
      {/* ========== SKILLS CONTAINER (offset right so content appears on right of screen) ========== */}
      {/* Rotated slightly towards camera to compensate for off-center view */}
      <group
        ref={skillsContainerRef}
        position={[3, 0, 0]}
        rotation={[0, FACE_CAMERA_ROTATION, 0]}
      >
        {/* ========== CATEGORY BOXES (Frontend / Backend / DevOps) ========== */}

        {/* FRONTEND Group Box - LEFT column (Site Web, Mobile, Backoffice) */}
        {showCategoryBoxes && (
          <group ref={frontendGroupRef} position={[-GRID_X, 0, -0.5]}>
            {/* Vertical rectangle encompassing the 3 frontend elements - larger size */}
            <RoundedBox
              args={[2.8, 8.5, 0.02]}
              radius={0.1}
              position={[0, 0, 0]}
            >
              <meshBasicMaterial
                ref={frontendBoxMatRef}
                color={
                  isFrontendGroupActive ? C_GLOW_FRONTEND : C_GROUP_FRONTEND
                }
                transparent
                opacity={0}
                depthWrite={false}
              />
            </RoundedBox>
            {/* Category Label - Positioned higher to avoid overlap */}
            <Text
              ref={frontendLabelRef}
              position={[0, GRID_Y + 1.8, 0.1]}
              fontSize={isFrontendGroupActive ? 0.4 : 0.35}
              color={isFrontendGroupActive ? "#ffffff" : "#60a5fa"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#3b82f6"
              fillOpacity={0}
            >
              FRONTEND
            </Text>
          </group>
        )}

        {/* BACKEND Group Box - CENTER column (Server, Database) */}
        {showCategoryBoxes && (
          <group ref={backendGroupRef} position={[0, 0, -0.5]}>
            {/* Vertical rectangle encompassing Server and Database - larger size */}
            <RoundedBox
              args={[2.8, 5.5, 0.02]}
              radius={0.1}
              position={[0, 0, 0]}
            >
              <meshBasicMaterial
                ref={backendBoxMatRef}
                color={isBackendGroupActive ? C_GLOW_BACKEND : C_GROUP_BACKEND}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </RoundedBox>
            {/* Category Label - Positioned higher to avoid overlap */}
            <Text
              ref={backendLabelRef}
              position={[0, GRID_Y * 0.5 + 1.5, 0.1]}
              fontSize={isBackendGroupActive ? 0.4 : 0.35}
              color={isBackendGroupActive ? "#ffffff" : "#34d399"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#10b981"
              fillOpacity={0}
            >
              BACKEND
            </Text>
          </group>
        )}

        {/* DEVOPS Group Box - RIGHT column (CI/CD, Cloud, Architecture) */}
        {showCategoryBoxes && (
          <group ref={devopsGroupRef} position={[GRID_X, 0, -0.5]}>
            {/* Vertical rectangle encompassing the 3 devops elements - larger size */}
            <RoundedBox
              args={[2.8, 8.5, 0.02]}
              radius={0.1}
              position={[0, 0, 0]}
            >
              <meshBasicMaterial
                ref={devopsBoxMatRef}
                color={isDevopsGroupActive ? C_GLOW_DEVOPS : C_GROUP_DEVOPS}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </RoundedBox>
            {/* Category Label - Positioned higher to avoid overlap */}
            <Text
              ref={devopsLabelRef}
              position={[0, GRID_Y + 1.8, 0.1]}
              fontSize={isDevopsGroupActive ? 0.4 : 0.35}
              color={isDevopsGroupActive ? "#ffffff" : "#ff8c00"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#ff6600"
              fillOpacity={0}
            >
              DEVOPS
            </Text>
          </group>
        )}

        {/* ========== TOP ROW ========== */}

        {/* CLOUD (-3.2, 2.5) - Section 11 */}
        {showCloud && (
          <group
            ref={cloudRef}
            position={POS_CLOUD}
            scale={0}
            onClick={() => onSkillClick?.(11)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Text
              position={[0, 0.85, 0]}
              fontSize={isElementActive(11) ? 0.11 : 0.09}
              color={getElementLabelColor(11, "#4a90d9")}
              anchorX="center"
              outlineWidth={isElementActive(11) ? 0.015 : 0}
              outlineColor="#4a90d9"
            >
              CLOUD
            </Text>
            <Text
              position={[0, 0.73, 0]}
              fontSize={0.04}
              color={isElementActive(11) ? "#aaa" : "#666"}
              anchorX="center"
            >
              AWS / Infrastructure
            </Text>

            {/* Main Container - Dark blue server rack style - Aligned size */}
            <RoundedBox args={[1.8, 1.3, 0.1]} radius={0.04} smoothness={4}>
              <meshStandardMaterial
                color="#0a1628"
                metalness={0.8}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Blue border glow */}
            <mesh position={[0, 0, -0.03]}>
              <planeGeometry args={[1.85, 1.35]} />
              <meshBasicMaterial color="#1e3a5f" transparent opacity={0.2} />
            </mesh>

            {/* Header bar */}
            <RoundedBox
              args={[1.6, 0.1, 0.02]}
              radius={0.02}
              position={[0, 0.48, 0.06]}
            >
              <meshStandardMaterial
                color="#1e3a5f"
                emissive="#2563eb"
                emissiveIntensity={0.3}
              />
            </RoundedBox>

            {/* Large Cloud Icon - floating above the container */}
            <group position={[0.5, 0.15, 0.15]} scale={0.35}>
              <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial
                  color="#4a90d9"
                  emissive="#2563eb"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              <mesh position={[-0.3, 0, 0]}>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial
                  color="#4a90d9"
                  emissive="#2563eb"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              <mesh position={[0.3, 0, 0]}>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial
                  color="#4a90d9"
                  emissive="#2563eb"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              <mesh position={[0, -0.08, 0]}>
                <sphereGeometry args={[0.22, 32, 32]} />
                <meshStandardMaterial
                  color="#4a90d9"
                  emissive="#2563eb"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              <mesh position={[-0.15, 0.05, 0]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial
                  color="#4a90d9"
                  emissive="#2563eb"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              <mesh position={[0.15, 0.05, 0]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial
                  color="#4a90d9"
                  emissive="#2563eb"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            </group>

            <Text
              position={[-0.6, 0.48, 0.08]}
              fontSize={0.04}
              color="#4a90d9"
              anchorX="left"
            >
              Cloud Services
            </Text>

            {/* Cloud Infrastructure Visualization */}
            <group position={[0, 0, 0.06]}>
              {/* Region/Availability Zone boxes */}
              <group position={[-0.45, 0.1, 0]}>
                <RoundedBox args={[0.4, 0.35, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#0f2744" />
                </RoundedBox>
                <Text
                  position={[0, 0.12, 0.02]}
                  fontSize={0.025}
                  color="#4a90d9"
                  anchorX="center"
                >
                  Region EU
                </Text>
                {/* Server icons */}
                {[-0.1, 0.1].map((x, i) => (
                  <group
                    key={i}
                    position={[x, -0.02, 0.02]}
                    ref={(el) => (cloudNodeRefs.current[i] = el)}
                    scale={0}
                  >
                    <RoundedBox args={[0.12, 0.15, 0.01]} radius={0.01}>
                      <meshStandardMaterial color="#1e3a5f" />
                    </RoundedBox>
                    {/* Server LEDs */}
                    <mesh position={[0.04, 0.05, 0.01]}>
                      <circleGeometry args={[0.012, 8]} />
                      <meshBasicMaterial color="#22c55e" />
                    </mesh>
                    <mesh position={[0.04, 0.02, 0.01]}>
                      <circleGeometry args={[0.012, 8]} />
                      <meshBasicMaterial color="#22c55e" />
                    </mesh>
                    {/* Server lines */}
                    {[-0.02, -0.04].map((y, j) => (
                      <mesh key={j} position={[-0.01, y, 0.01]}>
                        <planeGeometry args={[0.08, 0.008]} />
                        <meshBasicMaterial color="#2563eb" />
                      </mesh>
                    ))}
                  </group>
                ))}
              </group>

              {/* CDN / Edge nodes */}
              <group position={[0.45, 0.1, 0]}>
                <RoundedBox args={[0.4, 0.35, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#0f2744" />
                </RoundedBox>
                <Text
                  position={[0, 0.12, 0.02]}
                  fontSize={0.025}
                  color="#4a90d9"
                  anchorX="center"
                >
                  CDN Edge
                </Text>
                {/* Globe/network icon */}
                <group
                  position={[0, -0.02, 0.02]}
                  ref={(el) => (cloudNodeRefs.current[2] = el)}
                  scale={0}
                >
                  <mesh>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#1e3a5f" wireframe />
                  </mesh>
                  <mesh>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial
                      color="#2563eb"
                      emissive="#2563eb"
                      emissiveIntensity={0.5}
                    />
                  </mesh>
                  {/* Orbit rings */}
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.1, 0.005, 8, 32]} />
                    <meshBasicMaterial color="#4a90d9" />
                  </mesh>
                  <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
                    <torusGeometry args={[0.1, 0.005, 8, 32]} />
                    <meshBasicMaterial color="#4a90d9" />
                  </mesh>
                </group>
              </group>

              {/* Storage / Database row */}
              <group position={[0, -0.22, 0]}>
                <RoundedBox args={[1.3, 0.2, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#0f2744" />
                </RoundedBox>
                <Text
                  position={[-0.55, 0, 0.02]}
                  fontSize={0.025}
                  color="#4a90d9"
                  anchorX="left"
                >
                  Storage
                </Text>
                {/* Storage bars */}
                {[0, 0.2, 0.4].map((x, i) => (
                  <group key={i} position={[x - 0.1, 0, 0.02]}>
                    <RoundedBox args={[0.15, 0.08, 0.01]} radius={0.005}>
                      <meshBasicMaterial color="#1e3a5f" />
                    </RoundedBox>
                    {/* Usage indicator */}
                    <mesh position={[-0.04 + 0.04 * (i + 1) * 0.3, 0, 0.01]}>
                      <planeGeometry args={[0.08 * (0.3 + i * 0.25), 0.04]} />
                      <meshBasicMaterial
                        color={i === 2 ? "#f59e0b" : "#22c55e"}
                      />
                    </mesh>
                  </group>
                ))}
                {/* Metrics */}
                <Text
                  position={[0.55, 0, 0.02]}
                  fontSize={0.02}
                  color="#22c55e"
                  anchorX="right"
                >
                  99.9% uptime
                </Text>
              </group>
            </group>

            {/* Ambient blue glow */}
            <pointLight
              position={[0, 0, 0.5]}
              intensity={0.6}
              color="#2563eb"
              distance={2}
              decay={2}
            />
          </group>
        )}

        {/* DATABASE (0, 2.5) - Section 8 */}
        {showDatabase && (
          <group
            ref={databaseRef}
            position={POS_DATABASE}
            scale={0}
            onClick={() => onSkillClick?.(8)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Billboard>
              <Text
                position={[0, 1.0, 0]}
                fontSize={isElementActive(8) ? 0.11 : 0.09}
                color={getElementLabelColor(8, C_DB)}
                anchorX="center"
                outlineWidth={isElementActive(8) ? 0.015 : 0}
                outlineColor={C_DB}
              >
                DATABASE
              </Text>
              <Text
                position={[0, 0.88, 0]}
                fontSize={0.04}
                color={isElementActive(8) ? "#aaa" : "#666"}
                anchorX="center"
              >
                PostgreSQL
              </Text>
            </Billboard>
            {/* Core - Larger size */}
            <mesh>
              <cylinderGeometry args={[0.55, 0.55, 1.0, 32]} />
              <meshStandardMaterial
                color="#1a0b2e"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Glowing Rings - Animated - Larger */}
            {[0.35, 0, -0.35].map((y, i) => (
              <mesh
                key={i}
                position={[0, y, 0]}
                ref={(el) => (databaseRingRefs.current[i] = el)}
                scale={0} // Start invisible
              >
                <cylinderGeometry args={[0.56, 0.56, 0.03, 32]} />
                <meshStandardMaterial
                  color={C_DB}
                  emissive={C_DB}
                  emissiveIntensity={2}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* ========== MIDDLE ROW ========== */}

        {/* CI/CD (-3.2, 0) - Section 10 */}
        {showCICD && (
          <group
            ref={cicdRef}
            position={POS_CICD}
            scale={0}
            onClick={() => onSkillClick?.(10)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Text
              position={[0, 0.85, 0]}
              fontSize={isElementActive(10) ? 0.11 : 0.09}
              color={getElementLabelColor(10, C_CICD)}
              anchorX="center"
              outlineWidth={isElementActive(10) ? 0.015 : 0}
              outlineColor={C_CICD}
            >
              CI/CD
            </Text>
            <Text
              position={[0, 0.73, 0]}
              fontSize={0.04}
              color={isElementActive(10) ? "#aaa" : "#666"}
              anchorX="center"
            >
              Pipeline
            </Text>

            {/* Main Pipeline Container - Dark with orange glow */}
            <RoundedBox args={[1.8, 1.3, 0.08]} radius={0.04} smoothness={4}>
              <meshStandardMaterial
                color="#1a1008"
                metalness={0.7}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Orange border glow */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.85, 1.35]} />
              <meshBasicMaterial color="#ff6600" transparent opacity={0.15} />
            </mesh>

            {/* Pipeline Header Bar */}
            <RoundedBox
              args={[1.68, 0.12, 0.02]}
              radius={0.02}
              position={[0, 0.52, 0.05]}
            >
              <meshStandardMaterial
                color="#ff6600"
                emissive="#ff6600"
                emissiveIntensity={0.3}
              />
            </RoundedBox>
            <Text
              position={[-0.65, 0.52, 0.07]}
              fontSize={0.05}
              color="#ffffff"
              anchorX="left"
            >
              main
            </Text>
            <Text
              position={[0.65, 0.52, 0.07]}
              fontSize={0.035}
              color="#ffffff"
              anchorX="right"
            >
              running...
            </Text>

            {/* Pipeline Stages Container */}
            <group position={[0, 0, 0.05]}>
              {/* Stage 1: Source/Checkout */}
              <group
                position={[-0.55, 0.15, 0]}
                ref={(el) => (pipelineNodeRefs.current[0] = el)}
                scale={0}
              >
                <RoundedBox args={[0.35, 0.25, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#2a1a0a" />
                </RoundedBox>
                {/* Git icon */}
                <mesh position={[0, 0.02, 0.02]}>
                  <circleGeometry args={[0.06, 6]} />
                  <meshBasicMaterial color="#ff6600" />
                </mesh>
                <Text
                  position={[0, -0.08, 0.02]}
                  fontSize={0.028}
                  color="#ff9944"
                  anchorX="center"
                >
                  Checkout
                </Text>
                {/* Status indicator - success */}
                <mesh position={[0.12, 0.08, 0.02]}>
                  <circleGeometry args={[0.025, 16]} />
                  <meshBasicMaterial color="#22c55e" />
                </mesh>
              </group>

              {/* Arrow 1->2 */}
              <group position={[-0.3, 0.15, 0.02]}>
                <Line
                  points={[
                    [0, 0, 0],
                    [0.15, 0, 0],
                  ]}
                  color="#ff6600"
                  lineWidth={3}
                />
                <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.03, 0.05, 8]} />
                  <meshBasicMaterial color="#ff6600" />
                </mesh>
              </group>

              {/* Stage 2: Build */}
              <group
                position={[0, 0.15, 0]}
                ref={(el) => (pipelineNodeRefs.current[1] = el)}
                scale={0}
              >
                <RoundedBox args={[0.35, 0.25, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#2a1a0a" />
                </RoundedBox>
                {/* Build/hammer icon */}
                <mesh position={[0, 0.02, 0.02]} rotation={[0, 0, 0.3]}>
                  <boxGeometry args={[0.04, 0.08, 0.01]} />
                  <meshBasicMaterial color="#ff8833" />
                </mesh>
                <mesh position={[0.02, 0.05, 0.02]}>
                  <boxGeometry args={[0.06, 0.04, 0.01]} />
                  <meshBasicMaterial color="#ff8833" />
                </mesh>
                <Text
                  position={[0, -0.08, 0.02]}
                  fontSize={0.028}
                  color="#ff9944"
                  anchorX="center"
                >
                  Build
                </Text>
                {/* Status indicator - success */}
                <mesh position={[0.12, 0.08, 0.02]}>
                  <circleGeometry args={[0.025, 16]} />
                  <meshBasicMaterial color="#22c55e" />
                </mesh>
              </group>

              {/* Arrow 2->3 */}
              <group position={[0.25, 0.15, 0.02]}>
                <Line
                  points={[
                    [0, 0, 0],
                    [0.15, 0, 0],
                  ]}
                  color="#ff6600"
                  lineWidth={3}
                />
                <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.03, 0.05, 8]} />
                  <meshBasicMaterial color="#ff6600" />
                </mesh>
              </group>

              {/* Stage 3: Test */}
              <group
                position={[0.55, 0.15, 0]}
                ref={(el) => (pipelineNodeRefs.current[2] = el)}
                scale={0}
              >
                <RoundedBox args={[0.35, 0.25, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#2a1a0a" />
                </RoundedBox>
                {/* Test/flask icon */}
                <mesh position={[0, 0.02, 0.02]}>
                  <cylinderGeometry args={[0.02, 0.04, 0.08, 8]} />
                  <meshBasicMaterial color="#ffaa44" />
                </mesh>
                <Text
                  position={[0, -0.08, 0.02]}
                  fontSize={0.028}
                  color="#ff9944"
                  anchorX="center"
                >
                  Test
                </Text>
                {/* Status indicator - running (orange pulse) */}
                <mesh position={[0.12, 0.08, 0.02]}>
                  <circleGeometry args={[0.025, 16]} />
                  <meshStandardMaterial
                    color="#ff6600"
                    emissive="#ff6600"
                    emissiveIntensity={1.5}
                    toneMapped={false}
                  />
                </mesh>
              </group>

              {/* Second Row - Deploy stages */}
              {/* Arrow down from Test */}
              <group position={[0.55, -0.02, 0.02]}>
                <Line
                  points={[
                    [0, 0, 0],
                    [0, -0.1, 0],
                  ]}
                  color="#ff6600"
                  lineWidth={3}
                  dashed
                  dashSize={0.02}
                  gapSize={0.02}
                />
              </group>

              {/* Stage 4: Deploy Staging */}
              <group
                position={[0.55, -0.25, 0]}
                ref={(el) => (pipelineNodeRefs.current[3] = el)}
                scale={0}
              >
                <RoundedBox args={[0.35, 0.2, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#1a1205" />
                </RoundedBox>
                {/* Cloud/deploy icon */}
                <mesh position={[0, 0.01, 0.02]}>
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshBasicMaterial color="#666" />
                </mesh>
                <Text
                  position={[0, -0.06, 0.02]}
                  fontSize={0.025}
                  color="#888"
                  anchorX="center"
                >
                  Staging
                </Text>
                {/* Status indicator - pending */}
                <mesh position={[0.12, 0.05, 0.02]}>
                  <circleGeometry args={[0.02, 16]} />
                  <meshBasicMaterial color="#444" />
                </mesh>
              </group>

              {/* Arrow to Production */}
              <group position={[0.25, -0.25, 0.02]}>
                <Line
                  points={[
                    [0.12, 0, 0],
                    [-0.12, 0, 0],
                  ]}
                  color="#444"
                  lineWidth={2}
                  dashed
                  dashSize={0.02}
                  gapSize={0.02}
                />
              </group>

              {/* Stage 5: Deploy Production */}
              <group
                position={[0, -0.25, 0]}
                ref={(el) => (pipelineNodeRefs.current[4] = el)}
                scale={0}
              >
                <RoundedBox args={[0.35, 0.2, 0.02]} radius={0.02}>
                  <meshStandardMaterial color="#1a1205" />
                </RoundedBox>
                {/* Rocket icon */}
                <mesh position={[0, 0.01, 0.02]} rotation={[0, 0, 0.5]}>
                  <coneGeometry args={[0.02, 0.06, 8]} />
                  <meshBasicMaterial color="#666" />
                </mesh>
                <Text
                  position={[0, -0.06, 0.02]}
                  fontSize={0.025}
                  color="#888"
                  anchorX="center"
                >
                  Production
                </Text>
                {/* Status indicator - pending */}
                <mesh position={[0.12, 0.05, 0.02]}>
                  <circleGeometry args={[0.02, 16]} />
                  <meshBasicMaterial color="#444" />
                </mesh>
              </group>

              {/* Logs/Terminal preview at bottom */}
              <group position={[-0.35, -0.25, 0]}>
                <RoundedBox args={[0.5, 0.2, 0.01]} radius={0.01}>
                  <meshBasicMaterial color="#0a0a0a" />
                </RoundedBox>
                <Text
                  position={[-0.22, 0.05, 0.01]}
                  fontSize={0.02}
                  color="#ff6600"
                  anchorX="left"
                >
                  $ npm run build
                </Text>
                <Text
                  position={[-0.22, 0.02, 0.01]}
                  fontSize={0.018}
                  color="#888"
                  anchorX="left"
                >
                  Building...
                </Text>
                <Text
                  position={[-0.22, -0.01, 0.01]}
                  fontSize={0.018}
                  color="#22c55e"
                  anchorX="left"
                >
                  ✓ Compiled
                </Text>
                <Text
                  position={[-0.22, -0.04, 0.01]}
                  fontSize={0.018}
                  color="#ff9944"
                  anchorX="left"
                >
                  Running tests...
                </Text>
              </group>
            </group>

            {/* Ambient orange glow */}
            <pointLight
              position={[0, 0, 0.5]}
              intensity={0.8}
              color="#ff6600"
              distance={2}
              decay={2}
            />
          </group>
        )}

        {/* SERVER (0, 0) - Section 7 */}
        {showServer && (
          <group
            ref={serverRef}
            position={POS_SERVER}
            scale={0}
            onClick={() => onSkillClick?.(7)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Text
              position={[0, 0.85, 0]}
              fontSize={isElementActive(7) ? 0.11 : 0.09}
              color={getElementLabelColor(7, C_SERVER)}
              anchorX="center"
              outlineWidth={isElementActive(7) ? 0.015 : 0}
              outlineColor={C_SERVER}
            >
              SERVEUR
            </Text>
            <Text
              position={[0, 0.73, 0]}
              fontSize={0.04}
              color={isElementActive(7) ? "#aaa" : "#666"}
              anchorX="center"
            >
              Node.js
            </Text>

            {/* Main Cabinet Frame */}
            <RoundedBox args={[0.9, 1.4, 0.5]} radius={0.02} smoothness={4}>
              <meshStandardMaterial
                color="#050505"
                metalness={0.8}
                roughness={0.2}
              />
            </RoundedBox>

            {/* Internal Glow for realism */}
            <pointLight
              position={[0, 0, 0.2]}
              intensity={0.5}
              color={C_SERVER}
              distance={1}
              decay={2}
            />

            {/* Detailed Server Blades - Animated Appearance */}
            {Array.from({ length: 8 }).map((_, i) => {
              // Logic moved to useFrame for persistence and decoupling from scroll
              return (
                <group key={i} ref={(el) => (bladeRefs.current[i] = el)}>
                  {/* Blade Face Plate */}
                  <RoundedBox
                    args={[0.82, 0.14, 0.02]}
                    radius={0.005}
                    smoothness={2}
                  >
                    <meshStandardMaterial
                      color="#111"
                      metalness={0.9}
                      roughness={0.5}
                    />
                  </RoundedBox>

                  {/* Hard Drive Bays (Grilles) */}
                  {[-0.3, -0.15, 0, 0.15].map((x, j) => (
                    <group key={j} position={[x, 0, 0.015]}>
                      <planeGeometry args={[0.12, 0.1]} />
                      {/* Ventilation grille effect using wireframe or dark stripes */}
                      <meshStandardMaterial color="#000" emissive="#1f1f1f" />
                      {/* Status LED for drive - Blinking Randomly */}
                      <mesh position={[0.04, -0.03, 0.005]}>
                        <circleGeometry args={[0.006, 8]} />
                        <meshBasicMaterial name="led_green" color="#00ff00" />
                      </mesh>
                    </group>
                  ))}

                  {/* Power/Network Status LEDs */}
                  <group position={[0.35, 0, 0.015]}>
                    <mesh position={[0, 0.03, 0]}>
                      <circleGeometry args={[0.015, 16]} />
                      <meshBasicMaterial color={C_SERVER} />
                    </mesh>
                    <mesh position={[0, -0.03, 0]}>
                      <planeGeometry args={[0.08, 0.02]} />
                      <meshBasicMaterial
                        color={
                          // Network activity blink
                          Math.sin(Date.now() * 0.02 + i * 20) > 0
                            ? "#22cc22"
                            : "#111"
                        }
                      />
                    </mesh>
                  </group>
                </group>
              );
            })}
          </group>
        )}

        {/* ARCHITECTURE (DevOps Group - Bottom) - Section 12 */}
        {showArchi && (
          <group
            ref={archiRef}
            position={POS_ARCHI}
            scale={0}
            onClick={() => onSkillClick?.(12)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Text
              position={[0, 0.85, 0]}
              fontSize={isElementActive(12) ? 0.11 : 0.09}
              color={getElementLabelColor(12, C_ARCHI)}
              anchorX="center"
              outlineWidth={isElementActive(12) ? 0.015 : 0}
              outlineColor={C_ARCHI}
            >
              ARCHITECTURE
            </Text>
            <Text
              position={[0, 0.73, 0]}
              fontSize={0.04}
              color={isElementActive(12) ? "#aaa" : "#666"}
              anchorX="center"
            >
              System Design
            </Text>

            {/* Main Container - Blueprint/Architecture style - Aligned size */}
            <RoundedBox args={[1.8, 1.3, 0.08]} radius={0.04} smoothness={4}>
              <meshStandardMaterial
                color="#0a1520"
                metalness={0.7}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Cyan border glow */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.85, 1.35]} />
              <meshBasicMaterial color={C_ARCHI} transparent opacity={0.1} />
            </mesh>

            {/* Header bar */}
            <RoundedBox
              args={[1.68, 0.1, 0.02]}
              radius={0.02}
              position={[0, 0.48, 0.05]}
            >
              <meshStandardMaterial
                color="#0e4b5f"
                emissive={C_ARCHI}
                emissiveIntensity={0.3}
              />
            </RoundedBox>
            <Text
              position={[-0.7, 0.48, 0.07]}
              fontSize={0.04}
              color={C_ARCHI}
              anchorX="left"
            >
              System Blueprint
            </Text>
            <Text
              position={[0.7, 0.48, 0.07]}
              fontSize={0.03}
              color={C_ARCHI}
              anchorX="right"
            >
              v2.0
            </Text>

            {/* Architecture Diagram */}
            <group position={[0, -0.05, 0.05]}>
              {/* Microservices boxes */}
              {[
                { name: "API Gateway", x: 0, y: 0.18 },
                { name: "Auth Service", x: -0.45, y: -0.05 },
                { name: "Core Service", x: 0.45, y: -0.05 },
              ].map((service, i) => (
                <group
                  key={i}
                  position={[service.x, service.y, 0]}
                  ref={(el) => (checklistRefs.current[i] = el)}
                  scale={0}
                >
                  {/* Service container */}
                  <RoundedBox args={[0.55, 0.2, 0.01]} radius={0.02}>
                    <meshStandardMaterial color="#0e2a35" />
                  </RoundedBox>

                  {/* Service icon */}
                  <mesh position={[-0.18, 0, 0.01]}>
                    <boxGeometry args={[0.08, 0.08, 0.01]} />
                    <meshBasicMaterial color={C_ARCHI} />
                  </mesh>

                  {/* Service name */}
                  <Text
                    position={[0.05, 0, 0.01]}
                    fontSize={0.025}
                    color={C_ARCHI}
                    anchorX="left"
                  >
                    {service.name}
                  </Text>
                </group>
              ))}

              {/* Connection lines between services */}
              <Line
                points={[
                  [0, 0.08, 0.02],
                  [-0.3, -0.05, 0.02],
                ]}
                color={C_ARCHI}
                lineWidth={2}
                opacity={0.5}
                transparent
              />
              <Line
                points={[
                  [0, 0.08, 0.02],
                  [0.3, -0.05, 0.02],
                ]}
                color={C_ARCHI}
                lineWidth={2}
                opacity={0.5}
                transparent
              />
              <Line
                points={[
                  [-0.15, -0.05, 0.02],
                  [0.15, -0.05, 0.02],
                ]}
                color={C_ARCHI}
                lineWidth={2}
                opacity={0.5}
                transparent
                dashed
                dashSize={0.02}
                gapSize={0.02}
              />

              {/* Database layer */}
              <group position={[0, -0.28, 0]}>
                <RoundedBox args={[1.2, 0.15, 0.01]} radius={0.01}>
                  <meshStandardMaterial color="#0e2a35" />
                </RoundedBox>
                <mesh
                  position={[-0.45, 0, 0.01]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
                  <meshBasicMaterial color={C_ARCHI} />
                </mesh>
                <Text
                  position={[-0.3, 0, 0.01]}
                  fontSize={0.025}
                  color="#888"
                  anchorX="left"
                >
                  PostgreSQL
                </Text>
                <mesh position={[0.15, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
                  <meshBasicMaterial color="#ef4444" />
                </mesh>
                <Text
                  position={[0.3, 0, 0.01]}
                  fontSize={0.025}
                  color="#888"
                  anchorX="left"
                >
                  Redis
                </Text>
              </group>

              {/* Scalability indicators */}
              <group position={[0.6, 0.18, 0]}>
                <Text
                  position={[0, 0.05, 0.01]}
                  fontSize={0.02}
                  color="#666"
                  anchorX="center"
                >
                  Replicas
                </Text>
                <Text
                  position={[0, -0.02, 0.01]}
                  fontSize={0.03}
                  color={C_ARCHI}
                  anchorX="center"
                >
                  x3
                </Text>
              </group>
            </group>

            {/* Ambient cyan glow */}
            <pointLight
              position={[0, 0, 0.5]}
              intensity={0.5}
              color={C_ARCHI}
              distance={2}
              decay={2}
            />
          </group>
        )}

        {/* ========== BOTTOM ROW ========== */}

        {/* FRONTEND (-3.2, -2.5) - Section 3 */}
        {showFrontend && (
          <group
            ref={frontendRef}
            position={POS_FRONTEND}
            scale={0}
            onClick={() => onSkillClick?.(3)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Text
              position={[0, 0.85, 0]}
              fontSize={isElementActive(3) ? 0.12 : 0.1}
              color={getElementLabelColor(3, C_FRONT)}
              anchorX="center"
              outlineWidth={isElementActive(3) ? 0.015 : 0}
              outlineColor={C_FRONT}
            >
              APP WEB
            </Text>
            <Text
              position={[0, 0.73, 0]}
              fontSize={0.04}
              color={isElementActive(3) ? "#aaa" : "#666"}
              anchorX="center"
            >
              React / Remix
            </Text>

            {/* Wireframe Mode (Initial state hint) */}
            <group scale={1.02} position={[0, 0, -0.1]}>
              <RoundedBox args={[1.8, 1.3, 0.05]} radius={0.04}>
                <meshBasicMaterial
                  color={C_FRONT}
                  wireframe
                  opacity={0.3}
                  transparent
                />
              </RoundedBox>
            </group>

            {/* Main Monitor - Aligned size */}
            <RoundedBox
              args={[1.8, 1.3, 0.06]}
              radius={0.04}
              smoothness={4}
              position={[0, 0, -0.03]}
            >
              <meshStandardMaterial
                color="#1e1e2e"
                metalness={0.6}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Screen Content */}
            <RoundedBox
              args={[1.68, 1.18, 0.02]}
              radius={0.03}
              smoothness={4}
              position={[0, 0, 0]}
            >
              <meshStandardMaterial color="#0a0a18" />
            </RoundedBox>

            {/* Animated UI Blocks (Restored!) */}
            <group position={[0, 0, 0.02]}>
              {/* Header */}
              <group ref={uiBlock1} scale={0}>
                <RoundedBox
                  args={[1.58, 0.13, 0.01]}
                  radius={0.02}
                  position={[0, 0.45, 0]}
                >
                  <meshStandardMaterial color="#16162a" />
                </RoundedBox>
              </group>
              {/* Sidebar */}
              <group ref={uiBlock2} scale={0}>
                <RoundedBox
                  args={[0.35, 0.8, 0.01]}
                  radius={0.02}
                  position={[-0.6, -0.08, 0]}
                >
                  <meshStandardMaterial color="#1f1f3a" />
                </RoundedBox>
              </group>
              {/* Hero Section (Flying in) */}
              <group ref={uiBlock3} scale={0}>
                <RoundedBox
                  args={[1.05, 0.35, 0.01]}
                  radius={0.02}
                  position={[0.18, 0.12, 0.02]}
                >
                  <meshStandardMaterial color="#3a3a5e" />
                </RoundedBox>
                {/* Card Grid */}
                {[-0.18, -0.45].map((y, i) => (
                  <group key={i} position={[0.18, y, 0]}>
                    {[-0.35, 0, 0.35].map((x, j) => (
                      <RoundedBox
                        key={j}
                        args={[0.3, 0.18, 0.01]}
                        radius={0.01}
                        position={[x, 0, 0.02]}
                      >
                        <meshStandardMaterial color="#2a2a4e" />
                      </RoundedBox>
                    ))}
                  </group>
                ))}
              </group>
            </group>
          </group>
        )}

        {/* MOBILE (0, -2.5) - Section 4 */}
        {showMobile && (
          <group
            ref={mobileRef}
            position={POS_MOBILE}
            scale={0}
            onClick={() => onSkillClick?.(4)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Text
              position={[0, 1.1, 0]}
              fontSize={isElementActive(4) ? 0.11 : 0.09}
              color={getElementLabelColor(4, C_MOBILE)}
              anchorX="center"
              outlineWidth={isElementActive(4) ? 0.015 : 0}
              outlineColor={C_MOBILE}
            >
              MOBILE
            </Text>
            <Text
              position={[0, 0.98, 0]}
              fontSize={0.04}
              color={isElementActive(4) ? "#aaa" : "#666"}
              anchorX="center"
            >
              Native App
            </Text>
            {/* Phone Body - Larger size */}
            <RoundedBox args={[0.8, 1.5, 0.08]} radius={0.08} smoothness={4}>
              <meshStandardMaterial
                color="#1a1a2e"
                metalness={0.8}
                roughness={0.2}
              />
            </RoundedBox>
            {/* Screen */}
            <RoundedBox
              args={[0.72, 1.38, 0.01]}
              radius={0.06}
              position={[0, 0, 0.05]}
            >
              <meshStandardMaterial color="#000000" />
            </RoundedBox>
            {/* App UI */}
            <group position={[0, 0, 0.06]}>
              {/* Header */}
              <mesh position={[0, 0.58, 0]}>
                <planeGeometry args={[0.65, 0.12]} />
                <meshBasicMaterial color={C_MOBILE} />
              </mesh>
              {/* Chat Bubbles */}
              {[0.3, 0.05, -0.2, -0.45].map((y, i) => (
                <group
                  key={i}
                  ref={(el) => (chatBubbleRefs.current[i] = el)}
                  scale={0}
                >
                  <RoundedBox
                    args={[0.58, 0.12, 0.005]}
                    radius={0.03}
                    position={[0, y, 0]}
                  >
                    <meshBasicMaterial color={i % 2 == 0 ? "#333" : "#555"} />
                  </RoundedBox>
                </group>
              ))}
            </group>
            {/* Notch & Home Bar */}
            <RoundedBox
              args={[0.24, 0.03, 0.015]}
              radius={0.012}
              position={[0, 0.6, 0.055]}
            >
              <meshStandardMaterial color="#000000" />
            </RoundedBox>
          </group>
        )}

        {/* BACKOFFICE (3.2, -2.5) - Section 5 */}
        {showBackoffice && (
          <group
            ref={backofficeRef}
            position={POS_BACKOFFICE}
            scale={0}
            onClick={() => onSkillClick?.(5)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <Text
              position={[0, 0.85, 0]}
              fontSize={isElementActive(5) ? 0.11 : 0.09}
              color={getElementLabelColor(5, C_BACK)}
              anchorX="center"
              outlineWidth={isElementActive(5) ? 0.015 : 0}
              outlineColor={C_BACK}
            >
              BACKOFFICE
            </Text>
            <Text
              position={[0, 0.73, 0]}
              fontSize={0.04}
              color={isElementActive(5) ? "#aaa" : "#666"}
              anchorX="center"
            >
              Admin Dashboard
            </Text>

            {/* Main Container */}
            <RoundedBox args={[1.8, 1.3, 0.08]} radius={0.04} smoothness={4}>
              <meshStandardMaterial
                color="#1a1510"
                metalness={0.7}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Gold/Orange border glow */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[1.85, 1.35]} />
              <meshBasicMaterial color={C_BACK} transparent opacity={0.12} />
            </mesh>

            {/* Header bar */}
            <RoundedBox
              args={[1.68, 0.1, 0.02]}
              radius={0.02}
              position={[0, 0.53, 0.05]}
            >
              <meshStandardMaterial
                color="#332200"
                emissive={C_BACK}
                emissiveIntensity={0.2}
              />
            </RoundedBox>
            <Text
              position={[-0.7, 0.53, 0.07]}
              fontSize={0.04}
              color={C_BACK}
              anchorX="left"
            >
              Dashboard
            </Text>
            <Text
              position={[0.7, 0.53, 0.07]}
              fontSize={0.025}
              color="#888"
              anchorX="right"
            >
              Admin
            </Text>

            {/* Dashboard Content */}
            <group position={[0, -0.05, 0.05]}>
              {/* TOP ROW: KPI Cards */}
              <group
                position={[0, 0.25, 0]}
                ref={(el) => (chartRefs.current[0] = el)}
                scale={0}
              >
                {[
                  {
                    label: "Users",
                    value: "12,847",
                    color: "#22c55e",
                    x: -0.52,
                  },
                  {
                    label: "Revenue",
                    value: "$48.2K",
                    color: C_BACK,
                    x: -0.17,
                  },
                  {
                    label: "Orders",
                    value: "1,284",
                    color: "#3b82f6",
                    x: 0.17,
                  },
                  { label: "Growth", value: "+24%", color: "#a855f7", x: 0.52 },
                ].map((kpi, i) => (
                  <group key={i} position={[kpi.x, 0, 0]}>
                    <RoundedBox args={[0.3, 0.15, 0.01]} radius={0.01}>
                      <meshStandardMaterial color="#1a1a1a" />
                    </RoundedBox>
                    <Text
                      position={[0, 0.03, 0.01]}
                      fontSize={0.018}
                      color="#666"
                      anchorX="center"
                    >
                      {kpi.label}
                    </Text>
                    <Text
                      position={[0, -0.025, 0.01]}
                      fontSize={0.028}
                      color={kpi.color}
                      anchorX="center"
                    >
                      {kpi.value}
                    </Text>
                  </group>
                ))}
              </group>

              {/* MIDDLE ROW: Charts */}
              {/* Line Chart - Left */}
              <group
                position={[-0.4, -0.02, 0]}
                ref={(el) => (chartRefs.current[1] = el)}
                scale={0}
              >
                <RoundedBox args={[0.65, 0.4, 0.01]} radius={0.01}>
                  <meshStandardMaterial color="#141414" />
                </RoundedBox>
                <Text
                  position={[0, 0.15, 0.01]}
                  fontSize={0.025}
                  color="#888"
                  anchorX="center"
                >
                  Traffic Overview
                </Text>
                {/* Grid lines */}
                {[-0.1, 0, 0.1].map((y, i) => (
                  <Line
                    key={i}
                    points={[
                      [-0.28, y - 0.02, 0.01],
                      [0.28, y - 0.02, 0.01],
                    ]}
                    color="#222"
                    lineWidth={1}
                  />
                ))}
                {/* Area chart */}
                <Line
                  points={[
                    [-0.28, -0.12, 0.015],
                    [-0.2, -0.05, 0.015],
                    [-0.1, -0.08, 0.015],
                    [0, 0.02, 0.015],
                    [0.1, -0.02, 0.015],
                    [0.2, 0.08, 0.015],
                    [0.28, 0.05, 0.015],
                  ]}
                  color={C_BACK}
                  lineWidth={2}
                />
                {/* Data points */}
                {[
                  [-0.28, -0.12],
                  [-0.2, -0.05],
                  [-0.1, -0.08],
                  [0, 0.02],
                  [0.1, -0.02],
                  [0.2, 0.08],
                  [0.28, 0.05],
                ].map((p, i) => (
                  <mesh key={i} position={[p[0], p[1], 0.02]}>
                    <circleGeometry args={[0.015, 12]} />
                    <meshBasicMaterial color={C_BACK} />
                  </mesh>
                ))}
              </group>

              {/* Donut Chart - Right */}
              <group
                position={[0.4, -0.02, 0]}
                ref={(el) => (chartRefs.current[2] = el)}
                scale={0}
              >
                <RoundedBox args={[0.65, 0.4, 0.01]} radius={0.01}>
                  <meshStandardMaterial color="#141414" />
                </RoundedBox>
                <Text
                  position={[0, 0.15, 0.01]}
                  fontSize={0.025}
                  color="#888"
                  anchorX="center"
                >
                  Revenue Sources
                </Text>

                {/* Donut chart using torus segments */}
                <group
                  position={[0, -0.03, 0.015]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  {/* Segment 1 - 55% - Gold */}
                  <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.1, 0.035, 8, 32, Math.PI * 1.1]} />
                    <meshBasicMaterial color={C_BACK} />
                  </mesh>
                  {/* Segment 2 - 25% - Blue */}
                  <mesh rotation={[0, Math.PI * 1.1, 0]}>
                    <torusGeometry args={[0.1, 0.035, 8, 32, Math.PI * 0.5]} />
                    <meshBasicMaterial color="#3b82f6" />
                  </mesh>
                  {/* Segment 3 - 20% - Purple */}
                  <mesh rotation={[0, Math.PI * 1.6, 0]}>
                    <torusGeometry args={[0.1, 0.035, 8, 32, Math.PI * 0.4]} />
                    <meshBasicMaterial color="#a855f7" />
                  </mesh>
                </group>

                {/* Center text */}
                <Text
                  position={[0, -0.03, 0.02]}
                  fontSize={0.03}
                  color="#fff"
                  anchorX="center"
                >
                  $48.2K
                </Text>

                {/* Legend */}
                <group position={[0.22, -0.03, 0.01]}>
                  <mesh position={[0, 0.05, 0]}>
                    <circleGeometry args={[0.012, 8]} />
                    <meshBasicMaterial color={C_BACK} />
                  </mesh>
                  <Text
                    position={[0.04, 0.05, 0]}
                    fontSize={0.015}
                    color="#888"
                    anchorX="left"
                  >
                    Products
                  </Text>
                  <mesh position={[0, 0.02, 0]}>
                    <circleGeometry args={[0.012, 8]} />
                    <meshBasicMaterial color="#3b82f6" />
                  </mesh>
                  <Text
                    position={[0.04, 0.02, 0]}
                    fontSize={0.015}
                    color="#888"
                    anchorX="left"
                  >
                    Services
                  </Text>
                  <mesh position={[0, -0.01, 0]}>
                    <circleGeometry args={[0.012, 8]} />
                    <meshBasicMaterial color="#a855f7" />
                  </mesh>
                  <Text
                    position={[0.04, -0.01, 0]}
                    fontSize={0.015}
                    color="#888"
                    anchorX="left"
                  >
                    Other
                  </Text>
                </group>
              </group>

              {/* BOTTOM ROW: Recent Activity */}
              <group
                position={[0, -0.35, 0]}
                ref={(el) => (chartRefs.current[3] = el)}
                scale={0}
              >
                <RoundedBox args={[1.4, 0.18, 0.01]} radius={0.01}>
                  <meshStandardMaterial color="#141414" />
                </RoundedBox>
                <Text
                  position={[-0.6, 0.05, 0.01]}
                  fontSize={0.022}
                  color="#888"
                  anchorX="left"
                >
                  Recent Activity
                </Text>

                {/* Activity items */}
                {[
                  { text: "New order #1284", time: "2m ago", x: -0.45 },
                  { text: "User registered", time: "5m ago", x: 0 },
                  { text: "Payment received", time: "12m ago", x: 0.45 },
                ].map((item, i) => (
                  <group key={i} position={[item.x, -0.03, 0.01]}>
                    <mesh position={[-0.12, 0, 0]}>
                      <circleGeometry args={[0.015, 12]} />
                      <meshBasicMaterial
                        color={
                          i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : C_BACK
                        }
                      />
                    </mesh>
                    <Text
                      position={[-0.08, 0.01, 0]}
                      fontSize={0.016}
                      color="#ccc"
                      anchorX="left"
                    >
                      {item.text}
                    </Text>
                    <Text
                      position={[-0.08, -0.02, 0]}
                      fontSize={0.012}
                      color="#666"
                      anchorX="left"
                    >
                      {item.time}
                    </Text>
                  </group>
                ))}
              </group>
            </group>

            {/* Ambient gold glow */}
            <pointLight
              position={[0, 0, 0.5]}
              intensity={0.5}
              color={C_BACK}
              distance={2}
              decay={2}
            />
          </group>
        )}

        {/* ========== PARTICLE CONNECTIONS (Logical Layout) ========== */}
        {/* Lines always visible, Particles only on final dezoom (> 94%) */}

        {/* ===== INTRA-GROUP VERTICAL CONNECTIONS ===== */}

        {/* FRONTEND GROUP (vertical chain) */}
        {/* Site Web <-> Mobile */}
        {showFrontend && showMobile && (
          <ParticleStream
            start={P_FRONT}
            end={P_MOBILE}
            startColor={C_FRONT}
            endColor={C_MOBILE}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_FRONT, T_MOBILE))}
          />
        )}
        {/* Mobile <-> Backoffice */}
        {showMobile && showBackoffice && (
          <ParticleStream
            start={P_MOBILE}
            end={P_BACK}
            startColor={C_MOBILE}
            endColor={C_BACK}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_MOBILE, T_BACK))}
          />
        )}

        {/* BACKEND GROUP (vertical) */}
        {/* Server <-> Database */}
        {showServer && showDatabase && (
          <ParticleStream
            start={P_SERVER}
            end={P_DB}
            startColor={C_SERVER}
            endColor={C_DB}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_SERVER, T_DB))}
          />
        )}

        {/* DEVOPS GROUP (vertical chain) */}
        {/* CI/CD <-> Cloud */}
        {showCICD && showCloud && (
          <ParticleStream
            start={P_CICD}
            end={P_CLOUD}
            startColor={C_CICD}
            endColor={C_CLOUD}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_CICD, T_CLOUD))}
          />
        )}
        {/* Cloud <-> Architecture */}
        {showCloud && showArchi && (
          <ParticleStream
            start={P_CLOUD}
            end={P_ARCHI}
            startColor={C_CLOUD}
            endColor={C_ARCHI}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_CLOUD, T_ARCHI))}
          />
        )}

        {/* ===== CROSS-GROUP HORIZONTAL CONNECTIONS ===== */}

        {/* TOP ROW: Site Web <-> Server <-> CI/CD */}
        {showFrontend && showServer && (
          <ParticleStream
            start={P_FRONT}
            end={P_SERVER}
            startColor={C_FRONT}
            endColor={C_SERVER}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_FRONT, T_SERVER))}
          />
        )}
        {showServer && showCICD && (
          <ParticleStream
            start={P_SERVER}
            end={P_CICD}
            startColor={C_SERVER}
            endColor={C_CICD}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_SERVER, T_CICD))}
          />
        )}

        {/* MIDDLE ROW: Mobile <-> Database <-> Cloud */}
        {showMobile && showDatabase && (
          <ParticleStream
            start={P_MOBILE}
            end={P_DB}
            startColor={C_MOBILE}
            endColor={C_DB}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_MOBILE, T_DB))}
          />
        )}
        {showDatabase && showCloud && (
          <ParticleStream
            start={P_DB}
            end={P_CLOUD}
            startColor={C_DB}
            endColor={C_CLOUD}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_DB, T_CLOUD))}
          />
        )}

        {/* BOTTOM ROW: Backoffice <-> Architecture (Server and Database link both) */}
        {showBackoffice && showArchi && (
          <ParticleStream
            start={P_BACK}
            end={P_ARCHI}
            startColor={C_BACK}
            endColor={C_ARCHI}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_BACK, T_ARCHI))}
          />
        )}

        {/* ===== KEY DIAGONAL/CROSS CONNECTIONS ===== */}

        {/* Backoffice <-> Server (admin dashboard needs backend) */}
        {showBackoffice && showServer && (
          <ParticleStream
            start={P_BACK}
            end={P_SERVER}
            startColor={C_BACK}
            endColor={C_SERVER}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_BACK, T_SERVER))}
          />
        )}
        {/* Backoffice <-> Database (admin reads data) */}
        {showBackoffice && showDatabase && (
          <ParticleStream
            start={P_BACK}
            end={P_DB}
            startColor={C_BACK}
            endColor={C_DB}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_BACK, T_DB))}
          />
        )}

        {/* Server <-> Cloud (deployment) */}
        {showServer && showCloud && (
          <ParticleStream
            start={P_SERVER}
            end={P_CLOUD}
            startColor={C_SERVER}
            endColor={C_CLOUD}
            showParticles={offset > 0.94}
            opacity={getLinkOpacity(Math.max(T_SERVER, T_CLOUD))}
          />
        )}
      </group>
      {/* ========== END SKILLS CONTAINER ========== */}
    </group>
  );
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
