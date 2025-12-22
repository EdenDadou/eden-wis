import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function SpaceDust() {
  const ref = useRef<THREE.Points>(null);
  const lastUpdateRef = useRef(0);

  const positions = useMemo(() => {
    // Reduced from 200 to 100 particles for better performance
    const pos = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  // Throttle to ~30fps for background elements
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    if (time - lastUpdateRef.current < 0.033) return;
    lastUpdateRef.current = time;

    ref.current.rotation.y = time * 0.02;
    ref.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#06b6d4"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}
