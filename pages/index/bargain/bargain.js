// pages/index/vip/vip.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startPage: 0,
    listData: '',
    banner: '',
    // uid: '',
    shareCode: '',
    showShare: false,
    shareData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    common.handleShareUrl(this, "pages/index/bargain/bargain")
    let self = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      scene = self.hrefObj(scene);
      self.setData({
        // uid: scene.uid
        shareCode: scene.share_code
      })
      self.getSuperUser();
    
    }
    self.getBanner()
    self.bargainList()
 
 
  },
  bargainList(){
    let self = this;
    http.HttpRequst(false, '/bargain/me-bargain-api/get-item', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        is_vip: 1,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data,
            userInfo: app.globalData.userInfo
          })
        }
      }
    )
  },
  getBanner(){
    let self = this;
    http.HttpRequst(false, '/banner/banner-api/index', 2, '',
      {
        seat_id: 17
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            banner: res.data.data
          })
        }
      }
    )
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
            setTimeout(() => {
              self.setData({
                userInfo: app.globalData.userInfo
              })
            }, 1000)
            // self.fans();
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
  //加载更多
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      // console.log('加载完了')
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/bargain/me-bargain-api/get-item', 2, '',
        {
          token: app.globalData.token,
          start_page: self.data.startPage,
          pages: 10,
          is_vip: 1,
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "listData.list";
            let list = res.data.data.list;
            let newList = self.data.listData.list.concat(res.data.data.list)
            self.setData({
              [listData]: newList
            })
          }
        }
      )
    }
  },
  // 跳转商品详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    let shop_id = e.currentTarget.dataset.shop_id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id + '&shop_id' + shop_id
    })
  },
  // 点击banner
  tapBanner() {
    if (this.data.list.show_type == 3) {
      app.globalData.rich = this.data.list.param;
      wx.navigateTo({
        url: '/pages/rich/rich'
      })
    } else if (this.data.list.show_type == 5) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + this.data.list.param
      })
    }
  },
  // 显示分享组件 获取分享海报
  shareView() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/get-vip-poster', 2, '',
      {
        token: app.globalData.token
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
  },
  // 返回
  jumpBack() {
    wx.reLaunch({
      url: '/pages/index/index',
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
    this.loadMore()
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    // let self = this;
    return {
      title: '砍价列表',
      path: this.data.sharePath
    }
    // return {
    //   title: 'VIP专享区',
    //   path: '/pages/index/vip/vip'
    // }
  },
  share(e) {
    let id = e.currentTarget.dataset.id;
    // this.triggerEvent('shareGood', id)
    wx.navigateTo({
      url: '/pages/goodDetail/share/share?id=' + id
    })
  },
})