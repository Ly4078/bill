export default {
	getMyDay(date) { //判断当前日期时间是星期几/上下午
		let arr = date.split(" "),
			week = "",
			oday = "";
		if (arr[0]) { //判断是星期几
			let _date = new Date(arr[0])
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
		if (arr[1]) { //判断是上下午
			let _date = arr[1].split(':'),
				_oday = '';
			let _hours = _date[0];
			if (_hours < 6) {
				_oday = '凌晨';
			} else if (_hours < 7) {
				_oday = "早上";
			} else if (_hours < 12) {
				_oday = "上午";
			} else if (_hours < 13) {
				_oday = "中午";
			} else if (_hours < 17) {
				_oday = "下午";
			} else if (_hours < 19) {
				_oday = "傍晚";
			} else if (_hours < 24) {
				_oday = "晚上";
			}
			if (_hours > 12) {
				_hours = Number(_hours) - 12;
			}
			oday = _oday + _hours + ':' + _date[1]
		}
		return week + ' ' + oday;
	},
	monthday(year, month) { //判断某年某月有多少天
		let date = new Date(year, month, 1);
		let _days = new Date(date.getTime() - 864e5).getDate();
		return _days;
	},
	// 获取某年某月第一天/最后一天，并返回0:0:0/23:59:59时刻的时间戳
	monthDay(year, month, val) {
		let _month = month < 10 ? '0' + month : month;
		if (val == 1) {
			let days = year + '/' + _month + '/01' + ' 0:0:0';
			return new Date(days).getTime()
		}
		if (val == 2) {
			let lastDay = new Date(year, month, 0).getDate();
			let days = year + '/' + _month + '/' + lastDay + ' 23:59:59';
			return new Date(days).getTime()
		}
	},
	// 获取某年第一天/最后一天，并返回0:0:0/23:59:59时刻的时间戳
	monthYear(year, val) {
		if (val == 1) {
			let days = year + '/' + '01/01' + ' 0:0:0';
			return new Date(days).getTime()
		}
		if (val == 2) {
			let lastDay = new Date(year, 12, 0).getDate();
			let days = year + '/12/' + lastDay + ' 23:59:59';
			return new Date(days).getTime()
		}
	},
	// yyyy-mm-dd hh:mm
	Format(e) {
		let _month = e.getMonth() + 1,
			_day = e.getDate();
		_month = _month < 10 ? '0' + _month : _month;
		_day = _day < 10 ? '0' + _day : _day;
		return `${e.getFullYear()}-${_month}-${_day} ${e.getHours()}:${e.getMinutes()}`;
	},
	// 数组排序
	compare(property) {
		return function(a, b) {
			var value1 = a[property];
			var value2 = b[property];
			return value1 - value2;
		}
	},
	// 生成随机颜色
	randomColor() {
		return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
	},
	//生成从minNum到maxNum的随机数
	randomNum(minNum, maxNum) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * minNum + 1, 10);
				break;
			case 2:
				return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
				break;
			default:
				return 0;
				break;
		}
	},
	/**
	 * 格式化秒
	 * @param int  value 总秒数
	 * @return string result 格式化后的字符串
	 */
	formatSeconds(value) {
		var theTime = parseInt(value); // 需要转换的时间秒 
		var theTime1 = 0; // 分 
		var theTime2 = 0; // 小时 
		var theTime3 = 0; // 天
		if (theTime > 60) {
			theTime1 = parseInt(theTime / 60);
			theTime = parseInt(theTime % 60);
			if (theTime1 > 60) {
				theTime2 = parseInt(theTime1 / 60);
				theTime1 = parseInt(theTime1 % 60);
				if (theTime2 > 24) {
					//大于24小时
					theTime3 = parseInt(theTime2 / 24);
					theTime2 = parseInt(theTime2 % 24);
				}
			}
		}
		var result = '';
		if (theTime > 0) {
			result = "" + parseInt(theTime) + "秒";
		}
		if (theTime1 > 0) {
			result = "" + parseInt(theTime1) + "分" + result;
		}
		if (theTime2 > 0) {
			result = "" + parseInt(theTime2) + "小时" + result;
		}
		if (theTime3 > 0) {
			result = "" + parseInt(theTime3) + "天" + result;
		}
		return result;
	},
	// JS 根据数组对象属性值分类，把一个数组拆分为多个数组
	SplitArr(data, value) {
		let dataArr = [];
		data.map(mapItem => {
			console.log('mapItem:', mapItem)
			if (dataArr.length == 0) {
				dataArr.push({
					useMonth: mapItem.useMonth,
					useYear: mapItem.useYear,
					list: mapItem.list
				})
			} else {
				let res = dataArr.some(item => { //判断相同日期，有就添加到当前项
					console.log("item:", item)
					if (item[value] == mapItem[value]) {
						item.list = item.list.concat(mapItem.list)
						return true
					} else {
						console.log('aa')
					}
				})
				if (!res) { //如果没找相同日期添加一个新对象
					dataArr.push({
						useMonth: mapItem.useMonth,
						useYear: mapItem.useYear,
						list: mapItem.list
					})
				}
			}
		})
		return dataArr
	},
	// 手机号验证
	checkPhone(phone) {
		if ((/^1[3456789]\d{9}$/.test(phone))) {
			return true;
		}else{
			return false;
		}
	}
}
