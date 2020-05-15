// miniprogram/pages/habit/modifyTeam/modifyTeam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg',
    teamName: '单词打卡小分队',
    tagColor: 'yellow',
    tagValue: ['音乐','学习'],
    teamID: '123488',
    teamDetail: '塔里克是保护者星灵，用超乎寻常的力量守护着符文之地的生命',
    members:[],
    goal:1,
    picker: ['1', '2', '3'],
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          avatarUrl: res.tempFilePaths[0]
        })
        
      }
    });
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const db = wx.cloud.database();
    wx.cloud.uploadFile({
      cloudPath: 'teamAvatar/'+this.data.teamName, // 上传至云端的路径
      filePath: this.data.avatarUrl, // 小程序临时文件路径
      success: res => {
        // 暂时储存 ID
        this.setData({
          avatarUrl: res.fileID
        });
        db.collection('test').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            avatar: this.data.avatarUrl,
            teamName: e.detail.value.teamName,
            members: this.data.members,
            tagValue: this.data.tagValue,
            teamDetail: this.data.teamDetail,
            goal: this.data.goal
          },
          success: function (res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            wx.switchTab({
              url: "/pages/habit/habit"
            })

          }
        })
      },
      fail: console.error
    })
    
  },
  manageMembers(){
    wx.navigateTo({
      url: "../members/members",
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

  },
  
})