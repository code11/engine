import React from "react";
import logo from "./logo.svg";
import { view } from "@c11/engine.macro";
import { get, set } from "./structure";
import "./App.css";

const App = view(
  (greeting = get.greeting, setBar = set.foo.bar, bar = get.foo.bar) => {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {greeting}
            <button onClick={() => setBar(Date.now())}>Press me</button>
            {bar && <p>You pressed the button at {bar}</p>}
          </a>
        </header>
      </div>
    );
  }
);

export default App;
