import React from "react";
import { engine } from "@c11/engine";
import { renderReact } from "@c11/engine.react";
import { generateImage } from "jsdom-screenshot";
import { ViewFn } from "@c11/engine.react";

type testViewProps = {
  name: string;
  state: {
    [k: string]: any;
  };
  view: ViewFn;
  props: {
    [k: string]: any;
  };
};

export const testView = async ({ name, state, view, props }: testViewProps) => {
  test(name, async () => {
    jest.useFakeTimers();
    const root = document.createElement("div");
    const title = document.createElement("h1");
    title.innerHTML = name;

    document.body.innerHTML = "";
    document.body.appendChild(title);
    document.body.appendChild(root);
    const View = view;

    engine({
      state,
      use: [renderReact(<View {...props} />, root)],
    }).start();

    jest.runAllTimers();

    const screenshot = await generateImage();
    //@ts-ignore
    expect(screenshot).toMatchImageSnapshot();

    jest.useRealTimers();
  });
};
