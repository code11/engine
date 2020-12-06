import {
  ProducerData,
  StructOperation,
  ProducerInstance,
  ProducerMeta,
} from "./producer";

export type ViewFn = (data: ProducerData | any) => JSX.Element | any;

export interface RenderConfig {
  element: any;
  root: any;
}

export interface ViewConfig {
  sourceId: string;
  meta: ProducerMeta;
  props: StructOperation;
  fn: ViewFn;
}
export type RootElement = HTMLElement | null;
export interface ViewInstance {
  id: string;
  sourceId: string;
  producers: ProducerInstance[];
}
export interface RenderInstance {
  unmount: () => RenderInstance;
  mount: () => RenderInstance;
  getRoot: () => RootElement;
}
