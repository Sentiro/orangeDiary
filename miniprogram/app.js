//app.js
const app = getApp();
App({
  onLaunch: function () {
    
   /* try {
      const e = wx.getSystemInfoSync()
      app.globalData.StatusBar = e.statusBarHeight;
      let custom = wx.getMenuButtonBoundingClientRect();
      app.globalData.Custom = custom;
      app.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      console.log(app.globalData.StatusBar)
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }*/
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
          console.log('[云函数] [login] user openid: ', res.result.openid)
          this.globalData.openid = res.result.openid
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.navigateTo({
            url: '../deployFunctions/deployFunctions',
          })
        }
      })
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let capsule = wx.getMenuButtonBoundingClientRect();
          if (capsule) {
            this.globalData.Custom = capsule;
            this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
          } else {
            this.globalData.CustomBar = e.statusBarHeight + 50;
          }
        }
      })
    }
    
    this.globalData = { 
      currentDate: new Date(),
      openid: '',
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