// pages/myInfo/info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    avatarUrl: 'user-unlogin.png',
    width:5
  },
 
goToAbout(e){
  wx.navigateTo({
    url: 'setUp/about/about'
  })
},

goToHelp(e){
  wx.navigateTo({
    url: 'setUp/help/help'
  })
},

goToThanks(e){
  wx.navigateTo({
    url: 'setUp/thanks/thanks'
  })
},

goToFeedback(e){
  wx.navigateTo({
    url: 'setUp/feedback/feedback'
  })
},
  handleSetUp(e){
    wx.navigateTo({
      url: 'setUp/setUp'
    })
  },
 
  handleHistory(e){
    wx.navigateTo({
      url: 'history/history'
    })
  },
onMyLoveClick(e){
  wx.navigateTo({
    url: 'myLove/myLove'
  })
},

  onShow(){
    
  },
  onLoad() {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  
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