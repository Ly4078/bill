'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)

	/*
	参数说明 
	token:身份验证，必填
	*/

	// 校验参数
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}

	const collection = db.collection('budgetlist')
	const res = await collection.add(event)

	//返回数据给客户端
	return res
};
