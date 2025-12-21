import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { ParticleStreamProps } from "../types";

export function ParticleStream({
  start,
  end,
  startColor = "#ffffff",
  endColor = "#ffffff",
  speed = 0.5,
  count = 10,
  showParticles = true,
  opacity = 1,
}: ParticleStreamProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  const color1 = useMemo(() => new THREE.Color(startColor), [startColor]);
  const color2 = useMemo(() => new THREE.Color(endColor), [endColor]);

  // Random offsets and direction for each particle
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      offset: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      reverse: Math.random() > 0.5,
    }));
  }, [count]);

  useLayoutEffect(() => {
    const applyColors = (ref: React.RefObject<THREE.InstancedMesh | null>) => {
      if (!ref.current) return;
      particles.forEach((p, i) => {
        ref.current?.setColorAt(i, p.reverse ? color2 : color1);
      });
      ref.current.instanceColor!.needsUpdate = true;
    };

    if (showParticles) {
      applyColors(meshRef);
      applyColors(glowRef);
    }
  }, [particles, color1, color2, showParticles]);

  useFrame((state) => {
    if (!showParticles) return;

    // Update core particles
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        const direction = particle.reverse ? -1 : 1;
        const t =
          (state.clock.getElapsedTime() * speed * particle.speed * direction +
            particle.offset) %
          1;
        const normalizedT = t < 0 ? 1 + t : t;

        dummy.position.lerpVectors(startVec, endVec, normalizedT);
        const scale =
          0.8 + Math.sin(state.clock.getElapsedTime() * 5 + i) * 0.3;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update glow particles
    if (glowRef.current && meshRef.current) {
      particles.forEach((particle, i) => {
        const direction = particle.reverse ? -1 : 1;
        const t =
          (state.clock.getElapsedTime() * speed * particle.speed * direction +
            particle.offset) %
          1;
        const normalizedT = t < 0 ? 1 + t : t;

        dummy.position.lerpVectors(startVec, endVec, normalizedT);
        const scale =
          0.8 + Math.sin(state.clock.getElapsedTime() * 5 + i) * 0.3;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        glowRef.current?.setMatrixAt(i, dummy.matrix);
      });
      glowRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Base solid line - ALWAYS VISIBLE if component is rendered */}
      <Line
        points={[startVec, endVec]}
        color={undefined}
        vertexColors={[color1, color2]}
        opacity={0.15 * opacity}
        transparent
        lineWidth={2}
        dashed={false}
      />

      {/* Particles - CONDITIONALLY VISIBLE */}
      {showParticles && (
        <>
          {/* Outer Glow (Blur) */}
          <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial
              toneMapped={false}
              transparent
              opacity={0.15 * opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </instancedMesh>

          {/* Inner Core */}
          <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              toneMapped={false}
              transparent
              opacity={0.6 * opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </instancedMesh>
        </>
      )}
    </>
  );
}
