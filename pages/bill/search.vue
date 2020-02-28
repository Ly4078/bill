<template>
	<view class="search">
		<uni-nav-bar fixed="true" status-bar="true" color="#333" background-color="#f1f1f1">
			<view><input type="text" focus="true" :value="valueInput" placeholder="搜索消费记录" @input="inputValue" /></view>
			<view slot="left" @click="toback">
				<uni-icons type="back" size="30"></uni-icons>
			</view>
		</uni-nav-bar>
		<view class="" v-if="keys.length>0 && listData.length<1 && issearch_log">
			<view class="search_log">
				<view class="logs" v-for="(item,index) in keys" :key="index" @click="handlesey(item)">
					<text>{{item}}</text>
					<uni-icons type="clear" color="#808080" size="28" @click.stop="handledel(item,index)"></uni-icons>
				</view>
			</view>
			<view class="clearAll" @click="clearAll">
				清除所有
			</view>
		</view>

		<uni-list v-show="listData.length">
			<uni-list-item :show-arrow="false"></uni-list-item>
			<uni-list-item v-for="(items,indexs) in listData" :key="indexs" @click="handleItem(items)" @longpress="handleLong(items)"
			 :title="items.useType.label" :note="`${items.payType.label}`" :remarks="items.remarks" :amount="items.amount"
			 :datetime="items.weekday" :icons="items.useType.iconclass" :genre="items.genre" :show-arrow="false"></uni-list-item>
		</uni-list>
		<view class="nodata" v-show="listData.length<1 && !issearch_log">
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
	</view>
</template>

<script>
	import {
		uniList,
		uniListItem,
		uniNavBar,
		uniPopup,
		uniIcons
	} from '@dcloudio/uni-ui';
	let delayTimer;
	export default {
		components: {
			uniList,
			uniListItem,
			uniNavBar,
			uniPopup,
			uniIcons
		},
		onLoad() {
			this.getkeys();
		},
		data() {
			return {
				issearch_log: true,
				opearObj:{},
				valueInput: "",
				keys: [],
				search_keys: [],
				listData: []
			}
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
				console.log(e.target.value)
				let _value = e.target.value;
				let i = 0;
				if (delayTimer) {
					clearInterval(delayTimer);
				}
				if (!_value) {
					this.issearch_log = true;
				}
				delayTimer = setInterval(() => {
					i++;
					if (i === 30) {
						if (_value) {
							this.valueInput = _value;
							this.keys.push(this.valueInput);
							let txt = this.keys.join(',')
							clearInterval(delayTimer);
							try {
								uni.setStorageSync('search_key', txt);
							} catch (e) {
								// error
							}
							this.search();
						}
					}
				}, 50);
			},
			// 搜索相关数据
			search() {
				uni.showLoading({
					title: '数据加载中...'
				})
				uniCloud.callFunction({
					name: 'get',
					data: {
						useTypeLabel: this.valueInput
					}
				}).then((res) => {
					uni.hideLoading()
					this.issearch_log = false;
					if (res.result.affectedDocs > 0) {
						res.result.data.forEach(el => {
							el.weekday = this.utils.getMyDay(el.useDate);
						})
						this.listData = [...res.result.data];
						
					} else {
						this.listData = [];
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: res.result.data.msg
						})
					}
					console.log('res:', res)
				}).catch((err) => {
					uni.hideLoading()
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
				console.log("handlesey:", item)
				this.valueInput = item;
				this.search();
			},
			// 删除某条记录
			handledel(item, index) {
				console.log("handledel")
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
			//   点击某条数据查看详情
			handleItem(item) {
				let _item = JSON.stringify(item)
				uni.navigateTo({
					url: './details?item=' + _item
				});
			},
			// 长按某条记录
			handleLong(item) {
				this.opearObj = item;
				this.$refs.searchPopup.open();
			},
			// 修改1 删除 2
			moreOper(val) {
				const _this = this;
				if (val == 1) {
					this.handleItem(this.opearObj)
			
				} else {
					
					uni.showModal({
						title: '提示',
						content: '是否确认删除此条数据？',
						success: function(res) {
							
							if (res.confirm) {
								uni.showLoading({
									title:"数据删除中..."
								})
								uniCloud.callFunction({
									name: 'remove',
									data: {
										dataId: _this.opearObj._id
									}
								}).then((res) => {
									uni.hideLoading();
									uni.showToast({
										title: `${res.result.msg}`,
										duration: 2000
									});
									_this.search();
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
	.nodata{
		width: 100%;
		margin: 25% 0;
		// background: red;
		text-align: center;
	}
</style>
