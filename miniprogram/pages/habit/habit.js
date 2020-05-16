// miniprogram/pages/habit/habit.js
const app = getApp();

Page({
  data: {
    CustomBar: null,
    leader: true,
    hasTeam: true,
    TabCur: '0',
    scrollLeft: 0,
    date: null,
    calendarHide: true,
    year: 0,
    month: 0,
    clickDate: null,
    dayStyle: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
      background: '#f8b600'
      }
    ],
    habitList: [],
    teamName: '单词打卡小分队',
    tagColor: 'yellow',
    tagValue: '音乐',
    teamID: '123488',
    teamDetail: '塔里克是保护者星灵，用超乎寻常的力量守护着符文之地的生命',
    teamMember: [{
      openID: null,
      name: "金针小肥猪",
      habitNum: 5,
      completeNum: 4,
      img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'

    }, {
      openID: null,
      name: "金针小肥猪",
      habitNum: 5,
      completeNum: 4,
      img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }]
  },
  tabSelect(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    })
    /*const target = e.currentTarget.dataset.name;//1或者2得到点击了按钮1或者按钮2 
    const url = "/pages/habit/" + target+"/"+target;//得到页面url 
    wx.navigateTo({
      url: url,
    })*/
  },
  dayClick: function(event) {
    var days_style = new Array;
    var year = event.detail.year;
    var month = event.detail.month;
    var day = event.detail.day;
    this.setData({
      date: year + "年" + month + "月" + day + "日",
      clickDate: this.data.date
    })
    days_style.push({
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#f8b600'
    }, {
      month: 'current',
      day: day,
      color: 'white',
        background: '#f8b6005b'
    }, )
    this.setData({
      dayStyle: days_style
    })
  },
  showCalendar(e) {
    this.setData({
      calendarHide: !this.data.calendarHide
    })
  },
  onPostClick(e) {
    wx.navigateTo({
      url: "/pages/habit/newHabits/newHabits"
    })
  },
  turnToTeamSetting(){
    wx.navigateTo({
      url: "/pages/habit/modifyTeam/modifyTeam"
    })
  },
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var time = new Date();
    var appInstance = getApp();
    var userID = appInstance.globalData.openid;
    
    const db = wx.cloud.database();
    db.collection('habit').where({
      _openid: userID,
    }).get({
      success: (res) => {
        console.log(res.data);
        this.setData({
          habitList: res.data
        });
        console.log(habitList);
      }
    });
    db.collection('test').where({
      teamID: userID,
    }).get({
      success: (res) => {
        console.log(res.data);
        this.setData({
         // habitList: res.data
        });
        console.log(habitList);
      }
    });

    //var time = util.formatTime(new Date());
    /* var timestamp = Date.parse(new Date());
     var date = new Date(timestamp);*/
    // 再通过setData更改Page()里面的data，动态更新页面的数据

    this.setData({
      date: time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日",
    });
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

  }
})