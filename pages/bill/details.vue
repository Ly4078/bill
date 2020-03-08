<template>
	<view class="details">
		<!-- #ifdef MP -->
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="详情" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
		</uni-nav-bar>
		<!-- #endif -->
		<!-- #ifdef  APP-PLUS|| H5 -->
		<uni-nav-bar fixed="true" status-bar="true" left-icon="closeempty" right-icon="trash" title="详情" color="#333"
		 @clickLeft="toback" @clickRight="deldata" background-color="#f1f1f1">
		</uni-nav-bar>
		<!-- #endif -->

		<view class="lists" v-if="listdata.genre">
			<view class="listitem">
				<view class="typeimg iconlabel">
					<view :class="['iconfont',listdata.genre==1?'exclass':'inclass',listdata.useType.iconclass]"></view>
					<text>{{listdata.useType.label}}</text>
				</view>
				<view class="info">
					¥ {{listdata.amount}}
				</view>
			</view>
			<view class="listitem">
				<view class="typeimg">
					{{listdata.useDate}}
				</view>
				<view class="info">
					{{listdata.payType.label}}
				</view>
			</view>
			<view class="listitem" v-show="listdata.remarks">
				{{listdata.remarks}}
			</view>
			<view class="picture" v-if="listdata.picture">
				<image class="pictureimg" :src="listdata.picture" mode="aspectFit"></image>
			</view>
		</view>
		<!-- #ifdef APP-PLUS || H5 -->

		<view class="fixdbox" @click="editdata">编辑</view>

		<!-- #endif -->
		<!-- #ifdef MP -->
		<view class="fixdbox">
			<view class="delbox" @click="deldata">
				删除
			</view>

			<view class="editbox" @click="editdata">
				编辑
			</view>

		</view>
		<!-- #endif -->

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
		onShow: function() {
			try {
				const value = uni.getStorageSync('editData');
				if (value) {
					this.listdata = value;
					try {
						uni.removeStorageSync('editData');
					} catch (e) {
						// error
					}
				}
			} catch (e) {
				// error
			}
		},
		onLoad: function(option) {
			if (option.id) {
				this.dataId = option.id;
			}
		},
		props: {},
		onShow() {
			if (this.dataId) {
				this.getoneData(this.dataId);
			}
		},
		data() {
			return {
				dataId: '',
				listdata: {},
				Token:uni.getStorageSync('userId') || '',
			}
		},
		methods: {
			toback() {
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			},
			// 获取数据
			getoneData(id) {
				uniCloud.callFunction({
					name: 'get',
					data: {
						token:this.Token,
						id: id,
						pageNum: 0
					}
				}).then((res) => {
					uni.hideLoading();
					if (res.result.total > 0) {
						this.listdata = res.result.list[0]
					}
				}).catch((err) => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						mask: true,
						title: '未查询到相关信息'
					})
				})
			},
			// 删除数据
			deldata() {
				const _this = this;
				uni.showModal({
					title: '提示',
					content: '是否确认删除此条数据？',
					success: function(res) {
						if (res.confirm) {
							uniCloud.callFunction({
								name: 'remove',
								data: {
									dataId: _this.listdata._id,
									token:_this.Token
								}
							}).then((res) => {
								uni.showToast({
									title: `${res.result.msg}`,
									duration: 2000
								});
								setTimeout(() => {
									_this.toback()
								}, 2000)

							}).catch((err) => {
								uni.showModal({
									content: `操作失败，请重新操作`,
									showCancel: false
								})
								console.error(err)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 修改数据
			editdata() {
				this.listdata.picture = this.listdata.picture ? this.listdata.picture : '';
				console.log("this.listdata:",this.listdata)
				delete this.listdata.uniCloudClientInfo;
				delete this.listdata.useType.uniCloudClientInfo;
				let _item = JSON.stringify(this.listdata)
				uni.redirectTo({
					url: './edit?item=' + _item
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.details {
		.listitem {
			background-color: $uni-text-color-inverse;
			min-height: 100upx;
			padding: 0 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1upx solid $uni-text-color-disable;

			.typeimg {

				display: flex;
				align-items: center;
				justify-content: space-between;

				image {
					width: 80upx;
					height: 80upx;
					border-radius: 50%;
				}
			}

			.iconlabel {
				min-width: 100upx;
				height: 100upx;

				.iconfont {
					width: 70upx;
					height: 70upx;
					border-radius: 50%;
					color: $uni-text-color-inverse;
					font-size: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 10upx;
				}

			}

			.info {
				max-width: 50%;
			}
		}

		.listitem:last-child {
			background-color: $uni-bg-color-hover;
		}

		.picture {
			width: 100%;

			.pictureimg {
				width: 100%;
			}
		}

		.fixdbox {
			width: 100%;
			padding: 25upx 0;
			background-color: $uni-text-color-inverse;
			position: fixed;
			left: 0;
			bottom: 0;
			text-align: center;
			color: $uni-color-primary;
			box-shadow: 0upx -10upx 5upx $uni-text-color-grey;

			.delbox,
			.editbox {
				width: 49.5%;
				height: 100%;
				float: left;
			}

			.delbox {
				color: $uni-color-error;
				border-right: 2upx solid $uni-color-warning;
			}
		}
	}
</style>
