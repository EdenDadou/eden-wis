import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';

export interface Project {
  name: string;
  description: string;
  tech: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  startYear: number;
  endYear: number | null; // null = Aujourd'hui
  color: string;
  row: 'top' | 'bottom';
  projects: Project[];
}

// Tes vraies données d'expérience
export const experienceData: Experience[] = [
  {
    id: 'e4ia',
    company: 'E4iA',
    role: 'Développeur',
    period: 'Jan 2020 - Août 2020',
    startYear: 2020,
    endYear: 2020.6, // ~Août
    color: '#8b5cf6', // Violet
    row: 'top',
    projects: [
      { name: 'Projet 1', description: 'Description du projet chez E4iA', tech: ['React', 'Node.js'] },
    ]
  },
  {
    id: 'atecna',
    company: 'Atecna',
    role: 'Développeur Full-Stack',
    period: 'Oct 2020 - Aujourd\'hui',
    startYear: 2020.8, // ~Octobre
    endYear: null,
    color: '#f97316', // Orange
    row: 'top',
    projects: [
      { name: 'Projet A', description: 'Description du projet chez Atecna', tech: ['React', 'TypeScript', 'Node.js'] },
      { name: 'Projet B', description: 'Autre projet chez Atecna', tech: ['Next.js', 'PostgreSQL'] },
    ]
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Développeur Indépendant',
    period: 'Jan 2020 - Aujourd\'hui',
    startYear: 2020,
    endYear: null,
    color: '#10b981', // Vert
    row: 'bottom',
    projects: [
      { name: 'Client 1', description: 'Site vitrine pour PME', tech: ['React', 'Tailwind'] },
      { name: 'Client 2', description: 'Application web sur mesure', tech: ['Next.js', 'Prisma'] },
    ]
  }
];

// Années sur la timeline
const TIMELINE_START = 2020;
const TIMELINE_END = 2025;
const TIMELINE_WIDTH = 12; // Largeur totale de la timeline

function yearToX(year: number): number {
  const progress = (year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START);
  return -TIMELINE_WIDTH / 2 + progress * TIMELINE_WIDTH;
}

interface ExperienceBlockProps {
  experience: Experience;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}

function ExperienceBlock({ experience, isSelected, onSelect }: ExperienceBlockProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const startX = yearToX(experience.startYear);
  const endX = yearToX(experience.endYear || TIMELINE_END);
  const width = endX - startX;
  const centerX = startX + width / 2;
  const yPos = experience.row === 'top' ? 1.2 : -1.2;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Subtle floating animation
    groupRef.current.position.y = yPos + Math.sin(time * 0.5) * 0.05;

    // Scale on hover/select
    const targetScale = isSelected ? 1.08 : hovered ? 1.04 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onSelect(isSelected ? null : experience.id);
  };

  return (
    <group ref={groupRef} position={[centerX, yPos, 0]}>
      {/* Main block - width based on duration */}
      <RoundedBox
        args={[Math.max(width - 0.2, 1.5), 0.9, 0.2]}
        radius={0.08}
        smoothness={4}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={experience.color}
          metalness={0.3}
          roughness={0.4}
          emissive={experience.color}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.1}
        />
      </RoundedBox>

      {/* Company name */}
      <Text
        position={[0, 0.15, 0.15]}
        fontSize={0.16}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={Math.max(width - 0.4, 1.2)}
      >
        {experience.company}
      </Text>

      {/* Role */}
      <Text
        position={[0, -0.12, 0.15]}
        fontSize={0.09}
        color="rgba(255,255,255,0.8)"
        anchorX="center"
        anchorY="middle"
        maxWidth={Math.max(width - 0.4, 1.2)}
      >
        {experience.role}
      </Text>

      {/* Vertical connector to timeline */}
      <mesh position={[0, experience.row === 'top' ? -0.6 : 0.6, -0.05]}>
        <boxGeometry args={[0.03, 0.4, 0.03]} />
        <meshBasicMaterial color={experience.color} opacity={0.6} transparent />
      </mesh>

      {/* Glow effect when selected */}
      {isSelected && (
        <pointLight color={experience.color} intensity={1.5} distance={3} />
      )}
    </group>
  );
}

// Timeline title
function TimelineTitle({ position, title, subtitle }: { position: [number, number, number]; title: string; subtitle: string }) {
  return (
    <Float rotationIntensity={0.02} floatIntensity={0.05} speed={2}>
      <group position={position}>
        <Text
          fontSize={0.35}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
        <Text
          position={[0, -0.45, 0]}
          fontSize={0.12}
          color="rgba(255,255,255,0.5)"
          anchorX="center"
          anchorY="middle"
        >
          {subtitle}
        </Text>
      </group>
    </Float>
  );
}

// Year markers on timeline
function YearMarkers() {
  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  return (
    <group>
      {years.map((year) => {
        const x = yearToX(year);
        return (
          <group key={year} position={[x, 0, 0]}>
            {/* Vertical tick */}
            <mesh position={[0, 0, -0.05]}>
              <boxGeometry args={[0.02, 0.3, 0.02]} />
              <meshBasicMaterial color="#06b6d4" opacity={0.5} transparent />
            </mesh>
            {/* Year label */}
            <Text
              position={[0, -0.35, 0]}
              fontSize={0.15}
              color="rgba(255,255,255,0.6)"
              anchorX="center"
              anchorY="middle"
            >
              {year.toString()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

interface Timeline3DProps {
  onExperienceSelect: (experience: Experience | null) => void;
  selectedId: string | null;
}

export default function Timeline3D({ onExperienceSelect, selectedId }: Timeline3DProps) {
  const { t } = useTranslation('common');

  const handleSelect = (id: string | null) => {
    if (id) {
      const exp = experienceData.find(e => e.id === id);
      onExperienceSelect(exp || null);
    } else {
      onExperienceSelect(null);
    }
  };

  // Position on circle at 90° (experience section)
  const ORBIT_RADIUS = 15;
  const angle = Math.PI / 2; // 90°
  const posX = Math.sin(angle) * ORBIT_RADIUS;
  const posZ = Math.cos(angle) * ORBIT_RADIUS;
  // Rotate to be tangent to circle and face outward (toward where camera will be)
  // Content at angle θ needs rotation θ to face outward
  // When RotatingWorld rotates by -θ, the content ends up at angle 0 with rotation 0
  // (θ + (-θ) = 0), so it faces the camera on the +Z axis
  const rotationY = angle;

  return (
    <group position={[posX, 0, posZ]} rotation={[0, rotationY, 0]}>
      {/* Title */}
      <TimelineTitle
        position={[0, 3, 0]}
        title={t('timeline.professionalExperience')}
        subtitle={t('timeline.clickToSeeProjects')}
      />

      {/* Main horizontal timeline line */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[TIMELINE_WIDTH + 1, 0.04, 0.04]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.4} transparent />
      </mesh>

      {/* Arrow at the end (right) */}
      <mesh position={[TIMELINE_WIDTH / 2 + 0.7, 0, -0.1]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.25, 8]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.6} transparent />
      </mesh>

      {/* Arrow at the start (left) - optional, represents past */}
      <mesh position={[-TIMELINE_WIDTH / 2 - 0.3, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
      </mesh>

      {/* Year markers */}
      <YearMarkers />

      {/* Row labels */}
      <Text
        position={[-TIMELINE_WIDTH / 2 - 0.8, 1.2, 0]}
        fontSize={0.12}
        color="rgba(255,255,255,0.4)"
        anchorX="right"
        anchorY="middle"
      >
        {t('timeline.permanent')}
      </Text>
      <Text
        position={[-TIMELINE_WIDTH / 2 - 0.8, -1.2, 0]}
        fontSize={0.12}
        color="rgba(255,255,255,0.4)"
        anchorX="right"
        anchorY="middle"
      >
        {t('timeline.freelancer')}
      </Text>

      {/* Experience blocks */}
      {experienceData.map((exp) => (
        <ExperienceBlock
          key={exp.id}
          experience={exp}
          isSelected={selectedId === exp.id}
          onSelect={handleSelect}
        />
      ))}

      {/* "Today" marker */}
      <group position={[yearToX(2025), 0, 0]}>
        <Text
          position={[0.3, 0.5, 0]}
          fontSize={0.1}
          color="#06b6d4"
          anchorX="left"
          anchorY="middle"
        >
          {t('timeline.today')}
        </Text>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.02, 2.8, 0.02]} />
          <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
        </mesh>
      </group>
    </group>
  );
}
