import { DB } from 'jsonmvc-datastore';
export * from './producer';

export enum OperationTypes {
  GET = 'GET',
  SET = 'SET',
  MERGE = 'MERGE',
  REF = 'REF'
}

export interface Operation {
  type: OperationTypes;
  path: string[];
}

export interface ProducerArgs {
  [key: string]: Operation | ProducerArgs;
}

export interface ProducerData {
  [key: string]: any;
}

export type ProducerFn = (data: ProducerData) => void;

export interface ProducerConfig {
  args: ProducerArgs;
  fn: ProducerFn;
}

export interface ProducerInstance {
  mount: () => {};
}

export interface ProducerContext {
  db: DB;
}
