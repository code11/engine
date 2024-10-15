"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1276],{4668:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>r,contentTitle:()=>s,default:()=>u,frontMatter:()=>d,metadata:()=>c,toc:()=>l});var t=o(7250),i=o(9596);const d={id:"engine",title:"Modules",sidebar_label:"Modules"},s=void 0,c={id:"modules/engine",title:"Modules",description:"Engine is written in an extremely modular manner. Most critical components of",source:"@site/docs/modules/engine.md",sourceDirName:"modules",slug:"/modules/engine",permalink:"/engine/docs/modules/engine",draft:!1,unlisted:!1,editUrl:"https://github.com/code11/engine/edit/master/docs/docs/modules/engine.md",tags:[],version:"current",frontMatter:{id:"engine",title:"Modules",sidebar_label:"Modules"},sidebar:"docs",previous:{title:"Testing",permalink:"/engine/docs/testing"},next:{title:"@c11/engine.cli",permalink:"/engine/docs/packages/cli"}},r={},l=[{value:"<code>bootstrap: () =&gt; void | Promise&lt;void&gt;</code>",id:"bootstrap---void--promisevoid",level:3},{value:"<code>mount: (context: ModuleContext) =&gt; void | Promise&lt;void&gt;</code>",id:"mount-context-modulecontext--void--promisevoid",level:3},{value:"<code>unmount: (context: ModuleContext) =&gt; void | Promise&lt;void&gt;</code>",id:"unmount-context-modulecontext--void--promisevoid",level:3}];function a(e){const n={a:"a",code:"code",h3:"h3",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.p,{children:["Engine is written in an extremely modular manner. Most critical components of\nEngine are written as modules, and need to be added to an engine app using\neither ",(0,t.jsx)(n.code,{children:"use"})," attribute of ",(0,t.jsx)(n.a,{href:"/docs/api/engine",children:"Engine Configuration"}),", or using\n",(0,t.jsx)(n.code,{children:"engineApp.use"})," function after creation of ",(0,t.jsx)(n.a,{href:"/docs/api/engine#use-enginemodule",children:"Engine\napp"}),"."]}),"\n",(0,t.jsx)(n.p,{children:"Modules are also responsible for how the application will produce its output,\nfor example, as a React application."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"type EngineModule = {\n  bootstrap?: () => void | Promise<void>;\n  mount: (context: ModuleContext) => void | Promise<void>;\n  unmount: (context: ModuleContext) => void | Promise<void>;\n};\n"})}),"\n",(0,t.jsx)(n.h3,{id:"bootstrap---void--promisevoid",children:(0,t.jsx)(n.code,{children:"bootstrap: () => void | Promise<void>"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"bootstrap"})," function gets called when the engine instance itself is bootstrapping."]}),"\n",(0,t.jsx)(n.h3,{id:"mount-context-modulecontext--void--promisevoid",children:(0,t.jsx)(n.code,{children:"mount: (context: ModuleContext) => void | Promise<void>"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"mount"})," gets called as the engine instance starts. This function receives\n",(0,t.jsx)(n.code,{children:"context"})," object, which can be used to add or remove\n",(0,t.jsx)(n.a,{href:"/docs/api/producer",children:"producers"})," from the Engine app."]}),"\n",(0,t.jsx)(n.h3,{id:"unmount-context-modulecontext--void--promisevoid",children:(0,t.jsx)(n.code,{children:"unmount: (context: ModuleContext) => void | Promise<void>"})}),"\n",(0,t.jsxs)(n.p,{children:["Same as ",(0,t.jsx)(n.code,{children:"mount"}),", ",(0,t.jsx)(n.code,{children:"unmount"})," gets called as Engine app is un-mounting."]})]})}function u(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},9596:(e,n,o)=>{o.d(n,{R:()=>s,x:()=>c});var t=o(7402);const i={},d=t.createContext(i);function s(e){const n=t.useContext(d);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(d.Provider,{value:n},e.children)}}}]);