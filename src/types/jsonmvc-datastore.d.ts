declare module 'jsonmvc-datastore' {
  interface Patch {
    op: string;
    path: string;
    value?: any;
  }
  interface DB {
    node(
      path: string,
      args: { [key: string]: string },
      fn: (args: any) => any
    ): any;
    has(path: string): boolean;
    get(path: string): any;
    on(path: string, cb: (value: any) => void): () => void;
    patch(patches: Patch[]): void;
  }
  function dbFn(obj: object): DB;
  export default dbFn;
}
