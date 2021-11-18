"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[424],{6164:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return d}});var a=n(3289);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),u=c(n),d=o,h=u["".concat(s,".").concat(d)]||u[d]||m[d]||r;return n?a.createElement(h,i(i({ref:t},l),{},{components:n})):a.createElement(h,i({ref:t},l))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=u;var p={};for(var s in t)hasOwnProperty.call(t,s)&&(p[s]=t[s]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var c=2;c<r;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},4354:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},metadata:function(){return s},toc:function(){return c},default:function(){return m}});var a=n(753),o=n(1242),r=(n(3289),n(6164)),i=["components"],p={id:"path-composition",title:"Path Composition",sidebar_label:"Path Composition"},s={unversionedId:"concepts/path-composition",id:"concepts/path-composition",isDocsHomePage:!1,title:"Path Composition",description:'"Path" is the location of a property in state. e.g if the state looks like:',source:"@site/docs/concepts/path-composition.md",sourceDirName:"concepts",slug:"/concepts/path-composition",permalink:"/engine/docs/concepts/path-composition",editUrl:"https://github.com/code11/engine/edit/master/docs/docs/concepts/path-composition.md",version:"current",sidebar_label:"Path Composition",frontMatter:{id:"path-composition",title:"Path Composition",sidebar_label:"Path Composition"},sidebar:"docs",previous:{title:"State",permalink:"/engine/docs/concepts/state"},next:{title:"Packages",permalink:"/engine/docs/packages"}},c=[],l={toc:c};function m(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,'"Path" is the location of a property in state. e.g if the state looks like:'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const State = {\n  foo: {\n    bar: {\n      baz: "BAZZZ!"\n    }\n  }\n}\n')),(0,r.kt)("p",null,"Then path for ",(0,r.kt)("inlineCode",{parentName:"p"},"baz")," is ",(0,r.kt)("inlineCode",{parentName:"p"},".foo.bar.baz"),"."),(0,r.kt)("p",null,"Path composition is creating new paths by combining smaller paths. It sounds\nsimple, because it is. It is also one of the most important (and occasionally\nconfusing) aspects of building applications with Engine."),(0,r.kt)("p",null,"Conceptually, Paths can be static or dynamic. A path can be considered static\nwhen you know exactly where the data you're interested in is. e.g ",(0,r.kt)("inlineCode",{parentName:"p"},".foo.bar.baz"),"\nin example above."),(0,r.kt)("p",null,"A path is dynamic when its exact location is known at runtime, and is calculated\nat runtime depending on runtime values like props given to the view, data from\nthe state (e.g. an might store a ",(0,r.kt)("inlineCode",{parentName:"p"},"selectedId")," in state), or local variables."),(0,r.kt)("p",null,"Engine provides following path composition operators for creating paths, and\ncomposing them together:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/prop"},"prop")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/arg"},"arg")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/param"},"param")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/wildcard"},"wildcard")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("a",{parentName:"li",href:"/docs/api/path"},"path"))),(0,r.kt)("p",null,"Paths composed using these operators can be used with all 3 state manipulation\noperators i.e with ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/observe"},"observe"),", ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/get"},"get")," and\n",(0,r.kt)("a",{parentName:"p",href:"/docs/api/update"},"update")),(0,r.kt)("p",null,"All Engine path composition operators (",(0,r.kt)("a",{parentName:"p",href:"/docs/api/arg"},"arg"),",\n",(0,r.kt)("a",{parentName:"p",href:"/docs/api/get"},"get"),", ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/prop"},"prop"),", ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/param"},"param"),",\n",(0,r.kt)("a",{parentName:"p",href:"/docs/api/update"},"update"),", ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/observe"},"observe"),") can be given any\narbitrarily nested path (e.g ",(0,r.kt)("inlineCode",{parentName:"p"},"arg.b1.b2.b3"),") regardless of whether the given\npath exists in state or not. Engine won't throw an error if an invalid path is\ngiven to these operators."))}m.isMDXComponent=!0}}]);