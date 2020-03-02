'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)

	/*
	参数说明 
	data: 需要处理的数据,必填
	range: 方式,必填,可选值[year,month],
	year:年份,当range=month时必填
	month:月份,当range=month时必填
	*/

	let _len = 0,
		days = 0,
		isuse = '';
	if (event.range == 'year') {
		_len = 12;
		isuse = 'useMonth';
	}
	if (event.range == 'month') {
		_len = new Date(event.year, event.month, 0).getDate();
		isuse = 'useDay';
	}


	let result = [];
	for (let i = 0; i < _len; i++) {
		let num = Number(i + 1);
		let flag = false;
		for (let j = 0; j < event.data.length; j++) {
			let n = Number(event.data[j][isuse]);
			if (n == num) {
				flag = true;
				break;
			}
		}
		if (!flag) {
			result.push(num);
		}
	}

	for (let k = 0; k < result.length; k++) {
		let obj = {
			useYear: String(event.year),
			intotal: 0,
			extotal: 0,
			total: 0
		}
		if (event.range == 'year') {
			obj.useMonth = Number(result[k]) < 10 ? '0' + result[k] : String(result[k]);
		}
		if (event.range == 'month') {
			obj.useMonth = event.month;
			obj.useDay = Number(result[k]) < 10 ? '0' + result[k] : String(result[k]);
		}
		event.data.push(obj)
	}

	//返回数据给客户端
	return event
};
