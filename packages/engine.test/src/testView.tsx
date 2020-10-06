import React from 'react';
import { Engine } from "@c11/engine.react";
import { generateImage } from 'jsdom-screenshot';

jest.useFakeTimers();

export async function testView(name: string, { state, View, props }) {
    test(name, async () => {
        const root = document.createElement("div")
        const title = document.createElement("h1")
        title.innerHTML = name
        
        document.body.innerHTML = ""
        document.body.appendChild(title)
        document.body.appendChild(root)
      
        const engine = new Engine({
          state: {
              initial: state
          },
          view: {
            element: <View
              {...props}
            />,
            root
          },
        });
      
        jest.runAllTimers();
      
        const screenshot = await generateImage();
        expect(screenshot).toMatchImageSnapshot();
    })
}