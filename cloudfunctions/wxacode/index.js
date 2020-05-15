// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: 'teamID=123456'
    })
    return result
  } catch (err) {
    return err
  }
}