import { ProducerConfig } from '../producer';

export * from '../view/react/context';
export * from './engine';

export interface EngineConfig {
  producers?: {
    list: ProducerConfig[];
  };
  view?: {
    element: JSX.Element;
    root: Element | HTMLDivElement;
  };
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
