<template>
	<view class="edit">
		<uni-nav-bar fixed="true" status-bar="true" color="#333" background-color="#f1f1f1">
			<view class="swipaction">
				<view :class="dataobj.genre==1?'exbor':''" @click="handleexin(1)">
					支出
				</view>
				<view :class="dataobj.genre==2?'inbor':''" @click="handleexin(2)">
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
		<view class="picturebox">
				<view class="upimg" v-if="dataobj.picture">
					<view class="closei" @click="closeimgSrc">
						<uni-icons type="closeempty" size="24" color="#fff"></uni-icons>
					</view>
					<image class="imgsrc" :src="dataobj.picture" mode="aspectFit" @click="seeimgsrc"></image>
				</view>
				
				<view class="plusimg" @click="upload" v-if="!dataobj.picture">
					<uni-icons type="plus" size="70" color="#999"></uni-icons>
					<text v-show="dataobj.genre==1">添加发票或支付截图</text>
					<text v-show="dataobj.genre==2">添加收款凭证或截图</text>
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
					<text class="tlabel">{{item.label}}</text>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="picture" type="center">
			<image :src="dataobj.picture" mode="aspectFit" />
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
				Token:uni.getStorageSync('userId') || '',
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
					remarks:"",
					picture:""
				},
				typeitems:[]
			}
		},
		onLoad: function(option) {
			this.paytype=[ ...this.GlobalJson.paytype];
			
			if(option.item){
				let _dataobj = JSON.parse(option.item);
				this.dataobj=_dataobj
			}else{
				this.dataobj.useDate=this.utils.Format(new Date());
			}
		},
		onShow() {
			this.gettypelist();
		},
		methods: {
			//返回上一页面
			toback() {
				if(this.dataobj._id){
					uni.redirectTo({
					    url: './details?id=' + this.dataobj._id
					});
				}else{
					uni.navigateBack({
						delta: 1
					});
				}
			},
			
			//切换收入支出
			handleexin(val){
				this.$refs.popup.close();
				this.dataobj.genre=val;
				this.gettypelist();
				if(this.dataobj._id){
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
			},
			// 获取类别数据
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
						genre: this.dataobj.genre
					}
				}).then((res) => {
					uni.hideLoading();
					let more=[{
						iconclass: "iconjia",
						label:'编辑',
						isadd:true
					}];
					if (res.result.status == 0) {
						this.isnull = false;
						let _data = [...res.result.list.data];
						 this.typeitems =[..._data,...more];
					} else {
						this.typeitems = [...more];
						uni.showToast({
							title: res.result.msg,
							icon: 'none'
						})
					}
				}).catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: `操作失败，请重新操作`,
						showCancel: false
					})
				})
			},
			// 弹出模态框 
			showModel(val){
				this.ismolnum=val;
				this.$refs.popup.open()
			},
			// 上传文件
			upload() {
				new Promise((resolve, reject) => {
					uni.chooseImage({
						chooseImage: 1,
						success: res => {
							const path = res.tempFilePaths[0]
							const options = {
								filePath: path
							}
							resolve(options)
						},
						fail: () => {
							reject(new Error('Fail_Cancel'))
						}
					})
				}).then((options) => {
					uni.showLoading({
						title: '文件上传中...'
					})
					return uniCloud.uploadFile(options)
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title:'图片上传成功',
						mask:true
					})
					this.dataobj.picture = res.fileID;
				}).catch((err) => {
					uni.hideLoading()
					console.log(err);
					if (err.message !== 'Fail_Cancel') {
						uni.showModal({
							content: `图片上传失败，请重新上传`,
							showCancel: false
						})
					}
				})
			},
			// 查看文件
			seeimgsrc(){
				this.$refs.picture.open();
			},
			// 删除当前文件
			closeimgSrc(){
				this.dataobj.picture='';
			},
			// 保存数据
			saveData(){
		
				  if(!this.dataobj.amount){
					  uni.showToast({
					  	title:'请输入金额',
						icon:'none'
					  })
					  return
				  }
				  if(!this.dataobj.payType.label){
					  uni.showToast({
						title:'请选择方式',
						icon:'none'
					  })
					  return
				  }
				  if(!this.dataobj.useType.label){
				  	uni.showToast({
				  	    title:'请选择方式',
						icon:'none'
				    })
				    return
				  }
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
					_data.token=this.Token;
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
				this.$refs.popup.close();
				if(item.isadd){
					uni.navigateTo({
						url: './typelist?genre='+this.dataobj.genre
					});
				}else{
					this.dataobj.useType=item;
				}
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
		.picturebox{
			display: flex;
			align-items: center;
			justify-content: center;
			.plusimg{
				display: flex;
				flex-direction:column ;
				align-items: center;
				justify-content: center;
				color: $uni-text-color-grey;
			}
			.upimg{
				position: relative;
				.closei{
					width: 50upx;
					height: 50upx;
					border-radius: 50%;
					position: relative;
					right: 0;
					top: 0;
					background-color:$uni-text-color-grey ;
				}
				.imgsrc{
					width: 200upx;
					height: 200upx;
				}
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
				.tlabel{
					font-size: 20upx;
				}
			}
		}
	}
</style>
