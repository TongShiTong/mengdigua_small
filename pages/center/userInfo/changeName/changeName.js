// pages/center/userInfo/changeName/changeName.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      nickName: app.globalData.userInfo.nickname
    })
  },
  // 修改nic
  changeName: function(e) {
    let value = e.detail.value.replace(/^\s+|\s+$/g, '')
    this.setData({
      nickName: value
    })
  },
  // 保存
  sava: function() {
    let self = this;
    if (self.data.nickName == '') {
      wx.showToast({
        title: '请输入新昵称',
        icon: 'none',
        duration: 1000
      })
    } else {
      if (self.data.nickName.length > 16) {
        wx.showToast({
          title: '昵称过长',
          icon: 'none',
          duration: 1000
        })
      } else {
        http.HttpRequst(true, '/member/user-api/update', 2, '',
          {
            token: app.globalData.token,
            nickname: self.data.nickName,
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        )
      }
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

  }
})