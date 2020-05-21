// miniprogram/pages/habit/team/team.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName:'单词打卡小分队',
    tagColor:'yellow',
    tagValue:'音乐',
    teamID:'123488',
    teamDetail: '塔里克是保护者星灵，用超乎寻常的力量守护着符文之地的生命',
    teamMember:[
      {
        openID:null,
        name:"金针小肥猪",
        habitNum: 5,
        completeNum: 4,
        img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
        
      },{
        openID: null,
        name: "金针小肥猪",
        habitNum: 5,
        completeNum: 4,
        img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    db.collection('user').where({
      _openid: userID,
    }).get({
      success: (res) => {
        console.log(res.data);
        this.setData({
          team: res.data
        });
        console.log(habitList);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})