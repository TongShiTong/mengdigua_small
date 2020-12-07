// pages/member/promote/promote.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circel: [0, 1, 2, 3],
    scrollIndex: 0,
    giftData: '',
    startPage: 0,
    handInfo: '',
    userInfo: '',
    vipTitle: '',
    vipText: '',
    explainMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    common.handleShareUrl(this, "pages/member/promote/promote")
    this.getGift();
  },
 
  // 滚动vip展示图监听
  scrollVip(e) {
    if (e.detail.scrollLeft < 460 && e.detail.scrollLeft > 200) {
      this.setData({
        scrollIndex: 1
      })
    } else if (e.detail.scrollLeft < 730 && e.detail.scrollLeft > 460) {
      this.setData({
        scrollIndex: 2
      })
    } else if (e.detail.scrollLeft > 730) {
      this.setData({
        scrollIndex: 3
      })
    } else if (e.detail.scrollLeft < 200) {
      this.setData({
        scrollIndex: 0
      })
    }
  },
  // 礼包
  getGift() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/index', 2, '',
      {
        token: app.globalData.token,
        item_type: 4,
        pages: 10,
        start_page: self.data.startPage
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            giftData: res.data.data
          })
        }
      }
    )
  },
  // vip权益说明
  showExplain(e) {
    let id = e.currentTarget.dataset.item.id;
    let item = e.currentTarget.dataset.item;
    this.setData({
      vipTitle: item.name,
      vipText: item.remark
    })
    this.setData({
      explainMask: true
    })
  },
  // 关闭vip权益说明
  closeExplain() {
    this.setData({
      explainMask: false
    })
  },
  // 获取用户身份
  getUserInfo() {
    let self = this;
    http.HttpRequst(false, '/member/user-api/info', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            userInfo: res.data.data,
            handInfo: app.globalData.handInfo
          })
          if (self.data.userInfo.role == 1) {
            self.getHandInfo()
          }
          app.globalData.userInfo = res.data.data;
        }
      }
    )
  },
  // 获取用户推手
  getHandInfo() {
    let self = this;
    http.HttpRequst(false, '/hand/hand-api/info', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            handInfo: res.data.data
          })
          app.globalData.handInfo = res.data.data;
        }
      }
    )
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

    this.getUserInfo();
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
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.giftData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/item/me-item-api/index', 2, '',
        {
          token: app.globalData.token,
          item_type: 4,
          pages: 10,
          start_page: self.data.startPage
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "giftData.list";
            let list = res.data.data.list;
            let newListData = self.data.giftData.list.concat(list);
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '礼包',
      path: this.data.sharePath
    }
    return {
      title: '会员礼包',
      path: '/pages/member/promote/promote'
    }
  }
})