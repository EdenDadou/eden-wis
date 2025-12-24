import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, memo } from "react";
import * as THREE from "three";
import {
  getStarsGeometry,
  getBigStarsGeometry,
  getStarsMaterial,
  getBigStarsMaterial,
} from "../cache";

export default memo(function AnimatedStars() {
  const starsRef = useRef<THREE.Points>(null);
  const bigStarsRef = useRef<THREE.Points>(null);
  const lastUpdateRef = useRef(0);

  // Use cached geometries and materials
  const starsGeometry = useMemo(() => getStarsGeometry(300), []);
  const bigStarsGeometry = useMemo(() => getBigStarsGeometry(30), []);
  const starsMaterial = useMemo(() => getStarsMaterial(), []);
  const bigStarsMaterial = useMemo(() => getBigStarsMaterial(), []);

  // Throttle to ~30fps for background elements (update every ~33ms)
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (time - lastUpdateRef.current < 0.033) return;
    lastUpdateRef.current = time;

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
      <points ref={starsRef} geometry={starsGeometry} material={starsMaterial} />
      <points ref={bigStarsRef} geometry={bigStarsGeometry} material={bigStarsMaterial} />
    </>
  );
});
