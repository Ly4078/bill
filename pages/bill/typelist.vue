<template>
	<view class="edittype">
		<uni-nav-bar fixed="true" status-bar="true" color="#333" background-color="#f1f1f1">
			<view class="swipaction">
				<view :class="genre==1?'exbor':''" @click="handleexin(1)">
					支出
				</view>
				<view :class="genre==2?'inbor':''" @click="handleexin(2)">
					收入
				</view>
				
			</view>
			<view slot="left" @click="toback">
				<uni-icons type="back" size="30"></uni-icons>
			</view>
		</uni-nav-bar>
		<view class="listbox">
			<view class="listitem" v-for="(item,index) in list" :key="index">
				<view class="itemleft">
					<view :class="['iconfont',genre==1?'exclass':'inclass',item.iconclass]"></view>
					<view class="">{{item.label}}</view>
				</view>
				<uni-icons type="more-filled" @click="more(item)"></uni-icons>
			</view>
		</view>
			
		<view class="nodata" v-if="isnull" @click="gettypelist">
			<image class="" src="../../static/untils/icons/nodata.png" mode="aspectFit"></image>
			<view class="notxt">
				数据为空，点我重试~
			</view>
		</view>
		<view class="butbox"></view>
		<button type="default" class="addtypebut" @click="addtype">添加分类</button>
		<uni-popup ref="typepopup" type="center">
			<view class="operating">
				<view class="" @click="moreOper(1)">
					修改
				</view>
				<view class="" @click="moreOper(2)">
					删除
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		uniIcons,
		uniPopup,
		uniNavBar
	} from '@dcloudio/uni-ui';
	export default {
		components: {
			uniIcons,
			uniPopup,
			uniNavBar
		},
		onLoad(option) {
			this.genre = option.genre;
		},
		onShow() {
			this.gettypelist();
		},
		data() {
			return {
				genre: 1,
				isnull: false,
				inds: 0,
				Token: uni.getStorageSync('userId') || '',
				list: []
			}
		},
		methods: {
			// 返回上一页面
			toback() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 切换收入支出
			handleexin(val) {
				this.genre = val;
				this.gettypelist();
				this.$refs.typepopup.close();
			},
			// 获取列表数据
			gettypelist() {
				uni.showLoading({
					title: '数据加载中...',
					mask: true
				})
				uniCloud.callFunction({
					name: 'settype',
					data: {
						pay: 4,
						token: this.Token,
						genre: this.genre
					}
				}).then((res) => {
					uni.hideLoading();
					if (res.result.status == 0) {
						this.isnull = false;
						this.list = [...res.result.list.data];
					} else {
						this.isnull = true;
						this.list = [];
						uni.showToast({
							title: res.result.msg,
							icon: 'none'
						})
					}
				}).catch((err) => {
					uni.hideLoading();
					this.isnull = true;
					uni.showModal({
						content: `操作失败，请重新操作`,
						showCancel: false
					})
				})
			},
			// 添加分类
			addtype() {
				uni.navigateTo({
					url: './addtype?genre=' + this.genre
				});
			},
			// 更多操作
			more(item, index) {
				this.actobj = item;
				this.inds = index;
				this.$refs.typepopup.open();
			},
			// 1 修改 2 删除
			moreOper(val) {
				this.$refs.typepopup.close();
				const _this = this;
				if (val == 1) {
					console.log(this.actobj)
					delete this.actobj.uniCloudClientInfo;
					uni.navigateTo({
						url: './addtype?item=' + JSON.stringify(this.actobj)
					});
				}
				if (val == 2) {
					uni.showModal({
						title: '提示',
						content: '是否确认删除此条数据？',
						success: function(res) {
							if (res.confirm) {
								uni.showLoading({
									title: "数据删除中..."
								})
								_this.$refs.typepopup.close();
								uniCloud.callFunction({
									name: 'settype',
									data: {
										pay: 2,
										token: _this.Token,
										_id: _this.actobj._id
									}
								}).then((res) => {
									uni.hideLoading();
									if (res.result.status == 0) {
										uni.showToast({
											title: res.result.msg,
											duration: 2000
										});
										_this.list.splice(_this.inds, 1);
									} else {
										uni.showToast({
											title: res.result.msg,
											icon: 'none'
										})
									}
								}).catch((err) => {
									uni.hideLoading();
									uni.showToast({
										title: `操作失败，请重新操作`,
										icon: 'none'
									})
								})

							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});

				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.edittype {
		position: relative;
		.listbox{
			height: 80%;
		}
		.listitem {
			width: 90%;
			margin: 2.5%;
			padding: 24upx;
			border-radius: 10upx;
			background-color: $uni-text-color-inverse;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.itemleft {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				justify-content: space-between;

				.iconfont {
					width: 70upx;
					height: 70upx;
					border-radius: 70upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 40upx;
					color: $uni-text-color-inverse;
					margin-right: 20upx;
				}
			}
		}
	}
</style>
