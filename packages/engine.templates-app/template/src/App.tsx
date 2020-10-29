import React from "react";
import { view, producer, Observe, Update } from "@c11/engine.macro";

export const App: view = ({ greeting = Observe.greeting }) => (
  <div>{greeting}</div>
);

const greeting: producer = ({
  name = Observe.name,
  greeting = Update.greeting,
}) => greeting.set(`Hello ${name}!`);

App.producers = [greeting];
