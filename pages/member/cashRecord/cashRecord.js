// pages/member/cashRecord/cashRecord.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankName: '',
    bankId: '',
    bankList: '',
    bankInfo: '',
    userInfo: '',
    name: '',
    bankCode: '',
    amount: 0,
    showCode: false,
    time: '',
    code: '',
    choiceiIndex: 0,
    tip: '',
    codePic: "",
    start_page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)

    this.setData({
      userInfo: app.globalData.userInfo,
      phone: app.globalData.userInfo.phone
    })
    this.getRecord();

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
    this.setData({
      handInfo: app.globalData.handInfo
    })
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
    this.getMoreRecord();
  },
  getRecord() {
    http.HttpRequst(true, '/hand/me-cash-api/get-cash-list', 2, '', {
        token: app.globalData.token,
        start_page: this.data.start_page,
        pages: 10
      },
      'POST',
      false,
      (res) => {
        if (res.data.errcode == 0) {
          self.setData({
            recordData: res.data.data
          })
        }
      }
    )
  },
  getMoreRecord() {
    let self = this;
    common.loadMore(self, '/hand/me-cash-api/get-cash-list', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    }, 'itemList')
  }

})