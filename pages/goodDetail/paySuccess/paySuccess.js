// pages/goodDetail/paySuccess/paySuccess.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    price: "",
    ikeData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.price){
      this.setData({
        price: options.price
      })
    }
    this.getLike();
    this.getUser()
  },
  // 猜你喜欢
  getLike() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/like', 2, '',
      {
        token: app.globalData.token,
        token_type: 1
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            likeData: res.data.data
          })
        }
      }
    )
  },
  // 更新个人信息
  getUser() {
    let self = this;
    http.HttpRequst(false, '/member/user-api/info', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          app.globalData.userInfo = res.data.data;
        }  
      }
    )
  },
  // 继续购买
  jumpHome: function() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  // 跳转我的订单
  jumpOrder: function() {
    wx.redirectTo({
      url: '/pages/order/order?tabIndex=1'
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

  }
})