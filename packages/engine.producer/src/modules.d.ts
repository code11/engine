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

declare module "kebab-case" {
  function fn(str: string): string;
  export default fn;
}

declare module "babel-plugin-tester" {
  function fn(args: any): any;
  export default fn;
}

declare interface producer {}
