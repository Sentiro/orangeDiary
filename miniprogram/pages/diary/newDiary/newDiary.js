// miniprogram/pages/habit/newHabits/newHabits.js
var util = require('../../../utils.js');
var plugin = requirePlugin("chatbot");
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    imgsID: [],
    date: null,
    calendarHide:true,
    year:0,
    month:0,
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    title: "",
    text: "",
    emotion: null
  },

  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        imgs: 'aspectFill';
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },

  handleTitleInput: function (e) {
    var that = this;
    that.setData({
      title: e.detail.value
    })
  },
  handleContentInput: function (e){
    var that = this;
    that.setData({
      text: e.detail.value
    })
  },

  //标题为空
  fail: function (e){
    wx.showToast({
      title: '标题为空', 
      icon: 'success',
      duration: 1500 
    })
  },
  //正文为空
  fail2: function (e){
    wx.showToast({
      title: '正文为空', 
      icon: 'success', 
      duration: 1500 
    })
  },


   //添加日记记录
  preserveDiary: function (){
    var article=this.data.text;
    const db = wx.cloud.database()
    if(this.data.title===''){
      wx.showToast({
        title: '标题为空', 
        icon: 'close',
        duration: 1500 
      })
    }
    else if(this.data.text===''){
      wx.showToast({
        title: '正文为空', 
        icon: 'close', 
        duration: 1500 
      })
    }
    else{
      //情感分析
      plugin.api.nlp('sentiment', { q: article, mode: '3class' }).then(res => {
        console.log("sentiment result : ", res)
        console.log((res.result[0][1] - res.result[2][1]) * 100 / (res.result[0][1] + res.result[2][1]));
        this.setData({
          emotion: (res.result[0][1] - res.result[2][1]) * 100 / (res.result[0][1] + res.result[2][1])
        })
      });   
      var that = this;
      var imgs = that.data.imgs;
      var imgsID = that.data.imgsID;
      wx.showLoading({
        title: '加载中...',
      })
      let promiseArr = [];
      //获取openid
      var appInstance = getApp();
      var userID = appInstance.globalData.openid;
      for (var i = 0; i < imgs.length; i++){
        promiseArr.push(new Promise((reslove, reject) => {
          wx.cloud.uploadFile({
            cloudPath: userID+'/'+this.data.title+'/'+i,
            // 指定要上传的文件的小程序临时文件路径
            filePath: imgs[i],
            // 成功回调
            success: res => {
              // 暂时储存 ID
              imgsID.push(res.fileID)
              reslove();
            },
            fail: res=>{
              wx.showToast({
                title: "上传失败",
              })
            }
          })
        }));
      }
      Promise.all(promiseArr).then(res => {
        console.log('chenggongle')
        //上传日记至数据库
        var time = new Date();
        db.collection('diary').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            title: this.data.title,
            text: this.data.text,
            date: time.getFullYear() + "-" + (time.getMonth() + 1)+ "-" +time.getDate(),
            time: time.getHours()+":"+time.getMinutes(),
            imgs :this.data.imgsID,
            emotion: this.data.emotion.toFixed(1)
          },
        })
        console.log('chenggongle')
        wx.hideLoading()
        wx.switchTab({ 
          url: '/pages/diary/diary',
          success: function (e) {
            var page = getCurrentPages().pop();
            console.log(page);
            //if (page == undefined || page == null) return;
            page.onLoad();
          }       
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = new Date();
    this.setData({
      date: time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日",
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