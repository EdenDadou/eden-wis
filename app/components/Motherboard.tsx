import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

export default function Motherboard(props: any) {
  const group = useRef<THREE.Group>(null);

  // Materials - Reference Image Palette (Blue/Silver)
  const pcbMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#0044aa", // Deep Blue PCB
    roughness: 0.5, 
    metalness: 0.2 
  }), []);
  
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#eeeeee", // Bright Silver/Chrome
    roughness: 0.2, 
    metalness: 1.0 
  }), []);

  // Heatsinks in the image are bright blue metallic
  const blueMetalMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#2288ff", // Bright Blue Anodized
    roughness: 0.3, 
    metalness: 0.8 
  }), []);

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#ffd700", // Gold
    roughness: 0.2, 
    metalness: 1.0 
  }), []);

  // Slots in image are white/silver plastic
  const whitePlasticMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#dddddd", // White Plastic
    roughness: 0.5 
  }), []);

  const socketMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#f0f0f0", // Very White Socket
    roughness: 0.8 
  }), []);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#00ffff", // Cyan Lights
    emissive: "#00ffff", 
    emissiveIntensity: 1.0 
  }), []);

  // New material for small chips
  const plasticMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#222222", // Dark Grey Plastic for small chips
    roughness: 0.7
  }), []);
  
  // Helper for scattered chips
  const smallChips = useMemo(() => {
    const chips = [];
    for(let i=0; i<50; i++) {
        chips.push({
            pos: [
                (Math.random() - 0.5) * 3.5, 
                0.02, 
                (Math.random() - 0.5) * 3.5
            ],
            scale: [0.05 + Math.random()*0.1, 0.02, 0.05 + Math.random()*0.1]
        });
    }
    return chips;
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      
      {/* --- PCB Base --- */}
      <RoundedBox args={[4, 0.1, 4]} radius={0.05} smoothness={4} position={[0, -0.05, 0]} material={pcbMat}>
      </RoundedBox>
      
      {/* Screw Holes */}
      {[[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.01, z]} rotation={[Math.PI/2, 0, 0]} material={goldMat}>
              <ringGeometry args={[0.08, 0.12, 16]} />
          </mesh>
      ))}

      {/* --- SCATTERED MICROCIRCUITS --- */}
      {smallChips.map((chip, i) => (
          <mesh key={i} position={chip.pos as any} material={plasticMat}>
              <boxGeometry args={chip.scale as any} />
          </mesh>
      ))}


      {/* --- CENTRAL AREA: CPU & POWER DELIVERY --- */}
      <group position={[0, 0.1, -0.5]}>
         {/* Socket Base */}
         <mesh position={[0, 0, 0]} material={socketMat}>
             <boxGeometry args={[1.3, 0.1, 1.3]} />
         </mesh>
         {/* ARMOR AROUND SOCKET */}
         <mesh position={[0, 0.02, 0]} rotation={[Math.PI/2, 0, 0]} material={pcbMat}>
             <planeGeometry args={[1.6, 1.6]} />
         </mesh>
          {/* Retention Bracket */}
         <mesh position={[0, 0.06, 0]} material={metalMat}>
             <boxGeometry args={[1.1, 0.05, 1.1]} />
         </mesh>
         {/* CPU */}
         <mesh position={[0, 0.1, 0]}>
             <boxGeometry args={[0.9, 0.05, 0.9]} />
             <meshStandardMaterial color="#333333" roughness={0.5} />
         </mesh>
         <mesh position={[0, 0.13, 0]} material={metalMat}>
             <boxGeometry args={[0.6, 0.01, 0.6]} />
         </mesh>
          {/* Logo */}
         <mesh position={[0, 0.136, 0]} rotation={[-Math.PI/2, 0, 0]}>
             <planeGeometry args={[0.4, 0.4]} />
             <meshBasicMaterial color="#00ffff" transparent opacity={0.8} side={THREE.DoubleSide} />
         </mesh>

         {/* POWER CHOKES (Grey Cubes around CPU) */}
         <group position={[-0.8, 0, 0]}> {/* Left Side Chokes */}
             {Array.from({length: 5}).map((_, i) => (
                <mesh key={i} position={[0, 0.1, -0.6 + i*0.3]} material={metalMat}>
                    <boxGeometry args={[0.25, 0.25, 0.25]} />
                </mesh>
             ))}
         </group>
         <group position={[0, 0, -0.8]}> {/* Top Side Chokes */}
             {Array.from({length: 4}).map((_, i) => (
                <mesh key={i} position={[-0.45 + i*0.3, 0.1, 0]} material={metalMat}>
                    <boxGeometry args={[0.25, 0.25, 0.25]} />
                </mesh>
             ))}
         </group>
      </group>


      {/* --- TOP LEFT: VRMs, IO, & HEATSINKS --- */}
      <group position={[-1.2, 0.1, -0.5]}>
          {/* Main IO Block */}
          <mesh position={[-0.6, 0.3, 0]} material={blueMetalMat}>
              <boxGeometry args={[0.8, 0.8, 2.5]} />
          </mesh>
          <mesh position={[-0.6, 0.72, 0]} rotation={[-Math.PI/2, 0, 0]} material={accentMat}>
              <planeGeometry args={[0.5, 1.5]} />
          </mesh>
          
          {/* Finned Heatsink Left */}
          <group position={[0.5, 0.2, -0.6]}>
              <mesh material={blueMetalMat}><boxGeometry args={[0.6, 0.6, 1.2]} /></mesh>
              {/* Fins */}
              {[1,2,3].map(k => <mesh key={k} position={[0, 0.35, -0.5+k*0.3]} material={metalMat}><boxGeometry args={[0.6, 0.1, 0.05]} /></mesh>)}
          </group>

          {/* Finned Heatsink Top */}
          <group position={[-0.4, 0.2, 0.8]}>
             <mesh material={blueMetalMat}><boxGeometry args={[0.5, 0.5, 1]} /></mesh>
             {[1,2].map(k => <mesh key={k} position={[0, 0.3, -0.4+k*0.4]} material={metalMat}><boxGeometry args={[0.5, 0.1, 0.05]} /></mesh>)}
          </group>
          
          {/* Capacitors (Cylinders) - High Density */}
          {Array.from({ length: 8 }).map((_, i) => (
             <mesh key={i} position={[0.6, -0.1, -1.0 + i * 0.2]} material={metalMat}>
                 <cylinderGeometry args={[0.08, 0.08, 0.25]} />
             </mesh>
          ))}
          {/* Top Capacitors */}
          {Array.from({ length: 8 }).map((_, i) => (
             <mesh key={i} position={[1.4, -0.1, -0.6 + i * 0.15]} material={blueMetalMat}> {/* Blue Caps */}
                 <cylinderGeometry args={[0.06, 0.06, 0.2]} />
             </mesh>
          ))}
      </group>


      {/* --- RIGHT: RAM SLOTS & POWER --- */}
      <group position={[1.2, 0.1, -0.5]}>
         {[0, 1, 2, 3].map(i => (
             <group key={i} position={[i * 0.25 - 0.37, 0, 0]}>
                 <mesh position={[0, -0.05, 0]} material={whitePlasticMat}><boxGeometry args={[0.1, 0.1, 2.8]} /></mesh>
                 <group position={[0, 0.25, 0]}>
                     <mesh material={blueMetalMat}><boxGeometry args={[0.05, 0.6, 2.7]} /></mesh>
                     <mesh position={[0, 0.326, 0]} material={accentMat}><boxGeometry args={[0.05, 0.05, 2.7]} /></mesh>
                     <mesh position={[0.03, -0.25, 0]} material={goldMat}><boxGeometry args={[0.01, 0.1, 2.5]} /></mesh>
                 </group>
                 <mesh position={[0, 0.2, 1.4]} rotation={[Math.PI/4, 0, 0]} material={whitePlasticMat}><boxGeometry args={[0.12, 0.15, 0.1]} /></mesh>
                 <mesh position={[0, 0.2, -1.4]} rotation={[-Math.PI/4, 0, 0]} material={whitePlasticMat}><boxGeometry args={[0.12, 0.15, 0.1]} /></mesh>
             </group>
         ))}
         {/* 24 Pin Power Connector */}
         <mesh position={[0.8, 0.1, -0.6]} material={whitePlasticMat}><boxGeometry args={[0.4, 0.3, 1.4]} /></mesh>
         {/* Pins inside connector */}
         {Array.from({length: 12}).map((_, i) => (
             <mesh key={i} position={[0.8, 0.2, -1.2 + i*0.1]} material={goldMat}><boxGeometry args={[0.05, 0.05, 0.05]} /></mesh>
         ))}
      </group>


      {/* --- BOTTOM: PCIe, CHIPSET, SATA --- */}
      <group position={[0, 0.05, 1.2]}>
         {/* PCIe x16 */}
         <mesh position={[0, 0.05, -0.8]} material={metalMat}><boxGeometry args={[3.2, 0.2, 0.15]} /></mesh>
         <mesh position={[0, 0.05, -0.8]} material={whitePlasticMat}><boxGeometry args={[3.0, 0.22, 0.05]} /></mesh>

         {/* PCIe x1 */}
         <mesh position={[0, 0, 0]} material={whitePlasticMat}><boxGeometry args={[1.0, 0.15, 0.15]} /></mesh>
         
         {/* PCIe x16 Secondary */}
         <mesh position={[0, 0, 0.8]} material={whitePlasticMat}><boxGeometry args={[3.0, 0.15, 0.15]} /></mesh>
         <mesh position={[1.4, 0.1, 0.8]} material={blueMetalMat}><boxGeometry args={[0.2, 0.2, 0.15]} /></mesh>

         {/* CMOS Battery */}
         <mesh position={[-0.8, 0, 0]} rotation={[0,0,0]} material={metalMat}>
             <cylinderGeometry args={[0.25, 0.25, 0.1]} />
         </mesh>

         {/* Chipset Heatsink - Complex */}
         <group position={[1.2, 0.05, 0.5]}>
             <mesh material={blueMetalMat}><boxGeometry args={[1.2, 0.3, 1.2]} /></mesh>
             <mesh position={[0, 0.17, 0]} rotation={[-Math.PI/2, 0, 0]} material={accentMat}><planeGeometry args={[0.8, 0.8]} /></mesh>
             {[0,1,2].map(k => <mesh key={k} position={[0, 0.1, -0.4 + k*0.4]} material={metalMat}><boxGeometry args={[1.2, 0.1, 0.05]} /></mesh>)}
         </group>
         
         {/* SATA Ports Stack (Bottom Right) */}
         <group position={[1.6, 0.1, 1.2]}>
             <mesh position={[0, 0, 0]} material={blueMetalMat}><boxGeometry args={[0.4, 0.4, 0.3]} /></mesh>
             <mesh position={[0, 0, -0.4]} material={blueMetalMat}><boxGeometry args={[0.4, 0.4, 0.3]} /></mesh>
             <mesh position={[0, 0, -0.8]} material={blueMetalMat}><boxGeometry args={[0.4, 0.4, 0.3]} /></mesh>
         </group>

         {/* Front Panel Headers (Bottom Edge) */}
         <group position={[-1.2, 0, 0.6]}>
             {Array.from({length: 10}).map((_, i) => (
                 <mesh key={i} position={[i*0.15, 0.1, 0]} material={goldMat}><boxGeometry args={[0.05, 0.2, 0.05]} /></mesh>
             ))}
             {Array.from({length: 10}).map((_, i) => (
                 <mesh key={i} position={[i*0.15, 0.1, 0.15]} material={goldMat}><boxGeometry args={[0.05, 0.2, 0.05]} /></mesh>
             ))}
             <mesh position={[0.7, -0.05, 0.075]} material={whitePlasticMat}><boxGeometry args={[1.6, 0.1, 0.3]} /></mesh>
         </group>

         {/* M.2 Covers */}
         <mesh position={[0.5, 0.05, -0.4]} material={metalMat}><boxGeometry args={[2, 0.05, 0.4]} /></mesh>
      </group>

      {/* --- BACK IO CONNECTOR BLOCK --- */}
      <group position={[-2, 0.15, -0.5]}>
          <mesh position={[0.1, 0, -0.8]} material={metalMat}><boxGeometry args={[0.2, 0.3, 0.4]} /></mesh>
          <mesh position={[0.1, 0, -0.2]} material={metalMat}><boxGeometry args={[0.2, 0.3, 0.4]} /></mesh>
          <mesh position={[0.1, 0, 0.2]} material={metalMat}><boxGeometry args={[0.2, 0.4, 0.2]} /></mesh> {/* Ethernet */}
          
          {/* Audio Jacks */}
          <group position={[0.1, 0, 0.6]}>
              <mesh position={[0, 0, 0]} rotation={[0,0,Math.PI/2]} material={goldMat}><cylinderGeometry args={[0.1, 0.1, 0.2]} /></mesh>
              <mesh position={[0, 0, 0.25]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.1, 0.1, 0.2]} /><meshStandardMaterial color="#ff4444" metalness={0.5} /></mesh>
              <mesh position={[0, 0, -0.25]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.1, 0.1, 0.2]} /><meshStandardMaterial color="#44ff44" metalness={0.5} /></mesh>
          </group>
      </group>

    </group>
  );
}
