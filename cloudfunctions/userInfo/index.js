// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
//调用数据库
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('yunhanshuzhell!!!');
  var userID = event._openid;
  var user=null;
  return await db.collection('user').where({
    _id: userID,
  }).get({
    success: (res) => {
      return res;
    }, fail(res) { //存入数据库失败
      console.log(res);
      //云函数更新
    }
  });
}