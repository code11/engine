import { AccessMethods } from ".";

export type RemoveListener = () => void;
export interface Patch {
  op: string;
  path: string;
  value?: any;
}

export type AccessMethodRefinee = {
  type: AccessMethods;
  args: any[];
};

export interface DatastoreInstance {
  node(
    path: string,
    args: { [key: string]: string },
    fn: (args: any) => any
  ): any;
  has(path: string): boolean;
  get(path: string, refinee?: AccessMethodRefinee): any;
  on(
    path: string,
    cb: (value: any, patch: Patch[]) => void,
    refinee?: AccessMethodRefinee
  ): RemoveListener;
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
    refinees: any;
    cache: any;
    triggers: any;
    fns: any;
  };
}
