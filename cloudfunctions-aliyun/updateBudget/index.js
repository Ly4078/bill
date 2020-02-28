'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command
	const res = await db.collection('budgetlist').where({
		_id:event.budgetId
	}).update({
		budgetTotal:event.budgetTotal
	}).then(function(res){
	})
	return res
};
