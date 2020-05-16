// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//调用数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var userID = wxContext.OPENID;
  var user=null;
  await db.collection('user').where({
    _openid: userID,
  }).get({
    success: (res) => {
      console.log(res.data);
      user = res.data;
    }
  });
  return {
    event,
    openid: wxContext.OPENID,
    user: user
  }
}