<template>
	<view class="content">
		<view class="title">uniCloud 基础示例</view>
		<view class="tips">
			<view>1.在cloudfunctions目录右键创建并关联服务空间</view>
			<view>2.在cloudfunctions目录右键打开uniCloud控制台，在第1步关联的服务空间里手动创建名为unicloud-test的数据表</view>
			<view>3.在云函数目录（比如：add）右键选择“上传并部署”</view>
			<view>开始愉快的体验uniCloud吧！</view>
		</view>
		<view class="btn-list">
			<button type="primary" @click="add">新增一条数据</button>
			<button type="primary" @click="remove">删除一条数据</button>
			<button type="primary" @click="update">修改数据</button>
			<button type="primary" @click="get">查询前10条数据</button>
			<button type="primary" @click="upload">上传文件</button>
			<image class="upload-preview" :src="imageSrc" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageSrc: ''
			}
		},
		methods: {
			add() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'add',
					data: {
						name: 'DCloud',
						subType: 'uniCloud',
						createTime: Date.now()
					}
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: `成功添加一条数据，文档id为：${res.result.id}`,
						showCancel: false
					})
					console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `添加数据失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			remove() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'remove'
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: res.result.msg,
						showCancel: false
					})
					console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `删除失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			update() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'update',
					data: {
						name: 'DCloud',
						subType: 'html 5+',
						createTime: Date.now()
					}
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: res.result.msg,
						showCancel: false
					})
					console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `更新操作执行失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			get() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'get'
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询成功，获取数据列表为：${JSON.stringify(res.result.data)}`,
						showCancel: false
					})
					console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			logTest() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'log'
				}).then((res) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询成功，获取数据列表为：${JSON.stringify(res.result.data)}`,
						showCancel: false
					})
					console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
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
					console.log(res);
					uni.showModal({
						content: '图片上传成功，已在下方展示',
						showCancel: false
					})
					this.imageSrc = res.fileID
				}).catch((err) => {
					uni.hideLoading()
					console.log(err);
					if (err.message !== 'Fail_Cancel') {
						uni.showModal({
							content: `图片上传失败，错误信息为：${err.message}`,
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>

<style>
	.title {
		font-weight: bold;
		text-align: center;
		padding: 20px 0px;
		font-size: 20px;
	}

	.tips {
		color: #999999;
		font-size: 14px;
		padding: 20px 30px;
	}

	.btn-list {
		padding: 0px 30px;
	}

	.btn-list button {
		margin-bottom: 20px;
	}

	.upload-preview {
		width: 100%;
	}
</style>
