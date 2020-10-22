(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{100:function(e,n,t){"use strict";t.d(n,"a",(function(){return u})),t.d(n,"b",(function(){return g}));var r=t(0),a=t.n(r);function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){c(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=a.a.createContext({}),s=function(e){var n=a.a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=s(e.components);return a.a.createElement(l.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},b=a.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,c=e.originalType,i=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),u=s(t),b=r,g=u["".concat(i,".").concat(b)]||u[b]||m[b]||c;return t?a.a.createElement(g,o(o({ref:n},l),{},{components:t})):a.a.createElement(g,o({ref:n},l))}));function g(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var c=t.length,i=new Array(c);i[0]=b;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var l=2;l<c;l++)i[l]=t[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,t)}b.displayName="MDXCreateElement"},81:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return i})),t.d(n,"metadata",(function(){return o})),t.d(n,"rightToc",(function(){return p})),t.d(n,"default",(function(){return s}));var r=t(2),a=t(6),c=(t(0),t(100)),i={id:"react",title:"React",sidebar_label:"React"},o={unversionedId:"implementations/react",id:"implementations/react",isDocsHomePage:!1,title:"React",description:"Package name: @c11/engine.react",source:"@site/docs/implementations/react.md",permalink:"/engine/docs/implementations/react",editUrl:"https://github.com/code11/engine/edit/master/docs/docs/implementations/react.md",sidebar_label:"React",sidebar:"docs",previous:{title:"Triggers",permalink:"/engine/docs/patterns/triggers"},next:{title:"Quick Start with React",permalink:"/engine/docs/tutorials/react/setup"}},p=[{value:"Installation",id:"installation",children:[]},{value:"Setup",id:"setup",children:[]}],l={rightToc:p};function s(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},l,t,{components:n,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("strong",{parentName:"p"},"Package name:")," ",Object(c.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/packages"}),"@c11/engine.react")),Object(c.b)("p",null,Object(c.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/api/engine"}),"Engine")," implementation for React."),Object(c.b)("h2",{id:"installation"},"Installation"),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"npm install @c11/engine.react @c11/engine.macro\n")),Object(c.b)("h2",{id:"setup"},"Setup"),Object(c.b)("pre",null,Object(c.b)("code",Object(r.a)({parentName:"pre"},{className:"language-tsx"}),"import React from 'react'\nimport { View, Producer, Observe, Update } from '@c11/engine.macro'\nimport { Engine } from '@c11/engine.react'\n\nconst App: View = ({\n  greeting = Observe.greeting\n}) => <div>{greeting}</div>\n\nconst greeting: Producer = ({\n  name = Observe.name,\n  greeting = Update.greeting\n}) => greeting.set(`Hello ${name}!`)\n\nApp.producers = [greeting]\n\nconst engine = new Engine({\n  state: {\n    name: \"John Doe\"\n  },\n  view: {\n    component: <App />,\n    root: \"#root\"\n  }\n});\n")))}s.isMDXComponent=!0}}]);