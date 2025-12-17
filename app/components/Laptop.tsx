import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function Laptop(props: any) {
  const group = useRef<THREE.Group>(null);
  // Simple laptop constructed from boxes
  
  // Screen hinge group to allow open adjustment? for now fixed open
  return (
    <group ref={group} {...props} dispose={null}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3, 0.2, 2]} />
        <meshStandardMaterial color="#333" roughness={0.6} metalness={0.8} />
      </mesh>
      
      {/* Screen Lid (Open at 100 deg) */}
      <group position={[0, -0.4, -1]} rotation={[Math.PI / 10, 0, 0]}> 
         {/* Lid Back */}
         <mesh position={[0, 1, 0]}>
            <boxGeometry args={[3, 2, 0.1]} />
            <meshStandardMaterial color="#222" roughness={0.6} />
         </mesh>
         
         {/* Screen Display (Emissive) */}
         <mesh position={[0, 1, 0.06]}>
            <planeGeometry args={[2.8, 1.8]} />
            <meshStandardMaterial color="black" emissive="#00f0ff" emissiveIntensity={0.2} />
         </mesh>
         
         {/* Content on Screen */}
         {/* Could put an iframe or texture here later */}
      </group>
      
      {/* Keyboard Area */}
      <mesh position={[0, -0.39, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 0.8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Trackpad */}
      <mesh position={[0, -0.39, 0.5]} rotation={[-Math.PI / 2, 0, 0]} position-z={0.5} position-y={-0.39}>
         {/* Actually relative positioning logic implies... */}
      </mesh>
      
    </group>
  );
}
