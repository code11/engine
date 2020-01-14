import { ProducerData, StructOperation } from "./producer";

export type ViewFn = (data: ProducerData) => JSX.Element;

export interface RenderConfig {
  element: JSX.Element;
  root: Element | HTMLDivElement;
  render: (comp: JSX.Element, root: Element | HTMLDivElement) => any;
}

export interface ViewConfig {
  args: StructOperation;
  fn: ViewFn;
}

export interface RenderInstance {
  unmount: () => RenderInstance;
  mount: () => RenderInstance;
}
