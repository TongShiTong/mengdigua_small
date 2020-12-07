// pages/center/seting/address/address.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: '',
    showMask: false,
    isEmpty: false,
    deletaId: '',
    pageFrom: '',
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.from) {
      this.setData({
        pageFrom: options.from
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取地址列表
  getAddressList: function() {
    let self = this;
    http.HttpRequst(false, '/shop/me-address-api/index', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 999
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            addressList: res.data.data
          })
          if (res.data.data.total_pages == 0) {
            self.setData({
              isEmpty: true
            })
          }else {
            self.setData({
              isEmpty: false
            })
          }
        }
      }
    )
  },
  // 新增地址
  jumpAdd: function() {
    wx.navigateTo({
      url: '/pages/center/seting/address/addAddress/addAddress'
    })
  },
  // 编辑地址
  jumpEdit: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/center/seting/address/editAddress/editAddress?id=' + id
    })
  },
  // 设置默认地址
  setDefaultAddress: function(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    if (status == 1) {

    } else {
      http.HttpRequst(true, '/shop/me-address-api/update', 2, '',
        {
          token: app.globalData.token,
          maid: id,
          is_top: 1
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
            self.getAddressList();
          }
        }
      )
    }
  },
  // 显示弹窗
  showDeleteMask: function(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      showMask: true,
      deletaId: id
    })
  },
  // 关闭弹窗
  closeModal: function() {
    this.setData({
      showMask: false
    })
  },
  // 确定删除
  confirmDeleta: function() {
    let self = this;
    self.setData({
      showMask: false
    })
    http.HttpRequst(true, '/shop/me-address-api/delete', 2, '',
      {
        token: app.globalData.token,
        maid: self.data.deletaId,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(()=>{
            self.getAddressList();
          },1000)
        }
      }
    )
  },
  // 选择收货地址
  selectAddress(e) {
    console.log(11114444,e)
    let addressInfo = e.currentTarget.dataset.address;
    app.globalData.orderAddress = addressInfo;
    if (this.data.pageFrom == 'confirmOrder') {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList();
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