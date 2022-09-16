"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1866],{6164:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var r=n(3289);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(n),f=a,m=d["".concat(s,".").concat(f)]||d[f]||u[f]||o;return n?r.createElement(m,i(i({ref:t},c),{},{components:n})):r.createElement(m,i({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8314:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return u}});var r=n(4489),a=n(2790),o=(n(3289),n(6164)),i=["components"],l={id:"flags",title:"Flags",sidebar_label:"Flags"},s=void 0,p={unversionedId:"patterns/flags",id:"patterns/flags",title:"Flags",description:"Flags store conclusions regarding the state of some data. Usually a producer",source:"@site/docs/patterns/flags.md",sourceDirName:"patterns",slug:"/patterns/flags",permalink:"/engine/docs/patterns/flags",draft:!1,editUrl:"https://github.com/code11/engine/edit/master/docs/docs/patterns/flags.md",tags:[],version:"current",frontMatter:{id:"flags",title:"Flags",sidebar_label:"Flags"},sidebar:"docs",previous:{title:"Collections",permalink:"/engine/docs/patterns/collections"},next:{title:"Request-Response",permalink:"/engine/docs/patterns/request-response"}},c={},u=[],d={toc:u};function f(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Flags store conclusions regarding the state of some data. Usually a producer\nwill observe some data and then update a single location with flag information.\nIn this way decisions avoid being computed where they are needed and instead\nrely on the state to provide this information."),(0,o.kt)("p",null,"Keeping flags on the state decreases complexity and helps code to be more\nmodular."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"user.isAuth")," is populated by a producer that uses different sources (local\nstorage, session, etc) to determine wheter the user has a valid session or not,\nand stores this information in the state."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"{\n  user: {\n    isAuth: true\n  }\n}\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"balloons.items.*.isInflated")," is populated by a producer that observes\n",(0,o.kt)("inlineCode",{parentName:"p"},"ballons.items.*.capacity")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"balloons.items.*.air"),". If the air will equal the\ncapacity it will update the path with ",(0,o.kt)("inlineCode",{parentName:"p"},"true")," otherwise, it'll be ",(0,o.kt)("inlineCode",{parentName:"p"},"false"),"."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"balloons.areInflated")," is populated by a producer that observes\n",(0,o.kt)("inlineCode",{parentName:"p"},"balloons.items.*.isInflated")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"balloons.count")," and will update the\n",(0,o.kt)("inlineCode",{parentName:"p"},"areInflated")," path once the ",(0,o.kt)("inlineCode",{parentName:"p"},"isInflated")," count is equal to the ",(0,o.kt)("inlineCode",{parentName:"p"},"balloons.count")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'{\n  balloons: {\n    items: {\n      "abc": {\n        isInflated: false,\n        air: 40,\n        capacity: 100,\n      },\n      "xyz": {\n        isInflated: true,\n        air: 80,\n        capacity: 80,\n      }\n    },\n    count: 2,\n    areInflated: false,\n  }\n\n}\n')))}f.isMDXComponent=!0}}]);