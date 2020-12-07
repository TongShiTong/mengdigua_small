// pages/bindInviteCode/bindInviteCode.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    inviteCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取邀请码
  getInviteCode(e) {
    this.setData({
      inviteCode: e.detail.value
    })
  },
  // 绑定
  bindCode() {
    let self = this;
    if (this.data.inviteCode == '') {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none',
        duration: 1000
      })
    } else {
      http.HttpRequst(true, '/hand/fans-api/create-fans', 2, '',
        {
          token: app.globalData.token,
          share_code: self.data.inviteCode
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
        })
    }
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
  skip(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})