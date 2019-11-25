import { ComponentClass } from 'react';
import { ProducerArgs, ProducerData } from '../index';
export * from './view';

export type ViewFn = (data: ProducerData) => ComponentClass;

export interface ViewConfig {
  args: ProducerArgs;
  fn: ViewFn;
}
