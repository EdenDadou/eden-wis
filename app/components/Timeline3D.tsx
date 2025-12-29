import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import { SECTION_ANGLES, ORBIT_RADIUS } from './scene3d';

// Composant Text 3D avec effet morphing lors du changement de langue
// Inspiré de Magic UI MorphingText - effet de fondu croisé smooth
interface MorphingText3DProps {
  children: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  fontWeight?: 'normal' | 'bold';
}

interface MorphState {
  oldText: string;
  newText: string;
  progress: number; // 0 = old text visible, 1 = new text visible
}

function MorphingText3D({
  children,
  position = [0, 0, 0],
  fontSize = 0.22,
  color = 'white',
  anchorX = 'center',
  anchorY = 'middle',
  fontWeight = 'bold',
}: MorphingText3DProps) {
  const { i18n } = useTranslation();
  const [morphState, setMorphState] = useState<MorphState>({
    oldText: children,
    newText: children,
    progress: 1,
  });
  const prevLangRef = useRef(i18n.language);
  const prevChildrenRef = useRef(children);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Update without animation if only children changed (not language)
    if (prevChildrenRef.current !== children && prevLangRef.current === i18n.language) {
      prevChildrenRef.current = children;
      setMorphState({ oldText: children, newText: children, progress: 1 });
      return;
    }

    // Skip if language didn't change
    if (prevLangRef.current === i18n.language) {
      return;
    }

    const oldText = prevChildrenRef.current;
    prevLangRef.current = i18n.language;
    prevChildrenRef.current = children;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const morphDuration = 800; // ms for full morph
    const startTime = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / morphDuration, 1);

      // Smooth easing
      const eased = 1 - Math.pow(1 - progress, 3);

      setMorphState({
        oldText,
        newText: children,
        progress: eased,
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setMorphState({ oldText: children, newText: children, progress: 1 });
      }
    };

    setMorphState({ oldText, newText: children, progress: 0 });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [children, i18n.language]);

  const { oldText, newText, progress } = morphState;

  // Calculate opacities with smooth crossfade
  const oldOpacity = Math.pow(1 - progress, 0.4);
  const newOpacity = Math.pow(progress, 0.4);

  // If not morphing, just show single text
  if (progress === 1) {
    return (
      <Text
        position={position}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        fontWeight={fontWeight}
      >
        {newText}
      </Text>
    );
  }

  return (
    <group position={position}>
      {/* Old text fading out */}
      <Text
        position={[0, 0, -0.01]}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        fontWeight={fontWeight}
        fillOpacity={oldOpacity}
      >
        {oldText}
      </Text>
      {/* New text fading in */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        fontWeight={fontWeight}
        fillOpacity={newOpacity}
      >
        {newText}
      </Text>
    </group>
  );
}

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
  isEducation?: boolean; // Pour différencier études et expériences pro
}

// Données d'expérience et formation
export const experienceData: Experience[] = [
  {
    id: 'etude',
    company: 'Étude',
    role: 'Licence Concepteur Développeur Web & Mobile',
    period: 'Sept 2018 - Nov 2019',
    startYear: 2019,
    endYear: 2019.85, // ~Novembre
    color: '#3b82f6', // Bleu
    row: 'top',
    isEducation: true,
    projects: [
      { name: 'Projet de fin d\'études', description: 'Application web complète avec authentification et gestion de données', tech: ['PHP', 'MySQL', 'JavaScript'] },
      { name: 'Stage développeur', description: 'Stage de 3 mois en entreprise', tech: ['HTML', 'CSS', 'JavaScript'] },
    ]
  },
  {
    id: 'e4ia',
    company: 'E4iA',
    role: 'Développeur',
    period: 'Jan 2020 - Juil 2020',
    startYear: 2020,
    endYear: 2020.5, // ~Juillet
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
    period: 'Jan 2019 - Aujourd\'hui',
    startYear: 2019,
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
const TIMELINE_START = 2019;
const TIMELINE_END = 2026;
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
  const { t } = useTranslation('common');
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const startX = yearToX(experience.startYear);
  const endX = yearToX(experience.endYear || TIMELINE_END);
  const naturalWidth = endX - startX;
  const yPos = experience.row === 'top' ? 1.2 : -1.2;
  // Use natural width but with a minimum for readability
  const blockWidth = Math.max(naturalWidth - 0.1, 1.2);
  // Anchor the block at its start position, extending to the right
  const centerX = startX + blockWidth / 2;

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
        args={[blockWidth, 0.9, 0.2]}
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

      {/* Company name - single word, big and readable with shuffle effect */}
      <MorphingText3D
        position={[0, 0, 0.15]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {experience.id === 'etude' ? t('experience.study') : experience.company}
      </MorphingText3D>

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

// Timeline title with shuffle effect
function TimelineTitle({ position, title, subtitle }: { position: [number, number, number]; title: string; subtitle: string }) {
  return (
    <Float rotationIntensity={0.02} floatIntensity={0.05} speed={2}>
      <group position={position}>
        <MorphingText3D
          fontSize={0.35}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {title}
        </MorphingText3D>
        <MorphingText3D
          position={[0, -0.45, 0]}
          fontSize={0.12}
          color="rgba(255,255,255,0.5)"
          anchorX="center"
          anchorY="middle"
          fontWeight="normal"
        >
          {subtitle}
        </MorphingText3D>
      </group>
    </Float>
  );
}

// Year markers on timeline
function YearMarkers() {
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

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

  // Position on circle at experience section angle (72° = 2π/5)
  const angle = SECTION_ANGLES.experience;
  const posX = Math.sin(angle) * ORBIT_RADIUS;
  const posZ = Math.cos(angle) * ORBIT_RADIUS;
  // Rotate to be tangent to circle and face outward (toward where camera will be)
  // Content at angle θ needs rotation θ to face outward
  // When RotatingWorld rotates by -θ, the content ends up at angle 0 with rotation 0
  // (θ + (-θ) = 0), so it faces the camera on the +Z axis
  const rotationY = angle;

  return (
    <group position={[posX, 0, posZ]} rotation={[0, rotationY, 0]} scale={1.15}>
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
      <group position={[yearToX(2026), 0, 0]}>
        <MorphingText3D
          position={[0.3, 0.5, 0]}
          fontSize={0.1}
          color="#06b6d4"
          anchorX="left"
          anchorY="middle"
          fontWeight="normal"
        >
          {t('timeline.today')}
        </MorphingText3D>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.02, 2.8, 0.02]} />
          <meshBasicMaterial color="#06b6d4" opacity={0.3} transparent />
        </mesh>
      </group>
    </group>
  );
}
