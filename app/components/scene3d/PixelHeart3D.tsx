import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, memo, useLayoutEffect } from "react";
import * as THREE from "three";
import { ORBIT_RADIUS } from "./camera.constants";

// === CACHED GEOMETRY & MATERIALS (module-level singleton) ===
let cachedGeometry: THREE.BoxGeometry | null = null;
let cachedHeartMaterial: THREE.MeshStandardMaterial | null = null;
let cachedRingMaterial1: THREE.MeshBasicMaterial | null = null;
let cachedRingMaterial2: THREE.MeshBasicMaterial | null = null;
let cachedRingMaterial3: THREE.MeshBasicMaterial | null = null;
let cachedParticleMaterial: THREE.PointsMaterial | null = null;
let cachedPositions: Float32Array | null = null;
let cachedInstanceCount = 0;

const SIZE = 0.36;

function getBoxGeometry(): THREE.BoxGeometry {
  if (!cachedGeometry) {
    // Minimal segments for performance
    cachedGeometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE, 1, 1, 1);
  }
  return cachedGeometry;
}

function getHeartMaterial(): THREE.MeshStandardMaterial {
  if (!cachedHeartMaterial) {
    cachedHeartMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.4,
    });
  }
  return cachedHeartMaterial;
}

function getRingMaterials(): [THREE.MeshBasicMaterial, THREE.MeshBasicMaterial, THREE.MeshBasicMaterial] {
  if (!cachedRingMaterial1) {
    cachedRingMaterial1 = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.25 });
    cachedRingMaterial2 = new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.12 });
    cachedRingMaterial3 = new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.06 });
  }
  return [cachedRingMaterial1, cachedRingMaterial2!, cachedRingMaterial3!];
}

function getParticleMaterial(opacity: number): THREE.PointsMaterial {
  if (!cachedParticleMaterial) {
    cachedParticleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x4ade80,
      transparent: true,
      opacity: 0.6 * opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
  }
  return cachedParticleMaterial;
}

// Pre-compute heart positions once at module load
function getHeartData(): { positions: Float32Array; count: number } {
  if (cachedPositions) {
    return { positions: cachedPositions, count: cachedInstanceCount };
  }

  const resolution = 12;
  const scale = 0.38;
  const tempPositions: number[] = [];

  const isInsideHeart = (x: number, y: number, z: number): boolean => {
    const x2 = x * x;
    const y2 = y * y;
    const z2 = z * z;
    const a = x2 + 2.25 * z2 + y2 - 1; // 9/4 = 2.25
    const value = a * a * a - x2 * y2 * y - 0.1125 * z2 * y2 * y; // 9/80 = 0.1125
    return value <= 0;
  };

  for (let ix = -resolution; ix <= resolution; ix++) {
    const x = (ix / resolution) * 1.3;
    for (let iy = -resolution; iy <= resolution; iy++) {
      const y = (iy / resolution) * 1.3;
      for (let iz = -resolution; iz <= resolution; iz++) {
        const z = (iz / resolution) * 1.3;
        if (isInsideHeart(x, y, z)) {
          tempPositions.push(ix * scale, iy * scale, iz * scale);
        }
      }
    }
  }

  cachedPositions = new Float32Array(tempPositions);
  cachedInstanceCount = tempPositions.length / 3;
  return { positions: cachedPositions, count: cachedInstanceCount };
}

// Pre-generate on module load
getHeartData();

// === CACHED RING GEOMETRIES ===
let cachedRingGeo1: THREE.TorusGeometry | null = null;
let cachedRingGeo2: THREE.TorusGeometry | null = null;
let cachedRingGeo3: THREE.TorusGeometry | null = null;

function getRingGeometries(): [THREE.TorusGeometry, THREE.TorusGeometry, THREE.TorusGeometry] {
  if (!cachedRingGeo1) {
    // Reduced segments: 8 radial, 64 tubular (was 16, 120)
    cachedRingGeo1 = new THREE.TorusGeometry(ORBIT_RADIUS, 0.04, 8, 64);
    cachedRingGeo2 = new THREE.TorusGeometry(ORBIT_RADIUS * 0.92, 0.02, 8, 64);
    cachedRingGeo3 = new THREE.TorusGeometry(ORBIT_RADIUS * 1.05, 0.015, 8, 64);
  }
  return [cachedRingGeo1, cachedRingGeo2!, cachedRingGeo3!];
}

// === OPTIMIZED HEART VOXELS ===
const HeartVoxels = memo(function HeartVoxels() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { count } = getHeartData();
  const geometry = getBoxGeometry();
  const material = getHeartMaterial();

  // Pre-computed matrix array for initialization
  const matrices = useMemo(() => {
    const { positions, count } = getHeartData();
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
  const material = getParticleMaterial(0.4);

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
  const [, geo2, geo3] = getRingGeometries();
  const [, mat2, mat3] = getRingMaterials();

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
