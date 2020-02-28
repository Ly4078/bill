'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)

	const dbCmd = db.command // 取指令
	const resobj = {
		budgetotal: 0, //当月预算金额
		budgetId:'',
		expenses: 0, //当月支出总额
		income: 0 //当月收入总额
	}
	const collection = db.collection('list').where({
		useDategetTime: dbCmd.gte(event.createTime)
	})
	const lists = await collection.get();
	lists.data.forEach(el => {
		if (el.genre==1) {
			resobj.expenses += Number(el.amount)
		} else if (el.genre==2){
			resobj.income += Number(el.amount)
		}
	})


	const collection2 = db.collection('budgetlist').where({
		createTime: event.yearMonth
	})
	const budgetobj = await collection2.get();

	if(budgetobj.data.length){
		resobj.budgetotal = Number(budgetobj.data[0].budgetTotal);
		resobj.budgetId = budgetobj.data[0]._id;
	}

	
	//返回数据给客户端
	return resobj
};
