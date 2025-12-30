import { forwardRef } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { C_DB, POS_DATABASE, SECTION_MAP } from "../../constants";

interface DatabaseSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  databaseRingRefs: React.MutableRefObject<(THREE.Mesh | null)[]>;
}

export const DatabaseSkill = forwardRef<THREE.Group, DatabaseSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, databaseRingRefs }, ref) => {
    const section = SECTION_MAP.DATABASE;

    return (
      <group
        ref={ref}
        position={POS_DATABASE}
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
        {/* Label outside rotation to align with connection points */}
        <Text
          position={[0, -0.85, 0]}
          fontSize={isActive ? 0.24 : 0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          fontWeight="bold"
        >
          DATABASE
        </Text>

        {/* Rotated content */}
        <group rotation={[-0.2, -0.3, 0]}>
          {/* Core cylinder */}
          <mesh>
            <cylinderGeometry args={[0.55, 0.55, 1.0, 32]} />
            <meshStandardMaterial color="#1a0b2e" metalness={0.8} roughness={0.2} transparent opacity={0.9} />
          </mesh>

          {/* Glowing Rings - Animated */}
          {[0.35, 0, -0.35].map((y, i) => (
            <mesh
              key={i}
              position={[0, y, 0]}
              ref={(el) => (databaseRingRefs.current[i] = el)}
              scale={0}
            >
              <cylinderGeometry args={[0.56, 0.56, 0.03, 32]} />
              <meshStandardMaterial
                color={C_DB}
                emissive={C_DB}
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    );
  }
);

DatabaseSkill.displayName = "DatabaseSkill";
