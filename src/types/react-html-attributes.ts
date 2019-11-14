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
