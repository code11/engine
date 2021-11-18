"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[743],{6164:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(3289);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=s(n),m=r,g=u["".concat(p,".").concat(m)]||u[m]||d[m]||i;return n?a.createElement(g,o(o({ref:t},c),{},{components:n})):a.createElement(g,o({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},4732:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},metadata:function(){return p},toc:function(){return s},default:function(){return d}});var a=n(753),r=n(1242),i=(n(3289),n(6164)),o=["components"],l={id:"get",title:"get",sidebar_label:"get"},p={unversionedId:"api/get",id:"api/get",isDocsHomePage:!1,title:"get",description:"Overview",source:"@site/docs/api/get.md",sourceDirName:"api",slug:"/api/get",permalink:"/engine/docs/api/get",editUrl:"https://github.com/code11/engine/edit/master/docs/docs/api/get.md",version:"current",sidebar_label:"get",frontMatter:{id:"get",title:"get",sidebar_label:"get"},sidebar:"docs",previous:{title:"observe",permalink:"/engine/docs/api/observe"},next:{title:"update",permalink:"/engine/docs/api/update"}},s=[{value:"Overview",id:"overview",children:[]},{value:"API",id:"api",children:[]},{value:"Example",id:"example",children:[]}],c={toc:s};function d(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"overview"},"Overview"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"get")," provides the ability to get values from the global state at a later time,\nafter the ",(0,i.kt)("inlineCode",{parentName:"p"},"view")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"producer")," was triggered. It works the same way as\n",(0,i.kt)("a",{parentName:"p",href:"/docs/api/observe"},"observe"),", except:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"get")," don't provide a value, but instead an api for that path which can be used at\nany time in future to get the latest value form state"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"get")," don't cause ",(0,i.kt)("inlineCode",{parentName:"li"},"view"),"s and ",(0,i.kt)("inlineCode",{parentName:"li"},"producer"),"s to get triggered")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"get")," is ideal when:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"A value is needed to do a computation in a ",(0,i.kt)("inlineCode",{parentName:"li"},"producer"),", but the producer\nshould not get triggered when this value changes"),(0,i.kt)("li",{parentName:"ol"},"A value is needed at a later time since producer was triggered, e.g while\nperforming an asynchronous operation")),(0,i.kt)("h2",{id:"api"},"API"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"get.<path>")," returns an object with following properties:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".value(params?: object)")," returns the date stored at that ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>"),(0,i.kt)("inlineCode",{parentName:"li"},"params")," is an optional object argument, the keys of which set the\n",(0,i.kt)("a",{parentName:"li",href:"/docs/api/param"},"param"),"s."),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".includes(value: any, params?: object)")," if the value at the given\n",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")," is an array or a string, it returns a boolean if the provided\n",(0,i.kt)("inlineCode",{parentName:"li"},"value")," exists at that ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},".length(params?: object)")," if the value at the given ",(0,i.kt)("inlineCode",{parentName:"li"},"<path>")," is an ",(0,i.kt)("inlineCode",{parentName:"li"},"array"),",a ",(0,i.kt)("inlineCode",{parentName:"li"},"string"),", or a ",(0,i.kt)("inlineCode",{parentName:"li"},"function")," it returns the length property")),(0,i.kt)("p",null,"For the ",(0,i.kt)("inlineCode",{parentName:"p"},"value")," getter method, if the stored data is serializable (e.g a primitive\nJavascript type, a plain object), a copy of the data is returned. However, if\nthe data is not serializable (e.g a class instance, function etc), a reference\nto it is returned."),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("p",null,"For example, if the state looks like:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "foo": {\n    "bar": "baz"\n  }\n}\n')),(0,i.kt)("p",null,"The value of ",(0,i.kt)("inlineCode",{parentName:"p"},"bar")," can be accessed by assigning ",(0,i.kt)("inlineCode",{parentName:"p"},"get.foo.bar")," in header of a\n",(0,i.kt)("a",{parentName:"p",href:"/docs/api/view"},"view")," or ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producer"),", and calling it later\ne.g"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"const doSomeWork: producer = ({ getBar = get.foo.bar }) => {\n  const var = getBar.value(); // provides lates value of bar, and does not trigger if bar ever changes\n}\n")),(0,i.kt)("p",null,"Whenever a value accessed with ",(0,i.kt)("inlineCode",{parentName:"p"},"get")," in state is changed (e.g with\n",(0,i.kt)("a",{parentName:"p",href:"/docs/api/update"},"update"),"), the view or producer using it is ",(0,i.kt)("strong",{parentName:"p"},"not")," re-triggered."))}d.isMDXComponent=!0}}]);