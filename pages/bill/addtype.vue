<template>
	<view class="addtype">
		<uni-nav-bar fixed="true" status-bar="true" left-icon="back" title="添加分类" color="#333" @clickLeft="toback"
		 background-color="#f1f1f1">
		</uni-nav-bar>
		<view class="addname">
			<input type="text"  placeholder="请输入分类名称" maxlength="3" v-model="label" />
			<view :class="['iconfont',genre==1?'exclass':'inclass',iconclass]"></view>
		</view>
		<view class="listIcon">
			<view class="itemicon" v-for="(item,index) in icons" :key="index" @click="handleIocn(item.iconclass,index)">
				<text :class="['iconfont',inds==index?genre==1?'acticon actex':'acticon actin':'',item.iconclass,]"></text>
			</view>
		</view>
		<button type="default" class="addtypebut" @click="save">保存</button>
	</view>
</template>

<script>
	import {
		uniIcons,
		uniNavBar
	} from '@dcloudio/uni-ui';
	export default {
		components: {
			uniIcons,
			uniNavBar
		},
		onLoad(option) {
			
			this.icons = [...this.GlobalJson.typdIcons];
			if (option.genre) {
				this.genre = option.genre;
				this.iconclass = this.icons[0].iconclass;
			}
			if (option.item) {
				this.itemObj = JSON.parse(option.item);
				this.label = this.itemObj.label;
				this.iconclass = this.itemObj.iconclass;
				this.genre=this.itemObj.genre;
				for (let i = 0; i < this.icons.length; i++) {
					if (this.icons[i].iconclass == this.iconclass) {
						this.inds = i;
					}
				}
			}
		},
		data() {
			return {
				label: "",
				iconclass: "",
				itemObj: {},
				inds: 0,
				icons: [],
				genre: 1,
				Token: uni.getStorageSync('userId') || '',
			}
		},
		methods: {
			// 返回上一页面
			toback() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 选中某个图标
			handleIocn(iconclass, index) {
				this.inds = index;
				this.iconclass = iconclass;
			},
			// 保存数据
			save() {
				if (!this.label) {
					uni.showToast({
						title: '请输入类别名称',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title:'数据保存中...',
					mask:true
				})
				const _data = {
					pay: this.itemObj._id?3:1,
					token: this.Token,
					genre: this.genre,
					label: this.label,
					iconclass: this.iconclass
				},_this=this;
				if(this.itemObj._id){
					_data._id=this.itemObj._id;
				}
				uniCloud.callFunction({
					name: 'settype',
					data: _data
				}).then((res) => {
					console.log('res:', res)
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						mask:true
					})
					setTimeout(()=>{
						_this.toback();
					},2000)
				}).catch((err) => {
					uni.hideLoading();
					uni.showModal({
						content: `操作失败，请重新操作`,
						showCancel: false
					})
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.addtype {
		.addname {
			padding: 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: $uni-text-color-inverse;
			border-bottom: 1upx solid $uni-text-color-placeholder;

			.iconfont {
				color: $uni-text-color-inverse;
				width: 80upx;
				height: 80upx;
				border-radius: 80upx;
				font-size: 50upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.listIcon {
			padding: 20upx;
			min-height: 100upx;
			background-color: $uni-text-color-inverse;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;

			.itemicon {
				width: 100upx;
				height: 100upx;
				font-size: 60upx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 10upx;

				.iconfont {
					width: 80upx;
					height: 80upx;
					border-radius: 80upx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: $uni-text-color-placeholder;
					background-color: $uni-bg-color-hover;

				}

				.acticon {
					width: 100upx;
					height: 100upx;
					border-radius: 100upx;
					font-size: 90upx;
					color: $uni-text-color-inverse;
				}

				.actex {
					background-color: $uni-color-exclass;
				}

				.actin {
					background-color: $uni-color-inclass;
				}
			}
		}
	}
</style>
