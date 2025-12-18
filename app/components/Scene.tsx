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
}

export default function Scene({ onSectionChange, onExperienceSelect, selectedExperienceId, detailScrollOffset = 0, targetSection, onNavigationComplete }: SceneProps) {
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
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Experience
              onSectionChange={onSectionChange}
              onExperienceSelect={onExperienceSelect}
              selectedExperienceId={selectedExperienceId}
              detailScrollOffset={detailScrollOffset}
              targetSection={targetSection}
              onNavigationComplete={onNavigationComplete}
            />
          </Suspense>
        </Canvas>
      </div>
      <Loader />
    </>
  );
}
