export default {
	getMyDay(date) { //判断当前日期时间是星期几/上下午
		let arr = date.split(" "),
			week = "",
			oday="";
		if(arr[0]) {//判断是星期几
			let _date=new Date(arr[0])
			switch (_date.getDay()) {
				case 0:
					week = '周日';
					break;
				case 1:
					week = '周一';
					break;
				case 2:
					week = '周二';
					break;
				case 3:
					week = '周三';
					break;
				case 4:
					week = '周四';
					break;
				case 5:
					week = '周五';
					break;
				case 6:
					week = '周六';
					break;
			}
		}
		if(arr[1]){ //判断是上下午
			let _date=arr[1].split(':'),_oday='';
			let _hours=_date[0];
			if(_hours<6){
				_oday='凌晨';
			}else if(_hours<7){
				_oday="早上";
			}else if(_hours<12){
				_oday="上午";
			}else if(_hours<13){
				_oday="中午";
			}else if(_hours<17){
				_oday="下午";
			}else if(_hours<19){
				_oday="傍晚";
			}else if(_hours<24){
				_oday="晚上";
			}
			if(_hours>12){
				_hours=Number(_hours)-12;
			}
			oday=_oday+_hours+':'+_date[1]
		}
		return week+' '+oday;
	},
	monthday(year,month){ //判断某年某月有多少天
		let date = new Date(year, month, 1);
		let _days = new Date(date.getTime() - 864e5).getDate();
		return _days;
	},
	Format(e){
		return `${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()} ${e.getHours()}:${e.getMinutes()}`;
	}
}
