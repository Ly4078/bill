<template>
	<view class="bill">
		<!-- #ifdef MP -->
		<uni-nav-bar fixed="true" status-bar="true" left-icon="search" title="我的帐单儿" color="#333" @clickLeft="clickSearch"
		 background-color="#f1f1f1">
		</uni-nav-bar>
		<!-- #endif -->

		<!-- #ifdef APP-NVUE || H5 -->
		<uni-nav-bar fixed="true" status-bar="true" right-icon="search" title="我的帐单儿" color="#333" @clickRight="clickSearch"
		 background-color="#f1f1f1">
		</uni-nav-bar>
		<!-- #endif -->
		<uni-card mode="basic">
			<view class="expenses">本月支出</view>
			<view class="card-expen">
				<view class="expenses-amount">{{iseye?'****':`¥ ${summary.exAmount}`}}</view>
				<text :class="iseye?'iconfont iconyanjing':'iconfont iconyanjing1'" @click="iseye = !iseye"></text>
			</view>
			<view class="card-expen">
				<view class="amout">
					本月收入<text>{{iseye?'****':`¥ ${summary.inAmount}`}}</text>
				</view>
				<view class="amout" @click="setbudget">
					预算剩余<text>{{iseye?'****':`¥ ${summary.budgetotal-summary.exAmount}`}}</text>
				</view>
			</view>
			<view class="chartsbut">
				<navigator url="./chart">
					<text class="iconfont iconweibiaoti--"></text>
					查看图表分析
				</navigator>
			</view>
		</uni-card>
		<uni-list v-for="(item,index) in lists" :key="index">
			<uni-list-item class="dateitem" :title="item.datetime" :budget="item.budget" :show-arrow="false"></uni-list-item>
			<uni-list-item v-for="(items,indexs) in item.listItem" :key="indexs" @click="handleItem(items)" @longpress="handleLong(items)"
			 :title="items.useType.label" :note="`${items.payType.label}`" :remarks="items.remarks" :amount="items.amount"
			 :datetime="items.weekday" :icons="items.useType.iconclass" :genre="items.genre" :show-arrow="false"></uni-list-item>
		</uni-list>
		<view class="butbox"></view>
		<view class="fixdbox">
			<view class="box">
				<view class="add">
					<navigator url="./edit">
						<uni-icons type="plusempty" size="24" color="#fff"></uni-icons>
						记一笔
					</navigator>
				</view>
				<view class="more" @click="openNavs">
					<uni-icons type="bars" size="30" color="#fff"></uni-icons>
				</view>
			</view>
		</view>
		<uni-popup ref="indpopup" type="center">
			<view class="budbox" v-show="isbudget">
				<view class="atitle">请输入本月预算总额</view>
				<view class="inputval"><input type="number" class="uni-input" v-model="budget" placeholder="请输入预算金额" /></view>
				<button type="primary" @click="submitBudget">确定</button>
			</view>
			<view class="operating" v-show="isoperat">
				<view class="" @click="moreOper(1)">
					修改
				</view>
				<view class="" @click="moreOper(2)">
					删除
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="navs" type="bottom">
			<view class="navsbox">
				<view class="navsitem" v-for="item in navs" :key="item.id" @click="handleNav(item)">
					<view :class="['iconfont',item.iconsClass]">

					</view>
					<text>{{item.value}}</text>
				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		uniCard,
		uniIcons,
		uniPagination,
		uniList,
		uniPopup,
		uniListItem,
		uniNavBar
	} from '@dcloudio/uni-ui'
	// 也可使用此方式引入组件
	// import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue'
	export default {
		components: {
			uniCard,
			uniList,
			uniPopup,
			uniListItem,
			uniIcons,
			uniPagination,
			uniNavBar
		},
		onLoad() {
			this.navs = [...this.Navs.navs];
			const myDate = new Date();
			this.nowdate = {
				year: myDate.getFullYear(),
				month: myDate.getMonth() + 1,
				day: myDate.getDate()
			}
		},
		onShow() {
			this.getSummary();
			this.getData();
		},
		data() {
			return {
				navs: [],
				lists: [],
				budget: '',
				pageNum: 0,
				opearObj: {},
				iseye: false,
				isbudget: false,
				isoperat: false,
				nowdate: {
					year: "",
					month: "",
					day: "",
					startTime: "",
					endTime: ""
				},
				summary: {
					budgetotal: 0, //当月预算金额
					budgetId: '', // 当月预算金额数据ID
					exAmount: 0, //当月支出总额
					inAmount: 0 //当月收入总额
				}
			}
		},
		methods: {
			// 获取汇总数据
			getSummary() {
				let _month = this.nowdate.month < 10 ? '0' + this.nowdate.month : this.nowdate.month;
				this.nowdate.startTime = this.utils.monthDay(this.nowdate.year, this.nowdate.month, 1);
				this.nowdate.endTime = this.utils.monthDay(this.nowdate.year, this.nowdate.month, 2);
				const dataobj = {
					range: "month",
					yearMonth: this.nowdate.year + '-' + this.nowdate.month,
					startTime: this.nowdate.startTime,
					endTime: this.nowdate.endTime
				}
				
				uniCloud.callFunction({
					name: 'summary',
					data: dataobj
				}).then((res) => {
					this.summary = res.result;
					this.budget = res.result.budgetotal;
				}).catch((err) => {
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			//获取列表数据
			getData() {
				this.nowdate.startTime = this.utils.monthDay(this.nowdate.year, this.nowdate.month, 1);
				uniCloud.callFunction({
					name: 'get',
					data: {
						pageNum: this.pageNum,
						range: 'day'
					}
				}).then((res) => {
					let extotal = 0,
						intotal = 0;
					if (res.result.list.length > 0) {
						res.result.list.forEach(el => {
							el.weekday = this.utils.getMyDay(el.useDate);
							if (el.genre == 1) {
								extotal += Number(el.amount)
							} else if (el.genre == 2) {
								intotal += Number(el.amount)
							}
						})
						let obj = {
							datetime: `${this.nowdate.year}-${this.nowdate.month}-${this.nowdate.day}`,
							budget: `收入：${intotal} 支出：${extotal}`,
							listItem: res.result.list
						}
						this.lists = [];
						this.lists.push(obj);
					}
				}).catch((err) => {
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			},
			// 设置预算 
			setbudget() {
				this.isbudget = true;
				this.isoperat = false;
				this.$refs.indpopup.open()
			},
			// 提交预算
			submitBudget() {
				uni.showLoading({
					title: '处理中...'
				})
				let nowmonth = this.nowdate.year + '-' + this.nowdate.month;
				let eventName = "",
					postData = {
						yearMonth: nowmonth,
						createTime: new Date(nowmonth).getTime(),
						budgetTotal: this.budget
					};

				if (this.summary.budgetId) {
					eventName = "updateBudget";
					postData.budgetId = this.summary.budgetId;
				} else {
					eventName = "budget";
				}

				uniCloud.callFunction({
					name: eventName,
					data: postData
				}).then((res) => {
					uni.hideLoading()
					this.$refs.indpopup.close();
					this.isbudget = false;
					uni.showModal({
						content: '设置成功',
						showCancel: false
					})
					this.getSummary();
				}).catch((err) => {
					this.$refs.indpopup.close();
					this.isbudget = false;
					uni.hideLoading()
					uni.showModal({
						content: '设置失败，请重新设置',
						showCancel: false
					})
					console.error(err)
				})
			},
			// 点击顶部搜索按钮
			clickSearch() {
				this.$refs.navs.close();
				this.$refs.indpopup.close();
				uni.navigateTo({
					url: './search'
				});
			},
			//  点击某条记录
			handleItem(item) {
				let _item = JSON.stringify(item)
				uni.navigateTo({
					url: './details?item=' + _item
				});
			},
			// 长按某条记录，选择下一步操作
			handleLong(item) {
				this.opearObj = item;
				this.isoperat = true;
				this.isbudget = false;
				this.$refs.indpopup.open();
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
										icon:'none',
										duration: 2000
									});
									_this.getData();
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
				this.isoperat = false;
				this.$refs.indpopup.close();
			},
			//点击菜单按钮
			openNavs() {
				this.$refs.navs.open();
			},
			// 点击某个菜单跳转到相应页面
			handleNav(item) {
				console.log(item)
				this.$refs.navs.close();
				if (item.id == 1) {
					uni.navigateTo({
						url: './about'
					});
				} else if (item.id == 2) {
					uni.navigateTo({
						url: './site'
					});
				} else if (item.id == 3) {
					uni.navigateTo({
						url: './annal'
					});
				} else if (item.id == 4) {
					uni.navigateTo({
						url: './chart'
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bill {
		background-color: $uni-bg-color-hover;
	}

	.card-expen {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 18upx 0;

		.expenses-amount {
			font-size: 60upx;
			font-weight: bold;
		}

		.amout {
			font-size: 30upx;
			color: $uni-text-color-placeholder;

			text {
				font-weight: bold;
				color: $uni-text-color-back;
				margin-left: 10upx;
			}
		}

		.iconfont {
			font-size: 44upx;
		}
	}



	.chartsbut {
		width: 100%;
		color: $uni-color-success;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		font-weight: bold;

		.iconweibiaoti-- {
			margin-right: 14upx;
		}
	}

	.fixdbox {
		position: fixed;
		right: 30upx;
		bottom: 30upx;
		width: 50%;
		height: 90upx;

		.box {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.add,
			.more {
				height: 100%;
				background: $uni-color-success;
				display: flex;
				justify-content: center;
				align-items: center;
				color: $uni-text-color-inverse;
				font-weight: bold;
				font-size: $uni-img-size-base;
			}

			.add {
				padding: 0 30upx;
				border-radius: 45upx;
			}

			.more {
				width: 90upx;
				border-radius: 50%;
			}
		}
	}

	.budbox {
		width: 500upx;
		padding: 20upx 30upx;
		min-height: 200upx;
		border-radius: 20upx;
		text-align: center;
		background-color: $uni-text-color-inverse;

		input {
			margin: 30upx 0;
			height: 70upx;
			line-height: 70upx;
			border: 1upx solid $uni-text-color-grey;
		}
	}


	.butbox {
		width: 100%;
		height: 100upx;
	}

	.navsbox {
		padding: 30upx;
		background-color: $uni-text-color-disable;
		border-top-right-radius: 60upx;
		border-top-left-radius: 60upx;
		display: flex;
		justify-content: space-around;
		align-items: left;
		flex-wrap: wrap;

		.navsitem {
			width: 28%;
			height: 180upx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			font-size: 40upx;
			margin: 20upx 10upx;
			border-radius: 30upx;
			background-color: $uni-text-color-inverse;

			.iconfont {
				font-size: 80upx;
				font-weight: bold;
				color: $uni-text-color-placeholder;
			}
		}

	}
</style>
