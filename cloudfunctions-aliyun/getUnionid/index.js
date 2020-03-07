'use strict';
exports.main = async (event, context) => {
	const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session';
	const res = await uniCloud.httpclient.request(apiUrl,
				{			
					method: 'GET',
					dataType:"json",
					data: {
						'grant_type' : 'authorization_code',
						'appid'	  : 'wxbf83b397b1fc28bc',
						'secret'  : 'bce9d786a6702a0dbd62327eb85832ec',
						'js_code' : event.js_code
					}
				});
	console.log(res)
	//event为客户端上传的参数
	console.log('event : ' + event)
	//返回数据给客户端
	return res
};