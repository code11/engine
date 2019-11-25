import { DB } from 'jsonmvc-datastore';
export * from './producer';

export enum OperationTypes {
  GET = 'GET',
  SET = 'SET',
  MERGE = 'MERGE',
  REF = 'REF'
}

export enum StructureTypes {
  STATIC = 'STATIC',
  MAP = 'MAP',
  FUNC = 'FUNC'
}

export enum PathValueTypes {
  PLAIN = 'PLAIN',
  EXTERNAL = 'EXTERNAL',
  INTERNAL = 'INTERNAL',
  INVOKE = 'INVOKE'
}

export interface PathValue {
  type: PathValueTypes;
  value: string;
}

export interface StaticValue {
  type: StructureTypes.STATIC;
  value: any;
}

export type Path = PathValue[];

export interface Operation {
  type: OperationTypes;
  path: Path;
}

export interface NestedArg {
  type: StructureTypes.MAP;
  args: {
    [key: string]: ArgValue;
  };
}

export interface FuncArg {
  type: StructureTypes.FUNC;
  args: ArgValue[];
  fn: (...param: any) => any;
}

export type ArgValue = Operation | NestedArg | StaticValue | FuncArg;

export interface ProducerArgs {
  [key: string]: ArgValue;
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
  mount: () => void;
  unmount: () => void;
  update: () => void;
}

export interface ProducerContext {
  db: DB;
}
