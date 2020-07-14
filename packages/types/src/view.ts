import { ProducerData, StructOperation, ProducerInstance } from "./producer";

export type ViewFn = (data: ProducerData) => JSX.Element;

export interface RenderConfig {
  element: any;
  root: any;
}

export interface ViewConfig {
  args: StructOperation;
  fn: ViewFn;
}
export type RootElement = HTMLElement | null;
export interface ViewInstance {
  producers: ProducerInstance[];
}
export interface RenderInstance {
  unmount: () => RenderInstance;
  mount: () => RenderInstance;
  getRoot: () => RootElement;
}
