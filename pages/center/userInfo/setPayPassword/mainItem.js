// pages/center/userInfo/setPayPassword/mainItem.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
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



  //修改密码
  updatePassword() {
    wx.navigateTo({
      url: `/pages/center/userInfo/setPayPassword/update`,
    })
  },
  //忘记密码
  forgetPassword() {
    wx.navigateTo({
      url: `/pages/center/userInfo/setPayPassword/setPayPassword?status=2`,
    })
  },
})