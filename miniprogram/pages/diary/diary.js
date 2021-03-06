// miniprogram/pages/habit/habit.js
var util = require('../../utils.js');

Page({
  data: { 
    ne:[],
  },

  onPostClick(e){
    wx.navigateTo({
      url: "/pages/diary/newDiary/newDiary"
    })
  },
  showContent(e){
    var data = JSON.stringify(e.currentTarget.dataset.key);
    console.log(e.currentTarget.dataset.key);
    wx.navigateTo({
      url: '/pages/diary/myDiary/myDiary?item='+data
    })
  },

 
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

  onLoad: function(options) {
    console.log('zailimian')
    var appInstance = getApp();
    var userID = appInstance.globalData.openid;
    //console.log('成功');
    console.log(userID);
    const db = wx.cloud.database();
    db.collection('diary').where({
      _openid:userID
    }).get({
      success: res => {
        //给ne赋值，方便页面加载。
        this.setData({
          ne: res.data.reverse()
        })
      },
      fail: res=>{
        wx.showToast({
          title: "上传失败",
        })
      }
    })
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
    var page = getCurrentPages().pop();
    console.log(page);
    //if (page == undefined || page == null) return;
    page.onLoad();    
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
