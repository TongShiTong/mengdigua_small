// pages/center/userInfo/inviteShop/inviteShop.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wexin: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.getInvite();
  },
  // 获取上级信息
  getInvite() {
    let self = this;
    http.HttpRequst(false, '/member/user-api/get-up-wechat', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            wexin: res.data.data,
          })
        }
      }
    )
  },
  // 复制微信号
  copyInfo: function () {
    wx.setClipboardData({
      data: this.data.wexin.wechat,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      }
    })
  },
  // 保存二维码
  saveImg() {
    wx.getImageInfo({
      src: this.data.wexin.wechat_img,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
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


})