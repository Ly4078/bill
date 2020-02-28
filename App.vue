<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
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
			background-color: $uni-color-success;
		}
		.inclass{
			background-color: $uni-color-primary;
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
	}
</style>
