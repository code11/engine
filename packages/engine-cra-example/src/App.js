import React from "react";
import { view } from "@c11/engine.macro";
import { Set, Get } from "./state";
import { DummyButton } from "./components";

const App = view((foo = Get.foo, setFoo = Set.foo, bar = Get.bar) => {
  return (
    <div className="App">
      <header className="App-header">
        <p>Foo = {foo}</p>
        <p>Bar = {bar}</p>
        <button onClick={() => setFoo(Date.now())}>Press me</button>
        <DummyButton foo={foo}>I'm a dummy button</DummyButton>
      </header>
    </div>
  );
});

export { App };
