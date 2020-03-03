<template>
	<view class="proof">
		<uni-popup ref="proofbox" type="conter" @click='closeImg'>
			<image :src="ImgUrl" mode="aspectFit"></image>
		</uni-popup>
	</view>
</template>

<script>
	import {
		uniPopup
	} from '@dcloudio/uni-ui';
	export default {
		components: {
			uniPopup
		},
		props:{
			ImgUrl: {
				type: String,
				default: ''
			}, // 凭证图标
		},
		onShow() {
			this.$refs.proofbox.open();
			console.log("aaa")
		},
		methods: {
			closeImg(){
				this.$emit("closeImg")
			}
		}
	}
</script>

<style>
</style>
