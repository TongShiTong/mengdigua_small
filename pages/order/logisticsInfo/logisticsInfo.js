// pages/order/logisticsInfo/logisticsInfo.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logData: '',
    logistics_no: '',
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    // if (options.logistics_no) {
    //   this.setData({
    //     logistics_no: options.logistics_no
    //   })
    // }
    if (options.order_no){
      this.setData({
        order_no: options.order_no
      })
    }
    this.getExpress();
  },
  getExpress: function() {
    let self = this;
    http.HttpRequst(true, '/order/order-api/logistic', 2, '',
      {
        token: app.globalData.token,
        order_no: self.data.order_no
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            logData: res.data.data,
          })
        }
      }
    )
  },
  copyInfo :function (){
    wx.setClipboardData({
      data: this.data.logData.code,
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
    this.setData({
      isShowModal: app.globalData.showModal
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