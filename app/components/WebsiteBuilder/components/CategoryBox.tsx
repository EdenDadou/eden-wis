import { forwardRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
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
    size: [2.8, 8.5, 0.02] as [number, number, number],
    labelPosition: [0, GRID_Y + 1.8, 0.1] as [number, number, number],
    label: "FRONTEND",
    color: C_GROUP_FRONTEND,
    glowColor: C_GLOW_FRONTEND,
    labelColor: "#60a5fa",
    outlineColor: "#3b82f6",
  },
  backend: {
    position: [0, 0, -0.5] as [number, number, number],
    size: [2.8, 5.5, 0.02] as [number, number, number],
    labelPosition: [0, GRID_Y * 0.5 + 1.5, 0.1] as [number, number, number],
    label: "BACKEND",
    color: C_GROUP_BACKEND,
    glowColor: C_GLOW_BACKEND,
    labelColor: "#34d399",
    outlineColor: "#10b981",
  },
  devops: {
    position: [GRID_X, 0, -0.5] as [number, number, number],
    size: [2.8, 8.5, 0.02] as [number, number, number],
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

    return (
      <group ref={ref} position={config.position}>
        <RoundedBox
          args={config.size}
          radius={0.1}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial
            ref={materialRef}
            color={isActive ? config.glowColor : config.color}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </RoundedBox>
        <Text
          ref={labelRef}
          position={config.labelPosition}
          fontSize={isActive ? 0.4 : 0.35}
          color={isActive ? config.glowColor : config.labelColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          outlineOpacity={1}
          fillOpacity={0}
        >
          {config.label}
        </Text>
      </group>
    );
  }
);

CategoryBox.displayName = "CategoryBox";
