// pages/center/welfareCard/welfareCard.js
const app = getApp()
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_page:0,
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      handInfo:app.globalData.handInfo,
      userInfo:app.globalData.userInfo
    })
    this.getCardRecord();
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
    this.getMoreRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jumpToExchange(){
    wx.navigateTo({
      url: '/pages/center/exchangeCard/exchangeCard',
    })
  },
  getCardRecord(){
    this.setData({
      start_page:0
    })
    http.HttpRequst(false, '/hand/shopping-card-api/log-list', 2, '',
      {
        token: app.globalData.token,
        start_page:0,
        pages:10
      },
      'POST', false,
      (res) => {
        if (res.data.errcode == 0) {
          this.setData({
            recordList:res.data.data.list
          })
        }
      }
    )
  },
  getMoreRecord(){
    let self = this;
    common.loadMore(self, '/hand/shopping-card-api/log-list', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages:10
    }, 'recordList')
  }
})