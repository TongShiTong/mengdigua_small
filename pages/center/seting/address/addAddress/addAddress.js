// pages/center/seting/address/addAddress/addAddress.js
const app = getApp()
const http = require('../../../../../utils/http.js')
const common = require('../../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showConfirm: false,
    condition: false,
    p_id: '',
    c_id: '',
    d_id: '',
    cityValue: '',
    userName: '',
    phone: '',
    detailAddress: '',
    isDefault: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
  },
  isShow() {
    if (this.data.userName == '') {
      wx.showToast({
        title: '请输入收货人',
        icon: 'none',
        duration: 1000
      })
    } else if (app.testPhone(this.data.phone) === 0) {

    } else if (app.testPhone(this.data.phone) === 1) {

    } else if (this.data.cityValue == '') {
      wx.showToast({
        title: '请选择区域',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.detailAddress == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        showConfirm: true
      })
    }  
  },
  colse() {
    this.setData({
      showConfirm: false
    })
  },
  // 获取联系人
  getUserName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 详细地址
  getDetailAddress: function (e) { 
    let str = e.detail.value.replace(/^\s+|\s+$/g, '')
    this.setData({
      detailAddress: str
    })
  },
  // 是否默认地址
  switch1Change(e) {
    if (e.detail.value === true) {
      this.setData({
        isDefault: 1
      })
    }else {
      this.setData({
        isDefault: 0
      })
    }
  },
  //打开省市区
  open: function () {
    this.setData({
      condition: true
    });
  },
  // 选择省市区
  getArea(e) {
    let selectData = e.detail;
    this.setData({
      cityValue: selectData.nameVal[0] + '' + selectData.nameVal[1] + '' + selectData.nameVal[2],
      p_id: selectData.selectVal[0],
      c_id: selectData.selectVal[1],
      d_id: selectData.selectVal[2]
    })
  },
  // 添加地址
  addAddress: function() {
    let self = this;
    http.HttpRequst(true, '/shop/me-address-api/create', 2, '',
      {
        token: app.globalData.token,
        p_id: self.data.p_id,
        c_id: self.data.c_id,
        d_id: self.data.d_id,
        address: self.data.detailAddress,
        name: self.data.userName,
        tel: self.data.phone,
        is_top: self.data.isDefault
      },
      'POST',
      false,
      function (res) {
        console.log(78787,res)
        if (res.data.errcode == 0) {
          app.globalData.orderAddress = res.data.data
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          })
          self.setData({
            showConfirm: false
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
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

  }
})