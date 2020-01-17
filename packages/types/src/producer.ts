import { DB } from "jsonmvc-datastore";

export enum OperationTypes {
  GET = "GET",
  SET = "SET",
  MERGE = "MERGE",
  REF = "REF",
  FUNC = "FUNC",
  STRUCT = "STRUCT",
  VALUE = "VALUE",
}

export enum ValueTypes {
  CONST = "CONST",
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
  INVOKE = "INVOKE",
}

interface Params {
  [key: string]: any;
}

export interface RefDataType {
  get: (params: Params) => any;
  set: (value: any, params: Params) => void;
  merge: (value: any, params: Params) => void;
}

export interface ConstValue {
  type: ValueTypes.CONST;
  value: any;
}

export interface ExternalValue {
  type: ValueTypes.EXTERNAL;
  path: string[];
}

export interface InternalValue {
  type: ValueTypes.INTERNAL;
  path: string[];
}

export interface InvokeValue {
  type: ValueTypes.INVOKE;
  name: string;
}

export type StaticValue = ConstValue | ExternalValue | InternalValue;
export type InvokableValue = StaticValue | InvokeValue;

export type StaticPath = StaticValue[];
export type InvokablePath = InvokableValue[];

export interface GetOperation {
  type: OperationTypes.GET;
  path: StaticValue[];
}
export interface MergeOperation {
  type: OperationTypes.MERGE;
  path: InvokableValue[];
}
export interface SetOperation {
  type: OperationTypes.SET;
  path: InvokableValue[];
}

export interface RefOperation {
  type: OperationTypes.REF;
  path: InvokableValue[];
}

export type StaticOperation = GetOperation | ValueOperation;

export interface FuncOperation {
  type: OperationTypes.FUNC;
  value: {
    params: StaticOperation[];
    fn: (...param: any) => any;
  };
}

export interface StructOperation {
  type: OperationTypes.STRUCT;
  value: {
    [key: string]: Operation;
  };
}

export interface ValueOperation {
  type: OperationTypes.VALUE;
  value: ExternalValue | InternalValue | ConstValue;
}

export type Operation =
  | GetOperation
  | MergeOperation
  | SetOperation
  | RefOperation
  | FuncOperation
  | StructOperation
  | ValueOperation;

export interface ProducerArgs {
  [key: string]: Operation;
}

export interface ProducerData {
  [key: string]: any;
}

export type ProducerFn = (data: ProducerData) => void;

export interface ProducerConfig {
  args: StructOperation;
  fn: ProducerFn;
}

export interface ProducerInstance {
  mount: () => void;
  unmount: () => void;
  update: () => void;
}

export interface ExternalProps {
  [key: string]: any;
}
export interface ProducerContext {
  db: DB;
  props?: ExternalProps;
}
