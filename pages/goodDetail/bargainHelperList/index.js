// pages/goodDetail/bargainHelperList/index.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
const formatTime = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    helper:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
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
    this.loadMoregoods();
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
    common.getListChange(self, '/bargain/me-bargain-api/get-cut-list', {
      token: app.globalData.token,
      id: self.data.id,
      start_page: self.data.start_page,
      pages: 10
    }, "helper", function (res) {
    })
  },
  loadMoregoods() {
    
    let self = this

    common.loadMoreChange(self, '/bargain/me-bargain-api/get-cut-list', {
      token: app.globalData.token,
      id: self.data.id,
      start_page: self.data.start_page,      
      pages: 10
    }, 'helper', 'start_page', function (res) { })
  },
})