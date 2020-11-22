import style from "./styles.module.css";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

export const App: view = ({ greeting = observe.greeting }) => (
  <div>
    <div className={style.foo}>{greeting}</div>
    <AwesomeButton type="primary">Button sample</AwesomeButton>
  </div>
);

const greeting: producer = ({
  name = observe.name,
  greeting = update.greeting,
}) => greeting.set(`Hello ${name}!`);

//@ts-ignore
App.producers = [greeting];
