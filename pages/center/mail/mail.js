// pages/center/mail/mail.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    listData: '',
    startPage: 0,
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.getRead()
  },
  // 获取列表
  getList: function() {
    let self = this;
    http.HttpRequst(false, '/notice/notice-api/get-message-from-type', 2, '',
      {
        token: app.globalData.token,
        type_arr: [2],
        start_page: self.data.startPage,
        pages: 10
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data
          }) 
        }
      }
    )
  },
  // 全部已读
  getRead() {
    let self = this;
    http.HttpRequst(false, '/notice/notice-api/set-type-read-all', 2, '',
      {
        token: app.globalData.token,
        type: 2,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.getList();
        }
      }
    )
  },
  // 跳转详情
  jumpDetail: function(e) {
    let item = e.currentTarget.dataset.item;
    if (item.link_type == 2) {

    } else if (item.link_type == 3) {
      app.globalData.rich = item.content;
      wx.navigateTo({
        url: '/pages/rich/rich',
      })
    } else if (item.link_type == 4) {
      wx.navigateTo({
        url: '/pages/order/orderDetail/orderDetail?id=' + item.param
      })
    } else if (item.link_type == 5) {
      wx.navigateTo({
        url: '/pages/center/refund/refundDetail/refundDetail?id=' + item.param
      })
    } else if (item.link_type == 6) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + item.param
      })
    }
  },
  // 加载更多
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/notice/notice-api/get-message-from-type', 2, '',
        {
          token: app.globalData.token,
          type_arr: [2],
          start_page: self.data.startPage,
          pages: 10
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "listData.list";
            let list = res.data.data.list;
            let newListData = self.data.listData.list.concat(list);
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
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
    this.setData({
      isShowModal: app.globalData.showModal
    })
    wx.hideNavigationBarLoading();
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
    wx.showNavigationBarLoading();
    setTimeout(() => {
      this.getRead();
      wx.hideNavigationBarLoading();
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})