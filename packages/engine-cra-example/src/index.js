import React from "react";
import { Engine } from "@c11/engine-react";
import "./index.css";
import { App } from "./App";
import { foo } from "./producers/foo";
import * as serviceWorker from "./serviceWorker";

const engine = new Engine({
  producers: {
    list: [foo],
  },
  state: {
    default: {
      foo: "abc",
    },
  },
  view: {
    element: <App />,
    root: "#root",
  },
});

engine.start();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
