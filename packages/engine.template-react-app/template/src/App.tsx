import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">Hello world</Route>
      </Switch>
    </Router>
  );
};
