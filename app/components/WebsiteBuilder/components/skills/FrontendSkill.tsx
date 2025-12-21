import { forwardRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { C_FRONT, POS_FRONTEND, SECTION_MAP } from "../../constants";

interface FrontendSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  uiBlock1: React.RefObject<THREE.Group | null>;
  uiBlock2: React.RefObject<THREE.Group | null>;
  uiBlock3: React.RefObject<THREE.Group | null>;
}

export const FrontendSkill = forwardRef<THREE.Group, FrontendSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, uiBlock1, uiBlock2, uiBlock3 }, ref) => {
    const section = SECTION_MAP.FRONTEND;

    return (
      <group
        ref={ref}
        position={POS_FRONTEND}
        scale={0}
        onClick={() => onSkillClick?.(section)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <Text
          position={[0, 0.85, 0]}
          fontSize={isActive ? 0.12 : 0.1}
          color={getLabelColor(C_FRONT)}
          anchorX="center"
          outlineWidth={isActive ? 0.015 : 0}
          outlineColor={C_FRONT}
        >
          APP WEB
        </Text>
        <Text
          position={[0, 0.73, 0]}
          fontSize={0.04}
          color={isActive ? "#aaa" : "#666"}
          anchorX="center"
        >
          React / Remix
        </Text>

        {/* Wireframe Mode hint */}
        <group scale={1.02} position={[0, 0, -0.1]}>
          <RoundedBox args={[1.8, 1.3, 0.05]} radius={0.04}>
            <meshBasicMaterial color={C_FRONT} wireframe opacity={0.3} transparent />
          </RoundedBox>
        </group>

        {/* Main Monitor */}
        <RoundedBox args={[1.8, 1.3, 0.06]} radius={0.04} smoothness={4} position={[0, 0, -0.03]}>
          <meshStandardMaterial color="#1e1e2e" metalness={0.6} roughness={0.3} />
        </RoundedBox>

        {/* Screen Content */}
        <RoundedBox args={[1.68, 1.18, 0.02]} radius={0.03} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0a0a18" />
        </RoundedBox>

        {/* Animated UI Blocks */}
        <group position={[0, 0, 0.02]}>
          {/* Header */}
          <group ref={uiBlock1} scale={0}>
            <RoundedBox args={[1.58, 0.13, 0.01]} radius={0.02} position={[0, 0.45, 0]}>
              <meshStandardMaterial color="#16162a" />
            </RoundedBox>
          </group>

          {/* Sidebar */}
          <group ref={uiBlock2} scale={0}>
            <RoundedBox args={[0.35, 0.8, 0.01]} radius={0.02} position={[-0.6, -0.08, 0]}>
              <meshStandardMaterial color="#1f1f3a" />
            </RoundedBox>
          </group>

          {/* Hero Section */}
          <group ref={uiBlock3} scale={0}>
            <RoundedBox args={[1.05, 0.35, 0.01]} radius={0.02} position={[0.18, 0.12, 0.02]}>
              <meshStandardMaterial color="#3a3a5e" />
            </RoundedBox>
            {/* Card Grid */}
            {[-0.18, -0.45].map((y, i) => (
              <group key={i} position={[0.18, y, 0]}>
                {[-0.35, 0, 0.35].map((x, j) => (
                  <RoundedBox key={j} args={[0.3, 0.18, 0.01]} radius={0.01} position={[x, 0, 0.02]}>
                    <meshStandardMaterial color="#2a2a4e" />
                  </RoundedBox>
                ))}
              </group>
            ))}
          </group>
        </group>
      </group>
    );
  }
);

FrontendSkill.displayName = "FrontendSkill";
