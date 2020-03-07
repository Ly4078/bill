'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command;

	/*
	参数说明
	token:身份验证，必填
	dataId:数据id
	*/

	// 校验参数
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}
	if (!event.dataId) {
		return {
			status: -1,
			msg: 'dataId必填'
		}
	}

	const res = await db.collection('listdata').where({
		token: event.token,
		_id: event.dataId
	}).remove().then(function(res) {})
	return {
		status: 0,
		msg: '删除成功'
	}
};
