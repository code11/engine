"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2589],{3400:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return u}});var o=n(6054);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=o.createContext({}),p=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},c=function(e){var t=p(e.components);return o.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=p(n),u=a,g=m["".concat(l,".").concat(u)]||m[u]||d[u]||i;return n?o.createElement(g,r(r({ref:t},c),{},{components:n})):o.createElement(g,r({ref:t},c))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,r=new Array(i);r[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,r[1]=s;for(var p=2;p<i;p++)r[p]=n[p];return o.createElement.apply(null,r)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8266:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return u},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return d}});var o=n(33),a=n(3220),i=(n(6054),n(3400)),r=["components"],s={id:"accessing-state-in-components",title:"Accessing State in Components",sidebar_label:"Accessing State"},l=void 0,p={unversionedId:"tutorials/react/accessing-state-in-components",id:"tutorials/react/accessing-state-in-components",title:"Accessing State in Components",description:"Converting a React Component to Engine view allow accessing",source:"@site/docs/tutorials/react/accessing-state-in-components.md",sourceDirName:"tutorials/react",slug:"/tutorials/react/accessing-state-in-components",permalink:"/engine/docs/tutorials/react/accessing-state-in-components",draft:!1,editUrl:"https://github.com/code11/engine/edit/master/docs/docs/tutorials/react/accessing-state-in-components.md",tags:[],version:"current",frontMatter:{id:"accessing-state-in-components",title:"Accessing State in Components",sidebar_label:"Accessing State"},sidebar:"docs",previous:{title:"State is King",permalink:"/engine/docs/tutorials/react/state-is-king"},next:{title:"Updating State",permalink:"/engine/docs/tutorials/react/updating-state-from-components"}},c={},d=[],m={toc:d};function u(e){var t=e.components,n=(0,a.Z)(e,r);return(0,i.kt)("wrapper",(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Converting a React Component to Engine ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/view"},"view")," allow accessing\ntodos from state In ",(0,i.kt)("inlineCode",{parentName:"p"},"src/App.tsx"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-diff"},'- const App = () => (\n+ const App: view = ({ todoIds = observe.visibleTodoIds }) => (\n  <section className="todoapp">\n+     {console.log("TODOS", todoIds)}\n')),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"App")," component is labeled as a ",(0,i.kt)("inlineCode",{parentName:"li"},"view")),(0,i.kt)("li",{parentName:"ol"},"In ",(0,i.kt)("inlineCode",{parentName:"li"},"App"),"'s header, ",(0,i.kt)("inlineCode",{parentName:"li"},"observe.visibileTodoIds")," allow reading ",(0,i.kt)("inlineCode",{parentName:"li"},"State.visibileTodoIds"))),(0,i.kt)("p",null,"Todos ids from state can be seen printed in console! Engine allow observing any\npart of the state by assigning it as ",(0,i.kt)("inlineCode",{parentName:"p"},"observe.<path>")," in header of a ",(0,i.kt)("inlineCode",{parentName:"p"},"view"),".\nAll engine operator types are available globally. Check them out in ",(0,i.kt)("inlineCode",{parentName:"p"},"global.ts"),"."),(0,i.kt)("p",null,"Extract the ",(0,i.kt)("inlineCode",{parentName:"p"},"<Todo>")," component out of",(0,i.kt)("inlineCode",{parentName:"p"},"<App>")," to easily ",(0,i.kt)("inlineCode",{parentName:"p"},"map")," todo ids to",(0,i.kt)("inlineCode",{parentName:"p"},"Todo"),"\ncomponents, and put it in its own file. In ",(0,i.kt)("inlineCode",{parentName:"p"},"src/Todo.tsx"),", add"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},'const Todo = ({ id }) => (\n  <li>\n    <div className="view">\n      <input className="toggle" type="checkbox" />\n      <label>{id}</label>\n      <button className="destroy" />\n    </div>\n  </li>\n);\n\nexport default Todo;\n')),(0,i.kt)("p",null,"Update the ",(0,i.kt)("inlineCode",{parentName:"p"},"App")," component with:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-diff"},'+ import Todo from \'./Todo\';\n...\n      <ul className="todo-list">\n-       <li>\n-         <div className="view">\n-           <input className="toggle" type="checkbox" />\n-           <label>Give life to my TODOs</label>\n-           <button className="destroy" />\n-         </div>\n-       </li>\n+       {todoIds.map((id: string) => (\n+         <Todo id={id} key={id} />\n+       ))}\n      </ul>\n')),(0,i.kt)("p",null,"As per the implementation of",(0,i.kt)("inlineCode",{parentName:"p"},"Todo"),", it is possible to see todo ids(i.e",(0,i.kt)("inlineCode",{parentName:"p"},"todo1"),",\n",(0,i.kt)("inlineCode",{parentName:"p"},"todo2"),") in browser. But it should actually show",(0,i.kt)("inlineCode",{parentName:"p"},"TodoItem.title"),", not their\nid."),(0,i.kt)("p",null,"This is where Engine differs from traditional React apps. Engine recommends that\n","[parent component should pass minimal data to its children]","(docs / best -\npractices#pass - minimal - data - to - children). Minimum amount of data needed\nto render a ",(0,i.kt)("inlineCode",{parentName:"p"},"Todo")," is its ",(0,i.kt)("inlineCode",{parentName:"p"},"id"),". Right todo can be retrieved from global state\nwith its id. Modify the ",(0,i.kt)("inlineCode",{parentName:"p"},"Todo")," component to follow the Engine way:"),(0,i.kt)("p",null,"In",(0,i.kt)("inlineCode",{parentName:"p"},"src/Todo.tsx")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-diff"},'- const Todo = ({ id }) => (\n+ const Todo: view = ({ title = observe.todosById[prop.id].title }) => (\n<li>\n  <div className="view">\n    <input className="toggle" type="checkbox" />\n-     <label>{id}</label>\n+     <label>{title}</label>\n    <button className="destroy" />\n  </div>\n</li>\n);\n')),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"Todo")," is converted to a ",(0,i.kt)("a",{parentName:"li",href:"/docs/api/view"},"view")," (by labeling it with ",(0,i.kt)("inlineCode",{parentName:"li"},"view")," macro)"),(0,i.kt)("li",{parentName:"ol"},"Assigning ",(0,i.kt)("inlineCode",{parentName:"li"},"title")," to ",(0,i.kt)("inlineCode",{parentName:"li"},"observe.todosById[prop.id].title")," in view header gives\naccess to the title of a todo from the global state")),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/docs/api/prop"},"prop")," allow ",(0,i.kt)("a",{parentName:"p",href:"/docs/concepts/path-composition"},"composing\npaths")," for accessing data from global\nstate. ",(0,i.kt)("inlineCode",{parentName:"p"},"prop.<path>")," gives access to all the ",(0,i.kt)("a",{parentName:"p",href:"https://reactjs.org/docs/components-and-props.html"},"React\nprops")," passed to a component\nby its parent."),(0,i.kt)("p",null,"Every ",(0,i.kt)("inlineCode",{parentName:"p"},"view")," in Engine can access any data path from Engine's global state.\nTrick is getting the right thing. The input macros help achieving clever ways of\n",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"/docs/concepts/path-composition"},"path composition"))," to get the\nright data into views."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"observe.todosById[prop.id].title")," tells Engine to look-up a todo with ",(0,i.kt)("inlineCode",{parentName:"p"},"prop.id"),"\nin ",(0,i.kt)("inlineCode",{parentName:"p"},"todosById")," object of the global state, and observe its ",(0,i.kt)("inlineCode",{parentName:"p"},"title")," property. This\ngives read-only access to ",(0,i.kt)("inlineCode",{parentName:"p"},"title"),"."),(0,i.kt)("p",null,"This also ensures that the view gets re-rendered whenever ",(0,i.kt)("inlineCode",{parentName:"p"},"title")," property of\ntodo with id ",(0,i.kt)("inlineCode",{parentName:"p"},"prop.id")," changes. Any other changes that happen in the state, even\nin the todo itself will not affect the view."))}u.isMDXComponent=!0}}]);