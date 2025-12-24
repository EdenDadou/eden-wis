import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, memo } from "react";
import * as THREE from "three";
import { getSpaceDustGeometry, getSpaceDustMaterial } from "../cache";

export default memo(function SpaceDust() {
  const ref = useRef<THREE.Points>(null);
  const lastUpdateRef = useRef(0);

  // Use cached geometry and material
  const geometry = useMemo(() => getSpaceDustGeometry(100), []);
  const material = useMemo(() => getSpaceDustMaterial(), []);

  // Throttle to ~30fps for background elements
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    if (time - lastUpdateRef.current < 0.033) return;
    lastUpdateRef.current = time;

    ref.current.rotation.y = time * 0.02;
    ref.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
});
