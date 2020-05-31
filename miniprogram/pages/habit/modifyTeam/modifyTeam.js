// miniprogram/pages/habit/modifyTeam/modifyTeam.js
var util = require('../../../utils.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    light: 'light',
    avatarUrl: '',
    teamName: '单词打卡小分队',
    tagColor: 'yellow',
    tagValue: ['音乐', '学习'],
    teamID: '123488',
    teamDetail: '塔里克是保护者星灵，用超乎寻常的力量守护着符文之地的生命',
    members: [],
    goal: 1,
    picker: ['1', '2', '3'],
    index: '',
    defaultTag: [
      {
        index: 0,
        name: '学习',
        color: 'red',
        select: ''
      }, {
        index: 1,
        name: '健康',
        color: 'yellow',
        select: ''
      }, {
        index: 2,
        name: '运动',
        color: 'green',
        select: ''
      }, {
        index: 3,
        name: '自律',
        color: 'olive',
        select: ''
      }, {
        index: 4,
        name: '专注',
        color: 'cyan',
        select: ''
      }, {
        index: 5,
        name: '早起早睡',
        color: 'orange',
        select: ''
      }, {
        index: 6,
        name: 'keep',
        color: 'blue',
        select: ''
      }, {
        index: 7,
        name: '乐器',
        color: 'purple',
        select: ''
      }, {
        index: 8,
        name: '趣弹up',
        color: 'mauve',
        select: ''
      }, {
        index: 9,
        name: '时间管理',
        color: 'pink',
        select: ''
      }, {
        index: 10,
        name: '生活',
        color: 'brown',
        select: ''
      }, {
        index: 11,
        name: '技能',
        color: 'grey',
        select: ''
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var queryBean = JSON.parse(options.item);
    console.log(options.teamID);
    var teamID = options.teamID;
    if (teamID != null) {
      const db = wx.cloud.database();
      db.collection('team').doc(teamID).get({
        success: (e) => {
          console.log(e.data);
          this.setData({
            teamName: e.data.teamName,
            teamDetail: e.data.teamDetail,
            avatarUrl: e.data.avatar,
            goal: e.data.goal,
            members: e.data.members,
            tagValue: e.data.tagValue,
            hasTeam: true,
            teamID: e.data._id,
          });
        }
      })
    }

  },
  textareaAInput(e) {
    this.setData({
      teamDetail: e.detail.value
    })
  },
  PickerChange(e) {
    console.log(e);
    var temp = this.data.goal;
    this.setData({
      [temp]: e.detail.value
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
  tag() {
    var tempTag = new Array();
    for (var i = 0; i < this.data.defaultTag.length; i++) {
      var temp = this.data.defaultTag[i];
      if (temp.select == 'light') {
        tempTag.push(temp);
      }
    }
    this.setData({
      tagValue: tempTag,
      modalName: null
    })

  },
  setTag(e) {
    var currentTag = e.currentTarget.dataset['tag'];
    console.log(currentTag);
    var list = this.data.defaultTag;
    if (currentTag.select == 'light') {
      list[currentTag.index].select = '';
      this.setData({
        defaultTag: list
      })
    } else {
      list[currentTag.index].select = 'light';
      this.setData({
        defaultTag: list
      })
    }

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  formSubmit: function (e) {
    if(this.data.teamID==null){
      this.setData({
        teamID: util.wxuuid(),
      })
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const db = wx.cloud.database();
    wx.cloud.uploadFile({
      cloudPath: 'teamAvatar/' + this.data.teamID, // 上传至云端的路径
      filePath: this.data.avatarUrl, // 小程序临时文件路径
      success: res => {
        // 暂时储存 ID
        this.setData({
          avatarUrl: res.fileID
        });
        db.collection('team').doc(this.data.teamID).set({
          // data 字段表示需新增的 JSON 数据
          data: {
            //_id: this.data.teamID, // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            avatar: this.data.avatarUrl,
            teamName: e.detail.value.teamName,
            members: this.data.members,
            tagValue: this.data.tagValue,
            teamDetail: this.data.teamDetail,
            goal: this.data.goal,
          },
          success: function (res) {
            //在user集合中更新
            var appInstance = getApp();
            var userID = appInstance.globalData.openid;
            const _ = db.command
            db.collection('user').doc(userID).update({
                data:{
                   teamID: _.set(this.data.teamID)
                },
                success:function(e){
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000,
                    success: function (e) {
                      //显示成功信息成功后跳转页面
                      wx.switchTab({
                        url: '/pages/habit/habit',
                        success: function (e) {
                          var page = getCurrentPages().pop();
                          console.log(page);
                          //if (page == undefined || page == null) return;
                          page.onLoad();
                        }
                      })
                    }
                  })  
                }
              
            })
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id           
          },
          fail:console.error
        })
      },
      fail: console.error
    })

  },
  manageMembers() {
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
  onShareAppMessage: function (res) {
    let title, imageUrl;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      title = '加入组队打卡'
      // imageUrl = '***.png';
    }
    return {
      title: title,
      imageUrl: imageUrl,//这个是分享的图片
      path: '/pages/habit/team?teamID=123456',
    }
  },

})