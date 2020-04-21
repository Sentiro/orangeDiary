// miniprogram/pages/habit/createHabit/createHabit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    change:'',
    timeList: [],
    time: '12:01',
    date: '2018-12-25',
    times: 1,
    imgList:[
      {
        index: 0,
        name: "吃药",
        id: "yao"
      }, {
        index: 1,
        name: "社交",
        id: "liaotian"
      }, {
        index: 2,
        name: "吃药",
        id: "yaoping"
      }, {
        index: 3,
        name: "吃药",
        id: "youxi"
      }, {
        index: 4,
        name: "吃药",
        id: "youxi1"
      }, {
        index: 5,
        name: "写日记",
        id: "miao"
      }, {
        index: 6,
        name: "吉他",
        id: "guitar"
      }, {
        index: 7,
        name: "锻炼",
        id: "yaling"
      }, {
        index: 8,
        name: "喝水",
        id: "shuihu"
      }, {
        index: 9,
        name: "记笔记",
        id: "bi"
      }, {
        index: 10,
        name: "刷牙",
        id: "yachi"
      }, {
        index: 11,
        name: "学习",
        id: "bichi"
      }, {
        index: 12,
        name: "喝水",
        id: "icon-test"
      }, {
        index: 13,
        name: "喝水",
        id: "shuibie"
      }, {
        index: 14,
        name: "零食",
        id: "lingshi"
      }, {
        index: 15,
        name: "习惯养成",
        id: "graph"
      }, {
        index: 16,
        name: "好好吃饭",
        id: "mifanMBE"
      }, {
        index: 17,
        name: "查看邮件",
        id: "MAILBOX"
      }, {
        index: 18,
        name: "记录生活",
        id: "SYMPTOMLIST"
      }, {
        index: 19,
        name: "按时睡觉",
        id: "SLEEPDISORDER"
      }, {
        index: 20,
        name: "画画",
        id: "huahua"
      }, {
        index: 21,
        name: "撸铁",
        id: "jirounan"
      }, {
        index: 22,
        name: "运动",
        id: "paobu"
      }, {
        index: 23,
        name: "洗手",
        id: "handwash"
      }, {
        index: 24,
        name: "休息",
        id: "coffee-break"
      }, {
        index: 25,
        name: "休息",
        id: "qiqiu"
      },
    ]
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var time = new Date();
    this.setData({
      date: time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate(),
      time: time.getHours()+":"+time.getMinutes()
    });
    var appInstance = getApp()
    console.log(appInstance.globalData);
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.statusBarHeight)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  changeBackground(e){
    console.log(e.currentTarget.dataset.name);
    this.setData({
      change: e.currentTarget.dataset.name,
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  DelTime(e) {
    this.data.timeList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      timeList: this.data.timeList
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      times: e.detail.value
    })
  },
  formSubmit: function(e) {

    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const db = wx.cloud.database();
    /*var openid = getApp().globalData.openid;
    var habits=db.collection('test').where({
      _openid: openid,
    }).get();
    
    /*habits.habitList.push({
      name: e.detail.habitName,
      times: e.detail.times,
      time: e.detail.time,
    })*/
    db.collection('habit').add({
       // data 字段表示需新增的 JSON 数据
       data: {
         // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
         name: e.detail.value.habitName,
         times: this.data.times,
         time: e.detail.value.time,
         date: e.detail.value.date,
         notification: e.detail.value.notificationb,
         gps: e.detail.value.geob,
         img: this.data.change,
         // 为待办事项添加一个地理位置（113°E，23°N）
         done: false
       },
       success: function (res) {
         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
         console.log(res)
       }
     })
  },
  formReset: function() {
    console.log('form发生了reset事件')
  }
})