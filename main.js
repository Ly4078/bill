import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import GlobalJson from './static/types.json';
Vue.prototype.GlobalJson = GlobalJson

import Navs from './static/navs.json';
Vue.prototype.Navs = Navs

import Utils from './static/untils/until.js';
Vue.prototype.utils=Utils;

Vue.prototype.$eventHub = new Vue();


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
