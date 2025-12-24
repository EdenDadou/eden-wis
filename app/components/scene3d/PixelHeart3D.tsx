import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, memo, useLayoutEffect } from "react";
import * as THREE from "three";
import { ORBIT_RADIUS } from "./camera.constants";
import {
  getHeartBoxGeometry,
  getHeartMaterial,
  getHeartPositionsData,
  getHeartRingGeometries,
  getHeartRingMaterials,
  getHeartParticleMaterial,
} from "./cache";

// === OPTIMIZED HEART VOXELS ===
const HeartVoxels = memo(function HeartVoxels() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { count } = getHeartPositionsData();
  const geometry = useMemo(() => getHeartBoxGeometry(), []);
  const material = useMemo(() => getHeartMaterial(), []);

  // Pre-computed matrix array for initialization
  const matrices = useMemo(() => {
    const { positions, count } = getHeartPositionsData();
    const arr = new Float32Array(count * 16);
    const matrix = new THREE.Matrix4();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      matrix.makeTranslation(positions[idx], positions[idx + 1], positions[idx + 2]);
      matrix.toArray(arr, i * 16);
    }
    return arr;
  }, []);

  // Initialize matrices after mount
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.instanceMatrix.array.set(matrices);
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  // Minimal animation - only update what's necessary
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    // Breathing animation on scale
    const breathe = 1 + Math.sin(t * 2) * 0.015;
    meshRef.current.scale.setScalar(breathe);

    // Emissive pulse
    material.emissiveIntensity = 0.12 + Math.sin(t * 1.5) * 0.05;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
});

// === OPTIMIZED PARTICLES (reduced count, Float32 velocities) ===
const PARTICLE_COUNT = 50; // Reduced from 100

const HeartParticles = memo(function HeartParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const material = useMemo(() => getHeartParticleMaterial(), []);

  // Use Float32Array for velocities too (cache-friendly)
  const [positions, velocities, lifetimes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const life = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * 2;
      pos[i3 + 2] = (Math.random() - 0.5);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.5 + Math.random();
      vel[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 0.5;
      vel[i3 + 2] = Math.cos(phi) * speed * 0.5;

      life[i] = Math.random();
    }

    return [pos, vel, life];
  }, []);

  useFrame(({ clock }, delta) => {
    if (!particlesRef.current) return;
    const posAttr = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const deltaSpeed = delta * 0.3;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      lifetimes[i] += deltaSpeed;

      if (lifetimes[i] > 1) {
        lifetimes[i] = 0;
        posAttr[i3] = (Math.random() - 0.5) * 2;
        posAttr[i3 + 1] = (Math.random() - 0.5) * 2;
        posAttr[i3 + 2] = (Math.random() - 0.5);
      } else {
        const speed = (1 - lifetimes[i] * 0.5) * delta;
        posAttr[i3] += velocities[i3] * speed;
        posAttr[i3 + 1] += velocities[i3 + 1] * speed;
        posAttr[i3 + 2] += velocities[i3 + 2] * speed;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = clock.elapsedTime * 0.1;
  });

  return (
    <points ref={particlesRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
});

// === STATIC RINGS ===
const OrbitRings = memo(function OrbitRings() {
  const [, geo2, geo3] = useMemo(() => getHeartRingGeometries(ORBIT_RADIUS), []);
  const [, mat2, mat3] = useMemo(() => getHeartRingMaterials(), []);

  return (
    <>
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]} geometry={geo2} material={mat2} />
      <mesh rotation={[Math.PI / 2.5, -0.15, 0.1]} geometry={geo3} material={mat3} />
    </>
  );
});

// === MAIN COMPONENT ===
export default memo(function PixelHeart3D() {
  const heartRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!heartRef.current) return;
    const t = clock.elapsedTime;

    heartRef.current.rotation.y = Math.sin(t * 0.3) * 0.3 + Math.PI / 6;
    heartRef.current.rotation.x = Math.sin(t * 0.2) * 0.1 - 0.2;
    heartRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <group>
      {/* Lumière au-dessus du coeur */}
      <pointLight position={[0, 8, 2]} intensity={2} color="#ffffff" distance={15} decay={2} />
      <HeartParticles />
      <group ref={heartRef} scale={2}>
        <HeartVoxels />
      </group>
      <OrbitRings />
    </group>
  );
});
