import { forwardRef, useMemo, useRef } from "react";
import { Text, Line, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
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
  ({ type, isActive, materialRef, labelRef }, ref) => {
    const config = CONFIG[type];
    const [width, height] = config.size;
    const halfW = width / 2;
    const halfH = height / 2;
    const radius = 0.1;

    // Refs for neon animation
    const line1Ref = useRef<any>(null);
    const line2Ref = useRef<any>(null);
    const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

    // Animate neon glow
    useFrame((state) => {
      const time = state.clock.elapsedTime;
      const pulse = 0.7 + Math.sin(time * 2 + (type === "frontend" ? 0 : type === "backend" ? 2 : 4)) * 0.3;
      const fastPulse = 0.8 + Math.sin(time * 4) * 0.2;

      if (line1Ref.current?.material) {
        line1Ref.current.material.opacity = isActive ? pulse : 0.5 + Math.sin(time * 1.5) * 0.2;
      }
      if (line2Ref.current?.material) {
        line2Ref.current.material.opacity = isActive ? fastPulse * 0.6 : 0.3 + Math.sin(time * 1.5) * 0.1;
      }
      if (glowMatRef.current) {
        glowMatRef.current.opacity = isActive ? 0.9 + Math.sin(time * 2) * 0.05 : 0.85;
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
            opacity={0.85}
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
            color={config.color}
            transparent
            opacity={0.15}
          />
        </RoundedBox>

        {/* Outer glow line (wider, more diffuse) */}
        <Line
          ref={line2Ref}
          points={borderPoints}
          color={config.glowColor}
          lineWidth={isActive ? 8 : 5}
          transparent
          opacity={0.3}
        />

        {/* Main neon border line */}
        <Line
          ref={line1Ref}
          points={borderPoints}
          color={borderColor}
          lineWidth={isActive ? 3 : 2}
          transparent
          opacity={isActive ? 0.9 : 0.6}
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
