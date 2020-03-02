'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command
	const res = await db.collection('listdata').where({
		_id: event.dataId
	}).remove().then(function(res) {})
	return {
		status: 0,
		msg: '删除成功'
	}
};
