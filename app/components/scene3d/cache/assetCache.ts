import * as THREE from "three";

/**
 * Centralized asset cache for 3D geometries, materials, and textures.
 * All assets are created once and reused across the application.
 */

// === GEOMETRY CACHE ===
const geometryCache = new Map<string, THREE.BufferGeometry>();

export function getCachedGeometry(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
  if (!geometryCache.has(key)) {
    geometryCache.set(key, factory());
  }
  return geometryCache.get(key)!;
}

// === MATERIAL CACHE ===
const materialCache = new Map<string, THREE.Material>();

export function getCachedMaterial<T extends THREE.Material>(key: string, factory: () => T): T {
  if (!materialCache.has(key)) {
    materialCache.set(key, factory());
  }
  return materialCache.get(key) as T;
}

// === TEXTURE CACHE ===
const textureCache = new Map<string, THREE.Texture>();

export function getCachedTexture(key: string, factory: () => THREE.Texture): THREE.Texture {
  if (!textureCache.has(key)) {
    textureCache.set(key, factory());
  }
  return textureCache.get(key)!;
}

// === PRE-DEFINED CACHED ASSETS ===

// Stars geometry
export function getStarsGeometry(count: number): THREE.BufferGeometry {
  return getCachedGeometry(`stars-${count}`, () => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 15;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  });
}

// Big stars geometry
export function getBigStarsGeometry(count: number): THREE.BufferGeometry {
  return getCachedGeometry(`big-stars-${count}`, () => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 25 + Math.random() * 10;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  });
}

// Space dust geometry
export function getSpaceDustGeometry(count: number): THREE.BufferGeometry {
  return getCachedGeometry(`space-dust-${count}`, () => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  });
}

// Stars material
export function getStarsMaterial(): THREE.PointsMaterial {
  return getCachedMaterial("stars-material", () =>
    new THREE.PointsMaterial({
      size: 0.08,
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })
  );
}

// Big stars material
export function getBigStarsMaterial(): THREE.PointsMaterial {
  return getCachedMaterial("big-stars-material", () =>
    new THREE.PointsMaterial({
      size: 0.2,
      color: "#06b6d4",
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    })
  );
}

// Space dust material
export function getSpaceDustMaterial(): THREE.PointsMaterial {
  return getCachedMaterial("space-dust-material", () =>
    new THREE.PointsMaterial({
      size: 0.03,
      color: "#06b6d4",
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    })
  );
}

// Gradient sky sphere geometry (reduced segments for perf)
export function getSkyGeometry(): THREE.SphereGeometry {
  return getCachedGeometry("sky-sphere", () =>
    new THREE.SphereGeometry(50, 32, 32)
  ) as THREE.SphereGeometry;
}

// Satellite geometries
export function getSatelliteBodyGeometry(): THREE.BoxGeometry {
  return getCachedGeometry("satellite-body", () =>
    new THREE.BoxGeometry(0.1, 0.05, 0.05)
  ) as THREE.BoxGeometry;
}

export function getSatellitePanelGeometry(): THREE.BoxGeometry {
  return getCachedGeometry("satellite-panel", () =>
    new THREE.BoxGeometry(0.15, 0.01, 0.08)
  ) as THREE.BoxGeometry;
}

export function getSatelliteLightGeometry(): THREE.SphereGeometry {
  return getCachedGeometry("satellite-light", () =>
    new THREE.SphereGeometry(0.015, 8, 8)
  ) as THREE.SphereGeometry;
}

// Satellite materials
export function getSatelliteBodyMaterial(): THREE.MeshStandardMaterial {
  return getCachedMaterial("satellite-body-mat", () =>
    new THREE.MeshStandardMaterial({ color: "#888888", metalness: 0.8, roughness: 0.2 })
  );
}

export function getSatellitePanelMaterial(): THREE.MeshStandardMaterial {
  return getCachedMaterial("satellite-panel-mat", () =>
    new THREE.MeshStandardMaterial({ color: "#1e3a5f", metalness: 0.5, roughness: 0.3 })
  );
}

export function getSatelliteLightMaterial(): THREE.MeshBasicMaterial {
  return getCachedMaterial("satellite-light-mat", () =>
    new THREE.MeshBasicMaterial({ color: "#ef4444", transparent: true, opacity: 1 })
  );
}

// Shooting star line material
export function getShootingStarMaterial(): THREE.LineBasicMaterial {
  return getCachedMaterial("shooting-star-mat", () =>
    new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.9,
    })
  );
}

// === HEART CACHED ASSETS ===
let cachedHeartPositions: Float32Array | null = null;
let cachedHeartInstanceCount = 0;

export function getHeartBoxGeometry(): THREE.BoxGeometry {
  return getCachedGeometry("heart-box", () =>
    new THREE.BoxGeometry(0.36, 0.36, 0.36, 1, 1, 1)
  ) as THREE.BoxGeometry;
}

export function getHeartMaterial(): THREE.MeshStandardMaterial {
  return getCachedMaterial("heart-material", () =>
    new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.4,
    })
  );
}

export function getHeartPositionsData(): { positions: Float32Array; count: number } {
  if (cachedHeartPositions) {
    return { positions: cachedHeartPositions, count: cachedHeartInstanceCount };
  }

  const resolution = 12;
  const scale = 0.38;
  const tempPositions: number[] = [];

  const isInsideHeart = (x: number, y: number, z: number): boolean => {
    const x2 = x * x;
    const y2 = y * y;
    const z2 = z * z;
    const a = x2 + 2.25 * z2 + y2 - 1;
    const value = a * a * a - x2 * y2 * y - 0.1125 * z2 * y2 * y;
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

  cachedHeartPositions = new Float32Array(tempPositions);
  cachedHeartInstanceCount = tempPositions.length / 3;
  return { positions: cachedHeartPositions, count: cachedHeartInstanceCount };
}

// Ring geometries for heart
export function getHeartRingGeometries(orbitRadius: number): [THREE.TorusGeometry, THREE.TorusGeometry, THREE.TorusGeometry] {
  const geo1 = getCachedGeometry(`heart-ring-1-${orbitRadius}`, () =>
    new THREE.TorusGeometry(orbitRadius, 0.04, 8, 64)
  ) as THREE.TorusGeometry;
  const geo2 = getCachedGeometry(`heart-ring-2-${orbitRadius}`, () =>
    new THREE.TorusGeometry(orbitRadius * 0.75, 0.02, 8, 64)
  ) as THREE.TorusGeometry;
  const geo3 = getCachedGeometry(`heart-ring-3-${orbitRadius}`, () =>
    new THREE.TorusGeometry(orbitRadius * 0.82, 0.015, 8, 64)
  ) as THREE.TorusGeometry;
  return [geo1, geo2, geo3];
}

// Ring materials
export function getHeartRingMaterials(): [THREE.MeshBasicMaterial, THREE.MeshBasicMaterial, THREE.MeshBasicMaterial] {
  const mat1 = getCachedMaterial("heart-ring-mat-1", () =>
    new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.25 })
  );
  const mat2 = getCachedMaterial("heart-ring-mat-2", () =>
    new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.12 })
  );
  const mat3 = getCachedMaterial("heart-ring-mat-3", () =>
    new THREE.MeshBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.06 })
  );
  return [mat1, mat2, mat3];
}

// Particle material for heart
export function getHeartParticleMaterial(): THREE.PointsMaterial {
  return getCachedMaterial("heart-particle-mat", () =>
    new THREE.PointsMaterial({
      size: 0.08,
      color: 0x4ade80,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
  );
}

// === PRELOAD ALL ASSETS ===
let preloaded = false;

export function preloadAllAssets(): Promise<void> {
  return new Promise((resolve) => {
    if (preloaded) {
      resolve();
      return;
    }

    // Pre-create all common geometries
    getStarsGeometry(300);
    getBigStarsGeometry(30);
    getSpaceDustGeometry(100);
    getSkyGeometry();
    getSatelliteBodyGeometry();
    getSatellitePanelGeometry();
    getSatelliteLightGeometry();

    // Pre-create all common materials
    getStarsMaterial();
    getBigStarsMaterial();
    getSpaceDustMaterial();
    getSatelliteBodyMaterial();
    getSatellitePanelMaterial();
    getSatelliteLightMaterial();
    getShootingStarMaterial();

    // Pre-create heart assets (most expensive)
    getHeartBoxGeometry();
    getHeartMaterial();
    getHeartPositionsData();
    getHeartRingGeometries(8); // Default orbit radius
    getHeartRingMaterials();
    getHeartParticleMaterial();

    preloaded = true;

    // Small delay to ensure GPU upload
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

export function isAssetsPreloaded(): boolean {
  return preloaded;
}

// === CLEANUP (for hot reload in dev) ===
export function disposeAllAssets(): void {
  geometryCache.forEach((geo) => geo.dispose());
  geometryCache.clear();

  materialCache.forEach((mat) => mat.dispose());
  materialCache.clear();

  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();

  preloaded = false;
}
