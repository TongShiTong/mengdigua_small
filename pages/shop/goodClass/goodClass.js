// pages/shop/goodClass/goodClass.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        shopId: options.id,
        isShowTab:options.isShowTab,
      })
      this.getShopClass()
    }else{
      this.setData({
        isShowTab: options.isShowTab,
        shopId:app.globalData.shopId
      })
      this.getShopClass()
    }
  },
  // 获取店铺二级分类
  getShopClass() {
    let self = this;
    http.HttpRequst(true, '/item/me-category-api/get-category-list', 2, '',
      {
        token: app.globalData.token,
        shop_id: self.data.shopId
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            classData: res.data.data,
          })
        }
      }
    )
  },
  // 跳转搜索
  jumpSerch() {
    wx.navigateTo({
      url: '/pages/class/serch/serch?id=' + this.data.shopId
    })
  },
  // 跳转全部商品
  jumpAllGood() {
    wx.navigateTo({
      url: '/pages/class/serch/serch?id=' + this.data.shopId + '&name=全部'
    })
  },
  // 跳转商品分类
  jumpGoodClass(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/class/serch/serch?mcid=' + id + '&name=' + name + '&id=' + this.data.shopId
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