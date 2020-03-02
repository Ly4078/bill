'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command
	event.changeTime = Date.now();

	let {_id, ...data} = event;  //更新数据不能修改_id
	data.changeTime=Date.now();
	const resObj = await db.collection('listdata').where({
		_id: _id
	}).update(data).then(function(res) {})
	return {
		id:_id
	}
};
