// pages/center/userInfo/visitCard/visitCard.js
const app = getApp()
const http = require('../../../../utils/http.js')
const util = require('../../../../utils/util.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: "",
    userName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    this.setData({
      image: app.globalData.userInfo.wechat_img == null ? '' : app.globalData.userInfo.wechat_img,
      userName: app.globalData.userInfo.wechat == null ? '' : app.globalData.userInfo.wechat
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


  handleInput(e) {
    const _key = e.currentTarget.dataset.type;
    this.setData({
      [_key]: e.detail.value
    });
  },
  // 上传图片
  uploadImg: function() {
    let self = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        self.setData({
          image: ""
        })
        var tempFilePaths = res.tempFilePaths;
        var newTempFilePaths = '';
        wx.uploadFile({
          url: app.globalData.baseUrl + '/material/index/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
            var data = JSON.parse(res.data)
            self.setData({
              image: data.data.url
            })
            //do something
          }
        })
      }
    })
  },
  // 删除图片
  deleteImg(e) {
    this.setData({
      image: ""
    })
  },

  save() {
    let self = this;
    if (self.data.userName == "") {
      wx.showToast({
        title: "微信名字不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }
    var reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!reg.test(self.data.userName) || self.data.userName.length > 20) {
      wx.showToast({
        title: "微信名字格式不符",
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (self.data.image == "") {
      wx.showToast({
        title: "请上传图片",
        icon: 'none',
        duration: 2000
      })
      return
    }
    http.HttpRequst(true, '/member/user-api/update', 2, '', {
        token: app.globalData.token,
        wechat: self.data.userName,
        wechat_img: self.data.image
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })

        }
      }
    )
  }

})