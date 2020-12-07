// components/floorTotal/floorTotal.js
const app = getApp();
const http = require("../../utils/http.js");
const common = require("../../utils/common.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    floorCode: {
      //楼层code
      type: null,
      observer: function (newVal, oldVal, changedPath) {
        this.getFloor(this.data.floorCode);
        this.hotSign()
      },
    },
    groundTimes: {
      //拼团场藏地
      type: null,
      observer: function (newVal, oldVal, changedPath) {},
    },
    show: {
      //显示隐藏
      type: null,
      observer: function (newVal, oldVal, changedPath) {},
    },
    groupList: {
      //显示隐藏
      type: null,
      observer: function (newVal, oldVal, changedPath) {},
    },
    marginTop: {
      //显示隐藏
      type: null,
      observer: function (newVal, oldVal, changedPath) {},
    },
    showIndex: {
      //展示和隐藏 猜你喜欢
      type: null,
      observer: function (newVal, oldVal, changedPath) {},
    },
    shopId: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    floorData: null,
    boxShadow: " 0px 0px 16rpx 4rpx rgba(17, 17, 17, 0.05);",
    imageSwiperCurrentIndex: 0,
    hotpos:'',
    toView: 0,
    isScroll: true,
    arrayImg:[],
    allimg:[],
    img_index: 1,
    x_scroll: 0,
    goodsList:[]
  },
  attached() {
    common.loadTheme(this);
    const {
      length,
    } = getCurrentPages()
    const route = getCurrentPages()[length - 1].route
    // console.log(888888,route)
    if (route === 'pages/index/index') {
      this.setData({
        isIndex1: true
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 监听滚动高度
  scrollTop(e) {
    if (e.detail.scrollTop > 1900) {
      this.setData({
        scrollHeight: true
      });
    }
    if (e.detail.scrollTop < 1900) {
      this.setData({
        scrollHeight: false
      });
    }
  },
    // 点击楼层
    tapFloor(e) {
      let showType =
        e.currentTarget.dataset.type || e.detail.currentTarget.dataset.type;
      let param =
        e.currentTarget.dataset.param != ""
          ? e.currentTarget.dataset.param
          : e.detail.currentTarget.dataset.param;
      // if(e.currentTarget.dataset.shop_id) {
        let shop_id1 =
          e.currentTarget.dataset.shop_id
      // }
      /* 商品：1，
      -- 分类对应列表：2，
      -- 店铺：3，
      -- 热门商品列表：4，
      -- 新品推荐列表：5，
      -- 推荐店铺列表：6，
      -- 富文本：7，
      -- 外链：8，
      -- 其他同一店铺下楼层的use_position：9，
      -- 新人必买：10，
      -- 品牌精选：11，
      -- VIP专区：12，
      -- 签到领币：13，14  
      -- 礼包列表页面  跳转type15 礼包详情 
      -- 佣金商品 ： 16 */
      if (showType == 1) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url: "/pages/goodDetail/goodDetail?id=" + param + "&shop_id=" + shop_id1,
        });
      } else if (showType == 2) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url:
            "/pages/class/classDetail/classDetail?mcid=" + param + "&name=商品",
        });
      } else if (showType == 3) {
        // wx.navigateTo({
        //   url: '/pages/shop/shopDetail/shopDetail?id=' + param
        // })
      } else if (showType == 4) {
        wx.navigateTo({
          url: "/pages/class/classDetail/classDetail?name=热门商品&isHot=1",
        });
      } else if (showType == 5) {
        wx.navigateTo({
          url: "/pages/class/classDetail/classDetail?name=新品推荐&isNew=1",
        });
      } else if (showType == 6) {
        // wx.reLaunch({
        //   url: '/pages/shop/shop?recommend=1'
        // })
      } else if (showType == 7) {
        if (param == "") {
          return;
        }
        app.globalData.rich = param;
        wx.navigateTo({
          url: "/pages/rich/rich?",
        });
      } else if (showType == 8) {
        wx.navigateTo({
          url: "/pages/webitem/web?param=" + param
        });
      } else if (showType == 9) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url: "/pages/index/floor/floor?code=" + param,
        });
      } else if (showType == 10) {
        wx.navigateTo({
          url: "/pages/index/newPeople/newPeople",
        });
      } else if (showType == 11) {
        wx.navigateTo({
          url: "/pages/index/bestSelect/bestSelect",
        });
      } else if (showType == 12) {
        wx.navigateTo({
          url: "/pages/index/vip/vip",
        });
      } else if (showType == 13) {
        wx.navigateTo({
          url: "/pages/index/signIn/signIn",
        });
      } else if (showType == 14) {
        wx.navigateTo({
          url: "/pages/member/promote/promote",
        });
      } else if (showType == 15) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url: "/pages/member/giftDetail/giftDetail?id=" + param,
        });
      } else if (showType == 16) {
        wx.navigateTo({
          url: "/pages/member/commissionGood/comissionGood",
        });
      }
    },
    // 获取店铺优惠券明细
    getCouponeDetails(ids) {
      let self = this;
      http.HttpRequst(
        false,
        "/coupon/coupon-templet-api/coupon-details",
        2,
        "",
        {
          ids: ids,
          token: app.globalData.token,
          token_type: "1",
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              couponListData: res.data.data,
            });
          }
        }
      );
    },

    // 热门搜索标签
  hotSign() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/hot-label-list', 2, '', {},
      'POST',
      false,
      function(res) {
        // console.log(res)
        if (res.data.errcode == 0) {
          let hotpos = ''
          for(let i=0; i<res.data.data.length;i++) {
            if(res.data.data[i].position==0) {
              hotpos = res.data.data[i].name
            }
          }
          self.setData({
            hotpos: hotpos
          })
          wx.setStorageSync('hotpos', hotpos)
          // console.log(self.data.hotpos)
        }
      }
    )
  },

    // 获取弹窗
    getModal() {
      let self = this;
      http.HttpRequst(
        true,
        "/hand/shop-conf-api/get-info",
        2,
        "",
        {},
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              indexModel: res.data.data,
            });
            if (res.data.data != "") {
              self.setData({
                showIndexModel: true,
              });
            } else {
              self.setData({
                showIndexModel: false,
              });
            }
            // 本地缓存请求时间
            let date = new Date().setHours(24, 0, 0, 0); // 当天的第二天0点
            try {
              wx.setStorageSync("time", date);
            } catch (e) {}
          }
        }
      );
    },
    
    // 获取楼层
    getFloor(code) {
      let self = this;
      http.HttpRequst(
        false,
        "/floor/floor-api/get-floor-info",
        2,
        "",
        {
          token: app.globalData.token,
          use_position: code,
          shop_id: this.data.shopId,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              floorData: res.data.data,
            });
            
            const currentModule = res.data.data.content.list.find(
              (m) => m.type == 2
            );
            if(currentModule&&currentModule.show_type==1) {
              for(let i=0;i<currentModule.floor_data.length;i++) {
                currentModule.floor_data[i].type1 = currentModule.floor_data[i].type
              }
              self.setData({
                arrayImg: currentModule.floor_data
              })
              // console.log(9696,currentModule.floor_data)
              let arr = []
              for(let i=0;i<currentModule.floor_data.length;i++) {
                if(i==0) {
                  let str = "img1"
                  arr.push(str)
                }
                if(i==1) {
                  let str = "img2"
                  arr.push(str)
                }
                if(i==2) {
                  let str = "img3"
                  arr.push(str)
                }
                if(i==3) {
                  let str = "img4"
                  arr.push(str)
                }
                if(i>3) {
                  let str = "img5"
                  arr.push(str)
                }
              }
              // console.log(111,arr);
              self.setData({
                allimg: arr
              })
            }           
          }
        }
      );
    },
    // 滚动时候横线的进度
    lineScroll(e) {
      // console.log(e)
      let x 
      x=(62*e.detail.scrollLeft)/e.detail.scrollWidth
      this.setData({
        x_scroll: x
      })
      // console.log(1111,x)
    },

    onImageSwiperChanged(e) {
      const detail = e.detail;
      this.setData({
        imageSwiperCurrentIndex: detail.current,
      });
    },

    loadMore() {
      const category = this.selectComponent("#category-component");
      if(category){
        category.renderWaterflow();
      }

      const category21 = this.selectComponent("#category21-component");
      if(category21){
        category21.renderWaterflow();
      }

      const shop23 = this.selectComponent("#shop23-component");
      if(shop23){
        shop23.loadMore();
      }

      const category24 = this.selectComponent("#category24-component");
      if(category24){
        category24.loadMore();
      }
    },
    scrollToTop() {
      this.setData({
        toView: 0,
      });
    },
    test(e){
      // console.log(e)
      let thelength = this.data.arrayImg.length;
    
      let msg;
      if(e.currentTarget.dataset.value == "img5"){
        msg = this.data.allimg[0]
        for(let i = 0;i < thelength;i++){
          this.data.allimg[i] = this.data.allimg[i+1]
        }
        this.data.allimg[thelength-1] = msg
        this.setData({
          allimg : this.data.allimg,
        })
        if(this.data.img_index >= thelength) {
          this.setData({
            img_index: 1
          })
        }else {
          this.setData({
            img_index: this.data.img_index+1
          })
        }
        
        console.log(this.data.img_index,thelength)
      }else{
        msg = this.data.allimg[thelength-1]
        for(let i = thelength;i>0;i--){
            this.data.allimg[i-1] = this.data.allimg[i-2]
        }
        this.data.allimg[0] = msg
        this.setData({
          allimg : this.data.allimg,
        })
        if(this.data.img_index >= thelength) {
          this.setData({
            img_index: 1
          })
        }else {
          this.setData({
            img_index: this.data.img_index+1
          })
        }
        
        // console.log(7777,this.data.img_index,thelength)
      }
    },
    //轮播点击事件回调
    touch(e){
      // console.log("我是轮播组件touch事件传递过来的数据：");
      // console.log(e);
      // this.tapFloor(e)
      let showType =
        e.detail.currentTarget.dataset.type;
      let param =
        e.detail.currentTarget.dataset.param;
      // if(e.detail.currentTarget.dataset.shop_id) {
        let shop_id2 =
        e.detail.currentTarget.dataset.shop_id
      // }
      /* 商品：1，
      -- 分类对应列表：2，
      -- 店铺：3，
      -- 热门商品列表：4，
      -- 新品推荐列表：5，
      -- 推荐店铺列表：6，
      -- 富文本：7，
      -- 外链：8，
      -- 其他同一店铺下楼层的use_position：9，
      -- 新人必买：10，
      -- 品牌精选：11，
      -- VIP专区：12，
      -- 签到领币：13，14  
      -- 礼包列表页面  跳转type15 礼包详情 
      -- 佣金商品 ： 16 */
      if (showType == 1) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url: "/pages/goodDetail/goodDetail?id=" + param + "&shop_id=" + shop_id2,
        });
      } else if (showType == 2) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url:
            "/pages/class/classDetail/classDetail?mcid=" + param + "&name=商品",
        });
      } else if (showType == 3) {
        // wx.navigateTo({
        //   url: '/pages/shop/shopDetail/shopDetail?id=' + param
        // })
      } else if (showType == 4) {
        wx.navigateTo({
          url: "/pages/class/classDetail/classDetail?name=热门商品&isHot=1",
        });
      } else if (showType == 5) {
        wx.navigateTo({
          url: "/pages/class/classDetail/classDetail?name=新品推荐&isNew=1",
        });
      } else if (showType == 6) {
        // wx.reLaunch({
        //   url: '/pages/shop/shop?recommend=1'
        // })
      } else if (showType == 7) {
        if (param == "") {
          return;
        }
        app.globalData.rich = param;
        wx.navigateTo({
          url: "/pages/rich/rich?",
        });
      } else if (showType == 8) {
        wx.navigateTo({
          url: "/pages/webitem/web?param=" + param
        });
      } else if (showType == 9) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url: "/pages/index/floor/floor?code=" + param,
        });
      } else if (showType == 10) {
        wx.navigateTo({
          url: "/pages/index/newPeople/newPeople",
        });
      } else if (showType == 11) {
        wx.navigateTo({
          url: "/pages/index/bestSelect/bestSelect",
        });
      } else if (showType == 12) {
        wx.navigateTo({
          url: "/pages/index/vip/vip",
        });
      } else if (showType == 13) {
        wx.navigateTo({
          url: "/pages/index/signIn/signIn",
        });
      } else if (showType == 14) {
        wx.navigateTo({
          url: "/pages/member/promote/promote",
        });
      } else if (showType == 15) {
        if (param == "") {
          return;
        }
        wx.navigateTo({
          url: "/pages/member/giftDetail/giftDetail?id=" + param,
        });
      } else if (showType == 16) {
        wx.navigateTo({
          url: "/pages/member/commissionGood/comissionGood",
        });
      }
    }
  },
  
});
