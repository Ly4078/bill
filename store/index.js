import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userId: ''
	},
	mutations: {
		login(state, user) {
			state.hasLogin = true;
			state.userId = user || '';
			uni.setStorage({
				key: "userId",
				data: user
			})
		},
		loginOut(state, user) {
			state.hasLogin = false;
			state.userId = '';
			uni.removeStorage({
				key: 'userId'
			})
		}
	}
})
export default store
