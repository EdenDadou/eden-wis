import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface FadingSectionProps {
  children: React.ReactNode;
  isActive: boolean;
  isAnimating: boolean;
  sectionType: "skills" | "experience" | "portfolio" | "about";
}

export default function FadingSection({
  children,
  isActive,
  isAnimating,
  sectionType,
}: FadingSectionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(isActive ? 1 : 0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetOpacity = isActive || isAnimating ? 1 : 0;
    // Skills section fades faster
    const baseFadeSpeed = sectionType === "skills" ? 40 : 12;
    const fadeSpeed = isAnimating ? baseFadeSpeed : baseFadeSpeed - 2;
    const diff = targetOpacity - currentOpacity.current;
    const decay = 1 - Math.exp(-delta * fadeSpeed);
    currentOpacity.current += diff * decay;

    if (Math.abs(diff) < 0.01) {
      currentOpacity.current = targetOpacity;
    }

    groupRef.current.traverse((child) => {
      if (
        child instanceof THREE.Mesh ||
        child instanceof THREE.Line ||
        child instanceof THREE.Points
      ) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          if (material && "opacity" in material) {
            const mat = material as THREE.Material & {
              _externallyManaged?: boolean;
              depthWrite?: boolean;
            };
            if (mat._externallyManaged) return;

            if (
              (material as { _originalOpacity?: number })._originalOpacity ===
              undefined
            ) {
              if (material.opacity === 0) {
                mat._externallyManaged = true;
                return;
              }
              (material as { _originalOpacity: number })._originalOpacity =
                material.opacity;
            }
            const originalOpacity = (material as { _originalOpacity: number })
              ._originalOpacity;
            material.opacity = originalOpacity * currentOpacity.current;
            material.transparent = true;
          }
        });
      }
    });

    groupRef.current.visible = currentOpacity.current > 0.01;
  });

  return <group ref={groupRef}>{children}</group>;
}
