"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8005],{3376:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>r,toc:()=>d});var s=n(7250),o=n(9596);const a={id:"state",title:"State",sidebar_label:"State"},i=void 0,r={id:"concepts/state",title:"State",description:"Purpose of every software is to solve some real world problem. Data used to",source:"@site/docs/concepts/state.md",sourceDirName:"concepts",slug:"/concepts/state",permalink:"/engine/docs/concepts/state",draft:!1,unlisted:!1,editUrl:"https://github.com/code11/engine/edit/master/docs/docs/concepts/state.md",tags:[],version:"current",frontMatter:{id:"state",title:"State",sidebar_label:"State"},sidebar:"docs",previous:{title:"Best Practices",permalink:"/engine/docs/best-practices"},next:{title:"Path Composition",permalink:"/engine/docs/concepts/path-composition"}},c={},d=[{value:"Shape of State",id:"shape-of-state",level:2},{value:"Initial state",id:"initial-state",level:2},{value:"State as a communication channel",id:"state-as-a-communication-channel",level:2}];function l(e){const t={a:"a",code:"code",em:"em",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(t.p,{children:["Purpose of every software is to solve some real world problem. Data used to\nrepresent the objects involved in the problem and the solution, are sometimes\ncalled ",(0,s.jsx)(t.strong,{children:"Domain Objects"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["Every UI is just a representation of some data. Its purpose is to show this\ndata, and enable the user to intuitively make sense of, and change it. This data\nthat UI stores, operates on and represents, is called its ",(0,s.jsx)(t.strong,{children:"State"}),". A part of\nthe state is made up of Domain objects, and is refereed to as ",(0,s.jsx)(t.strong,{children:"essential\nstate"}),". Rest of the state is needed by the UI itself, and is called\n",(0,s.jsx)(t.strong,{children:"incidental state"}),'. e.g storage of Todo items in a todo app is essential\nstate; data like which filter is active makes the incidental (also sometimes\ncalled "accidental") state.']}),"\n",(0,s.jsx)(t.p,{children:"Engine strongly recommends keeping a single source of truth for an application's\nstate. State of the app when it has just started up (aka initial state) can be\ngiven when it is instantiated:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-diff",children:'import { engine } from "@c11/engine.runtime";\n\nconst app = engine({\n  state: {\n    initial: { }\n  },\n  view: {\n    element: <App />,\n    root: "#root"\n  }\n});\n\napp.start()\n'})}),"\n",(0,s.jsx)(t.h2,{id:"shape-of-state",children:"Shape of State"}),"\n",(0,s.jsxs)(t.p,{children:["Careful consideration must be given for what the shape of the state is going to\nbe. Engine recommends storing our domain objects in some sort of indexed data\nstructure (e.g an ",(0,s.jsx)(t.code,{children:"Object"}),"), which allow instant access to any domain object\nusing just its identifier. Through ",(0,s.jsx)(t.a,{href:"/docs/concepts/path-composition",children:"path\ncomposition"}),", Engine provides a unique way to\nvery efficiently utilize such structure."]}),"\n",(0,s.jsx)(t.p,{children:"Domain objects often cross boundaries of different components of a software\nproduct. For example, going from database to a backend application, to a\nserialized form for network transfer (e.g JSON), to UIs. It is advisable to keep\nthem in a consistent representation across different components of our system.\nDoing so builds intuition and confidence in the system."}),"\n",(0,s.jsx)(t.h2,{id:"initial-state",children:"Initial state"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.em,{children:"Initial state"})," is the state with which an application is going to start.\nUsually we define some defaults for many of our state data in initial state."]}),"\n",(0,s.jsx)(t.h2,{id:"state-as-a-communication-channel",children:"State as a communication channel"}),"\n",(0,s.jsx)(t.p,{children:"Engine producers work in complete isolation, and cannot communicate with each\nother. Only way for two producers to talk to each other is through state. For\nexample, when producers need to share references (to streams, XHR objects, DOM\nnodes etc)."})]})}function p(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},9596:(e,t,n)=>{n.d(t,{R:()=>i,x:()=>r});var s=n(7402);const o={},a=s.createContext(o);function i(e){const t=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),s.createElement(a.Provider,{value:t},e.children)}}}]);