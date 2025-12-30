import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import type { Experience } from './Timeline3D';

interface ProjectBlock3DProps {
  project: { name: string; description: string; tech: string[] };
  position: [number, number, number];
  color: string;
  index: number;
}

function ProjectBlock3D({ project, position, color, index }: ProjectBlock3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    // Subtle floating animation
    groupRef.current.position.x = position[0] + Math.sin(time * 0.4 + index * 0.5) * 0.08;
    groupRef.current.position.y = position[1] + Math.cos(time * 0.3 + index * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Project card */}
      <RoundedBox args={[4.5, 2, 0.15]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.1}
          roughness={0.9}
        />
      </RoundedBox>

      {/* Color accent bar on left */}
      <mesh position={[-2.1, 0, 0.1]}>
        <boxGeometry args={[0.1, 1.7, 0.05]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Glowing border effect */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[4.6, 2.1]} />
        <meshBasicMaterial color={color} opacity={0.15} transparent />
      </mesh>

      {/* Project name */}
      <Text
        position={[0, 0.55, 0.1]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {project.name}
      </Text>

      {/* Description */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.12}
        color="rgba(255,255,255,0.7)"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
        textAlign="center"
      >
        {project.description}
      </Text>

      {/* Tech tags */}
      <group position={[0, -0.6, 0.1]}>
        {project.tech.slice(0, 5).map((tech, i) => {
          const totalWidth = project.tech.slice(0, 5).length * 0.85;
          const startX = -totalWidth / 2 + 0.4;
          return (
            <group key={i} position={[startX + i * 0.85, 0, 0]}>
              <RoundedBox args={[0.75, 0.25, 0.02]} radius={0.1} smoothness={2}>
                <meshBasicMaterial color={color} opacity={0.25} transparent />
              </RoundedBox>
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.09}
                color={color}
                anchorX="center"
                anchorY="middle"
              >
                {tech}
              </Text>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// Frosted bar style (same as skill category boxes background)
function FrostedBar({
  position,
  size,
  color
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  const radius = Math.min(size[0], size[1]) * 0.3;

  return (
    <group position={position}>
      {/* Background - solid dark (same as CategoryBox: #0a1628, opacity 0.7) */}
      <RoundedBox
        args={[size[0] - 0.02, size[1] - 0.02, size[2]]}
        radius={radius}
        smoothness={4}
        position={[0, 0, -0.01]}
      >
        <meshBasicMaterial
          color="#0a1628"
          transparent
          opacity={0.7}
        />
      </RoundedBox>

      {/* Color tint overlay (same as CategoryBox: color with opacity 0.15) */}
      <RoundedBox
        args={[size[0] - 0.03, size[1] - 0.03, size[2] * 0.5]}
        radius={radius * 0.9}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </RoundedBox>

      {/* Border line (same as CategoryBox) */}
      <Line
        points={[
          [-size[0]/2, -size[1]/2, size[2]/2 + 0.01],
          [size[0]/2, -size[1]/2, size[2]/2 + 0.01],
          [size[0]/2, size[1]/2, size[2]/2 + 0.01],
          [-size[0]/2, size[1]/2, size[2]/2 + 0.01],
          [-size[0]/2, -size[1]/2, size[2]/2 + 0.01],
        ]}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0.5}
      />
    </group>
  );
}

// Large arrow pointing UP with frosted style
function VerticalArrow({ color, height }: { color: string; height: number }) {
  const arrowRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!arrowRef.current) return;
    const time = state.clock.elapsedTime;
    // Subtle pulse effect
    const scale = 1 + Math.sin(time * 2) * 0.02;
    arrowRef.current.scale.set(scale, 1, scale);
  });

  return (
    <group ref={arrowRef} position={[0, 0, -0.5]}>
      {/* Main arrow bar - frosted style */}
      <FrostedBar
        position={[0, -height / 2 + 2, 0]}
        size={[0.15, height, 0.08]}
        color={color}
      />

      {/* Arrow head pointing UP */}
      <group position={[0, 2.5, 0]}>
        {/* Dark base */}
        <mesh>
          <coneGeometry args={[0.3, 0.8, 8]} />
          <meshBasicMaterial color="#0a1628" transparent opacity={0.85} />
        </mesh>
        {/* Color tint */}
        <mesh position={[0, 0, 0.01]}>
          <coneGeometry args={[0.28, 0.75, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Subtle glow effect */}
      <pointLight color={color} intensity={0.5} distance={3} position={[0, 2.5, 0.5]} />
    </group>
  );
}

interface ExperienceDetail3DProps {
  experience: Experience;
  scrollOffset: number;
}

export default function ExperienceDetail3D({ experience, scrollOffset }: ExperienceDetail3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { t } = useTranslation('common');

  // Calculate vertical offset based on scroll
  // Each scrollOffset unit = 1 project, snapping to center each project
  const projectSpacing = 3;

  // Projects are positioned at y = baseY - i * projectSpacing
  // To center project i at y=0, we need to offset by: i * projectSpacing - baseY
  // Since baseY = 0 (we position relative to center), scrollY = scrollOffset * projectSpacing
  const scrollY = scrollOffset * projectSpacing;

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth scroll animation
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      scrollY,
      0.08
    );
  });

  const arrowHeight = Math.max(8, experience.projects.length * projectSpacing + 4);

  return (
    <group position={[0, 0, 0]}>
      {/* Company header - fixed at top */}
      <Float rotationIntensity={0.01} floatIntensity={0.02} speed={2}>
        <group position={[0, 3.5, 0]}>
          <Text
            fontSize={0.5}
            color={experience.color}
            anchorX="center"
            anchorY="middle"
          >
            {experience.company}
          </Text>
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.18}
            color="rgba(255,255,255,0.6)"
            anchorX="center"
            anchorY="middle"
          >
            {experience.role}
          </Text>
          <Text
            position={[0, -1, 0]}
            fontSize={0.14}
            color="rgba(255,255,255,0.4)"
            anchorX="center"
            anchorY="middle"
          >
            {experience.period}
          </Text>
        </group>
      </Float>

      {/* Vertical arrow - moves with scroll */}
      <group ref={groupRef} position={[0, 0, 0]}>
        <VerticalArrow color={experience.color} height={arrowHeight} />

        {/* Projects container */}
        {experience.projects.map((project, i) => (
          <group key={i}>
            {/* Project block - centered at y=0 for first project, then -projectSpacing for each subsequent */}
            <ProjectBlock3D
              project={project}
              position={[0, -i * projectSpacing, 0]}
              color={experience.color}
              index={i}
            />

            {/* Connector dot on arrow */}
            <mesh position={[0, -i * projectSpacing, -0.3]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={experience.color}
                emissive={experience.color}
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Horizontal connector line - frosted style */}
            <FrostedBar
              position={[-1.2, -i * projectSpacing, -0.3]}
              size={[2.2, 0.08, 0.05]}
              color={experience.color}
            />
          </group>
        ))}
      </group>

      {/* Instructions */}
      {experience.projects.length > 2 && (
        <Float floatIntensity={0.1} speed={3}>
          <group position={[0, -4, 0]}>
            <Text
              fontSize={0.12}
              color="rgba(255,255,255,0.4)"
              anchorX="center"
              anchorY="middle"
            >
              {t('timeline.scrollForMoreProjects')}
            </Text>
          </group>
        </Float>
      )}
    </group>
  );
}
