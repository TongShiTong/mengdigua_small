// pages/member/shcoolList/shcoolList.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thType:"", //1  //新手指引 2 其他
    start_page:0,
    listData:false,// .list 列表
    title:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.type){
      this.setData({
        thType: options.type
      })
      if (options.titleName){
        this.setData({
          title: options.titleName
        })
      }
      if (this.data.thType==13){
        wx.setNavigationBarTitle({
          title: '预测中心'
        })
      } else if (this.data.thType == 15){
        wx.setNavigationBarTitle({
          title: '大咖讲堂'
        })
      } else if (this.data.thType == 16) {
        wx.setNavigationBarTitle({
          title: '最新资讯'
        })
      } else if (this.data.thType == 18) {
        this.setData({
          thid_low: options.type,
          thid: options.pid
        })
        // wx.setNavigationBarTitle({
        //   title: '常见问题解答'
        // })
      } else if (this.data.thType == 17) {
        wx.setNavigationBarTitle({
          title: '基本信息介绍'
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList()
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
    this.loadMore()
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },
  // 获取列表
  getList: function (status) {
    let self = this;
    let params = {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
      token_type: 1,
      thid: self.data.thType
    }
    if (self.data.thType==18){
      params.thid = self.data.thid
      params.thid_low = self.data.thid_low
    }
    http.HttpRequst(true, '/information/information-api/index', 2, '',
      params,
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
  loadMore() {
    let self = this;
    let pages = self.data.start_page + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        start_page: pages
      })
      let status = Number(self.data.tabIndex) + 1;
      let params = {
        token: app.globalData.token,
        start_page: self.data.start_page,
        pages: 10,
        token_type: 1,
        thid: self.data.thType
      }
      if (self.data.thType == 18) {
        params.thid = self.data.thid
        params.thid_low = self.data.thid_low
      }
      http.HttpRequst(true, '/information/information-api/index', 2, '',
        params,
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
  goDeatil: function (e) {
    let id = e.currentTarget.id
    let time = e.currentTarget.dataset.time
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/rich/rich?id=' + id + '&title=' + title + '&time=' + time
    })
  },
 
})