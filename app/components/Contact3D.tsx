import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { SECTION_ANGLES, ORBIT_RADIUS } from "./scene3d";

// Paper Plane 3D - Classic simple origami style
function PaperPlane() {
  const planeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!planeRef.current) return;
    const t = state.clock.elapsedTime;
    planeRef.current.position.y = Math.sin(t * 0.4) * 0.15;
    planeRef.current.rotation.z = Math.sin(t * 0.4) * 0.03;
  });

  const paperMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#f8f8f8",
    side: THREE.DoubleSide,
    metalness: 0,
    roughness: 0.85,
    flatShading: true,
  }), []);

  const paperMaterialBack = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#e8e8e8",
    side: THREE.DoubleSide,
    metalness: 0,
    roughness: 0.85,
    flatShading: true,
  }), []);

  // Classic paper plane proportions (dart style)
  // Length: 3 units, Wingspan: 2 units, Height: 0.4 units
  const length = 1.5;
  const wingspan = 1;
  const wingAngle = 0.15; // How much wings angle up

  return (
    <group ref={planeRef} rotation={[-0.4, -0.6, 0.15]}>
      {/* Right Wing - single triangle */}
      <mesh material={paperMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              length, 0, 0,                    // nose
              -length * 0.5, 0, 0,             // back center
              -length * 0.5, wingAngle, wingspan,  // wing tip
            ]), 3]}
          />
        </bufferGeometry>
      </mesh>

      {/* Left Wing - single triangle */}
      <mesh material={paperMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              length, 0, 0,                     // nose
              -length * 0.5, wingAngle, -wingspan, // wing tip
              -length * 0.5, 0, 0,              // back center
            ]), 3]}
          />
        </bufferGeometry>
      </mesh>

      {/* Body Right - bottom fold */}
      <mesh material={paperMaterialBack}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              length, 0, 0,                       // nose
              -length * 0.5, -0.2, wingspan * 0.3, // bottom back right
              -length * 0.5, 0, 0,                // back center
            ]), 3]}
          />
        </bufferGeometry>
      </mesh>

      {/* Body Left - bottom fold */}
      <mesh material={paperMaterialBack}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              length, 0, 0,                        // nose
              -length * 0.5, 0, 0,                 // back center
              -length * 0.5, -0.2, -wingspan * 0.3, // bottom back left
            ]), 3]}
          />
        </bufferGeometry>
      </mesh>
    </group>
  );
}

const SECTION_ANGLE = SECTION_ANGLES.contact;

export default function Contact3D() {
  const posX = Math.sin(SECTION_ANGLE) * ORBIT_RADIUS;
  const posZ = Math.cos(SECTION_ANGLE) * ORBIT_RADIUS;
  const rotationY = SECTION_ANGLE;

  return (
    <group position={[posX, 0, posZ]} rotation={[0, rotationY, 0]}>
      <Float rotationIntensity={0.05} floatIntensity={0.1} speed={1}>
        <group scale={1.8}>
          <PaperPlane />
        </group>
      </Float>

      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={0.4} color="#ffffff" />
    </group>
  );
}
