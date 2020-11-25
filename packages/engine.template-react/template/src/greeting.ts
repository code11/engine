type props = {
  name: State["name"];
  greeting: Update<State["greeting"]>;
};

export const greeting: producer = ({
  name = observe.name,
  greeting = update.greeting,
}: props) => greeting.set(`Hello ${name}!`);
