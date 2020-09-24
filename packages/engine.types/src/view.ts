import { ReactElement } from "react";
import {
  ProducerData,
  StructOperation,
  ProducerInstance,
  ProducerMeta,
  ProducerConfig,
} from "./producer";

export type ViewFn = (data: ProducerData) => JSX.Element;

export interface RenderConfig {
  component: any;
  root: any;
}

export interface ViewConfig {
  meta: ProducerMeta;
  args: StructOperation;
  fn: ViewFn;
}

declare type ReactWrapper<T> = (props: T) => ReactElement<T> | null;
export declare type View<T = any> = ReactWrapper<T> & {
  producers?: ProducerConfig[];
};

type PromiseContainer = Promise<StaticContainer>;

type StaticContainer = HTMLElement | null;

type DynamicContainer = (...params: any) => HTMLElement | PromiseContainer;

export type Container = StaticContainer & DynamicContainer & PromiseContainer;

export interface ViewInstance {
  id: string;
  producers: ProducerInstance[];
}

export interface RenderInstance {
  unmount: () => RenderInstance;
  mount: () => RenderInstance;
  getContext: () => Container;
}
