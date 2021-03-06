// miniprogram/pages/myInfo/myLove/myLove.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    postIds: [],
    iszan:[],
    id:null,
    modalName:"DialogModal"
  },

  onTextTouched(e) {
    this.setData({
      id: e.currentTarget.dataset.index
    })
  },
  
  upLoadChange() {
    this.setData({
      iszan: wx.getStorageSync('zan') || []
    })
    const db = wx.cloud.database()
    var appInstance = getApp();
    var userID = appInstance.globalData.openid;

    wx.cloud.callFunction({
      name: "changePostInfo",
      data: {
        iszan: this.data.iszan
      },
      success(res) {
        console.log("修改成功")
      },
      fail(res) {
        console.log("调用失败" + res)
      }
    })
    db.collection("user").where({
      _openid: userID
    }).get({
      success: (res) => {
        var id = res.data[0]._id;
        db.collection("user").doc(id).update({
          data: {
            likeList: this.data.iszan
          },

        })
      },
      fail: (res) => {
        console.log("查询user数据库调用失败")
      }
    })
  },

  zan: function (item_id) {
    var that = this;
    var item = null;
    var cookie = wx.getStorageSync('zan') || [];  //获取全部点赞的id
    for (var i = 0; i < that.data.postList.length; i++) {
      if (that.data.postList[i]._id == item_id) {     //数据列表中找到对应的id
        var num = that.data.postList[i].likeNum;      //当前点赞数
        item = { id: item_id, num: num };
        if (this.contain(cookie, item)) {      //已经点过赞了，取消点赞
          for (var j in cookie) {
            if (cookie[j].id == item_id) {
              cookie.splice(j, 1);  //删除取消点赞的id
              --num;  //点赞数减1
              that.setData({
                [`postList[${i}].likeNum`]: num,         //es6模板语法，常规写法报错
                [`postList[${i}.].state`]: false    //我的数据中state为'false'是未点赞
              })
              wx.setStorageSync('zan', cookie);
              wx.showToast({
                title: "取消收藏!",
                icon: 'none'
              })
              break;
            }
          }

        } else {        //点赞操作
          ++num;    //点赞数加1
          that.setData({
            [`postList[${i}].likeNum`]: num,
            [`postList[${i}.].state`]: true
          })
          item = { id: item_id, num: num }
          cookie.unshift(item);   //新增赞的id
          wx.setStorageSync('zan', cookie);
          wx.showToast({
            title: "收藏成功!",
            icon: 'none'
          })
        }
      }
    }
  },

  contain(cookie, item) {
    for (var i = 0; i < cookie.length; i++) {
      if (cookie[i].id == item.id && cookie[i].num == item.num) {
        return true;
      }
    }
    return false;
  },

  // 点赞函数  获取对应id
  thumbsup: function (e) {
    var shareid = e.currentTarget.dataset.id;
    this.zan(shareid);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    var appInstance = getApp();
    var userID = appInstance.globalData.openid;

    db.collection('user').where({
      _openid: userID,
    }).get({
      success: (res) => {
        this.setData({
          postIds: res.data[0].likeList
        })
        let promiseArr = [];
        for (let i = 0; i < this.data.postIds.length; i++) {
          promiseArr.push(new Promise((resolve, reject) => {
            setTimeout(() => {
              db.collection('post').doc(this.data.postIds[i].id).get({
                success: (res) => {
                  res.data.state=true;
                  this.data.postList.push(res.data)
                  resolve()
                }
              })
            })
          }))
        }
        Promise.all(promiseArr).then((res) => {
        this.setData({
          postList:this.data.postList
        })
      }).catch((err) => {
        console.log(err);
      })
      }
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
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
    console.log("页面隐藏")
    this.upLoadChange()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("页面卸载")
    this.upLoadChange()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.upLoadChange();
    this.onLoad();
    wx.stopPullDownRefresh({
      complete: (res) => {},
    })
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