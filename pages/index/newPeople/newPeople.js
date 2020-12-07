// pages/index/newPeople/newPeople.js
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
    listData: '',
    banner: '',
    // uid: '',
    shareCode: '',
    showShare: false,
    shareData: '',
    startPage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    common.handleShareUrl(this, "pages/index/newPeople/newPeople")
    this.getlist();
    this.getBanner();
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      scene = this.hrefObj(scene);
      this.setData({
        // uid: scene.uid
        shareCode: scene.share_code
      })
      this.getSuperUser();
    }
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
            // self.fans();
            // console.log('绑定成功')
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
          // console.log('绑定成功')
        }
      }
    )
  },
  // 新人必买
  getlist() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/index', 2, '',
      {
        token: app.globalData.token,
        is_buy: 1,
        start_page: 0,
        pages: 10
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data
          })
        }
      }
    )
  },
  // 获取图片
  getBanner() {
    let self = this;
    http.HttpRequst(true, '/banner/banner-api/index', 2, '',
      {
        seat_id: 12
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
  // 点击banner
  tapBanner(e) {
    let item = e.currentTarget.dataset.item;
    if (item.show_type == 3) {
      app.globalData.rich = item.param;
      wx.navigateTo({
        url: '/pages/rich/rich'
      })
    } else if (item.show_type == 5) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + item.param
      })
    }
  },
  // 加载更多商品
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
      http.HttpRequst(true, '/item/me-item-api/index', 2, '',
        {
          token: app.globalData.token,
          is_buy: 1,
          start_page: self.data.startPage,
          pages: 10
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "listData.list";
            let list = res.data.data.list;
            let newListData = self.data.listData.list.concat(list);
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
    }
  },
  // 跳转商品详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
    })
  },
  // 显示分享组件 获取分享海报
  shareView() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/get-new-people-poster', 2, '',
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
    let self = this;
    return {
      title: '新人必买',
      path: this.data.sharePath
    }
    // return {
    //   title: '新人必买',
    //   path: '/pages/index/newPeople/newPeople'
    // }
  },
})