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
		<uni-popup ref="popup" type="bottom">
			<view class="tables" v-if="ismolnum==2">
				<view class="payitem" v-for="(item,index) in paytype" :key="index+'ismdel'" @click="handlepay(item)">
					<text>{{item.label}}</text>
				</view>
			</view>
			<view class="tables2" v-if="ismolnum==1">
				<view class="titem" v-for="(item,index) in typeitems" :key="index+'index'" @click="handleType(item)">
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
				ismodel:false,
				ismolnum:1,
				paytype:[],
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
			this.paytype={ ...this.GlobalJson.paytype };
			let _types = { ...this.GlobalJson.expenditure };
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
				  _data.useDategetTime=new Date(_data.useDate).getTime()
				  if(_data._id){
					  eventName="update";
					  // _data.changeTime=Date.now();
					  _data.dataId=_data._id;
					  delete _data._id;
				  }else{
					  eventName="add";
					  // _data.createTime=Date.now();
				  }
				  uniCloud.callFunction({
				    name: eventName,
				    data: _data
				  }).then((res) => {
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
					setTimeout(()=>{
						_this.toback();
					},2500)
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
				//console.log(e); // {year: "2019", month: "07", day: "17", hour: "15", minute: "21"}
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
