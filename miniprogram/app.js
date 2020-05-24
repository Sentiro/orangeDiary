//app.js
const app = getApp();
var util = require('utils.js');
var plugin = requirePlugin("chatbot");
App({
  onLaunch: function() {

    plugin.init({
      appid: "P5Ot9PHJDechCYqDFAW1AiK6OtG3Ja", //小程序示例账户，仅供学习和参考
      openid: "", //用户的openid，非必填，建议传递该参数
      success: () => { }, //非必填
      fail: (error) => { console.log("init fail") }, //非必填
    });
   
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid);
          this.globalData.openid = res.result.openid;
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.navigateTo({
            url: '../deployFunctions/deployFunctions',
          })
        }
      })
      wx.cloud.callFunction({
        name: 'userInfo',
        success:res=>{
          console.log('[云函数] [userInfo] : ',res.result.event);
        }
      })
    }

    this.globalData = {
      currentDate: new Date(),
      openid: '',
      avatarUrl: './user-unlogin.png',
      userInfo: {},
      logged: false,
      takeSession: false,
      requestResult: ''
      // StatusBar: 0,
      //CustomBar:0,
      //Custom:0
    }
  },
  globalData: {
    StatusBar: 0,
    CustomBar: 0,
    Custom: 0
  },
});

/*
//获取年份  
var Y = date.getFullYear();
//获取月份  
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//获取当日日期 
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
*/