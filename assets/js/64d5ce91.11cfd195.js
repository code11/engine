"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7415],{6164:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var r=t(3289);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=r.createContext({}),l=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=l(e.components);return r.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=l(t),m=o,f=d["".concat(s,".").concat(m)]||d[m]||u[m]||a;return t?r.createElement(f,i(i({ref:n},p),{},{components:t})):r.createElement(f,i({ref:n},p))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var c={};for(var s in n)hasOwnProperty.call(n,s)&&(c[s]=n[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=t[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2744:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return s},default:function(){return m},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return u}});var r=t(4489),o=t(2790),a=(t(3289),t(6164)),i=["components"],c={id:"introducing-producers",title:"Introducing Producers",sidebar_label:"Producers"},s=void 0,l={unversionedId:"tutorials/react/introducing-producers",id:"tutorials/react/introducing-producers",title:"Introducing Producers",description:"producers are the central concept of Engine. Engine",source:"@site/docs/tutorials/react/introducing-producers.md",sourceDirName:"tutorials/react",slug:"/tutorials/react/introducing-producers",permalink:"/engine/docs/tutorials/react/introducing-producers",draft:!1,editUrl:"https://github.com/code11/engine/edit/master/docs/docs/tutorials/react/introducing-producers.md",tags:[],version:"current",frontMatter:{id:"introducing-producers",title:"Introducing Producers",sidebar_label:"Producers"},sidebar:"docs",previous:{title:"Updating State",permalink:"/engine/docs/tutorials/react/updating-state-from-components"},next:{title:"State as Communication Channel",permalink:"/engine/docs/tutorials/react/state-as-communication-channel"}},p={},u=[],d={toc:u};function m(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producer"),"s are the central concept of Engine. Engine\nrecommends that our components should only represent the view, and have as\nlittle logic as possible. Producers are where the logic lives in an Engine app."),(0,a.kt)("p",null,"Simplest place to see producers in action can be Todo list's footer. A producer\nwill count the number of pending todos, and show them in the view. Extract\n",(0,a.kt)("inlineCode",{parentName:"p"},"Footer")," out of ",(0,a.kt)("inlineCode",{parentName:"p"},"src/App.tsx")," into its own component. Create ",(0,a.kt)("inlineCode",{parentName:"p"},"src/Footer.tsx"),"\nwith following contents:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},'const Footer = () => (\n  <footer className="footer">\n    <span className="todo-count">\n      <strong>1</strong> items left\n    </span>\n    <ul className="filters">\n      <li>\n        <a href="#/" className="selected">\n          All\n        </a>\n      </li>\n      <li>\n        <a href="#/active">Active</a>\n      </li>\n      <li>\n        <a href="#/completed">Completed</a>\n      </li>\n    </ul>\n    <button className="clear-completed">Clear completed</button>\n  </footer>\n);\n\nexport default Footer;\n')),(0,a.kt)("p",null,"Update ",(0,a.kt)("inlineCode",{parentName:"p"},"src/App.tsx")," to use ",(0,a.kt)("inlineCode",{parentName:"p"},"Footer"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-diff"},'+ import Footer from "./Footer";\n...\n-    <footer className="footer">\n-      <span className="todo-count">\n-        <strong>1</strong> items left\n-      </span>\n-      <ul className="filters">\n-        <li>\n-          <a href="#/" className="selected">\n-            All\n-          </a>\n-        </li>\n-        <li>\n-          <a href="#/active">Active</a>\n-        </li>\n-        <li>\n-          <a href="#/completed">Completed</a>\n-        </li>\n-      </ul>\n-      <button className="clear-completed">Clear completed</button>{" "}\n-    </footer>\n+    <Footer />\n')),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Footer")," will trust that ",(0,a.kt)("inlineCode",{parentName:"p"},"pendingCount")," is going to be available in the state,\nand that ",(0,a.kt)("inlineCode",{parentName:"p"},"it'll always contain the correct number of pending todo items. Update "),"src/Footer.tsx` based on this assumption:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-diff"},'- const Footer = () => (\n+ const Footer: view = ({ pendingCount = observe.pendingCount }) => (\n  <footer className="footer">\n    <span className="todo-count">\n-     <strong>1</strong> items left\n+     <strong>{pendingCount}</strong> items left\n    </span>\n    <ul className="filters">\n')),(0,a.kt)("p",null,"The logic for counting pending items in the ",(0,a.kt)("inlineCode",{parentName:"p"},"Footer")," itself, in fact, in a\ntraditional React app that's exactly what we would have done. But Engine\nstrongly recommends that business logic should be kept out of ",(0,a.kt)("inlineCode",{parentName:"p"},"view"),"s, and put\nit in ",(0,a.kt)("inlineCode",{parentName:"p"},"producer"),"s. Add a ",(0,a.kt)("inlineCode",{parentName:"p"},"producer")," to the Footer. In ",(0,a.kt)("inlineCode",{parentName:"p"},"src/Footer.tsx"),", add\n",(0,a.kt)("inlineCode",{parentName:"p"},"pendingCounter")," producer:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-diff"},"+ const pendingCounter: producer = ({\n+   updatePendingCount = update.pendingCount,\n+   todosById = observe.todosById\n+ }) => {\n+   const pendingCount = Object.values(\n+     todosById as TodosById\n+   ).reduce(\n+     (accum: number, todo) =>\n+       todo.status === TodoStatuses.done ? accum : accum + 1,\n+     0\n+   );\n+\n+   updatePendingCount.set(pendingCount);\n+ };\n+\n+ Footer.producers([pendingCounter]);\n\nexport default Footer;\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"producer"),"s are just normal functions which are labeled with\n",(0,a.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producer")," macro. They can access the state the same way as\n",(0,a.kt)("inlineCode",{parentName:"p"},"view"),"s; they even have access to ",(0,a.kt)("inlineCode",{parentName:"p"},"prop"),"s that a view might get from its parent."),(0,a.kt)("p",null,"To add a producer to a component, ",(0,a.kt)("inlineCode",{parentName:"p"},".producers")," property of a view is given an\narray of producers."),(0,a.kt)("p",null,"Similar to ",(0,a.kt)("inlineCode",{parentName:"p"},"view"),"s, a producer is triggered whenever anything that it ",(0,a.kt)("inlineCode",{parentName:"p"},"observe"),"s\nchanges. ",(0,a.kt)("inlineCode",{parentName:"p"},"pendingCounter")," producer Observes ",(0,a.kt)("inlineCode",{parentName:"p"},"todosById")," object, so whenever\nanything in todosById changes, this producer is executed. Whenever status of any\ntodo item is updated, ",(0,a.kt)("inlineCode",{parentName:"p"},"pendingCount")," gets updated accordingly."),(0,a.kt)("p",null,"In the next chapter, we'll take a look at how producers make it possible to a\nvery create workflow for view <-> producer communication."))}m.isMDXComponent=!0}}]);