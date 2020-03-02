'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	// 取指令
	const dbCmd = db.command;
	const $ = db.command.aggregate

	//event为客户端上传的参数
	console.log('event : ' + event)

	/*
	参数说明
	range:查询范围(年/月)，必填，可选值[year,month]
	genre:查询收/支,必填，可选值[1支,2收]
	year:查询年限, 非必填,默认为当前年份
	month:查询月份,非必填,默认为当前月份,当range=month有效
	*/

	// 校验参数
	if (!event.range) {
		return {
			status: -1,
			msg: 'range必填，可选值[year,month]'
		}
	}
	if (event.range !== 'year' && event.range !== 'month') {
		return {
			status: -1,
			msg: 'range填空错误，可选值[year,month]'
		}
	}
	if (!event.genre) {
		return {
			status: -1,
			msg: 'genre必填，可选值[1,2]'
		}
	}
	if (event.genre !== 1 && event.genre !== 2) {
		return {
			status: -1,
			msg: 'genre填空错误，可选值[1,2]'
		}
	}

	// 要返回给客户端的数据
	let resultData = {};

	// 获取查询开始与结束时间
	const myDate = new Date();
	let year = event.year ? event.year : myDate.getFullYear(),
		today = myDate.getDate();
	let _month = myDate.getMonth() + 1;
	_month = _month < 10 ? '0' + _month : _month;
	let month = event.month ? event.month : _month;
	// 设置查询条件
	let term = {
		genre: event.genre,
		useYear: String(year),
	}
	if (event.range == 'month') {
		term.useMonth = String(month)
	}

	// 条件查询
	const collection = db.collection('listdata').where(term);

	// 获取符合条件的数据总数
	const totalRes = await collection.count();

	// 获取原始数据
	let num = parseInt(totalRes.total / 100) + 1,
		listData = [];
	for (let i = 0; i < num; i++) {
		let list = await collection.orderBy("useDategetTime", "desc").skip(i * 100).limit(100).get();
		listData = listData.concat(list.data);
	}



	// 数据加工
	let _range = event.range == 'month' ? 'useDay' : 'useMonth';
	// 数据分类分组
	let list1 = await uniCloud.callFunction({
		name: "group",
		data: {
			arr: listData,
			range: _range
		}
	})
	// 计算各项数值
	let total1 = 0;
	list1.result.data.forEach((el) => {
		el.intotal = 0;
		el.extotal = 0;
		el.total = 0;
		el.list.forEach((e) => {
			if (e.genre == 1) {
				el.extotal += Number(e.amount)
			} else if (e.genre == 2) {
				el.intotal += Number(e.amount)
			}
			el.total += Number(e.amount)
		})
		total1 += el.total;
		if (event.range == 'year') {
			delete el.useDay
		}
		delete el.useType;
		delete el.list;
	})
	// 补充空位时间数据
	let eachData = await uniCloud.callFunction({
		name: "supplement",
		data: {
			data: list1.result.data,
			range: event.range,
			year: year,
			month: month
		}
	})
	
	// 计算各项数值所占比例
	eachData.result.data.forEach((el) => {
		el.total = total1;
		let itemTotal = 0;
		if (event.genre == 1) {
			itemTotal = el.extotal;
		} else if (event.genre == 2) {
			itemTotal = el.intotal;
		}
		el.scale = (itemTotal / el.total).toFixed(2)
	})

	// 数据分类分组
	let list2 = await uniCloud.callFunction({
		name: "group",
		data: {
			arr: listData,
			label: 'label'
		}
	})
	// 计算各项数值
	let total2 = 0;
	list2.result.data.forEach((el) => {
		el.intotal = 0;
		el.extotal = 0;
		el.total = 0;
		el.list.forEach((e) => {
			if (e.genre == 1) {
				el.extotal += Number(e.amount)
			} else if (e.genre == 2) {
				el.intotal += Number(e.amount)
			}
			el.total += Number(e.amount)
		})
		total2 += el.total;
		if (event.range == 'year') {
			delete el.useDay
		}
		delete el.list
	})
	// 计算各项数值所占比例
	list2.result.data.forEach((el) => {
		el.total = total2;
		let itemTotal = 0;
		if (event.genre == 1) {
			itemTotal = el.extotal;
		} else if (event.genre == 2) {
			itemTotal = el.intotal;
		}
		el.scale = (itemTotal / el.total).toFixed(2)
	})


	//返回数据给客户端
	return {
		list: listData,
		eachData: eachData,
		list2: list2,
		total: totalRes
	}
};
