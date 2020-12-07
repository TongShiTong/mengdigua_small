// pages/bandInfo/bandInfo.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageHeight: app.globalData.pageHeight,
    totalHeight: app.globalData.totalHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  getPhoneNumber (e) {
    let self = this
    http.HttpRequst(true, '/member/user-api/save-wx-user-phone', 2, '', {
      token: app.globalData.token,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          // 复制后重绑定
          if (res.data.data){
            if (res.data.data.token){
              app.globalData.token = res.data.data.token.token;
              app.globalData.userInfo = res.data.data;
              app.globalData.role = res.data.data.role;
            }
            wx.setStorageSync('token',res.data.data.token.token)
            if (app.globalData.userInfo.nickname == '') {
              http.HttpRequst(
                false,
                "/member/user-api/info",
                2,
                "",
                {
                  token: app.globalData.token,
                },
                "POST",
                false,
                function (res1) {

                  if (res1.data.errcode == 0) {
                    app.globalData.userInfo = res1.data.data;
                    app.globalData.role = res1.data.data.role;
                    wx.setStorageSync('userInfo',res1.data.data);
                    wx.setStorageSync('role',res1.data.data.role);
                    wx.setStorageSync('is_show_shop',res1.data.data.is_show_shop);
                  }
                  self.setData({
                    isShowModal: false
                  })
                  app.globalData.showModal = false;
                }
              );
            }else{
    
              wx.setStorageSync('userInfo',res.data.data);
              wx.setStorageSync('role',res.data.data.role);
              wx.setStorageSync('is_show_shop',res.data.data.is_show_shop);
              self.setData({
                isShowModal: false
              })
              app.globalData.showModal = false;
              self.triggerEvent('authorization')
            }
            http.HttpRequst(true, '/member/user-api/save-login-time', 2, '', {
              token: app.globalData.token,
              type: 1,
              },
              'POST',
              false,
              function(res) {
                if (res.data.errcode == 0) {
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              }
            )
          }
          // self.bindCode()
        } 
      }
    )
  },
  confirm(e) {
    console.log(45654,e)
    let self = this
    if (e.detail.errMsg != 'getUserInfo:ok') {
      return
    }
    wx.checkSession({
      success(res) {

        // session_key 未过期，并且在本生命周期一直有效
      },
      fail(res) {
        // session_key 已经失效，需要重新执行登录流程

      }
    })
    wx.getUserInfo({
      success(res) {
        // wx.showLoading({
        //   title: res.encryptedData,
        //   mask: true
        // })
        http.HttpRequst(true, '/member/user-api/save-unionid', 2, '', {
            token: app.globalData.token,
            encryptedData: res.encryptedData,
            iv: res.iv,
          },
          'POST',
          false,
          function(res) {
            if (res.data.errcode == 0) {
              // 复制后重绑定
              if (res.data.data){
                if (res.data.data.token){
                  app.globalData.token = res.data.data.token.token
                  app.globalData.userInfo = res.data.data;
                  app.globalData.token = res.data.data.token.token;
                  app.globalData.role = res.data.data.role;

                }
              }
              self.bindCode()
            } 
          }
        )
        http.HttpRequst(true, '/member/user-api/save-login-time', 2, '', {
            token: app.globalData.token,
            type: 1,
          },
          'POST',
          false,
          function(res) {
            if (res.data.errcode == 0) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        )
      }
    })
    let userInfo = e.detail.userInfo;
  
    if (app.globalData.userInfo.nickname != '') {
      self.setData({
        isShowModal: false
      })
      app.globalData.showModal = false;
      return false
    }
    http.HttpRequst(true, '/member/user-api/update', 2, '', {
        token: app.globalData.token,
        head_url: userInfo.avatarUrl,
        nickname: userInfo.nickName
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            isShowModal: false
          })
          app.globalData.showModal = false;
          self.triggerEvent('authorization')
        }
      }
    )

  },
  bindCode() {
    if (app.globalData.share_code!=""){
      http.HttpRequst(false, '/hand/fans-api/create-fans', 2, '', {
        token: app.globalData.token,
        share_code: app.globalData.share_code
      },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
          }
        }
      )
    }
   
  }
})