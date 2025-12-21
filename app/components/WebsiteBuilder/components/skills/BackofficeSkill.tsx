import { forwardRef } from "react";
import { RoundedBox, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { C_BACK, POS_BACKOFFICE, SECTION_MAP } from "../../constants";

interface BackofficeSkillProps {
  isActive: boolean;
  isInDetailSection: boolean;
  onSkillClick?: (section: number) => void;
  getLabelColor: (baseColor: string) => string;
  chartRefs: React.MutableRefObject<(THREE.Line | THREE.Mesh | THREE.Group | null)[]>;
}

export const BackofficeSkill = forwardRef<THREE.Group, BackofficeSkillProps>(
  ({ isActive, isInDetailSection, onSkillClick, getLabelColor, chartRefs }, ref) => {
    const section = SECTION_MAP.BACKOFFICE;

    return (
      <group
        ref={ref}
        position={POS_BACKOFFICE}
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
          color={getLabelColor(C_BACK)}
          anchorX="center"
          outlineWidth={isActive ? 0.015 : 0}
          outlineColor={C_BACK}
        >
          BACKOFFICE
        </Text>
        <Text
          position={[0, 0.73, 0]}
          fontSize={0.04}
          color={isActive ? "#aaa" : "#666"}
          anchorX="center"
        >
          Admin Dashboard
        </Text>

        {/* Main Container */}
        <RoundedBox args={[1.8, 1.3, 0.08]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#1a1510" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Gold/Orange border glow */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.85, 1.35]} />
          <meshBasicMaterial color={C_BACK} transparent opacity={0.12} />
        </mesh>

        {/* Header bar */}
        <RoundedBox args={[1.68, 0.1, 0.02]} radius={0.02} position={[0, 0.53, 0.05]}>
          <meshStandardMaterial color="#332200" emissive={C_BACK} emissiveIntensity={0.2} />
        </RoundedBox>
        <Text position={[-0.7, 0.53, 0.07]} fontSize={0.04} color={C_BACK} anchorX="left">
          Dashboard
        </Text>
        <Text position={[0.7, 0.53, 0.07]} fontSize={0.025} color="#888" anchorX="right">
          Admin
        </Text>

        {/* Dashboard Content */}
        <group position={[0, -0.05, 0.05]}>
          {/* TOP ROW: KPI Cards */}
          <group position={[0, 0.25, 0]} ref={(el) => (chartRefs.current[0] = el)} scale={0}>
            {[
              { label: "Users", value: "12,847", color: "#22c55e", x: -0.52 },
              { label: "Revenue", value: "$48.2K", color: C_BACK, x: -0.17 },
              { label: "Orders", value: "1,284", color: "#3b82f6", x: 0.17 },
              { label: "Growth", value: "+24%", color: "#a855f7", x: 0.52 },
            ].map((kpi, i) => (
              <group key={i} position={[kpi.x, 0, 0]}>
                <RoundedBox args={[0.3, 0.15, 0.01]} radius={0.01}>
                  <meshStandardMaterial color="#1a1a1a" />
                </RoundedBox>
                <Text position={[0, 0.03, 0.01]} fontSize={0.018} color="#666" anchorX="center">
                  {kpi.label}
                </Text>
                <Text position={[0, -0.025, 0.01]} fontSize={0.028} color={kpi.color} anchorX="center">
                  {kpi.value}
                </Text>
              </group>
            ))}
          </group>

          {/* Line Chart - Left */}
          <group position={[-0.4, -0.02, 0]} ref={(el) => (chartRefs.current[1] = el)} scale={0}>
            <RoundedBox args={[0.65, 0.4, 0.01]} radius={0.01}>
              <meshStandardMaterial color="#141414" />
            </RoundedBox>
            <Text position={[0, 0.15, 0.01]} fontSize={0.025} color="#888" anchorX="center">
              Traffic Overview
            </Text>
            {/* Grid lines */}
            {[-0.1, 0, 0.1].map((y, i) => (
              <Line key={i} points={[[-0.28, y - 0.02, 0.01], [0.28, y - 0.02, 0.01]]} color="#222" lineWidth={1} />
            ))}
            {/* Area chart */}
            <Line
              points={[
                [-0.28, -0.12, 0.015],
                [-0.2, -0.05, 0.015],
                [-0.1, -0.08, 0.015],
                [0, 0.02, 0.015],
                [0.1, -0.02, 0.015],
                [0.2, 0.08, 0.015],
                [0.28, 0.05, 0.015],
              ]}
              color={C_BACK}
              lineWidth={2}
            />
            {/* Data points */}
            {[[-0.28, -0.12], [-0.2, -0.05], [-0.1, -0.08], [0, 0.02], [0.1, -0.02], [0.2, 0.08], [0.28, 0.05]].map((p, i) => (
              <mesh key={i} position={[p[0], p[1], 0.02]}>
                <circleGeometry args={[0.015, 12]} />
                <meshBasicMaterial color={C_BACK} />
              </mesh>
            ))}
          </group>

          {/* Donut Chart - Right */}
          <group position={[0.4, -0.02, 0]} ref={(el) => (chartRefs.current[2] = el)} scale={0}>
            <RoundedBox args={[0.65, 0.4, 0.01]} radius={0.01}>
              <meshStandardMaterial color="#141414" />
            </RoundedBox>
            <Text position={[0, 0.15, 0.01]} fontSize={0.025} color="#888" anchorX="center">
              Revenue Sources
            </Text>

            {/* Donut chart */}
            <group position={[0, -0.03, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[0.1, 0.035, 8, 32, Math.PI * 1.1]} />
                <meshBasicMaterial color={C_BACK} />
              </mesh>
              <mesh rotation={[0, Math.PI * 1.1, 0]}>
                <torusGeometry args={[0.1, 0.035, 8, 32, Math.PI * 0.5]} />
                <meshBasicMaterial color="#3b82f6" />
              </mesh>
              <mesh rotation={[0, Math.PI * 1.6, 0]}>
                <torusGeometry args={[0.1, 0.035, 8, 32, Math.PI * 0.4]} />
                <meshBasicMaterial color="#a855f7" />
              </mesh>
            </group>

            {/* Center text */}
            <Text position={[0, -0.03, 0.02]} fontSize={0.03} color="#fff" anchorX="center">
              $48.2K
            </Text>

            {/* Legend */}
            <group position={[0.22, -0.03, 0.01]}>
              <mesh position={[0, 0.05, 0]}>
                <circleGeometry args={[0.012, 8]} />
                <meshBasicMaterial color={C_BACK} />
              </mesh>
              <Text position={[0.04, 0.05, 0]} fontSize={0.015} color="#888" anchorX="left">
                Products
              </Text>
              <mesh position={[0, 0.02, 0]}>
                <circleGeometry args={[0.012, 8]} />
                <meshBasicMaterial color="#3b82f6" />
              </mesh>
              <Text position={[0.04, 0.02, 0]} fontSize={0.015} color="#888" anchorX="left">
                Services
              </Text>
              <mesh position={[0, -0.01, 0]}>
                <circleGeometry args={[0.012, 8]} />
                <meshBasicMaterial color="#a855f7" />
              </mesh>
              <Text position={[0.04, -0.01, 0]} fontSize={0.015} color="#888" anchorX="left">
                Other
              </Text>
            </group>
          </group>

          {/* Recent Activity */}
          <group position={[0, -0.35, 0]} ref={(el) => (chartRefs.current[3] = el)} scale={0}>
            <RoundedBox args={[1.4, 0.18, 0.01]} radius={0.01}>
              <meshStandardMaterial color="#141414" />
            </RoundedBox>
            <Text position={[-0.6, 0.05, 0.01]} fontSize={0.022} color="#888" anchorX="left">
              Recent Activity
            </Text>

            {[
              { text: "New order #1284", time: "2m ago", x: -0.45 },
              { text: "User registered", time: "5m ago", x: 0 },
              { text: "Payment received", time: "12m ago", x: 0.45 },
            ].map((item, i) => (
              <group key={i} position={[item.x, -0.03, 0.01]}>
                <mesh position={[-0.12, 0, 0]}>
                  <circleGeometry args={[0.015, 12]} />
                  <meshBasicMaterial color={i === 0 ? "#22c55e" : i === 1 ? "#3b82f6" : C_BACK} />
                </mesh>
                <Text position={[-0.08, 0.01, 0]} fontSize={0.016} color="#ccc" anchorX="left">
                  {item.text}
                </Text>
                <Text position={[-0.08, -0.02, 0]} fontSize={0.012} color="#666" anchorX="left">
                  {item.time}
                </Text>
              </group>
            ))}
          </group>
        </group>

        {/* Ambient gold glow */}
        <pointLight position={[0, 0, 0.5]} intensity={0.5} color={C_BACK} distance={2} decay={2} />
      </group>
    );
  }
);

BackofficeSkill.displayName = "BackofficeSkill";
