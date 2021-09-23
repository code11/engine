"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[929],{6164:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(3289);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=d(n),m=a,h=s["".concat(c,".").concat(m)]||s[m]||u[m]||i;return n?r.createElement(h,o(o({ref:t},p),{},{components:n})):r.createElement(h,o({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var d=2;d<i;d++)o[d]=n[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},9948:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},metadata:function(){return c},toc:function(){return d},default:function(){return u}});var r=n(1629),a=n(7322),i=(n(3289),n(6164)),o=["components"],l={id:"wildcard",title:"wildcard",sidebar_label:"wildcard"},c={unversionedId:"api/wildcard",id:"api/wildcard",isDocsHomePage:!1,title:"wildcard",description:"`ts",source:"@site/docs/api/wildcard.md",sourceDirName:"api",slug:"/api/wildcard",permalink:"/engine/docs/api/wildcard",editUrl:"https://github.com/code11/engine/edit/master/docs/docs/api/wildcard.md",version:"current",sidebar_label:"wildcard",frontMatter:{id:"wildcard",title:"wildcard",sidebar_label:"wildcard"},sidebar:"docs",previous:{title:"param",permalink:"/engine/docs/api/param"},next:{title:"path",permalink:"/engine/docs/api/path"}},d=[{value:"Overview",id:"overview",children:[]},{value:"Example",id:"example",children:[{value:"What changed?",id:"what-changed",children:[]}]}],p={toc:d};function u(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'import { wildcard } from "@c11/engine.runtime"\n')),(0,i.kt)("h2",{id:"overview"},"Overview"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"wildcard")," allow selecting arbitrarily deep paths from state."),(0,i.kt)("p",null,"They are meant to be used by ",(0,i.kt)("inlineCode",{parentName:"p"},"producer")," to obtain more powerful triggers."),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("p",null,"For example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"cons titleWatchProducer: producer = ({\n  title = observe.todos[wildcard].title\n}) => { ... }\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"titleWatchProducer")," will re-run whenever any todo's title changes."),(0,i.kt)("h3",{id:"what-changed"},"What changed?"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"wildcard")," triggers producer whenever anything on the matching path changes, but\n",(0,i.kt)("inlineCode",{parentName:"p"},"producer")," won't know what exactly has changed. To get information about exactly\nwhat has changed, ",(0,i.kt)("inlineCode",{parentName:"p"},"wildcard")," can be assigned to another\n",(0,i.kt)("a",{parentName:"p",href:"/docs/api/arg"},"arg"),", to get information about exactly which path\nhas received the change. For example,"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"const prod: producer = ({\n  id = wildcard,\n  title = observe.todos[arg.id].title\n}) => { ... }\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"id")," will contain the changed todo's ID."),(0,i.kt)("p",null,"Assign the ",(0,i.kt)("inlineCode",{parentName:"p"},"wildcard")," to an ",(0,i.kt)("inlineCode",{parentName:"p"},"arg")," is also the only way to use ",(0,i.kt)("inlineCode",{parentName:"p"},"wildcard")," with\n",(0,i.kt)("inlineCode",{parentName:"p"},"update")," operator. Only ",(0,i.kt)("inlineCode",{parentName:"p"},"observe")," can make use of ",(0,i.kt)("inlineCode",{parentName:"p"},"wildcard")," directly in its\npath."))}u.isMDXComponent=!0}}]);