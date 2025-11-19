import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { PhoneBase, SolarModule, PCB, SlidingCover, ThermalInsert } from './ModelParts';
import { AssemblyStep, PhoneModel } from '../types';

interface SolarSceneProps {
  step: AssemblyStep;
  model: PhoneModel;
}

const SolarScene: React.FC<SolarSceneProps> = ({ step, model }) => {
  return (
    <div className="w-full h-full relative bg-gradient-to-b from-gray-50 to-gray-300">
      <Canvas camera={{ position: [5, 2, 5], fov: 50 }} shadows>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          
          <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
             {/* Center the assembly */}
             <PhoneBase model={model} />
             <SolarModule step={step} />
             <PCB step={step} />
             <SlidingCover step={step} />
             <ThermalInsert step={step} />
          </group>

          <ContactShadows position={[0, -4, 0]} opacity={0.6} scale={10} blur={2} far={4.5} color="#000000" />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SolarScene;