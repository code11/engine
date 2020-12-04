import { DatastoreInstance } from "./db";
import { ViewInstance } from "./view";

export enum OperationTypes {
  GET = "GET",
  OBSERVE = "OBSERVE",
  UPDATE = "UPDATE",
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
  path: InvokableValue[];
}

export interface UpdateOperation extends BaseOperation {
  type: OperationTypes.UPDATE;
  path: InvokableValue[];
}

export interface ObserveOperation extends BaseOperation {
  type: OperationTypes.OBSERVE;
  path: StaticValue[];
}

export type StaticOperation = ObserveOperation | ValueOperation;

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
  | ObserveOperation
  | UpdateOperation
  | FuncOperation
  | StructOperation
  | ValueOperation;

export interface ProducerProps {
  [key: string]: Operation;
}

export type ProducerData = {
  [key: string]: any;
};

export type ProducerCb = () => void;
export type ProducerFn = (props: ProducerData | any) => any | ProducerCb;
export interface ProducerMeta {
  name?: string;
  location?: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
  absoluteFilePath?: string;
  absoluteRootPath?: string;
  relativeFilePath?: string;
}

export interface ProducerConfig {
  meta: ProducerMeta;
  props: StructOperation;
  fn: ProducerFn;
}

export interface ProducerInstance {
  id: string;
  sourceId: string;
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

export type OperationParams = {
  [k: string]: OperationParams | string | number | void | null;
};

export type Params<T> = {
  [k in keyof T]: string | number | Params<T[k]>;
};

export type UpdateValue<T, P = {}> = {
  set: (value: T, params?: Params<P>) => void;
  merge: (value: Partial<T>, params?: Params<P>) => void;
  remove: (params?: Params<P>) => void;
  push: (
    value: T extends (infer R)[] ? R : unknown,
    params?: Params<P>
  ) => void;
  pop: (params?: Params<P>) => void;
};

export type GetValue<T, P = {}> = {
  value: (params?: Params<P>) => T;
  includes: (value: any, params?: Params<P>) => boolean;
  length: (params?: Params<P>) => number;
};

export type ObservePath<T> = T;
export type UpdatePath<T> = any;
export type GetPath<T> = any;
export type Prop = any;
export type Param = any;
export type Arg = any;
