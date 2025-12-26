import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';

interface Project {
  id: string;
  titleKey: string;
  color: string;
  accentColor: string;
  tags: string[];
  type: 'web' | 'mobile' | 'dashboard';
}

const projects: Project[] = [
  {
    id: 'nova-fashion',
    titleKey: 'portfolio.projects.novaFashion.title',
    color: '#8B5CF6',
    accentColor: '#C4B5FD',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    type: 'web',
  },
  {
    id: 'pulse-analytics',
    titleKey: 'portfolio.projects.pulseAnalytics.title',
    color: '#06B6D4',
    accentColor: '#67E8F9',
    tags: ['React', 'Node.js', 'D3.js'],
    type: 'dashboard',
  },
  {
    id: 'tchee',
    titleKey: 'portfolio.projects.tchee.title',
    color: '#5DD3F3',
    accentColor: '#A7E8F9',
    tags: ['React Native', 'Expo', 'Stripe'],
    type: 'mobile',
  },
];

// Floating particles around the portfolio
function PortfolioParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const radius = 4 + Math.random() * 6;
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.06} color="#06b6d4" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// 3D Browser Frame
function BrowserFrame3D({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[2.4, 1.5, 0.06]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.8} />
      </RoundedBox>

      {/* Top bar */}
      <mesh position={[0, 0.62, 0.035]}>
        <boxGeometry args={[2.3, 0.15, 0.01]} />
        <meshStandardMaterial color="#252540" />
      </mesh>

      {/* Traffic lights */}
      <mesh position={[-0.95, 0.62, 0.04]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.85, 0.62, 0.04]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <mesh position={[-0.75, 0.62, 0.04]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Accent line */}
      <mesh position={[0, -0.73, 0.035]}>
        <boxGeometry args={[2.3, 0.025, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>

      {/* Screen content placeholder */}
      <mesh position={[0, -0.05, 0.035]}>
        <planeGeometry args={[2.2, 1.15]} />
        <meshBasicMaterial color="#0a0a14" />
      </mesh>
    </group>
  );
}

// 3D Phone Frame
function PhoneFrame3D({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[1, 2, 0.08]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.6} />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[0.88, 1.85, 0.04]} radius={0.08} smoothness={4} position={[0, 0, 0.025]}>
        <meshStandardMaterial color="#0a0a14" />
      </RoundedBox>

      {/* Notch */}
      <mesh position={[0, 0.85, 0.05]}>
        <boxGeometry args={[0.25, 0.05, 0.01]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>

      {/* Home indicator */}
      <mesh position={[0, -0.85, 0.05]}>
        <boxGeometry args={[0.3, 0.03, 0.01]} />
        <meshBasicMaterial color="#333" />
      </mesh>

      {/* Side accent */}
      <mesh position={[0.52, 0, 0]}>
        <boxGeometry args={[0.015, 0.6, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// 3D Dashboard Frame
function DashboardFrame3D({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[2.8, 1.7, 0.06]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#0d1a2d" metalness={0.2} roughness={0.8} />
      </RoundedBox>

      {/* Sidebar */}
      <mesh position={[-1.15, 0, 0.035]}>
        <boxGeometry args={[0.35, 1.6, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Sidebar icons */}
      {[-0.4, -0.15, 0.1, 0.35].map((y, i) => (
        <mesh key={i} position={[-1.15, y, 0.04]}>
          <boxGeometry args={[0.12, 0.12, 0.01]} />
          <meshBasicMaterial color={i === 0 ? color : '#333'} transparent opacity={i === 0 ? 1 : 0.4} />
        </mesh>
      ))}

      {/* Main content area */}
      <mesh position={[0.2, 0, 0.035]}>
        <planeGeometry args={[1.95, 1.5]} />
        <meshBasicMaterial color="#0a0a14" />
      </mesh>

      {/* Accent */}
      <mesh position={[0, -0.83, 0.035]}>
        <boxGeometry args={[2.7, 0.025, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Project Card
function ProjectCard3D({ project, index, total }: { project: Project; index: number; total: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);
  const { t } = useTranslation('common');

  // Position cards in an arc - more spread out
  const angle = ((index - (total - 1) / 2) / total) * Math.PI * 0.65;
  const radius = 6;
  const xPos = Math.sin(angle) * radius;
  const zPos = -Math.cos(angle) * radius + radius;
  const rotationY = -angle * 0.7;

  // Scale factor for bigger devices
  const deviceScale = 1.25;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    // Subtle floating animation
    groupRef.current.position.y = Math.sin(time * 0.6 + index * 1.2) * 0.08;

    // Subtle rotation animation on content
    if (contentRef.current) {
      contentRef.current.rotation.y = Math.sin(time * 0.3 + index) * 0.02;
      contentRef.current.rotation.x = Math.cos(time * 0.4 + index) * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[xPos, 0, zPos]} rotation={[0, rotationY, 0]}>
      <group ref={contentRef} scale={deviceScale}>
        {/* Device frame */}
        {project.type === 'mobile' ? (
          <PhoneFrame3D color={project.color} />
        ) : project.type === 'dashboard' ? (
          <DashboardFrame3D color={project.color} />
        ) : (
          <BrowserFrame3D color={project.color} />
        )}

        {/* Glow behind */}
        <mesh position={[0, 0, -0.15]}>
          <planeGeometry args={[project.type === 'mobile' ? 1.3 : 3, project.type === 'mobile' ? 2.3 : 2]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.08} />
        </mesh>

        {/* Title */}
        <Text
          position={[0, project.type === 'mobile' ? -1.3 : -1.05, 0.1]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {t(project.titleKey)}
        </Text>

        {/* Type badge */}
        <group position={[project.type === 'mobile' ? 0 : -0.85, project.type === 'mobile' ? 1.2 : 0.9, 0.1]}>
          <mesh>
            <planeGeometry args={[0.5, 0.15]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.25} />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.06} color={project.accentColor} anchorX="center" anchorY="middle">
            {project.type === 'mobile' ? 'MOBILE' : project.type === 'dashboard' ? 'SAAS' : 'E-COMMERCE'}
          </Text>
        </group>

        {/* Tags */}
        <group position={[0, project.type === 'mobile' ? -1.6 : -1.35, 0.05]}>
          {project.tags.map((tag, i) => (
            <group key={tag} position={[(i - 1) * 0.55, 0, 0]}>
              <mesh>
                <planeGeometry args={[0.5, 0.12]} />
                <meshBasicMaterial color="#1a1a2e" transparent opacity={0.7} />
              </mesh>
              <Text position={[0, 0, 0.01]} fontSize={0.045} color="#888" anchorX="center" anchorY="middle">
                {tag}
              </Text>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

// Central hub
function CentralHub3D() {
  const hubRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const { t } = useTranslation('common');

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (hubRef.current) {
      hubRef.current.rotation.y = time * 0.08;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.04);
    }
  });

  return (
    <group ref={hubRef}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>

      {/* Rings */}
      {[
        { radius: 0.8, color: '#8B5CF6' },
        { radius: 1.0, color: '#06B6D4' },
        { radius: 1.2, color: '#5DD3F3' },
      ].map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.radius, 0.015, 8, 48]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.35} />
        </mesh>
      ))}

      {/* Title */}
      <Text position={[0, -1.5, 0]} fontSize={0.32} color="#ffffff" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        PORTFOLIO
      </Text>
      <Text position={[0, -1.85, 0]} fontSize={0.1} color="#06b6d4" anchorX="center" anchorY="middle" letterSpacing={0.2}>
        {t('portfolio.subtitle').toUpperCase()}
      </Text>
    </group>
  );
}

// Import section angles from scene3d
import { SECTION_ANGLES, ORBIT_RADIUS } from "./scene3d";

export default function Portfolio3D() {
  // Position on circle at portfolio section angle (144° = 4π/5)
  const angle = SECTION_ANGLES.portfolio;
  const posX = Math.sin(angle) * ORBIT_RADIUS;
  const posZ = Math.cos(angle) * ORBIT_RADIUS;
  // Rotate to be tangent to circle and face outward (toward where camera will be)
  // Content at angle θ needs rotation θ to face outward
  // When RotatingWorld rotates by -θ, the content ends up at angle 0 with rotation 0
  const rotationY = angle;

  return (
    <group position={[posX, 0, posZ]} rotation={[0, rotationY, 0]}>
      <PortfolioParticles />
      <CentralHub3D />

      {projects.map((project, index) => (
        <ProjectCard3D key={project.id} project={project} index={index} total={projects.length} />
      ))}

      {/* Lights */}
      <pointLight position={[0, 1.5, 1.5]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[-3, 1, 2]} intensity={0.25} color="#8B5CF6" />
      <pointLight position={[3, 1, 2]} intensity={0.25} color="#10B981" />
    </group>
  );
}
