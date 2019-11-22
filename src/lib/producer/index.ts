import {
  log,
  Log,
  merge,
  Merge,
  remove,
  Remove,
  add,
  Add,
  on,
  On,
  get,
  Get,
  patch,
  Patch
} from './lib';

import { mount } from './mount';

export interface Args {
  [key: string]: any;
}
export interface Lib {
  on: On;
  get: Get;
  patch: Patch;
  add: Add;
  remove: Remove;
  merge: Merge;
  log: Log;
}
export type Fn = (args: Args, lib: Lib) => void;
export interface Body {
  name?: string;
  args: Args;
  fn: Fn;
}
export interface PatchValue {
  op: string;
  path: string;
  value?: any;
}

export type Patches = PatchValue[];
export interface DB {
  has(path: string): boolean;
  node(
    path: string,
    args: { [key: string]: string },
    fn: (args: any) => any
  ): any;
  get(path: string): any;
  on(path: string, cb: (value: any) => void): () => void;
  patch(patches: Patches): void;
}

export const producers: any[] = [];

export function producer(body: Body) {

  producers.push(body);

  return ((db: any) => {
    const lib = {
      patch: patch(db, body),
      log: log(db, body),
      add: add(db, body),
      remove: remove(db, body),
      merge: merge(db, body),
      get: get(db, body),
      on: on(db, body)
    };
    const unsub = mount(db, body, lib);
  })

}
