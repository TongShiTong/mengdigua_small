// pages/web/web.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    param:'',
    token: app.globalData.token,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let urlor = options.param+ "?token=" + app.globalData.token
    if(!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/bandInfo/bandInfo',
      })
    }else {
      this.setData({
        url: urlor,
        param: options.param
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
    return {
      title: '活动专享',
      path: '/pages/webitem/web?param='+ this.data.param,
    };
  }
})