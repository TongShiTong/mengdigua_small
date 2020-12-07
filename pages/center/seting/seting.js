// pages/center/seting/seting.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
  },
  // 跳转个人资料
  jumpUserInfo() {
    wx.navigateTo({
      url: '/pages/center/userInfo/userInfo'
    })
  },
  // 跳转关于我们
  jumpAboutUs: function() {
    wx.navigateTo({
      url: '/pages/center/seting/aboutUs/aboutUs'
    })
  },
  // 跳转意见反馈
  jumpFeedback: function() {
    wx.navigateTo({
      url: '/pages/center/seting/feedback/feedback'
    })
  },
  // 跳转隐私协议
  jumpPrivacy: function () {
    wx.navigateTo({
      url: '/pages/center/seting/privacy/privacy'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
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

  }
})