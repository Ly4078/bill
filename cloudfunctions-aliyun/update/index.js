'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command
	event.changeTime = Date.now();
	const resObj = await db.collection('list').where({
		_id: event.dataId
	}).update(event).then(function(res) {})
	return resObj

};
