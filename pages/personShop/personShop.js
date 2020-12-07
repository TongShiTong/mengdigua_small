// pages/personShop/personShop.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:[{},{}],//
    shopRemark:"",
    get_focus: false,
    showInfo:1,
    start_page:0,//美照片起始页
    list_start_page:0,//商品推荐起始页
    picList:false,//美照 列表
    goodsList:false,//美照 列表
    share_img:false,
    isShowModalTwo:false,
    step:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      barHeight: app.globalData.totalHeight,
      _ratio: app.globalData._ratio,
    })
    this.getPicList();
    this.getPoster();
    this.getStorage()
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
    this.setData({
      list_start_page:0,
      goodsList:false,
    })
    this.getgoodsList();
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
    this.changeIntro()
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
    this.loadMoregoods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '店铺分享',
      path: this.data.sharePath
    }
  },
  open(){
    let self = this;
    this.setData({
      isShowModalTwo:true
    })
  },
  focusInput(){
    this.setData({
      get_focus:true,
    })
  },
  changeAttr: function (e) {
    let attr = e.currentTarget.dataset.attr
    let value = e.detail.value
    this.setData({
      [attr]: value
    })
  },
  goDetail(e) {
    app.pushRoute(e)
  },
  // 美照
  getPicList() {
    let self = this;
    common.getList(self, '/handShop/hand-shop-api/get-shop', {
      token: app.globalData.token,
      // start_page: self.data.start_page,
      // pages: 10,
    }, 'picList',function(res){
      let path = `/pages/personShop/shareShop/shareShop?id=${res.id}`
      common.handleShareUrl(self, path)
      self.setData({
        shopRemark: res.introduction
      })
      setTimeout(()=>{
        self.setData({
          userInfo: app.globalData.userInfo
        })
      },1000)
    })
  },
  // 美照更多
  loadMorePic() {
    let self = this
    if (self.data.type == 1) {
      common.loadMore(self, '/handShop/hand-shop-api/get-shop', {
        token: app.globalData.token,
        start_page: self.data.start_page,
        pages: 10,
      }, 'picList', self.data.start_page, function (res) {
      })
    }
  },

  // 商品推荐
  getgoodsList() {
    let self = this;
    common.getList(self, '/handShop/hand-shop-api/get-item', {
      token: app.globalData.token,
      start_page: self.data.list_start_page,
      pages: 10,
    }, 'goodsList', function (res) {
      app.globalData.personShopList = self.data.goodsList.total_pages
    })
  },
  // 商品推荐更多
  loadMoregoods() {
    let self = this
    common.loadMoreChange(self, '/handShop/hand-shop-api/get-item', {
        token: app.globalData.token,
        start_page: self.data.list_start_page,
        pages: 10,
      }, 'goodsList', 'list_start_page', function (res) {
      })
  },
  // 修改店铺详情
  changeIntro(){
    let self = this;
    http.HttpRequst(true, '/handShop/hand-shop-api/update', 2, '',
      {
        token: app.globalData.token,
        introduction: self.data.shopRemark,
        if_introduction: 1
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          
        }
      }
    ) 
  },
  getPoster() {
    let self = this;
    common.getPoster(self, '/handShop/hand-shop-api/get-share-poster', {
      token: app.globalData.token
    })
  },
  nextStep(){
    if (this.data.showInfo==1){
      this.setData({
        showInfo:2
      })
    } else if (this.data.showInfo == 2) {
      this.setData({
        showInfo: 3
      })
    }else{
      this.setData({
        showInfo: false
      })
      this.setStorage()
    }
  },
  getStorage(){
    let self = this;
    wx.getStorage({
      key: 'step',
      success(res) {
        self.setData({
          step:true
        })
      },
      fail(res){
      }
    })
  },
  setStorage(){
    let self = this;
    wx.setStorage({
      key: 'step',
      data: '1'
    })
  }


})