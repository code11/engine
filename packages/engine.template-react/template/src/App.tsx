import { Component } from "./Component";
import { greeting } from "./greeting";

export const App: view = ({ greeting = observe.greeting }) => (
  <div>
    <div>{greeting}</div>
    <Component name="a" />
  </div>
);

App.producers = [greeting];
