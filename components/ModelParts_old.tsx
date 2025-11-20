import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { AssemblyStep, PhoneModel } from '../types';
import { createSolarTexture, createPCBTexture } from '../utils/textures';

interface ModelPartProps {
  step: AssemblyStep;
}

interface PhoneBaseProps {
  model: PhoneModel;
}

// --- Phone Base (Switchable) ---
export const PhoneBase: React.FC<PhoneBaseProps> = ({ model }) => {
  // Common Materials
  const screenMaterial = <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.1} />;
  const lensMaterial = <meshStandardMaterial color="#111" metalness={0.8} roughness={0.1} />;
  const ringMaterial = <meshStandardMaterial color="#444" metalness={0.8} />;

  if (model === 'iPhone12') {
    // Procedural iPhone 12 Pro
    // Body Color: Graphite/Space Grey
    const bodyColor = "#1c1c1e";
    const frameColor = "#2d2d30";
    
    return (
      <group>
        {/* Main Body (Frame) */}
        <RoundedBox args={[3.2, 6.5, 0.35]} radius={0.15} smoothness={4}>
          <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Front Screen (Glossy Black) */}
        <mesh position={[0, 0, -0.18]}>
          <planeGeometry args={[2.9, 6.2]} />
          {screenMaterial}
        </mesh>
        
        {/* Notch */}
        <mesh position={[0, 2.8, -0.181]}>
           <planeGeometry args={[1.2, 0.4]} />
           <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Back Glass (Matte finish) */}
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[2.9, 6.2]} />
          <meshPhysicalMaterial 
            color={bodyColor} 
            roughness={0.2} 
            metalness={0.4} 
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Camera Bump (Square) */}
        <group position={[0.95, 2.4, 0.19]}>
          <RoundedBox args={[1.1, 1.2, 0.05]} radius={0.1} smoothness={2}>
            <meshStandardMaterial color={frameColor} metalness={0.6} roughness={0.3} />
          </RoundedBox>
          
          {/* Lenses */}
          {[
            [-0.28, 0.3], [-0.28, -0.3], [0.28, 0]
          ].map((pos, i) => (
             <group key={i} position={[pos[0], pos[1], 0.04]}>
               <mesh rotation={[Math.PI/2, 0, 0]}>
                  <cylinderGeometry args={[0.18, 0.18, 0.1, 32]} />
                  {lensMaterial}
               </mesh>
               <mesh position={[0, 0, 0.05]} rotation={[Math.PI/2, 0, 0]}>
                  <ringGeometry args={[0.18, 0.22, 32]} />
                  {ringMaterial}
               </mesh>
             </group>
          ))}
          {/* Flash/Sensor tiny dots */}
          <mesh position={[0.56, 0.3, 0.04]} rotation={[Math.PI/2, 0, 0]}>
               <circleGeometry args={[0.08, 32]} />
               <meshStandardMaterial color="#ffccaa" opacity={0.8} transparent />
          </mesh>
        </group>

        {/* Apple Logo Placeholder */}
        <mesh position={[0, 0.5, 0.181]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="#555" opacity={0.4} transparent />
        </mesh>

        {/* Buttons */}
        <mesh position={[1.62, 1.5, 0]}>
           <boxGeometry args={[0.05, 0.6, 0.05]} />
           <meshStandardMaterial color={frameColor} metalness={0.9} />
        </mesh>
        <mesh position={[-1.62, 1.8, 0]}>
           <boxGeometry args={[0.05, 0.4, 0.05]} />
           <meshStandardMaterial color={frameColor} metalness={0.9} />
        </mesh>
         <mesh position={[-1.62, 1.2, 0]}>
           <boxGeometry args={[0.05, 0.4, 0.05]} />
           <meshStandardMaterial color={frameColor} metalness={0.9} />
        </mesh>
      </group>
    );
  } else {
    // Procedural Samsung Galaxy S22
    // Body Color: Phantom Black
    const bodyColor = "#101010";
    const frameColor = "#202020"; // Glossy Armor Aluminum

    return (
      <group>
        {/* Main Body - slightly more rounded corners than iPhone */}
        <RoundedBox args={[3.1, 6.4, 0.34]} radius={0.3} smoothness={8}>
          <meshStandardMaterial color={frameColor} metalness={0.9} roughness={0.1} />
        </RoundedBox>

        {/* Front Screen (Glossy Black) */}
        <mesh position={[0, 0, -0.175]}>
          <planeGeometry args={[2.9, 6.2]} />
          {screenMaterial}
        </mesh>

        {/* Punch Hole Camera (Center Top) */}
        <mesh position={[0, 2.8, -0.176]}>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial color="#111" />
        </mesh>

        {/* Back Glass (Matte finish) */}
        <mesh position={[0, 0, 0.175]}>
          <planeGeometry args={[2.9, 6.2]} />
          <meshPhysicalMaterial 
            color={bodyColor} 
            roughness={0.3} 
            metalness={0.3} 
            clearcoat={0.3}
          />
        </mesh>

        {/* Camera Bump (Contour Cut / Vertical Traffic Light) */}
        {/* The bump merges into the side frame on the left */}
        <group position={[0.95, 2.2, 0.18]}>
           {/* Base Plate */}
           <RoundedBox args={[0.9, 2.0, 0.04]} radius={0.2} smoothness={4}>
              <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} />
           </RoundedBox>
           
           {/* Lenses (Vertical Stack) */}
           {[0.6, 0, -0.6].map((yPos, i) => (
             <group key={i} position={[0, yPos, 0.03]}>
               <mesh rotation={[Math.PI/2, 0, 0]}>
                 <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
                 <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
               </mesh>
               <mesh position={[0, 0, 0.03]} rotation={[Math.PI/2, 0, 0]}>
                 <ringGeometry args={[0.22, 0.24, 32]} />
                 {ringMaterial}
               </mesh>
                <mesh position={[0, 0, 0.02]} rotation={[Math.PI/2, 0, 0]}>
                  <cylinderGeometry args={[0.12, 0.12, 0.05, 32]} />
                  <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.0} />
               </mesh>
             </group>
           ))}

           {/* Flash to the side of the bump on S22 */}
           <mesh position={[-0.7, 0.6, -0.02]}>
              <circleGeometry args={[0.1, 32]} />
              <meshStandardMaterial color="#ffccaa" opacity={0.6} transparent />
           </mesh>
        </group>

        {/* Samsung Logo Placeholder */}
        <mesh position={[0, -0.5, 0.176]}>
           <planeGeometry args={[1.2, 0.2]} />
           <meshBasicMaterial color="#444" opacity={0.3} transparent />
        </mesh>

        {/* Buttons (All on right side for Samsung usually) */}
        <mesh position={[1.57, 1.0, 0]}>
           <boxGeometry args={[0.05, 0.4, 0.05]} />
           <meshStandardMaterial color={frameColor} metalness={0.9} />
        </mesh>
         <mesh position={[1.57, 1.8, 0]}>
           <boxGeometry args={[0.05, 0.7, 0.05]} />
           <meshStandardMaterial color={frameColor} metalness={0.9} />
        </mesh>

      </group>
    );
  }
};

// --- Solar Module (Step 1) ---
export const SolarModule: React.FC<ModelPartProps> = ({ step }) => {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => createSolarTexture(), []);
  const isVisible = step >= AssemblyStep.SolarModule;

  useEffect(() => {
    if (groupRef.current) {
      if (isVisible) {
        groupRef.current.visible = true;
        gsap.to(groupRef.current.position, {
          z: 0.25,
          duration: 1.8,
          ease: "power3.out"
        });
        gsap.to(groupRef.current.rotation, {
          x: 0,
          duration: 1.5,
          ease: "back.out(1.2)"
        });
        gsap.to(groupRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)"
        });
      } else {
        groupRef.current.position.set(0, 0, -5);
        groupRef.current.rotation.set(Math.PI * 0.5, 0, 0);
        groupRef.current.scale.set(0.3, 0.3, 0.3);
        groupRef.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <group ref={groupRef} position={[0, 0, -5]} rotation={[Math.PI * 0.5, 0, 0]} scale={0.3}>
      {/* Main Solar Panel */}
      <mesh>
        <boxGeometry args={[2.8, 5.5, 0.08]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.2} 
          metalness={0.9} 
          emissive="#001a3d"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Frame/Border */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.85, 5.55, 0.06]} />
        <meshStandardMaterial 
          color="#404040" 
          roughness={0.4} 
          metalness={0.7}
          wireframe={false}
        />
      </mesh>
      
      {/* Corner Mounting Points */}
      {[
        [-1.35, 2.65, 0.05], [1.35, 2.65, 0.05],
        [-1.35, -2.65, 0.05], [1.35, -2.65, 0.05]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#silver" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// --- PCB (Step 2) ---
export const PCB: React.FC<ModelPartProps> = ({ step }) => {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => createPCBTexture(), []);
  const isVisible = step >= AssemblyStep.PCB;

  useEffect(() => {
    if (groupRef.current) {
      if (isVisible) {
        groupRef.current.visible = true;
        gsap.to(groupRef.current.position, {
          y: -2.5,
          z: 0.28,
          duration: 1.8,
          delay: 0.3,
          ease: "back.out(1.5)"
        });
        gsap.fromTo(groupRef.current.rotation, 
          { x: Math.PI, z: Math.PI * 0.2 }, 
          { x: 0, z: 0, duration: 1.5, ease: "power2.out" }
        );
      } else {
        groupRef.current.position.set(0, -10, 0);
        groupRef.current.rotation.set(Math.PI, 0, Math.PI * 0.2);
        groupRef.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <group ref={groupRef} position={[0, -10, 0]}>
      {/* Main PCB Board */}
      <mesh>
        <boxGeometry args={[2.5, 1.0, 0.04]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.6} 
          metalness={0.4}
          emissive="#064e3b"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Capacitors/Components */}
      {[
        [-0.8, 0.2], [-0.4, 0.3], [0, 0.25], [0.4, 0.2], [0.8, 0.3],
        [-0.6, -0.2], [-0.2, -0.3], [0.3, -0.25], [0.7, -0.2]
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0.04]}>
          <boxGeometry args={[0.08, 0.08, 0.06]} />
          <meshStandardMaterial 
            color={i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#1f2937" : "#ef4444"} 
            metalness={0.5} 
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* IC Chip */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.35, 0.35, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Gold Contact Pads */}
      {[-1.0, -0.5, 0.5, 1.0].map((x, i) => (
        <mesh key={`pad-${i}`} position={[x, -0.4, 0.025]}>
          <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// --- Sliding Cover (Step 3) ---
export const SlidingCover: React.FC<ModelPartProps> = ({ step }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isVisible = step >= AssemblyStep.Slider;

  useFrame((state) => {
    if (groupRef.current && isVisible) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      if (isVisible) {
        groupRef.current.visible = true;
        gsap.to(groupRef.current.position, {
          x: 0,
          z: 0.35,
          duration: 1.5,
          ease: "power2.inOut"
        });
        gsap.fromTo(groupRef.current.rotation, 
          { y: Math.PI * 0.3 }, 
          { y: 0, duration: 1.2, ease: "elastic.out(1, 0.6)" }
        );
      } else {
        groupRef.current.position.set(10, 0, 0);
        groupRef.current.rotation.set(0, Math.PI * 0.3, 0);
        groupRef.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <group ref={groupRef} position={[10, 0, 0]}>
      {/* Main Cover Body */}
      <RoundedBox args={[3.15, 6.45, 0.12]} radius={0.15} smoothness={4}>
        <meshStandardMaterial 
          color="#ea580c" 
          roughness={0.85} 
          metalness={0.15}
          clearcoat={0.1}
        />
      </RoundedBox>
      
      {/* Slider Mechanism Track */}
      <mesh position={[0, 2.5, 0.07]}>
        <boxGeometry args={[2.8, 0.3, 0.03]} />
        <meshStandardMaterial color="#404040" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Slider Handle */}
      <mesh position={[0, 2.5, 0.09]}>
        <boxGeometry args={[0.6, 0.25, 0.02]} />
        <meshStandardMaterial color="#f97316" metalness={0.2} roughness={0.9} />
      </mesh>
      
      {/* Ventilation Holes Pattern */}
      {Array.from({ length: 15 }).map((_, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        return (
          <mesh 
            key={i} 
            position={[-0.8 + col * 0.4, -2 + row * 0.4, 0.061]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.1} />
          </mesh>
        );
      })}
      
      {/* Logo/Branding Area */}
      <mesh position={[0, 0.5, 0.061]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshStandardMaterial color="#444444" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};

// --- Thermal Insert (Step 4) ---
export const ThermalInsert: React.FC<ModelPartProps> = ({ step }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isVisible = step >= AssemblyStep.ThermalInsert;

  useFrame((state) => {
    if (groupRef.current && isVisible) {
      // Gentle pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.01;
      groupRef.current.scale.set(scale, scale, 1);
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      if (isVisible) {
        groupRef.current.visible = true;
        gsap.to(groupRef.current.position, {
            z: -0.25,
            y: 0,
            duration: 2.2,
            ease: "expo.out"
        });
        gsap.fromTo(groupRef.current.rotation,
          { z: Math.PI * 2 },
          { z: 0, duration: 2, ease: "power2.out" }
        );
        gsap.to(groupRef.current.children[0].material, {
          opacity: 0.5,
          duration: 1.5
        });
      } else {
        groupRef.current.position.set(0, 10, -0.25);
        groupRef.current.rotation.set(0, 0, Math.PI * 2);
        groupRef.current.visible = false;
        if (groupRef.current.children[0]) {
          (groupRef.current.children[0] as THREE.Mesh).material.opacity = 0;
        }
      }
    }
  }, [isVisible]);

  return (
    <group ref={groupRef} position={[0, 10, -0.25]}>
      {/* Main Thermal Layer - Semi-transparent */}
      <mesh>
        <boxGeometry args={[3.0, 6.3, 0.02]} />
        <meshPhysicalMaterial 
          color="#e0f2fe" 
          roughness={0.2} 
          metalness={0.95} 
          transparent 
          opacity={0}
          transmission={0.3}
          thickness={0.5}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Heat Dissipation Pattern - Honeycomb */}
      {Array.from({ length: 48 }).map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const offsetX = row % 2 === 0 ? 0 : 0.15;
        return (
          <mesh 
            key={i} 
            position={[-1.35 + offsetX + col * 0.38, -2.8 + row * 0.42, 0.012]}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.01, 6]} />
            <meshStandardMaterial 
              color="#38bdf8" 
              metalness={0.9} 
              roughness={0.1}
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Corner Reinforcements */}
      {[
        [-1.45, 3.1, 0.015], [1.45, 3.1, 0.015],
        [-1.45, -3.1, 0.015], [1.45, -3.1, 0.015]
      ].map((pos, i) => (
        <mesh key={`corner-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 0.15, 0.01]} />
          <meshStandardMaterial color="#0891b2" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};