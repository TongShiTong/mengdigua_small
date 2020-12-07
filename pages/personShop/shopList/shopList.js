// pages/personShop/shopList/shopList.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [{}, {}], //
    showManage: false,
    maxValue: 0, //排序最大值
    selectAll: false,
    ids: [],
    listDelete: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      goodsList: false,
      list_start_page: 0,
    })
    this.getgoodsList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMoregoods()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  // 管理
  manage: function() {
    this.setData({
      showManage: !this.data.showManage
    })
  },

  goDetail(e) {
    app.pushRoute(e)
  },
  // 商品推荐
  getgoodsList() {
    let self = this;
    common.getList(self, '/handShop/hand-shop-api/get-item', {
      token: app.globalData.token,
      start_page: self.data.list_start_page,
      pages: 10,
    }, 'goodsList', function(res) {
      res.list.forEach(x => {
        x.select = false
      })

      var sortMax = common.arraryMax(self.data.goodsList.list, "sort", self.data.maxValue)
      self.setData({
        maxValue: sortMax,
        goodsList: res
      })
    })
  },
  // 商品推荐更多
  loadMoregoods() {
    let self = this
    common.loadMoreChange(self, '/handShop/hand-shop-api/get-item', {
      token: app.globalData.token,
      start_page: self.data.list_start_page,
      pages: 10,
    }, 'goodsList', "list_start_page", function(res) {
      var sortMax = common.arraryMax(res.list, "sort", self.data.maxValue)
      self.setData({
        maxValue: sortMax
      })
    })
  },
  choiceAll() {
    let self = this;
    let list = self.data.goodsList.list
    let ids =[]
    list.forEach(x => {
      x.select = !x.select
      ids.push(x.item_id)
    })
    let listData = "goodsList.list";
    self.setData({
      [listData]: list,
      selectAll: !self.data.selectAll,
      
    })
    if (self.data.selectAll){
      self.setData({
        ids: ids
      })
    }
  },

  routeBack() {
    wx.reLaunch({
      url: '/pages/personShop/personShop'
    })
  },
  changeALL(e) {
    this.setData({
      selectAll: e.detail.choiceAll,
      ids: e.detail.ids,
      listDelete: e.detail.list
    })
  },
  delateAll() {
    let self = this;
    http.HttpRequst(true, "/handShop/hand-shop-api/delete-item", 2, '', {
        token: app.globalData.token,
        item_ids: self.data.ids
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          let temArr = []
          self.data.listDelete.forEach((x, index) => {
            if (x.select == false) {
              temArr.push(x)
            }
          })
          let listData = "goodsList.list";

          self.setData({
            [listData]: temArr
          })
        }
      }
    )
  }
})