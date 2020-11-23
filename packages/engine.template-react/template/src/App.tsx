export const App: view = ({ greeting = observe.greeting }) => (
  <div>{greeting}</div>
);

const greeting: producer = ({
  name = observe.name,
  greeting = update.greeting,
}) => greeting.set(`Hello ${name}!`);

App.producers = [greeting];
