import style from "./styles.module.css";

export const App: view = ({ greeting = observe.greeting }) => (
  <div>
    <div className={style.foo}>{greeting}</div>
    <button>Button sample</button>
  </div>
);

const greeting: producer = ({
  name = observe.name,
  greeting = update.greeting,
}) => greeting.set(`Hello ${name}!`);

//@ts-ignore
App.producers = [greeting];
