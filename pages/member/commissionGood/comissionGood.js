// pages/member/commissionGood/comissionGood.js
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
    sortName: '',
    mcid: '',
    isHot: 0,
    isNew: 0,
    goodStartPage: 0,
    sortType: '',
    userInfo: '',
    shareImg: '',
    // showShare: false,
    isShowModal: false,
    add: 0,
    posterUrl: "/item/me-item-api/index",
    title: "",//商品详情
    coupon_id: "",//
    poster:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.add == 1) {
      this.setData({
        add: 1,
        posterUrl: "/handShop/hand-shop-api/get-item-list"
      })
    }
    common.loadTheme(this)
    let self = this;
    self.setData({
      userInfo: app.globalData.userInfo
    })

    if (self.data.add == 0) {
      if (options.mcid) {
        // 获取商品列表
        self.setData({
          title: options.name
        })

        http.HttpRequst(true, self.data.posterUrl, 2, '',
          {
            token: app.globalData.token,
            start_page: 0,
            mcid: options.mcid,
            pages: 10
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              self.setData({
                listData: res.data.data,
                mcid: options.mcid,
                isShowModal: app.globalData.showModal
              })
            }
          }
        )
      } else if (options.couId) {
        self.setData({
          coupon_id: options.couId,
          title: options.name
        })
        self.serchGood()
      } else if (options.isHot == 1) {
        self.setData({
          title: "热门商品"
        })
        http.HttpRequst(true, '/item/me-item-api/index', 2, '',
          {
            token: app.globalData.token,
            start_page: 0,
            is_hot: 1,
            pages: 10
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              self.setData({
                listData: res.data.data,
                isHot: 1
              })
            }
          }
        )
      } else if (options.isNew == 1) {
        self.setData({
          title: "新品推荐"
        })
        http.HttpRequst(true, '/item/me-item-api/index', 2, '',
          {
            token: app.globalData.token,
            start_page: 0,
            is_new: 1,
            pages: 10
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              self.setData({
                listData: res.data.data,
                isNew: 1
              })
            }
          }
        )
      } else {
        http.HttpRequst(true, '/item/me-item-api/index', 2, '',
          {
            token: app.globalData.token,
            start_page: 0,
            pages: 10,
            is_bonus:1
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              self.setData({
                listData: res.data.data,
              })
            }
          }
        )
      }
    } else {
      http.HttpRequst(true, self.data.posterUrl, 2, '',
        {
          token: app.globalData.token,
          start_page: 0,
          mcid: options.mcid,
          pages: 10,
          is_hand_shop: 1,
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              listData: res.data.data,
              mcid: options.mcid,
              isShowModal: app.globalData.showModal
            })
          }
        }
      )
    }
    this.getBanner();
  },
  tapFloor(e) {
    console.log(e)
    let showtype = e.currentTarget.dataset.showtype;
    let param = e.currentTarget.dataset.param;
    let title = e.currentTarget.dataset.title;
    let content = e.currentTarget.dataset.content;
    // let {showtype , param , title , content} = e.currentTarget.dataset
    /*
    1.无效果
    2.web链接
    3.富文本 
    4.app   ×
    5.指定商品
    6.指定店铺
    */
    console.log(showtype)

    switch(+showtype){
      case 1:
        break;
      case 2:
        //web
        app.globalData.showUrl = param;
        wx.navigateTo({
          url: `/pages/webView/webView`,
        })
        break;
      case 3:
        if(title && title!=''){
          wx.navigateTo({
            url: `/pages/rich/rich?title=${title}`,
          });
        }else{
          wx.navigateTo({
            url: `/pages/rich/rich`,
          })
        }
        
        app.globalData.rich = content;
        break;
      case 4:
        //app
        break;
      case 5:
        wx.navigateTo({
          url: `/pages/goodDetail/goodDetail?id=${param}`,
        });
        break;
      case 6:
        wx.navigateTo({
          url: `/pages/shop/shopDetail/shopDetail?id=${param}`,
        });
        break;

    }
    // if (showType == 1) {
    //   if (param == "") {
    //     return
    //   }
    //   wx.navigateTo({
    //     url: '/pages/goodDetail/goodDetail?id=' + param
    //   })
    // } else if (showType == 2) {
    //   if (param == "") {
    //     return
    //   }
    //   wx.navigateTo({
    //     url: '/pages/class/classDetail/classDetail?mcid=' + param + '&name=商品'
    //   })
    // } else if (showType == 3) {
    //   // wx.navigateTo({
    //   //   url: '/pages/shop/shopDetail/shopDetail?id=' + param
    //   // })
    // } else if (showType == 4) {
    //   wx.navigateTo({
    //     url: '/pages/class/classDetail/classDetail?name=热门商品&isHot=1'
    //   })
    // } else if (showType == 5) {
    //   wx.navigateTo({
    //     url: '/pages/class/classDetail/classDetail?name=新品推荐&isNew=1'
    //   })
    // } else if (showType == 6) {
    //   // wx.reLaunch({
    //   //   url: '/pages/shop/shop?recommend=1'
    //   // })
    // } else if (showType == 7) {
    //   if (param == "") {
    //     return
    //   }
    //   app.globalData.rich = param;
    //   wx.navigateTo({
    //     url: '/pages/rich/rich?'
    //   })
    // } else if (showType == 8) {

    // } else if (showType == 9) {
    //   if (param == "") {
    //     return
    //   }
    //   wx.navigateTo({
    //     url: '/pages/index/floor/floor?code=' + param
    //   })
    // } else if (showType == 10) {
    //   wx.navigateTo({
    //     url: '/pages/index/newPeople/newPeople',
    //   })
    // } else if (showType == 11) {
    //   wx.navigateTo({
    //     url: '/pages/index/bestSelect/bestSelect',
    //   })
    // } else if (showType == 12) {
    //   wx.navigateTo({
    //     url: '/pages/index/vip/vip',
    //   })
    // } else if (showType == 13) {
    //   wx.navigateTo({
    //     url: '/pages/index/signIn/signIn',
    //   })
    // } else if (showType == 14) {
    //   wx.navigateTo({
    //     url: '/pages/member/promote/promote',
    //   })
    // } else if (showType == 15) {
    //   if (param == "") {
    //     return
    //   }
    //   wx.navigateTo({
    //     url: '/pages/member/giftDetail/giftDetail?id=' + param
    //   })
    // } else if (showType == 16) {
    //   wx.navigateTo({
    //     url: '/pages/member/commissionGood/comissionGood',
    //   })
    // }
  },
  jumpToSearch(){
    wx.navigateTo({
      url: `/pages/class/serch/serch?is_bonus=1&showListType=1`,
    })
  },
  getBanner(){
    http.HttpRequst(true, '/banner/banner-api/index', 2, '',
      {
        seat_id:1        
      },
      'POST',
      false,
      (res) =>{
        if (res.data.errcode == 0) {
          this.setData({
            banner:res.data.data
          })
        }
      }
    )
  },
  // 选择排序
  selectSort(e) {
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
    this.serchGood();
  },
  // 搜索商品
  serchGood() {
    let self = this;
    self.setData({
      goodStartPage: 0
    })
    http.HttpRequst(true, self.data.posterUrl, 2, '',
      {
        token: app.globalData.token,
        mcid: self.data.mcid,
        start_page: self.data.goodStartPage,
        pages: 10,
        is_hot: self.data.isHot,
        is_new: self.data.isNew,
        key_word: self.data.serchValue,
        sort_name: self.data.sortName,
        sort_type: self.data.sortType,
        // is_hand_shop: 1,
        coupon_id: self.data.coupon_id,
        is_bonus: 1

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
  // 加载更多商品
  loadMore: function () {
    let self = this;
    let pages = self.data.goodStartPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      // console.log('加载完了')
      return false
    } else {
      self.setData({
        goodStartPage: pages
      })
      http.HttpRequst(true, self.data.posterUrl, 2, '',
        {
          token: app.globalData.token,
          start_page: self.data.goodStartPage,
          pages: 10,
          mcid: self.data.mcid,
          sort_name: self.data.sortName,
          sort_type: self.data.sortType,
          is_hand_shop: 1,
          is_hot: self.data.isHot,
          isNew: self.data.isNew,
          coupon_id: self.data.coupon_id
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
  // 推广
  shareGood(e) {
    let self = this;
    http.HttpRequst(true, self.data.posterUrl, 2, '',
      {
        token: app.globalData.token,
        item_id: e.detail
      },
      'POST',
      false,
      function (res) {
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
    http.HttpRequst(false, self.data.posterUrl, 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {

        }
      }
    )
  },
  // 跳转搜索
  jumpSerch() {
    wx.navigateTo({
      url: '/pages/class/serch/serch',
    })
  },
  // 跳转分类
  jumpClass() {
    wx.navigateTo({
      url: '/pages/class/class',
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
  }

})