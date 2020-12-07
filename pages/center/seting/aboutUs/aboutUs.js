// pages/center/seting/aboutUs/aboutUs.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aboutData: '',
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    // this.getAboutUs();
    this.getContent()
  },
  // 关于我们
  getAboutUs: function() {
    let self = this;
    http.HttpRequst(false, '/base/intel-api/info', 2, '',
      {
        type: 20,
        action_id: 0,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            aboutData: res.data.data
          })
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
    this.setData({
      isShowModal: app.globalData.showModal
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

  },
    getContent() {
    let self = this;
    common.getContent(self, 2, 'AboutContent', function (res) {
      self.setData({
        contentTitle: res.title
      })
    })
  },
})