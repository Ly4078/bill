'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ' + event)
  const collection = db.collection('budgetlist')
  const res = await collection.add(event)
  return res
  //返回数据给客户端
  // return event
};
