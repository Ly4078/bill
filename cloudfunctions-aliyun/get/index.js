'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	// 取指令
	const dbCmd = db.command;
	const $ = db.command.aggregate

	/*
	参数说明
	pageNum:页码参数，必填，默认每页返回100条数据,Number>-1
	range:查询类型，非必填[day,month,year]
	label:关键字查询，可匹配payType.label或useType.label中的关键字查询，非必填，
	*/

	// 参数校验
	if (typeof(event.pageNum) == 'undefined') {
		return {
			status: -1,
			msg: 'pageNum必填'
		}
	}
	if (event.pageNum < 0) {
		return {
			status: -1,
			msg: 'pageNum应是小于0的整数'
		}
	}


	// 要返回给客户端的数据
	let resultData = {};

	// 获取查询开始与结束时间
	let endTime = '',
		startTime = '';
	const myDate = new Date();
	let _month = myDate.getMonth() + 1;
	_month = _month < 10 ? '0' + _month : _month;
	let _year = myDate.getFullYear();
	let lastDay = new Date(_year, _month, 0).getDate();
	const eightSecond = 28800000; // 60*60*8*1000

	// 按日查询，计算日结束时间(时间戳)
	if (event.range == 'day') {
		const daySecond = 86400000;
		let firstDay = _year + '/' + _month + '/01' + ' 0:0:0';
		startTime = new Date(firstDay).getTime() - eightSecond;
		endTime = startTime + daySecond;
	}
	// 按月查询，计算月结束时间(时间戳)
	if (event.range == 'month') {
		let firstDay = _year + '/' + _month + '/01' + ' 0:0:0';
		startTime = new Date(firstDay).getTime() - eightSecond;

		let endDay = _year + '/' + _month + '/' + lastDay + ' 23:59:59';
		endTime = new Date(endDay).getTime() - eightSecond;
	}
	// 按年查询，计算月结束时间(时间戳)
	if (event.range == 'year') {
		let firstDay = _year + '/' + '01/01' + ' 0:0:0';
		startTime = new Date(firstDay).getTime() - eightSecond;

		let endDay = _year + '/12/' + lastDay + ' 23:59:59';
		endTime = new Date(endDay).getTime() - eightSecond;
	}

	// 查询数据库
	const collection = db.collection('listdata').where(dbCmd.or({
		useDategetTime: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
	}, {
		useType: {
			label: `/${event.label}/i`
		}
	}, {
		payType: {
			label: `/${event.label}/i`
		}
	}))

	// 查询符合条件数据的总数量
	const totalRes = await collection.count();


	if (totalRes.total > 0) {
		resultData.total = totalRes.total;
		// 查询数据列表
		const list = await collection.orderBy("useDategetTime", "desc").skip(event.pageNum * 100).limit(100).get();
		if (list.affectedDocs > 0) {
			resultData.status = 1;
			resultData.affectedDocs = list.affectedDocs;
			if(event.range == 'year'){
				resultData.year = _year;
				let dataArr = [];
				list.data.map(mapItem => {
					if (dataArr.length == 0) {
						dataArr.push({
							useMonth: mapItem.useMonth,
							useYear: mapItem.useYear,
							list: [mapItem]
						})
					} else {
						let res = dataArr.some(item => { //判断相同日期，有就添加到当前项
							if (item.useMonth == mapItem.useMonth) {
								item.list.push(mapItem)
								return true
							}
						})
						if (!res) { //如果没找相同日期添加一个新对象
							dataArr.push({
								useMonth: mapItem.useMonth,
								useYear: mapItem.useYear,
								list: [mapItem]
							})
						}
					}
				})
				resultData.list = dataArr;
			}else{
				resultData.list = list.data;
				return resultData
			}
		}
		return resultData
	} else {
		return {
			status: -1,
			msg: '未查询到相关数据'
		}
	}
};
