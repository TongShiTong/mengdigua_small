// pages/center/message/notice/notice.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: false,
    noticeData: [],
    noticePages: '',
    startPage: 0,
    title: '消息',
    options: 0,
    rich: '',
    type:1
  },
  // 跳转
  jumpDetail(e){
    common.loadTheme(this)
    let param = e.currentTarget.dataset.j.param;
    let notice = e.currentTarget.dataset.j.notice;
    let linkType = e.currentTarget.dataset.j.link_type;
    if (linkType == 2) {
    } else if (linkType == 3) {
      app.globalData.rich = e.currentTarget.dataset.j
      wx.navigateTo({
        url: '/pages/center/message/detail/detail'
      })
    } else if (linkType == 4) {
      wx.navigateTo({
        url: '/pages/order/orderDetail/orderDetail?id=' + param
      })
    } else if (linkType == 5) {
      wx.navigateTo({
        url: '/pages/center/refund/refundDetail/refundDetail?id=' + param
      })
    } else if (linkType == 6) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + param
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    common.loadTheme(this)
    if(options.id == 3){
      this.title = '商学院'
      this.setData({
        title:"商学院",
        type:3
      })
    }else if(options.id == 1){
      this.title = '最新公告'
      this.setData({
        title: "最新公告",
        type:1
      })
    }
    // wx.setNavigationBarTitle({
    //   title: self.title
    // });
    //消息已读
    http.HttpRequst(false, '/notice/notice-api/set-type-read-all', 2, '',
      {
        token: app.globalData.token,
        type: self.data.type
      },
      'POST', false,
      function (res) { }
    );
    //消息
    http.HttpRequst(false, '/notice/notice-api/get-message-from-type', 2, '',
      {
        token: app.globalData.token,
        type_arr: [options.id],
        start_page: 0,
        pages: 10
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            noticeData: res.data.data.list,
            noticePages: res.data.data.total_pages,
            options
          })
        }
      }
    );
    
  },
  // 加载更多消息
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.noticePages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/notice/notice-api/get-message-from-type', 2, '',
        {
          token: app.globalData.token,
          start_page: self.data.startPage,
          type_arr: self.data.options.id,
          pages: 10
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let newList = self.data.noticeData.concat(res.data.data.list)
            self.setData({
              noticeData: newList
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


})