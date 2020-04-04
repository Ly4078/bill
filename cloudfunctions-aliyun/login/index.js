'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)
	console.log('context : ', context.PLATFORM)
	// 取指令
	const dbCmd = db.command;

	/*
	参数说明 
	phone: 手机（账号），
	password: 密码，
	openid: 微信openid，
	(phone,password) 和 openid 必填其一
	*/

	let collection;
	if(context.PLATFORM == 'mp-weixin'){
		collection = db.collection('users').where(dbCmd.or({
			phone: event.phone?event.phone:''
		}, {
			openid: event.openid?event.openid:''
		}))
	}
	if (event.phone && event.password && context.PLATFORM != 'mp-weixin') {
		collection = db.collection('users').where({
			phone: event.phone,
			password: event.password
		})
	}

	// 查询符合条件数据的总数量
	const totalRes = await collection.count();
	
	if (totalRes.total > 0) {
		const res = await collection.get();
		if (event.phone && context.PLATFORM != 'mp-weixin') {
			// 验证账号密码
			if ((res.data[0].phone == event.phone) && (res.data[0].password == event.password)) {
				return {
					status: 0,
					token: res.data[0]._id
				}
			} else {
				return {
					status: -1,
					msg: '账号或密码错误'
				}
			}
		}
		if (event.openid && context.PLATFORM == 'mp-weixin') {
			if (res.data[0].phone && res.data[0].openid) {
				return {
					status: 0,
					res: res,
					token: res.data[0]._id
				}
			} else if (res.data[0].phone && !res.data[0].openid) {
				const resq = await db.collection('users').where({
					openid: event.openid,
					PLATFORM:'mp-weixin'
				}).remove().then(function(res) {})
				const newres = await db.collection('users').where({
					phone: event.phone
				}).update({
					openid: event.openid
				}).then(function(res) {})
				return {
					status: 0,
					token: res.data[0]._id
				}
			}
			if (!res.data[0].phone && event.phone && event.password) {
				const newres = await db.collection('users').where({
					openid: event.openid
				}).update({
					phone: event.phone,
					password: event.password
				}).then(function(res) {})
				return {
					status: 0,
					token:  res.data[0]._id
				}
			} else {
				return {
					msg: '4',
					status: 1,
					token: res.data[0]._id
				}
			}
		}
	} else {
		// 添加数据创建时间
		event.createTime = Date.now();
		event.PLATFORM = context.PLATFORM;
		// 保存数据
		console.log('event:', event)
		const acollection = db.collection('users');
		const res = await acollection.add(event);
		let _status = 0;
		//返回数据给客户端
		if (event.openid && context.PLATFORM == 'mp-weixin' && !event.phone) {
			_status = 1
		}
		return {
			status: _status,
			token: res.id
		}
	}
};
