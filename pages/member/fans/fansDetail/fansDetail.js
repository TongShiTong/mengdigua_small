// pages/member/fans/fansDetail/fansDetail.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [{
        title: '订单及返利',
      },
      {
        title: '浏览记录',
      }
    ],
    tabIndex: 0,
    memberList: '',
    fansList: '',
    start_date: false,
    end_date: false,
    start_page: 0,
    goodsList: false,
    goodsLookList: false,
    sort: "asc",
    fansList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    if (options.id) {
      let item = JSON.parse(options.item)
      let list = []
      list.push(item)
      this.setData({
        fans_uid: options.id,
        fansList: list
      })
      this.getgoodsList()
    }
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
    if (this.data.tabIndex == 0) {
      this.loadMoregoods()
    } else {
      this.loadMoreLookgoods()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  selectTab(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.tabIndex == index) {
      return
    } else {
      this.setData({
        tabIndex: index
      })
      if (this.data.tabIndex == 0 && !this.data.goodsList) {
        this.getgoodsList();
      } else if (this.data.tabIndex == 1 && !this.data.goodsLookList) {
        this.getLookgoodsList();
      }
    }
  },
  bindDateChange(e) {
    this.setData({
      start_date: e.detail.value
    })
    if (this.data.tabIndex == 0) {
      this.getgoodsList()
    } else {
      this.getLookgoodsList()
    }
  },
  bindDateChange1(e) {
    let self = this;
    if (!self.data.start_date) {
      wx.showToast({
        title: "请选择开始时间",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.setData({
      end_date: e.detail.value
    })
    if (this.data.tabIndex == 0) {
      this.getgoodsList()
    } else {
      this.getLookgoodsList()
    }

  },
  // 商品推荐
  getgoodsList() {
    let self = this;
    this.setData({
      start_page: 0,
      goodsList: false,
    })
    common.getList(self, '/member/user-behavior-api/rebate-list', {
      token: app.globalData.token,
      fans_uid: self.data.fans_uid,
      start_time: self.data.start_date ? self.data.start_date : "",
      end_time: self.data.end_date ? self.data.end_date : "",
      start_page: self.data.start_page,
      pages: 10,
    }, 'goodsList', function(res) {
      self.setData({
        total_pages: res.total_pages
      })
    })
  },
  // 商品推荐更多
  loadMoregoods() {
    let self = this
    common.loadMoreChange(self, '/member/user-behavior-api/rebate-list', {
      token: app.globalData.token,
      fans_uid: self.data.fans_uid,
      start_time: self.data.start_date ? self.data.start_date : "",
      end_time: self.data.end_date ? self.data.end_date : "",
      start_page: self.data.start_page,
      pages: 10,
    }, 'goodsList', 'start_page', function(res) {})
  },
  // 粉丝浏览记录接口
  getLookgoodsList() {
    let self = this;
    this.setData({
      start_page_look: 0,
      goodsLookList: false,
    })
    common.getList(self, '/member/user-behavior-api/browse-list', {
      token: app.globalData.token,
      fans_uid: self.data.fans_uid,
      start_time: self.data.start_date ? self.data.start_date : "",
      end_time: self.data.end_date ? self.data.end_date : "",
      start_page: self.data.start_page_look,
      pages: 10,
      sort: self.data.sort,
    }, 'goodsLookList', function(res) {
      self.setData({
        total_pages_two: res.total_pages
      })
      let name = "goodsLookList.list"
      let list = self.data.goodsLookList.list
      list.forEach((x, index) => {
        x.click = false
      })
      self.setData({
        [name]: list
      })
    })
  },
  // 商品推荐更多
  loadMoreLookgoods() {
    let self = this
    common.loadMoreChange(self, '/member/user-behavior-api/rebate-list', {
      token: app.globalData.token,
      fans_uid: self.data.fans_uid,
      start_time: self.data.start_date ? self.data.start_date : "",
      end_time: self.data.end_date ? self.data.end_date : "",
      sort: self.data.sort,
      start_page: self.data.start_page,
      pages: 10,
    }, 'goodsLookList', 'start_page_look', function(res) {
      let name = "goodsLookList.list"
      let list = res.list
      list.forEach((x, index) => {
        x.click = false
      })
      let newListData = self.data.goodsLookList.list.concat(list);
      self.setData({
        [name]: newListData
      })
    })
  },
  changeSstatus(e) {
    let index = e.currentTarget.dataset.index
    let status = e.currentTarget.dataset.status
    let name = "goodsLookList.list[" + index + "].click"
    this.setData({
      [name]: !status
    })
  },
  changeSort() {
    let self = this;
    if (this.data.sort == "asc") {
      this.setData({
        sort: "desc"
      })
    } else {
      this.setData({
        sort: "asc"
      })
    }
    self.getLookgoodsList()
  }

})