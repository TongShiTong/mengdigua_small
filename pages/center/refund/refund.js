// pages/center/refund/refund.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: '',
    startPage: 0,
    isEmpty: false,
    isShowModal: false,
    timers:[],
    times:[],
    refundName: ['退款关闭','等待商家处理,', '等待买家发货,', '等待商家收货,', '商家拒绝退款,', '退款成功', '退款失败']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)

  },
  onUnload(){
    this.data.timers.forEach((item)=>{
      clearInterval(item)
    })
  },
  jumpShopDetail(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  // 跳转退款订单列表
  getList() {
    let self = this;
    self.setData({
      startPage: 0
    })
    http.HttpRequst(true, '/order/me-refund-api/refund-list', 2, '', {
        token: app.globalData.token,
        start_page: self.data.startPage,
        pages: 10
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            orderList: res.data.data
          })
          if (res.data.data.total_count == 0) {
            self.setData({
              isEmpty: true
            })
          } else {
            self.setData({
              isEmpty: false
            })
            self.startCount()
          }
        }
      }
    )
  },
  startCount(){
    let self = this;
    let list=this.data.orderList.list
    list.forEach((item,idx)=>{
      let sec = item.refund.second;
      self.setData({
        [`timers[${idx}]`]:setInterval(()=>{
          if(sec > 0){
            sec -= 1;
            self.setData({
              [`times[${idx}]`]:sec
            })
          }else{
            this.data.timers[idx] ? clearInterval(this.data.timers[idx]):void 0
            if(item.refund_status == 2){
              http.HttpRequst(true, '/order/me-refund-api/cancel', 2, '',
                {
                  token: app.globalData.token,
                  id: item.id,
                  type: item.refund.type
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
            }
          }
        },1000)
      })
    })
  },
  // 加载更多

  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.orderList.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/order/me-refund-api/refund-list', 2, '', {
          token: app.globalData.token,
          start_page: self.data.startPage,
          pages: 10
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let listData = "orderList.list";
            let list = res.data.data.list;
            let newListData = self.data.orderList.list.concat(list);
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
    }
  },
  // 跳转物流
  jumpLog(e) {
    let lognumber = e.currentTarget.dataset.lognumber;
    if (lognumber) {
      wx.navigateTo({
        url: '/pages/order/logisticsInfo/logisticsInfo?order_no=' + lognumber
      })
    } else {
      wx.showToast({
        title: '暂无物流信息',
        icon: 'success',
        duration: 1000
      })
    }
  },
  // 跳转退款详情
  jumpRefundDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/center/refund/refundDetail/refundDetail?id=' + id
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(this.data.timers){
      this.data.timers.forEach((item) => {
        clearInterval(item)
      })
    }
    this.getList();
    this.setData({
      isShowModal: app.globalData.showModal
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
    this.loadMore()
  },
  getServicekeFu() {
    let self = this
    common.servicekeFu(self, "", "", 0, function(res) {
      self.setData({
        params: JSON.stringify(res.param),
        transferAction: res.transferAction
      })
    })
  },
})