import React from "react";
import "./index.css";
import App from "./App";
import { Engine } from "@c11/engine-react";
import { initialState } from "./structure";
import * as serviceWorker from "./serviceWorker";

new Engine({
  state: {
    initial: initialState,
  },
  view: {
    element: <App />,
    root: "#root",
  },
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
