<template>
	<view class="chart">
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="账单详情" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
			<!-- #ifdef APP-NVUE || H5 -->
			<view slot="right" @click="changeYearMonth">{{yearormonth?'月':'年'}}</view>
			<!-- #endif -->
		</uni-nav-bar>

		<uni-card mode="basic" class="cardbox">
			<view class="carditem card_title">
				<uni-icons type="back" size="24" color="#333" @click="handleCard(1)"></uni-icons>
				<text>{{cardtitle}}账单</text>
				<uni-icons type="forward" size="24" color="#333" @click="handleCard(2)"></uni-icons>
			</view>
			<view class="carditem extotal">
				共{{summary.extotal}}笔支出，¥{{summary.exAmount}}
			</view>
			<view class="carditem intotal">
				<text>共{{summary.intotal}}笔收入，¥{{summary.inAmount}}</text>
				<text class="surplus">结余¥{{summary.budgetotal-summary.exAmount}}</text>
			</view>
		</uni-card>
	</view>
</template>

<script>
	import {
		uniCard,
		uniIcons,
		uniNavBar
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniCard,
			uniIcons,
			uniNavBar
		},
		data() {
			return {
				yearormonth: true, // true 按年查询  false 按月查询
				nowdate: {
					year: "",
					month: "",
					day: "",
					startTime: "",
					endTime: "",
				},
				summary: {
					inAmount: 0,
					intotal: 0,
					exAmount: 0,
					extotal: 0,
					budgetotal: 0
				},
				cardtitle: ""
			}
		},
		onLoad(option) {
			const myDate = new Date();
			let _day = myDate.getDate();
			if (option.year) {
				this.nowdate = {
					year: option.year,
					month: option.month,
					day: _day
				};
				this.cardtitle = `${option.year}年${option.month}月`;
			} else {
				this.nowdate = {
					year: myDate.getFullYear(),
					month: myDate.getMonth() + 1,
					day: _day
				};
				this.cardtitle = `${this.nowdate.year}年${this.nowdate.month}月`;
			}

		},
		onShow() {
			// this.getSummary();
			this.getchartData();
		},
		methods: {
			// 返回上一页面
			toback() {
				console.log("back")
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
			},
			// 切换年月
			changeYearMonth() {
				this.yearormonth = !this.yearormonth;
				if (this.yearormonth) {
					this.cardtitle = `${this.nowdate.year}年`;
				} else {
					this.cardtitle = `${this.nowdate.year}年${this.nowdate.month}月`;
				}
				this.getchartData();
				// this.getSummary();
			},
			// 点击card上方向图标，查询前/后一月/年的汇总数据
			handleCard(val) {
				const _this = this;
				if (this.yearormonth) { // 按年度查询
					if (val == 1) {
						this.nowdate.year--;
					} else if (val == 2) {
						this.nowdate.year++;
					}
					this.cardtitle = `${this.nowdate.year}年`;
				} else { // 按月份查询 
					if (val == 1) {
						this.nowdate.month--;
						if (this.nowdate.month == 0) {
							this.nowdate.month = 12;
							this.nowdate.year--;
						}
					} else if (val == 2) {
						this.nowdate.month++;
						console.log(this.nowdate.month)
						if (this.nowdate.month == 13) {
							this.nowdate.month = 1;
							this.nowdate.year++;
						}
					}
					this.cardtitle = `${this.nowdate.year}年${this.nowdate.month}月`;
				}
				setTimeout(() => {
					// _this.getSummary();
					_this.getchartData();
				}, 500)
			},
			// 获取汇总数据
			getSummary() {
				let _month = this.nowdate.month < 10 ? '0' + this.nowdate.month : this.nowdate.month;
				if (this.yearormonth) {
					this.nowdate.startTime = this.utils.monthYear(this.nowdate.year, 1);
					this.nowdate.endTime = this.utils.monthYear(this.nowdate.year, 2);
				} else {
					this.nowdate.startTime = this.utils.monthDay(this.nowdate.year, this.nowdate.month, 1);
					this.nowdate.endTime = this.utils.monthDay(this.nowdate.year, this.nowdate.month, 2);
				}

				const dataobj = {
					range: this.yearormonth ? 'year' : 'month',
					yearMonth: this.nowdate.year + '/' + this.nowdate.month,
					startTime: this.nowdate.startTime,
					endTime: this.nowdate.endTime
				}

				uniCloud.callFunction({
					name: 'summary',
					data: dataobj
				}).then((res) => {
					console.log("res:", res)
					this.summary = res.result;
					console.log("summary:", this.summary)
				}).catch((err) => {
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			//获取图表数据
			getchartData() {
				let postData={
					genre:1,
					range: this.yearormonth?'year':'month',
					year:this.nowdate.year
				}
				if(!this.yearormonth){
					let _month=this.nowdate.month < 10 ? '0' + this.nowdate.month : this.nowdate.month;
					postData.month=_month;
				}
				console.log("postData:",postData)
				uniCloud.callFunction({
					name: 'getchart',
					data: postData
				}).then((res) => {
					console.log("chart:", res)
				}).catch((err) => {
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	.chart {

		/* #ifdef MP-WEIXIN */
		.mpleft {
			margin-left: 60%;
			padding: 5upx;
			padding: 0 50uxp;

			.ymtxt {
				margin: 0 40upx;
				background: red;
			}
		}

		/* #endif */

		.cardbox {
			.carditem {
				padding: 10upx 0;
				font-size: 34upx;
			}

			.card_title {
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: space-around;
			}

			.intotal {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.surplus {
					color: $uni-color-error;
				}
			}
		}
	}
</style>
