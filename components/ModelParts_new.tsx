import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { AssemblyStep, PhoneModel } from '../types';
import { createSolarTexture, createPCBTexture } from '../utils/textures';

interface ModelPartProps {
  step: AssemblyStep;
  model: PhoneModel;
}

// Dimensions de la coque (en unités Three.js)
const CASE_WIDTH = 3.3;
const CASE_HEIGHT = 6.7;
const CASE_DEPTH = 0.5;
const CASE_INNER_DEPTH = 0.4;

// --- COQUE VIDE (Étape 0) - Nylon PA12 imprimé en 3D ---
export const EmptyCoque: React.FC<ModelPartProps> = ({ model }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation douce pour montrer la coque
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Coque extérieure */}
      <RoundedBox args={[CASE_WIDTH, CASE_HEIGHT, CASE_DEPTH]} radius={0.25} smoothness={8}>
        <meshStandardMaterial 
          color="#2d3748" 
          roughness={0.85} 
          metalness={0.05}
        />
      </RoundedBox>

      {/* Intérieur creux */}
      <RoundedBox 
        args={[CASE_WIDTH - 0.15, CASE_HEIGHT - 0.15, CASE_INNER_DEPTH]} 
        radius={0.2} 
        smoothness={8}
        position={[0, 0, -0.05]}
      >
        <meshStandardMaterial 
          color="#1a202c" 
          roughness={0.9} 
          side={THREE.BackSide}
        />
      </RoundedBox>

      {/* Découpe pour la caméra (en haut à gauche) */}
      <mesh position={[-1.0, 2.8, 0.26]}>
        <boxGeometry args={[0.9, 0.9, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Ouverture pour le port de charge (en bas) */}
      <mesh position={[0, -3.2, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Boutons latéraux en relief */}
      <mesh position={[-1.68, 1.5, 0]}>
        <boxGeometry args={[0.06, 0.5, 0.1]} />
        <meshStandardMaterial color="#4a5568" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[1.68, 1.0, 0]}>
        <boxGeometry args={[0.06, 0.8, 0.1]} />
        <meshStandardMaterial color="#4a5568" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Rainures pour le mécanisme coulissant (haut de la coque) */}
      {[-1.4, 1.4].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 0.23]}>
          <boxGeometry args={[0.15, 2.5, 0.05]} />
          <meshStandardMaterial color="#1a202c" metalness={0.2} />
        </mesh>
      ))}

      {/* Logo/Texte gravé */}
      <mesh position={[0, -1.5, 0.255]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshStandardMaterial color="#4a5568" roughness={0.3} />
      </mesh>
    </group>
  );
};
