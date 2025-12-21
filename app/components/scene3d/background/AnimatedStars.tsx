import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function AnimatedStars() {
  const starsRef = useRef<THREE.Points>(null);
  const bigStarsRef = useRef<THREE.Points>(null);

  const [positions, bigPositions] = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    const bigPos = new Float32Array(50 * 3);

    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 15;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }

    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 25 + Math.random() * 10;
      bigPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bigPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bigPos[i * 3 + 2] = r * Math.cos(phi);
    }

    return [pos, bigPos];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
      starsRef.current.rotation.x = Math.sin(time * 0.005) * 0.1;
    }
    if (bigStarsRef.current) {
      bigStarsRef.current.rotation.y = -time * 0.008;
      bigStarsRef.current.rotation.z = Math.cos(time * 0.003) * 0.05;
    }
  });

  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      <points ref={bigStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bigPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#06b6d4"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </>
  );
}
