// pages/shop/shop.js
const app = getApp()
const http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: '',
    noticeList: '',
    startPage: 0,
    recommend: '',
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.recommend) {
      this.setData({
        recommend: options.recommend
      })
    }
  },
  getShop: function () {
    let self = this;
    http.HttpRequst(true, '/shop/shop-api/index', 2, '',
      {
        start_page: 0,
        pages: 10,
        is_recommend: self.data.recommend
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            shopData: res.data.data
          })
        }
      }
    )
  },
  // 获取站内信
  getNotice() {
    let self = this;
    http.HttpRequst(false, '/notice/notice-api/index', 2, '',
      {
        token: app.globalData.token,
        type_arr: [1],
        key_word: '123456',
        start_page: 0,
        pages: 10
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            noticeList: res.data.data
          })
        }
      }
    )
  },
  // 加载更多
  loadMore: function () {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.shopData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/shop/shop-api/index', 2, '',
        {
          start_page: self.data.startPage,
          pages: 10,
          is_recommend: self.data.recommend
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "shopData.list";
            let list = res.data.data.list;
            let newListData = self.data.shopData.list.concat(list);
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
    }
  },
  // 跳转店铺详情
  jumpShopDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  // 跳转商品详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
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
    this.getNotice();
    this.getShop()
    this.setData({
      isShowModal: app.globalData.showModal,
      recommend: ''
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