// miniprogram/pages/habit/habit.js
var util = require('../../utils.js');

Page({
  data: { 
    
  },
  onLoad: function(options) {
    
   
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  onPostClick(e){
    wx.navigateTo({
      url: "/pages/diary/newDiary/newDiary"
    })
  },
  showContent(e){
    wx.navigateTo({
      url: "/pages/diary/myDiary/myDiary"
    })
  },

 



  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time=new Date();
    //var time = util.formatTime(new Date());
   /* var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);*/
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      date: time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+"日",
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
