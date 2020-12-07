// pages/goodDetail/share/share.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    id: '',
    shareImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let path = `/pages/goodDetail/goodDetail?id=${options.id}`
    common.handleShareUrl(this, path)
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getPoster();
    }
  },
  // 获取海报
  getPoster() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/merger-img', 2, '', {
        token: app.globalData.token,
        item_id: self.data.id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            shareImg: res.data.data[0]
          })
        }
      }
    )
  },
  // 预览商品图片
  preview: function() {
    wx.previewImage({
      current: [this.data.shareImg.share_img], // 当前显示图片的http链接
      urls: [this.data.shareImg.share_img] // 需要预览的图片http链接列表
    })
  },
  // 长按保存
  preeSave() {
    let self = this;
    // 保存判断
    common.judePicSave(self, self.data.shareImg.share_img)
  },
  // 分享调用点接口
  shareSuccess() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/share-item', 2, '', {
        token: app.globalData.token,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {

        }
      }
    )
  },
  // 保存图片
  shareSave() {
    let self = this;
    wx.getImageInfo({
      src: self.data.shareImg.share_img,
      success(res) {
        // console.log(res)
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    common.handleShareUrl(this, "pages/index/index")
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
  onShareAppMessage: function() {
    let self = this;
    return {
      title: '商品详情',
      path: this.data.sharePath
    }
  }
})