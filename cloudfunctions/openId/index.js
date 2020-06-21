

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
//查询"附近拼单"
exports.main = async (event, context) => {
  try {
    //order
      return await db.collection('user').where({
      //下面这3行，为筛选条件
      _openid:"oOjE85GnO1eb1FXvBb9QrhFdhIsU"
    }).get({
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}
