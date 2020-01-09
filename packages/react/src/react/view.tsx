import React from "react";
import ViewContext from "./context";
import { BaseProps, BaseState } from "./types";
import { ViewConfig } from "@c11/engine-types";
import { Producer } from "@c11/engine-producer";
import { RenderComponent } from "./renderComponent";

// TopLevel{
//   ErrorManagement,
//   propsManagement
// }

// MidLevel{
//   ChildSelection,
//   StateManagement,
//   ListenerManagement
// }

/**
 * - Builds up the state
 * - Creates listeners to react to state changes
 * - Gives the state to the renderComponent
 * - Chooses in which view-state/variant the component needs to be in
 * - Mounts and unmounts children states accordingly
 */

/**
 * - Receives props from the outside world.
 * - Creates the state manager (which to be a component
 * to properly handle errors).
 * - Looks over errors that might occur in the state manager
 * and handles them accordingly
 */

interface SampleState {
  foo: any;
}
export function view({ args, fn }: ViewConfig) {
  return class ViewComponent extends React.Component<BaseProps, SampleState> {
    static contextType = ViewContext;
    producer: Producer;
    constructor(props: BaseProps, context: any) {
      super(props, context);
      console.log("Registered producer");
      this.producer = new Producer(
        {
          args,
          fn: this.updateData.bind(this),
        },
        context
      );
      this.state = {
        foo: null,
      };
    }
    componentDidMount() {
      this.producer.mount();
    }
    updateData(data: any) {
      this.setState(data);
    }
    render() {
      console.log("rendered with", this.state);
      return <RenderComponent state={this.state} fn={fn} />;
    }
  };
}
