export const foo = 123;
declare global {
  type producer = any;
  const observe: any;
  const get: any;
  const update: any;
  const prop: any;
  const param: any;
  const arg: any;
}
