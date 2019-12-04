import { ProducerConfig } from '../producer';
import { RenderConfig } from '../view';

export * from '../view/react/context';
export * from './engine';

export interface EngineConfig {
  producers?: {
    list: ProducerConfig[];
  };
  view?: RenderConfig;
  state: {
    default: {
      [key: string]: any;
    };
    schema?: any;
  };
}

export interface EngineApi {
  start: () => void;
  stop: () => void;
}
