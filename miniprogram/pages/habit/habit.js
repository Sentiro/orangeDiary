// miniprogram/pages/habit/habit.js
const app = getApp();

Page({
  data: {
    CustomBar: null,
    leader: false,
    hasTeam: true,
    TabCur: '0',
    scrollLeft: 0,
    date: null,
    now: null,
    calendarHide: true,
    clickDate: null,
    //now: new Date(),
    dayStyle: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#f8b600'
      },
      {
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

/*
   日历的操作
*/
  dayClick: function(event) {
    var year = event.detail.year;
    var month = event.detail.month;
    var day = event.detail.day;
    this.setData({
      date: year + "年" + month + "月" + day + "日",
      clickDate: {
        year:event.detail.year,
        month:event.detail.month,
        day:event.detail.day,
      }
    })
    this.setData({
      'dayStyle[0].month': 'current',
      'dayStyle[0].day':event.detail.day,
      'dayStyle[0].color':'white',
      'dayStyle[0].background':'#f8b6005b',
    })
  },
  showCalendar(e) {
    this.setData({
      calendarHide: !this.data.calendarHide
    })
  },
  prev: function (event) {
    this.setData({
      dayStyle:[]
    })
    var month=event.detail.currentMonth;
    var cur=this.data.now;
    //清空datstyle
   
    //如果是当前月
    if(month==cur.month){
      this.setData({
        dayStyle: [{
          month: 'current',
          day: cur.day,
          color: 'white',
          background: '#f8b600'
        },
        {
          month: 'current',
          day: cur.day,
          color: 'white',
          background: '#f8b600'
        }]
      });
      
    }
    if(this.data.clickDate!=null){
      if(month==this.data.clickDate.month){
        this.setData({
          'dayStyle[0].month': 'current',
          'dayStyle[0].day':this.data.clickDate.day,
          'dayStyle[0].color':'white',
          'dayStyle[0].background':'#f8b6005b',
        })
      }
    }
   
  },
  next: function (event) {
    console.log(event.detail);
  },
  onPostClick(e) {
    wx.navigateTo({
      url: "/pages/habit/newHabits/newHabits"
    })
  },
  turnToTeamSetting(){

    //var data = JSON.stringify(this.data.team._id);
    console.log(this.data.team);
    wx.navigateTo({
      url: "/pages/habit/modifyTeam/modifyTeam?teamID="+this.data.team._id
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
    this.setData({
      now:{
        year:time.getFullYear(),
        month:time.getMonth()+1,
        day:time.getDate(), 
      }
    });
    //获取习惯
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
    //获取队伍
    var teamID = 0;
    db.collection('user').where({
      _openid: userID,
    }).get({
      success: (res) => {
        if (teamID != null) {
          teamID = res.data[0].teamID;
          console.log(teamID);
          db.collection('team').doc(teamID).get({
            success: (e) => {
              console.log(e.data);
              console.log(userID == e.data._openid);
              this.setData({
                team: e.data
              });
              if (userID == e.data._openid) {
                this.setData({
                  leader: true
                })
              }
            }
          })
        }
      }
    });
    
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
  onShareAppMessage: function(res) {
    let title, imageUrl;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      title = '加入组队打卡'
      // imageUrl = '***.png';
    }
    return { 
      path: '/pages/habit/team?teamID='+this.data.team._id,
    }
  },
})