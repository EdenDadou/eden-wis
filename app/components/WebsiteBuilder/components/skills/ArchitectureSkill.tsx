import { forwardRef } from "react";
import { RoundedBox, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { C_ARCHI, POS_ARCHI, SECTION_MAP } from "../../constants";

interface ArchitectureSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  checklistRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}

export const ArchitectureSkill = forwardRef<THREE.Group, ArchitectureSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, checklistRefs }, ref) => {
    const section = SECTION_MAP.ARCHITECTURE;

    return (
      <group
        ref={ref}
        position={POS_ARCHI}
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
          position={[0, -0.85, 0]}
          fontSize={isActive ? 0.24 : 0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          fontWeight="bold"
        >
          ARCHITECTURE
        </Text>

        {/* Main Container */}
        <RoundedBox args={[1.8, 1.3, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#0a1520" metalness={0.7} roughness={0.3} transparent opacity={0.9} />
        </RoundedBox>

        {/* Cyan border glow */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.85, 1.35]} />
          <meshBasicMaterial color={C_ARCHI} transparent opacity={0.1} />
        </mesh>

        {/* Header bar */}
        <RoundedBox args={[1.68, 0.1, 0.02]} radius={0.02} position={[0, 0.48, 0.05]}>
          <meshStandardMaterial color="#0e4b5f" emissive={C_ARCHI} emissiveIntensity={0.3} />
        </RoundedBox>
        <Text position={[-0.7, 0.48, 0.07]} fontSize={0.04} color={C_ARCHI} anchorX="left">
          System Blueprint
        </Text>
        <Text position={[0.7, 0.48, 0.07]} fontSize={0.03} color={C_ARCHI} anchorX="right">
          v2.0
        </Text>

        {/* Architecture Diagram */}
        <group position={[0, -0.05, 0.05]}>
          {/* Microservices boxes */}
          {[
            { name: "API Gateway", x: 0, y: 0.18 },
            { name: "Auth Service", x: -0.45, y: -0.05 },
            { name: "Core Service", x: 0.45, y: -0.05 },
          ].map((service, i) => (
            <group
              key={i}
              position={[service.x, service.y, 0]}
              ref={(el) => (checklistRefs.current[i] = el)}
              scale={0}
            >
              <RoundedBox args={[0.55, 0.2, 0.01]} radius={0.02}>
                <meshStandardMaterial color="#0e2a35" />
              </RoundedBox>
              <mesh position={[-0.18, 0, 0.01]}>
                <boxGeometry args={[0.08, 0.08, 0.01]} />
                <meshBasicMaterial color={C_ARCHI} />
              </mesh>
              <Text position={[0.05, 0, 0.01]} fontSize={0.025} color={C_ARCHI} anchorX="left">
                {service.name}
              </Text>
            </group>
          ))}

          {/* Connection lines between services */}
          <Line
            points={[[0, 0.08, 0.02], [-0.3, -0.05, 0.02]]}
            color={C_ARCHI}
            lineWidth={2}
            opacity={0.5}
            transparent
          />
          <Line
            points={[[0, 0.08, 0.02], [0.3, -0.05, 0.02]]}
            color={C_ARCHI}
            lineWidth={2}
            opacity={0.5}
            transparent
          />
          <Line
            points={[[-0.15, -0.05, 0.02], [0.15, -0.05, 0.02]]}
            color={C_ARCHI}
            lineWidth={2}
            opacity={0.5}
            transparent
            dashed
            dashSize={0.02}
            gapSize={0.02}
          />

          {/* Database layer */}
          <group position={[0, -0.28, 0]}>
            <RoundedBox args={[1.2, 0.15, 0.01]} radius={0.01}>
              <meshStandardMaterial color="#0e2a35" />
            </RoundedBox>
            <mesh position={[-0.45, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
              <meshBasicMaterial color={C_ARCHI} />
            </mesh>
            <Text position={[-0.3, 0, 0.01]} fontSize={0.025} color="#888" anchorX="left">
              PostgreSQL
            </Text>
            <mesh position={[0.15, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <Text position={[0.3, 0, 0.01]} fontSize={0.025} color="#888" anchorX="left">
              Redis
            </Text>
          </group>

          {/* Scalability indicators */}
          <group position={[0.6, 0.18, 0]}>
            <Text position={[0, 0.05, 0.01]} fontSize={0.02} color="#666" anchorX="center">
              Replicas
            </Text>
            <Text position={[0, -0.02, 0.01]} fontSize={0.03} color={C_ARCHI} anchorX="center">
              x3
            </Text>
          </group>
        </group>

        {/* Ambient cyan glow */}
        <pointLight position={[0, 0, 0.5]} intensity={0.5} color={C_ARCHI} distance={2} decay={2} />
      </group>
    );
  }
);

ArchitectureSkill.displayName = "ArchitectureSkill";
