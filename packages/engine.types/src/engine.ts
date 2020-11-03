import { MacroProducerType } from "./macro";
import { ProducerInstance } from "./producer";

export type ModuleContext = {
  addProducer: (config: MacroProducerType) => ProducerInstance;
  removeProducers: () => void;
};

export type EngineModuleInstance = {
  unmount(): void;
};

export type EngineModuleSource = {
  bootstrap?: () => void | Promise<void>;
  update?: () => void | Promise<void>;
  mount: (context: ModuleContext) => void | Promise<void>;
  unmount: (context: ModuleContext) => void | Promise<void>;
};

export type EngineConfig = {
  state?: {
    [key: string]: any;
  };
  use?: EngineModuleSource[];
};

export type EngineState = {
  [key: string]: any;
};

export interface EngineApi {
  start(): void;
  stop(): void;
  state(state: EngineState): void;
  use(bundle: EngineModuleSource): void;
}

export enum EngineModuleState {
  NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED",
  BOOTSTRAPING = "BOOTSTRAPING",
  NOT_MOUNTED = "NOT_MOUNTED",
  MOUNTED = "MOUNTED",
  UNMOUNTING = "UNMOUNTING",
  UPDATING = "UPDATING",
  SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN",
}
