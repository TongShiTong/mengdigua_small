// pages/personShop/shareShop/shareShop.js.
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: false,
    list_start_page: 0,
    showAdd:false
  },
  cloosePhone() {
    this.setData({
      isBindPhone: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      scene = app.hrefObj(scene);
      this.setData({
        shop_id: scene.shop_id
      })
    }
    if (options.id){
      this.setData({
      shop_id: options.id
      })
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
    this.getBanner()
    this.getgoodsList()
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMoregoods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 获取banneer
  getBanner() {
    let self = this;
    http.HttpRequst(false, "/handShop/hand-shop-api/get-shop", 2, '', {
        token: app.globalData.token,
        shop_id: self.data.shop_id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            banner: res.data.data.banner,
            intro: res.data.data.introduction
          })
        }
      }
    )
  },
  // 商品推荐
  getgoodsList() {
    let self = this;
    common.getList(self, '/handShop/hand-shop-api/get-item', {
      token: app.globalData.token,
      start_page: self.data.list_start_page,
      pages: 10,
      shop_id: self.data.shop_id
    }, 'goodsList', function(res) {
 
    })
    setTimeout(()=>{
      self.setData({
        isShowModal: app.globalData.showModal,
        isBindPhone: app.globalData.isBindPhone,
        userInfo: app.globalData.userInfo,
      })
    },1000)
   
  },
  // 商品推荐更多
  loadMoregoods() {
    let self = this
    common.loadMoreChange(self, '/handShop/hand-shop-api/get-item', {
      token: app.globalData.token,
      start_page: self.data.list_start_page,
      pages: 10,
      shop_id: self.data.shop_id
    }, 'goodsList', 'list_start_page', function(res) {})
  },
})