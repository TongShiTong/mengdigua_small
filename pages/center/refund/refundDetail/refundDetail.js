// pages/center/refund/refundDetail/refundDetail.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
const utils = require('../../../../utils/util.js') 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: '',
    refundId: '',
    cancelModal: false,
    isShowModal: false,
    time:'',
    refundTime:'',
    timer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        refundId: options.id,
        returnShop: app.globalData.returnShop,
      })
      this.getDetail()
    }
  },
  // 获取退款详情
  getDetail() {
    let self = this;
    http.HttpRequst(true, '/order/me-refund-api/refund-details', 2, '',
      {
        token: app.globalData.token,
        refund_id: self.data.refundId
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          res.data.data.price_total = Number(res.data.data.price_total).toFixed(2);
          self.setData({
            detailData: res.data.data,
            shopid: res.data.data.shop_id,
            item_id: res.data.data.orderSku[0].item_id
          })
          self.setCountdown(res.data.data.second||0);
          self.getServicekeFu();
        }
      }
    )
  },
  navBack(){
    wx.navigateBack({
      delta:1
    })
  },
  // 显示取消申请modal
  setCountdown(sec){
    let self = this;
    this.setData({
      timer : setInterval(() => {
        if (sec > 0) {
          sec -= 1;
          self.setData({
            refundTime: sec
          })
        } else {
          return false
        }
      }, 1000)
    }) 
   
  },
  showCancelModal: function() {
    this.setData({
      cancelModal: true,

    })
  },
  // 关闭取消申请modal
  closeCancelModal: function () {
    this.setData({
      cancelModal: false
    })
  },
  // 确定取消申请
  confirmCancel: function () {
    let self = this;
    self.setData({
      cancelModal: false
    })
    http.HttpRequst(true, '/order/me-refund-api/cancel', 2, '',
      {
        token: app.globalData.token,
        id: self.data.refundId,
        type: self.data.detailData.type
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
    )
  },
  // 跳转修改申请
  jumpEditApp() {
    app.globalData.editOrderReturn = this.data.detailData;
    wx.navigateTo({
      url: '/pages/center/refund/editRefund/editRefund'
    })
  },
  // 拨打电话
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: '0571-86822511' // 仅为示例，并非真实的电话号码
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
    this.setData({
      isShowModal: app.globalData.showModal
    })
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
    clearInterval(this.data.timer)
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
  // 跳转店铺详情
  jumpShopDetail(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  getServicekeFu() {
    let self = this
    common.servicekeFu(self, self.data.shopid, self.data.item_id, 0, function (res) {
      self.setData({
        params: JSON.stringify(res.param),
        transferAction: res.transferAction
      })
    })
  },
})