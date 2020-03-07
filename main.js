import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import GlobalJson from './static/types.json';
Vue.prototype.GlobalJson = GlobalJson

import Navs from './static/navs.json';
Vue.prototype.Navs = Navs

// 引入公共函数
import Utils from './static/untils/until.js';
Vue.prototype.utils=Utils;

Vue.prototype.$eventHub = new Vue();

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
