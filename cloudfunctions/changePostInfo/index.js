// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event.data)
    for(var i=0;i<event.data.length;i++){
      return await db.collection('post').doc(event.data[i].id).update({
      // data 传入需要局部更新的数据
      data: {
        likeNum:event.data.iszan[i].num
      }
    })
  
    }
  } catch (e) {
    console.error(e)
  }
}
