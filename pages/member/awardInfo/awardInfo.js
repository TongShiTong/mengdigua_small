// pages/member/awardInfo/awardInfo.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    order: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getDetail();
    }
  },
  // 订单详情
  getDetail() {
    let self = this;
    http.HttpRequst(true, '/hand/hand-api/income-detail', 2, '',
      {
        token: app.globalData.token,
        hand_log_id: self.data.id
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            order: res.data.data
          })
        }
      }
    )
  },
  // 复制邀请码
  copyInfo: function () {
    wx.setClipboardData({
      data: this.data.order.order_no,
      success(res) {
        wx.getClipboardData({
          success(res) {
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

 
  // 跳转店铺详情
  jumpShopDetail(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
})