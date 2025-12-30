import { forwardRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { C_SERVER, POS_SERVER, SECTION_MAP } from "../../constants";

interface ServerSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  bladeRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}

export const ServerSkill = forwardRef<THREE.Group, ServerSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, bladeRefs }, ref) => {
    const section = SECTION_MAP.SERVER;

    return (
      <group
        ref={ref}
        position={POS_SERVER}
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
          position={[0, -0.9, 0]}
          fontSize={isActive ? 0.24 : 0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          fontWeight="bold"
        >
          SERVEUR
        </Text>

        {/* Rotated content */}
        <group rotation={[0, -0.3, 0]}>
          {/* Main Cabinet Frame */}
          <RoundedBox args={[0.9, 1.4, 0.5]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} transparent opacity={0.9} />
          </RoundedBox>

          {/* Internal Glow */}
          <pointLight position={[0, 0, 0.2]} intensity={0.5} color={C_SERVER} distance={1} decay={2} />

          {/* Detailed Server Blades */}
          {Array.from({ length: 8 }).map((_, i) => (
            <group key={i} ref={(el) => (bladeRefs.current[i] = el)}>
              {/* Blade Face Plate */}
              <RoundedBox args={[0.82, 0.14, 0.02]} radius={0.005} smoothness={2}>
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.5} />
              </RoundedBox>

              {/* Hard Drive Bays */}
              {[-0.3, -0.15, 0, 0.15].map((x, j) => (
                <group key={j} position={[x, 0, 0.015]}>
                  <planeGeometry args={[0.12, 0.1]} />
                  <meshStandardMaterial color="#000" emissive="#1f1f1f" />
                  {/* Status LED */}
                  <mesh position={[0.04, -0.03, 0.005]}>
                    <circleGeometry args={[0.006, 8]} />
                    <meshBasicMaterial name="led_green" color="#00ff00" />
                  </mesh>
                </group>
              ))}

              {/* Power/Network Status LEDs */}
              <group position={[0.35, 0, 0.015]}>
                <mesh position={[0, 0.03, 0]}>
                  <circleGeometry args={[0.015, 16]} />
                  <meshBasicMaterial color={C_SERVER} />
                </mesh>
                <mesh position={[0, -0.03, 0]}>
                  <planeGeometry args={[0.08, 0.02]} />
                  <meshBasicMaterial
                    color={Math.sin(Date.now() * 0.02 + i * 20) > 0 ? "#22cc22" : "#111"}
                  />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      </group>
    );
  }
);

ServerSkill.displayName = "ServerSkill";
