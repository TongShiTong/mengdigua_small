// pages/member/invite/invite.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    let path = `pages/index/index`
    common.handleShareUrl(this, path)
    this.getPic();
  },
  // 获取推手图文配置
  getPic() {
    let self = this;
    http.HttpRequst(false, '/member/user-api/inviting-posters', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            inviteData: res.data.data
          })
        }
      }
    )
  },
  // 复制邀请码
  copyInfo: function () {
    wx.setClipboardData({
      data: this.data.inviteData.invite_code,
      success(res) {
        wx.getClipboardData({
          success(res) {
            (res.data) // data
          }
        })
      }
    })
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
  onShareAppMessage: function () {
    return {
      title: '首页',
      path: this.data.sharePath
    }
  },
  // // 保存图片
  // shareSave() {
  //   let self = this;
  //   wx.getImageInfo({
  //     src: self.data.inviteData.img_url,
  //     success(res) {
  //       console.log(res)
  //       wx.saveImageToPhotosAlbum({
  //         filePath: res.path,
  //         success(res) {
  //           wx.showToast({
  //             title: '保存成功',
  //             icon: 'success',
  //             duration: 1000
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  // 保存判断
  preeSave() {
    let self = this;
    common.judePicSave(self,self.data.inviteData.img_url)
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

  },

 
})