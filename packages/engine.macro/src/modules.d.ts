declare module "react-html-attributes" {
  interface Elements {
    [key: string]: any;
  }
  interface Attr {
    "*": string[];
    elements: Elements;
  }
  const attr: Attr;
  export default attr;
}

declare module "flatted/esm" {
  type stringify = (a: any, b: any, c: any) => string;
  export const stringify: stringify;
}

declare module "kebab-case" {
  function fn(str: string): string;
  export default fn;
}

declare module "babel-plugin-tester" {
  function fn(args: any): any;
  export default fn;
}
