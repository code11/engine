"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[432],{6164:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(3289);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=a.createContext({}),l=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=l(e.components);return a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,p=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),u=l(n),m=i,g=u["".concat(p,".").concat(m)]||u[m]||d[m]||r;return n?a.createElement(g,s(s({ref:t},c),{},{components:n})):a.createElement(g,s({ref:t},c))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,s=new Array(r);s[0]=u;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:i,s[1]=o;for(var l=2;l<r;l++)s[l]=n[l];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5474:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},metadata:function(){return p},toc:function(){return l},default:function(){return d}});var a=n(1629),i=n(7322),r=(n(3289),n(6164)),s=["components"],o={id:"testing",title:"Testing",sidebar_label:"Testing"},p={unversionedId:"testing",id:"testing",isDocsHomePage:!1,title:"Testing",description:"Engine gives a lot of emphasis to building testable applications. Recommended",source:"@site/docs/testing.md",sourceDirName:".",slug:"/testing",permalink:"/engine/docs/testing",editUrl:"https://github.com/code11/engine/edit/master/docs/docs/testing.md",version:"current",sidebar_label:"Testing",frontMatter:{id:"testing",title:"Testing",sidebar_label:"Testing"},sidebar:"docs",previous:{title:"Debugging",permalink:"/engine/docs/guides/debugging"},next:{title:"Aggregate",permalink:"/engine/docs/patterns/aggregate"}},l=[{value:"Testing <code>producer</code>s",id:"testing-producers",children:[{value:"<code>Test.producer</code>",id:"testproducer",children:[]}]},{value:"Testing <code>view</code>s",id:"testing-views",children:[{value:"<strong><code>Test.view</code></strong>",id:"testview",children:[]}]}],c={toc:l};function d(e){var t=e.components,n=(0,i.Z)(e,s);return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Engine gives a lot of emphasis to building testable applications. Recommended\nway to test Engine applications is using ",(0,r.kt)("inlineCode",{parentName:"p"},"@c11/engine.test")," package, which can\nbe installed like any other npm package."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"npm install -D @c11/engine.test jest\n")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"@c11/engine.test")," provides utilities for writing tests which can be used with\nthe ",(0,r.kt)("a",{parentName:"p",href:"https://jestjs.io/"},"jest")," testing framework. Jest is the only Engine supported\ntesting framework for now."),(0,r.kt)("p",null,"Engine applications are combinations of ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/view"},"views")," and\n",(0,r.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producers"),". Naturally, unit testing Engine applications is\nachieved by writing unit tests for its ",(0,r.kt)("inlineCode",{parentName:"p"},"producer"),"s and ",(0,r.kt)("inlineCode",{parentName:"p"},"view"),"s."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import Test from '@c11/engine.test';\n")),(0,r.kt)("p",null,"Like rest of Engine ecosystem, API exposed by ",(0,r.kt)("inlineCode",{parentName:"p"},"@c11/engine.test")," is also quite\nminimal. Default export from ",(0,r.kt)("inlineCode",{parentName:"p"},"@c11/engine.test")," has just 2 properties which can\nbe used to test ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producer"),"s and ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/view"},"view"),"s."),(0,r.kt)("h2",{id:"testing-producers"},"Testing ",(0,r.kt)("inlineCode",{parentName:"h2"},"producer"),"s"),(0,r.kt)("p",null,"Engine ",(0,r.kt)("inlineCode",{parentName:"p"},"producer"),"s are just Javascript functions. Testing them boils down to\nsame rules that apply to testing functions. Only catch is the fact that it is\nnot possible to call producers directly. They are executed by\n",(0,r.kt)("a",{parentName:"p",href:"/docs/api/engine"},"Engine")," automatically when something interesting in state\nchanges. ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.producer")," is a convenience function which works around this\ncatch, and makes testing a breeze."),(0,r.kt)("h3",{id:"testproducer"},(0,r.kt)("inlineCode",{parentName:"h3"},"Test.producer")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"Test.producer")," is a replacement for\n",(0,r.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/en/api#testname-fn-timeout"},"test/it")," calls. A call to\n",(0,r.kt)("inlineCode",{parentName:"p"},"Test.producer")," tests a single attribute (or function call) of a producer,\nmaking a single test case for a producer's test suite. For example, here's what\na test suite for a producer with single test looks like:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"describe('editListItem', () => {\n  Test.producer(\"Guard action doesn't exist\", {\n    producer: editListItem,\n    values: {},\n    expectations: {\n      resetAction: {\n        set: []\n      },\n      updateMode: {\n        set: []\n      }\n    }\n  });\n});\n")),(0,r.kt)("p",null,"Unlike ",(0,r.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/en/api#testname-fn-timeout"},"test/it"),",\n",(0,r.kt)("inlineCode",{parentName:"p"},"Test.producer")," don't take a function where arbitrary logic and assertions can\ngo. ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.producer")," takes an object as its argument, which has following properties:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"producer: producer"))),(0,r.kt)("p",{parentName:"li"},"The ",(0,r.kt)("a",{parentName:"p",href:"/docs/api/producer"},"producer")," function which you want to test.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"values: object"))),(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"values")," is an object that represent the first argument of the producer. We\ncan't call the producer directly to test it, ",(0,r.kt)("inlineCode",{parentName:"p"},"values")," is how we:"),(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},"Provide arguments which producer gets from state (e.g using ",(0,r.kt)("inlineCode",{parentName:"li"},"Observe.<path>"),")"),(0,r.kt)("li",{parentName:"ol"},"Provide mocks for functions and other abstractions the producer uses")),(0,r.kt)("p",{parentName:"li"},"When the test is executed, the producer will get called with these ",(0,r.kt)("inlineCode",{parentName:"p"},"values")," as\nargument.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"expectations: { set: object, merge: object, remove: object }"))),(0,r.kt)("p",{parentName:"li"},"Expectations is an object to declare our the behavior of our expectations in a\ndeclarative manner. Unlike traditional jest tests, we can't make arbitrary\nassertions in our tests to ensure our producer behaves. ",(0,r.kt)("inlineCode",{parentName:"p"},"expectations")," is an\nobject with three properties which can assert three ways in which a producer\ncan impact the state:"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"set: object"))," asserts new values that producer adds to state"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"merge: object"))," asserts changes in existing values in state that\nproducer has introduced"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"remove: object"))," asserts values that producer has removed from the state")))),(0,r.kt)("h2",{id:"testing-views"},"Testing ",(0,r.kt)("inlineCode",{parentName:"h2"},"view"),"s"),(0,r.kt)("p",null,"Engine's ",(0,r.kt)("inlineCode",{parentName:"p"},"view"),"s are just producers with a significant specialty: they return\nJSX which gets rendered in, well, a view. ",(0,r.kt)("inlineCode",{parentName:"p"},"@c11/engine.test")," support testing\nviews with ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.view")," function. For now, only ",(0,r.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/en/snapshot-testing"},"snapshot\ntesting")," is supported to test views."),(0,r.kt)("h3",{id:"testview"},(0,r.kt)("strong",{parentName:"h3"},(0,r.kt)("inlineCode",{parentName:"strong"},"Test.view"))),(0,r.kt)("p",null,"Similar to ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.producer"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.view")," is how individual tests of a\n",(0,r.kt)("a",{parentName:"p",href:"/docs/api/view"},"view"),"'s test suite are written."),(0,r.kt)("p",null,"Here's what a simple test for a view looks like:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"describe('TodoList view', () => {\n  Test.view('no list', {\n    state: {\n      todo: {\n        byId: {}\n      }\n    },\n    View: TodoList,\n    props: { icons: {}}\n  });\n});\n")),(0,r.kt)("p",null,"Just like ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.producer"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.view")," do not accept a function for its second\nargument but an object to declare the test in a declarative manner."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"state: Object"))),(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"state")," is the application state at the time when view is first rendered.\nTesting a view need access to the whole state because:"),(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},"Child views might be accessing this state directly"),(0,r.kt)("li",{parentName:"ol"},"Producers attached to the view (or its child views) might make changes to\nthe application state, which in turn impact the view"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"View: view"))),(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"View")," is the view itself that the test is being written for.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"props: object"))),(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"props")," is an object of props that parent view has passed down."))),(0,r.kt)("p",null,"This is all that is needed to test an Engine view. A call to ",(0,r.kt)("inlineCode",{parentName:"p"},"Test.view")," will\ntake a snapshot of how the view looks like when rendered in browser, and match\nit with the previously taken snapshot to ensure nothing has broken the view. You\ncan read more about ",(0,r.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/en/snapshot-testing"},"snapshot testing on Jest's\ndocumentation"),"."))}d.isMDXComponent=!0}}]);