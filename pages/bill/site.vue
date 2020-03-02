<template>
	<view class="site">
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="设置" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
		</uni-nav-bar>
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
		methods: {
			toback() {
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			}
		}
	}
</script>

<style lang="scss">
</style>
