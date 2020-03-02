<template>
	<view class="edit">
		<uni-nav-bar fixed="true" status-bar="true" color="#333" background-color="#f1f1f1">
			<view class="swipaction">
				<view :class="dataobj.genre==1?'borbut':''" @click="handleexin(1)">
					支出
				</view>
				<view :class="dataobj.genre==2?'borbut':''" @click="handleexin(2)">
					收入
				</view>
			</view>
			<view slot="left" @click="toback">
				<uni-icons type="back" size="30"></uni-icons>
			</view>
		</uni-nav-bar>
		<view class="box">
			<view class="boxi">
				<view class="boxleft amount">
					<input type="number" v-model="dataobj.amount" placeholder="请输入金额" />元
				</view>
				<view class="boxright" @click="showModel(1)">
					<view v-if="dataobj.useType.iconclass" :class="['iconfont',dataobj.genre==1?'exclass':'inclass',dataobj.useType.iconclass]"></view>
					<text>{{dataobj.useType.label}}</text>
					<uni-icons type="arrowdown"></uni-icons>
				</view>
			</view>
			<view class="boxi">
				<view class="boxleft" @click="openDatetimePicker">
					{{dataobj.useDate}}
				</view>
				<view class="boxright" @click="showModel(2)">
					<text>{{dataobj.payType.label}}</text>
					<uni-icons type="arrowdown"></uni-icons>
				</view>
			</view>
			<view class="boxi">
				<textarea placeholder="备注" v-model="dataobj.remarks" />
				</view>
		</view>
		<button type="primary" class="savebut" @click="saveData">保存</button>
		<!-- <button type="primary" class="savebut" @click="firstAgin">开始</button> -->
		<uni-popup ref="popup" type="bottom">
			<view class="tables" v-if="ismolnum==2">
				<view class="payitem" v-for="(item,index) in paytype" :key="index" @click="handlepay(item)">
					<text>{{item.label}}</text>
				</view>
			</view>
			<view class="tables2" v-if="ismolnum==1">
				<view class="titem" v-for="(item,index) in typeitems" :key="index" @click="handleType(item)">
					<view :class="['iconfont',dataobj.genre==1?'exclass':'inclass',item.iconclass]"></view>
					<text>{{item.label}}</text>
				</view>
			</view>
		</uni-popup>
		<simple-datetime-picker ref="myPicker" @submit="handleSubmit" :start-year="2020" :end-year="2035" color="#007aff"></simple-datetime-picker>
	</view>
</template>

<script>
	import {
		uniIcons,
		uniPopup ,
		uniNavBar
	} from '@dcloudio/uni-ui';
	import simpleDatetimePicker from '@buuug7/uniapp-components/lib/simple-datetime-picker';
	
	export default {
		components: {
			uniIcons,
			uniNavBar,
			uniPopup ,
			simpleDatetimePicker
		},
		data(){
			return{
				statusDay:"2020-03-01 0:0",
				endDay:'2020-03-01 23:59',
				startTime:'',
				endTime:'',
				second:86400000,
				fives:18000000,
				twenty:82800000,
				executionNum:0,
				isAgain:false,
				ismodel:false,
				ismolnum:1,
				paytype:[],
				idArr:[],
				types: {
					collect: [],
					branch: []
				},
				dataobj:{
					genre:1,
					amount:"",
					useDate:"",
					payType:{},
					useType:{},
					remarks:""
				},
				typeitems:[]
			}
		},
		onLoad: function(option) {
			let _paytype={ ...this.GlobalJson.paytype };
			let _types = { ...this.GlobalJson.expenditure };
			for(let j in _paytype){
				this.paytype.push(_paytype[j])
			}
			for (let i in _types) {
				if (_types[i].type == 1) {
					this.types.collect.push(_types[i]);
				} else if (_types[i].type == 2) {
					this.types.branch.push(_types[i]);
				}
			}
			
			this.typeitems= this.types.collect;
			if(option.item){
				let _dataobj = JSON.parse(option.item);
				this.dataobj=_dataobj
			}else{
				this.dataobj.useDate=this.utils.Format(new Date());
			}
		},
		methods: {
			//返回上一页面
			toback() {
				uni.navigateBack({
					delta: 1
				});
			},
			firstAgin(){
				this.startTime=new Date();
				this.first();
			},
			first(){
				const _this=this;
				let userdate=(new Date((new Date(this.statusDay).getTime()+this.second)))
				this.statusDay=this.utils.Format(userdate);
				console.log("=====================================",this.statusDay)
				// console.log(new Date(this.endDay).getTime(),new Date(this.statusDay).getTime())
				if(new Date(this.endDay).getTime()<new Date(this.statusDay).getTime()){
					this.endTime=new Date();
					let second = parseInt((new Date().getTime() - this.startTime.getTime()) / 1000);
					let waste = this.utils.formatSeconds(second)
					console.log("共执行"+this.executionNum+"次任务,耗时"+waste)
					console.log(this.idArr)
					uni.showModal({
					    title: '提示',
					    content: '任务完成',
					    success: function (res) {
					        if (res.confirm) {
					            console.log('用户点击确定');
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					let _num = this.utils.randomNum(5,9),ind=0;
					let t1=new Date(this.statusDay).getTime()+this.fives;
					let t2=new Date(this.statusDay).getTime()+this.twenty;
					
					let timer= setInterval(()=>{
						if(ind<_num){
							ind++;
							let useDate= this.utils.randomNum(t1,t2);
							_this.start(new Date(useDate));
						}else{
							clearInterval(timer);
							_this.first()
						}
					},1200)
				}
			},
			start(useDate){
				let val= this.utils.randomNum(1,2);
				let num = this.utils.randomNum(1,13);
				this.dataobj.genre=val;
				this.dataobj.createTime=useDate.getTime();
				this.dataobj.amount=this.utils.randomNum(0.01,40.99);
				this.dataobj.remarks=num>5?Math.random().toString(36).slice(-num):'';
				if(val == 1){
					this.dataobj.useType=this.types.collect[this.utils.randomNum(0,this.types.collect.length-1)];
				}else{
					this.dataobj.useType=this.types.branch[this.utils.randomNum(0,this.types.branch.length-1)];
				}
				this.dataobj.payType=this.paytype[this.utils.randomNum(0,this.paytype.length-1)];
				this.dataobj.useDate=this.utils.Format(useDate);
				this.saveData();
			},
			//切换收入支出
			handleexin(val){
				this.$refs.popup.close();
				if(this.dataobj._id){
					this.dataobj.genre=val;
					this.dataobj.useType={};
				}else{
					let _Obj={
						genre:val,
						amount:"",
						useDate:"",
						payType:{},
						useType:{},
						remarks:""
					};
					_Obj.useDate=this.utils.Format(new Date());
					this.dataobj=_Obj;
				}
				if(val==1){
					this.typeitems= this.types.collect;
				}else{
					this.typeitems=this.types.branch;
				}
			},
			// 弹出模态框 
			showModel(val){
				this.ismolnum=val;
				this.$refs.popup.open()
			},
			// 保存数据
			saveData(){
				  uni.showLoading({
				    title: '数据保存中...',
					mask:true
				  })
				  let _data={...this.dataobj},eventName='',_this=this;
				  _data.useDategetTime=new Date(_data.useDate).getTime();
				  let dateArr=_data.useDate.split(' ');
				  let dateArr2 = dateArr[0].split('-');
				  _data.useYear=dateArr2[0];
				  	_data.useMonth=dateArr2[1];
				  	_data.useDay=dateArr2[2];
					_data.useHour=dateArr[1];
				  if(_data._id){
					  eventName="update";
				  }else{
					  eventName="add";
				  }
		
				  uniCloud.callFunction({
				    name: eventName,
				    data: _data
				  }).then((res) => {
					  console.log(res)
					  if(res.result.id){
						  this.idArr.push(res.result.id);
						    this.executionNum++;
						  uni.hideLoading()
						  uni.showToast({
						  	title:'数据保存成功',
						  	mask:true,
						  	duration:2000
						  })
						  if(_data.dataId){
						  	_data._id=_data.dataId;
						  	delete _data.dataId;
						  	try {
						  	    uni.setStorageSync('editData', _data);
						  	} catch (e) {
						  	    // error
						  	}
						  }
						  // setTimeout(()=>{
						  // 	_this.toback();
						  // },2500)
					  }else{
						  uni.showToast({
						  	title:'保存失败，请重新输入',
							icon:'none',
						  	mask:true,
						  	duration:2000
						  })
					  }
				  }).catch((err) => {
				    uni.hideLoading()
				    uni.showToast({
				    	title:'数据保存失败，请重新保存',
						mask:true,
						icon :'none',
				    	duration:2000
				    })
				    console.error(err)
				  })
			},
			//选择某个pay方式 
			handlepay(item){
				this.dataobj.payType=item;
				this.$refs.popup.close();
			},
			// 选择某个类别
			handleType(item){
				this.dataobj.useType=item;
				this.$refs.popup.close();
			},
			// 打开picker
			openDatetimePicker() {
				this.$refs.myPicker.show();
			},
			// 关闭picker
			closeDatetimePicker() {
				this.$refs.myPicker.hide();
			},
			// 确定选择的日期时间
			handleSubmit(e) {
				// console.log(e); // {year: "2019", month: "07", day: "17", hour: "15", minute: "21"}
				if (e.year && e.month && e.day) {
					this.dataobj.useDate = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.edit {
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
			.borbut{
				color:$uni-color-primary;
				border-bottom: $uni-border-radius-base solid $uni-color-primary;
			}
		}
		.box{
			width: 96%;
			min-height: 300upx;
			margin: 2%;
			border: 1upx solid $uni-text-color-disable;
			border-radius: 5upx;
			.boxi{
				border-bottom: 1upx solid $uni-text-color-disable;
				padding: 20upx 5upx;
				min-height: 70upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				textarea{
					max-height: 140upx;
					width: 96%;
					margin: 0 2%;
				}
				.amount{
					color: $uni-text-color-placeholder;
					display: flex;
					justify-content: space-around;
					align-items: center;
					input{
						color: $uni-text-color;
					}
				}
				.boxleft{
					width: 50%;
					height: 100%;
					border-right:  1upx solid $uni-text-color-disable;
					padding:0 5%;
				}
				.boxright{
					width: 34%;
					height: 100%;
					padding: 0 3%;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.iconfont{
						width: 70upx;
						height: 70upx;
						border-radius: 50%;
						color: $uni-text-color-inverse;
						font-size: 50upx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
			.boxi:last-child{
				border: none;
			}
		}
		.savebut{
			width: 70%;
			margin-left: 15%;
			margin-top: 50upx;
		}
		.tables{
			width: 96%;
			padding:60upx 2% 0 2%;
			background: #fff;
			height: 70%;
			border-top-right-radius: 60upx;
			border-top-left-radius: 60upx;
			.payitem{
				height: 100upx;
				line-height: 100upx;
				border-bottom: 1upx solid $uni-text-color-disable;
				text{
					margin-left: 20upx;
				}
			}
		}
		
		.tables2{
			width: 96%;
			padding:60upx 2% 0 2%;
			background: #fff;
			height: 70%;
			border-top-right-radius: 60upx;
			border-top-left-radius: 60upx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;
			.titem{
				width: 80upx;
				display: flex;
				flex-direction:column;
				justify-content: space-around;
				align-items: center;
				font-size: 40upx;
				margin: 20upx 10upx;
				.iconfont{
					width: 60upx;
					height: 60upx;
					margin-bottom: 10upx;
					color: $uni-text-color-inverse;
					font-size: 40upx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
				}
			}
		}
	}
</style>
