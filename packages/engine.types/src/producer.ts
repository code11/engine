import { EngineContext } from ".";
import { DatastoreInstance } from "./db";
import { GraphNodeType } from "./graph";
import { PathType } from "./macro";
import { ViewInstance } from "./view";

export enum OperationTypes {
  GET = "GET",
  OBSERVE = "OBSERVE",
  UPDATE = "UPDATE",
  REF = "REF",
  FUNC = "FUNC",
  STRUCT = "STRUCT",
  VALUE = "VALUE",
  CONSTRUCTOR = "CONSTRUCTOR",
  PASSTHROUGH = "PASSTHROUGH",
}

export enum ValueTypes {
  CONST = "CONST", // path member
  EXTERNAL = "EXTERNAL", // prop
  INTERNAL = "INTERNAL", // arg
  INVOKE = "INVOKE", // param
  REFINEE = "REFINEE", // last path member as invocation in header paths
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

export interface RefiningValue {
  type: ValueTypes.REFINEE;
  value: {
    method: AccessMethods | UpdateMethods;
    args: ConstValue | ExternalValue | InternalValue;
  };
}

export type StaticValue = ConstValue | ExternalValue | InternalValue;
export type InvokableValue = StaticValue | InvokeValue | RefiningValue;

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
export interface ConstructorOperation extends BaseOperation {
  type: OperationTypes.CONSTRUCTOR;
  value: PathType.OBSERVE | PathType.GET | PathType.UPDATE;
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
export interface PassthroughOperation extends BaseOperation {
  type: OperationTypes.PASSTHROUGH;
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
  | ValueOperation
  | ConstructorOperation
  | PassthroughOperation;

export interface ProducerProps {
  [key: string]: Operation;
}

export type PrivateProps<Props = any> = {
  _now: () => number;
  _producerId: string;
  _viewId: string;
  _props: Props;
};

export type ProducerCb = () => void;
export type Producer = (
  props: any
) => void | ProducerCb | Promise<void | ProducerCb>;

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
  sourceId?: string;
  buildId?: string;
  meta?: ProducerMeta;
  props: StructOperation | PassthroughOperation;
  fn: Producer;
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
  emit: EngineContext["emit"];
  db: DatastoreInstance;
  props?: ExternalProps;
  keepReferences?: string[];
  serializers?: ValueSerializer[];
  debug?: boolean;
  addView?: (view: ViewInstance) => void;
}

export type OperationParams = {
  [k: string]: OperationParams | string | number | void | null;
};

export type Params<T> = {
  [k in keyof T]: string | number | Params<T[k]>;
};

export enum UpdateMethods {
  set = "set",
  merge = "merge",
  remove = "remove",
  push = "push",
  pop = "pop",
}

export type UpdateValue<T = any, P = {}> = {
  [UpdateMethods.set]: (value: T, params?: Params<P>) => void;
  [UpdateMethods.merge]: (value: Partial<T>, params?: Params<P>) => void;
  [UpdateMethods.remove]: (params?: Params<P>) => void;
  [UpdateMethods.push]: (
    value: T extends (infer R)[] ? R : unknown,
    params?: Params<P>
  ) => void;
  [UpdateMethods.pop]: (params?: Params<P>) => void;
};

//TODO: this should be the same as the Observe refining methods
// so that the syntax is compatible on both fronts
//TODO: Rename this operation as data access -> data update
// or shorter Access and Update
export enum AccessMethods {
  value = "value",
  includes = "includes",
  length = "length",
  // keys = "keys",
  // isValid = "isValid",
  // isEq = "isEq", // is equal
  // isNe = "isNe", // is not equal
  // isGt = "isGt", // is greater
  // isLt = "isLt", // is less
  // isGe = "isGe", // is greater or equal
  // isLe = "isLe", // is less or equal
  // and
  // or
  // not
  // hasElement = "hasElement", // instead of includes for arrays
  // hasChar = "hasChar" //
  // hasProperty
  // onDemand // update.foo.onDemand() - execution is conditioned by an observe
  // next - act as a generator
}

export type GetValue<T = any, P = {}> = {
  [AccessMethods.value]: (params?: Params<P>) => T;
  [AccessMethods.includes]: (value: any, params?: Params<P>) => boolean;
  [AccessMethods.length]: (params?: Params<P>) => number;
};

export type ObservePath<T> = T;
export type UpdatePath<T> = any;
export type GetPath<T> = any;
export type Prop = any;
export type Param = any;
export type Arg = any;

export type ValueSerializer = {
  type?: GraphNodeType;
  name?: string;
  instanceof?: any;
  serializer: (value: any) => void | string;
};

export type ProducersList =
  | undefined
  | Producer
  | Producer[]
  | ProducersList[]
  | { [k: string]: ProducersList };
