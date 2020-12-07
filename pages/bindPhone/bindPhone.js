// pages/bindPhone/bindPhone.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    phone: '',
    code: '',
    showCodeTime: false,
    codePic: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    // this.getPicCode()
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
  },
  // 获取手机号
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取输入的验证码
  inputCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 获取输入的验证码
  inputCode1: function(e) {
    this.setData({
      codePic: e.detail.value
    })
  },
  // 获取验证码
  getCode: function() {
    let self = this;
    // if (self.data.codePic==""){
    //   wx.showToast({
    //     title: "请输入图片验证码",
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    if (app.testPhone(self.data.phone) === 0) {

    } else if (app.testPhone(self.data.phone) === 1) {

    } else {
      http.HttpRequst(true, '/member/user-api/send-sms', 2, '', {
          phone: self.data.phone,
          type: 'bindPhone',
          // code: self.data.codePic,
          // sign: self.data.sign,
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            self.setData({
              showCodeTime: true,
              codeText: 60
            })
            var codeTime = setInterval(function() {
              self.setData({
                codeText: self.data.codeText - 1
              });
              if (self.data.codeText == -1) {
                clearInterval(codeTime);
                self.setData({
                  showCodeTime: false
                })
              }
            }, 1000)
          }
        })
    }
  },
  // 关闭弹窗
  closeModal: function() {
    this.setData({
      noBindPhone: false
    })
  },
  // 绑定手机
  bindPhone() {
    let self = this;
    if (app.testPhone(self.data.phone) === 0) {

    } else if (app.testPhone(self.data.phone) === 1) {

    } else if (self.data.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000
      })
    } else {
      http.HttpRequst(true, '/member/user-api/bind-phone', 2, '', {
          token: app.globalData.token,
          phone: self.data.phone,
          code: self.data.code
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 1000
            })
            app.globalData.isBindPhone = false;
            app.globalData.userInfo = res.data.data;
            app.globalData.token = res.data.data.token.token;
            if (app.globalData.userInfo.is_invited == 0) {
              // wx.navigateTo({
              //   url: '/pages/bindInviteCode/bindInviteCode',
              // })
            } else {
              // wx.navigateBack({
              //   delta:1
              // })
            }
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        }
      )
    }
  },
  // getPicCode(){
  //   let self = this;
  //   http.HttpRequst(true, '/member/user-api/get-img-code', 2, '',
  //     {
  //       phone: self.data.phone,
  //       type: 'bindPhone',
  //     },
  //     'POST',
  //     false,
  //     function (res) {
  //       if (res.data.errcode == 0) {
  //         self.setData({
  //           sign: res.data.data.sign,
  //           url: res.data.data.url
  //         })
  //       }
  //     })
  // },
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
})