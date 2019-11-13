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

export function producer(body: Body) {
  const db = window.db;

  const lib = {
    patch: patch(db, body),
    log: log(db, body),
    add: add(db, body),
    remove: remove(db, body),
    merge: merge(db, body),
    get: get(db, body),
    on: on(db, body)
  };

  const data: { [key: string]: any } = {};
  Object.entries(body.args).forEach(([key, path]: [string, any]) => {
    data[key] = undefined;
    db.on(path, (x: any) => {
      data[key] = x;
      body.fn(data, lib);
    });
  });
}
