(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/bill/search"],{"0ef8":function(t,n,e){},7386:function(t,n,e){"use strict";e.r(n);var i=e("7aca"),o=e.n(i);for(var a in i)"default"!==a&&function(t){e.d(n,t,(function(){return i[t]}))}(a);n["default"]=o.a},"7aca":function(t,n,e){"use strict";(function(t,i){function o(t){return s(t)||u(t)||a()}function a(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function u(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function s(t){if(Array.isArray(t)){for(var n=0,e=new Array(t.length);n<t.length;n++)e[n]=t[n];return e}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var l,r=function(){return Promise.all([e.e("common/vendor"),e.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-icons/uni-icons")]).then(e.bind(null,"cc1c"))},c=function(){return e.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-load-more/uni-load-more").then(e.bind(null,"bbd0"))},d=function(){return e.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-popup/uni-popup").then(e.bind(null,"b50e"))},h=function(){return e.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar").then(e.bind(null,"fc91"))},f=function(){return e.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-list-item/uni-list-item").then(e.bind(null,"8f42"))},p=function(){return e.e("node-modules/_@dcloudio_uni-ui@1.1.8@@dcloudio/uni-ui/lib/uni-list/uni-list").then(e.bind(null,"c806"))},m={components:{uniList:p,uniListItem:f,uniNavBar:h,uniPopup:d,uniLoadMore:c,uniIcons:r},onLoad:function(t){t.label?(this.valueInput=t.label,this.isfocus=!1,this.search()):this.getkeys()},data:function(){return{inds:"",imgUrl:"",pageNum:0,Token:t.getStorageSync("userId")||"",isnull:!1,isfocus:!0,issearch:!0,issearch_log:!0,opearObj:{},valueInput:"",keys:[],search_keys:[],listData:{},status:"more",showLoadMore:!1,loadMoreText:"加载中..."}},onUnload:function(){this.listData={},this.pageNum=0,this.status="more",this.showLoadMore=!1},onReachBottom:function(){this.pageNum+=1,100*this.pageNum>this.listData.total?t.showToast({icon:"none",duration:2e3,title:"没有更多数据了"}):(this.status="loading",this.showLoadMore=!0,this.search())},onPullDownRefresh:function(){this.status="loading",this.showLoadMore=!0,this.pageNum=0,this.search()},methods:{toback:function(){t.navigateBack({delta:1})},inputValue:function(n){var e=this,i=n.target.value,o=0;l&&clearInterval(l),!i&&this.isnull&&(this.showLoadMore=!1,this.isnull=!1),l=setInterval((function(){if(o++,30===o&&i){e.valueInput=i,e.pageNum=0,e.keys.push(e.valueInput);var a=e.keys.join(",");clearInterval(l);try{t.setStorageSync("search_key",a)}catch(n){}e.pageNum=0,e.search()}}),50)},search:function(){var n=this;this.issearch&&(this.issearch=!1,this.isfocus=!1,t.showLoading({title:"数据加载中..."}),i.callFunction({name:"get",data:{token:this.Token,pageNum:this.pageNum,label:this.valueInput}}).then((function(e){if(t.hideLoading(),console.log(e),n.issearch=!0,n.showLoadMore=!1,n.issearch_log=!1,-1!=e.result.status)if(e.result.total>0){n.isnull=!1;var i=o(e.result.list);0==n.pageNum?n.listData=e.result:n.listData.list=n.listData.list.concat(i)}else{0==n.pageNum&&(n.listData={},n.isnull=!0);var a=n.pageNum>0?"没有更多数据了":e.result.data.msg;t.showToast({icon:"none",duration:2e3,title:a})}else n.isnull=!0})).catch((function(e){t.hideLoading(),n.issearch=!0,n.isnull=!1,t.showToast({icon:"none",duration:2e3,title:"未查询到相关信息"})})))},getkeys:function(){try{var n=t.getStorageSync("search_key");if(n){var e=n.split(",");this.keys=Array.from(new Set(e))}}catch(i){}},handlesey:function(t){this.valueInput=t,this.search()},handledel:function(n,e){this.keys.splice(e,1);var i=this.keys.join(",");try{t.setStorageSync("search_key",i)}catch(o){}},clearAll:function(){this.keys=[];try{t.setStorageSync("search_key","")}catch(n){}},onshowproof:function(t){this.imgUrl=t,this.$refs.picture.open(),console.log("imgUrl:",this.imgUrl)},handleItem:function(n){t.navigateTo({url:"./details?id="+n})},handleLong:function(t,n){this.inds=n,this.opearObj=t,this.$refs.searchPopup.open()},moreOper:function(n){var e=this;1==n?this.handleItem(this.opearObj._id):t.showModal({title:"提示",content:"是否确认删除此条数据？",success:function(n){n.confirm?(t.showLoading({title:"数据删除中..."}),i.callFunction({name:"remove",data:{dataId:e.opearObj._id}}).then((function(n){t.hideLoading(),t.showToast({title:n.result.msg,duration:2e3}),e.listData.list.splice(e.inds,1)})).catch((function(n){t.hideLoading(),t.showModal({content:"操作失败，请重新操作",showCancel:!1}),console.error(n)}))):n.cancel&&console.log("用户点击取消")}}),this.$refs.searchPopup.close()}},created:function(){}};n.default=m}).call(this,e("543d")["default"],e("a9ff")["default"])},"7ecf":function(t,n,e){"use strict";e.r(n);var i=e("fb95"),o=e("7386");for(var a in o)"default"!==a&&function(t){e.d(n,t,(function(){return o[t]}))}(a);e("f9d6");var u,s=e("f0c5"),l=Object(s["a"])(o["default"],i["b"],i["c"],!1,null,"ea30d640",null,!1,i["a"],u);n["default"]=l.exports},e713:function(t,n,e){"use strict";(function(t){e("99cf"),e("921b");i(e("66fd"));var n=i(e("7ecf"));function i(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},f9d6:function(t,n,e){"use strict";var i=e("0ef8"),o=e.n(i);o.a},fb95:function(t,n,e){"use strict";var i,o=function(){var t=this,n=t.$createElement;t._self._c},a=[];e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return a})),e.d(n,"a",(function(){return i}))}},[["e713","common/runtime","common/vendor"]]]);