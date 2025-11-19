export enum AssemblyStep {
  Chassis = 0,
  SolarModule = 1,
  PCB = 2,
  Slider = 3,
  ThermalInsert = 4
}

export type PhoneModel = 'iPhone12' | 'GalaxyS22';

export interface PartProps {
  visible: boolean;
  step: AssemblyStep;
}

export interface AIModelConfig {
  model: string;
  displayName: string;
  description: string;
}