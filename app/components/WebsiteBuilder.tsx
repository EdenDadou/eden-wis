import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Line, Instance, Instances, Billboard } from '@react-three/drei';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Particle Stream Component for animated connections (Bidirectional + Dual Colors)
function ParticleStream({ start, end, startColor = "#ffffff", endColor = "#ffffff", speed = 0.5, count = 10, showParticles = true, opacity = 1 }: { start: number[], end: number[], startColor?: string, endColor?: string, speed?: number, count?: number, showParticles?: boolean, opacity?: number }) {
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
      reverse: Math.random() > 0.5
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
          const t = (state.clock.getElapsedTime() * speed * particle.speed * direction + particle.offset) % 1;
          const normalizedT = t < 0 ? 1 + t : t; 
          
          dummy.position.lerpVectors(startVec, endVec, normalizedT);
          const scale = 0.8 + Math.sin(state.clock.getElapsedTime() * 5 + i) * 0.3;
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
             const t = (state.clock.getElapsedTime() * speed * particle.speed * direction + particle.offset) % 1;
             const normalizedT = t < 0 ? 1 + t : t; 
             
             dummy.position.lerpVectors(startVec, endVec, normalizedT);
             const scale = 0.8 + Math.sin(state.clock.getElapsedTime() * 5 + i) * 0.3;
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

export default function WebsiteBuilder() {
  const sceneRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  // Block refs
  const serverRef = useRef<THREE.Group>(null);
  const databaseRef = useRef<THREE.Group>(null);
  const backofficeRef = useRef<THREE.Group>(null);
  const testingRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Group>(null);
  const mobileRef = useRef<THREE.Group>(null);
  const frontendRef = useRef<THREE.Group>(null);
  const cicdRef = useRef<THREE.Group>(null);

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
  const testingVisibleTime = useRef<number | null>(null);

  const serverLedIntensity = useRef(0);
  
  // Sub-element Refs
  const chatBubbleRefs = useRef<(THREE.Group | null)[]>([]);
  const chartRefs = useRef<(THREE.Line | THREE.Mesh | THREE.Group | null)[]>([]);
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
    
    // Helper for Fly In animation (From Z+ to 0)
    const flyIn = (ref: React.RefObject<THREE.Group | null>, startT: number, duration: number = 0.05, distance: number = 2) => {
        if (!ref.current) return;
        // Normalized time for this specific animation window
        const progress = Math.max(0, Math.min((offset - startT) / duration, 1));
        const eased = easeOutCubic(progress);
        
        ref.current.position.z = THREE.MathUtils.lerp(distance, 0.02, eased); 
        ref.current.scale.setScalar(eased);
    };



    // Animate elements appearing
    const animateElement = (ref: React.RefObject<THREE.Group | null>, threshold: number, duration: number = 0.05, fromZ: number = 4) => {
      if (!ref.current) return;
      const progress = Math.max(0, Math.min((offset - threshold) / duration, 1));
      // Use easeInOut for smoother start/end, less "pop"
      const eased = easeInOutCubic(progress);
      ref.current.position.z = THREE.MathUtils.lerp(fromZ, 0, eased);
      ref.current.scale.setScalar(THREE.MathUtils.lerp(0, 1, eased));
    };
    
    // SEQUENCE: 1. Front -> 2. Server -> 3. DB -> 4. Mobile -> 5. Back -> 6. CI -> 7. Cloud -> 8. Test
    
    // 1. Frontend (0.05) - Special "Fly In" for UI blocks
    animateElement(frontendRef, 0.05);
    
    // Decomposed animation for UI blocks:
    // Appear one by one with slightly more delay
    flyIn(uiBlock1, 0.06, 0.04, 1.5); // Header
    flyIn(uiBlock2, 0.08, 0.04, 2.0); // Sidebar
    flyIn(uiBlock3, 0.10, 0.04, 2.5); // Main Content

    // 2. Server (Start 0.17, Duration 0.10)
    animateElement(serverRef, 0.17, 0.10); 

    animateElement(databaseRef, 0.28);   // 3. Database
    animateElement(mobileRef, 0.39);     // 4. Mobile
    animateElement(backofficeRef, 0.50); // 5. Backoffice
    animateElement(cicdRef, 0.61);       // 6. CI/CD
    animateElement(cloudRef, 0.72);      // 7. Cloud
    animateElement(testingRef, 0.83);    // 8. Testing
    
    // Server Blades Animation (re-calculated based on new Server duration)
    // Server starts 0.12, ends ~0.22. 
    // Blades should start appearing when cabinet is mostly formed, say 0.18.
    
    // if (databaseRef.current) databaseRef.current.rotation.y = Date.now() * 0.0003; // Removed rotation per request
    // if (cicdRef.current) cicdRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.1; // Removed oscillation per request
    
    // Server Blades Animation (Time-based, triggered on first view)
    const SERVER_TRIGGER = 0.17; 
    if (offset > SERVER_TRIGGER && serverVisibleTime.current === null) {
        serverVisibleTime.current = state.clock.elapsedTime;
    }
    
    // Database Rings Animation (Time-based)
    const DB_TRIGGER = 0.28;
    if (offset > DB_TRIGGER && databaseVisibleTime.current === null) {
        databaseVisibleTime.current = state.clock.elapsedTime;
    }

    if (serverVisibleTime.current !== null) {
        // Global pulsing for server LEDs
        serverLedIntensity.current = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.5;

        bladeRefs.current.forEach((blade, i) => {
            if (!blade) return;
            
            // Animation params
            const now = state.clock.elapsedTime;
            const startTime = serverVisibleTime.current!;
            const delay = i * 0.15; // Stagger per blade
            const duration = 0.6;   // Duration of slide-in
            
            // Calculate progress
            const timeProgress = Math.max(0, Math.min((now - startTime - delay) / duration, 1));
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
                if ((child as any).isMesh && (child as any).material && (child as any).material.color) {
                     // Check if it's one of our LEDs (by color check approx)
                     const m = (child as any).material;
                     // Green LEDs
                     if (m.name === 'led_green') {
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
            const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.5, 1));
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
                     (ring.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 * pulse;
                }
            }
         });
    }

    // --- MOBILE ANIMATION (Bubbles Fly-In) ---
    const MOBILE_TRIGGER = 0.39;
    if (offset > MOBILE_TRIGGER && mobileVisibleTime.current === null) {
        mobileVisibleTime.current = state.clock.elapsedTime;
    }
    if (mobileVisibleTime.current !== null) {
        chatBubbleRefs.current.forEach((bubble, i) => {
            if (!bubble) return;
            const now = state.clock.elapsedTime;
            const startTime = mobileVisibleTime.current!;
            const delay = i * 0.15;
            const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.5, 1));
            const eased = easeOutCubic(timeProgress);
            
            bubble.scale.setScalar(eased);
            bubble.position.z = THREE.MathUtils.lerp(2, 0, eased);
        });
    }

    // --- BACKOFFICE ANIMATION (Charts Grow) ---
    const BACK_TRIGGER = 0.50;
    if (offset > BACK_TRIGGER && backofficeVisibleTime.current === null) {
        backofficeVisibleTime.current = state.clock.elapsedTime;
    }
    if (backofficeVisibleTime.current !== null) {
        chartRefs.current.forEach((chart, i) => {
            if (!chart) return;
            const now = state.clock.elapsedTime;
            const startTime = backofficeVisibleTime.current!;
            const delay = i * 0.15;
            const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.6, 1));
            const eased = easeOutCubic(timeProgress);
            
            // Scale up + Fly In
            chart.scale.setScalar(eased);
            chart.position.z = THREE.MathUtils.lerp(2, 0, eased);
            // Spin/draw effect for charts could be tricky with generic mesh target, scale is safest
        });
    }

    // --- CI/CD ANIMATION (Pipeline Nodes Sequence) ---
    const CICD_TRIGGER = 0.61;
    if (offset > CICD_TRIGGER && cicdVisibleTime.current === null) {
        cicdVisibleTime.current = state.clock.elapsedTime;
    }
    if (cicdVisibleTime.current !== null) {
        pipelineNodeRefs.current.forEach((node, i) => {
            if (!node) return;
            const now = state.clock.elapsedTime;
            const startTime = cicdVisibleTime.current!;
            const delay = i * 0.2; // Distinct sequential pop
            const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.4, 1));
            const eased = easeOutCubic(timeProgress);
            
            node.scale.setScalar(eased * 0.5); // restore to original scale (was 0.5 in map) or 1?
                                               // In original JSX: scale={0.5} on container? No, nodes are group
            // Actually nodes are inside a map, let's assume they scale to 1 relative to parent
            node.scale.setScalar(THREE.MathUtils.lerp(0, 1, eased));
            node.position.z = THREE.MathUtils.lerp(2, 0, eased);
        });
    }

    // --- CLOUD ANIMATION (Nodes Fly & Float) ---
    const CLOUD_TRIGGER = 0.72;
    if (offset > CLOUD_TRIGGER && cloudVisibleTime.current === null) {
        cloudVisibleTime.current = state.clock.elapsedTime;
    }
    if (cloudVisibleTime.current !== null) {
        cloudNodeRefs.current.forEach((node, i) => {
            if (!node) return;
            const now = state.clock.elapsedTime;
            const startTime = cloudVisibleTime.current!;
            const delay = i * 0.1;
            const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.6, 1));
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

    // --- TESTING ANIMATION (Checklist Items Tick) ---
    const TEST_TRIGGER = 0.83;
    if (offset > TEST_TRIGGER && testingVisibleTime.current === null) {
        testingVisibleTime.current = state.clock.elapsedTime;
    }
    if (testingVisibleTime.current !== null) {
        checklistRefs.current.forEach((item, i) => {
            if (!item) return;
            const now = state.clock.elapsedTime;
            const startTime = testingVisibleTime.current!;
            const delay = i * 0.2;
            const timeProgress = Math.max(0, Math.min((now - startTime - delay) / 0.4, 1));
            const eased = easeOutCubic(timeProgress);

            item.scale.setScalar(eased);
            // Fly in from right? or just Z? Z for consistency
            item.position.z = THREE.MathUtils.lerp(2, 0.03, eased); // 0.03 was original z
        });
    }

    // --- DEZOOM LAYOUT SHIFT (Skills to right) ---
    const DEZOOM_START = 0.93;
    const DEZOOM_END = 0.97;
    if (offset > DEZOOM_START) {
        const dezoomProgress = Math.min((offset - DEZOOM_START) / (DEZOOM_END - DEZOOM_START), 1);
        const easedDezoom = easeOutCubic(dezoomProgress);

        // Shift skills container to the right
        if (skillsContainerRef.current) {
            skillsContainerRef.current.position.x = THREE.MathUtils.lerp(0, 3, easedDezoom);
        }
    } else {
        // Reset position when not in dezoom
        if (skillsContainerRef.current) {
            skillsContainerRef.current.position.x = 0;
        }
    }

  });

  const offset = scroll?.offset || 0;
  
  // Visibility thresholds - Updated to mount earlier (prevent "pop-in")
  const showFrontend = offset > 0.01; // Ani starts 0.05
  const showServer = offset > 0.08;   // Ani starts 0.12
  const showDatabase = offset > 0.20; // Ani starts 0.25
  const showMobile = offset > 0.30;   // Ani starts 0.35
  const showBackoffice = offset > 0.40; // Ani starts 0.45
  const showCICD = offset > 0.50;     // Ani starts 0.55
  const showCloud = offset > 0.60;    // Ani starts 0.65
  const showTesting = offset > 0.70;  // Ani starts 0.75
  
  // ... rest of layout constants ...


  // ═══════════════════════════════════════════════════════════
  // NEW 3-ROW LAYOUT (Specific User Request)
  //
  // Row 1 (Top): CLOUD (-3.2, 2.5)       DATABASE (0, 2.5)       (EMPTY)
  // Row 2 (Mid): CI/CD (-3.2, 0)         SERVER (0, 0)           TESTING (3.2, 0)
  // Row 3 (Bot): FRONTEND (-3.2, -2.5)   MOBILE (0, -2.5)        BACKOFFICE (3.2, -2.5)
  //
  // ═══════════════════════════════════════════════════════════

  const GRID_X = 3.2;
  const GRID_Y = 2.5;
  
  // Coordinates
  const POS_CLOUD = [-GRID_X, GRID_Y, 4] as [number, number, number];
  const POS_DATABASE = [0, GRID_Y, 4] as [number, number, number];
  
  const POS_CICD = [-GRID_X, 0, 4] as [number, number, number];
  const POS_SERVER = [0, 0, 4] as [number, number, number];
  const POS_TESTING = [GRID_X, 0, 4] as [number, number, number];
  
  const POS_FRONTEND = [-GRID_X, -GRID_Y, 4] as [number, number, number];
  const POS_MOBILE = [0, -GRID_Y, 4] as [number, number, number];
  const POS_BACKOFFICE = [GRID_X, -GRID_Y, 4] as [number, number, number];

  // Connection Points (Z=0 for drawing logic)
  const P_FRONT = [-3.2, -2.5, 0];
  const P_SERVER = [0, 0, 0];
  const P_DB = [0, 2.5, 0];
  const P_MOBILE = [0, -2.5, 0];
  const P_BACK = [3.2, -2.5, 0];
  const P_CICD = [-3.2, 0, 0];
  const P_CLOUD = [-3.2, 2.5, 0];
  const P_TEST = [3.2, 0, 0];

  // Colors
  const C_FRONT = "#3b82f6"; // Blue
  const C_SERVER = "#10b981"; // Green (Node)
  const C_DB = "#ef4444"; // Red (Database) - UPDATED per request
  const C_MOBILE = "#8b5cf6"; // Purple
  const C_BACK = "#ffaa00"; // Gold/Orange (Admin)
  const C_SAAS = "#ff6600"; // Orange (CI/CD)
  const C_CLOUD = "#1e3a5f"; // Dark Blue
  const C_TEST = "#84cc16"; // Lime (Testing) - Changed to avoid conflict with Red DB
  
  // Opacity Calculation Helper
  const getLinkOpacity = (threshold: number) => {
      // Fade in over 0.05 units after the threshold
      return Math.max(0, Math.min((offset - threshold) / 0.05, 1));
  };
  
  // Match Experience.tsx timings (S1=0.16, Step=0.11)
  // T_FRONT = 0.05 (unchanged, early enough)
  // T_SERVER = S1 + small_buffer = 0.16 + 0.02 = 0.18
  // T_DB = S1 + STEP + buffer = 0.16 + 0.11 + 0.02 = 0.29
  // T_MOBILE = 0.29 + 0.11 = 0.40
  // T_BACK = 0.51
  // T_CICD = 0.62
  // T_CLOUD = 0.73
  // T_TEST = 0.84

  // Element "Done" Thresholds (when they are fully visible approx)
  const T_FRONT = 0.05;
  const T_SERVER = 0.17; 
  const T_DB = 0.28;
  const T_MOBILE = 0.39;
  const T_BACK = 0.50;
  const T_CICD = 0.61;
  const T_CLOUD = 0.72;
  const T_TEST = 0.83;

  return (
    <group ref={sceneRef}>

      {/* ========== SKILLS CONTAINER (shifts right on dezoom) ========== */}
      <group ref={skillsContainerRef}>

      {/* ========== TOP ROW ========== */}

      {/* CLOUD (-3.2, 2.5) */}
      {showCloud && (
        <group ref={cloudRef} position={POS_CLOUD} scale={0}>
          <Text position={[0, 0.85, 0]} fontSize={0.09} color="#4a90d9" anchorX="center">CLOUD</Text>
          <Text position={[0, 0.73, 0]} fontSize={0.04} color="#666" anchorX="center">AWS / Infrastructure</Text>

          {/* Main Container - Dark blue server rack style */}
          <RoundedBox args={[1.5, 1.0, 0.1]} radius={0.04} smoothness={4}>
            <meshStandardMaterial color="#0a1628" metalness={0.8} roughness={0.3} />
          </RoundedBox>

          {/* Blue border glow */}
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[1.55, 1.05]} />
            <meshBasicMaterial color="#1e3a5f" transparent opacity={0.2} />
          </mesh>

          {/* Header bar */}
          <RoundedBox args={[1.4, 0.1, 0.02]} radius={0.02} position={[0, 0.38, 0.06]}>
            <meshStandardMaterial color="#1e3a5f" emissive="#2563eb" emissiveIntensity={0.3} />
          </RoundedBox>

          {/* Large Cloud Icon - floating above the container */}
          <group position={[0.5, 0.1, 0.15]} scale={0.35}>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
            <mesh position={[-0.3, 0, 0]}>
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
            <mesh position={[-0.15, 0.05, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0.15, 0.05, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
            </mesh>
          </group>

          <Text position={[-0.5, 0.38, 0.08]} fontSize={0.04} color="#4a90d9" anchorX="left">Cloud Services</Text>

          {/* Cloud Infrastructure Visualization */}
          <group position={[0, 0, 0.06]}>
            {/* Region/Availability Zone boxes */}
            <group position={[-0.45, 0.1, 0]}>
              <RoundedBox args={[0.4, 0.35, 0.02]} radius={0.02}>
                <meshStandardMaterial color="#0f2744" />
              </RoundedBox>
              <Text position={[0, 0.12, 0.02]} fontSize={0.025} color="#4a90d9" anchorX="center">Region EU</Text>
              {/* Server icons */}
              {[-0.1, 0.1].map((x, i) => (
                <group key={i} position={[x, -0.02, 0.02]} ref={(el) => (cloudNodeRefs.current[i] = el)} scale={0}>
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
              <Text position={[0, 0.12, 0.02]} fontSize={0.025} color="#4a90d9" anchorX="center">CDN Edge</Text>
              {/* Globe/network icon */}
              <group position={[0, -0.02, 0.02]} ref={(el) => (cloudNodeRefs.current[2] = el)} scale={0}>
                <mesh>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial color="#1e3a5f" wireframe />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.5} />
                </mesh>
                {/* Orbit rings */}
                <mesh rotation={[Math.PI/2, 0, 0]}>
                  <torusGeometry args={[0.1, 0.005, 8, 32]} />
                  <meshBasicMaterial color="#4a90d9" />
                </mesh>
                <mesh rotation={[Math.PI/2, 0, Math.PI/3]}>
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
              <Text position={[-0.55, 0, 0.02]} fontSize={0.025} color="#4a90d9" anchorX="left">Storage</Text>
              {/* Storage bars */}
              {[0, 0.2, 0.4].map((x, i) => (
                <group key={i} position={[x - 0.1, 0, 0.02]}>
                  <RoundedBox args={[0.15, 0.08, 0.01]} radius={0.005}>
                    <meshBasicMaterial color="#1e3a5f" />
                  </RoundedBox>
                  {/* Usage indicator */}
                  <mesh position={[-0.04 + (0.04 * (i + 1) * 0.3), 0, 0.01]}>
                    <planeGeometry args={[0.08 * (0.3 + i * 0.25), 0.04]} />
                    <meshBasicMaterial color={i === 2 ? "#f59e0b" : "#22c55e"} />
                  </mesh>
                </group>
              ))}
              {/* Metrics */}
              <Text position={[0.55, 0, 0.02]} fontSize={0.02} color="#22c55e" anchorX="right">99.9% uptime</Text>
            </group>
          </group>

          {/* Ambient blue glow */}
          <pointLight position={[0, 0, 0.5]} intensity={0.6} color="#2563eb" distance={2} decay={2} />
        </group>
      )}

      {/* DATABASE (0, 2.5) */}
      {showDatabase && (
        <group ref={databaseRef} position={POS_DATABASE} scale={0}>
          <Billboard>
            <Text position={[0, 0.7, 0]} fontSize={0.09} color={C_DB} anchorX="center">DATABASE</Text>
            <Text position={[0, 0.58, 0]} fontSize={0.04} color="#666" anchorX="center">PostgreSQL</Text>
          </Billboard>
          {/* Core */}
          <mesh><cylinderGeometry args={[0.35, 0.35, 0.6, 32]} /><meshStandardMaterial color="#1a0b2e" metalness={0.8} roughness={0.2} /></mesh>
          {/* Glowing Rings - Animated */}
          {[0.2, 0, -0.2].map((y, i) => (
             <mesh 
                key={i} 
                position={[0, y, 0]} 
                ref={(el) => (databaseRingRefs.current[i] = el)}
                scale={0} // Start invisible
             >
               <cylinderGeometry args={[0.36, 0.36, 0.02, 32]} />
               <meshStandardMaterial color={C_DB} emissive={C_DB} emissiveIntensity={2} toneMapped={false} />
             </mesh>
          ))}

        </group>
      )}

      {/* ========== MIDDLE ROW ========== */}

      {/* CI/CD (-3.2, 0) */}
      {showCICD && (
        <group ref={cicdRef} position={POS_CICD} scale={0}>
          <Text position={[0, 0.85, 0]} fontSize={0.09} color={C_SAAS} anchorX="center">CI/CD</Text>
          <Text position={[0, 0.73, 0]} fontSize={0.04} color="#666" anchorX="center">Pipeline</Text>

          {/* Main Pipeline Container - Dark with orange glow */}
          <RoundedBox args={[1.6, 1.1, 0.08]} radius={0.04} smoothness={4}>
             <meshStandardMaterial color="#1a1008" metalness={0.7} roughness={0.3} />
          </RoundedBox>

          {/* Orange border glow */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.65, 1.15]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.15} />
          </mesh>

          {/* Pipeline Header Bar */}
          <RoundedBox args={[1.5, 0.12, 0.02]} radius={0.02} position={[0, 0.42, 0.05]}>
            <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.3} />
          </RoundedBox>
          <Text position={[-0.55, 0.42, 0.07]} fontSize={0.05} color="#ffffff" anchorX="left">main</Text>
          <Text position={[0.55, 0.42, 0.07]} fontSize={0.035} color="#ffffff" anchorX="right">running...</Text>

          {/* Pipeline Stages Container */}
          <group position={[0, 0.05, 0.05]}>
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
              <Text position={[0, -0.08, 0.02]} fontSize={0.028} color="#ff9944" anchorX="center">Checkout</Text>
              {/* Status indicator - success */}
              <mesh position={[0.12, 0.08, 0.02]}>
                <circleGeometry args={[0.025, 16]} />
                <meshBasicMaterial color="#22c55e" />
              </mesh>
            </group>

            {/* Arrow 1->2 */}
            <group position={[-0.3, 0.15, 0.02]}>
              <Line points={[[0, 0, 0], [0.15, 0, 0]]} color="#ff6600" lineWidth={3} />
              <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
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
              <Text position={[0, -0.08, 0.02]} fontSize={0.028} color="#ff9944" anchorX="center">Build</Text>
              {/* Status indicator - success */}
              <mesh position={[0.12, 0.08, 0.02]}>
                <circleGeometry args={[0.025, 16]} />
                <meshBasicMaterial color="#22c55e" />
              </mesh>
            </group>

            {/* Arrow 2->3 */}
            <group position={[0.25, 0.15, 0.02]}>
              <Line points={[[0, 0, 0], [0.15, 0, 0]]} color="#ff6600" lineWidth={3} />
              <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
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
              <Text position={[0, -0.08, 0.02]} fontSize={0.028} color="#ff9944" anchorX="center">Test</Text>
              {/* Status indicator - running (orange pulse) */}
              <mesh position={[0.12, 0.08, 0.02]}>
                <circleGeometry args={[0.025, 16]} />
                <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={1.5} toneMapped={false} />
              </mesh>
            </group>

            {/* Second Row - Deploy stages */}
            {/* Arrow down from Test */}
            <group position={[0.55, -0.02, 0.02]}>
              <Line points={[[0, 0, 0], [0, -0.1, 0]]} color="#ff6600" lineWidth={3} dashed dashSize={0.02} gapSize={0.02} />
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
              <Text position={[0, -0.06, 0.02]} fontSize={0.025} color="#888" anchorX="center">Staging</Text>
              {/* Status indicator - pending */}
              <mesh position={[0.12, 0.05, 0.02]}>
                <circleGeometry args={[0.02, 16]} />
                <meshBasicMaterial color="#444" />
              </mesh>
            </group>

            {/* Arrow to Production */}
            <group position={[0.25, -0.25, 0.02]}>
              <Line points={[[0.12, 0, 0], [-0.12, 0, 0]]} color="#444" lineWidth={2} dashed dashSize={0.02} gapSize={0.02} />
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
              <Text position={[0, -0.06, 0.02]} fontSize={0.025} color="#888" anchorX="center">Production</Text>
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
              <Text position={[-0.22, 0.05, 0.01]} fontSize={0.02} color="#ff6600" anchorX="left">$ npm run build</Text>
              <Text position={[-0.22, 0.02, 0.01]} fontSize={0.018} color="#888" anchorX="left">Building...</Text>
              <Text position={[-0.22, -0.01, 0.01]} fontSize={0.018} color="#22c55e" anchorX="left">✓ Compiled</Text>
              <Text position={[-0.22, -0.04, 0.01]} fontSize={0.018} color="#ff9944" anchorX="left">Running tests...</Text>
            </group>
          </group>

          {/* Ambient orange glow */}
          <pointLight position={[0, 0, 0.5]} intensity={0.8} color="#ff6600" distance={2} decay={2} />
        </group>
      )}

      {/* SERVER (0, 0) */}
      {showServer && (
        <group ref={serverRef} position={POS_SERVER} scale={0}>
          <Text position={[0, 0.85, 0]} fontSize={0.09} color={C_SERVER} anchorX="center">SERVEUR</Text>
          <Text position={[0, 0.73, 0]} fontSize={0.04} color="#666" anchorX="center">Node.js</Text>
          
          {/* Main Cabinet Frame */}
          <RoundedBox args={[0.9, 1.4, 0.5]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          
          {/* Internal Glow for realism */}
          <pointLight position={[0,0,0.2]} intensity={0.5} color={C_SERVER} distance={1} decay={2} />

          {/* Detailed Server Blades - Animated Appearance */}
          {Array.from({ length: 8 }).map((_, i) => {
            // Logic moved to useFrame for persistence and decoupling from scroll
            return (
              <group key={i} ref={(el) => (bladeRefs.current[i] = el)}>
                {/* Blade Face Plate */}
                <RoundedBox args={[0.82, 0.14, 0.02]} radius={0.005} smoothness={2}>
                  <meshStandardMaterial color="#111" metalness={0.9} roughness={0.5} />
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
                             <meshBasicMaterial 
                                 name="led_green"
                                 color="#00ff00"
                             />
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
                           Math.sin(Date.now() * 0.02 + i * 20) > 0 ? "#22cc22" : "#111"
                        } 
                     />
                   </mesh>
                </group>
              </group>
            )
          })}
        </group>
      )}

      {/* TESTING (3.2, 0) */}
      {showTesting && (
        <group ref={testingRef} position={POS_TESTING} scale={0}>
          <Text position={[0, 0.85, 0]} fontSize={0.09} color={C_TEST} anchorX="center">TESTING</Text>
          <Text position={[0, 0.73, 0]} fontSize={0.04} color="#666" anchorX="center">Quality Assurance</Text>

          {/* Main Container - Test report style */}
          <RoundedBox args={[1.5, 1.0, 0.08]} radius={0.04} smoothness={4}>
            <meshStandardMaterial color="#0a1a0a" metalness={0.7} roughness={0.3} />
          </RoundedBox>

          {/* Green border glow */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.55, 1.05]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.1} />
          </mesh>

          {/* Header bar with status */}
          <RoundedBox args={[1.4, 0.1, 0.02]} radius={0.02} position={[0, 0.38, 0.05]}>
            <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} />
          </RoundedBox>
          <Text position={[-0.55, 0.38, 0.07]} fontSize={0.04} color="#22c55e" anchorX="left">Test Results</Text>
          <Text position={[0.55, 0.38, 0.07]} fontSize={0.03} color="#22c55e" anchorX="right">PASSED</Text>

          {/* Test Suite Results */}
          <group position={[0, 0.05, 0.05]}>
            {/* Test suites */}
            {[
              { name: "Unit Tests", passed: 142, failed: 0, y: 0.18 },
              { name: "Integration", passed: 38, failed: 0, y: 0.02 },
              { name: "E2E Tests", passed: 24, failed: 1, y: -0.14 },
            ].map((suite, i) => (
              <group
                key={i}
                position={[-0.55, suite.y, 0]}
                ref={(el) => (checklistRefs.current[i] = el)}
                scale={0}
              >
                {/* Suite container */}
                <RoundedBox args={[1.3, 0.12, 0.01]} radius={0.01}>
                  <meshStandardMaterial color="#0f1f0f" />
                </RoundedBox>

                {/* Status icon */}
                <group position={[-0.55, 0, 0.01]}>
                  {suite.failed === 0 ? (
                    <>
                      {/* Checkmark */}
                      <mesh position={[0, 0, 0]}>
                        <circleGeometry args={[0.035, 16]} />
                        <meshBasicMaterial color="#166534" />
                      </mesh>
                      <Line
                        points={[[-0.015, 0, 0.01], [-0.005, -0.012, 0.01], [0.02, 0.015, 0.01]]}
                        color="#22c55e"
                        lineWidth={3}
                      />
                    </>
                  ) : (
                    <>
                      {/* Warning */}
                      <mesh>
                        <circleGeometry args={[0.035, 16]} />
                        <meshBasicMaterial color="#854d0e" />
                      </mesh>
                      <Text position={[0, -0.005, 0.01]} fontSize={0.04} color="#fbbf24" anchorX="center">!</Text>
                    </>
                  )}
                </group>

                {/* Suite name */}
                <Text position={[-0.4, 0, 0.01]} fontSize={0.03} color="#a3e635" anchorX="left">{suite.name}</Text>

                {/* Results */}
                <group position={[0.35, 0, 0.01]}>
                  <Text position={[0, 0, 0]} fontSize={0.025} color="#22c55e" anchorX="center">
                    {suite.passed} passed
                  </Text>
                </group>
                <group position={[0.55, 0, 0.01]}>
                  <Text
                    position={[0, 0, 0]}
                    fontSize={0.025}
                    color={suite.failed > 0 ? "#fbbf24" : "#666"}
                    anchorX="center"
                  >
                    {suite.failed} failed
                  </Text>
                </group>

                {/* Progress bar */}
                <group position={[0, -0.04, 0.01]}>
                  <mesh position={[0.1, 0, 0]}>
                    <planeGeometry args={[0.9, 0.015]} />
                    <meshBasicMaterial color="#1a2a1a" />
                  </mesh>
                  <mesh position={[0.1 - (0.45 * suite.failed / (suite.passed + suite.failed)), 0, 0.001]}>
                    <planeGeometry args={[0.9 * (suite.passed / (suite.passed + suite.failed)), 0.015]} />
                    <meshBasicMaterial color="#22c55e" />
                  </mesh>
                </group>
              </group>
            ))}

            {/* Coverage summary */}
            <group position={[0, -0.32, 0]}>
              <RoundedBox args={[1.3, 0.1, 0.01]} radius={0.01}>
                <meshStandardMaterial color="#0f1f0f" />
              </RoundedBox>
              <Text position={[-0.55, 0, 0.01]} fontSize={0.025} color="#a3e635" anchorX="left">Coverage</Text>
              {/* Coverage bar */}
              <mesh position={[0.1, 0, 0.01]}>
                <planeGeometry args={[0.6, 0.04]} />
                <meshBasicMaterial color="#1a2a1a" />
              </mesh>
              <mesh position={[0.1 - 0.06, 0, 0.015]}>
                <planeGeometry args={[0.48, 0.04]} />
                <meshBasicMaterial color="#22c55e" />
              </mesh>
              <Text position={[0.55, 0, 0.01]} fontSize={0.03} color="#22c55e" anchorX="right">87%</Text>
            </group>
          </group>

          {/* Ambient green glow */}
          <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#22c55e" distance={2} decay={2} />
        </group>
      )}

      {/* ========== BOTTOM ROW ========== */}

      {/* FRONTEND (-3.2, -2.5) */}
      {showFrontend && (
        <group ref={frontendRef} position={POS_FRONTEND} scale={0}>
          <Text position={[0, 0.9, 0]} fontSize={0.1} color={C_FRONT} anchorX="center">APP WEB</Text>
          <Text position={[0, 0.78, 0]} fontSize={0.04} color="#666" anchorX="center">React / Remix</Text>
          
          {/* Wireframe Mode (Initial state hint) */}
          <group scale={1.02} position={[0,0,-0.1]}>
             <RoundedBox args={[2, 1.4, 0.05]} radius={0.04}>
               <meshBasicMaterial color={C_FRONT} wireframe opacity={0.3} transparent />
             </RoundedBox>
          </group>

          {/* Main Monitor */}
          <RoundedBox args={[2, 1.4, 0.06]} radius={0.04} smoothness={4} position={[0, 0, -0.03]}>
            <meshStandardMaterial color="#1e1e2e" metalness={0.6} roughness={0.3} />
          </RoundedBox>
          
          {/* Screen Content */}
          <RoundedBox args={[1.85, 1.28, 0.02]} radius={0.03} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color="#0a0a18" />
          </RoundedBox>
          
          {/* Animated UI Blocks (Restored!) */}
          <group position={[0, 0, 0.02]}>
             {/* Header */}
            <group ref={uiBlock1} scale={0}>
                <RoundedBox args={[1.75, 0.15, 0.01]} radius={0.02} position={[0, 0.5, 0]}>
                   <meshStandardMaterial color="#16162a" />
                </RoundedBox>
            </group>
            {/* Sidebar */}
            <group ref={uiBlock2} scale={0}>
                <RoundedBox args={[0.4, 0.9, 0.01]} radius={0.02} position={[-0.65, -0.1, 0]}>
                   <meshStandardMaterial color="#1f1f3a" />
                </RoundedBox>
            </group>
            {/* Hero Section (Flying in) */}
             <group ref={uiBlock3} scale={0}>
                 <RoundedBox args={[1.2, 0.4, 0.01]} radius={0.02} position={[0.2, 0.15, 0.02]}>
                   <meshStandardMaterial color="#3a3a5e" />
                </RoundedBox>
                 {/* Card Grid */}
                 {[-0.2, -0.5].map((y, i) => (
                   <group key={i} position={[0.2, y, 0]}>
                      {[-0.4, 0, 0.4].map((x, j) => (
                         <RoundedBox key={j} args={[0.35, 0.2, 0.01]} radius={0.01} position={[x, 0, 0.02]}>
                            <meshStandardMaterial color="#2a2a4e" />
                         </RoundedBox>
                      ))}
                   </group>
                 ))}
             </group>
          </group>
        </group>
      )}

      {/* MOBILE (0, -2.5) */}
      {showMobile && (
        <group ref={mobileRef} position={POS_MOBILE} scale={0}>
          <Text position={[0, 0.85, 0]} fontSize={0.09} color={C_MOBILE} anchorX="center">MOBILE</Text>
          <Text position={[0, 0.73, 0]} fontSize={0.04} color="#666" anchorX="center">Native App</Text>
          {/* Phone Body */}
          <RoundedBox args={[0.5, 0.9, 0.05]} radius={0.05} smoothness={4}>
            <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          {/* Screen */}
          <RoundedBox args={[0.44, 0.82, 0.01]} radius={0.035} position={[0, 0, 0.03]}>
            <meshStandardMaterial color="#000000" />
          </RoundedBox>
          {/* App UI */}
          <group position={[0, 0, 0.04]}>
             {/* Header */}
             <mesh position={[0, 0.35, 0]}><planeGeometry args={[0.4, 0.08]} /><meshBasicMaterial color={C_MOBILE} /></mesh>
             {/* Chat Bubbles */}
             {[0.15, 0, -0.15].map((y, i) => (
                <group key={i} ref={(el) => (chatBubbleRefs.current[i] = el)} scale={0}>
                    <RoundedBox args={[0.35, 0.08, 0.005]} radius={0.02} position={[0, y, 0]}>
                       <meshBasicMaterial color={i%2==0 ? "#333" : "#555"} />
                    </RoundedBox>
                </group>
             ))}
          </group>
          {/* Notch & Home Bar */}
          <RoundedBox args={[0.15, 0.02, 0.012]} radius={0.008} position={[0, 0.36, 0.035]}>
            <meshStandardMaterial color="#000000" />
          </RoundedBox>
        </group>
      )}

      {/* BACKOFFICE (3.2, -2.5) */}
      {showBackoffice && (
        <group ref={backofficeRef} position={POS_BACKOFFICE} scale={0}>
          <Text position={[0, 0.85, 0]} fontSize={0.09} color={C_BACK} anchorX="center">BACKOFFICE</Text>
          <Text position={[0, 0.73, 0]} fontSize={0.04} color="#666" anchorX="center">Admin Dashboard</Text>

          {/* Main Container */}
          <RoundedBox args={[1.6, 1.1, 0.08]} radius={0.04} smoothness={4}>
            <meshStandardMaterial color="#1a1510" metalness={0.7} roughness={0.3} />
          </RoundedBox>

          {/* Gold/Orange border glow */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.65, 1.15]} />
            <meshBasicMaterial color={C_BACK} transparent opacity={0.12} />
          </mesh>

          {/* Header bar */}
          <RoundedBox args={[1.5, 0.1, 0.02]} radius={0.02} position={[0, 0.43, 0.05]}>
            <meshStandardMaterial color="#332200" emissive={C_BACK} emissiveIntensity={0.2} />
          </RoundedBox>
          <Text position={[-0.6, 0.43, 0.07]} fontSize={0.04} color={C_BACK} anchorX="left">Dashboard</Text>
          <Text position={[0.6, 0.43, 0.07]} fontSize={0.025} color="#888" anchorX="right">Admin</Text>

          {/* Dashboard Content */}
          <group position={[0, 0, 0.05]}>

            {/* TOP ROW: KPI Cards */}
            <group position={[0, 0.25, 0]} ref={(el) => (chartRefs.current[0] = el)} scale={0}>
              {[
                { label: "Users", value: "12,847", color: "#22c55e", x: -0.52 },
                { label: "Revenue", value: "$48.2K", color: C_BACK, x: -0.17 },
                { label: "Orders", value: "1,284", color: "#3b82f6", x: 0.17 },
                { label: "Growth", value: "+24%", color: "#a855f7", x: 0.52 },
              ].map((kpi, i) => (
                <group key={i} position={[kpi.x, 0, 0]}>
                  <RoundedBox args={[0.3, 0.15, 0.01]} radius={0.01}>
                    <meshStandardMaterial color="#1a1a1a" />
                  </RoundedBox>
                  <Text position={[0, 0.03, 0.01]} fontSize={0.018} color="#666" anchorX="center">{kpi.label}</Text>
                  <Text position={[0, -0.025, 0.01]} fontSize={0.028} color={kpi.color} anchorX="center">{kpi.value}</Text>
                </group>
              ))}
            </group>

            {/* MIDDLE ROW: Charts */}
            {/* Line Chart - Left */}
            <group position={[-0.4, -0.02, 0]} ref={(el) => (chartRefs.current[1] = el)} scale={0}>
              <RoundedBox args={[0.65, 0.4, 0.01]} radius={0.01}>
                <meshStandardMaterial color="#141414" />
              </RoundedBox>
              <Text position={[0, 0.15, 0.01]} fontSize={0.025} color="#888" anchorX="center">Traffic Overview</Text>
              {/* Grid lines */}
              {[-0.1, 0, 0.1].map((y, i) => (
                <Line key={i} points={[[-0.28, y - 0.02, 0.01], [0.28, y - 0.02, 0.01]]} color="#222" lineWidth={1} />
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
                  [0.28, 0.05, 0.015]
                ]}
                color={C_BACK}
                lineWidth={2}
              />
              {/* Data points */}
              {[[-0.28, -0.12], [-0.2, -0.05], [-0.1, -0.08], [0, 0.02], [0.1, -0.02], [0.2, 0.08], [0.28, 0.05]].map((p, i) => (
                <mesh key={i} position={[p[0], p[1], 0.02]}>
                  <circleGeometry args={[0.015, 12]} />
                  <meshBasicMaterial color={C_BACK} />
                </mesh>
              ))}
            </group>

            {/* Donut Chart - Right */}
            <group position={[0.4, -0.02, 0]} ref={(el) => (chartRefs.current[2] = el)} scale={0}>
              <RoundedBox args={[0.65, 0.4, 0.01]} radius={0.01}>
                <meshStandardMaterial color="#141414" />
              </RoundedBox>
              <Text position={[0, 0.15, 0.01]} fontSize={0.025} color="#888" anchorX="center">Revenue Sources</Text>

              {/* Donut chart using torus segments */}
              <group position={[0, -0.03, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
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
              <Text position={[0, -0.03, 0.02]} fontSize={0.03} color="#fff" anchorX="center">$48.2K</Text>

              {/* Legend */}
              <group position={[0.22, -0.03, 0.01]}>
                <mesh position={[0, 0.05, 0]}><circleGeometry args={[0.012, 8]} /><meshBasicMaterial color={C_BACK} /></mesh>
                <Text position={[0.04, 0.05, 0]} fontSize={0.015} color="#888" anchorX="left">Products</Text>
                <mesh position={[0, 0.02, 0]}><circleGeometry args={[0.012, 8]} /><meshBasicMaterial color="#3b82f6" /></mesh>
                <Text position={[0.04, 0.02, 0]} fontSize={0.015} color="#888" anchorX="left">Services</Text>
                <mesh position={[0, -0.01, 0]}><circleGeometry args={[0.012, 8]} /><meshBasicMaterial color="#a855f7" /></mesh>
                <Text position={[0.04, -0.01, 0]} fontSize={0.015} color="#888" anchorX="left">Other</Text>
              </group>
            </group>

            {/* BOTTOM ROW: Recent Activity */}
            <group position={[0, -0.35, 0]} ref={(el) => (chartRefs.current[3] = el)} scale={0}>
              <RoundedBox args={[1.4, 0.18, 0.01]} radius={0.01}>
                <meshStandardMaterial color="#141414" />
              </RoundedBox>
              <Text position={[-0.6, 0.05, 0.01]} fontSize={0.022} color="#888" anchorX="left">Recent Activity</Text>

              {/* Activity items */}
              {[
                { text: "New order #1284", time: "2m ago", x: -0.45 },
                { text: "User registered", time: "5m ago", x: 0 },
                { text: "Payment received", time: "12m ago", x: 0.45 },
              ].map((item, i) => (
                <group key={i} position={[item.x, -0.03, 0.01]}>
                  <mesh position={[-0.12, 0, 0]}>
                    <circleGeometry args={[0.015, 12]} />
                    <meshBasicMaterial color={i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : C_BACK} />
                  </mesh>
                  <Text position={[-0.08, 0.01, 0]} fontSize={0.016} color="#ccc" anchorX="left">{item.text}</Text>
                  <Text position={[-0.08, -0.02, 0]} fontSize={0.012} color="#666" anchorX="left">{item.time}</Text>
                </group>
              ))}
            </group>
          </group>

          {/* Ambient gold glow */}
          <pointLight position={[0, 0, 0.5]} intensity={0.5} color={C_BACK} distance={2} decay={2} />
        </group>
      )}

      {/* ========== PARTICLE CONNECTIONS (Updated per diagram) ========== */}
      {/* ========== PARTICLE CONNECTIONS (Updated per diagram) ========== */}
      {/* Lines always visible, Particles only on final dezoom (> 88%) */}
      
      {/* 1. Cloud <-> BDD (Top Horiz) */}
      {showCloud && showDatabase && <ParticleStream start={P_CLOUD} end={P_DB} startColor={C_CLOUD} endColor={C_DB} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_CLOUD, T_DB))} />}

      {/* 2. Cloud <-> CI/CD (Vertical Left) */}
      {showCloud && showCICD && <ParticleStream start={P_CLOUD} end={P_CICD} startColor={C_CLOUD} endColor={C_SAAS} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_CLOUD, T_CICD))} />}

      {/* 3. BDD <-> Testing (Diagonal from Top Mid to Mid Right) */}
      {showDatabase && showTesting && <ParticleStream start={P_DB} end={P_TEST} startColor={C_DB} endColor={C_TEST} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_DB, T_TEST))} />}

      {/* 4. CI/CD <-> Server (Mid Horizontal) */}
      {showCICD && showServer && <ParticleStream start={P_CICD} end={P_SERVER} startColor={C_SAAS} endColor={C_SERVER} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_CICD, T_SERVER))} />}

      {/* 5. Server <-> Testing (Mid Horizontal) */}
      {showServer && showTesting && <ParticleStream start={P_SERVER} end={P_TEST} startColor={C_SERVER} endColor={C_TEST} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_SERVER, T_TEST))} />}

      {/* 6. CI/CD <-> Frontend (Vertical Left) */}
      {showCICD && showFrontend && <ParticleStream start={P_CICD} end={P_FRONT} startColor={C_SAAS} endColor={C_FRONT} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_CICD, T_FRONT))} />}

      {/* 7. Frontend <-> Mobile (REMOVED) */}
       {/* {showFrontend && showMobile && <ParticleStream start={P_FRONT} end={P_MOBILE} color="#00f0ff" />} */}

      {/* 8. Mobile <-> Backoffice (Bot Horizontal) */}
      {showMobile && showBackoffice && <ParticleStream start={P_MOBILE} end={P_BACK} startColor={C_MOBILE} endColor={C_BACK} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_MOBILE, T_BACK))} />}

      {/* 9. Testing <-> Backoffice (Vertical Right) */}
      {showTesting && showBackoffice && <ParticleStream start={P_TEST} end={P_BACK} startColor={C_TEST} endColor={C_BACK} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_TEST, T_BACK))} />}

      {/* 10. Frontend <-> Server (Diagonal) - User Request */}
      {showFrontend && showServer && <ParticleStream start={P_FRONT} end={P_SERVER} startColor={C_FRONT} endColor={C_SERVER} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_FRONT, T_SERVER))} />}

      {/* 11. CI/CD <-> Mobile (Diagonal) - User Request */}
      {showCICD && showMobile && <ParticleStream start={P_CICD} end={P_MOBILE} startColor={C_SAAS} endColor={C_MOBILE} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_CICD, T_MOBILE))} />}

      {/* 12. Database <-> Server (Vertical Center) - NEW Request */}
      {showDatabase && showServer && <ParticleStream start={P_DB} end={P_SERVER} startColor={C_DB} endColor={C_SERVER} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_DB, T_SERVER))} />}

      {/* 13. Server <-> Mobile (Vertical Center) - NEW Request */}
      {showServer && showMobile && <ParticleStream start={P_SERVER} end={P_MOBILE} startColor={C_SERVER} endColor={C_MOBILE} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_SERVER, T_MOBILE))} />}

      {/* 14. Server <-> Backoffice (Diagonal) - NEW Request */}
      {showServer && showBackoffice && <ParticleStream start={P_SERVER} end={P_BACK} startColor={C_SERVER} endColor={C_BACK} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_SERVER, T_BACK))} />}

      {/* 15. Server <-> Cloud (Vertical Center to Top) - NEW Request */}
      {showServer && showCloud && <ParticleStream start={P_SERVER} end={P_CLOUD} startColor={C_SERVER} endColor={C_CLOUD} showParticles={offset > 0.94} opacity={getLinkOpacity(Math.max(T_SERVER, T_CLOUD))} />}

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
