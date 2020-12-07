// pages/order/order.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barHeight: app.globalData.totalHeight,
    _ratio: app.globalData._ratio,
    tab: [{
        name: '全部订单',
      },
      {
        name: '正在拼团',
      },
      {
        name: '拼团成功',
      },
      {
        name: '拼团失败',
      },

    ],
    tabIndex: 0,
    orderList: '',
    cancelModal: false,
    remindModal: false,
    deleteModal: false,
    startPage: 0,
    orderId: '',
    selectId: '',
    isEmpty: false,
    isShowModal: false,
    postUrl: "/order/order-api/get-group-order-list", //接口地址
    title:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    this.getAllGroupList()
    this.setData({
      shop_name: app.globalData.shop_name
    })
    if (options.tabIndex) {
      let tabIndex = Number(options.tabIndex) + 1;
      this.setData({
        tabIndex: tabIndex
      })
    } else {
      this.setData({
        tabIndex: ''
      })
    }
    if (options.type) {
      let type = options.type;
      this.setData({
        type: options.type
      })
      if (type == 1) {
        this.setData({
          postUrl: '/order/order-api/get-group-order-list',
          title:"我的拼团"
        })
      } else {
        this.setData({
          postUrl: "/order/order-api/get-group-order-team",
          title: "我的推广团"

        })
      }
    }
  },
  // 获取订单列表
  getOrderList: function(status) {
    let self = this;
    let group_status = self.data.type == 1 ? "group_status" : "status"
    http.HttpRequst(true, this.data.postUrl, 2, '', {
        token: app.globalData.token,
        pages: 10,
        start_page: self.data.startPage,
        [group_status]: String(status)
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            orderList: res.data.data
          })
          if (res.data.data.total_pages == 0) {
            self.setData({
              isEmpty: true
            })
          } else {
            self.setData({
              isEmpty: false
            })
          }
        }
      }
    )
  },
  // 切换订单状态
  selectTab: function(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.tabIndex) {
      return
    } else {
      this.setData({
        tabIndex: index
      })
    }
    this.selectOrderStatus();
  },
  // 选择订单状态
  selectOrderStatus: function() {
    let self = this;
    self.setData({
      startPage: 0
    })
    if (self.data.tabIndex == 0) {
      self.getOrderList('');
    } else if (self.data.tabIndex == 1) {
      self.getOrderList(0);
    } else if (self.data.tabIndex == 2) {
      self.getOrderList(1);
    } else if (self.data.tabIndex == 3) {
      self.getOrderList(2);
    } else if (self.data.tabIndex == 4) {
      self.getOrderList(3);
    }
  },
  // 加载更多订单
  loadMore: function() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.orderList.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      if (self.data.tabIndex == 0) {
        self.getMoreOrder('');
      } else if (self.data.tabIndex == 1) {
        self.getMoreOrder(0);
      } else if (self.data.tabIndex == 2) {
        self.getMoreOrder(1);
      } else if (self.data.tabIndex == 3) {
        self.getMoreOrder(2);
      } else if (self.data.tabIndex == 4) {
        self.getMoreOrder(3);
      }
    }
  },
  // 加载更多订单
  getMoreOrder: function(status) {
    let self = this;
    let group_status = self.data.type == 1 ? 'group_status' : 'status'
    http.HttpRequst(true, this.data.postUrl, 2, '', {
        token: app.globalData.token,
        pages: 10,
        start_page: self.data.startPage,
        [group_status]: status
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          let listData = "orderList.list";
          let list = res.data.data.list;
          let newListData = self.data.orderList.list.concat(list)
          self.setData({
            [listData]: newListData
          })
        }
      }
    )
  },
  // 提醒发货
  remindDeliver: function(e) {
    let self = this
    self.setData({
      formId: e.detail.formId
    })
    common.saveForm(self)
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    if (status == 0) {
      http.HttpRequst(true, '/order/order-api/remind', 2, '', {
          token: app.globalData.token,
          order_id: id
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
  openModel(e) {
    let self = this;
    self.setData({
      isShowModal: true
    })
    let groupId = e.currentTarget.dataset.groupid
    if (groupId == self.data.groupId) {
      return
    }
    self.setData({
      groupId: groupId
    })
    let path = `pages/assemble/joinGroup/joinGroup?group_team_id=${groupId}&type=3`
    common.handleShareUrl(this, path)

    common.getPoster(self, '/item/me-item-api/merger-img', {
      group_team_id: groupId
    })

  },
  // 取消订单 modal
  showCancel: function(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      cancelModal: true,
      selectId: id
    })
  },
  // 删除订单 modal
  showDelete(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      deleteModal: true,
      selectId: id
    })
  },
  goBuy: function(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    self.setData({
      formId: e.detail.formId
    })
    common.saveForm(self)
    wx.navigateTo({
      url: '/pages/goodDetail/payView/payView?id=' + id,
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
  // 确定取消订单
  confirmCancel: function() {
    let self = this;
    self.setData({
      cancelModal: false
    })
    http.HttpRequst(true, '/order/order-api/main-cancel', 2, '', {
        token: app.globalData.token,
        main_order_id: self.data.selectId
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
            self.getOrderList('')
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
    if(self.data.type==1){
      http.HttpRequst(true, '/order/order-api/main-delete', 2, '', {
        token: app.globalData.token,
        main_order_id: self.data.selectId
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
            setTimeout(() => {
              self.getOrderList('')
            }, 1000)
          }
        }
      )
    }else{
      http.HttpRequst(true, '/item/me-group-team-api/delete-team-order-info', 2, '', {
        token: app.globalData.token,
        group_team_id: self.data.selectId
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
            setTimeout(() => {
              self.getOrderList('')
            }, 1000)
          }
        }
      )
    }
    
  },
  // 打开确认收货弹窗
  confirmRemind: function(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;

    self.setData({
      remindModal: true,
      selectId: id
    })
  },
  // 关闭确认收货弹窗
  closeRemindModal: function() {
    this.setData({
      remindModal: false
    })
  },
  // 确认收货
  confirmDelivery: function() {
    let self = this;
    self.setData({
      remindModal: false
    })
    http.HttpRequst(true, '/order/order-api/confirm', 2, '', {
        token: app.globalData.token,
        order_id: self.data.selectId
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
            self.getOrderList(2);
          }, 1000)
        }
      }
    )
  },
  // 跳转订单详情
  jumpOrderDetail: function(e) {
    this.setData({
      orderId: e.currentTarget.dataset.id,
    })
    let groupId = e.currentTarget.dataset.groupid
    wx.navigateTo({
      url: '/pages/center/groupOrder/groupDetail/groupDetail?id=' + this.data.orderId + '&groupId=' + groupId
    })
  },
  // 跳转物流
  jumpLog: function(e) {
    let order_no = e.currentTarget.dataset.lognumber;
    if (order_no) {
      wx.navigateTo({
        url: '/pages/order/logisticsInfo/logisticsInfo?order_no=' + order_no
      })
    } else {
      wx.showToast({
        title: '暂无物流信息',
        icon: 'success',
        duration: 1000
      })
    }
  },
  // 跳转评价
  jumpGoEvaluate: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/evaluate/evaluate?id=' + id
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
  // 跳转首页
  jumpHome() {
    wx.reLaunch({
      url: '/pages/index/index',
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
    this.selectOrderStatus();
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
    this.loadMore()
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

    return {
      title: '拼团中',
      path: this.data.sharePath
    }
  },
  // 跳转店铺详情
  jumpShopDetail(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  // 去邀請
  goPushRoute(e) {
    app.pushRoute(e)
  },
  //拼团列表大家
  getAllGroupList() {
    let self = this;
    common.getgoodsList(self, '/item/group-api/group-item-list', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    }, 'allGroupList')
  },
})