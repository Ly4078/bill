(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/bill/chart"],{"1ba2":function(t,e,n){"use strict";(function(t,a){function r(t){return s(t)||i(t)||o()}function o(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function i(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function s(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(Object(n),!0).forEach((function(e){h(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function h(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var d=function(){return n.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar").then(n.bind(null,"fc91"))},l=function(){return Promise.all([n.e("common/vendor"),n.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-icons/uni-icons")]).then(n.bind(null,"cc1c"))},m=function(){return n.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-card/uni-card").then(n.bind(null,"a6cd"))},f=function(){return Promise.all([n.e("common/vendor"),n.e("components/stan-ucharts/HistogramChart")]).then(n.bind(null,"0483"))},g=function(){return Promise.all([n.e("common/vendor"),n.e("components/stan-ucharts/PieChart")]).then(n.bind(null,"2eb3"))},y={components:{uniCard:m,uniIcons:l,uniNavBar:d,HistogramChart:f,PieChart:g},data:function(){return{genre:1,resultData:{},typedata:[],yearormonth:!1,Token:t.getStorageSync("userId")||"",nowdate:{year:"",month:"",day:"",startTime:"",endTime:""},summary:{inAmount:0,intotal:0,exAmount:0,extotal:0,budgetotal:0},cardtitle:"",isnull:!1,histogramData:{categories:[],series:[{name:"",data:[],show:!0,color:"#FF7600",textSize:12}]},pieData:{series:[]}}},onLoad:function(t){var e=new Date;t.year?this.nowdate={year:String(t.year),month:String(Number(t.month)<10?"0"+Number(t.month):t.month),day:String(Number(e.getDate()+1)<10?"0"+e.getDate():e.getDate())}:this.nowdate={year:String(e.getFullYear()),month:String(Number(e.getMonth()+1)<10?"0"+(e.getMonth()+1):e.getMonth()+1),day:String(Number(e.getDate()+1)<10?"0"+e.getDate():e.getDate())},this.cardtitle="".concat(this.nowdate.year,"年").concat(this.nowdate.month,"月")},onShow:function(){this.getSummary(),this.getchartData()},created:function(){},methods:{toback:function(){t.navigateBack({delta:1,animationType:"pop-out",animationDuration:200})},changeYearMonth:function(){this.yearormonth=!this.yearormonth,this.yearormonth?this.cardtitle="".concat(this.nowdate.year,"年"):this.cardtitle="".concat(this.nowdate.year,"年").concat(this.nowdate.month,"月"),this.getchartData(),this.getSummary()},handleCard:function(t){var e=this;if(this.yearormonth){if(1==t){var n=Number(this.nowdate.year);n--,this.nowdate.year=String(n)}else if(2==t){var a=Number(this.nowdate.year);a++,this.nowdate.year=String(a)}this.cardtitle="".concat(this.nowdate.year,"年")}else{if(1==t){var r=Number(this.nowdate.month);if(r--,r=r<10?"0"+r:r,this.nowdate.month=String(r),0==Number(this.nowdate.month)){this.nowdate.month="12";var o=Number(this.nowdate.year);o--,this.nowdate.year=String(o)}}else if(2==t){var i=Number(this.nowdate.month);if(i++,i=i<10?"0"+i:i,this.nowdate.month=String(i),13==Number(this.nowdate.month)){this.nowdate.month="01";var s=Number(this.nowdate.year);s++,this.nowdate.year=String(s)}}this.cardtitle="".concat(this.nowdate.year,"年").concat(this.nowdate.month,"月")}setTimeout((function(){e.getSummary(),e.getchartData()}),500)},handinex:function(t){this.genre=t,this.getchartData()},handletype:function(e){var n=e.useType.label;t.navigateTo({url:"./search?label="+n})},getSummary:function(){var e=this;t.showLoading({title:"数据加载中....",mask:!0});var n={range:this.yearormonth?"year":"month",yearMonth:this.nowdate.year+"-"+this.nowdate.month,year:this.nowdate.year,token:this.Token};this.yearormonth||(n.month=this.nowdate.month),a.callFunction({name:"summary",data:n}).then((function(n){t.hideLoading(),e.summary=n.result})).catch((function(e){t.hideLoading(),t.showModal({content:"查询失败，错误信息为：".concat(e.message),showCancel:!1}),console.error(e)}))},getchartData:function(){var e=this;t.showLoading({title:"数据加载中...",mask:!0});var n={genre:this.genre,range:this.yearormonth?"year":"month",year:this.nowdate.year,token:this.Token};this.yearormonth||(n.month=this.nowdate.month),a.callFunction({name:"getchart",data:n}).then((function(n){var a=e.yearormonth?"useMonth":"useDay";n.result.histogramData.data=n.result.histogramData.data.sort(e.utils.compare(a)),n.result.pieData.data=n.result.pieData.data.sort(e.utils.compare("scale")),e.resultData=c({},n.result),e.typedata=r(n.result.pieData.data),t.hideLoading(),e.working()})).catch((function(e){t.hideLoading(),t.showModal({content:"查询失败，错误信息为：".concat(e.message),showCancel:!1})}))},working:function(){var t={categories:[],series:[]},e={series:[]},n=r(this.resultData.histogramData.data),a=r(this.resultData.pieData.data),o=1==this.genre?"支出":"收入",i=[];for(var s in n){var u="";u=this.yearormonth?Number(n[s].useMonth)+"月":Number(n[s].useDay)+"日",t.categories.push(u);var h=1==this.genre?n[s].extotal:n[s].intotal;i.push(h)}for(var d in t.series=[{name:o,data:i,show:!0,textSize:12}],this.histogramData=c({},t),a){var l={name:a[d].useType.label,data:1==this.genre?a[d].extotal:a[d].intotal};e.series.push(l)}this.pieData=c({},e),0==this.pieData.series.length?this.isnull=!0:this.isnull=!1,this.Drawing()},Drawing:function(){var t=this;this.$nextTick((function(){t.$refs["histogramData"].showCharts(),t.$refs["pieChart"].showCharts()}))}}};e.default=y}).call(this,n("543d")["default"],n("a9ff")["default"])},"1f05":function(t,e,n){"use strict";n.r(e);var a=n("1ba2"),r=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=r.a},"3c8c":function(t,e,n){"use strict";var a=n("7ba4"),r=n.n(a);r.a},"3dd4":function(t,e,n){"use strict";n.r(e);var a=n("57fa"),r=n("1f05");for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);n("3c8c");var i,s=n("f0c5"),u=Object(s["a"])(r["default"],a["b"],a["c"],!1,null,"29cd558d",null,!1,a["a"],i);e["default"]=u.exports},"57fa":function(t,e,n){"use strict";var a,r=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return a}))},"74b2":function(t,e,n){"use strict";(function(t){n("99cf"),n("921b");a(n("66fd"));var e=a(n("3dd4"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},"7ba4":function(t,e,n){}},[["74b2","common/runtime","common/vendor"]]]);