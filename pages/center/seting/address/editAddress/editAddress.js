// pages/center/seting/address/editAddress/editAddress.js
const app = getApp()
const http = require('../../../../../utils/http.js')
const common = require('../../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    showMask: false,
    condition: false,
    p_id: '',
    c_id: '',
    d_id: '',
    cityValue: '',
    userName: '',
    phone: '',
    detailAddress: '',
    addressId: '',
    isDefault: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    var self = this
    if (options.id) {
      self.setData({
        addressId: options.id
      })
      self.daftAddress();
    }
  },
  // 获取地址列表
  daftAddress: function() {
    let self = this;
    http.HttpRequst(true, '/shop/me-address-api/view', 2, '', {
        token: app.globalData.token,
        start_page: 0,
        maid: self.data.addressId,
        pages: 999
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          let address = res.data.data
          let addressValue = address.pname + address.cname + address.dname
          self.setData({
            userName: address.name,
            phone: address.tel,
            detailAddress: address.address,
            isDefault: address.is_top,
            p_id: address.p_id,
            c_id: address.c_id,
            d_id: address.d_id,
            cityValue: addressValue
          })
          if (address.is_top == 1) {
            self.setData({
              checked: true,
              isDefault: 1
            })
          } else {
            self.setData({
              checked: false,
              isDefault: 0
            })
          }
        }

      })
},
// 获取联系人
getUserName: function(e) {
  this.setData({
    userName: e.detail.value
  })
},
// 手机号
getPhone: function(e) {
  this.setData({
    phone: e.detail.value
  })
},
// 详细地址
getDetailAddress: function(e) {
  let str = e.detail.value.replace(/^\s+|\s+$/g, '')
  this.setData({
    detailAddress: str
  })
},
// 是否默认地址
switchChange(e) {
  if (e.detail.value === true) {
    this.setData({
      isDefault: 1
    })
  } else {
    this.setData({
      isDefault: 0
    })
  }
},
deleteAddress() {
  this.setData({
    showMask: true
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
  http.HttpRequst(true, '/shop/me-address-api/delete', 2, '', {
      token: app.globalData.token,
      maid: self.data.addressId,
    },
    'POST',
    false,
    function(res) {
      if (res.data.errcode == 0) {
        wx.showToast({
          title: '删除成功',
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
//打开省市区
open: function() {
  this.setData({
    condition: true
  });
},
// 修改地址
addAddress: function() {
  let self = this;
  if (self.data.userName == '') {
    wx.showToast({
      title: '请输入收货人',
      icon: 'none',
      duration: 1000
    })
  } else if (app.testPhone(self.data.phone) === 0) {

  } else if (app.testPhone(self.data.phone) === 1) {

  } else if (self.data.cityValue == '') {
    wx.showToast({
      title: '请选择区域',
      icon: 'none',
      duration: 1000
    })
  } else if (self.data.detailAddress == '') {
    wx.showToast({
      title: '详细地址',
      icon: 'none',
      duration: 1000
    })
  } else {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    http.HttpRequst(true, '/shop/me-address-api/update', 2, '', {
        token: app.globalData.token,
        maid: self.data.addressId,
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
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '修改成功',
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
  }
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

}
})