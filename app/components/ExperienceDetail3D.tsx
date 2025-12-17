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

// Large arrow pointing UP
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
      {/* Main arrow line */}
      <mesh position={[0, -height / 2 + 2, 0]}>
        <boxGeometry args={[0.08, height, 0.08]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Arrow head pointing UP */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <pointLight color={color} intensity={1} distance={5} position={[0, 2.5, 0.5]} />
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
  const projectSpacing = 3;
  const totalHeight = (experience.projects.length - 1) * projectSpacing;
  const scrollY = scrollOffset * totalHeight;

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

      {/* Vertical arrow */}
      <VerticalArrow color={experience.color} height={arrowHeight} />

      {/* Projects container - scrollable */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {experience.projects.map((project, i) => (
          <group key={i}>
            {/* Project block */}
            <ProjectBlock3D
              project={project}
              position={[0, 1.5 - i * projectSpacing, 0]}
              color={experience.color}
              index={i}
            />

            {/* Connector dot on arrow */}
            <mesh position={[0, 1.5 - i * projectSpacing, -0.3]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={experience.color}
                emissive={experience.color}
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Horizontal connector line */}
            <mesh position={[-1.2, 1.5 - i * projectSpacing, -0.3]}>
              <boxGeometry args={[2.2, 0.03, 0.03]} />
              <meshBasicMaterial color={experience.color} opacity={0.5} transparent />
            </mesh>
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
