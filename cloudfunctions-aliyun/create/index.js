'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const myDate = new Date();
	console.log(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), myDate.getTime());
};
