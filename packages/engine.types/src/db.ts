export type RemoveListener = () => void;
export interface Patch {
  op: string;
  path: string;
  value?: any;
}

export interface DatastoreInstance {
  node(
    path: string,
    args: { [key: string]: string },
    fn: (args: any) => any
  ): any;
  has(path: string): boolean;
  get(path: string): any;
  on(path: string, cb: (value: any) => void): RemoveListener;
  patch(patches: Patch[]): void;
  db: Datastore;
}

export interface Datastore {
  static: any;
  errors: any;
  cache: {
    paths: any;
    dynamic: any;
  };
  triggers: any;
  dynamic: {
    decomposed: any;
    patching: any;
    nesting: any;
    reverseDeps: any;
    inverseDeps: any;
    staticDeps: any;
    fullDeps: any;
    deps: any;
    fns: any;
  };
  updates: {
    cache: any;
    triggers: any;
    fns: any;
  };
}
