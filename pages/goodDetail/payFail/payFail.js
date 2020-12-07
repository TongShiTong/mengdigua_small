// pages/goodDetail/payFail/payFail.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    detailData: '',
    oneOrderInfo: '',
    shopcarOrder: '',
    id: '',
    goType:1,// 2 其他
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.goType) {
      this.setData({
        goType: options.goType
      })
    }
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getOrder();
    }else {
      this.setData({
        oneOrderInfo: app.globalData.oneOrder,
        shopcarOrder: app.globalData.shopcarOrder
      })
    }
  },
  back() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  // 获取订单详情
  getOrder: function () {
    let self = this;
    http.HttpRequst(true, '/order/order-api/main-order-info', 2, '',
      {
        token: app.globalData.token,
        main_order_id: self.data.id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            detailData: res.data.data
          })
        }
      }
    )
  },
  jumpDetail() {
    if(this.data.goType!=2){
      wx.redirectTo({
        url: '/pages/order/order'
      })
    }else{
      wx.navigateTo({
        url: '/pages/center/groupOrder/groupOrder?type=1'
      })
    }
 
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
    app.globalData.oneOrder = '';
    app.globalData.shopcarOrder = '';
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