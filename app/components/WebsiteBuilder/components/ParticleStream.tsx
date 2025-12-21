import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { ParticleStreamProps } from "../types";

export function ParticleStream({
  start,
  end,
  startColor = "#ffffff",
  endColor = "#ffffff",
  opacity = 1,
  drawProgress = 1,
}: ParticleStreamProps) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  const color1 = useMemo(() => new THREE.Color(startColor), [startColor]);
  const color2 = useMemo(() => new THREE.Color(endColor), [endColor]);

  const zOffset = -0.3;

  // Calculate current end point based on draw progress
  const currentEndVec = useMemo(() => {
    return new THREE.Vector3(
      THREE.MathUtils.lerp(startVec.x, endVec.x, drawProgress),
      THREE.MathUtils.lerp(startVec.y, endVec.y, drawProgress),
      zOffset
    );
  }, [startVec, endVec, drawProgress]);

  // Simple straight line behind 3D models
  const linePoints = useMemo(() => {
    return [
      new THREE.Vector3(startVec.x, startVec.y, zOffset),
      currentEndVec,
    ];
  }, [startVec, currentEndVec]);

  // Vertex colors for gradient (interpolate end color based on progress)
  const currentEndColor = useMemo(() => {
    return new THREE.Color().lerpColors(color1, color2, drawProgress);
  }, [color1, color2, drawProgress]);

  const vertexColors = useMemo(() => {
    return [color1, currentEndColor];
  }, [color1, currentEndColor]);

  // Mid color for glow layers
  const midColor = useMemo(() => {
    return new THREE.Color().lerpColors(color1, currentEndColor, 0.5);
  }, [color1, currentEndColor]);

  // Floating particles data
  const particleCount = 20;
  const particles = useMemo(() => {
    return new Array(particleCount).fill(0).map(() => ({
      offset: Math.random(), // Position along the line (0-1)
      speed: 0.1 + Math.random() * 0.15,
      drift: (Math.random() - 0.5) * 0.3, // Side drift
      driftSpeed: 0.5 + Math.random() * 1,
      size: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Animate particles
  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      // Move along the line, but only up to drawProgress
      const rawT = (particle.offset + time * particle.speed) % 1;
      const t = rawT * drawProgress; // Limit particles to drawn portion

      // Interpolate position along line
      const x = THREE.MathUtils.lerp(startVec.x, endVec.x, t);
      const y = THREE.MathUtils.lerp(startVec.y, endVec.y, t);

      // Add floating drift perpendicular to line
      const lineDir = new THREE.Vector3().subVectors(endVec, startVec).normalize();
      const perpX = -lineDir.y;
      const perpY = lineDir.x;
      const drift = Math.sin(time * particle.driftSpeed + particle.phase) * particle.drift;

      dummy.position.set(
        x + perpX * drift,
        y + perpY * drift,
        zOffset + Math.sin(time * 2 + particle.phase) * 0.05
      );

      // Pulsing size
      const pulse = 0.8 + Math.sin(time * 3 + particle.phase) * 0.2;
      dummy.scale.setScalar(particle.size * pulse);

      dummy.updateMatrix();
      particlesRef.current!.setMatrixAt(i, dummy.matrix);

      // Color based on position along line
      const color = new THREE.Color().lerpColors(color1, color2, t);
      particlesRef.current!.setColorAt(i, color);
    });

    particlesRef.current.instanceMatrix.needsUpdate = true;
    if (particlesRef.current.instanceColor) {
      particlesRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <Line
        points={linePoints}
        color={midColor}
        lineWidth={6}
        transparent
        opacity={opacity * 0.4}
      />

      {/* Core neon line with gradient */}
      <Line
        points={linePoints}
        vertexColors={vertexColors}
        lineWidth={2}
        transparent
        opacity={opacity * 1}
      />

      {/* Bright center */}
      <Line
        points={linePoints}
        color="white"
        lineWidth={0.5}
        transparent
        opacity={opacity * 0.5}
      />

      {/* Floating particles */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial
          transparent
          opacity={opacity * 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
