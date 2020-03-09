<template>
	<view class="about">
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="关于" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
		</uni-nav-bar>
		<view class="appinfo">
			应用信息
		</view>
		<view class="listbox">
			<!-- #ifdef APP-PLUS -->
			<view class="infobox">
				<text>版本号</text>
				<text>{{version}}</text>
			</view>
			<!-- #endif -->

		</view>
		<view class="listbox">
			<view class="titles">
				关于应用
			</view>
			<view class="infobox">
				休息时间写了这个应用，记录平时的消费收支情况，帮助自己合理规划消费，本着简单，干净，实用的原则开发。由于是个人开发，难免存在一些问题，希望大家多多提意见，我也会一直维护下去。
			</view>
		</view>
		<view class="listbox">
			<view class="titles">
				关于我
			</view>
			<view class="infobox">
				前端开发程序员
			</view>
		</view>
		<view class="listbox">
			<view class="titles">
				微信公众号
			</view>
			<view class="infobox">
				微信公众号：香格里拉4078；可以通过公众号反馈意见、bug，或与我联系。
			</view>
		</view>
		<view class="listbox">
			<view class="titles">
				源代码
			</view>
			<view class="infobox">
				代码已托管在GitHub（https://github.com/Ly4078/bill-backup）上，欢迎吐槽我的渣渣代码~
			</view>
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
		data() {
			return {
				version: ''
			}
		},
		onShow() {
			//#ifdef APP-PLUS
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
			//#ifdef APP-PLUS
			// 获取应用当前版本号
			getVersionCode() {
				// 获取apk/ipa版本号
				alert('Application(apk/ipa) version：' + plus.runtime.versionCode);
				this.version = plus.runtime.versionCode;
			}
			//#endif
		}
	}
</script>

<style lang="scss">
	.about {
		.appinfo {
			padding: 16upx 20upx;
			color: $uni-text-color-grey;
			margin-bottom: 10upx;
		}

		.listbox {

			padding: 16upx 20upx;
			font-size: 30upx;
			border-bottom: 1upx solid $uni-text-color-disable;

			.titles {
				font-size: 35upx;
				color: $uni-text-color-back;
				font-weight: 400;
				margin-bottom: 10upx;
				margin-top: 20upx;
			}

			.infobox {
				color: $uni-text-color;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
	}
</style>
