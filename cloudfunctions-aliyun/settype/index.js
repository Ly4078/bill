'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	/*
	参数说明 
	pay:操作类别 必填  1增 2删 3改 4查
	token:身份验证，必填
	genre:收/支， 必填，1收2支
	label类别名称
	iconclass：图标名称  
	dataId: 数据id
	*/

	// 校验参数
	if (!event.pay) {
		return {
			status: -1,
			msg: 'pay必填'
		}
	}
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}


	if (event.pay == 1) { //1增
		if (!event.label) {
			return {
				status: -1,
				msg: 'label必填'
			}
		}
		if (!event.iconclass) {
			return {
				status: -1,
				msg: 'iconclass必填'
			}
		}
		if (!event.genre) {
			return {
				status: -1,
				msg: 'genre必填'
			}
		}
		// 添加数据创建时间
		event.createTime = Date.now();

		let {
			pay,
			...data
		} = event; //不保存pay参数

		// 保存数据
		const collection = db.collection('listtype');
		const res = await collection.add(data);
		return res
	}

	if (event.pay == 2) { // 2删
		if (!event._id) {
			return {
				status: -1,
				msg: '_id必填'
			}
		}
		const res = await db.collection('listtype').where({
			token: event.token,
			_id: event._id
		}).remove().then(function(res) {})
		return {
			res: res,
			status: 0,
			msg: '删除成功'
		}
	}

	if (event.pay == 3) { // 3改
		let {
			_id,
			pay,
			...data
		} = event; //更新数据不能修改_id   不保存pay参数
		event.changeTime = Date.now();
		const resObj = await db.collection('listtype').where({
			token: event.token,
			_id: _id
		}).update(data).then(function(res) {})
		return {
			resObj:resObj,
			status: 0,
			id: _id
		}
	}

	if (event.pay == 4) { // 4查
		let term = {
			token: String(event.token),
			genre: String(event.genre)
		};
		if (event._id) {
			term._id = event._id
		}

		const collection = db.collection('listtype').where(term);
		// 查询符合条件数据的总数量
		let totalRes = await collection.count();

		if (totalRes.total > 0) {
			const list = await collection.field({
				'token': false
			}).orderBy("createTime", "desc").get();
			return {
				status: 0,
				list: list
			}
		} else {
			return {
				event: event,
				totalRes: totalRes,
				term: term,
				status: -1,
				msg: '未查询到相关数据'
			}
		}
	}
};
