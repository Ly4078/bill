'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const dbCmd = db.command; // 取指令
	const collection = db.collection('list').where(dbCmd.or({
		useDategetTime: dbCmd.gte(event.createTime)
	}, {
		useType: {
			label: `/${event.useTypeLabel}/i`
		}
	}))
	const res = await collection.orderBy("useDategetTime", "asc").get()
	if (res.affectedDocs > 0) {
		return res
	} else {
		return {
			status: 0,
			msg: '未查询到相关数据'
		}
	}



};
