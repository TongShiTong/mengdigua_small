// pages/index/bestSelect/bestSelect.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    start_page: 0,
    recommen_date: [],
    // uid: '',
    shareCode: '',
    showShare: false,
    shareData: '',
    total_pages: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    common.handleShareUrl(this, "pages/index/bestSelect/bestSelect")
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
    http.HttpRequst(false, '/item/recommen-item-api/get-list', 2, '',
      {
        token: app.globalData.token,
        start_page: self.data.start_page,
        pages: 10
      },
      'POST',
      false,
      function (res) {
        let arr = self.unit(res.data.data.list)
        if (res.data.errcode == 0) {
          self.setData({
            list: arr,
            total_pages: res.data.data.total_pages,
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
    let pages = self.data.start_page + 1;
    if (pages > Math.ceil(self.data.total_pages / 10) - 1) {
      // console.log('加载完了')
      return false
    } else {
      self.setData({
        start_page: pages
      })
      http.HttpRequst(true, '/item/recommen-item-api/get-list', 2, '',
        {
          token: app.globalData.token,
          start_page: self.data.start_page,
          pages: 10,
          is_vip: 1,
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let newList = self.data.list.concat(res.data.data.list)
            self.setData({
              list: newList
            })
          }
        }
      )
    }
  },
  //改变日期格式（月 日）
  unit(arr){
    for(let i = 0; i < arr.length; i++){
      let arr1 = arr[i].recommen_date.split('-');
      arr[i].recommen_date = this.bianNum(arr1[1]) + '日' + this.bianNum(arr1[2]) + '月'
    }
    return arr
  },
  //去零
  bianNum(num){
    if(num[0] == 0){
      num = num[1]
    }
    return num
  },
  // 跳转详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
    })
  },
  // 显示分享组件 获取分享海报
  shareView() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/get-best-select-poster', 2, '',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '品牌精选',
      path: this.data.sharePath
    }
    // return {
    //   title: '品牌精选',
    //   path: '/pages/index/bestSelect/bestSelect'
    // }
  }
})