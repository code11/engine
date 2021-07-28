import { customAlphabet } from "nanoid";
import { cleanComponent } from "./cleanComponent";
import { ProducerConfig } from "@c11/engine.types";
import { join } from "../join";
import { ComponentManager } from "./ComponentManager";
import { selectorWrapper } from "./selectorWrapper";

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
  15
);

type StateProps = {
  stateId: string;
  componentId: string;
};

//TODO: allow creation of simpler components in order
//  to have the componentId space:
// const Foo = component(Bar, producers)

export const component = (
  states: {
    [k: string]: (props: StateProps) => JSX.Element;
  },
  //TODO: add proper type to match states structure
  stateSelector: ({ data }: any) => string,
  //TODO: add support for producers as object map as in
  //  import * as producers from './producers
  producers: ProducerConfig[] = []
) => {
  const Component = join(
    ComponentManager,
    selectorWrapper,
    cleanComponent,
    producers
  );

  return (props: any) => {
    //TODO: any change in props will redo the entire component
    //  which will result in recreating the states/component from
    //  scratch - this should be avoided as much as possible
    const componentId = nanoid();
    const createdAt = performance.now();

    return (
      <Component
        {...props}
        states={states}
        stateSelector={stateSelector}
        propsList={props}
        componentId={componentId}
        createdAt={createdAt}
      />
    );
  };
};
