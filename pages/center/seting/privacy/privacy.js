// pages/center/seting/privacy/privacy.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    privacy: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.getContent();
  },
  // 隐私协议
  getContent() {
    let self = this;
    http.HttpRequst(false, '/content/content-api/view', 2, '',
      {
        type: 33,
        action_id: 0
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            privacy: res.data.data,
          })
        }
      }
    )
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