import React from "react";
import shortid from "shortid";
import ViewContext from "./context";
import { BaseProps, BaseState } from "./types";
import {
  ProducerFn,
  ViewConfig,
  ViewInstance,
  StructOperation,
} from "@c11/engine.types";
import type { ProducerInstance, ProducerData } from "@c11/engine.types";
import { RenderComponent } from "./renderComponent";
import type { RenderContext } from "./render";

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

export type ViewFn<ExternalProps = {}> = (
  props: ProducerData
) => React.ReactElement<ExternalProps> | null;

export type ViewExtra = {
  producers?: ProducerFn[];
};

export type View<ExternalProps = {}> = ViewFn<ExternalProps> & ViewExtra;

export function view({ props, fn, meta }: ViewConfig) {
  return class ViewComponent extends React.Component<BaseProps, SampleState> {
    static contextType = ViewContext;
    isComponentMounted: boolean = false;
    viewProps: StructOperation;
    producers: ProducerInstance[];
    isStateReady = false;
    ref: any;
    instance: ViewInstance;
    constructor(externalProps: BaseProps, context: RenderContext) {
      super(externalProps, context);
      const viewContext = {
        props: externalProps,
        keepReferences: ["external.children"],
        ...context.config,
      };
      this.viewProps = props;
      this.ref = React.createRef();
      const viewProducer = {
        props,
        fn: this.updateData.bind(this),
        meta,
      };
      this.producers = [context.module.addProducer(viewProducer, viewContext)];
      const producers = (this.constructor as any).producers || [];
      producers.forEach((x: any) => {
        this.producers.push(context.module.addProducer(x, viewContext));
      });
      this.instance = {
        id: shortid.generate(),
        producers: this.producers,
      };
      // context.addView(this.instance);
      this.state = {};
    }
    componentDidMount() {
      this.isComponentMounted = true;
      this.producers.forEach((x) => x.mount());
    }
    componentWillUnmount() {
      this.isComponentMounted = false;
      this.producers.forEach((x) => x.unmount());
    }
    updateData(data: any) {
      if (!this.isComponentMounted) {
        return;
      }

      this.setState({
        data,
      });

      if (!this.isStateReady) {
        this.isStateReady = true;
      }
    }
    render() {
      this.producers.forEach((x) => {
        x.updateExternal(this.props);
      });
      if (!this.isStateReady) {
        return null;
      }
      return <RenderComponent ref={this.ref} state={this.state} fn={fn} />;
    }
  };
}
