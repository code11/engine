import _React from "react";
import { State as StateStructure } from "./state";

declare global {
  type State = StateStructure;
  type producer = (props: any) => any;
  type view<T = {}> = (props: any) => React.ReactElement<T> | null;
  const React: typeof _React;
  const observe: State;
  const get: any;
  const update: any;
  const prop: any;
  const param: any;
  const arg: any;

  type Params<T> = {
    [k in keyof T]: string | number | Params<T[k]>;
  };

  type Update<T, P = {}> = {
    set: (value: T, params?: Params<P>) => void;
    merge: (value: Partial<T>, params?: Params<P>) => void;
    remove: (params?: Params<P>) => void;
    push: (
      value: T extends (infer R)[] ? R : unknown,
      params?: Params<P>
    ) => void;
    pop: (params?: Params<P>) => void;
  };

  type Get<T, P = {}> = {
    value: (params?: Params<P>) => T;
    includes: (value: any, params?: Params<P>) => boolean;
    length: (params?: Params<P>) => number;
  };
}
