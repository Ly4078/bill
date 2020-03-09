<template>
	<view class="search">
		<uni-nav-bar fixed="true" status-bar="true" color="#333" background-color="#f1f1f1">
			<view><input class="sinput" type="text" :focus="isfocus" :value="valueInput" placeholder="搜索消费记录" @input="inputValue"
				 @confirm="inputValue" /></view>
			<view slot="left" @click="toback">
				<uni-icons type="back" size="30"></uni-icons>
			</view>
		</uni-nav-bar>
		<view class="" v-if="keys.length>0 && issearch_log">
			<view class="search_log">
				<view class="logs" v-for="(item,index) in keys" :key="index" @click="handlesey(item,index)">
					<text>{{item}}</text>
					<uni-icons type="clear" color="#808080" size="28" @click.stop="handledel(item,index)"></uni-icons>
				</view>
			</view>
			<view class="clearAll" @click="clearAll">
				清除所有
			</view>
		</view>

		<uni-list v-if="!isnull">
			<!-- 占位 -->
			<uni-list-item :show-arrow="false"></uni-list-item>
			<!-- 数据渲染 -->
			<block v-for="(items,indexs) in listData.list" :key="indexs">
				<uni-list-item @click="handleItem(items._id)" @longpress="handleLong(items,indexs)" :title="items.useType.label"
				 @onshowproof="onshowproof" :note="`${items.payType.label}`" :remarks="items.remarks" :amount="items.amount"
				 :picture="items.picture" :datetime="items.useDate" :icons="items.useType.iconclass" :genre="items.genre"
				 :show-arrow="false"></uni-list-item>

			</block>
			<uni-load-more :status="status" :show-icon="true" v-if="showLoadMore"></uni-load-more>
		</uni-list>

		<view class="nodata" v-show="isnull" @click="search">
			<image class="" src="../../static/untils/icons/nodata.png" mode="aspectFit"></image>
			<view class="notxt">
				数据为空，点我重试~
			</view>
		</view>
		<uni-popup ref="searchPopup" type="center">
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
		uniNavBar,
		uniPopup,
		uniLoadMore,
		uniIcons
	} from '@dcloudio/uni-ui';
	let delayTimer;
	export default {
		components: {
			uniList,
			uniListItem,
			uniNavBar,
			uniPopup,
			uniLoadMore,
			uniIcons
		},
		onLoad(option) {
			if (option.label) {
				this.valueInput = option.label;
				this.isfocus = false;
				this.search();
			} else {
				this.getkeys();
			}
		},
		data() {
			return {
				inds: '',
				imgUrl: "",
				pageNum: 0,
				Token: uni.getStorageSync('userId') || '',
				isnull: false,
				isfocus: true,
				issearch: true,
				issearch_log: true,
				opearObj: {},
				valueInput: "",
				keys: [],
				search_keys: [],
				listData: {},
				status: 'more',
				showLoadMore: false,
				loadMoreText: "加载中..."
			}
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
				this.search();
			}
		},
		// 下拉刷新  
		onPullDownRefresh() {
			this.status = 'loading';
			this.showLoadMore = true;
			this.pageNum = 0;
			this.search();
		},
		methods: {
			//返回上一页面
			toback() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 监听输入框 
			inputValue(e) {
				let _value = e.target.value;
				let i = 0;
				if (delayTimer) {
					clearInterval(delayTimer);
				}
				if (!_value && this.isnull) {
					this.showLoadMore = false;
					this.isnull = false;
				}
				delayTimer = setInterval(() => {
					i++;
					if (i === 30) {
						if (_value) {
							this.valueInput = _value;
							this.pageNum = 0;
							this.keys.push(this.valueInput);
							let txt = this.keys.join(',')
							clearInterval(delayTimer);
							try {
								uni.setStorageSync('search_key', txt);
							} catch (e) {
								// error
							}
							this.pageNum = 0;

							this.search();
						}
					}
				}, 50);
			},
			// 搜索相关数据
			search() {
				if (!this.issearch) {
					return
				}
				this.issearch = false;
				this.isfocus = false;
				// this.$refs.picture.close();
				uni.showLoading({
					title: '数据加载中...'
				})
				uniCloud.callFunction({
					name: 'get',
					data: {
						token: this.Token,
						pageNum: this.pageNum,
						label: this.valueInput
					}
				}).then((res) => {
					uni.hideLoading()
					console.log(res)
					this.issearch = true;
					this.showLoadMore = false;
					this.issearch_log = false;
					if (res.result.status == -1) {
						this.isnull = true;
						return
					}
					if (res.result.total > 0) {
						this.isnull = false;
						const _data = [...res.result.list];
						if (this.pageNum == 0) {
							this.listData = res.result;
						} else {
							this.listData.list = this.listData.list.concat(_data)
						}
					} else {
						if (this.pageNum == 0) {
							this.listData = {};
							this.isnull = true;
						}
						let msg = this.pageNum > 0 ? '没有更多数据了' : res.result.data.msg;
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: msg
						})
					}
				}).catch((err) => {
					uni.hideLoading();
					this.issearch = true;
					this.isnull = false;
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '未查询到相关信息'
					})
				})
			},
			// 获取搜记录
			getkeys() {
				try {
					const value = uni.getStorageSync('search_key');
					if (value) {
						let _keys = value.split(',');
						this.keys = Array.from(new Set(_keys));
					}
				} catch (e) {
					// error
				}
			},
			// 选择某个记录搜索
			handlesey(item) {
				this.valueInput = item;
				this.search();
			},
			// 删除某条记录
			handledel(item, index) {
				this.keys.splice(index, 1)
				let txt = this.keys.join(',')
				try {
					uni.setStorageSync('search_key', txt);
				} catch (e) {
					// error
				}
			},
			// 清除所有
			clearAll() {
				this.keys = [];
				try {
					uni.setStorageSync('search_key', '');
				} catch (e) {
					// error
				}
			},
			// 查看凭证图片
			onshowproof(url) {
				this.imgUrl = url;
				this.$refs.picture.open();
			},
			//   点击某条数据查看详情
			handleItem(Id) {
				uni.navigateTo({
					url: './details?id=' + Id
				});
			},
			// 长按某条记录
			handleLong(item, index) {
				this.inds = index;
				this.opearObj = item;
				this.$refs.searchPopup.open();
			},
			// 修改1 删除 2
			moreOper(val) {
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
										dataId: _this.opearObj._id
									}
								}).then((res) => {
									uni.hideLoading();
									uni.showToast({
										title: res.result.msg,
										duration: 2000
									});
									// _this.search();
									_this.listData.list.splice(_this.inds, 1);
								}).catch((err) => {
									uni.hideLoading();
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
				}

				this.$refs.searchPopup.close();
			},
		},
		created() {}
	}
</script>

<style lang="scss" scoped>
	.search {
		.sinput {
			border-bottom: 1upx solid $uni-border-color;
			padding-left: 10upx;
		}

		.search_log {
			background: $uni-text-color-inverse;
			padding: 0 20upx;

			.logs {
				width: 100%;
				padding: 24upx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1upx solid $uni-text-color-disable;

				text {
					color: $uni-text-color-back;
				}
			}

		}

		.clearAll {
			width: 100%;
			height: 100upx;
			line-height: 100upx;
			text-align: center;
			color: $uni-color-primary;
		}


	}
</style>
