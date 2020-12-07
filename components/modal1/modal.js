// components/modal/modal.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModel: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    showType: { 
      type: String,
      value: '1', 
      observer: function (newVal, oldVal, changedPath) {
       
      }
    },
    img_url: {
      type: String,
      observer: function (newVal, oldVal, changedPath) {

      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 分享好友
    shareSuccess() {
      let self = this;
      http.HttpRequst(false, '/item/me-item-api/share-item', 2, '',
        {
          token: app.globalData.token,
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {

          }
        }
      )
    },
    addAdress(){
      this.triggerEvent('jumpAddress1')
    },
    close(){
      // if (this.data.showType!=1){
        this.triggerEvent('xcFf')
        // this.triggerEvent('change')
      // }
    },
    close1(){
      this.setData({
        isModel: false
      })
    },
    // 保存图片
    shareSave() {
      let self = this;
      this.setData({
        showsetModel:false,
      })
      wx.getImageInfo({
        src: self.data.inviteData.img_url,
        success(res) {

          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      })
    },
    // 保存判断
    preeSave() {
      let self = this;
      common.judePicSave(self, self.data.img_url)
    },
   
    confirm(e) {
      if (e.detail.errMsg !='getUserInfo:ok'){
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
        success(res){
          // wx.showLoading({
          //   title: res.encryptedData,
          //   mask: true
          // })
          http.HttpRequst(true, '/member/user-api/save-unionid', 2, '',
            {
              token: app.globalData.token,
              encryptedData: res.encryptedData,
              iv: res.iv,
            },
            'POST',
            false,
            function (res) {
              if (res.data.errcode == 0) {
              }
            }
          )
          http.HttpRequst(true, '/member/user-api/save-login-time', 2, '',
            {
              token: app.globalData.token,
              type: 1,
            },
            'POST',
            false,
            function (res) {
              if (res.data.errcode == 0) {

              }
            }
          )
          }
      })
      let self = this;
      let userInfo = e.detail.userInfo;
      if (app.globalData.userInfo.nickname != ''){
        self.setData({
          isShowModal: false
        })
        app.globalData.showModal = false;
        return false
       }
      http.HttpRequst(true, '/member/user-api/update', 2, '',
        {
          token: app.globalData.token,
          head_url: userInfo.avatarUrl,
          nickname: userInfo.nickName
        },
        'POST',
        false,
        function (res) {
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
    // 分享好友
    shareSuccess() {
      let self = this;
      http.HttpRequst(false, '/item/me-item-api/share-item', 2, '',
        {
          token: app.globalData.token,
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {

          }
        }
      )
    },
    // 保存图片
    shareSave() {
      let self = this;
      wx.getImageInfo({
        src: self.data.inviteData.img_url,
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      })
    },
    // 分享调用点接口
    shareSuccess() {
      let self = this;
      http.HttpRequst(false, '/item/me-item-api/share-item', 2, '',
        {
          token: app.globalData.token,
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {

          }
        }
      )
    },
  }
})
