// pages/center/moeCollect/moeCollect.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[
      {
        name:'商品收藏',
        tabIndex:0
      },
      {
        name:'店铺收藏',
        tabIndex:1
      }
    ],
    curIndex:0,
    itemList:{},
    itemShops: {},
    start_page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.id == 2) {
      this.setData({
        curIndex: 1
      })
    }
    common.loadTheme(this);
    this.setData({
      is_show_shop: app.globalData.is_show_shop
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
     this.getList();
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
    if(this.data.curIndex == 0){
      this.getMoreGood();
    }else{
      this.getMoreShop();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 跳转商品详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    let shop_id = e.currentTarget.dataset.shop_id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id + '&shop_id=' + shop_id
    })
  },
  //跳转店铺详情
  jumpToShop(e){
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/shop/shopDetail/shopDetail?id=${id}`,
    })
  },
  selectTab(e){
    let { index } = e.currentTarget.dataset;
    this.setData({
      curIndex:index
    })
    this.getList();
  },
  getList(){
    this.setData({
      startPage:0,
    })
    let index = this.data.curIndex;
    switch(+index){
      case 0:
        this.getGoods();
        break;
      case 1:
        this.getShop();
        break;
    }
  },
  getGoods(){
    let self = this;
    this.setData({
      start_page: 0
    })
    http.HttpRequst(false, '/item/me-item-collection-api/index', 2, '', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            itemList: res.data.data
          })
        }
      }
    )
  },
  getShop(){
    let self = this;
    this.setData({
      start_page:0
    })
    http.HttpRequst(false, '/shop/shop-collection-api/index', 2, '', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    },
      'POST',
      false,
      (res) => {
        if (res.data.errcode == 0) {
          this.setData({
            itemShops: res.data.data
          })
        }
      }
    )
  },
  getMoreGood(){
    let self = this;
    common.loadMore(self, '/item/me-item-collection-api/index', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    }, 'itemList')
  },
  getMoreShop() {
    let self = this;
    common.loadMore(self, '/shop/shop-collection-api/index', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    }, 'itemShops')
  },
  removeGood(e){
    let { id } = e.currentTarget.dataset;
    let ids = [];
    ids.push(id)
    http.HttpRequst(false, '/item/me-item-collection-api/del-collection', 2, '', {
      token: app.globalData.token,
      item_id: ids
    },
      'POST',
      false,
      (res)=> {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '取消收藏成功！',
          })
          this.getList();
        }
      }
    )
  },
  cancelCollect(e){
    let {id}  = e.currentTarget.dataset;
    let ids = [];
    ids.push(id)
    http.HttpRequst(false, '/shop/shop-api/delete-collection', 2, '', {
      token: app.globalData.token,
      shop_id:ids
    },
      'POST',
      false,
       (res)=> {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '取消收藏成功！',
          })
          this.getList();
        }
      }
    )
  },
})