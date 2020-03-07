'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command
	/*
	参数说明 
	token:身份验证，必填
	_id：数据ID，必填
	*/

	//  参数校验
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}
	
	let {
		_id,
		...data
	} = event; //更新数据不能修改_id
	data.changeTime = Date.now();
	const resObj = await db.collection('listdata').where({
		token: event.token,
		_id: _id
	}).update(data).then(function(res) {})
	return {
		id: _id
	}
};
