"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6537],{6164:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return m}});var o=t(3289);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,o,r=function(e,n){if(null==e)return{};var t,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)t=i[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var u=o.createContext({}),c=function(e){var n=o.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},d=function(e){var n=c(e.components);return o.createElement(u.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},p=o.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,u=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),p=c(t),m=r,f=p["".concat(u,".").concat(m)]||p[m]||s[m]||i;return t?o.createElement(f,a(a({ref:n},d),{},{components:t})):o.createElement(f,a({ref:n},d))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,a=new Array(i);a[0]=p;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var c=2;c<i;c++)a[c]=t[c];return o.createElement.apply(null,a)}return o.createElement.apply(null,t)}p.displayName="MDXCreateElement"},1766:function(e,n,t){t.r(n),t.d(n,{assets:function(){return d},contentTitle:function(){return u},default:function(){return m},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return s}});var o=t(4489),r=t(2790),i=(t(3289),t(6164)),a=["components"],l={id:"engine",title:"Modules",sidebar_label:"Modules"},u=void 0,c={unversionedId:"modules/engine",id:"modules/engine",title:"Modules",description:"Engine is written in an extremely modular manner. Most critical components of",source:"@site/docs/modules/engine.md",sourceDirName:"modules",slug:"/modules/engine",permalink:"/engine/docs/modules/engine",draft:!1,editUrl:"https://github.com/code11/engine/edit/master/docs/docs/modules/engine.md",tags:[],version:"current",frontMatter:{id:"engine",title:"Modules",sidebar_label:"Modules"},sidebar:"docs",previous:{title:"Testing",permalink:"/engine/docs/testing"},next:{title:"@c11/engine.cli",permalink:"/engine/docs/packages/cli"}},d={},s=[{value:"<code>bootstrap: () =&gt; void | Promise&lt;void&gt;</code>",id:"bootstrap---void--promisevoid",level:3},{value:"<code>mount: (context: ModuleContext) =&gt; void | Promise&lt;void&gt;</code>",id:"mount-context-modulecontext--void--promisevoid",level:3},{value:"<code>unmount: (context: ModuleContext) =&gt; void | Promise&lt;void&gt;</code>",id:"unmount-context-modulecontext--void--promisevoid",level:3}],p={toc:s};function m(e){var n=e.components,t=(0,r.Z)(e,a);return(0,i.kt)("wrapper",(0,o.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Engine is written in an extremely modular manner. Most critical components of\nEngine are written as modules, and need to be added to an engine app using\neither ",(0,i.kt)("inlineCode",{parentName:"p"},"use")," attribute of ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/engine"},"Engine Configuration"),", or using\n",(0,i.kt)("inlineCode",{parentName:"p"},"engineApp.use")," function after creation of ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/engine#use-enginemodule"},"Engine\napp"),"."),(0,i.kt)("p",null,"Modules are also responsible for how the application will produce its output,\nfor example, as a React application."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"type EngineModule = {\n  bootstrap?: () => void | Promise<void>;\n  mount: (context: ModuleContext) => void | Promise<void>;\n  unmount: (context: ModuleContext) => void | Promise<void>;\n};\n")),(0,i.kt)("h3",{id:"bootstrap---void--promisevoid"},(0,i.kt)("inlineCode",{parentName:"h3"},"bootstrap: () => void | Promise<void>")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"bootstrap")," function gets called when the engine instance itself is bootstrapping."),(0,i.kt)("h3",{id:"mount-context-modulecontext--void--promisevoid"},(0,i.kt)("inlineCode",{parentName:"h3"},"mount: (context: ModuleContext) => void | Promise<void>")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"mount")," gets called as the engine instance starts. This function receives\n",(0,i.kt)("inlineCode",{parentName:"p"},"context")," object, which can be used to add or remove\n",(0,i.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producers")," from the Engine app."),(0,i.kt)("h3",{id:"unmount-context-modulecontext--void--promisevoid"},(0,i.kt)("inlineCode",{parentName:"h3"},"unmount: (context: ModuleContext) => void | Promise<void>")),(0,i.kt)("p",null,"Same as ",(0,i.kt)("inlineCode",{parentName:"p"},"mount"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"unmount")," gets called as Engine app is un-mounting."))}m.isMDXComponent=!0}}]);