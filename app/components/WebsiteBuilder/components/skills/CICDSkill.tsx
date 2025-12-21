import { forwardRef } from "react";
import { RoundedBox, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { C_CICD, POS_CICD, SECTION_MAP } from "../../constants";

interface CICDSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  pipelineNodeRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}

export const CICDSkill = forwardRef<THREE.Group, CICDSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, pipelineNodeRefs }, ref) => {
    const section = SECTION_MAP.CICD;

    return (
      <group
        ref={ref}
        position={POS_CICD}
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
          fontSize={isActive ? 0.22 : 0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          CI/CD
        </Text>

        {/* Main Pipeline Container */}
        <RoundedBox args={[1.8, 1.3, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#1a1008" metalness={0.7} roughness={0.3} transparent opacity={0.9} />
        </RoundedBox>

        {/* Orange border glow */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.85, 1.35]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.15} />
        </mesh>

        {/* Pipeline Header Bar */}
        <RoundedBox args={[1.68, 0.12, 0.02]} radius={0.02} position={[0, 0.52, 0.05]}>
          <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.3} />
        </RoundedBox>
        <Text position={[-0.65, 0.52, 0.07]} fontSize={0.05} color="#ffffff" anchorX="left">
          main
        </Text>
        <Text position={[0.65, 0.52, 0.07]} fontSize={0.035} color="#ffffff" anchorX="right">
          running...
        </Text>

        {/* Pipeline Stages Container */}
        <group position={[0, 0, 0.05]}>
          {/* Stage 1: Source/Checkout */}
          <group position={[-0.55, 0.15, 0]} ref={(el) => (pipelineNodeRefs.current[0] = el)} scale={0}>
            <RoundedBox args={[0.35, 0.25, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#2a1a0a" />
            </RoundedBox>
            <mesh position={[0, 0.02, 0.02]}>
              <circleGeometry args={[0.06, 6]} />
              <meshBasicMaterial color="#ff6600" />
            </mesh>
            <Text position={[0, -0.08, 0.02]} fontSize={0.028} color="#ff9944" anchorX="center">
              Checkout
            </Text>
            <mesh position={[0.12, 0.08, 0.02]}>
              <circleGeometry args={[0.025, 16]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
          </group>

          {/* Arrow 1->2 */}
          <group position={[-0.3, 0.15, 0.02]}>
            <Line points={[[0, 0, 0], [0.15, 0, 0]]} color="#ff6600" lineWidth={3} />
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.03, 0.05, 8]} />
              <meshBasicMaterial color="#ff6600" />
            </mesh>
          </group>

          {/* Stage 2: Build */}
          <group position={[0, 0.15, 0]} ref={(el) => (pipelineNodeRefs.current[1] = el)} scale={0}>
            <RoundedBox args={[0.35, 0.25, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#2a1a0a" />
            </RoundedBox>
            <mesh position={[0, 0.02, 0.02]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.04, 0.08, 0.01]} />
              <meshBasicMaterial color="#ff8833" />
            </mesh>
            <mesh position={[0.02, 0.05, 0.02]}>
              <boxGeometry args={[0.06, 0.04, 0.01]} />
              <meshBasicMaterial color="#ff8833" />
            </mesh>
            <Text position={[0, -0.08, 0.02]} fontSize={0.028} color="#ff9944" anchorX="center">
              Build
            </Text>
            <mesh position={[0.12, 0.08, 0.02]}>
              <circleGeometry args={[0.025, 16]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
          </group>

          {/* Arrow 2->3 */}
          <group position={[0.25, 0.15, 0.02]}>
            <Line points={[[0, 0, 0], [0.15, 0, 0]]} color="#ff6600" lineWidth={3} />
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.03, 0.05, 8]} />
              <meshBasicMaterial color="#ff6600" />
            </mesh>
          </group>

          {/* Stage 3: Test */}
          <group position={[0.55, 0.15, 0]} ref={(el) => (pipelineNodeRefs.current[2] = el)} scale={0}>
            <RoundedBox args={[0.35, 0.25, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#2a1a0a" />
            </RoundedBox>
            <mesh position={[0, 0.02, 0.02]}>
              <cylinderGeometry args={[0.02, 0.04, 0.08, 8]} />
              <meshBasicMaterial color="#ffaa44" />
            </mesh>
            <Text position={[0, -0.08, 0.02]} fontSize={0.028} color="#ff9944" anchorX="center">
              Test
            </Text>
            <mesh position={[0.12, 0.08, 0.02]}>
              <circleGeometry args={[0.025, 16]} />
              <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={1.5} toneMapped={false} />
            </mesh>
          </group>

          {/* Arrow down from Test */}
          <group position={[0.55, -0.02, 0.02]}>
            <Line points={[[0, 0, 0], [0, -0.1, 0]]} color="#ff6600" lineWidth={3} dashed dashSize={0.02} gapSize={0.02} />
          </group>

          {/* Stage 4: Deploy Staging */}
          <group position={[0.55, -0.25, 0]} ref={(el) => (pipelineNodeRefs.current[3] = el)} scale={0}>
            <RoundedBox args={[0.35, 0.2, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#1a1205" />
            </RoundedBox>
            <mesh position={[0, 0.01, 0.02]}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="#666" />
            </mesh>
            <Text position={[0, -0.06, 0.02]} fontSize={0.025} color="#888" anchorX="center">
              Staging
            </Text>
            <mesh position={[0.12, 0.05, 0.02]}>
              <circleGeometry args={[0.02, 16]} />
              <meshBasicMaterial color="#444" />
            </mesh>
          </group>

          {/* Arrow to Production */}
          <group position={[0.25, -0.25, 0.02]}>
            <Line points={[[0.12, 0, 0], [-0.12, 0, 0]]} color="#444" lineWidth={2} dashed dashSize={0.02} gapSize={0.02} />
          </group>

          {/* Stage 5: Deploy Production */}
          <group position={[0, -0.25, 0]} ref={(el) => (pipelineNodeRefs.current[4] = el)} scale={0}>
            <RoundedBox args={[0.35, 0.2, 0.02]} radius={0.02}>
              <meshStandardMaterial color="#1a1205" />
            </RoundedBox>
            <mesh position={[0, 0.01, 0.02]} rotation={[0, 0, 0.5]}>
              <coneGeometry args={[0.02, 0.06, 8]} />
              <meshBasicMaterial color="#666" />
            </mesh>
            <Text position={[0, -0.06, 0.02]} fontSize={0.025} color="#888" anchorX="center">
              Production
            </Text>
            <mesh position={[0.12, 0.05, 0.02]}>
              <circleGeometry args={[0.02, 16]} />
              <meshBasicMaterial color="#444" />
            </mesh>
          </group>

          {/* Logs/Terminal preview */}
          <group position={[-0.35, -0.25, 0]}>
            <RoundedBox args={[0.5, 0.2, 0.01]} radius={0.01}>
              <meshBasicMaterial color="#0a0a0a" />
            </RoundedBox>
            <Text position={[-0.22, 0.05, 0.01]} fontSize={0.02} color="#ff6600" anchorX="left">
              $ npm run build
            </Text>
            <Text position={[-0.22, 0.02, 0.01]} fontSize={0.018} color="#888" anchorX="left">
              Building...
            </Text>
            <Text position={[-0.22, -0.01, 0.01]} fontSize={0.018} color="#22c55e" anchorX="left">
              ✓ Compiled
            </Text>
            <Text position={[-0.22, -0.04, 0.01]} fontSize={0.018} color="#ff9944" anchorX="left">
              Running tests...
            </Text>
          </group>
        </group>

        {/* Ambient orange glow */}
        <pointLight position={[0, 0, 0.5]} intensity={0.8} color="#ff6600" distance={2} decay={2} />
      </group>
    );
  }
);

CICDSkill.displayName = "CICDSkill";
