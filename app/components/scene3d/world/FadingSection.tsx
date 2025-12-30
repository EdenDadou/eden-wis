import { useFrame } from "@react-three/fiber";
import { useRef, createContext, useContext } from "react";
import * as THREE from "three";

// Context to share fade opacity with children
const FadeOpacityContext = createContext<{ current: number }>({ current: 1 });

export function useFadeOpacity() {
  return useContext(FadeOpacityContext);
}

interface FadingSectionProps {
  children: React.ReactNode;
  isActive: boolean;
  isAnimating: boolean;
  isIncoming?: boolean; // True if this section is the destination during animation
  sectionType: "skills" | "experience" | "portfolio" | "about" | "contact";
}

export default function FadingSection({
  children,
  isActive,
  isAnimating,
  isIncoming = false,
  sectionType,
}: FadingSectionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(isActive ? 1 : 0);
  const currentScale = useRef(isActive ? 1 : 0.85);
  const wasActive = useRef(isActive);

  // Use higher priority (-1) to ensure fade opacity is updated before child animations
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Determine target values based on state
    let targetOpacity: number;
    let targetScale: number;

    if (isActive) {
      // Active section: fully visible and scaled
      targetOpacity = 1;
      targetScale = 1;
    } else if (isAnimating && wasActive.current) {
      // Was active, now animating away: fade out and shrink during rotation
      targetOpacity = 0;
      targetScale = 0.95;
    } else if (isAnimating && isIncoming) {
      // Incoming section during animation: start appearing with scale
      targetOpacity = 0.5;
      targetScale = 0.98;
    } else {
      // Not active, not animating: fully hidden
      targetOpacity = 0;
      targetScale = 1; // Keep scale at 1 to avoid pop effect on reappear
    }

    // Update wasActive tracking when animation ends
    if (!isAnimating) {
      wasActive.current = isActive;
    }

    // Smooth interpolation with different speeds for appearing vs disappearing
    const isAppearing = targetOpacity > currentOpacity.current;
    const baseSpeed = sectionType === "skills" ? 1.5 : 2;
    const speed = isAppearing ? baseSpeed : baseSpeed * 2;

    const opacityDiff = targetOpacity - currentOpacity.current;
    const scaleDiff = targetScale - currentScale.current;
    const decay = 1 - Math.exp(-delta * speed);

    currentOpacity.current += opacityDiff * decay;
    currentScale.current += scaleDiff * decay;

    // Snap to target when close enough
    if (Math.abs(opacityDiff) < 0.01) {
      currentOpacity.current = targetOpacity;
    }
    if (Math.abs(scaleDiff) < 0.005) {
      currentScale.current = targetScale;
    }

    // Apply scale transformation
    const scale = currentScale.current;
    groupRef.current.scale.set(scale, scale, scale);

    // Apply opacity to all materials
    groupRef.current.traverse((child: any) => {
      // Handle troika Text components (they have a 'text' property and special sync method)
      if (child.text !== undefined && child.material) {
        const textMesh = child;
        // Store original values on first encounter
        if (textMesh._originalOutlineOpacity === undefined) {
          textMesh._originalOutlineOpacity = textMesh.outlineOpacity ?? 1;
          textMesh._originalFillOpacity = textMesh.fillOpacity ?? 1;
        }
        // Apply fade to text properties
        textMesh.outlineOpacity = textMesh._originalOutlineOpacity * currentOpacity.current;
        if (textMesh._originalFillOpacity > 0) {
          textMesh.fillOpacity = textMesh._originalFillOpacity * currentOpacity.current;
        }
        // Force sync
        if (textMesh.sync) textMesh.sync();
      }

      // Check if this is a renderable object with material
      // This includes THREE.Mesh, THREE.Line, THREE.Points, and drei's Line2/LineSegments2
      const isRenderableObject =
        child instanceof THREE.Mesh ||
        child instanceof THREE.Line ||
        child instanceof THREE.Points ||
        child.isLine2 || // drei Line uses Line2 from three-stdlib
        child.isLineSegments2;

      if (isRenderableObject && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((material: any) => {
          if (!material) return;

          const mat = material as THREE.Material & {
            _externallyManaged?: boolean;
            _originalOpacity?: number;
            _originalTransparent?: boolean;
            depthWrite?: boolean;
            uniforms?: { opacity?: { value: number } };
          };

          if (mat._externallyManaged) return;

          // Store original values on first encounter
          if (mat._originalOpacity === undefined) {
            mat._originalOpacity = material.opacity ?? 1;
            mat._originalTransparent = material.transparent ?? false;
          }

          // Apply fade - use original opacity as base
          const originalOpacity = mat._originalOpacity;
          const newOpacity = originalOpacity * currentOpacity.current;

          // Force transparency when fading
          material.transparent = true;
          material.opacity = newOpacity;
          material.needsUpdate = true;

          // Handle shader materials with opacity uniform (e.g., drei Text)
          if (mat.uniforms?.opacity) {
            mat.uniforms.opacity.value = newOpacity;
          }
        });

        // Hide mesh when section is fully faded
        child.visible = currentOpacity.current > 0.01;
      }
    });

    // Keep group visible but use opacity for fading - don't use visible toggle
    // as it causes instant appear/disappear instead of smooth fade
    groupRef.current.visible = true;
  }, -1); // Priority -1 ensures this runs before default priority (0) useFrames

  return (
    <FadeOpacityContext.Provider value={currentOpacity}>
      <group ref={groupRef}>{children}</group>
    </FadeOpacityContext.Provider>
  );
}
