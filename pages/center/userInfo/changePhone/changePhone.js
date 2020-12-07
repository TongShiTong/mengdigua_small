// pages/center/userInfo/changePhone/changePhone.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    userInfo: '',
    showCodeTime: false,
    codeText: '',
    check:0,
    title:"修改登录手机号",
    isBindPhone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    // this.getPicCode()
    this.setData({
      isBindPhone: app.globalData.isBindPhone
    })
    if (options.check){
      this.setData({
        check:1,
        phone: app.globalData.userInfo.phone,
        title:"验证手机号码"
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  // 获取手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // getPicCode() {
  //   let self = this;
  //   http.HttpRequst(true, '/member/user-api/get-img-code', 2, '',
  //     {
  //       phone: self.data.phone,
  //       type: 'changePhone',
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
  // 获取验证码
  getCode: function () { 
    let self = this;
    // if (self.data.codePic == "") {
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
      let type = 'changePhone'
      if (self.data.check==1){
        type = 'checkPhone'
      }
      http.HttpRequst(true, '/member/user-api/send-sms', 2, '',
        {
          phone: self.data.phone,
          type: type
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              showCodeTime: true,
              codeText: 60
            })
            var codeTime = setInterval(function () {
              self.setData({
                codeText: self.data.codeText - 1
              });
              if (self.data.codeText == -1) {
                clearInterval(codeTime);
                self.setData({
                  showCodeTime: false,
                  codeText: ''
                })
              }
            }, 1000)
          }
        })
    }
  },
  //获取输入的验证码
  inputCode: function (e) { 
    this.setData({
      code: e.detail.value
    })
  },
  // 保存新手机号
  savePhone: function () { 
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
      let url = '/member/user-api/change-phone'
      let type =""
      if (self.data.check==1){
        url ="/member/user-api/check-code"
        type = "checkPhone"
      }
        http.HttpRequst(true, url, 2, '',
        {
          token: app.globalData.token,
          phone: self.data.phone,
          code: self.data.code,
          type: type
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
            if(self.data.check==0){
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }else{
              wx.redirectTo({
                url: '/pages/center/userInfo/changePhone/changePhone'
              })
               
            }
         
          }
        }
      )
    }
  },
  // 获取输入的验证码
  inputCode1: function (e) {
    this.setData({
      codePic: e.detail.value
    })
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