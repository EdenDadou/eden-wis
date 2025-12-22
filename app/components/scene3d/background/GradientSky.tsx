import { GradientTexture, Sphere } from "@react-three/drei";
import * as THREE from "three";

export default function GradientSky() {
  return (
    <Sphere args={[50, 64, 64]} scale={[-1, 1, 1]}>
      <meshBasicMaterial side={THREE.BackSide}>
        <GradientTexture
          stops={[0, 0.4, 0.7, 1]}
          colors={["#0a192f", "#0d2847", "#164e63", "#0891b2"]}
        />
      </meshBasicMaterial>
    </Sphere>
  );
}
