"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[537],{6164:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var o=t(3289);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function u(e,n){if(null==e)return{};var t,o,r=function(e,n){if(null==e)return{};var t,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var d=o.createContext({}),l=function(e){var n=o.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},c=function(e){var n=l(e.components);return o.createElement(d.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},s=o.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,d=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),s=l(t),m=r,g=s["".concat(d,".").concat(m)]||s[m]||p[m]||i;return t?o.createElement(g,a(a({ref:n},c),{},{components:t})):o.createElement(g,a({ref:n},c))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,a=new Array(i);a[0]=s;var u={};for(var d in n)hasOwnProperty.call(n,d)&&(u[d]=n[d]);u.originalType=e,u.mdxType="string"==typeof e?e:r,a[1]=u;for(var l=2;l<i;l++)a[l]=t[l];return o.createElement.apply(null,a)}return o.createElement.apply(null,t)}s.displayName="MDXCreateElement"},9290:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},metadata:function(){return d},toc:function(){return l},default:function(){return p}});var o=t(753),r=t(1242),i=(t(3289),t(6164)),a=["components"],u={id:"engine",title:"Engine Modules",sidebar_label:"Engine Modules"},d={unversionedId:"modules/engine",id:"modules/engine",isDocsHomePage:!1,title:"Engine Modules",description:"Engine is written in an extremely modular manner. Most critical components of",source:"@site/docs/modules/engine.md",sourceDirName:"modules",slug:"/modules/engine",permalink:"/engine/docs/modules/engine",editUrl:"https://github.com/code11/engine/edit/master/docs/docs/modules/engine.md",version:"current",sidebar_label:"Engine Modules",frontMatter:{id:"engine",title:"Engine Modules",sidebar_label:"Engine Modules"},sidebar:"docs",previous:{title:"Wrapping Up",permalink:"/engine/docs/tutorials/react/wrapping-up"},next:{title:"React Module",permalink:"/engine/docs/modules/react"}},l=[{value:"<code>bootstrap: () =&gt; void | Promise&lt;void&gt;</code>",id:"bootstrap---void--promisevoid",children:[]},{value:"<code>mount: (context: ModuleContext) =&gt; void | Promise&lt;void&gt;</code>",id:"mount-context-modulecontext--void--promisevoid",children:[]},{value:"<code>unmount: (context: ModuleContext) =&gt; void | Promise&lt;void&gt;</code>",id:"unmount-context-modulecontext--void--promisevoid",children:[]}],c={toc:l};function p(e){var n=e.components,t=(0,r.Z)(e,a);return(0,i.kt)("wrapper",(0,o.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Engine is written in an extremely modular manner. Most critical components of\nEngine are written as modules, and need to be added to an engine app using\neither ",(0,i.kt)("inlineCode",{parentName:"p"},"use")," attribute of ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/engine"},"Engine Configuration"),", or using\n",(0,i.kt)("inlineCode",{parentName:"p"},"engineApp.use")," function after creation of ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/engine#use-enginemodule"},"Engine\napp"),"."),(0,i.kt)("p",null,"Modules are also responsible for how the application will produce its output,\nfor example, as a React application."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"type EngineModule = {\n  bootstrap?: () => void | Promise<void>;\n  mount: (context: ModuleContext) => void | Promise<void>;\n  unmount: (context: ModuleContext) => void | Promise<void>;\n};\n")),(0,i.kt)("h3",{id:"bootstrap---void--promisevoid"},(0,i.kt)("inlineCode",{parentName:"h3"},"bootstrap: () => void | Promise<void>")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"bootstrap")," function gets called when the engine instance itself is bootstrapping."),(0,i.kt)("h3",{id:"mount-context-modulecontext--void--promisevoid"},(0,i.kt)("inlineCode",{parentName:"h3"},"mount: (context: ModuleContext) => void | Promise<void>")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"mount")," gets called as the engine instance starts. This function receives\n",(0,i.kt)("inlineCode",{parentName:"p"},"context")," object, which can be used to add or remove\n",(0,i.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producers")," from the Engine app."),(0,i.kt)("h3",{id:"unmount-context-modulecontext--void--promisevoid"},(0,i.kt)("inlineCode",{parentName:"h3"},"unmount: (context: ModuleContext) => void | Promise<void>")),(0,i.kt)("p",null,"Same as ",(0,i.kt)("inlineCode",{parentName:"p"},"mount"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"unmount")," gets called as Engine app is un-mounting."))}p.isMDXComponent=!0}}]);