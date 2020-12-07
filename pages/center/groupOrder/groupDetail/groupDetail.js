// pages/order/orderDetail/orderDetail.js
const app = getApp()
const http = require('../../../../utils/http.js')
const formatTime = require('../../../../utils/util.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupSecond:false, //倒计时时间
    time: '',
    detailData: '',
    orderId: '',
    address: '',
    detailAddress: '',
    logData: false,
    cancelModal: false,
    remindModal: false,
    deleteModal: false,
    isShowModalTwo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        orderId: options.id
      })
    }
    if (options.groupId && options.groupId!='undefined') {
      this.setData({
        group_team_id: options.groupId
      })
      this.getGroupList()
      this.getPoster()
      
    }
  },
  // 获取订单详情
  getOrderDetail: function() {
    let self = this;
    http.HttpRequst(true, '/order/order-api/main-order-info', 2, '', {
        token: app.globalData.token,
        main_order_id: self.data.orderId
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          var str = res.data.data.to_address.split(" ");
          self.setData({
            detailData: res.data.data,
            detailAddress: str[1],
            address: str[0],
            shop_id: res.data.data.MainOrders[0].shop_id,
            item: res.data.data.MainOrders[0],
          })
          self.getServicekeFu()
          if (res.data.data.status != 0) {
            self.getLog();
          }
          // 订单倒计时
          // self.timeCountDown()
        }
      }
    )
  },
  // 订单倒计时
  timeCountDown() {
    var date1 = new Date(this.data.detailData.pay_end_time.replace(/-/g, "/")).getTime(); //时间对象
    var date2 = new Date(this.data.detailData.now_time.replace(/-/g, "/")).getTime(); //时间对象
    let time1 = (date1 - date2) / 1000;
    if (time1 <= 0) {
      this.setData({
        time: '00时00分00秒'
      })
    } else {
      let timeIn = setInterval(() => {
        time1--
        var time2 = formatTime.skill(time1);
        this.setData({
          time: time2
        })
        if (time1 == 0) {
          clearInterval(timeIn)
        }
      }, 1000)
    }
  },
  // 物流状态
  getLog() {
    let self = this;
    http.HttpRequst(false, '/order/order-api/logistics', 2, '', {
        token: app.globalData.token,
        order_no: self.data.detailData.order_no
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          if (res.data.data.length != 0) {
            self.setData({
              logData: res.data.data,
            })
          }

        }
      }
    )
  },
  // 提醒发货
  remindDeliver: function(e) {
    let self = this;
    self.setData({
      formId: e.detail.formId
    })
    common.saveForm(self)
    if (self.data.detailData.is_remind == 0) {
      http.HttpRequst(true, '/order/order-api/remind', 2, '', {
          token: app.globalData.token,
          order_id: self.data.detailData.order_id
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '提醒发货成功',
              icon: 'none',
              duration: 1000
            })
            setTimeout(() => {
              self.getOrderDetail()
            }, 1000)
          }
        }
      )
    } else {
      wx.showToast({
        title: '已提醒发货,请勿重复点击',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // 跳转物流
  jumpLog: function() {
    if (this.data.detailData.order_no) {
      wx.navigateTo({
        url: '/pages/order/logisticsInfo/logisticsInfo?order_no=' + this.data.detailData.order_no
      })
    } else {
      wx.showToast({
        title: '暂无物流信息',
        icon: 'success',
        duration: 1000
      })
    }
  },
  // 取消订单 modal
  showCancel: function() {
    this.setData({
      cancelModal: true,
    })
  },
  // 关闭取消订单 modal
  closeModal: function() {
    this.setData({
      cancelModal: false
    })
  },
  // 关闭删除订单 modal
  closeDeleteModal() {
    this.setData({
      deleteModal: false
    })
  },
  // 删除订单 modal
  showDelete() {
    this.setData({
      deleteModal: true,
    })
  },
  // 确认取消订单
  confirmCancel: function() {
    let self = this;
    self.setData({
      cancelModal: false
    })
    http.HttpRequst(true, '/order/order-api/main-cancel', 2, '', {
        token: app.globalData.token,
        main_order_id: self.data.orderId
      },
      'POST',
      false,
      function(res) {
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
  // 确定删除订单
  confirmDelete: function() {
    let self = this;
    self.setData({
      deleteModal: false
    })
    http.HttpRequst(true, '/order/order-api/main-delete', 2, '', {
        token: app.globalData.token,
        main_order_id: self.data.orderId
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
  // 打开确认收货弹窗
  showRemindModal: function(e) {
    let self = this;
    self.setData({
      formId: e.detail.formId
    })
    common.saveForm(self)
    self.setData({
      remindModal: true
    })
  },
  // 关闭确认收货弹窗
  closeRemindModal: function() {
    this.setData({
      remindModal: false
    })
  },
  // 确认收货
  confirmDelivery: function() { // 确认收货
    let self = this;
    self.setData({
      remindModal: false
    })
    http.HttpRequst(true, '/order/order-api/confirm', 2, '', {
        token: app.globalData.token,
        order_id: self.data.detailData.order_id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '收货成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            self.getOrderDetail();
          }, 2000)
        }
      }
    )
  },
  // 电话联系卖家
  contactSeller() {
    wx.makePhoneCall({
      phoneNumber: this.data.detailData.shop.shop_tel //仅为示例，并非真实的电话号码
    })
  },
  // 跳转评价
  jumpEvaluate() {
    wx.navigateTo({
      url: '/pages/order/evaluate/evaluate?id=' + this.data.detailData.main_order_id
    })
  },
  // 跳转退款退货中间页
  jumpSelectReturn(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/selectReturn/selectReturn?id=' + self.data.detailData.id + '&cid=' + id + '&order_pay_amount=' + self.data.detailData.order_pay_amount
    })
  },
  //立即付款
  goBuy: function(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/payView/payView?id=' + this.data.orderId
    })
  },
  // 进入店铺详情
  godetail: function(e) {
    let self = this;
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  // 跳转详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
    })
  },
  // 跳转退款详情
  jumpRefundDetail(e) {
    let id = e.currentTarget.dataset.id;
    if (e.currentTarget.dataset.shop) {
      app.globalData.returnShop = e.currentTarget.dataset.shop
    }
    wx.navigateTo({
      url: '/pages/center/refund/refundDetail/refundDetail?id=' + id
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
    this.getOrderDetail();
    this.setData({
      isShowModalTwo: app.globalData.showModal
    })
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
  // 跳转店铺详情
  jumpShopDetail(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  getGroupList() {
    let self = this;
    common.getGroupList(self, self.data.group_team_id,function(){
      
    })
  },
  close() {
    this.setData({
      isShowModal: false
    })
  },
  openModel() {
    this.setData({
      isShowModal: true
    })
  },
  getPoster() {
    let self = this;
    common.getPoster(self, '/item/me-item-api/merger-img', {
      group_team_id: self.data.group_team_id
    })
  },
  getServicekeFu() {
    let self = this
    common.servicekeFu(self, self.data.shop_id, "", 1, function (res) {
      self.setData({
        params: JSON.stringify(res.param),
        transferAction: res.transferAction
      })
    })
  },
})