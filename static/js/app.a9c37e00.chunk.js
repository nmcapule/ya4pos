(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{184:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return X}));var r=n(261),i=n(260),c={prefixes:["https://nmcapule-literate-parakeet-j4qvr9vv4xc5pgj-19006.preview.app.github.dev","http://nmcapule.github.dev/ya4pos"],config:{screens:{Hello:"./hello",Login:"./login",POS:"./pos",Review:"./review"}}},o=n(1),l=n(36),a=n(3),u=n(65),s=n(17);function f(e){var t=e.navigation;return Object(s.jsxs)(a.default,{style:d.container,children:[Object(s.jsx)(l.default,{children:"Open up App.tsx to start working on your app!"}),Object(s.jsx)(u.default,{mode:"outlined",onPress:function(){return t.navigate("Login")},children:"Go to Login"})]})}var d=o.default.create({container:{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}),j=n(12),p=n.n(j),b=n(20),O=n.n(b),v=n(0),h=n(132),m=n(5),y=n.n(m),g=n(6),x=n.n(g),w="https://ya4pos.fly.dev";function P(e,t){return S.apply(this,arguments)}function S(){return(S=O()((function*(e,t){var n=yield fetch(""+w+e,Object.assign({method:"GET",mode:"cors",credentials:"include",headers:{Accept:"application/json","Content-Type":"application/json"}},t));if(n.status>=400)throw new Error(yield n.text());return n.json()}))).apply(this,arguments)}var k=function(){function e(){y()(this,e)}return x()(e,[{key:"login",value:function(){var e=O()((function*(e,t){return yield P("/api/v1/authentication",{method:"POST",body:JSON.stringify({username:e,password:t})})}));return function(t,n){return e.apply(this,arguments)}}()}]),e}();function C(){return(C=O()((function*(e,t){var n=new k;console.log(yield n.login(e,t))}))).apply(this,arguments)}function T(e){var t=e.navigation,n=Object(v.useState)(""),r=p()(n,2),i=r[0],c=r[1],o=Object(v.useState)(""),l=p()(o,2),f=l[0],d=l[1];return Object(s.jsxs)(a.default,{style:L.container,children:[Object(s.jsx)(h.default,{mode:"outlined",placeholder:"Username",value:i,onChangeText:c}),Object(s.jsx)(h.default,{mode:"outlined",placeholder:"Password",secureTextEntry:!0,value:f,onChangeText:d}),Object(s.jsx)(u.default,{mode:"outlined",style:L.submit,onPress:O()((function*(){try{yield function(e,t){return C.apply(this,arguments)}(i,f)}catch(e){console.error(e)}t.navigate("POS")})),children:"Submit"})]})}var L=o.default.create({container:{flex:1,backgroundColor:"#fff",alignItems:"stretch",justifyContent:"center",padding:"5%"},submit:{marginTop:"8pt"}}),R=n(2),D=n.n(R),E=n(54),H=n(133),U=n(183),A=n(258),G=n(259),I=n(32),J=function(){function e(){y()(this,e)}return x()(e,[{key:"List",value:function(){var e=O()((function*(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new URLSearchParams;return yield P("/api/v1/warehouses?"+(null==e?void 0:e.toString()))}));return function(){return e.apply(this,arguments)}}()},{key:"View",value:function(){var e=O()((function*(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new URLSearchParams;return yield P("/api/v1/warehouses/"+e+"?"+(null==t?void 0:t.toString()))}));return function(t){return e.apply(this,arguments)}}()},{key:"Stocks",value:function(){var e=O()((function*(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new URLSearchParams;return yield P("/api/v1/warehouses/"+e+"/stocks?"+(null==t?void 0:t.toString()))}));return function(t){return e.apply(this,arguments)}}()}]),e}();function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function B(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(Object(n),!0).forEach((function(t){D()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function q(e){var t=e.navigation,n=Object(v.useState)([]),r=p()(n,2),i=r[0],c=r[1],o=Object(v.useState)({}),l=p()(o,2),u=l[0],f=l[1],d=Object(v.useState)([]),j=p()(d,2),b=j[0],h=j[1],m=Object(v.useState)(new Set),y=p()(m,2),g=y[0],x=y[1],w=function(e){var t,n,r=null!=(t=u[e.id])?t:0;if(0===r)return"";var i=null==(n=e.expand)?void 0:n.item.icon;return Object(s.jsx)(H.default,{mode:"outlined",icon:i,children:"x"+r})};return Object(v.useEffect)((function(){var e=new J;O()((function*(){var t=yield e.Stocks("ffcf67ob673v8p0",new URLSearchParams({filter:"sellable=true",expand:"item.tags"})),n=t.map((function(e){var t,n;return null==(t=e.expand)||null==(n=t.item.expand)?void 0:n.tags})).flat().filter((function(e){return Boolean(e)})).reduce((function(e,t){return B(B({},e),{},D()({},t.id,t))}),{});c(t),h(Object.values(n))}))()}),[]),Object(s.jsxs)(a.default,{style:z.container,children:[Object(s.jsx)(a.default,{style:z.tags,children:Array.from(b).map((function(e){return Object(s.jsx)(H.default,{mode:"outlined",style:z.tag,selected:g.has(e.id),onPress:function(){return t=e.id,g.has(t)?g.delete(t):g.add(t),void x(new Set(g));var t},children:e.label},e.id)}))}),Object(s.jsx)(E.default,{children:i.filter((function(e){var t;if(0===g.size)return!0;var n=null==(t=e.expand)?void 0:t.item.tags;return Array.from(g).every((function(e){return n.includes(e)}))})).map((function(e){var t,n;return Object(s.jsx)(A.default,{title:null==(t=e.expand)?void 0:t.item.label,style:z.item,description:"PHP "+e.unitPrice+"\n"+(null==(n=e.expand)?void 0:n.item.description),onPress:function(){return function(e){var t;return f(B(B({},u),{},D()({},e.id,(null!=(t=u[e.id])?t:0)+1)))}(e)},onLongPress:function(){return function(e){var t;return confirm("Clear all current orders for "+(null==(t=e.expand)?void 0:t.item.label)+"?")&&f(B(B({},u),{},D()({},e.id,0)))}(e)},left:function(t){var n;return Object(s.jsx)(G.default,B(B({},t),{},{icon:null==(n=e.expand)?void 0:n.item.icon}))},right:function(t){return Object(s.jsx)(I.default,B(B({},t),{},{children:w(e)}))}},e.id)}))}),Object(s.jsx)(U.default,{style:z.fab,icon:"checkbox-marked-circle-plus-outline",onPress:function(){return t.navigate("Review",{orders:u})}})]})}var z=o.default.create({container:{flex:1},tags:{flexDirection:"row",overflow:"scroll"},tag:{margin:".2em"},item:{backgroundColor:"#fcfcfc"},fab:{position:"absolute",margin:16,right:0,bottom:0}}),Q=n(45);function V(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function F(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?V(Object(n),!0).forEach((function(t){D()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):V(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function K(e){var t=e.route,n=Object(v.useState)({}),r=p()(n,2),i=r[0],c=r[1],o=t.params.orders;return Object(v.useEffect)((function(){var e=new J;O()((function*(){var t=yield e.Stocks("ffcf67ob673v8p0",new URLSearchParams({filter:"sellable=true",expand:"item.tags"}));c(t.reduce((function(e,t){return F(F({},e),{},D()({},t.id,t))}),{}))}))()}),[]),Object(s.jsxs)(a.default,{style:M.container,children:[Object(s.jsx)(E.default,{children:Object(s.jsxs)(Q.default,{children:[Object(s.jsxs)(Q.default.Header,{children:[Object(s.jsx)(Q.default.Title,{style:M.labelCell,children:"Item"}),Object(s.jsx)(Q.default.Title,{numeric:!0,children:"Quantity"}),Object(s.jsx)(Q.default.Title,{numeric:!0,children:"Total Price"})]}),Object.entries(o).map((function(e){var t=p()(e,2),n=t[0],r=t[1];return[i[n],r]})).filter((function(e){var t=p()(e,2),n=t[0];t[1];return Boolean(n)})).map((function(e){var t,n=p()(e,2),r=n[0],i=n[1];return Object(s.jsxs)(Q.default.Row,{children:[Object(s.jsx)(Q.default.Cell,{style:M.labelCell,children:null==(t=r.expand)?void 0:t.item.label}),Object(s.jsx)(Q.default.Cell,{numeric:!0,children:i}),Object(s.jsxs)(Q.default.Cell,{numeric:!0,children:["PHP ",i*r.unitPrice]})]},r.id)})),Object(s.jsxs)(Q.default.Row,{children:[Object(s.jsx)(Q.default.Cell,{style:M.labelCell,children:"Total"}),Object(s.jsx)(Q.default.Cell,{numeric:!0,children:"--"}),Object(s.jsxs)(Q.default.Cell,{numeric:!0,children:["PHP"," ",Object.entries(o).map((function(e){var t,n=p()(e,2),r=n[0],c=n[1];return[null!=(t=i[r])?t:{},c]})).reduce((function(e,t){var n=p()(t,2),r=n[0];return e+n[1]*r.unitPrice}),0)]})]})]})}),Object(s.jsx)(a.default,{style:M.spacer}),Object(s.jsx)(u.default,{style:M.submit,mode:"outlined",children:"Confirm Order"})]})}var M=o.default.create({container:{backgroundColor:"#fcfcfc",flex:1},labelCell:{flexGrow:2},spacer:{flexGrow:1},submit:{margin:".5em"}}),W=Object(i.default)();function X(){return Object(s.jsx)(r.default,{linking:c,children:Object(s.jsxs)(W.Navigator,{initialRouteName:"Hello",screenOptions:{animation:"none"},children:[Object(s.jsx)(W.Screen,{name:"Hello",component:f}),Object(s.jsx)(W.Screen,{name:"Login",component:T}),Object(s.jsx)(W.Screen,{name:"POS",component:q}),Object(s.jsx)(W.Screen,{name:"Review",component:K})]})})}},195:function(e,t,n){e.exports=n(247)}},[[195,1,2]]]);
//# sourceMappingURL=app.a9c37e00.chunk.js.map