import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Realistic Shooting Star - simple bright streak
export function ShootingStar({ delay }: { delay: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const startTime = useRef(delay);

  const duration = useMemo(() => 0.3 + Math.random() * 0.4, []);
  const pauseDuration = useMemo(() => 8 + Math.random() * 25, []);
  const trailLength = useMemo(() => 3 + Math.random() * 4, []);

  const trajectory = useMemo(() => {
    const angle = Math.random() * Math.PI * 0.4 + Math.PI * 0.1;
    const startX = -25 + Math.random() * 50;
    const startY = 15 + Math.random() * 15;
    const startZ = -15 - Math.random() * 10;
    const distance = 15 + Math.random() * 20;

    const direction = new THREE.Vector3(
      Math.cos(angle),
      -Math.sin(angle),
      0.05 + Math.random() * 0.1
    ).normalize();

    return {
      start: new THREE.Vector3(startX, startY, startZ),
      direction,
      distance,
    };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!lineRef.current) return;

    const time = state.clock.elapsedTime;
    const cycleTime = (time - startTime.current) % (duration + pauseDuration);

    if (cycleTime < duration) {
      const t = cycleTime / duration;
      const progress = t * trajectory.distance;
      const headPos = trajectory.start
        .clone()
        .addScaledVector(trajectory.direction, progress);

      let currentTrailLength = trailLength;
      if (t < 0.2) {
        currentTrailLength = trailLength * (t / 0.2);
      } else if (t > 0.7) {
        currentTrailLength = trailLength * (1 - (t - 0.7) / 0.3);
      }

      const tailPos = headPos
        .clone()
        .addScaledVector(trajectory.direction, -currentTrailLength);

      const positions = lineRef.current.geometry.attributes.position
        .array as Float32Array;
      positions[0] = tailPos.x;
      positions[1] = tailPos.y;
      positions[2] = tailPos.z;
      positions[3] = headPos.x;
      positions[4] = headPos.y;
      positions[5] = headPos.z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;

      let opacity = 1;
      if (t < 0.1) opacity = t * 10;
      else if (t > 0.6) opacity = 1 - (t - 0.6) / 0.4;

      (lineRef.current.material as THREE.LineBasicMaterial).opacity =
        opacity * 0.9;
      lineRef.current.visible = true;
    } else {
      lineRef.current.visible = false;
    }
  });

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: "#ffffff",
            transparent: true,
            opacity: 0.9,
          })
        )
      }
      ref={lineRef}
    />
  );
}

// Brighter shooting star variant with subtle glow
export function ShootingStarBright({ delay }: { delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(delay);

  const duration = useMemo(() => 0.25 + Math.random() * 0.35, []);
  const pauseDuration = useMemo(() => 12 + Math.random() * 30, []);
  const trailLength = useMemo(() => 4 + Math.random() * 5, []);

  const trajectory = useMemo(() => {
    const angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.05;
    const startX = -30 + Math.random() * 60;
    const startY = 18 + Math.random() * 12;
    const startZ = -12 - Math.random() * 8;
    const distance = 18 + Math.random() * 25;

    const direction = new THREE.Vector3(
      Math.cos(angle),
      -Math.sin(angle),
      0.08
    ).normalize();

    return {
      start: new THREE.Vector3(startX, startY, startZ),
      direction,
      distance,
    };
  }, []);

  const trailPointsCount = 12;
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const cycleTime = (time - startTime.current) % (duration + pauseDuration);

    if (cycleTime < duration) {
      groupRef.current.visible = true;
      const t = cycleTime / duration;
      const progress = t * trajectory.distance;
      const headPos = trajectory.start
        .clone()
        .addScaledVector(trajectory.direction, progress);

      for (let i = 0; i < trailPointsCount; i++) {
        const mesh = trailRefs.current[i];
        if (!mesh) continue;

        const trailT = i / (trailPointsCount - 1);
        let effectiveTrailLength = trailLength;

        if (t < 0.15) effectiveTrailLength *= t / 0.15;
        else if (t > 0.65) effectiveTrailLength *= 1 - (t - 0.65) / 0.35;

        const pointPos = headPos
          .clone()
          .addScaledVector(
            trajectory.direction,
            -trailT * effectiveTrailLength
          );

        mesh.position.copy(pointPos);

        const baseSize = 0.015 + (1 - trailT) * 0.025;
        mesh.scale.setScalar(
          baseSize * (t < 0.1 ? t * 10 : t > 0.7 ? (1 - t) / 0.3 : 1)
        );

        const mat = mesh.material as THREE.MeshBasicMaterial;
        let opacity = 1 - trailT * 0.9;
        if (t < 0.1) opacity *= t * 10;
        else if (t > 0.6) opacity *= 1 - (t - 0.6) / 0.4;
        mat.opacity = opacity;
      }
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {Array.from({ length: trailPointsCount }).map((_, i) => (
        <mesh key={i} ref={(el) => (trailRefs.current[i] = el)}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={i === 0 ? "#ffffff" : "#e0f0ff"}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  );
}
