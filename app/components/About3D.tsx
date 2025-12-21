import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Floating particles around the card
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 3;

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
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    particlesRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Glowing orbs floating around
function FloatingOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null);
  const orb2Ref = useRef<THREE.Mesh>(null);
  const orb3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(t * 0.5) * 3;
      orb1Ref.current.position.y = Math.cos(t * 0.3) * 2 + 1;
      orb1Ref.current.position.z = Math.sin(t * 0.4) * 2 + 1;
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(t * 0.4) * 3.5;
      orb2Ref.current.position.y = Math.sin(t * 0.5) * 1.5 - 1;
      orb2Ref.current.position.z = Math.cos(t * 0.3) * 2;
    }
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(t * 0.6 + Math.PI) * 2.5;
      orb3Ref.current.position.y = Math.cos(t * 0.4 + Math.PI) * 2;
      orb3Ref.current.position.z = Math.sin(t * 0.5) * 1.5 + 0.5;
    }
  });

  return (
    <group>
      <mesh ref={orb1Ref}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
      </mesh>
      <mesh ref={orb2Ref}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
      </mesh>
      <mesh ref={orb3Ref}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Glass card background with animated gradients
function GlassCard() {
  const cardRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const borderRef = useRef<THREE.Mesh>(null);

  // Create gradient shader material
  const gradientMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.85 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;

        void main() {
          // Animated gradient spots
          vec2 center1 = vec2(0.2 + sin(time * 0.3) * 0.2, 0.4 + cos(time * 0.4) * 0.2);
          vec2 center2 = vec2(0.8 + cos(time * 0.35) * 0.15, 0.6 + sin(time * 0.45) * 0.15);

          float dist1 = distance(vUv, center1);
          float dist2 = distance(vUv, center2);

          // Cyan spot
          vec3 color1 = vec3(0.024, 0.714, 0.831) * (1.0 - smoothstep(0.0, 0.5, dist1)) * 0.15;
          // Violet spot
          vec3 color2 = vec3(0.545, 0.361, 0.965) * (1.0 - smoothstep(0.0, 0.6, dist2)) * 0.12;

          // Base dark glass color
          vec3 baseColor = vec3(0.02, 0.02, 0.04);

          // Combine
          vec3 finalColor = baseColor + color1 + color2;

          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
    });
  }, []);

  useFrame((state) => {
    gradientMaterial.uniforms.time.value = state.clock.elapsedTime;

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[5.4, 6.4]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main glass card */}
      <RoundedBox
        ref={cardRef}
        args={[5, 6, 0.08]}
        radius={0.15}
        smoothness={4}
      >
        <primitive object={gradientMaterial} attach="material" />
      </RoundedBox>

      {/* Top highlight line */}
      <mesh position={[0, 2.95, 0.05]}>
        <planeGeometry args={[4.5, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Border glow */}
      <RoundedBox
        ref={borderRef}
        args={[5.08, 6.08, 0.02]}
        radius={0.16}
        smoothness={4}
        position={[0, 0, -0.02]}
      >
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </RoundedBox>
    </group>
  );
}

// Name and title text
function ProfileText() {
  return (
    <group position={[0, 0.6, 0.1]}>
      {/* Name */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        Eden Wisniewski
      </Text>

      {/* Role with gradient effect */}
      <Text
        position={[0, -0.45, 0]}
        fontSize={0.22}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        Fullstack Developer
      </Text>

      {/* Available status */}
      <group position={[0, -0.85, 0]}>
        <mesh position={[-0.6, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <Text
          position={[0.1, 0, 0]}
          fontSize={0.12}
          color="#9ca3af"
          anchorX="center"
          anchorY="middle"
        >
          Available for work
        </Text>
      </group>
    </group>
  );
}

// Bio section
function BioSection() {
  return (
    <group position={[0, -0.5, 0.1]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.13}
        color="#d1d5db"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
        lineHeight={1.4}
        textAlign="center"
      >
        {`Passionate developer with 5+ years of experience\ncreating modern web applications.\nBased in Lyon, France.`}
      </Text>
    </group>
  );
}

// Experience highlight card
function ExperienceCard() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
  });

  return (
    <group position={[0, -1.4, 0.08]}>
      {/* Inner glass card */}
      <RoundedBox args={[4.2, 0.9, 0.02]} radius={0.1} smoothness={4}>
        <meshBasicMaterial
          ref={matRef}
          color="#ffffff"
          transparent
          opacity={0.06}
        />
      </RoundedBox>

      {/* Inner border */}
      <RoundedBox
        args={[4.22, 0.92, 0.01]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, -0.01]}
      >
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.02]}
        fontSize={0.11}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.8}
        lineHeight={1.4}
        textAlign="center"
      >
        {`React · Node.js · TypeScript · Three.js\nAWS · Docker · PostgreSQL`}
      </Text>
    </group>
  );
}

// CTA Button
function CTAButton() {
  const buttonRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    if (buttonRef.current) {
      buttonRef.current.position.y =
        -2.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group ref={buttonRef} position={[0, -2.3, 0.1]}>
      {/* Glow */}
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <planeGeometry args={[3.8, 0.7]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      {/* Button background */}
      <RoundedBox args={[3.5, 0.55, 0.03]} radius={0.12} smoothness={4}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </RoundedBox>

      {/* Button border */}
      <RoundedBox
        args={[3.52, 0.57, 0.02]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, -0.01]}
      >
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.03]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Contact Me
      </Text>
    </group>
  );
}

// Section angle for About (270° = 3π/2)
const SECTION_ANGLE = (Math.PI * 3) / 2;
const ORBIT_RADIUS = 15;

export default function About3D() {
  const posX = Math.sin(SECTION_ANGLE) * ORBIT_RADIUS;
  const posZ = Math.cos(SECTION_ANGLE) * ORBIT_RADIUS;
  const rotationY = SECTION_ANGLE;

  return (
    <group position={[posX, 0, posZ]} rotation={[0, rotationY, 0]}>
      <Float rotationIntensity={0.03} floatIntensity={0.08} speed={1.2}>
        {/* Main glass card */}
        <GlassCard />

        {/* Name and title */}
        <ProfileText />

        {/* Bio */}
        <BioSection />

        {/* Experience/Skills highlight */}
        <ExperienceCard />

        {/* CTA Button */}
        <CTAButton />
      </Float>

      {/* Ambient decorations */}
      <FloatingParticles />
      <FloatingOrbs />
    </group>
  );
}
