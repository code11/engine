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

Check the value of a prop and if it's a listener treat it as if it was defined at the component level
