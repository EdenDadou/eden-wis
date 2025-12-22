import { Environment } from "@react-three/drei";

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#00f0ff"
      />
      <directionalLight
        position={[-10, 5, -5]}
        intensity={0.8}
        color="#06b6d4"
      />
      <directionalLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      <Environment preset="forest" />
    </>
  );
}
