import { forwardRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { C_CLOUD, POS_CLOUD, SECTION_MAP } from "../../constants";

interface CloudSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  cloudNodeRefs: React.MutableRefObject<(THREE.Mesh | THREE.Group | null)[]>;
}

export const CloudSkill = forwardRef<THREE.Group, CloudSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, cloudNodeRefs }, ref) => {
    const section = SECTION_MAP.CLOUD;

    return (
      <group
        ref={ref}
        position={POS_CLOUD}
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
          fontSize={isActive ? 0.11 : 0.09}
          color={getLabelColor("#4a90d9")}
          anchorX="center"
          outlineWidth={isActive ? 0.015 : 0}
          outlineColor="#4a90d9"
        >
          CLOUD
        </Text>
        <Text
          position={[0, 0.73, 0]}
          fontSize={0.04}
          color={isActive ? "#aaa" : "#666"}
          anchorX="center"
        >
          AWS / Infrastructure
        </Text>

        {/* Main Container */}
        <RoundedBox args={[1.8, 1.3, 0.1]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#0a1628" metalness={0.8} roughness={0.3} />
        </RoundedBox>

        {/* Blue border glow */}
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[1.85, 1.35]} />
          <meshBasicMaterial color="#1e3a5f" transparent opacity={0.2} />
        </mesh>

        {/* Header bar */}
        <RoundedBox args={[1.6, 0.1, 0.02]} radius={0.02} position={[0, 0.48, 0.06]}>
          <meshStandardMaterial color="#1e3a5f" emissive="#2563eb" emissiveIntensity={0.3} />
        </RoundedBox>

        {/* Large Cloud Icon */}
        <group position={[0.5, 0.15, 0.15]} scale={0.35}>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.15, 0.05, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0.15, 0.05, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="#4a90d9" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.9} />
          </mesh>
        </group>

        <Text position={[-0.6, 0.48, 0.08]} fontSize={0.04} color="#4a90d9" anchorX="left">
          Cloud Services
        </Text>

        {/* Cloud Infrastructure Visualization */}
        <group position={[0, 0, 0.06]}>
          {/* Region/Availability Zone boxes */}
          <group position={[-0.45, 0.1, 0]}>
            <RoundedBox args={[0.4, 0.35, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#0f2744" />
            </RoundedBox>
            <Text position={[0, 0.12, 0.02]} fontSize={0.025} color="#4a90d9" anchorX="center">
              Region EU
            </Text>
            {/* Server icons */}
            {[-0.1, 0.1].map((x, i) => (
              <group
                key={i}
                position={[x, -0.02, 0.02]}
                ref={(el) => (cloudNodeRefs.current[i] = el)}
                scale={0}
              >
                <RoundedBox args={[0.12, 0.15, 0.01]} radius={0.01}>
                  <meshStandardMaterial color="#1e3a5f" />
                </RoundedBox>
                <mesh position={[0.04, 0.05, 0.01]}>
                  <circleGeometry args={[0.012, 8]} />
                  <meshBasicMaterial color="#22c55e" />
                </mesh>
                <mesh position={[0.04, 0.02, 0.01]}>
                  <circleGeometry args={[0.012, 8]} />
                  <meshBasicMaterial color="#22c55e" />
                </mesh>
                {[-0.02, -0.04].map((y, j) => (
                  <mesh key={j} position={[-0.01, y, 0.01]}>
                    <planeGeometry args={[0.08, 0.008]} />
                    <meshBasicMaterial color="#2563eb" />
                  </mesh>
                ))}
              </group>
            ))}
          </group>

          {/* CDN / Edge nodes */}
          <group position={[0.45, 0.1, 0]}>
            <RoundedBox args={[0.4, 0.35, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#0f2744" />
            </RoundedBox>
            <Text position={[0, 0.12, 0.02]} fontSize={0.025} color="#4a90d9" anchorX="center">
              CDN Edge
            </Text>
            <group
              position={[0, -0.02, 0.02]}
              ref={(el) => (cloudNodeRefs.current[2] = el)}
              scale={0}
            >
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#1e3a5f" wireframe />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.5} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.1, 0.005, 8, 32]} />
                <meshBasicMaterial color="#4a90d9" />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
                <torusGeometry args={[0.1, 0.005, 8, 32]} />
                <meshBasicMaterial color="#4a90d9" />
              </mesh>
            </group>
          </group>

          {/* Storage row */}
          <group position={[0, -0.22, 0]}>
            <RoundedBox args={[1.3, 0.2, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#0f2744" />
            </RoundedBox>
            <Text position={[-0.55, 0, 0.02]} fontSize={0.025} color="#4a90d9" anchorX="left">
              Storage
            </Text>
            {[0, 0.2, 0.4].map((x, i) => (
              <group key={i} position={[x - 0.1, 0, 0.02]}>
                <RoundedBox args={[0.15, 0.08, 0.01]} radius={0.005}>
                  <meshBasicMaterial color="#1e3a5f" />
                </RoundedBox>
                <mesh position={[-0.04 + 0.04 * (i + 1) * 0.3, 0, 0.01]}>
                  <planeGeometry args={[0.08 * (0.3 + i * 0.25), 0.04]} />
                  <meshBasicMaterial color={i === 2 ? "#f59e0b" : "#22c55e"} />
                </mesh>
              </group>
            ))}
            <Text position={[0.55, 0, 0.02]} fontSize={0.02} color="#22c55e" anchorX="right">
              99.9% uptime
            </Text>
          </group>
        </group>

        {/* Ambient blue glow */}
        <pointLight position={[0, 0, 0.5]} intensity={0.6} color="#2563eb" distance={2} decay={2} />
      </group>
    );
  }
);

CloudSkill.displayName = "CloudSkill";
