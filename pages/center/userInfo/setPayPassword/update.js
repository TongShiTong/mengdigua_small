// pages/center/userInfo/setPayPassword/update.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
const md5 = require('../../../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password_old: "",
    password: "",
    password_copy: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
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

  },


  //获取值
  getVal(e) {
    const type = e.currentTarget.dataset.type
    const val = e.detail.value
    this.setData({
      [type]: val
    })
  },
  //提交
  submit() {
    if (this.data.password_old == "") {
      wx.showToast({
        title: '请输入原密码',
        icon: "none"
      })
      return
    }
    if (this.data.password == "") {
      wx.showToast({
        title: '请填写新支付密码',
        icon: "none"
      })
      return
    }
    if (this.data.password.length !== 6) {
      wx.showToast({
        title: '请填写6位支付密码',
        icon: "none"
      })
      return
    }
    if (this.data.password != this.data.password_copy) {
      wx.showToast({
        title: '两次密码不一致',
        icon: "none"
      })
      return
    }
    http.HttpRequst(true, '/member/user-api/change-password', 2, '', {
        token: app.globalData.token,
        old_pass: md5.md5(this.data.password_old),
        password: md5.md5(this.data.password),
      },
      'POST',
      false,
      (res) => {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '修改成功',
          })
          app.globalData.userInfo.is_set_paypassword = 1
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }
      }
    )
  }
})