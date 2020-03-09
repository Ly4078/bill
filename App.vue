<script>
	import{mapMutations} from 'vuex';
	export default {
		methods:{
			...mapMutations(['login'])
		},
		onLaunch: function() {
			// console.log('App Launch')
			let userId=uni.getStorageSync('userId') || '';
			if(userId){
				uni.setStorage({
					key: "userId",
					data: userId
				})
			}
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	
	@import './static/fonticon.css';
	/*每个页面公共css */
	body{
		background-color: $uni-bg-color-hover;
		.exclass{
			background-color: $uni-color-exclass;
		}
		.inclass{
			background-color: $uni-color-inclass;
		}
		
		.operating {
			width: 500upx;
			padding: 20upx 30upx;
			min-height: 200upx;
			border-radius: 20upx;
			text-align: center;
			background-color: $uni-text-color-inverse;
		
			&>view {
				height: 100upx;
				line-height: 100upx;
				text-align: center;
			}
		
			&>view:nth-child(1) {
				border-bottom: 2upx solid $uni-text-color-disable;
			}
		}
		.nodata {
			width: 100%;
			margin: 20% 0;
			text-align: center;
		}
		.swipaction {
			width: 70%;
			height: 95%;
			/* #ifdef APP-PLUS || H5 */
			margin-left: 15%;
			/* #endif */
			display: flex;
			justify-content: space-around;
			view{
				min-width: 28%;
				text-align: center;
				padding: 0 8%;
				color: $uni-text-color;
			},
			.exbor{
				color:$uni-color-exclass;
				border-bottom: $uni-border-radius-base solid $uni-color-exclass;
			}
			.inbor{
				color:$uni-color-inclass;
				border-bottom: $uni-border-radius-base solid $uni-color-inclass;
			}
			.borbut{
				color:$uni-color-primary;
				border-bottom: $uni-border-radius-base solid $uni-color-primary;
			}
		}
		.butbox {
			width: 100%;
			height: 100upx;
		}
		.addtypebut {
			position: fixed;
			width: 50%;
			left: 25%;
			bottom: 30upx;
			border-radius: 60upx;
			background-color: $uni-color-primary;
			color: $uni-text-color-inverse;
		}
	}
</style>
