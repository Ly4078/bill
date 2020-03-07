'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	// 取指令
	const dbCmd = db.command;
	const $ = db.command.aggregate

	/*
	参数说明 
	token:身份验证，必填
	range:查询范围(年/月)，必填，可选值[year,month]
	yearMonth:查询某月预算信息，非必填，如不填则不查询，当range=month有效
	year:查询年限,必填
	month:查询月份,非必填
	day:查询日期,非必填
	*/

	//event为客户端上传的参数
	console.log('event : ' + event)

	// 要返回给客户端的数据
	const resobj = {
		inAmount: 0, //收入总额
		intotal: 0, //收入总笔数
		exAmount: 0, //支出总额
		extotal: 0, // 支出总笔数
		budgetId: '', //预算数据ID
		budgetotal: 0 //预算金额
	}

	//  参数校验
	if (!event.token) {
		return {
			status: -1,
			msg: 'token必填'
		}
	}
	if (!event.range) {
		return {
			status: -1,
			msg: 'range必填，可选值[month,year]'
		}
	}
	if (!event.year) {
		return {
			status: -1,
			msg: 'year必填'
		}
	}

	// 获取查询时间
	const myDate = new Date();
	let term = {
		useYear: String(Number(event.year) < 10 ? '0' + Number(event.year) : event.year),
		token: event.token
	};
	if (event.month) {
		term.useMonth = String(Number(event.month) < 10 ? '0' + Number(event.month) : event.month);
	}
	if (event.day) {
		term.useDay = String(Number(event.day) < 10 ? '0' + Number(event.day) : event.day);
	}

	// 查询时间段内genre为1(支出)总笔数
	const exCollection = db.collection('listdata').where(dbCmd.and([{
		genre: 1
	}, term]));
	const exlistTotal = await exCollection.count();
	resobj.extotal = exlistTotal.total;

	// 查询时间段内genre为2(收入)总笔数
	const inCollection = db.collection('listdata').where(dbCmd.and([{
		genre: 2
	}, term]));
	const inlistTotal = await inCollection.count();
	resobj.intotal = inlistTotal.total;

	// //查询符合条件的数据列表
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

	// 计算时间段内支出/收入总额
	if (listData.length > 0) {
		listData.forEach(el => {
			if (el.genre == 1) {
				resobj.exAmount += Number(el.amount)
			} else if (el.genre == 2) {
				resobj.inAmount += Number(el.amount)
			}
		})
	}

	// 当按月份查询且有月份参数时，查询月份预算额及数据ID
	if (event.range == 'month' && event.yearMonth) {
		const collection2 = db.collection('budgetlist').where({
			token:event.token,
			yearMonth: event.yearMonth
		})
		const budgetobj = await collection2.get();
		if (budgetobj.data.length) {
			resobj.budgetotal = Number(budgetobj.data[0].budgetTotal);
			resobj.budgetId = budgetobj.data[0]._id;
		}
	}

	//返回数据给客户端
	return resobj
};
