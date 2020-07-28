import {
  ProducerData,
  StructOperation,
  ProducerInstance,
  ProducerMeta,
} from "./producer";

export type ViewFn = (data: ProducerData) => JSX.Element;

export interface RenderConfig {
  element: any;
  root: any;
}

export interface ViewConfig {
  meta: ProducerMeta;
  args: StructOperation;
  fn: ViewFn;
}
export type RootElement = HTMLElement | null;
export interface ViewInstance {
  id: string;
  producers: ProducerInstance[];
}
export interface RenderInstance {
  unmount: () => RenderInstance;
  mount: () => RenderInstance;
  getRoot: () => RootElement;
}
