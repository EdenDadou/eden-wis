import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

// Simple floating particles around the About section
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere around the section
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Cyan to violet gradient
      const t = Math.random();
      col[i * 3] = 0.02 + t * 0.5; // R
      col[i * 3 + 1] = 0.7 - t * 0.3; // G
      col[i * 3 + 2] = 0.8 + t * 0.2; // B
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

// Section angle for About (270° = 3π/2)
const SECTION_ANGLE = (Math.PI * 3) / 2;
const ORBIT_RADIUS = 15;

export default function About3D() {
  // Position on the orbital circle at 270°
  const posX = Math.sin(SECTION_ANGLE) * ORBIT_RADIUS;
  const posZ = Math.cos(SECTION_ANGLE) * ORBIT_RADIUS;
  // Rotate to face outward (toward where camera will be)
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
