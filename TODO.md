- Remove react jsx from deps types

- Update ProducerFn signature to match current apply call

- Make a BaseContext, EngineReactContext, EngineNodeContext, etc

- Use process.nextTick for nodejs

- Add the capability to use the opertions outside the producer definition:

```
const Foo = value => <div>{value}</div>
const a = Observe.foo.bar.baz
<Foo value={a}>
<Foo value="123">
```

- Check the value of a prop and if it's a listener treat it as if it was defined at the component level

- Test if identifier is in the function's arguments list and add it as Arg

```
  foo,
  bar = Observe[foo.baz]
```

is considered to be

```
foo,
bar = Observe[Arg.foo.baz]
```

- Test if props are cloned or are given by reference - they should be clonned

- Add Array methods for modifying arrays to the Update operation

- Wildcard observe's can be parallelized!

1. Ensure modules for @c11/engine.cli & @c11/engine.cli-service-web install are placed in the right location to be accessed at runtime
2. Change the cli-service-web to match the engine-web-service -> @c11/engine.engine.web-service
3. Check why webpack doubles the @c11/engine.db and @c11/engine.producer packages, might be linked to 1.)
4. Update the types for the pages according to the global.ts example
5. Remove the debug flag from @c11/engine.cli
6. Add finish message to engine.cli
7. Add intermediate messges to show progress in engine.cli
8. Refactor the engine.test package
