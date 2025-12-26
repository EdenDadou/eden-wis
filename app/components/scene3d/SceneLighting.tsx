import { Environment } from "@react-three/drei";

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#FCE903" />
      <directionalLight position={[-10, 5, -5]} intensity={1} color="#2E8B57" />
      <directionalLight position={[0, 6, 0]} intensity={10} color="#ffffff" />
      <Environment preset="night" />
    </>
  );
}
