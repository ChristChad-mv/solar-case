
export enum AssemblyStep {
  Case = 0,
  SolarModule = 1,
  Battery = 2,
  PCB = 3,
  ThermalInsert = 4,
  Phone = 5
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
