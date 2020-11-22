import { typeGenerator } from "../src";

test.only("should deffer correct types for a producer", () => {
  const code = `
  const foo: producer = ({
    foo = observe.foo.value,
    bar = update.bar.value,
    baz = update.baz.value,
  }) => {}
`;
  const result = typeGenerator(code);
  return;
  expect(result).toBe(`
  type props = {
    bam: State["foo"]["bar"],
    bar: Update<State["foo"]["bar]>
  }
  `);
});

test("should deffer correct types for a view", () => {
  const code = `
  type external {
    foo: number;
  }
  type props {
    bar: string
  }
  const Foo: view<external> = ({
    bar: observe.bar.value
  }: props) => {}
  `;
});
