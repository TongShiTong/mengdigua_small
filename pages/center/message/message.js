// pages/center/message/message.js
const app = getApp()
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: false,
    messageData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
  },
  getMessage() {
    let self = this;
    //加载数据
    http.HttpRequst(false, '/notice/notice-api/get-message-list', 2, '',
      {
        token: app.globalData.token,
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.length;i++) {
            res.data.data[i].create_time = util.substrTwo(res.data.data[i].create_time, 10)
          }
          self.setData({
            messageData: res.data.data,
          })
        }
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 跳转
  jumpPages(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    if(type == 1 | type == 3){
      wx.navigateTo({
        url: '/pages/center/message/notice/notice?id='+ id
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '/pages/center/message/myAssets/myAssets',
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '/pages/center/mail/mail',
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMessage();
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