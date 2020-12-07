// pages/goodDetail/payView/payView.js
const app = getApp()
const http = require('../../../utils/http.js')
const units = require('../../../utils/util.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    orderInfo: '',
    pay: [{
        img: "/images/order/wechat.png",
        title: '微信支付',
      },
      // {
      //   img: "/images/order/alipay.png",
      //   title: '支付宝支付',
      // }
    ],
    payIndex: 0,
    order_id: "", //订单id
    formId: "", // 提交的formId
    Time: "", //倒计时
    infoType: 0,
    lastTime: "",
    times: 0,
    goType: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    if (options.goType) {
      this.setData({
        goType: options.goType
      })
    }
    if (options.id) {
      this.setData({
        order_id: options.id
      })
      this.payInfo();
    } else {
      app.globalData.orderInfo.pay_amount = this.returnFloat(app.globalData.orderInfo.pay_amount)
      this.setData({
        orderInfo: app.globalData.orderInfo
      })
      if (this.data.orderInfo) {
        this.setTime();
      }
    }
  },
  // 保留两位小数
  returnFloat(value){
    var value=Math.round(parseFloat(value)*100)/100;
    var s=value.toString().split(".");
    if(s.length==1){
      value=value.toString()+".00";
      return value;
    }
    if(s.length>1){
      if(s[1].length<2){
        value=value.toString()+"0";
      }
      return value;
    }
  },
  
  // 选择支付方式
  selectIndex: function(e) {
    this.setData({
      payIndex: e.currentTarget.dataset.index
    })
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
    clearInterval(this.data.lastTime)
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
  // 从订单支付过来 获取支付信息
  payInfo: function() {
    let self = this;
    http.HttpRequst(true, '/pay/pay-api/main-reset-order', 2, '', {
        token: app.globalData.token,
        main_order_id: self.data.order_id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          console.log(11111,res)
          self.setData({
            orderInfo: res.data.data,
            infoType: 1
          })
          self.setTime();
        }
        if (res.data.errcode == 30004) {
          wx.redirectTo({
            url: '/pages/assemble/joinGroup/joinGroup?type=1'
          })
      }
      if (res.data.errcode == 999999) {
        wx.showModal({
          title: '提示',
          content: res.data.errmsg,
          confirmText: "确定",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    }
  )
},
setTime: function() {
  let self = this;
  var time = parseInt(self.data.orderInfo.second)
  if (time > 0) {
    self.setData({
      Time: units.formatSeconds(time)
    })
    self.data.lastTime = setInterval(() => {
      time--
      self.setData({
        Time: units.formatSeconds(time)
      })
      if (time <= 0) {
        clearInterval(self.data.lastTime)
        wx.showModal({
          title: '提示',
          content: '这个是一个超时的订单',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {}
          }
        })
      }
    }, 1000)
  } else {
    wx.showModal({
      title: '提示',
      content: '这个是一个超时的订单',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {

        }
      }
    })
  }
},
// 支付
getPay(e) {
  let self = this;
  if (e) {
    self.setData({
      formId: e.detail.formId
    })
    self.saveForm();
  }

  http.HttpRequst(true, '/pay/pay-api/mini', 2, '', {
      token: app.globalData.token,
      token_type: 1,
      order_id: self.data.orderInfo.pay_order_no,
      channel: "WeChat",
      product_type: "sku",
      open_id: app.globalData.userInfo.small_openid
    },
    'POST',
    false,
    function(res) {
      if (res.data.errcode == 0) {
        res.data.data = JSON.parse(res.data.data)
        if (res.data.data.appId) {
          self.setData({
            times: 0,
            appId: res.data.data.appId,
            nonceStr: res.data.data.nonceStr,
            paySign: res.data.data.paySign,
            package: res.data.data.package,
            timeStamp: res.data.data.timeStamp
          })
          self.rechargePay();
        } else {
          wx.showModal({
            title: '提示',
            content: "支付失败",
            success: function(res) {}
          })
        }
      } else if (res.data.errcode == 30006) {
        if (self.data.times < 4) {
          self.setData({
            times: self.data.times + 1
          })
          setTimeout(() => {
            self.getPay()
          }, 1000)
        }
      }
    }
  )
  // wx.request({
  //   url: app.globalData.baseUrl + '/pay/pay-api/mini',
  //   method: 'POST',
  //   data: {
  //     token: app.globalData.token,
  //     token_type: 1,
  //     order_id: self.data.orderInfo.pay_order_no,
  //     channel: "WeChat",
  //     product_type: "sku",
  //     open_id: app.globalData.userInfo.small_openid
  //   },
  //   header: {
  //     'content-type': 'application/json' // 默认值
  //   },
  //   success: function(res) {
  //     res.data.data = JSON.parse(res.data.data)
  //     if (res.data.data.appId) {
  //       self.setData({
  //         appId: res.data.data.appId,
  //         nonceStr: res.data.data.nonceStr,
  //         paySign: res.data.data.paySign,
  //         package: res.data.data.package,
  //         timeStamp: res.data.data.timeStamp
  //       })
  //       self.rechargePay();
  //     } else {
  //       wx.showModal({
  //         title: '提示',
  //         content: "支付失败",
  //         success: function(res) {}
  //       })
  //     }
  //   }
  // });
},
/**点击确定支付***/
rechargePay: function(e) {
  //调 充值请求, 成功后type设置 为1 , 失败type为 0
  let self = this;
  self.setData({
    recharge_money: 6
  })
  wx.requestPayment({
    'timeStamp': this.data.timeStamp + "",
    'nonceStr': this.data.nonceStr,
    'package': this.data.package,
    'signType': 'MD5',
    'appId': this.data.appId,
    'paySign': this.data.paySign,
    'success': function(res) {
      if (self.data.orderInfo.group_team_id) {
        wx.redirectTo({
          url: '/pages/assemble/joinGroup/joinGroup?type=2' + '&group_team_id=' + self.data.orderInfo.group_team_id
        })
        return
      }
      wx.redirectTo({
        url: '/pages/goodDetail/paySuccess/paySuccess?price=' + self.data.orderInfo.pay_amount + '&goType' + self.data.goType,
        success: function(res) {}
      })
    },
    'fail': function(res) {
      if (self.data.infoType == 1) {
        wx.redirectTo({
          url: '/pages/goodDetail/payFail/payFail?id=' + self.data.order_id + '&goType' + self.data.goType
        })
      } else {
        wx.redirectTo({
          url: '/pages/goodDetail/payFail/payFail?goType=' + self.data.goType
        })
      }
    },
    'complete': function(res) {
    }
  })

},
// 保存formId给后台
saveForm: function() {
  let self = this;
  http.HttpRequst(true, '/notice/notice-api/get-form-id', 2, '', {
      token: app.globalData.token,
      form_id: self.data.formId
    },
    'POST',
    false,
    function(res) {
      if (res.data.errcode == 0) {

      }
    }
  )
}
})