'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)
	
	/*
	函数说明 
	公用函数，根据指定条件，对一维数组进行分类为多维数组
	
	参数说明
	arr:需要分组的数据，必填，
	range:分组方式(日/月)，非必填，可选值[useDay,useMonth]
	label:分组方式，非必填,关键字查询分类
	range与label必填其一
	*/
	let dataArr=[];
	event.arr.map(mapItem => {
		if (dataArr.length == 0) {
			dataArr.push({
				useMonth: mapItem.useMonth,
				useYear: mapItem.useYear,
				useDay: mapItem.useDay,
				useType:mapItem.useType,
				list: [mapItem]
			})
		} else {
			let res = dataArr.some(item => { //判断相同参数，有就添加到当前项
			if(event.range){
				if (item[event.range] == mapItem[event.range]) {
					item.list.push(mapItem)
					return true
				}
			}
			if(event.label){
				if (item.useType.label == mapItem.useType.label) {
					item.list.push(mapItem)
					return true
				}
			}
				
			})
			if (!res) { //如果没找相同参数添加一个新对象
				dataArr.push({
					useMonth: mapItem.useMonth,
					useYear: mapItem.useYear,
					useDay: mapItem.useDay,
					useType:mapItem.useType,
					list: [mapItem]
				})
			}
		}
	})
	
	
	//返回数据给客户端
	return {
		data:dataArr
	}
};
