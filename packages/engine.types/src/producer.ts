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

export enum UpdateValueMethods {
  SET = "set",
  MERGE = "merge",
  REMOVE = "remove",
  PUSH = "push",
  POP = "pop",
}

export type UpdateValue<T = any, P = {}> = {
  [UpdateValueMethods.SET]: (value: T, params?: Params<P>) => void;
  [UpdateValueMethods.MERGE]: (value: Partial<T>, params?: Params<P>) => void;
  [UpdateValueMethods.REMOVE]: (params?: Params<P>) => void;
  [UpdateValueMethods.PUSH]: (
    value: T extends (infer R)[] ? R : unknown,
    params?: Params<P>
  ) => void;
  [UpdateValueMethods.POP]: (params?: Params<P>) => void;
};

export enum GetValueMethods {
  VALUE = "value",
  INCLUDES = "includes",
  LENGTH = "length",
}

export type GetValue<T = any, P = {}> = {
  [GetValueMethods.VALUE]: (params?: Params<P>) => T;
  [GetValueMethods.INCLUDES]: (value: any, params?: Params<P>) => boolean;
  [GetValueMethods.LENGTH]: (params?: Params<P>) => number;
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
