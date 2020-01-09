declare module 'react-html-attributes' {
  interface Elements {
    [key: string]: any;
  }
  interface Attr {
    '*': string[];
    elements: Elements;
  }
  const attr: Attr;
  export default attr;
}

declare module 'jsonmvc-datastore' {
  export interface Patch {
    op: string;
    path: string;
    value?: any;
  }

  export type RemoveListener = () => void;
  export interface DB {
    node(
      path: string,
      args: { [key: string]: string },
      fn: (args: any) => any
    ): any;
    has(path: string): boolean;
    get(path: string): any;
    on(path: string, cb: (value: any) => void): RemoveListener;
    patch(patches: Patch[]): void;
  }
  export function dbFn(obj: object): DB;
  export default dbFn;
}

declare module 'kebab-case' {
  function fn(str: string): string;
  export default fn;
}

declare module 'babel-plugin-tester' {
  function fn(args: any): any;
  export default fn;
}