export * from './context';
export * from './engine';

export interface EngineConfig {
  producers?: {
    list: any[];
  };
  view?: {
    element: JSX.Element;
    root: Element | HTMLDivElement;
  };
  state?: {
    default: {
      [key: string]: any;
    };
    schema: any;
  };
}

export interface EngineApi {
  start: () => void;
  stop: () => void;
}
