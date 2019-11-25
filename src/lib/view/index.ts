import { ProducerArgs, ProducerData } from '../index';
export * from './react';

export type ViewFn = (data: ProducerData) => JSX.Element;

export interface ViewConfig {
  args: ProducerArgs;
  fn: ViewFn;
}

export interface RenderInstance {
  unmount: () => RenderInstance;
  mount: () => RenderInstance;
}
