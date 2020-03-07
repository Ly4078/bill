'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	// 取指令
	const dbCmd = db.command;

	/*
	参数说明
	token:身份验证，必填
	pageNum:页码参数，必填，默认每页返回100条数据,Number, pageNum>-1
	range:查询类型，非必填,可选值[day,month,year]
	label:关键字查询,非必填,可匹配payType.label或useType.label中的关键字查询
	year:查询年限, 非必填,默认为当前年份
	month:查询月份,非必填,默认为当前月份
	day:查询日期,非必填,默认为当前日期,
	id:数据ID,非必填,查询单个数据详情
	*/

	// 参数校验
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}
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

	// 获取查询时间
	const myDate = new Date();
	let month = event.month ? event.month : myDate.getMonth() + 1;
	month = Number(month) < 10 ? '0' + Number(month) : month;
	let year = event.year ? event.year : myDate.getFullYear();
	let day = event.day ? event.day : myDate.getDate();
	day = Number(day) < 10 ? '0' + Number(day) : day;
	let term = {};

	if (event.id) {
		term._id = event.id;
	}
	// 按日查询
	if (event.range == 'day') {
		term = {
			useYear: String(year),
			useMonth: String(month),
			useDay: String(day),
			token: event.token
		}
	}
	// 按月查询
	if (event.range == 'month') {
		term = {
			useYear: String(year),
			useMonth: String(month),
			token: event.token
		}
	}
	// 按年查询
	if (event.range == 'year') {
		term = {
			useYear: String(year),
			token: event.token
		}
	}
	resultData.term = term;
	// 查询数据库
	let collection;
	if (event.label) {
		collection = db.collection('listdata').where(dbCmd.or({
			token: event.token,
			useType: {
				label: `/${event.label}/i`
			}
		}, {
			token: event.token,
			payType: {
				label: `/${event.label}/i`
			}
		}))
	} else {
		collection = db.collection('listdata').where(term)
	}

	// 查询符合条件数据的总数量
	const totalRes = await collection.count();

	if (totalRes.total > 0) {
		resultData.total = totalRes.total;
		// 查询数据列表
		const list = await collection.field({ 'token': false }).orderBy("useDategetTime", "desc").skip(event.pageNum * 100).limit(100).get();
		if (list.affectedDocs > 0) {
			resultData.status = 1;
			resultData.affectedDocs = list.affectedDocs;
			if (event.range == 'year') {
				resultData.year = year;
				// 数据分类分组
				let dataArr = await uniCloud.callFunction({
					name: "group",
					data: {
						arr: list.data,
						range: 'useMonth'
					}
				})
				resultData.list = dataArr.result.data;
			} else {
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
