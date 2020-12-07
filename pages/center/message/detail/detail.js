// pages/center/message/detail/detail.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    rich: '',
    title: '',
    create_time: '',
    read: '',
    content: '',
    isShowModal: false,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.read();
    }
    this.setData({
      rich: app.globalData.rich,
      title: app.globalData.rich.title,
      create_time: app.globalData.rich.create_time,
      read: app.globalData.rich.read_num,
      content: app.globalData.rich.content,
    })
  },
  // 消息列表
  read() {
    let self = this;
    http.HttpRequst(false, '/notice/notice-api/set-read', 2, '',
      {
        token: app.globalData.token,
        notice_id: self.data.id
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          
        }
      }
    );
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