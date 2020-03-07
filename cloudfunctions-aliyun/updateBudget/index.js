'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command;

	/*
	参数说明 
	token:身份验证，必填,
	budgetId:数据id,必填
	*/

	// 校验参数
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}
	if (!event.budgetId) {
		return {
			status: -1,
			msg: 'budgetId必填'
		}
	}
	const res = await db.collection('budgetlist').where({
		token: event.token,
		_id: event.budgetId
	}).update({
		budgetTotal: event.budgetTotal
	}).then(function(res) {})
	return res
};
