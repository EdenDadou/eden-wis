import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, memo } from "react";
import * as THREE from "three";
import {
  getSatelliteBodyGeometry,
  getSatellitePanelGeometry,
  getSatelliteLightGeometry,
  getSatelliteBodyMaterial,
  getSatellitePanelMaterial,
  getSatelliteLightMaterial,
} from "../cache";

interface SatelliteProps {
  radius: number;
  speed: number;
  offset: number;
  tilt: number;
}

export default memo(function Satellite({ radius, speed, offset, tilt }: SatelliteProps) {
  const ref = useRef<THREE.Group>(null);
  const blinkRef = useRef<THREE.Mesh>(null);

  // Use cached geometries and materials
  const bodyGeo = useMemo(() => getSatelliteBodyGeometry(), []);
  const panelGeo = useMemo(() => getSatellitePanelGeometry(), []);
  const lightGeo = useMemo(() => getSatelliteLightGeometry(), []);
  const bodyMat = useMemo(() => getSatelliteBodyMaterial(), []);
  const panelMat = useMemo(() => getSatellitePanelMaterial(), []);
  const lightMat = useMemo(() => getSatelliteLightMaterial(), []);

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
      <mesh geometry={bodyGeo} material={bodyMat} />
      {/* Solar panels */}
      <mesh position={[0.12, 0, 0]} geometry={panelGeo} material={panelMat} />
      <mesh position={[-0.12, 0, 0]} geometry={panelGeo} material={panelMat} />
      {/* Blinking light */}
      <mesh ref={blinkRef} position={[0, 0.04, 0]} geometry={lightGeo} material={lightMat} />
    </group>
  );
});
