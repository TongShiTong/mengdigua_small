// pages/center/shareCoupon/shareCoupon.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageHeight: app.globalData.pageHeight,
    shareId: '',
    listData: '',
    // uid: '',
    shareCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.share_id) {
      this.setData({
        shareId: options.share_id
      })
    }else if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      scene = this.hrefObj(scene);
      this.setData({
        // uid: scene.uid,
        shareCode: scene.share_code,
        shareId: scene.share_id
      })
      this.getSuperUser();
    }
    this.getList()
  },
  // 解析小程序的url
  hrefObj(url) {
    var localarr = url.split('&');
    var tempObj = {};
    for (var i = 0; i < localarr.length; i++) {
      tempObj[localarr[i].split('=')[0]] = localarr[i].split('=')[1];
    }
    return tempObj;
  },
  // 获取上级信息
  getSuperUser() {
    let self = this;
    if (self.data.shareCode) {
      http.HttpRequst(false, '/hand/fans-api/create-fans', 2, '',
        {
          token: app.globalData.token,
          share_code: self.data.shareCode
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
          }
        }
      )
    }
  },
  // 生成上下级 粉丝
  fans() {
    let self = this;
    http.HttpRequst(false, '/hand/fans-api/create-fans-from-share', 2, '',
      {
        token: app.globalData.token,
        puid: self.data.uid
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
        }
      }
    )
  },
  // 获取分享的优惠券列表
  getList() {
    let self = this;
    http.HttpRequst(false, '/coupon/coupon-share-api/share-list', 2, '',
      {
        token: app.globalData.token,
        share_id: self.data.shareId
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data
          })
        
        }
      }
    )
  },
  // 领取
  receive() {
    let self = this;
    if (self.data.shareId) {
      http.HttpRequst(true, '/coupon/coupon-share-api/batch-receive', 2, '',
        {
          token: app.globalData.token,
          share_id: self.data.shareId
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 1000
            })
            self.updateCoupon();
          }
        }
      )
    }
  },
  // 更新状态
  updateCoupon() {
    let self = this;
    http.HttpRequst(false, '/coupon/coupon-share-api/update-status', 2, '',
      {
        token: app.globalData.token,
        share_id: self.data.shareId
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.getList();
        }
      }
    )
  },
  // 返回
  jumpBack() {
    wx.reLaunch({
      url: '/pages/center/center',
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

  },


})