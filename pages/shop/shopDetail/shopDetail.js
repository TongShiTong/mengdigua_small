// pages/shop/shopDetail/shopDetail.js
const _systemInfo = wx.getSystemInfoSync();
const _barHeight = _systemInfo.statusBarHeight;
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotData: false, //热门商品接口
    barHeight: _barHeight,
    marginTopValue: _barHeight + 174,
    couponListData: false,
    tab: [{
        title: '店铺首页'
      },
      {
        title: '店铺商品'
      }
    ],
    tabIndex: 0,
    isCollect: '',
    floorData: '',
    goodList: '',
    goodStartPage: 0,
    shopId: '',
    shopData: '',
    indicatorDots: true,
    isShowModal: false,
    isBindPhone: '',
    clickButton: false,
    backIcon: false,
    couponStartPage: 0, //店铺优惠券
    bottomIndex:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      scene = common.hrefObj(scene);
      this.setData({
        shopId:scene.id
      })
      this.getShopDetail()

      console.log(scene.id)
    }else{
      if (options.id) {
        this.setData({
          shopId: options.id
        })
        this.getShopDetail()
        //将商铺ID存入全局变量 之后商铺内底栏Tabbar需要用到
        app.globalData.shopId = options.id
      } else {
        this.setData({
          shopId: app.globalData.shopId
        })
        this.getShopDetail()
      }
    }
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    
    this.getPv()
    this.getCouponeList(); //店铺优惠券
    this.getItemList();
  },
  // 获取店铺信息
  getShopDetail: function() {
    let self = this;
    http.HttpRequst(true, '/shop/shop-api/view', 2, '', {
        token: app.globalData.token,
        shop_id: self.data.shopId
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            shopData: res.data.data,
            isCollect: res.data.data.is_collection
          })
          // self.getShopFloor()
        }
      }
    )
  },
 
  // 店铺楼层
  getShopFloor() {
    let self = this;
    http.HttpRequst(false, '/floor/floor-api/get-floor-info', 2, '', {
        token: app.globalData.token,
        use_position: 1,
        shop_id: self.data.shopId
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            userInfo: app.globalData.userInfo,
            floorData: res.data.data
          })
          if (self.data.floorData.content.list) {

            self.data.floorData.content.list.forEach((x) => {
              //获取热们商品数量
              if (x.type == 6) {
                self.setData({
                  hotSize: x.nums
                })
                if (x.nums != 0) {
                  self.getHotGood();
                }
              }
              // 获取新品推荐
              if (x.type == 7) {
                self.setData({
                  newSize: x.nums
                })
                if (x.nums != 0) {
                  self.getNewGood();
                }
              }
            })
          }

        }
      }
    )
  },
  cloosePhone() {
    this.setData({
      isBindPhone: false
    })
  },
  // 全部商品
  getAllGood() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/index', 2, '', {
        start_page: self.data.goodStartPage,
        pages: 10,
        shop_id: self.data.shopId
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            goodList: res.data.data
          })
        }
      }
    )
  },
  // tab切换
  selectTab: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    })
    // 全部商品
    if (this.data.tabIndex == 1) {
      if (this.data.goodList == '') {
        this.getAllGood();
      }
    } else if (this.data.tabIndex == 0) { // 店铺首页
      if (this.data.floorData == '') {
        this.getShopFloor()
      }
    }
  },
  selectTabBottom(e){
    let index = e.detail;
    switch(+index){
      case 0:
        this.setData({
          bottomIndex: 0
        })
        break;
      case 1:
        this.getItemList();
        this.setData({
          bottomIndex:1
        })
        break;
      case 2:
        this.getShopClass();
        this.setData({
          bottomIndex: 2
        })
        break;
      case 3:
        break;
    }
  },
  // 加载更多商品
  loadMoreGood() {
    let self = this;
    let pages = self.data.goodStartPage + 1;
    console.log(5555,self.data.listData)
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        goodStartPage: pages
      })
      http.HttpRequst(true, '/item/me-item-api/index', 2, '', {
          start_page: self.data.goodStartPage,
          pages: 10,
          shop_id: self.data.shopId
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            // let listData = "goodList.list";
            let list = res.data.data.list;
            let newListData = self.data.listData.list.concat(list);
            res.data.data.list = newListData
            self.setData({
              listData: res.data.data
            })
          }
        }
      )
    }
  },
  // pv
  getPv() {
    let self = this;
    http.HttpRequst(false, '/shop/shop-api/add-shop-click', 2, '', {
        shop_id: self.data.shopId
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {

        }
      }
    )
  },
  // 跳转商品分类
  jumpGoodClass: function() {
    wx.navigateTo({
      url: '/pages/shop/goodClass/goodClass?id=' + this.data.shopId
    })
  },
  // 收藏店铺
  collectShop: function() {
    let self = this;
    let collectNum = 'shopData.sum_collection';
    self.setData({
      isBindPhone: app.globalData.isBindPhone,
      clickButton: true
    })
    if (self.data.isBindPhone === false) {
      http.HttpRequst(true, '/shop/shop-api/shop-collection', 2, '', {
        token: app.globalData.token,
        shop_id: self.data.shopId
      },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              isCollect: 1,
              [collectNum]: Number(self.data.shopData.sum_collection) + 1
            })
            wx.showToast({
              title: '关注成功',
              icon: 'none',
              duration: 1000
            })
          }
        }
      )
    }
  
   
  },
  // 取消收藏店铺
  cancelCollectShop: function() {
    let self = this;
    let collectNum = 'shopData.sum_collection';
    self.setData({
      isBindPhone: app.globalData.isBindPhone
    })
    wx.showModal({
      title: '取消收藏',
      content: '确认取消收藏吗',
      success(res) {
        if (res.confirm) {
          if (self.data.isBindPhone === false) {
            http.HttpRequst(true, '/shop/shop-api/delete-collection', 2, '', {
              token: app.globalData.token,
              shop_id: [self.data.shopId]
            },
              'POST',
              false,
              function (res) {
                if (res.data.errcode == 0) {
                  self.setData({
                    isCollect: 0,
                    [collectNum]: Number(self.data.shopData.sum_collection) - 1
                  })
                  wx.showToast({
                    title: '取消成功',
                    icon: 'none',
                    duration: 1000
                  })
                }
              }
            )
          }
        } else if (res.cancel) {
        }
      }
    })
   
  },
  // 跳转详情
  jumpDetail(e) {
    let id = e.detail;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
    })
  },
  // 跳转详情
  jumpDetailTwo(e) {
    let id = e.currentTarget.dataset.id;
    let shop_id = e.currentTarget.dataset.shop_id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id + '&shop_id' + shop_id
    })
  },
  // 跳转搜索 
  jumpSerch: function() {
    wx.redirectTo({
      // url: '/pages/class/serch/serch?id=' + this.data.shopId
      url: `/pages/class/serch/serch?shop_id=${this.data.shopId}&isShowTab=true&isMainSearch=1`
    })
  },
  // 判断是否绑定手机号
  getPhone: function() {
    let self = this
    if (self.data.clickButton == true) {
      self.setData({
        isBindPhone: app.globalData.isBindPhone
      })
    }
  },
  // 点击楼层
  tapFloor: function(e) {
    let showType = e.currentTarget.dataset.type;
    let param = e.currentTarget.dataset.param;
    // 商品：1，-- 分类对应列表：2，-- 店铺：3，-- 热门商品列表：4，-- 新品推荐列表：5，-- 推荐店铺列表：6，-- 富文本：7，-- 外链：8，
    if (showType == 1) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + param
      })
    } else if (showType == 2) {
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?mcid=' + param
      })
    } else if (showType == 3) {
      wx.navigateTo({
        url: '/pages/shop/shopDetail/shopDetail?id=' + param
      })
    } else if (showType == 4) {
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?name=热门商品&isHot=1'
      })
    } else if (showType == 5) {
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?name=新品推荐&isNew=1'
      })
    } else if (showType == 6) {
      wx.reLaunch({
        url: '/pages/shop/shop?recommend=1'
      })
    } else if (showType == 7) {
      app.globalData.rich = param;
      wx.navigateTo({
        url: '/pages/rich/rich'
      })
    } else if (showType == 8) {

    } else if(x.type == 10) {
      self.setData({
        cuscomSize: x.goods_list
      })
      if (x.goods_list != '') {
        self.getCuscom(index);
      }
    } 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const currentPage = getCurrentPages()
    if (currentPage.length > 1) {
      this.setData({
        backIcon: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getPhone();
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
    //离开店铺 清空店铺ID 防止后续首页搜索时 参数污染
    app.globalData.shopId = ''
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
    console.log(22222)
    if (this.data.tabIndex == 1) {
      this.loadMoreGood()
    }
  },
  routeBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 获取店铺优惠券
  getCouponeList() {
    let self = this;
    http.HttpRequst(false, '/coupon/coupon-templet-api/item-index', 2, '', {
        token: app.globalData.token,
        shop_id: self.data.shopId,
        scenario: "shop",
        start_page: self.data.couponStartPage,
        pages: 9999,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            couponListData: res.data.data,
          })
        }
      }
    )
  },
  //加载更多优惠券
  loadMoreCoupon() {
    let self = this;
    let pages = self.data.couponStartPage + 1;
    if (pages > Math.ceil(self.data.couponListData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        couponStartPage: pages
      })
      http.HttpRequst(true, '/coupon/coupon-templet-api/item-index', 2, '', {
          token: app.globalData.token,
          shop_id: self.data.shopId,
          scenario: "shop",
          start_page: self.data.couponStartPage,
          pages: 10,
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let listData = "couponListData.list";
            let list = res.data.data.list;
            let newList = self.data.couponListData.list.concat(res.data.data.list)
            self.setData({
              [listData]: newList
            })
          }
        }
      )
    }
  },
  // 获取热门商品
  getHotGood() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/index', 2, '', {
        start_page: 0,
        token: app.globalData.token,
        pages: self.data.hotSize,
        is_hot: 1,
        shop_id: self.data.shopId,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            hotData: res.data.data
          })
        }
      }
    )
  },
  // 获取新品商品
  getNewGood() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/index', 2, '', {
        start_page: 0,
        token: app.globalData.token,
        pages: self.data.newSize,
        is_new: 1,
        shop_id: self.data.shopId,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            newData: res.data.data
          })
        }
      }
    )
  },
  getCuscom(index) {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/index', 2, '', {
      item_ids: self.data.cuscomSize,
      start_page: 0,
      token: app.globalData.token,
    },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let name = 'cuscomData[' + index + '].list'
          self.setData({
            [name]: res.data.data.list
          })
        }
      }
    )
  },
  // 分类 相关
  // 获取店铺二级分类
  getShopClass() {
    let self = this;
    http.HttpRequst(true, '/item/me-category-api/get-category-list', 2, '',
      {
        token: app.globalData.token,
        shop_id: self.data.shopId
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            classData: res.data.data,
          })
        }
      }
    )
  },
  // 跳转全部商品
  jumpAllGood() {
    wx.navigateTo({
      url: '/pages/class/serch/serch?id=' + this.data.shopId + '&name=全部'
    })
  },
  // 跳转商品分类
  jumpGoodClass(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/class/serch/serch?mcid=' + id + '&name=' + name + '&id=' + this.data.shopId
    })
  },
  getItemList(){
    let self = this
    let restData = {
      sort_name:this.data.sortName,
      sort_type:this.data.sortType
    }
    http.HttpRequst(true, '/item/me-item-api/index', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        shop_id:this.data.shopId,
        ...restData
      },
      'POST',
      false,
       (res) => {
        // console.log(888888,res)
        if (res.data.errcode == 0) {
          this.setData({
            listData: res.data.data,
          })
          setTimeout(()=>{
            self.setData({
              goodStartPage: 0,
              topNum: 0
            })
          },200)
        }
      }
    )
  },
  selectSort(e) {
    console.log(99999,e)
    let sortName = '';
    let sortType = '';
    
    if (e.detail.index === 0) {
      sortName = 'popularity';
    } else if (e.detail.index == 1) {
      // sortName = 'commission';
      sortName = 'deal_num';
    } else if (e.detail.index == 2) {
      // sortName = 'deal_num';
      sortName = 'price';
    } else if (e.detail.index == 3) {
      // sortName = 'price';
    }

    if (e.detail.status == 2) {
      sortType = 'SORT_DESC'
    } else if (e.detail.status == 1) {
      sortType = 'SORT_ASC'
    }
    this.setData({
      sortName: sortName,
      sortType: sortType
    })
    this.getItemList();
  },
})