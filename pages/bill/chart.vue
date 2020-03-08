<template>
	<view class="chart">
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="账单详情" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
			<!-- #ifdef  APP-PLUS|| H5 -->
			<view :class="['iconfont titelIcons',yearormonth?'iconGroup-1':'iconGroup-']" slot="right" @click="changeYearMonth">
				<text class="itext">{{yearormonth?'月':'年'}}</text>
			</view>
			<!-- #endif -->
		</uni-nav-bar>

		<uni-card mode="basic" class="cardbox">
			<view class="carditem card_title">
				<!-- #ifdef APP-PLUS || H5 -->
				<uni-icons type="back" size="24" color="#333" @click="handleCard(1)"></uni-icons>
				<text>{{cardtitle}}账单</text>
				<uni-icons type="forward" size="24" color="#333" @click="handleCard(2)"></uni-icons>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<view class="titlebox">
					<uni-icons type="back" size="24" color="#333" @click="handleCard(1)"></uni-icons>
					<text>{{cardtitle}}账单</text>
					<uni-icons type="forward" size="24" color="#333" @click="handleCard(2)"></uni-icons>
				</view>
				<view :class="['iconfont titelIcons',yearormonth?'iconGroup-1':'iconGroup-']" slot="right" @click="changeYearMonth">
					<text class="itext">{{yearormonth?'月':'年'}}</text>
				</view>
				<!-- #endif -->
			</view>
			<view class="carditem extotal">
				共{{summary.extotal}}笔支出，¥{{summary.exAmount}}
			</view>
			<view class="carditem intotal">
				<text>共{{summary.intotal}}笔收入，¥{{summary.inAmount}}</text>
				<text class="surplus">结余¥{{summary.budgetotal-summary.exAmount}}</text>
			</view>
		</uni-card>

		<view class="inorex">
			<view :class="genre==1?'selectbox':''" @click="handinex(1)">
				支出
			</view>
			<view :class="genre==2?'selectbox':''" @click="handinex(2)">
				收入
			</view>
		</view>

		<!-- Number柱状图Compent1 -->
		<view>
			<histogram-chart ref="histogramData" :dataAs="histogramData" canvasId="ht0" />
			<view style="text-align: center;line-height: 40px;">{{yearormonth?'年':'月'}}{{genre==1?'支出':'收入'}}汇总数据</view>
		</view>

		<!-- 饼状图 -->
		<view class="pie_chart">
			<pie-chart ref="pieChart" :dataAs="pieData" canvasId="index_pie_1" />
			<view style="text-align: center;line-height: 40px;">各类别比例分布</view>
		</view>

		<view class="nodata"  v-show="isnull" @click="getchartData">
			<image class="" src="../../static/untils/icons/nodata.png" mode="aspectFit"></image>
			<view class="notxt">
				数据为空，点我重试~
			</view>
		</view>

		<view class="listbox">
			<view class="boxitem" v-for="(item,index) in typedata" :key="index" @click="handletype(item)">
				<view class="usetype">
					<view :class="['iconfont',genre==1?'exclass':'inclass',item.useType.iconclass]"></view>
					{{item.useType.label}}
				</view>
				<view class="">
					{{item.scale}}%
				</view>
				<view class="scale">
					¥ {{genre==1?item.extotal:item.intotal}}
					<uni-icons type="forward" size="30" color="#808080"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniCard,
		uniIcons,
		uniNavBar
	} from '@dcloudio/uni-ui'
	import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue';
	import PieChart from '@/components/stan-ucharts/PieChart.vue';
	export default {
		components: {
			uniCard,
			uniIcons,
			uniNavBar,
			HistogramChart,
			PieChart
		},
		data() {
			return {
				genre: 1,
				resultData: {},
				typedata: [],
				yearormonth: false, // true 按年查询  false 按月查询
				Token:uni.getStorageSync('userId') || '',
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
				cardtitle: "",
				isnull: false,
				histogramData: {
					//总模板
					categories: [],
					series: [{
						name: '', //数据名称
						data: [],
						show: true, //图形显示状态，配合点击图例显示状态，也可默认指定是否显示
						color: '#FF7600', //	图形颜色 不传入则使用系统默认配色方案 即统一柱状图颜色
						textSize: 12 //图形上方标注文字的字体大小

					}]
				},
				pieData: {
					series: []
				}
			}
		},
		onLoad(option) {
			const myDate = new Date();
			if (option.year) {
				this.nowdate = {
					year: String(option.year),
					month: String(Number(option.month) < 10 ? '0' + Number(option.month) : option.month),
					day: String(Number(myDate.getDate() + 1) < 10 ? '0' + myDate.getDate() : myDate.getDate())
				};

			} else {
				this.nowdate = {
					year: String(myDate.getFullYear()),
					month: String(Number(myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1),
					day: String(Number(myDate.getDate() + 1) < 10 ? '0' + myDate.getDate() : myDate.getDate())
				}

			}
			this.cardtitle = `${this.nowdate.year}年${this.nowdate.month}月`;
		},
		onShow() {
			this.getSummary();
			this.getchartData();
		},
		created() {
			// this.Drawing();
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
			// 切换年月
			changeYearMonth() {
				this.yearormonth = !this.yearormonth;
				if (this.yearormonth) {
					this.cardtitle = `${this.nowdate.year}年`;
				} else {
					this.cardtitle = `${this.nowdate.year}年${this.nowdate.month}月`;
				}
				this.getchartData();
				this.getSummary();
			},
			// 点击card上方向图标，查询前/后一月/年的汇总数据
			handleCard(val) {
				const _this = this;
				if (this.yearormonth) { // 按年度查询
					if (val == 1) {
						let year = Number(this.nowdate.year);
						year--;
						this.nowdate.year = String(year);
					} else if (val == 2) {
						let year = Number(this.nowdate.year);
						year++;
						this.nowdate.year = String(year);
					}
					this.cardtitle = `${this.nowdate.year}年`;
				} else { // 按月份查询 
					if (val == 1) {
						let month = Number(this.nowdate.month);
						month--;
						month = month < 10 ? '0' + month : month;
						this.nowdate.month = String(month);
						if (Number(this.nowdate.month) == 0) {
							this.nowdate.month = '12';
							let year = Number(this.nowdate.year);
							year--;
							this.nowdate.year = String(year);
						}
					} else if (val == 2) {
						let month = Number(this.nowdate.month);
						month++;
						month = month < 10 ? '0' + month : month;
						this.nowdate.month = String(month);
						if (Number(this.nowdate.month) == 13) {
							this.nowdate.month = '01';
							let year = Number(this.nowdate.year);
							year++;
							this.nowdate.year = String(year);
						}
					}
					this.cardtitle = `${this.nowdate.year}年${this.nowdate.month}月`;
				}

				setTimeout(() => {
					_this.getSummary();
					_this.getchartData();
				}, 500)
			},
			// 切换支出/收入
			handinex(val) {
				this.genre = val;
				this.getchartData();
			},
			// 点击某个类别，查看详情数据
			handletype(obj) {
				let label = obj.useType.label;
				uni.navigateTo({
					url: './search?label=' + label
				});
			},
			// 获取汇总数据
			getSummary() {
				uni.showLoading({
					title: '数据加载中....',
					mask: true
				})

				const dataobj = {
					range: this.yearormonth ? 'year' : 'month',
					yearMonth: this.nowdate.year + '-' + this.nowdate.month,
					year: this.nowdate.year,
					token:this.Token
				}
				if (!this.yearormonth) {
					dataobj.month = this.nowdate.month
				}

				uniCloud.callFunction({
					name: 'summary',
					data: dataobj
				}).then((res) => {
					uni.hideLoading();
					this.summary = res.result;
				}).catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			//获取图表数据
			getchartData() {
				uni.showLoading({
					title: '数据加载中...',
					mask: true
				})
				let postData = {
					genre: this.genre,
					range: this.yearormonth ? 'year' : 'month',
					year: this.nowdate.year,
					token:this.Token
				}
				if (!this.yearormonth) {
					postData.month = this.nowdate.month;
				}
				uniCloud.callFunction({
					name: 'getchart',
					data: postData
				}).then((res) => {

					let use = this.yearormonth ? 'useMonth' : 'useDay';
					res.result.histogramData.data = res.result.histogramData.data.sort(this.utils.compare(use));
					res.result.pieData.data = res.result.pieData.data.sort(this.utils.compare('scale'));
					this.resultData = { ...res.result
					};
					this.typedata = [...res.result.pieData.data];
					uni.hideLoading();
					this.working();
				}).catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			},
			// 数据加工处理
			working() {
				let _histogramData = {
						categories: [],
						series: []
					},
					_pieData = {
						series: []
					},
					Histog = [...this.resultData.histogramData.data],
					Pie = [...this.resultData.pieData.data],
					hisName = this.genre == 1 ? '支出' : '收入',
					hisdata = [];

				for (let i in Histog) {
					let _month = '';
					if (this.yearormonth) {
						_month = Number(Histog[i].useMonth) + '月';
					} else {
						_month = Number(Histog[i].useDay) + '日';
					}
					_histogramData.categories.push(_month);
					let _value = this.genre == 1 ? Histog[i].extotal : Histog[i].intotal;
					hisdata.push(_value)
				}
				_histogramData.series = [{
					name: hisName,
					data: hisdata,
					show: true, //图形显示状态，配合点击图例显示状态，也可默认指定是否显示
					textSize: 12 //图形上方标注文字的字体大小
				}]
				this.histogramData = { ..._histogramData
				};

				for (let i in Pie) {
					let _obj = {
						name: Pie[i].useType.label,
						data: this.genre == 1 ? Pie[i].extotal : Pie[i].intotal,
					}
					_pieData.series.push(_obj);
				}
				this.pieData = { ..._pieData
				};
				
				if (this.pieData.series.length == 0) {
					this.isnull = true;
				}else{
					this.isnull = false;
				}
				this.Drawing();
			},
			// 绘图
			Drawing() {
				this.$nextTick(() => {
					//柱状图
					this.$refs['histogramData'].showCharts();
					// 饼状图
					this.$refs['pieChart'].showCharts();
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chart {
		.nodata{
			position:absolute;
			top: 300upx;
			background-color: $uni-bg-color-hover;
			width: 100%;
			height: 90%;
			z-index: 2;
		}
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


		.uni-navbar__header-btns-right {
			height: 100%;
		}

		.titelIcons {
			width: 60upx;
			height: 90upx;
			font-size: 80upx;
			position: relative;

			.itext {
				position: relative;
				top: -105upx;
				left: 20upx;
				font-size: 44upx;
			}
		}


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

				/* #ifdef MP-WEIXIN */
				.titlebox {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-around;
				}

				.iconfont {
					width: 10%;
					margin-top: -18upx;
				}

				/* #endif */
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

		.inorex {
			width: 50%;
			margin: 20upx 25%;
			height: 70upx;

			display: flex;
			justify-content: space-around;
			align-items: center;

			&>view {
				width: 130upx;
				height: 100%;
				line-height: 70upx;
				text-align: center;
				background-color: $uni-color-SkyBlue;
				color: $uni-color-primary;
				border-radius: 10upx;
			}

			.selectbox {
				background-color: $uni-color-primary;
				color: $uni-text-color-inverse;
			}
		}

		.listbox {
			width: 100%;
			margin: 30upx 0;

			.boxitem {
				padding: 10upx 10upx 10upx 20upx;
				display: flex;
				background-color: $uni-text-color-inverse;
				justify-content: space-between;
				align-items: center;
				margin: 10upx 0;

				.usetype {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.iconfont {
						width: 60upx;
						height: 60upx;
						border-radius: 50%;
						color: $uni-text-color-inverse;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 36upx;
						margin-right: 10upx;
					}
				}

				.scale {
					display: flex;
					align-items: center;
					justify-content: space-around;
				}
			}
		}
	}
</style>
