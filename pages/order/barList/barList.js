// pages/order/barList/barList.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
const formatTime = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [{
        name: '进行中',
        show: true, //
      },
      {
        name: '已完成',
      },
      {
        name: '未完成',
      },
    ],
    tabIndex: 0,
    barHeight: app.globalData.totalHeight,
    status: [0, 1], //砍价数组
    myTime: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    this.getList()

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
    if (this.data.myTime) {
      this.data.myTime.forEach((item) => {
        clearInterval(item)
      })
    }

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
    this.getMoreList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  selectTab: function(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.tabIndex) {
      return
    } else {
      this.setData({
        tabIndex: index
      })
      if (index == 0) {
        this.setData({
          status: [0, 1]
        })
      } else if (index == 1) {
        this.setData({
          status: [3]
        })
      } else if (index == 2) {
        this.setData({
          status: [2]
        })
      }
    }
    if (this.data.myTime) {
      this.data.myTime.forEach((item) => {
        clearInterval(item)
      })
    }
    this.getList();
  },
  getList() {
    let self = this;
    this.setData({
      bargainList: false,
      start_page: 0,
    })
    let index = 0
    common.getListChange(self, '/bargain/me-bargain-api/bargain-list', {
      token: app.globalData.token,
      status: self.data.status,
      pages: 10,
      start_page: self.data.start_page
    }, "bargainList", function(res) {
      let newData = {}; //新变更数据  
      self.data.bargainList.list.forEach((item, index2) => {
        if (item.status == 0) {
          newData['myTime' + '[' + (index++) + ']'] = setInterval(() => {
            self.timeCountDown(item.create_time, item.end_time, index2);
          }, 1000) //赋值，索引递增  
        }
      })
      self.setData(newData)
    })
  },
  getMoreList() {
    let self = this
    common.loadMoreChange(self, '/bargain/me-bargain-api/bargain-list', {
      token: app.globalData.token,
      status: self.data.status,
      pages: 10,
      start_page: self.data.start_page
    }, "bargainList", "start_page", function(res) {
      let newData = {}; //新变更数据  
      self.data.bargainList.list.forEach((item, index2) => {
        if (item.status == 0) {
          newData['myTime' + '[' + (index++) + ']'] = setInterval(() => {
            self.timeCountDown(item.create_time, item.end_time, index2);
          }, 1000) //赋值，索引递增  
        }
      })
      self.setData(newData)
    })
  },
  timeCountDown(startTime, endTime, index) {
    var nowTime = Date.parse(new Date());
    // var nowTime = new Date(this.data.detailData.seckillItem.now_time.replace(/-/g, "/")).getTime(); // 现在时间
    var date1 = new Date(startTime.replace(/-/g, "/")).getTime(); // 开始时间
    var date2 = new Date(endTime.replace(/-/g, "/")).getTime(); // 结束时间
    if (nowTime < date1) {
      this.setData({
        ['skillStatus[' + index + ']']: 1,
        ['time[' + index + ']']: formatTime.skillTwo(date1 - nowTime)
      })
    } else if (nowTime >= date1 && nowTime <= date2) {
      this.setData({
        ['skillStatus[' + index + ']']: 2,
        ['time[' + index + ']']: formatTime.skillTwo(date2 - nowTime)
      })
    } else if (nowTime > date2) {
      this.setData({
        ['skillStatus[' + index + ']']: 3,
      })
      clearInterval(this.data.timeInterval)
    }
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/bargainDeatil/bargainDeatil?id=' + id
    })
  },
  goOrder(e) {
    let item = e.currentTarget.dataset.item;
    app.globalData.oneOrder = item;
    wx.navigateTo({
      url: '/pages/goodDetail/confirmOrder/confirmOrder?from=bargain'
    })
  },
  goOrderDetail(e) {
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/orderDetail/orderDetail?id=' +orderId
    })
  }
})