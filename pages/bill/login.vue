<template>
	<view class="login">
		<uni-nav-bar fixed="true" status-bar="true" :title="title" color="#333" background-color="#f1f1f1">
		</uni-nav-bar>
		<view class="imgboxlogin">
			<image class="imgsrc" src="../../static/tuhaokuai_1582880205.png" mode="aspectFit"></image>
		</view>

		<form @submit="formSubmit" @reset="formReset" class="formbox">
			<view class="inputView">
				<input type="number" name="phone" v-model="phone" maxlength="11" placeholder="手机号" value="" />
			</view>
			<view class="inputView">
				<input :type="iseye?'password':'text'" name="password" placeholder="登录密码" value="" />
				<text :class="iseye?'iconfont iconyanjing':'iconfont iconyanjing1'" @click="iseye = !iseye"></text>
			</view>
			<!-- <view class="inputView">
				<input type="text" name="versi"  placeholder="验证码" value="" />
			</view> -->
			<view class="uni-btn-v">
				<button form-type="submit">{{title}}</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		uniCard,
		uniNavBar
	} from '@dcloudio/uni-ui'
	// 也可使用此方式引入组件
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			uniCard,
			uniNavBar
		},
		computed: {
			...mapState(['hasLogin'])
		},

		data() {
			return {
				tokenId:"",
				title: '登 录',
				iseye: false,
				isver: false,
				phone: "",
				wxdata: {}
			}
		},
		onLoad(option) {
			console.log('option:',option)
			//#ifdef MP-WEIXIN
			this.tokenId=option.id;
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					uniCloud.callFunction({
						name: 'getUnionid',
						data: {
							js_code: loginRes.code
						}
					}).then((res) => {
						this.wxdata = res.result.data;
						console.log('wxdata:',this.wxdata)
					})
				}
			});
			//#endif
		},
		methods: {
			...mapMutations(['login']),
			// 提交验证
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var formdata = e.detail.value;
				if (!this.utils.checkPhone(formdata.phone)) {
					uni.showToast({
						title: '手机号输入错误',
						icon: 'none'
					})
					return
				}
				if (formdata.password && Number(formdata.password.length) < 6) {
					uni.showToast({
						title: '密码长度不少于6位',
						icon: 'none'
					})
					return
				}
				let postData = {};
				postData = { ...this.wxdata,
					...formdata
				}
				uniCloud.callFunction({
					name: 'login',
					data: postData
				}).then((res) => {
					if (res.result.status == 0) {
						this.login(res.result.token);
						uni.reLaunch({
							url: './index'
						})
					} else {
						uni.showModal({
							title: '提示',
							showCancel: false,
							content: res.result.msg,
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
								}
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.login {
		.imgboxlogin {
			height: 300upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.imgsrc {
				width: 200upx;
			}
		}

		.formbox {
			display: block;
			width: 90%;
			margin: 0 5%;

			.inputView {
				margin: 30upx 0;
				height: 100upx;
				box-shadow: 0upx 0upx 10upx 5upx $uni-border-color;
				padding: 0 50upx;
				border-radius: 80upx;
				display: flex;
				align-items: center;

				input {
					width: 95%;
				}

				.iconfont {
					padding: 20upx;
					font-size: 50upx;
				}
			}
		}

		.uni-btn-v {
			margin-top: 100upx;
			border-radius: 80upx;

			button {
				border-radius: 80upx;
				box-shadow: 0upx 0upx 10upx 5upx $uni-border-color;
			}
		}
	}
</style>
