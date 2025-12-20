import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Simple floating particles around the About section
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Cyan to violet gradient
      const t = Math.random();
      col[i * 3] = 0.02 + t * 0.5;
      col[i * 3 + 1] = 0.7 - t * 0.3;
      col[i * 3 + 2] = 0.8 + t * 0.2;
    }

    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Animated rings
function AnimatedRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.2;
      ring1Ref.current.rotation.y = t * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.15;
      ring2Ref.current.rotation.z = t * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.18;
      ring3Ref.current.rotation.z = -t * 0.08;
    }
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3, 0.015, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Central glowing sphere
function GlowingSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sphereRef.current) {
      sphereRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(t * 1.5) * 0.1);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Armillary Sphere - gardée pour usage futur
function ArmillarySphere() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const middleRingRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);

  const metalMaterial = useMemo(() => ({
    color: "#a8a8a8",
    metalness: 0.9,
    roughness: 0.2,
    transparent: true,
    opacity: 0.35,
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * 0.15;
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.x = t * 0.12;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={0.8}>
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.3, 32]} />
        <meshStandardMaterial {...metalMaterial} color="#707070" />
      </mesh>
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial {...metalMaterial} color="#606060" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.61, 0.015, 8, 64]} />
        <meshStandardMaterial {...metalMaterial} color="#505050" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.61, 0.015, 8, 64]} />
        <meshStandardMaterial {...metalMaterial} color="#505050" />
      </mesh>
      <group ref={innerRingRef} rotation={[0.4, 0, 0.3]}>
        <mesh>
          <torusGeometry args={[1.2, 0.04, 16, 100]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>
      <group ref={middleRingRef} rotation={[1.2, 0.5, 0]}>
        <mesh>
          <torusGeometry args={[1.6, 0.035, 16, 100]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>
      <group ref={outerRingRef} rotation={[0, 0, 0.2]}>
        <mesh>
          <torusGeometry args={[2, 0.03, 16, 100]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.025, 16, 100]} />
        <meshStandardMaterial {...metalMaterial} color="#909090" />
      </mesh>
      <group rotation={[0, 0, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 5, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
        <mesh position={[0, 2.7, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.12, 0.4, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
        <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.2, 16]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[0.08, 0.02, 8, 32]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[0, 0, -0.3]}>
        <torusGeometry args={[0.08, 0.02, 8, 32]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>
      <mesh position={[0, -1.1, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.1, 0.025, 8, 32, Math.PI]} />
        <meshStandardMaterial {...metalMaterial} color="#808080" />
      </mesh>
    </group>
  );
}

// Section angle for About (270° = 3π/2)
const SECTION_ANGLE = (Math.PI * 3) / 2;
const ORBIT_RADIUS = 15;

interface About3DProps {
  isActive?: boolean;
  isAnimating?: boolean;
}

export default function About3D({ isActive = false, isAnimating = false }: About3DProps) {
  const posX = Math.sin(SECTION_ANGLE) * ORBIT_RADIUS;
  const posZ = Math.cos(SECTION_ANGLE) * ORBIT_RADIUS;
  const rotationY = SECTION_ANGLE;

  return (
    <group position={[posX, 0, posZ]} rotation={[0, rotationY, 0]}>
      <Float rotationIntensity={0.1} floatIntensity={0.2} speed={1.5}>
        <GlowingSphere />
        <AnimatedRings />
        <FloatingParticles />
      </Float>
    </group>
  );
}

// Export pour usage futur
export { ArmillarySphere };
