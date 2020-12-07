// pages/order/selectReturn/selectReturn.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: '',
    id: '',
    cid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      id: options.id,
      cid: options.cid
    })
    if (options.order_pay_amount){
      this.setData({
        order_pay_amount: options.order_pay_amount
      })
    }
  },
  // 订单详情
  getDetail() {
    let self = this;
    http.HttpRequst(false, '/order/order-api/main-order-info', 2, '',
      {
        token: app.globalData.token,
        main_order_id: self.data.id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            orderData: res.data.data
          })
          for (let i = 0; i < self.data.orderData.MainOrders.length;i++) {
            for (let k = 0; k < self.data.orderData.MainOrders[i].orderSkus.length; k++) {
              if (self.data.orderData.MainOrders[i].orderSkus[k].id == self.data.cid) {
                app.globalData.orderReturn = self.data.orderData.MainOrders[i].orderSkus[k];
                app.globalData.returnShop = self.data.orderData.MainOrders[i].shop;
              }
            }
          }
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 跳转退款退货
  jumpRetrun(e) {
    let index = e.currentTarget.dataset.index;
    let refunstatus = e.currentTarget.dataset.refunstatus;
    wx.navigateTo({
      url: '/pages/order/applicationReturn/applicationReturn?index=' + index + '&refunStatus=' + refunstatus + '&order_pay_amount=' + this.data.order_pay_amount
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDetail()
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})