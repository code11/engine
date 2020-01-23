import React from "react";
import ViewContext from "./context";
import { BaseProps, BaseState } from "./types";
import { ViewConfig, StructOperation } from "@c11/engine-types";
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

interface SampleState {}
export function view({ args, fn }: ViewConfig) {
  return class ViewComponent extends React.Component<BaseProps, SampleState> {
    static contextType = ViewContext;
    args: StructOperation;
    producer: Producer;
    constructor(props: BaseProps, context: any) {
      super(props, context);
      context.props = props;
      this.args = args;
      this.producer = new Producer(
        {
          args,
          fn: this.updateData.bind(this),
        },
        context
      );
      this.state = {};
    }
    componentDidMount() {
      this.producer.mount();
    }
    updateData(newData: any) {
      const data = this.args.meta.order.reduce((acc: any, x: any) => {
        acc[x] = newData[x];
        return acc;
      }, {});
      this.setState(data);
    }
    render() {
      return <RenderComponent state={this.state} fn={fn} />;
    }
  };
}
