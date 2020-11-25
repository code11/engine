export const greeting: producer = ({
  name = observe.name,
  greeting = update.greeting,
}) => greeting.set(`Hello ${name}!`);
