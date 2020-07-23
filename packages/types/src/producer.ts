import { DatastoreInstance, Datastore } from "./db";
import { ViewInstance } from "./view";

export enum OperationTypes {
  GET = "GET",
  SET = "SET",
  MERGE = "MERGE",
  REF = "REF",
  FUNC = "FUNC",
  STRUCT = "STRUCT",
  VALUE = "VALUE",
  REMOVE = "REMOVE",
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
  path: string[];
}

export type StaticValue = ConstValue | ExternalValue | InternalValue;
export type InvokableValue = StaticValue | InvokeValue;

export type StaticPath = StaticValue[];
export type InvokablePath = InvokableValue[];

// TODO: Define what the base operation can hold
export interface BaseOperation {
  meta?: any;
}

export interface GetOperation extends BaseOperation {
  type: OperationTypes.GET;
  path: StaticValue[];
}
export interface MergeOperation extends BaseOperation {
  type: OperationTypes.MERGE;
  path: InvokableValue[];
}

export interface RemoveOperation extends BaseOperation {
  type: OperationTypes.REMOVE;
  path: InvokableValue[];
}

export interface SetOperation extends BaseOperation {
  type: OperationTypes.SET;
  path: InvokableValue[];
}

export interface RefOperation extends BaseOperation {
  type: OperationTypes.REF;
  path: InvokableValue[];
}

export type StaticOperation = GetOperation | ValueOperation;

export interface FuncOperation extends BaseOperation {
  type: OperationTypes.FUNC;
  value: {
    params: StaticOperation[];
    fn: (...param: any) => any;
  };
}

export interface StructOperation extends BaseOperation {
  type: OperationTypes.STRUCT;
  value: {
    [key: string]: Operation;
  };
}

export interface ValueOperation extends BaseOperation {
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
  | RemoveOperation
  | ValueOperation;

export interface ProducerArgs {
  [key: string]: Operation;
}

export interface ProducerData {
  [key: string]: any;
}

export type ProducerFn = (...data: any) => void;

export interface ProducerConfig {
  args: StructOperation;
  fn: ProducerFn;
}

export interface ProducerInstance {
  mount: () => void;
  unmount: () => void;
  updateExternal: (props: ProducerContext["props"]) => this;
}

export interface ExternalProps {
  [key: string]: any;
}
export interface ProducerContext {
  db: DatastoreInstance;
  props?: ExternalProps;
  keepReferences?: string[];
  debug?: boolean;
  addView?: (view: ViewInstance) => void;
}
