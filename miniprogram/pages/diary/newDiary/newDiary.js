// miniprogram/pages/habit/newHabits/newHabits.js
var util = require('../../../utils.js');
var plugin = requirePlugin("chatbot");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    imgs: [],
    titleCount: 0, //标题字数
    contentCount: 0, //正文字数
    date: null,
    calendarHide:true,
    year:0,
    month:0,
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    title: "",
    text: ""
  },

  showCalendar: function (event) {
    var year = event.detail.year;
    var month = event.detail.month;
    var day = event.detail.day;
    this.setData({
      date: year + "年" + month + "月" + day + "日",
      clickDate: this.data.date
    })
    this.setData({
      calendarHide: !this.data.calendarHide
    }) 
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
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
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
   //添加日记记录
  preserveDiary: function () {
    var article=this.data.text;
    const db = wx.cloud.database()
    var that = this;
    //情感分析
    plugin.api.nlp('sentiment', { q: article, mode: '3class' }).then(res => {
      console.log("sentiment result : ", res)
      console.log((res.result[0][1] - res.result[2][1]) * 100 / (res.result[0][1] + res.result[2][1]));
    });   
    db.collection('diary').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        title: that.data.title,
        text: that.data.text,
        date: new Date()
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },
  submit(){
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = new Date();
    this.setData({
      date: time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日",
    });
    const txt = "恭喜小张脱单成功";  
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