export enum Messages {
  ARROW_FUNCTION_EXPECTED = `
Invalid usage: The body of a view or a producer needs to be an arrow function e.g. const foo: view = () => {} (error code: 1)`,
  INVALID_FUNCTION_PARAM = `
Invalid usage: The arrow function should contain only one param and it needs to be an object e.g. const foo: producer = ({ a: observe.foo }) => { .. } (error code: 2)
`,
  CANNOT_FIND_PROGRAM = `Cannot find program (error code: 3)`,
  INVALID_USAGE = `Invalid definition of view or producer (error code: 4)`,
}
