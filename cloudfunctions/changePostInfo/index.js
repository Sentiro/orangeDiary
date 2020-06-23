// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
console.log("调用开始")
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let promiseArr=[];
    for(let i=0;i<event.iszan.length;i++){
      promiseArr.push(new Promise((resolve,reject)=>{
      setTimeout(()=>{
      db.collection('post').doc(event.iszan[i].id).update({
      // data 传入需要局部更新的数据
      data: {
        likeNum:event.iszan[i].num
      }
    })
  })
}))
    }
    
   let  promiseArrZan=[];
    for(let j=0;j<event.zanList.length;j++){
      promiseArrZan.push(new Promise((resolve,reject)=>{
      setTimeout(()=>{
      db.collection('post').doc(event.zanList[j].id).update({
      // data 传入需要局部更新的数据
      data: {
        seeNum:event.zanList[j].num
      }
    })
  })
}))
    }

  } catch (e) {
    console.error(e)
  }
}
