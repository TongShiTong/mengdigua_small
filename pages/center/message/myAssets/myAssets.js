// pages/center/message/myAssets/myAssets.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: false,
    listData: '',
    startPage: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.read();
    this.meaasgeList();
  },
  // 消息列表
  meaasgeList() {
    let self = this;
    http.HttpRequst(false, '/notice/notice-api/get-message-from-type', 2, '',
      {
        token: app.globalData.token,
        type_arr: [4],
        start_page: self.data.startPage,
        pages: 10
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data
          })
        }
      }
    );
  },
  //消息已读
  read() {
    let self = this;
    http.HttpRequst(false, '/notice/notice-api/set-type-read-all', 2, '',
      {
        token: app.globalData.token,
        type:4
      },
      'POST', false,
      function (res) { }
    );
  },
  // 加载更多消息
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/member/growth-api/get-growth-list', 2, '',
        {
          token: app.globalData.token,
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


})