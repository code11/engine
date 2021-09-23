"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[87],{6164:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=u(n),m=r,f=d["".concat(l,".").concat(m)]||d[m]||s[m]||i;return n?a.createElement(f,o(o({ref:t},c),{},{components:n})):a.createElement(f,o({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=d;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:r,o[1]=p;for(var u=2;u<i;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6505:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},metadata:function(){return l},toc:function(){return u},default:function(){return s}});var a=n(1629),r=n(7322),i=(n(3289),n(6164)),o=["components"],p={id:"update",title:"update",sidebar_label:"update"},l={unversionedId:"api/update",id:"api/update",isDocsHomePage:!1,title:"update",description:"Overview",source:"@site/docs/api/update.md",sourceDirName:"api",slug:"/api/update",permalink:"/engine/docs/api/update",editUrl:"https://github.com/code11/engine/edit/master/docs/docs/api/update.md",version:"current",sidebar_label:"update",frontMatter:{id:"update",title:"update",sidebar_label:"update"},sidebar:"docs",previous:{title:"get",permalink:"/engine/docs/api/get"},next:{title:"prop",permalink:"/engine/docs/api/prop"}},u=[{value:"Overview",id:"overview",children:[]},{value:"API",id:"api",children:[]},{value:"Example",id:"example",children:[]}],c={toc:u};function s(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"overview"},"Overview"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"update")," provides the ability to update values in the global state. ",(0,i.kt)("inlineCode",{parentName:"p"},"update")," is\nthe dual of ",(0,i.kt)("inlineCode",{parentName:"p"},"observe"),". ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/observe"},"observe")," enables reading live values\nfrom state, ",(0,i.kt)("inlineCode",{parentName:"p"},"update")," allows changing values in state."),(0,i.kt)("h2",{id:"api"},"API"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"update.<path>")," returns an object with following properties:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".set(value: any, params?: object)")," to replace the value of ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")," in\nstate, or create it if it doesn't exist yet. ",(0,i.kt)("inlineCode",{parentName:"li"},"params")," is an optional\nobject argument, the keys of which set the ",(0,i.kt)("a",{parentName:"li",href:"/docs/api/param"},"param"),"s."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".merge(value: any, params?: object)")," accepts an object, and merge it with existing object value\nof ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")," in state"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".remove(params?: object)")," removes the ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")," from state"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".push(value: any, params?: object)")," if the value at the given ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")," is an array, then the value will be appened to the array"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".pop(params?: object)")," if the value at the given ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")," is an array, then the last element will be removed")),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("p",null,"If the state looks like:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "foo": {\n    "bar": "baz"\n  }\n}\n')),(0,i.kt)("p",null,"Operations to change the value of ",(0,i.kt)("inlineCode",{parentName:"p"},"bar")," can be obtained by assigning\n",(0,i.kt)("inlineCode",{parentName:"p"},"update.foo.bar")," in the header of a ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/view"},"view"),". e.g"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const MyComponent: producer = ({ bar = update.foo.bar }) => {\n  bar.set('qux');\n  ...\n}\n")))}s.isMDXComponent=!0}}]);