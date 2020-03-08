<template>
	<view class="about">
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="关于" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
		</uni-nav-bar>
		<view class="listbox">
			<text>版本号</text>
			<text>1.1.1</text>
		</view>
	</view>
</template>

<script>
	import {
		uniNavBar
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniNavBar
		},
		data(){
			return{
				version:''
			}
		},
		onShow() {
			//#ifdef MP-WEIXIN
			this.getVersionCode();
			//#endif
			
		},
		methods: {
			toback() {
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			},
			getVersionCode(){
				// 获取apk/ipa版本号
				alert('Application(apk/ipa) version：' + plus.runtime.versionCode);
				this.version=plus.runtime.versionCode;
			}
		}
	}
</script>

<style lang="scss">
	.about{
		.listbox{
			
			padding:30upx 20upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1upx solid $uni-text-color-disable;
		}
	}
</style>
