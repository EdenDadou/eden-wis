import { forwardRef, useMemo, useRef } from "react";
import { Text, Line, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFadeOpacity } from "~/components/scene3d/world/FadingSection";
import {
  GRID_X,
  GRID_Y,
  C_GROUP_FRONTEND,
  C_GROUP_BACKEND,
  C_GROUP_DEVOPS,
  C_GLOW_FRONTEND,
  C_GLOW_BACKEND,
  C_GLOW_DEVOPS,
} from "../constants";

interface CategoryBoxProps {
  type: "frontend" | "backend" | "devops";
  isActive: boolean;
  materialRef: React.RefObject<THREE.MeshBasicMaterial | null>;
  labelRef: React.RefObject<any>;
  dimmed?: boolean; // When a skill from another category is selected
}

const CONFIG = {
  frontend: {
    position: [-GRID_X, 0, -0.5] as [number, number, number],
    size: [2.8, 8.5] as [number, number],
    labelPosition: [0, GRID_Y + 1.8, 0.1] as [number, number, number],
    label: "FRONTEND",
    color: C_GROUP_FRONTEND,
    glowColor: C_GLOW_FRONTEND,
    labelColor: "#60a5fa",
    outlineColor: "#3b82f6",
  },
  backend: {
    position: [0, -1.5, -0.5] as [number, number, number],
    size: [2.8, 5.5] as [number, number],
    labelPosition: [0, 5.5 / 2 + 0.35, 0.1] as [number, number, number],
    label: "BACKEND",
    color: C_GROUP_BACKEND,
    glowColor: C_GLOW_BACKEND,
    labelColor: "#34d399",
    outlineColor: "#10b981",
  },
  devops: {
    position: [GRID_X, 0, -0.5] as [number, number, number],
    size: [2.8, 8.5] as [number, number],
    labelPosition: [0, GRID_Y + 1.8, 0.1] as [number, number, number],
    label: "DEVOPS",
    color: C_GROUP_DEVOPS,
    glowColor: C_GLOW_DEVOPS,
    labelColor: "#ff8c00",
    outlineColor: "#ff6600",
  },
};

export const CategoryBox = forwardRef<THREE.Group, CategoryBoxProps>(
  ({ type, isActive, materialRef, labelRef, dimmed = false }, ref) => {
    const config = CONFIG[type];
    const [width, height] = config.size;
    const halfW = width / 2;
    const halfH = height / 2;
    const radius = 0.1;

    // Get fade opacity from parent FadingSection
    const fadeOpacity = useFadeOpacity();

    // Refs for border animation
    const lineRef = useRef<any>(null);
    const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
    const tintMatRef = useRef<THREE.MeshBasicMaterial>(null);
    const smoothDimmed = useRef(1);

    // Simplified border animation (no expensive glow effects)
    useFrame(() => {
      const fade = fadeOpacity.current;

      // Smooth dimming transition
      const targetDim = dimmed ? 0.15 : 1;
      smoothDimmed.current = THREE.MathUtils.lerp(smoothDimmed.current, targetDim, 0.1);
      const dimFactor = smoothDimmed.current;

      if (lineRef.current?.material) {
        const baseOpacity = isActive ? 0.8 : 0.5;
        lineRef.current.material.opacity = baseOpacity * fade * dimFactor;
      }
      if (glowMatRef.current) {
        glowMatRef.current.opacity = 0.7 * fade * dimFactor;
      }
      if (tintMatRef.current) {
        tintMatRef.current.opacity = 0.15 * fade * dimFactor;
      }
    });

    // Create rounded rectangle points for the border
    const borderPoints = useMemo(() => {
      const points: [number, number, number][] = [];
      const segments = 8; // segments per corner

      // Helper to add corner arc
      const addCorner = (cx: number, cy: number, startAngle: number) => {
        for (let i = 0; i <= segments; i++) {
          const angle = startAngle + (Math.PI / 2) * (i / segments);
          points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), 0]);
        }
      };

      // Top-right corner
      addCorner(halfW - radius, halfH - radius, 0);
      // Top-left corner
      addCorner(-halfW + radius, halfH - radius, Math.PI / 2);
      // Bottom-left corner
      addCorner(-halfW + radius, -halfH + radius, Math.PI);
      // Bottom-right corner
      addCorner(halfW - radius, -halfH + radius, (3 * Math.PI) / 2);
      // Close the loop
      points.push(points[0]);

      return points;
    }, [halfW, halfH, radius]);

    const borderColor = isActive ? config.glowColor : config.color;

    return (
      <group ref={ref} position={config.position}>
        {/* Background - solid dark with color tint for "frosted" look */}
        <RoundedBox
          args={[width - 0.05, height - 0.05, 0.02]}
          radius={radius}
          smoothness={4}
          position={[0, 0, -0.02]}
        >
          <meshBasicMaterial
            ref={glowMatRef}
            color="#0a1628"
            transparent
            opacity={0.7}
          />
        </RoundedBox>

        {/* Color tint overlay */}
        <RoundedBox
          args={[width - 0.06, height - 0.06, 0.01]}
          radius={radius}
          smoothness={4}
          position={[0, 0, -0.01]}
        >
          <meshBasicMaterial
            ref={tintMatRef}
            color={config.color}
            transparent
            opacity={0.15}
          />
        </RoundedBox>

        {/* Simple border line (performance optimized - no glow) */}
        <Line
          ref={lineRef}
          points={borderPoints}
          color={borderColor}
          lineWidth={isActive ? 2.5 : 1.5}
          transparent
          opacity={isActive ? 0.8 : 0.5}
        />

        {/* Hidden material for animation refs compatibility */}
        <mesh visible={false}>
          <planeGeometry args={[0.01, 0.01]} />
          <meshBasicMaterial
            ref={materialRef}
            color={borderColor}
            transparent
            opacity={0}
          />
        </mesh>
        <Text
          ref={labelRef}
          position={config.labelPosition}
          fontSize={isActive ? 0.4 : 0.35}
          color={isActive ? config.glowColor : config.labelColor}
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
        >
          {config.label}
        </Text>
      </group>
    );
  }
);

CategoryBox.displayName = "CategoryBox";
