'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)
	/*
	函数说明 
	对传值的字符串进行加密解密，保障数据安全性
  
	参数说明 
	way:方式 ，必填 ，可选值[1,2], 1加密  2解密
	strcode:字符串，必填
	*/

	// 校验参数
	if (!event.way) {
		return {
			status: -1,
			msg: 'way必填'
		}
	}

	if (!event.strcode) {
		return {
			status: -1,
			msg: 'strcode必填'
		}
	}
	let code = event.strcode;
	if (event.way == 1) {
		var c = String.fromCharCode(code.charCodeAt(0) + code.length);
		for (var i = 1; i < code.length; i++) {
			c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
		}
		//返回数据给客户端
		return String(escape(c));
	}
	if (event.way == 2) {
		code = unescape(code);
		var c = String.fromCharCode(code.charCodeAt(0) - code.length);
		for (var i = 1; i < code.length; i++) {
			c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
		}
		//返回数据给客户端
		return c;
	}
};
