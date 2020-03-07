'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	/*
	参数说明 
	token:身份验证，必填
	amount:金额，必填，Number,
	genre:收/支， 必填，1收2支
	payType：收/支款方式 必填
	useType：类别  必填
	remarks：备注 非必填
	*/

	// 校验参数
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}
	if (!event.amount) {
		return {
			status: -1,
			msg: 'amount必填'
		}
	}
	if (!event.genre) {
		return {
			status: -1,
			msg: 'genre必填'
		}
	}
	if (!event.useType) {
		return {
			status: -1,
			msg: 'useType必填'
		}
	}
	if (!event.payType) {
		return {
			status: -1,
			msg: 'payType必填'
		}
	}

	// 添加数据创建时间
	event.createTime = Date.now();
	
	// 保存数据
	const collection = db.collection('listdata')
	const res = await collection.add(event)
	return res
};
