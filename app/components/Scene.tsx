import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Experience from './Experience';
import { Loader } from '@react-three/drei';
import type { Experience as ExperienceType } from './Timeline3D';

interface SceneProps {
  onSectionChange?: (section: number) => void;
  onExperienceSelect?: (experience: ExperienceType | null) => void;
  selectedExperienceId?: string | null;
  detailScrollOffset?: number;
  targetSection?: number | null;
  onNavigationComplete?: () => void;
  onFirstSectionAnimationComplete?: () => void;
  onSkillClick?: (skillSection: number) => void;
}

export default function Scene({ onSectionChange, onExperienceSelect, selectedExperienceId, detailScrollOffset = 0, targetSection, onNavigationComplete, onFirstSectionAnimationComplete, onSkillClick }: SceneProps) {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          // Limit DPR to 1.5 max for better performance (was [1, 2])
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            // Performance optimizations
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          // Always render for animations
          frameloop="always"
        >
          <Suspense fallback={null}>
            <Experience
              onSectionChange={onSectionChange}
              onExperienceSelect={onExperienceSelect}
              selectedExperienceId={selectedExperienceId}
              detailScrollOffset={detailScrollOffset}
              targetSection={targetSection}
              onNavigationComplete={onNavigationComplete}
              onFirstSectionAnimationComplete={onFirstSectionAnimationComplete}
              onSkillClick={onSkillClick}
            />
          </Suspense>
        </Canvas>
      </div>
      <Loader />
    </>
  );
}
