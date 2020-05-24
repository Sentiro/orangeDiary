// miniprogram/pages/myInfo/setUp/feedback/feedback.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      index: null,
      imgList: [],
      textDescription:null,
      fileIDs:[]
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        console.log(this.data.imgList)
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '否',
      confirmText: '是',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaInput(e) {
    this.setData({
      textDescription: e.detail.value
    })
  },
  
  submit(){
    const db=wx.cloud.database({});
    let that=this;

    wx.showLoading({
          title: '上传中',
        });
        const cloudPath=[];
        var filepath=this.data.imgList;
        filepath.forEach((item,i)=>{
           cloudPath.push("/feedbackPictures"+i)
        })
    let promiseArr=[];
    for(let i=0;i<filepath.length;i++){
      promiseArr.push(new Promise((resolve,reject)=>{
        setTimeout(()=>{
          wx.cloud.uploadFile({     //这一段是上传到云数据中的
            cloudPath: cloudPath[i],
            filePath: filepath[i],    //这个就是图片的存储路径
            success: res => {
              let fileID = res.fileID;
              this.setData({
              fileIDs:this.data.fileIDs.concat(fileID)
              }) 
              console.log('[上传图片]成功:',res) 
              resolve();                        
            },
            fail: e => {
                  console.error('[上传图片]失败：', e)
                },           
       })
      })
      })
      )
    }
      
    Promise.all(promiseArr).then((res)=>{
      wx.hideLoading()
      wx.showToast({
        title: '提交成功，感谢您的反馈，我们会努力改进',
      })
      db.collection('feedback').add({    //这个就把云数据的图片存储路径上传到数据链表中了
        data: {
          textDescription:that.data.textDescription,
          fileIDs:this.data.fileIDs
        },
      })
    }).catch((err)=>{
      console.log("上传失败");
      console.log(err);
    })    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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