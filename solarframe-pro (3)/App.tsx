
import React, { useState, useEffect } from 'react';
import SolarScene from './components/SolarScene';
import AITools from './components/AITools';
import { AssemblyStep, PhoneModel } from './types';
import { ChevronRight, RotateCcw, Sparkles, Box, Smartphone, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AssemblyStep>(AssemblyStep.Case);
  const [phoneModel, setPhoneModel] = useState<PhoneModel>('iPhone12');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // Step Data (French) - Updated visual description
  const stepsInfo = {
    [AssemblyStep.Case]: {
      label: "Coque Hybride (Design Translucide)",
      description: `Châssis élégant avec finition givrée/transparente laissant apparaître les composants internes. Structure renforcée avec anneau MagSafe intégré.`
    },
    [AssemblyStep.SolarModule]: {
      label: "Module Solaire (Haute Visibilité)",
      description: "Panneau photovoltaïque monocristallin ajusté, positionné sous le module caméra pour optimiser la surface sans obstruction."
    },
    [AssemblyStep.Battery]: {
        label: "Batterie Li-Po (Interne)",
        description: "Cellule énergétique argentée ultra-fine logée à l'intérieur de la coque pour 24h d'autonomie."
    },
    [AssemblyStep.PCB]: {
      label: "Unité de Gestion (PCB)",
      description: "Carte électronique visible en bas de coque, régulant intelligemment la charge solaire."
    },
    [AssemblyStep.ThermalInsert]: {
      label: "Isolation Kapton (Ambre)",
      description: "Film isolant thermique technique de couleur ambrée pour la sécurité du smartphone."
    },
    [AssemblyStep.Phone]: {
      label: "Installation du Smartphone",
      description: "Insertion finale de l'appareil dans l'écosystème SolarFrame assemblé."
    }
  };

  const nextStep = () => {
    if (step < AssemblyStep.Phone) {
      setStep(s => s + 1);
    }
  };

  const reset = () => setStep(AssemblyStep.Case);

  const toggleModel = () => {
    setPhoneModel(prev => prev === 'iPhone12' ? 'GalaxyS22' : 'iPhone12');
  };

  return (
    <div className="w-full h-screen relative bg-gray-100 text-gray-900 overflow-hidden">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <SolarScene step={step} model={phoneModel} />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-3 text-gray-900">
             <Box className="text-blue-600" /> SolarFrame<span className="text-gray-500">Pro</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">Visualisation d'Assemblage Prototype v2.2</p>
        </div>
        
        <div className="pointer-events-auto flex gap-3">
          {/* Model Switcher */}
          <button
            onClick={toggleModel}
            className="bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/40 text-gray-800 px-4 py-2 rounded-full flex items-center gap-2 transition text-sm font-medium shadow-sm"
          >
            <Smartphone className="w-4 h-4" />
            {phoneModel === 'iPhone12' ? 'iPhone 12' : 'Galaxy S22'}
          </button>

          {/* AI Studio Toggle */}
          <button 
            onClick={() => setAiPanelOpen(true)}
            className="bg-black/80 hover:bg-black/90 backdrop-blur-md border border-black/10 text-white px-4 py-2 rounded-full flex items-center gap-2 transition text-sm font-medium shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Studio IA
          </button>
        </div>
      </div>

      {/* Side AI Panel */}
      <AITools isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />

      {/* Current Part Label Overlay */}
      <div className="absolute top-32 left-6 z-10 pointer-events-none">
         <div className="flex flex-col gap-6">
            {Object.keys(stepsInfo).map((key) => {
                const s = parseInt(key);
                const isActive = s === step;
                const isPast = s < step;
                return (
                    <div 
                        key={key} 
                        className={`transition-all duration-500 transform ${isActive ? 'translate-x-4 opacity-100' : isPast ? 'opacity-40' : 'opacity-0 -translate-x-4'} `}
                    >
                        {isActive && (
                            <div className="bg-white/70 backdrop-blur-xl border-l-4 border-blue-600 p-5 rounded-r-xl max-w-sm shadow-xl">
                                <span className="text-xs text-blue-600 font-bold tracking-wider mb-1 block">ÉTAPE 0{s + 1}</span>
                                <h3 className="text-xl font-bold leading-tight text-gray-900 mb-2">{stepsInfo[s as AssemblyStep].label}</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {stepsInfo[s as AssemblyStep].description}
                                </p>
                            </div>
                        )}
                    </div>
                )
            })}
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex justify-center items-end gap-4 pointer-events-none">
        <div className="pointer-events-auto flex gap-4 bg-white/60 backdrop-blur-xl p-2 rounded-2xl border border-white/40 shadow-2xl">
            <button 
                onClick={reset}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/40 hover:bg-white/60 text-gray-600 hover:text-gray-900 transition shadow-sm"
                title="Réinitialiser"
            >
                <RotateCcw className="w-5 h-5" />
            </button>
            
            <button 
                onClick={nextStep}
                disabled={step === AssemblyStep.Phone}
                className={`h-12 px-8 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${step === AssemblyStep.Phone ? 'bg-green-600 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95 shadow-blue-500/30'}`}
            >
                {step === AssemblyStep.Phone ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Assemblage Terminé
                    </>
                ) : (
                    <>
                      Étape Suivante <ChevronRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}
