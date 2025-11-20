
import React, { useEffect, useRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { AssemblyStep, PhoneModel } from '../types';
import { createSolarTexture, createPCBTexture } from '../utils/textures';

interface ModelPartProps {
  step: AssemblyStep;
}

interface PhoneModelProps {
  model: PhoneModel;
}

interface PhonePartProps extends ModelPartProps {
  model: PhoneModel;
}

// --- Phone Case (Hybrid Translucent with MagSafe) ---
export const PhoneCase: React.FC<PhoneModelProps> = ({ model }) => {
  // Reverted to the "Frosted/Translucent" look you liked
  const caseMaterial = (
    <meshPhysicalMaterial 
      color="#ffffff" // White/Clear base
      roughness={0.4} // Frosted glass/plastic look
      metalness={0.1} 
      transmission={0.6} // See-through
      thickness={0.5}
      clearcoat={0.8}
      clearcoatRoughness={0.2}
    />
  );
  
  const bumperMaterial = (
    <meshStandardMaterial 
      color="#e5e7eb" // Light Grey Bumper
      roughness={0.5} 
      metalness={0.3} 
    />
  );

  if (model === 'iPhone12') {
    return (
      <group>
        {/* Main Shell Back */}
        <RoundedBox args={[3.4, 6.7, 0.15]} radius={0.2} smoothness={4} position={[0, 0, 0.15]}>
          {caseMaterial}
        </RoundedBox>
        
        {/* Bumper/Rim */}
        <group>
            <mesh position={[0, 3.25, -0.1]}>
                <boxGeometry args={[3.4, 0.2, 0.5]} />
                {bumperMaterial}
            </mesh>
             <mesh position={[0, -3.25, -0.1]}>
                <boxGeometry args={[3.4, 0.2, 0.5]} />
                {bumperMaterial}
            </mesh>
            <mesh position={[-1.6, 0, -0.1]}>
                <boxGeometry args={[0.2, 6.7, 0.5]} />
                {bumperMaterial}
            </mesh>
            <mesh position={[1.6, 0, -0.1]}>
                <boxGeometry args={[0.2, 6.7, 0.5]} />
                {bumperMaterial}
            </mesh>
        </group>

        {/* Camera Cutout Border */}
        <group position={[1.05, 2.5, 0.18]}>
             <RoundedBox args={[1.3, 1.4, 0.05]} radius={0.1} smoothness={4}>
                {bumperMaterial}
             </RoundedBox>
        </group>
        
        {/* MagSafe Ring (Restored) - Visible through transparency or on back */}
        <group position={[0, 0, 0.16]} rotation={[0,0,0]}>
             <mesh>
                <ringGeometry args={[1.0, 1.15, 64]} />
                <meshStandardMaterial color="#d1d5db" metalness={0.5} roughness={0.2} />
             </mesh>
             <mesh position={[0, -1.5, 0]}>
                <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
                <meshStandardMaterial color="#d1d5db" metalness={0.5} roughness={0.2} />
             </mesh>
        </group>
      </group>
    );
  } else {
    // Galaxy S22 Case
    return (
      <group>
        <RoundedBox args={[3.3, 6.6, 0.15]} radius={0.35} smoothness={8} position={[0, 0, 0.15]}>
          {caseMaterial}
        </RoundedBox>

        <mesh position={[0, 3.2, -0.1]}>
            <boxGeometry args={[3.3, 0.2, 0.5]} />
            {bumperMaterial}
        </mesh>
         <mesh position={[0, -3.2, -0.1]}>
            <boxGeometry args={[3.3, 0.2, 0.5]} />
            {bumperMaterial}
        </mesh>
        <mesh position={[-1.55, 0, -0.1]}>
            <boxGeometry args={[0.2, 6.6, 0.5]} />
            {bumperMaterial}
        </mesh>
        <mesh position={[1.55, 0, -0.1]}>
            <boxGeometry args={[0.2, 6.6, 0.5]} />
            {bumperMaterial}
        </mesh>

         <group position={[1.0, 2.3, 0.18]}>
             <RoundedBox args={[1.1, 2.2, 0.05]} radius={0.2} smoothness={4}>
                {bumperMaterial}
             </RoundedBox>
        </group>
      </group>
    );
  }
};

// --- The Smartphone (Final Step) ---
export const PhoneBase: React.FC<PhonePartProps> = ({ step, model }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isVisible = step >= AssemblyStep.Phone;

  useEffect(() => {
    if (groupRef.current) {
      if (isVisible) {
        groupRef.current.visible = true;
        gsap.fromTo(groupRef.current.position, 
            { y: 10, z: -2 }, 
            { y: 0, z: -0.1, duration: 1.5, ease: "power3.out" }
        );
      } else {
        groupRef.current.visible = false;
        groupRef.current.position.set(0, 10, -5);
      }
    }
  }, [isVisible]);

  const screenMaterial = <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.1} />;
  const lensMaterial = <meshStandardMaterial color="#111" metalness={0.8} roughness={0.1} />;
  const ringMaterial = <meshStandardMaterial color="#444" metalness={0.8} />;

  const PhoneGeometry = () => {
      if (model === 'iPhone12') {
        const bodyColor = "#1c1c1e";
        const frameColor = "#2d2d30";
        return (
          <group>
            <RoundedBox args={[3.2, 6.5, 0.35]} radius={0.15} smoothness={4}>
              <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.2} />
            </RoundedBox>
            <mesh position={[0, 0, -0.18]}>
              <planeGeometry args={[2.9, 6.2]} />
              {screenMaterial}
            </mesh>
            <mesh position={[0, 2.8, -0.181]}>
               <planeGeometry args={[1.2, 0.4]} />
               <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.18]}>
              <planeGeometry args={[2.9, 6.2]} />
              <meshPhysicalMaterial color={bodyColor} roughness={0.2} metalness={0.4} clearcoat={0.5} clearcoatRoughness={0.1} />
            </mesh>
            <group position={[0.95, 2.4, 0.19]}>
              <RoundedBox args={[1.1, 1.2, 0.05]} radius={0.1} smoothness={2}>
                <meshStandardMaterial color={frameColor} metalness={0.6} roughness={0.3} />
              </RoundedBox>
              {[[-0.28, 0.3], [-0.28, -0.3], [0.28, 0]].map((pos, i) => (
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
            </group>
          </group>
        );
      } else {
        const bodyColor = "#101010";
        const frameColor = "#202020"; 
        return (
          <group>
            <RoundedBox args={[3.1, 6.4, 0.34]} radius={0.3} smoothness={8}>
              <meshStandardMaterial color={frameColor} metalness={0.9} roughness={0.1} />
            </RoundedBox>
            <mesh position={[0, 0, -0.175]}>
              <planeGeometry args={[2.9, 6.2]} />
              {screenMaterial}
            </mesh>
            <mesh position={[0, 2.8, -0.176]}>
              <circleGeometry args={[0.08, 32]} />
              <meshBasicMaterial color="#111" />
            </mesh>
            <mesh position={[0, 0, 0.175]}>
              <planeGeometry args={[2.9, 6.2]} />
              <meshPhysicalMaterial color={bodyColor} roughness={0.3} metalness={0.3} clearcoat={0.3} />
            </mesh>
            <group position={[0.95, 2.2, 0.18]}>
               <RoundedBox args={[0.9, 2.0, 0.04]} radius={0.2} smoothness={4}>
                  <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.2} />
               </RoundedBox>
               {[0.6, 0, -0.6].map((yPos, i) => (
                 <group key={i} position={[0, yPos, 0.03]}>
                   <mesh rotation={[Math.PI/2, 0, 0]}>
                     <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
                     <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
                   </mesh>
                 </group>
               ))}
            </group>
          </group>
        );
      }
  }

  return (
      <group ref={groupRef}>
          <PhoneGeometry />
      </group>
  )
};

// --- Solar Module (Resized & Repositioned) ---
export const SolarModule: React.FC<ModelPartProps> = ({ step }) => {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createSolarTexture(), []); 
  const isVisible = step >= AssemblyStep.SolarModule;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        gsap.to(ref.current.position, {
          y: -0.9, // Moved down to be below camera
          z: 0.23, 
          duration: 1.5,
          ease: "power3.out"
        });
        gsap.to(ref.current.material, { opacity: 1, duration: 1 });
      } else {
        ref.current.position.set(0, -10, -5);
        ref.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <mesh ref={ref} position={[0, -10, -5]}>
      {/* Reduced height to 4.4 to stop below camera */}
      <planeGeometry args={[2.8, 4.4]} />
      <meshStandardMaterial 
        map={texture}
        color="#ffffff" 
        roughness={0.2} 
        metalness={0.6} 
        side={THREE.DoubleSide}
        transparent 
      />
    </mesh>
  );
};

// --- Battery (Li-Po - Distinct Silver Pouch) ---
export const Battery: React.FC<ModelPartProps> = ({ step }) => {
  const ref = useRef<THREE.Group>(null);
  const isVisible = step >= AssemblyStep.Battery;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        gsap.to(ref.current.position, {
          y: -0.5, // Slightly adjusted to align with new solar position
          z: 0.05, 
          duration: 1.5,
          ease: "power3.out"
        });
      } else {
        ref.current.position.set(0, 10, 0.05);
        ref.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <group ref={ref} position={[0, 10, 0.05]}>
        {/* Battery Body */}
        <RoundedBox args={[2.4, 3.8, 0.08]} radius={0.05} smoothness={4}>
             {/* High contrast Silver to stand out */}
            <meshStandardMaterial 
                color="#e5e7eb" 
                roughness={0.4} 
                metalness={0.8} 
            />
        </RoundedBox>
        
        {/* Connector Tab */}
        <mesh position={[0, 2.0, 0]}>
            <boxGeometry args={[0.5, 0.2, 0.01]} />
            <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
        </mesh>

        {/* Label to make it look technical */}
        <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[1.8, 2.5]} />
            <meshBasicMaterial color="#111827" opacity={0.1} transparent />
        </mesh>
    </group>
  );
};


// --- PCB (High Visibility) ---
export const PCB: React.FC<ModelPartProps> = ({ step }) => {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createPCBTexture(), []);
  const isVisible = step >= AssemblyStep.PCB;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        gsap.to(ref.current.position, {
          y: -2.6, 
          z: 0.06, // Just above inside surface
          duration: 1.5,
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
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
};

// --- Thermal Insert (Amber Kapton) ---
export const ThermalInsert: React.FC<ModelPartProps> = ({ step }) => {
  const ref = useRef<THREE.Mesh>(null);
  const isVisible = step >= AssemblyStep.ThermalInsert;

  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.visible = true;
        gsap.to(ref.current.position, {
            z: 0.12, 
            y: 0,
            duration: 2,
            ease: "expo.out"
        });
        gsap.to(ref.current.scale, { x: 1, y: 1, duration: 1 });
      } else {
        ref.current.position.set(0, 10, 0.12);
        ref.current.scale.set(0, 0, 1);
        ref.current.visible = false;
      }
    }
  }, [isVisible]);

  return (
    <mesh ref={ref} position={[0, 10, 0.12]}>
      <planeGeometry args={[2.9, 6.2]} />
      {/* Distinct Amber Color for Kapton */}
      <meshPhysicalMaterial 
        color="#f59e0b" // Amber
        roughness={0.3} 
        metalness={0.1} 
        side={THREE.DoubleSide}
        transparent
        opacity={0.5}
        transmission={0.6}
      />
    </mesh>
  );
};
