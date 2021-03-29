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

Store all triggers with their respective timestamp as the key and the data (or lack of) as the body

start = update.foo.triggers.start[param.time]

start.set({ foo: 123 }, { time: now()})
start.set({}, { time: now()})

then the listeners for triggers can be:

const startTrigger: producer = ({
id = Wildcard,
trigger = observe.foo.triggers.start[arg.id]
updateTrigger = update.foo.triggers.start[arg.id]
}) => {
if (!trigger) [
return
]
updateTrigger.remove()
}

const trigger = (path, logic) => {
const result: producer = ({
id = Wildcard,
trigger = observe[path][arg.id],
updateTrigger = update[path][arg.id]
}) => {
if (!trigger) {
return
}
}

}

if observe, etc are not transformed initially and are just proxies - that means they can be reused at runtime
