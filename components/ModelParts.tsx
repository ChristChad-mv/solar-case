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
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createSolarTexture(), []);
  const isVisible = step >= AssemblyStep.SolarModule;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        gsap.to(ref.current.position, {
          z: 0.22, // Place on back glass
          duration: 1.5,
          ease: "power3.out"
        });
        gsap.to(ref.current.material, { opacity: 1, duration: 1 });
      } else {
        // Reset position for animation
        ref.current.position.set(0, 0, -5);
        ref.current.visible = false;
        if (ref.current.material instanceof THREE.Material) {
            ref.current.material.opacity = 0;
        }
      }
    }
  }, [isVisible]);

  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <planeGeometry args={[2.8, 5.5]} />
      <meshStandardMaterial map={texture} transparent opacity={0} roughness={0.3} metalness={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
};

// --- PCB (Step 2) ---
export const PCB: React.FC<ModelPartProps> = ({ step }) => {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createPCBTexture(), []);
  const isVisible = step >= AssemblyStep.PCB;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        gsap.to(ref.current.position, {
          y: -2.5, // Bottom of phone
          z: 0.23, // Stacked on back
          duration: 1.5,
          delay: 0.2,
          ease: "back.out(1.7)"
        });
        gsap.fromTo(ref.current.rotation, { x: Math.PI }, { x: 0, duration: 1 });
      } else {
        ref.current.position.set(0, -10, 0);
        ref.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <mesh ref={ref} position={[0, -10, 0]}>
      <planeGeometry args={[2.5, 1.0]} />
      <meshStandardMaterial map={texture} roughness={0.5} metalness={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
};

// --- Sliding Cover (Step 3) ---
export const SlidingCover: React.FC<ModelPartProps> = ({ step }) => {
  const ref = useRef<THREE.Mesh>(null);
  const isVisible = step >= AssemblyStep.Slider;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        // Fly in from side
        gsap.to(ref.current.position, {
          x: 0,
          y: 0,
          z: 0.28, // On top of solar and PCB
          duration: 1.2,
          ease: "power2.inOut"
        });
      } else {
        ref.current.position.set(10, 0, 0);
        ref.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <mesh ref={ref} position={[10, 0, 0]}>
      <boxGeometry args={[3.1, 6.4, 0.05]} />
      {/* Matte Plastic - Orange/Grey */}
      <meshStandardMaterial color="#ea580c" roughness={0.9} metalness={0.1} />
    </mesh>
  );
};

// --- Thermal Insert (Step 4) ---
export const ThermalInsert: React.FC<ModelPartProps> = ({ step }) => {
  const ref = useRef<THREE.Mesh>(null);
  const isVisible = step >= AssemblyStep.ThermalInsert;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        gsap.to(ref.current.position, {
            z: -0.22, // Front/Screen protector style or inside case logic
            y: 0,
            duration: 2,
            ease: "expo.out"
        });
        gsap.to(ref.current.scale, { x: 1, y: 1, duration: 1 });
      } else {
        ref.current.position.set(0, 10, -0.22);
        ref.current.scale.set(0, 0, 1);
        ref.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <mesh ref={ref} position={[0, 10, -0.22]}>
      <planeGeometry args={[3.0, 6.3]} />
      <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.9} side={THREE.DoubleSide} transparent opacity={0.3} />
    </mesh>
  );
};