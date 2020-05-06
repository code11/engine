import { ProducerConfig } from "./producer";
import { RenderConfig, RootElement } from "./view";

export interface EngineConfig {
  autostart?: boolean;
  producers?: {
    list: ProducerConfig[];
  };
  view?: RenderConfig;
  state?: {
    initial?: {
      [key: string]: any;
    };
    schema?: any;
  };
}

export interface EngineApi {
  start: () => void;
  stop: () => void;
  getRoot: () => RootElement
}

export abstract class Engine {}
