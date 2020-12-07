// pages/center/myCoupon/couponCenter/couponCenter.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg: "", //头部 图片
    listData: false, //  优惠券列表
    startPage: 0, //起始页
    pages: 10, // 每页
    sharePath: "", //分享链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    common.handleShareUrl(this, "pages/center/myCoupon/couponCenter/couponCenter")
    this.getCouponList()
    this.getCouponBanner()
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
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '领券中心',
      path: this.data.sharePath
    }
  },
  // 优惠券
  getCouponList() {
    let self = this;
    http.HttpRequst(false, '/coupon/coupon-templet-api/item-index', 2, '', {

        token: app.globalData.token,
        scenario: "platform",
        start_page: self.data.startPage,
        pages: 9999,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data
          })
        }
      }
    )
  },
  // 获取头部banner
  getCouponBanner() {
    let self = this;
    http.HttpRequst(false, '/banner/banner-api/index', 2, '', {
        seat_id: 7
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          if(res.data.list) {
            self.setData({
              bannerImg: res.data.list[0].img_url
            })
          }
        }
      }
    )
  },
  //加载更多优惠券
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/coupon/coupon-templet-api/item-index', 2, '', {
          token: app.globalData.token,
          scenario: "platform",
          start_page: self.data.startPage,
          pages: self.data.pages,
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let listData = "listData.list";
            let list = res.data.data.list;
            let newList = self.data.listData.list.concat(res.data.data.list)
            self.setData({
              [listData]: newList
            })
          }
        }
      )
    }
  },
  // 获取店铺优惠券
  getShopCoupon(e) {
    let self = this;
    var id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index;
    http.HttpRequst(true, '/coupon/coupon-templet-api/receive', 2, '', {
        token: app.globalData.token,
        ctid: id,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 1000
          })
          let name = "listData.list[" + index + "].is_accept"
          self.setData({
            [name]:1
          })
        }
      }
    )
  },
})