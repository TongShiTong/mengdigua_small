// pages/class/serch/serch.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotLabel: [], //热门标签
    noHotLabel:[],
    hotpos: "",
    label: [],
    serchValue: '',
    sortName: '',
    sortType: '',
    listData: '',
    userInfo: '',
    // showShare: false,
    goodStartPage: 0,
    shopStartPage:0,
    shoplistData:{},
    showMask: false,
    shareImg: '',
    isShowModal: false,
    id: "",
    mcid: "",
    barHeight: app.globalData.totalHeight,
    _ratio: app.globalData._ratio,
    is_hot: "",
    is_new: "",
    sharePath: "", //分享链接
    addGoods: 0, //
    is_hand_shop: 0, // 判断是否是店铺商品的字段，强制为1
    postUrl: "/item/me-item-api/index",
    isShowTab:false,
    shopId:false,
    is_bonus:'',
    showListType:2,
    isMainSearch:false,
    gonescroll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    common.handleShareUrl(this, "pages/class/serch/serch")
    if (options.isShowTab){
      this.setData({
        isShowTab:options.isShowTab,
        shopId:options.shop_id
      })
    }
    if (options.add == 1) {
      this.setData({
        addGoods: 1,
        is_hand_shop: 1,
        postUrl: "/handShop/hand-shop-api/get-item-list"
      })
      this.serch()
    }
    if(options.isMainSearch){
      this.setData({
        isMainSearch: options.isMainSearch
      })
    }
    this.hotSign(); //热门标签
    let self = this;
    self.setData({
      userInfo: app.globalData.userInfo
    })
    try {
      wx.getStorage({
        key: 'label',
        success(res) {
          self.setData({
            label: self.uniq(res.data)
          })
        }
      })
    } catch (e) {

    }

    if (options.mcid) {
      this.setData({
        mcid: options.mcid
      })
      // 店铺详情过来搜索
    }
    if (options.id) {
      this.setData({
        id: options.id,

      })
      if (options.goodsType == 1) {
        this.setData({
          is_hot: 1
        })
      } else if (options.goodsType == 2) {
        this.setData({
          is_new: 1
        })
      }
      this.serchGood();
    }
    if (options.shop_id) {
      this.setData({
        shop_id: options.shop_id
      })
      this.serchGood();
    }else{
      this.setData({
        shop_id:app.globalData.shopId
      })
      // this.serchGood();

    }
    if (options.name) {
      wx.setNavigationBarTitle({
        title: options.name
      })
    }
    if (options.is_bonus){
      let restData = {
        is_bonus:options.is_bonus
      }
      this.setData({
        restData
      })
    }
    if(options.showListType){
      this.setData({
        showListType:options.showListType
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '搜索',
      path: this.data.sharePath
    }
  },
  // 去重
  uniq(arr) {
    var result = [];
    var len = '';
    len = arr.length;
    arr.forEach(function(v, i, arr) { //这里利用map，filter方法也可以实现
      var bool = arr.indexOf(v, i + 1); //从传入参数的下一个索引值开始寻找是否存在重复
      if (bool === -1) {
        result.push(v);
      }
    })
    return result;
  },
  // 获取搜索内容
  changeValue: function(e) {
    this.setData({
      serchValue: e.detail
    })
  },
  // 点击标签搜索
  selectLabel: function(e) {
    // console.log(e)
    if(typeof e.detail === "string" && e.detail!='') {
      this.setData({
        serchValue: e.detail,
      })
    }else {
      this.setData({
        serchValue: e.currentTarget.dataset.value,
      })
    }
    this.serch()
  },
  
  // 长按删除历史
  onCopy(e) {
    let id = e.currentTarget.dataset.id
    this.data.label.splice(id,1)
    this.setData({
      label: this.data.label
    })
    wx.setStorageSync('label', this.data.label)
  },
  handleTap(e) {
    this.setData({
      evt: e
    })
  },
  // 搜索商品
  serchGood() {
    let self = this;
    self.setData({
      goodStartPage: 0
    })
    
    http.HttpRequst(true, self.data.postUrl, 2, '', {
        token: app.globalData.token,
        start_page: self.data.goodStartPage,
        pages: 20,
        key_word: self.data.serchValue,
        sort_name: self.data.sortName,
        sort_type: self.data.sortType,
        shop_id: self.data.id || self.data.shop_id,
        mcid: self.data.mcid,
        is_hot: self.data.is_hot,
        is_new: self.data.is_new,
        is_hand_shop: self.data.is_hand_shop,
        ...this.data.restData
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data,
          })
          setTimeout(()=>{
            self.setData({
              isShopList: false,
              topNum: 0
            })
          },200)
          // 本地缓存搜索历史
          let label = self.data.label;
          if (self.data.serchValue != '') {
            label.unshift(self.data.serchValue)
          }
          try {
            wx.setStorageSync('label', label)
          } catch (e) {}
        }
      }
    )
    // this.getShop();
  },
  // 热门搜索标签
  hotSign() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/hot-label-list', 2, '', {},
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          let hot = []
          let noHot = []
          let hotpos = ''
          for(let i=0; i<res.data.data.length;i++) {
            if(res.data.data[i].position==0) {
              hotpos = res.data.data[i].name
            }else if( Number(res.data.data[i].position) <= 10 && Number(res.data.data[i].position) > 0) {
              hot.push(res.data.data[i])
            }else if( Number(res.data.data[i].position) > 10){
              noHot.push(res.data.data[i])
            }
          }
          self.setData({
            hotLabel: hot,
            noHotLabel: noHot,
            hotpos: hotpos
          })
          console.log(self.data.hotpos)
        }
      }
    )
  },
  // 清楚搜索历史
  clearLabel() {
    this.setData({
      showMask: true
    })
  },
  //  关闭弹窗
  closeModal() {
    this.setData({
      showMask: false
    })
  },
  // 清空历史记录
  confirmDeleta() {
    let self = this;
    wx.removeStorage({
      key: 'label',
      success(res) {
        self.setData({
          label: [],
          showMask: false
        })
      }
    })
  },
  // 搜索
  serch: function() {
    this.serchGood();
  },
  // 加载更多商品
  loadMore: function(e) {
    let self = this;
    if(this.data.gonescroll){
      return
    }
    this.setData({
      gonescroll: true
    })
    if(e && e.detail===1){
      let pages = self.data.shopStartPage + 1;
      if (pages > Math.ceil(self.data.shoplistData.total_pages / 20) - 1) {
        self.setData({
          gonescroll: false
        })
        return false
      } else {
        self.setData({
          shopStartPage: pages
        })
        let url = `/shop/shop-api/index`
        http.HttpRequst(false, url, 2, '', {
          token: app.globalData.token,
          start_page: self.data.shopStartPage,
          pages:20,
          key_word: this.data.serchValue
        },
          'POST',
          false,
          (res)=> {
            self.setData({
              gonescroll: false
            })
            if (res.data.errcode == 0) {
              let newListData = self.data.shopList.concat(res.data.data.list);
              self.setData({
                shopList: newListData
              })
            }
          }
        )
      }
      
    }else{
      let pages = self.data.goodStartPage + 1;
      if (pages > Math.ceil(self.data.listData.total_pages / 20) - 1) {
        self.setData({
          gonescroll: false
        })
        return false
      } else {
        self.setData({
          goodStartPage: pages
        })
        http.HttpRequst(true, self.data.postUrl, 2, '', {
            token: app.globalData.token,
            start_page: self.data.goodStartPage,
            pages: 20,
            key_word: self.data.serchValue,
            sort_name: self.data.sortName,
            sort_type: self.data.sortType,
            is_hand_shop: self.data.is_hand_shop
          },
          'POST',
          false,
          function(res) {
            self.setData({
              gonescroll: false
            })
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
    }
  },

  // 跳转商品详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
    })
  },
  // 选择排序
  selectSort(e) {
    let sortName = '';
    let sortType = '';
    if (e.detail.index == 0) {
      sortName = 'popularity';
    } else if (e.detail.index == 1) {
      // sortName = 'commission';
      sortName = 'deal_num';
    } else if (e.detail.index == 2) {
      // sortName = 'deal_num';
      sortName = 'price';

    } else if (e.detail.index == 3) {
      sortName = 'price';
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
    this.serchGood();
  },
  // 推广
  shareGood(e) {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/merger-img', 2, '', {
        token: app.globalData.token,
        item_id: e.detail
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            shareImg: res.data.data,
            // showShare: true,
          })
        }
      }
    )
  },
  // 分享调用点接口
  shareSuccess() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/share-item', 2, '', {
        token: app.globalData.token,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {

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

  },
  changelist(e) {
    let type = e.detail.type
    let index = e.detail.index
    let tem = 'listData.list[' + index + '].is_hand_shop'
    let status = 0
    if (type == 1) {
      status = 0
      wx.showToast({
        title: "刪除成功",
        icon: 'none',
        duration: 2000
      })
    } else {
      status = 1
      wx.showToast({
        title: "添加成功",
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      [tem]: status
    })
  },
  getShop(e){
    if(e && e.detail===1) {
      this.setData({
        shopStartPage: 0
      })
    }
    let url = `/shop/shop-api/index`
    http.HttpRequst(false, url, 2, '', {
      token: app.globalData.token,
      start_page:0,
      pages:20,
      key_word: this.data.serchValue
    },
      'POST',
      false,
      (res)=> {
        if (res.data.errcode == 0) {
          this.setData({
            shoplistData: res.data.data,
            shopList:res.data.data.list
          })
        }
      }
    )
  }
})