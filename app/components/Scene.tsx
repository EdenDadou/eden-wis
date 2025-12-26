import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Scene3D from './scene3d/Scene3D';
import { Loader } from '@react-three/drei';
import type { Experience as ExperienceType } from './Timeline3D';

interface SceneProps {
  section: number;
  onExperienceSelect?: (experience: ExperienceType | null) => void;
  selectedExperienceId?: string | null;
  detailScrollOffset?: number;
  onNavigationComplete?: () => void;
  onSkillClick?: (skillSection: number) => void;
}

export default function Scene({ section, onExperienceSelect, selectedExperienceId, detailScrollOffset = 0, onNavigationComplete, onSkillClick }: SceneProps) {
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
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <Scene3D
              section={section}
              onExperienceSelect={onExperienceSelect}
              selectedExperienceId={selectedExperienceId}
              detailScrollOffset={detailScrollOffset}
              onNavigationComplete={onNavigationComplete}
              onSkillClick={onSkillClick}
            />
          </Suspense>
        </Canvas>
      </div>
      <Loader />
    </>
  );
}
