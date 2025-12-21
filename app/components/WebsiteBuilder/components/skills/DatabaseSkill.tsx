import { forwardRef } from "react";
import { Billboard, Text } from "@react-three/drei";
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
        <Billboard>
          <Text
            position={[0, 1.0, 0]}
            fontSize={isActive ? 0.11 : 0.09}
            color={getLabelColor(C_DB)}
            anchorX="center"
            outlineWidth={isActive ? 0.015 : 0}
            outlineColor={C_DB}
          >
            DATABASE
          </Text>
          <Text
            position={[0, 0.88, 0]}
            fontSize={0.04}
            color={isActive ? "#aaa" : "#666"}
            anchorX="center"
          >
            PostgreSQL
          </Text>
        </Billboard>

        {/* Core cylinder */}
        <mesh>
          <cylinderGeometry args={[0.55, 0.55, 1.0, 32]} />
          <meshStandardMaterial color="#1a0b2e" metalness={0.8} roughness={0.2} />
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
    );
  }
);

DatabaseSkill.displayName = "DatabaseSkill";
