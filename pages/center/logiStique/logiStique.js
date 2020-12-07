// pages/center/logiStique/logiStique.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.getList()
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
  getList() {
    let self = this;
    this.setData({
      commentList: false,
      start_page: 0,
    })
    common.getListChange(self, '/information/information-api/index', {
      token: app.globalData.token,
      token_type: 1,
      is_collect: 1,
      pages: 10,
      start_page: self.data.start_page
    }, "collectList", function (res) {
    })
  },

  // 更多评论
  getMoreList() {
    let self = this
    common.loadMoreChange(self, '/information/information-api/index', {
      token: app.globalData.token,
      token_type: 1,
      inid: self.data.id,
      pages: 10,
      start_page: self.data.start_page
    }, "collectList", "start_page", function (res) { })
  },
})