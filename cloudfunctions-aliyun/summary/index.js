'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	// 取指令
	const dbCmd = db.command; 
	const $ = db.command.aggregate
	
	/*
	参数说明 
	range:查询范围(年/月)，必填，可选值[year,month]
	yearMonth:查询某月预算信息，非必填，如不填则不查询，当range=month有效
	startTime:查询起始时间点，必填
	endTime:查询结束时间点，必填
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
	if (!event.range) {
		return {
			status: -1,
			msg: 'range必填，可选值[month,year]'
		}
	}
	if (!event.startTime) {
		return {
			status: -1,
			msg: 'startTime必填'
		}
	}
	if (!event.endTime) {
		return {
			status: -1,
			msg: 'endTime必填'
		}
	}

	// 查询startTime至endTime时间段内genre为1(支出)总笔数
	const exCollection = db.collection('listdata').where({
		genre: 1,
		useDategetTime: dbCmd.gte(event.startTime).and(dbCmd.lte(event.endTime))
	})
	const exlistTotal = await exCollection.count();
	resobj.extotal = exlistTotal.total;
	
	// 查询startTime至endTime时间段内genre为2(收入)总笔数
	const inCollection = db.collection('listdata').where({
		genre: 2,
		useDategetTime: dbCmd.gte(event.startTime).and(dbCmd.lte(event.endTime))
	})
	const inlistTotal = await inCollection.count()
	resobj.intotal = inlistTotal.total;

	// //查询符合条件的数据列表
	const collection = db.collection('listdata').where({
		useDategetTime: dbCmd.gte(event.startTime).and(dbCmd.lte(event.endTime))
	})

	// 查询计算收支总额
	const lists = await collection.orderBy("useDategetTime", "desc").get();
	lists.data.forEach(el => {
		if (el.genre == 1) {
			resobj.exAmount += Number(el.amount)
		} else if (el.genre == 2) {
			resobj.inAmount += Number(el.amount)
		}
	})

	// 当按月份查询且有月份参数时，查询月份预算额及数据ID
	if (event.range == 'month' && event.yearMonth) {
		const collection2 = db.collection('budgetlist').where({
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
