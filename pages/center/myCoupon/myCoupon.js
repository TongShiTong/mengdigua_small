// pages/center/myCoupon/myCoupon.js
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
    tab: [
      {
        title: '待使用'
      },
      {
        title: '已使用'
      },
      {
        title: '已失效'
      },
      // {
      //   title: '分享被领取'
      // }
    ],   
    activeIndex: 0,
    userInfo: '',
    shareArr: [],
    startPage: 0,
    listData: '',
    shareData: '',
    showShare: false,
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  // 优惠券列表
  getList(status) {
    let self = this;
    http.HttpRequst(true, '/coupon/coupon-api/index', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        status: String(status),
        scenario:"all"
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].isSelect = false;
          }
          self.setData({
            listData: res.data.data,
          })
        }
      }
    )
  },
  // 加载更多订单
  loadMore: function () {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      if (self.data.activeIndex == 0) {
        self.getMoreList(1);
      } else if (self.data.activeIndex == 1) {
        self.getMoreList(3);
      } else if (self.data.activeIndex == 2) {
        self.getMoreList(2);
      } else if (self.data.activeIndex == 3) {
        self.getMoreList(4);
      } 
    }
  },
  // 加载更多
  getMoreList: function (status) {
    let self = this;
    http.HttpRequst(true, '/coupon/coupon-api/index', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        status: status,
        scenario: "all"
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let listData = "listData.list";
          let list = res.data.data.list;
          for (let i = 0; i <list.length; i++) {
            list[i].isSelect = false;
          }
          let newListData = self.data.listData.list.concat(list);
          self.setData({
            [listData]: newListData
          })
        }
      }
    )
  },
  // tab切换
  selectTab: function(e) {
    this.setData({
      activeIndex: e.detail,
      startPage: 0
    })
    if (this.data.activeIndex == 0) {
      this.getList(6)
    } else if (this.data.activeIndex == 1) {
      this.getList(3)
    } else if (this.data.activeIndex == 2) {
      this.getList(2)
    } else if (this.data.activeIndex == 3) {
      this.getList(4)
    }
  },
  // 选择优惠券
  selectCoupon(e) {
    let self = this;
    let isSelect = e.currentTarget.dataset.select;
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let list = 'listData.list' + '[' + index + '].isSelect';
    if(status == 1){
      self.setData({
        [list]: !isSelect
      })
      let couponArr = [];
      for (let i = 0; i < self.data.listData.list.length; i++) {
        if (self.data.listData.list[i].isSelect === true) {
          couponArr.push(self.data.listData.list[i].coupon_id)
        }
      }
      self.setData({
        shareArr: couponArr
      })
    }
  },
  // 分享优惠券
  shareCoupon() {
    let self = this;
    if (self.data.shareArr == '') {
      wx.showToast({
        title: '请选择优惠券',
        icon: 'none',
        duration: 1000
      })
    }else {
      http.HttpRequst(true, '/coupon/coupon-share-api/batch-create', 2, '',
        {
          token: app.globalData.token,
          coupon_ids: self.data.shareArr
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              shareData: res.data.data,
              showShare: true
            })
          }
        }
      )
    }
  },
  //初始化
  closeShare() {
    this.getList(6);
    this.setData({
      shareArr: []
    })
  },
  // 分享成功
  shareSuccess() {
    let self = this;
    http.HttpRequst(false, '/coupon/coupon-share-api/update-status', 2, '',
      {
        token: app.globalData.token,
        share_id: self.data.shareData.share_id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.getList(6);
          self.setData({
            shareArr: []
          })
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
    this.getList(6);
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

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    let self = this;
    http.HttpRequst(false, '/coupon/coupon-share-api/update-status', 2, '',
      {
        token: app.globalData.token,
        share_id: self.data.shareData.share_id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.getList(6);
        }
      }
    )
    let path = `pages/center/shareCoupon/shareCoupon?share_id=${self.data.shareData.share_id}`
    common.handleShareUrl(self, path)
    return {
      title: '首页',
      path: this.data.sharePath
    }
    // return {
    //   title: '优惠券',
    //   path: '/pages/center/shareCoupon/shareCoupon?share_id=' + self.data.shareData.share_id
    // }
  },
  goCouponCenter:function(){
    let self = this;
    wx.navigateTo({
      url: '/pages/center/myCoupon/couponCenter/couponCenter',
    })
  },
  goHome(e){
    let type = e.currentTarget.dataset.type;
    let name = type == 3 ? '商品券' : type==4?'品类券':''
    let id = e.currentTarget.dataset.id;
    if (type == 3 || type == 4){
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?couId=' + id + '&name=' + name
      })
    }else{
      wx.switchTab({
        url: '/pages/index/index'
      })
    }

  }
})