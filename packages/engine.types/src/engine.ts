import type { Emitter } from "mitt";
import { MacroProducerType } from "./macro";
import { ProducerConfig, ProducerInstance } from "./producer";
import { ViewConfig } from "./view";
import {
  Events,
  EventContext,
  Event,
  EventNames,
  EventPayload,
} from "./events";
import { DatastoreInstance } from "./db";

export type ExternalProducerContext = {
  props?: any;
  debug?: boolean;
};

export type UpdateSourceFn = (config: ProducerConfig | ViewConfig) => void;

export type UnsubscribeSourceUpdateFn = () => void;

export type EngineEmitter = Emitter<Events>;

export enum EngineStates {
  RUNNING = "RUNNING",
  NOT_RUNNING = "NOT_RUNNING",
}

export type EngineContext = {
  engineId: string;
  db: DatastoreInstance;
  emit: (
    name: EventNames,
    payload?: EventPayload,
    context?: EventContext
  ) => void;
};

export enum ModuleNames {
  ENGINE_PRODUCERS = "ENGINE_PRODUCERS",
  REACT_RENDER = "REACT_RENDER",
}

export type ModuleContext = {
  emit: EngineContext["emit"];
  onSourceUpdate: (
    sourceId: string,
    cb: UpdateSourceFn
  ) => UnsubscribeSourceUpdateFn;
  addProducer: (
    config: MacroProducerType,
    context?: ExternalProducerContext
  ) => ProducerInstance;
};

export type EngineModuleInstance = {
  unmount(): void;
};

export type EngineModuleSource = {
  name: ModuleNames;
  bootstrap?: () => void | Promise<void>;
  mount: (context: ModuleContext) => void | Promise<void>;
  unmount: (context: ModuleContext) => void | Promise<void>;
};

export type EventListener = (event: Event) => void;
export type EventListenerMap = Partial<{
  [k in EventNames]: EventListener;
}>;

export type EngineConfig = {
  onEvents?: EventListener | EventListenerMap;
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
