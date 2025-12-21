import { forwardRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { C_MOBILE, POS_MOBILE, SECTION_MAP } from "../../constants";

interface MobileSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  chatBubbleRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}

export const MobileSkill = forwardRef<THREE.Group, MobileSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, chatBubbleRefs }, ref) => {
    const section = SECTION_MAP.MOBILE;

    return (
      <group
        ref={ref}
        position={POS_MOBILE}
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
        {/* Label en dessous de l'élément */}
        <Text
          position={[0, -0.95, 0]}
          fontSize={isActive ? 0.22 : 0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          MOBILE
        </Text>

        {/* Phone Body */}
        <RoundedBox args={[0.8, 1.5, 0.08]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} transparent opacity={0.9} />
        </RoundedBox>

        {/* Screen */}
        <RoundedBox args={[0.72, 1.38, 0.01]} radius={0.06} position={[0, 0, 0.05]}>
          <meshStandardMaterial color="#000000" transparent opacity={0.9} />
        </RoundedBox>

        {/* App UI */}
        <group position={[0, 0, 0.06]}>
          {/* Header */}
          <mesh position={[0, 0.58, 0]}>
            <planeGeometry args={[0.65, 0.12]} />
            <meshBasicMaterial color={C_MOBILE} />
          </mesh>

          {/* Chat Bubbles */}
          {[0.3, 0.05, -0.2, -0.45].map((y, i) => (
            <group key={i} ref={(el) => (chatBubbleRefs.current[i] = el)} scale={0}>
              <RoundedBox args={[0.58, 0.12, 0.005]} radius={0.03} position={[0, y, 0]}>
                <meshBasicMaterial color={i % 2 == 0 ? "#333" : "#555"} />
              </RoundedBox>
            </group>
          ))}
        </group>

        {/* Notch & Home Bar */}
        <RoundedBox args={[0.24, 0.03, 0.015]} radius={0.012} position={[0, 0.6, 0.055]}>
          <meshStandardMaterial color="#000000" />
        </RoundedBox>
      </group>
    );
  }
);

MobileSkill.displayName = "MobileSkill";
