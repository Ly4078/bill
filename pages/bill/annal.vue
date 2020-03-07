<template>
	<view class="annal">
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="账单记录" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
		</uni-nav-bar>

		<view class="annallist" v-show="!isnull">
			<uni-list v-for="(item,index) in listData.list" :key="index">
				<uni-list-item class="dateitem" :title="`${item.useYear}年${item.useMonth}月`" budget="查年月账单" :show-arrow="false"
				 @click="handleMonth(item.useYear,item.useMonth)"></uni-list-item>
				<uni-list-item v-for="(items,ind) in item.list" :key="items.id" @click="handleItem(items._id)" @longpress="handleLong(items,index,ind)"
				 @onshowproof="onshowproof" :title="items.useType.label" :note="items.payType.label" :remarks="items.remarks"
				 :amount="items.amount" :datetime="items.useDate" :icons="items.useType.iconclass" :picture="items.picture" :genre="items.genre"
				 :show-arrow="false"></uni-list-item>
			</uni-list>
		</view>
		<view class="nodata" v-if="isnull" @click="getlistdata">
			<image class="" src="../../static/untils/icons/nodata.png" mode="aspectFit"></image>
			<view class="notxt">
				数据为空，点我重试~
			</view>
		</view>
		<uni-popup ref="annalpopup" type="center">
			<view class="operating">
				<view class="" @click="moreOper(1)">
					修改
				</view>
				<view class="" @click="moreOper(2)">
					删除
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="picture" type="center">
			<image :src="imgUrl" mode="aspectFit" />
		</uni-popup>
	</view>
</template>

<script>
	import {
		uniList,
		uniListItem,
		uniPopup,
		uniNavBar
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniList,
			uniListItem,
			uniPopup,
			uniNavBar
		},
		data() {
			return {
				num: 0,
				pageNum: 0,
				executionNum: 0,
				Token:uni.getStorageSync('userId') || '',
				startTime: '',
				imgUrl: "",
				status: 'more',
				listData: [],
				islong: true,
				isnull: false,
				opearObj: {},
				inds: {}
			}
		},
		onShow() {
			this.startTime = new Date();
			this.getlistdata();
		},
		// 监听页面卸载
		onUnload() {
			this.listData = {};
			this.pageNum = 0;
			this.status = "more";
			this.showLoadMore = false;
		},
		// 上拉加载  
		onReachBottom() {
			this.pageNum += 1;
			if (this.pageNum * 100 > this.listData.total) {
				uni.showToast({
					icon: 'none',
					duration: 2000,
					title: '没有更多数据了'
				})
			} else {
				this.status = 'loading';
				this.showLoadMore = true;
				this.getlistdata();
			}
		},
		// 下拉刷新  
		onPullDownRefresh() {
			this.status = 'loading';
			this.showLoadMore = true;
			this.pageNum = 0;
			this.getlistdata();
		},
		methods: {
			// 返回上一页面
			toback() {
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			},
			// 查询数据列表
			getlistdata() {
				uni.showLoading({
					title: '数据加载中...'
				})
				const _data={
						token:this.Token,
						pageNum: this.pageNum,
						range: 'year'
					};
					
				uniCloud.callFunction({
					name: 'get',
					data: _data
				}).then((res) => {
					uni.hideLoading();
					if (res.result.total > 0) {
						this.isnull = false;
						if (res.result.list.length > 0) {
							const _data = [...res.result.list];
							if (this.pageNum == 0) {
								this.listData = res.result;
							} else {
								let newDate = this.listData.list.concat(_data);
								let lastData = this.utils.SplitArr(newDate, 'useMonth');
								this.listData.list = lastData;
							}
						} else {

							if (this.pageNum == 0) {
								this.listData = {};
							}
							let msg = this.pageNum > 0 ? '没有更多数据了' : res.result.data.msg;
							uni.showToast({
								icon: 'none',
								duration: 2000,
								title: msg
							})
						}
					} else {
						this.isnull = true;
						uni.showToast({
							title: '未查询到相关数据',
							icon: 'none',
							duration: 2000
						});
					}

				}).catch((err) => {
					this.isnull = true;
					uni.showToast({
						title: "查询失败，请重试",
						icon: 'none',
						duration: 2000
					});
				})
			},
			//  点击某条记录
			handleItem(Id) {
				this.islong = true;
				uni.navigateTo({
					url: './details?id=' + Id
				});
			},
			// 长按某条记录，选择下一步操作
			handleLong(item, ind1, ind2) {
				if (this.islong) {
					this.islong = false;
					this.inds = {
						ind1: ind1,
						ind2: ind2
					}

					this.opearObj = item;
					this.$refs.annalpopup.open();
				}

			},
			// 修改1 删除 2
			moreOper(val) {
				this.islong = true;
				const _this = this;
				if (val == 1) {
					this.handleItem(this.opearObj._id)
				} else {
					uni.showModal({
						title: '提示',
						content: '是否确认删除此条数据？',
						success: function(res) {
							if (res.confirm) {
								uni.showLoading({
									title: "数据删除中..."
								})
								uniCloud.callFunction({
									name: 'remove',
									data: {
										token:_this.Token,
										dataId: _this.opearObj._id
									}
								}).then((res) => {
									uni.hideLoading();
									uni.showToast({
										title: res.result.msg,
										duration: 2000
									});
									_this.listData.list[_this.inds.ind1].list.splice(_this.inds.ind2, 1);
									_this.inds = {};
								}).catch((err) => {
									uni.hideLoading();
									uni.showModal({
										content: `操作失败，请重新操作`,
										showCancel: false
									})
								})

							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
				this.$refs.annalpopup.close();
			},
			//查看月账单
			handleMonth(year, month) {
				uni.navigateTo({
					url: './chart?year=' + year + "&month=" + month
				});
			},
			// 查看凭证图片
			onshowproof(url) {
				this.imgUrl = url;
				this.$refs.picture.open();
			},
		}
	}
</script>

<style lang="scss">

</style>
