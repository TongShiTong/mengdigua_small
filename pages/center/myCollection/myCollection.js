// pages/center/myCollection/myCollection.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageHeight: app.globalData.pageHeight,
    tab: [{
        title: '商品'
      },
      {
        title: '店铺'
      }
    ],
    tabIndex: 1,
    goodList: '',
    shopList: '',
    goodCheckAll: false,
    shopCheckAll: false,
    shopStartPage: 0,
    goodStartPage: 0,
    showGoodDelete: false,
    showShopDelete: false,
    selectLen: '',
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getgoodList(); //商品
    common.loadTheme(this)
    this.selectTab() //店铺
  },
  // 取消收藏店铺
  cancelCollectShop: function(e) {
    let self = this;
    let id =[]
    id.push(e.currentTarget.id);
    let index = e.currentTarget.dataset.index;
    let collectNum = 'shopData.sum_collection';
    http.HttpRequst(true, '/shop/shop-api/delete-collection', 2, '', {
        token: app.globalData.token,
         shop_id: id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 1000
          })
          var temArr = self.data.shopList.list
          temArr.splice(index,1)
          let listData = "shopList.list";
          self.setData({
            [listData]: temArr
          })
        }
      }
    )
  },
  // 获取商品收藏列表
  getgoodList: function() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-collection-api/index', 2, '', {
        token: app.globalData.token,
        start_page: self.data.goodStartPage,
        pages: 10
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          let list = res.data.data;
          for (let i = 0; i < list.list.length; i++) {
            list.list[i].isSelect = false;
          }
          self.setData({
            goodList: list
          })
        }
      }
    )
  },
  // 加载更多商品
  loadMoreGood: function() {
    let self = this;
    let pages = self.data.goodStartPage + 1;
    if (pages > Math.ceil(self.data.goodList.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        goodStartPage: pages
      })
      http.HttpRequst(true, '/item/me-item-collection-api/index', 2, '', {
          token: app.globalData.token,
          start_page: self.data.goodStartPage,
          pages: 10
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let listData = "goodList.list";
            let list = res.data.data.list;
            for (let i = 0; i < list.length; i++) {
              list[i].isSelect = false;
            }
            let newListData = self.data.goodList.list.concat(list);
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
    }
  },
  // 获取店铺收藏列表
  getShopList: function() {
    let self = this;
    http.HttpRequst(true, '/shop/shop-collection-api/index', 2, '', {
        token: app.globalData.token,
        start_page: 0,
        pages: 10
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            shopList: res.data.data
          })
        }
      }
    )
  },
  // 加载更多店铺
  loadMoreShop: function() {
    let self = this;
    let pages = self.data.shopStartPage + 1;
    if (pages > Math.ceil(self.data.shopList.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        shopStartPage: pages
      })
      http.HttpRequst(true, '/shop/shop-collection-api/index', 2, '', {
          token: app.globalData.token,
          start_page: self.data.shopStartPage,
          pages: 10
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let listData = "shopList.list";
            let list = res.data.data.list;
            let newListData = self.data.shopList.list.concat(list)
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
    }
  },
  // tab切换
  selectTab: function(e) {
    let self = this;
    if (e) {
      let id = e.currentTarget.dataset.index;
      self.setData({
        tabIndex: id
      })
    }
    // 店铺
    if (self.data.tabIndex == 1) {
      if (self.data.shopList == '') {
        self.setData({
          shopStartPage: 0
        })
        http.HttpRequst(true, '/shop/shop-collection-api/index', 2, '', {
            token: app.globalData.token,
            start_page: self.data.shopStartPage,
            pages: 10
          },
          'POST',
          false,
          function(res) {
            if (res.data.errcode == 0) {
              let list = res.data.data;
              for (let i = 0; i < list.list.length; i++) {
                list.list[i].isSelect = false;
              }
              self.setData({
                shopList: list
              })
            }
          }
        )
      }
    } else if (self.data.tabIndex == 0) { // 商品
      if (self.data.goodList == '') {
        self.setData({
          goodStartPage: 0
        })
        http.HttpRequst(true, '/shop/shop-collection-api/index', 2, '', {
            token: app.globalData.token,
            start_page: self.data.shopStartPage,
            pages: 10
          },
          'POST',
          false,
          function(res) {
            if (res.data.errcode == 0) {
              self.setData({
                shopList: res.data.data
              })
            }
          }
        )
      }
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
  // 跳转店铺
  jumpShop(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  // 商品编辑
  showGoodEdit() {
    this.setData({
      showGoodDelete: !this.data.showGoodDelete
    })
  },
  // 选择删除的商品
  selectGood: function(e) {
    let select = e.currentTarget.dataset.select;
    let index = e.currentTarget.dataset.index;
    let status = 'goodList.list[' + index + '].isSelect';
    this.setData({
      [status]: !select
    })
    let selectLen = 0;
    for (let i = 0; i < this.data.goodList.list.length; i++) {
      if (this.data.goodList.list[i].isSelect === true) {
        selectLen += 1;
      }
    }
    this.setData({
      selectLen: selectLen,
    })
    if (this.data.goodList.list.length == this.data.selectLen) {
      this.setData({
        goodCheckAll: true
      })
    } else {
      this.setData({
        goodCheckAll: false
      })
    }
  },
  // 全选商品
  selectGoodAdd() {
    this.setData({
      goodCheckAll: !this.data.goodCheckAll
    })
    if (this.data.goodCheckAll === true) {
      for (let i = 0; i < this.data.goodList.list.length; i++) {
        this.data.goodList.list[i].isSelect = true;
      }
    } else {
      for (let i = 0; i < this.data.goodList.list.length; i++) {
        this.data.goodList.list[i].isSelect = false;
      }
    }
    this.setData({
      goodList: this.data.goodList
    })
  },
  //  删除收藏商品
  deleteGood() {
    let self = this;
    let deleteArr = []
    for (let i = 0; i < self.data.goodList.list.length; i++) {
      if (self.data.goodList.list[i].isSelect === true) {
        deleteArr.push(self.data.goodList.list[i].item_id)
      }
    }
    http.HttpRequst(true, '/item/me-item-collection-api/del-collection', 2, '', {
        token: app.globalData.token,
        item_id: deleteArr
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'seccess',
            duration: 1000
          })
          setTimeout(() => {
            self.getgoodList();
          }, 1000)
        }
      }
    )
  },
  // 店铺编辑
  showShopEdit() {
    this.setData({
      showShopDelete: !this.data.showShopDelete
    })
  },
  // 选择删除的店铺
  selectShop: function(e) {
    let select = e.currentTarget.dataset.select;
    let index = e.currentTarget.dataset.index;
    let status = 'shopList.list[' + index + '].isSelect';
    this.setData({
      [status]: !select
    })
    let selectLen = 0;
    for (let i = 0; i < this.data.shopList.list.length; i++) {
      if (this.data.shopList.list[i].isSelect === true) {
        selectLen += 1;
      }
    }
    this.setData({
      selectLen: selectLen,
    })
    if (this.data.shopList.list.length == this.data.selectLen) {
      this.setData({
        shopCheckAll: true
      })
    } else {
      this.setData({
        shopCheckAll: false
      })
    }
  },
  // 全选店铺
  selectShopAdd() {
    this.setData({
      shopCheckAll: !this.data.shopCheckAll
    })
    if (this.data.shopCheckAll === true) {
      for (let i = 0; i < this.data.shopList.list.length; i++) {
        this.data.shopList.list[i].isSelect = true;
      }
    } else {
      for (let i = 0; i < this.data.shopList.list.length; i++) {
        this.data.shopList.list[i].isSelect = false;
      }
    }
    this.setData({
      shopList: this.data.shopList
    })
  },
  //  删除收藏商店铺
  deleteShop() {
    let self = this;
    let deleteArr = []
    for (let i = 0; i < self.data.shopList.list.length; i++) {
      if (self.data.shopList.list[i].isSelect === true) {
        deleteArr.push(self.data.shopList.list[i].id)
      }
    }
    http.HttpRequst(true, '/shop/shop-api/delete-collection', 2, '', {
        token: app.globalData.token,
        shop_id: deleteArr
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'seccess',
            duration: 1000
          })
          setTimeout(() => {
            self.getShopList();
          }, 1000)
        }
      }
    )
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

  }
})