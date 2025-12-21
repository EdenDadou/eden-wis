import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface SatelliteProps {
  radius: number;
  speed: number;
  offset: number;
  tilt: number;
}

export default function Satellite({ radius, speed, offset, tilt }: SatelliteProps) {
  const ref = useRef<THREE.Group>(null);
  const blinkRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime * speed + offset;

    // Orbital motion
    ref.current.position.x = Math.cos(time) * radius;
    ref.current.position.y = Math.sin(time) * radius * Math.cos(tilt);
    ref.current.position.z = Math.sin(time) * radius * Math.sin(tilt);

    // Rotate satellite body
    ref.current.rotation.y = time * 2;

    // Blinking light
    if (blinkRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 8) > 0.7;
      (blinkRef.current.material as THREE.MeshBasicMaterial).opacity = blink
        ? 1
        : 0.2;
    }
  });

  return (
    <group ref={ref}>
      {/* Satellite body */}
      <mesh>
        <boxGeometry args={[0.1, 0.05, 0.05]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.12, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Blinking light */}
      <mesh ref={blinkRef} position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={1} />
      </mesh>
    </group>
  );
}
