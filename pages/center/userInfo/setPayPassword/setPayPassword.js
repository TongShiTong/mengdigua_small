// pages/center/userInfo/setPayPassword/setPayPassword.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
const md5 = require('../../../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: "", //1:设置 2：忘记
    title: "",
    phone: "",
    password: "",
    password_copy: "",
    code: "",
    verify_text: "获取验证码",
    sending: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      phone: app.globalData.userInfo.phone
    })
    const {
      status
    } = options
    this.setData({
      title: status == 2 ? "忘记支付密码" : "支付密码设置",
      status
    })
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


  //获取验证码
  getCode() {
    if (this.data.sending) {
      wx.showToast({
        title: '请稍后再试',
        icon: "none"
      })
      return
    }
    if (app.testPhone(this.data.phone) !== 2) {
      return
    }
    this.setData({
      sending: true
    })
    this.sendCode()
    let all = 60
    this.timer = setInterval(() => {
      if (all === 0) {
        clearInterval(this.timer)
        this.setData({
          verify_text: "获取验证码",
          sending: false
        })
        return
      }
      all -= 1
      this.setData({
        verify_text: all + " s"
      })
    }, 1000)
  },
  //发送验证码
  sendCode() {
    http.HttpRequst(false, '/member/user-api/send-sms', 2, '', {
        token: app.globalData.token,
        phone: this.data.phone,
        type: "payPassword"
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {}
      }
    )
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
    if (app.testPhone(this.data.phone) !== 2) {
      return
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return
    }
    if (this.data.password == "") {
      wx.showToast({
        title: '请填写支付密码',
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
    const status = this.data.status
    let url = status == 2 ? "/member/user-api/reset-pay-password" : "/member/user-api/set-pay-password"
    http.HttpRequst(true, url, 2, '', {
        token: app.globalData.token,
        phone: this.data.phone,
        password: md5.md5(this.data.password),
        code: this.data.code
      },
      'POST',
      false,
      (res) => {
        if (res.data.errcode == 0) {
          app.globalData.userInfo.is_set_paypassword =1
          wx.showToast({
            title: '设置成功',
          })
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