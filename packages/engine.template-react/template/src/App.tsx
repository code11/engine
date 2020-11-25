import { greeting } from "./greeting";

export const App: view = ({ greeting = observe.greeting }) => (
  <div>{greeting}</div>
);

App.producers = [greeting];
