import { memo, useMemo } from "react";
import * as THREE from "three";
import { getSkyGeometry } from "../cache";

// Cached gradient texture - created once at module level
let cachedGradientTexture: THREE.CanvasTexture | null = null;

function createGradientTexture(): THREE.CanvasTexture {
  if (cachedGradientTexture) return cachedGradientTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, "#0a192f");
  gradient.addColorStop(0.4, "#0d2847");
  gradient.addColorStop(0.7, "#164e63");
  gradient.addColorStop(1, "#0891b2");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 256);

  cachedGradientTexture = new THREE.CanvasTexture(canvas);
  cachedGradientTexture.needsUpdate = true;
  cachedGradientTexture.colorSpace = THREE.SRGBColorSpace;

  return cachedGradientTexture;
}

// Pre-create texture at module load
if (typeof document !== "undefined") {
  createGradientTexture();
}

// Cached material
let cachedSkyMaterial: THREE.MeshBasicMaterial | null = null;

function getSkyMaterial(): THREE.MeshBasicMaterial {
  if (!cachedSkyMaterial) {
    cachedSkyMaterial = new THREE.MeshBasicMaterial({
      map: createGradientTexture(),
      side: THREE.BackSide,
    });
  }
  return cachedSkyMaterial;
}

export default memo(function GradientSky() {
  const geometry = useMemo(() => getSkyGeometry(), []);
  const material = useMemo(() => getSkyMaterial(), []);

  return <mesh geometry={geometry} material={material} scale={[-1, 1, 1]} />;
});
