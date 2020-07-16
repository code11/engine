import { ProducerConfig, ProducerInstance } from "./producer";
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
  debug?: boolean;
}
export interface EngineApi {
  start: () => void;
  stop: () => void;
  getRoot: () => RootElement;
  getProducers: () => ProducerInstance[];
}

export abstract class Engine {}
