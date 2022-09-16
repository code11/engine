"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7241],{6164:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return f}});var r=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(n),f=i,m=p["".concat(l,".").concat(f)]||p[f]||u[f]||a;return n?r.createElement(m,o(o({ref:t},d),{},{components:n})):r.createElement(m,o({ref:t},d))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8975:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return u}});var r=n(4489),i=n(2790),a=(n(3289),n(6164)),o=["components"],s={id:"collections",title:"Collections",sidebar_label:"Collections"},l=void 0,c={unversionedId:"patterns/collections",id:"patterns/collections",title:"Collections",description:"Collections group similar data structures together and provide a friendly way of",source:"@site/docs/patterns/collections.md",sourceDirName:"patterns",slug:"/patterns/collections",permalink:"/engine/docs/patterns/collections",draft:!1,editUrl:"https://github.com/code11/engine/edit/master/docs/docs/patterns/collections.md",tags:[],version:"current",frontMatter:{id:"collections",title:"Collections",sidebar_label:"Collections"},sidebar:"docs",previous:{title:"Aggregate",permalink:"/engine/docs/patterns/aggregate"},next:{title:"Flags",permalink:"/engine/docs/patterns/flags"}},d={},u=[],p={toc:u};function f(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Collections group similar data structures together and provide a friendly way of\naccessing and working with those data structures. Collections are very useful\nwhen used in conjuction with entities."),(0,a.kt)("p",null,"Entities are domain objects that are uniquely defined by a unique identifier."),(0,a.kt)("p",null,"In Engine, it's best to aim for achieving a balance between normalizing and\ndenormalizing data based on the needs of observing changes or accessing partial\nor processed data. As a rule of thumb, data received from the outside of the\nsystem should be kept in a raw form somewhere so that it can be transformed in\nthe many ways needed from your system."),(0,a.kt)("p",null,"Also, it's very important for an Entity to have its ",(0,a.kt)("inlineCode",{parentName:"p"},"id")," stored in its data\nstructure. Entities should always be able to exist on their own if needed."),(0,a.kt)("p",null,"In the following example several data processing patterns are used:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"articles.raw")," stores denormalized data received from an API."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"articles.items")," is created by a producer that ",(0,a.kt)("inlineCode",{parentName:"li"},"reduce"),"s ",(0,a.kt)("inlineCode",{parentName:"li"},"articles.raw")," and\nextracts only the information needed by the application; and only the items\nneeded for the application."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"articles.ids")," is created by a producer that ",(0,a.kt)("inlineCode",{parentName:"li"},"reduce"),"s ",(0,a.kt)("inlineCode",{parentName:"li"},"articles.items")," and\nextracts only the list of ids. This is useful when you want to iterate on all\narticles but you don't want to get the data associated with the ids."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"articles.count")," is made by a producer that ",(0,a.kt)("inlineCode",{parentName:"li"},"reduce"),"s ",(0,a.kt)("inlineCode",{parentName:"li"},"articles.ids")," and gives\nthe number of articles."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"articles.filters")," is made by a producer that groups articles by their\ncategory. It's useful when you want to iterate on a single category. The\nexistence of this producer is determined by the need of this information.")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"{\n  articles: {\n    raw: {\n      abc: {\n        [...]\n      },\n      dfg: {\n        [...]\n      },\n      xyz: {\n        [...]\n      },\n    },\n    items: {\n      abc: {\n        id: \"abc\",\n        title: 'Abc shorts',\n        category: 'shorts'\n      },\n      xyz: {\n        id: \"xyz\",\n        title: 'Xyz news',\n        category: 'news'\n      },\n    },\n    ids: ['xyz'],\n    count: 1,\n    filters: {\n      category: {\n        shorts: ['abc'],\n        news: ['xyz]\n      }\n    },\n  }\n}\n")))}f.isMDXComponent=!0}}]);