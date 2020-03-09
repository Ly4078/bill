'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)

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
	if (event.openid) {
		collection = db.collection('users').where({
			openid: event.openid
		})
	}
	if (event.phone && event.password) {
		collection = db.collection('users').where({
			phone: event.phone,
			password: event.password
		})
	}

	// 查询符合条件数据的总数量
	const totalRes = await collection.count();
	console.log("totalRes:", totalRes)
	if (totalRes.total > 0) {
		const res = await collection.get();
		if (event.phone) {
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
		if (event.openid) {
			if(res.data[0].phone){
				return {
					status: 0,
					token: res.data[0]._id
				}
			}else{
				return {
					status: 1,
					token: res.data[0]._id
				}
			}
		}
	} else {
		// 添加数据创建时间
		event.createTime = Date.now();
		// 保存数据
		console.log('event:', event)
		const acollection = db.collection('users');
		const res = await acollection.add(event);
		//返回数据给客户端
		return {
			status: 0,
			token: res.id
		}
	}
};
