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

export const component = (
  states: {
    [k: string]: (props: StateProps) => JSX.Element;
  },
  //TODO: add proper type to match states structure
  stateSelector: ({ data }: any) => string,
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
    //  scratch - this should be avoided!
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
