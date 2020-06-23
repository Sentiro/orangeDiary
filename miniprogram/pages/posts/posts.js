// miniprogram/pages/posts/posts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    postIds: [],
    iszan: [],        //点过赞的id集合
    zanList:[],
    id: null,
    TabCur: 0,
    scrollLeft:0
  },
  
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
     if(this.data.TabCur==0){
       this.sortByTime(this.data.postList)
    }
    if(this.data.TabCur==1){
      this.sortByLikeNum(this.data.postList)
    }
  },

  sortByTime(list){
    this.setData({
    postList:list.sort((a, b) => {
      var aDatestr = a.date + " " + a.time;
      var bDatestr = b.date + " " + b.time;
      var aDate = new Date(aDatestr);
      var bDate = new Date(bDatestr);
      if (aDate > bDate)
        return -1;
      else if (aDate < bDate)
        return 1;
      else {
        return 0;
      }
   })
  })
  },

  sortByLikeNum(list){
    this.setData({
      postList:list.sort((a, b) => {
        if(a.likeNum>b.likeNum)
          return -1;
        if(a.likeNum<b.likeNum)
          return 1;
        if(a.likeNum==b.likeNum)
          return 0;
      })
    })
  },

  onTextTouched(e) {
    this.setData({
      id: e.currentTarget.dataset.index
    })
  },

  onPostClick(events) {
    this.upLoadChange()
    wx.navigateTo({
      url: "newPost/newPost",
      complete: (res) => { },
      events: events,
      fail: (res) => { },
      success: (result) => { },
    })
  },

  upLoadChange() {
    console.log("上传数据调用")
    this.setData({
      iszan: wx.getStorageSync('zan') || []
    })
    const db = wx.cloud.database()
    var appInstance = getApp();
    var userID = appInstance.globalData.openid;

    wx.cloud.callFunction({
      name: "changePostInfo",
      data: {
        iszan: this.data.iszan,
        zanList: wx.getStorageSync('dianZan') || []
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
            likeList: this.data.iszan,
            zanList:this.data.zanList
          },

        })
      },
      fail: (res) => {
        console.log("查询user数据库调用失败")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      TabCur:0
    })
    const db = wx.cloud.database()
    var p=new Promise((resolve, reject) => {
      setTimeout(() => {
        db.collection('post').get({
          success: (res) => {
            this.sortByTime(res.data)
            resolve();
          },
          fail: (res) => {
            console.log("调用失败")
          }
        });
      })

    })
  

    Promise.all([p]).then((res) => {
      var cookie = wx.getStorageSync('zan')||[];
      var cookieZan = wx.getStorageSync('dianZan')||[];
      if (cookie.length==0||cookieZan.length==0) {
        wx.setStorageSync('zan', this.data.iszan)
        var appInstance = getApp();
        var userID = appInstance.globalData.openid;

        var p1 = new Promise((resolve, reject) => {
          setTimeout(() => {
            db.collection('user').where({
              _openid: userID,
            }).get({
              success: (res) => {
                this.setData({
                  postIds: res.data[0].likeList||[],
                  zanList:res.data[0].zanList||[]
                })
                resolve();
              }
            })
          })
        })
        Promise.all([p1]).then((res) => {
          wx.setStorageSync('zan', this.data.postIds)
          cookie = this.data.postIds
          for (var j = 0; j < cookie.length; j++) {
            for (var i = 0; i < this.data.postList.length; i++) {
              if (this.data.postList[i]._id == cookie[j].id) {
                this.setData({
                  [`postList[${i}.].state`]: true
                })
                break;
              }
            }
          }

          wx.setStorageSync('dianZan', this.data.zanList)
          cookie = this.data.zanList
          for (var j = 0; j < cookie.length; j++) {
            for (var i = 0; i < this.data.postList.length; i++) {
              if (this.data.postList[i]._id == cookie[j].id) {
                this.setData({
                  [`postList[${i}.].zanState`]: true
                })
                break;
              }
            }
          }
        })
      }else{
      for (var j = 0; j < cookie.length; j++) {
        for (var i = 0; i < this.data.postList.length; i++) {
          if (this.data.postList[i]._id == cookie[j].id) {
            this.setData({
              [`postList[${i}.].state`]: true
            })
            break;
          }
        }
      }

      for (var j = 0; j < cookieZan.length; j++) {
        for (var i = 0; i < this.data.postList.length; i++) {
          if (this.data.postList[i]._id == cookieZan[j].id) {
            this.setData({
              [`postList[${i}.].zanState`]: true
            })
            break;
          }
        }
      }
    }
    }).catch((err) => {
      console.log(err);
    })
  },

  shouCang: function (item_id) {
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

  dianZan:function (item_id){
    var item=null;
    var cookie = wx.getStorageSync('dianZan') || [];  //获取全部点赞的id
    for (var i = 0; i < this.data.postList.length; i++) {
      if (this.data.postList[i]._id == item_id) {     //数据列表中找到对应的id
        var num = this.data.postList[i].seeNum;      //当前点赞数
        item = { id: item_id, num: num };
        if (this.contain(cookie, item)) {      //已经点过赞了，取消点赞
          for (var j in cookie) {
            if (cookie[j].id == item_id) {
              cookie.splice(j, 1);  //删除取消点赞的id
              --num;  //点赞数减1
              this.setData({
                [`postList[${i}].seeNum`]: num,         //es6模板语法，常规写法报错
                [`postList[${i}.].zanState`]: false    //我的数据中state为'false'是未点赞
              })
              wx.setStorageSync('dianZan', cookie);
              wx.showToast({
                title: "取消点赞!",
                icon: 'none'
              })
              break;
            }
          }

        } else {        //点赞操作
          ++num;    //点赞数加1
          this.setData({
            [`postList[${i}].seeNum`]: num,
            [`postList[${i}.].zanState`]: true
          })
          item = { id: item_id, num: num }
          cookie.unshift(item);   //新增赞的id
          wx.setStorageSync('dianZan', cookie);
          wx.showToast({
            title: "点赞成功!",
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
    this.shouCang(shareid);
  },

  Zanthumbsup:function(e){
    var shareid = e.currentTarget.dataset.id;
    this.dianZan(shareid);
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
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.upLoadChange()
  },
  
  tongbu:async function(){
    await this.upLoadChange();
    await this.onLoad()
    },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.upLoadChange()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.tongbu();
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
