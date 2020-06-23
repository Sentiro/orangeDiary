const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();//注意，不是wx.cloud.database()，这种是小程序端操作数据库的写法。云端没有“wx.”
 
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()//目的：获取_openid
 
  try {
    return await db.collection("user").add({
      data: {
        _id: wxContext.OPENID,//获取操作者_openid的方法
        teamId: '',
        notify:true,
        match:'未匹配', //未匹配 拒绝匹配 已匹配 
      }, success: res => {
        return '成功添加用户信息'
      }, fail: err => {
        //wx.showToast({
          //icon: 'none',
          //title: '订单发起失败',
        //})
      }
    })
  } catch (e) {
    console.log(e)
  }
}
