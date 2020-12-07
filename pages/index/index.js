//获取应用实例
const app = getApp();
const http = require("../../utils/http.js");
const common = require("../../utils/common.js");

Page({
  /**
   * 页面的初始数据
   */

  data: {
    loadOnce: false, //加载一次
    theme: false,
    showType: false, //默认不显示
    indicatorDots: true,
    showNoRead: false,
    hotSize: 0,
    newSize: 0,
    comSize: 0,
    cuscomSize: [],
    hotData: "",
    newData: "",
    comData: "",
    cuscomData: "",
    tab: "",
    tabIndex: 0,
    skillData: "",
    skillIndex: null,
    skillContentIndex: 0,
    skillCode: "",
    listData: "",
    yesterdayData: "",
    tomorrowData: "",
    userInfo: "",
    superUser: "",
    // uid: '',
    shareCode: "",
    autoplay: true,
    indexModel: "",
    showIndexModel: false,
    scene: "",
    launchOptions: "",
    // showShare: false,
    shareImg: "",
    skillTop: "",
    toView: "",
    isShowModal: false,
    tabbar: {},
    isIphoneX: false, //
    couponList: [],
    barHeight: app.globalData.totalHeight,
    _ratio: app.globalData._ratio2,
    pageHeight: app.globalData.pageHeight,
    sharePath: "", //分享链接
    firstIn: false, //第一次渲染Tabbar
    spikeFixed: false, //秒杀头部是否固定
    groupIndex: 0,
    skill_start_page: 0, //分页
    start_page: 0, //分页
    groupId: "", //场次id,
    groupList: false, //拼团列表
    newList: null,
    image:""
  },
  onPageScroll: function () {
    // 页面滚动时执行
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "萌地瓜～买，超获得感！",
      path: this.data.sharePath,
    };
  },
  onPageScroll: function (e) {
    if (e.scrollTop >= this.data.pageHeight && !this.data.spikeFixed) {
      this.setData({
        spikeFixed: true,
      });
    } else if (e.scrollTop < this.data.pageHeight && this.data.spikeFixed) {
      this.setData({
        spikeFixed: false,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.isShowSend();
    this.setData({
      isIphoneX: app.globalData.systemX,
      userInfo: app.globalData.userInfo,
      isDistr: app.globalData.isDistr,
    });
    // 获取场景值
    if (options.scene) {
      // this.setData({
      //   scene: options.scene,
      //   launchOptions: app.globalData.launchOptions,
      // });
      let scene = decodeURIComponent(options.scene);
      scene = this.hrefObj(scene);
      console.log(222,scene)
      app.globalData.temporaryCode = scene.temporary_code;
      this.setData({
        // uid: scene.uid
        shareCode: scene.temporary_code,
      });
      // this.getSuperUser();
    } else if (app.globalData.temporaryCode) {
      // let scene = app.globalData.launchOptions;
      // scene = this.hrefObj(scene);
      this.setData({
        // scene: scene,
        // launchOptions: app.globalData.launchOptions,
        // uid: scene.uid
        shareCode: app.globalData.temporaryCode,
      });
      // this.getSuperUser();
    }

    this.floorConfig();
    this.getFloor();
  },
  onShow: function () {
    // 检测主题色
    common.loadTheme(this);
    if (app.globalData.setRemined) {
      app.globalData.setRemined = !app.globalData.setRemined;
      this.setData({
        groupList: false,
        start_page: 0,
        groupId: app.globalData.groupId,
      });
      this.getGroupList();
    }
    this.setData({
      isShowModal: app.globalData.showModal,
    });
    //wx.hideTabBar();
    wx.hideNavigationBarLoading();
    if (app.globalData.groupRemind != "null") {
      this.setData({
        newList: app.globalData.groupRemind,
      });
    }
    this.getList();
  },
  // 解析小程序的url
  hrefObj(url) {
    var localarr = url.split("&");
    var tempObj = {};
    for (var i = 0; i < localarr.length; i++) {
      tempObj[localarr[i].split("=")[0]] = localarr[i].split("=")[1];
    }
    return tempObj;
  },
  // 是否需要弹窗
  isShowSend() {
    let self = this;
    try {
      wx.getStorage({
        key: "time",
        success(res) {
          let storageTime = res.data;
          let nowTime = new Date().getTime(); // 当前时间
          if (nowTime >= storageTime) {
            self.getModal();
          }
        },
        fail(res) {
          self.getModal();
        },
      });
    } catch (e) {}
  },
  // 楼层配置
  floorConfig() {
    let self = this;
    self.setData({
      floorShow: false,
    });
    http.HttpRequst(
      false,
      "/floor/floor-api/get-use-position-list",
      2,
      "",
      {
        token: app.globalData.token,
        introduction: 1,
        shop_id: 0,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          res.data.data.forEach((x, index) => {
            if (index == self.data.tabIndex) {
              x.loading = true;
              x.show = true;
            } else {
              x.loading = false;
              x.show = false;
            }
          });
          self.setData({
            tab: res.data.data,
            floorShow: true,
          });
          // self.getCouponList(); //获取优惠券
          // self.getGroupTimes(); //拼图获取场地
          // self.getFloor(self.data.tab[self.data.tabIndex].position_code);
          // self.skill();
          // self.yesterday();
        }
      }
    );
  },
  // 获取弹窗
  getModal() {
    let self = this;
    http.HttpRequst(
      false,
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
            if(res.data.data.position=="") {
              self.setData({
                showIndexModel: false,
              });
            }else {
              self.setData({
                showIndexModel: true,
              });
            }
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
  getList() {
    let self = this;
    http.HttpRequst(
      false,
      "/notice/notice-api/get-num",
      2,
      "",
      {
        token: app.globalData.token,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          if (res.data.data.all_no_readnum > 0) {
            self.setData({
              showNoRead: true,
            });
          } else {
            self.setData({
              showNoRead: false,
            });
          }
          self.setData({
            userInfo: app.globalData.userInfo,
          });
          if (
            app.globalData.role != self.data.userInfo.role ||
            !self.data.firstIn
          ) {
            // if (self.data.userInfo.role == 0) {
            //   console.log(self.data.isDistr)
            //   if (self.data.isDistr==1){
            //     self.setData({
            //       tabbar: app.globalData.tabBar2
            //     })
            //   }else{
            //     console.log(2)
            //     self.setData({
            //       tabbar: app.globalData.tabBar1
            //     })
            //   }
            // } else {
            //   self.setData({
            //     tabbar: app.globalData.tabBar
            //   })
            // }
            self.setData({
              firstIn: true,
            });
            app.editTabbar(self.data.userInfo.role, app.globalData.isDistr);
          }
          setTimeout(() => {
            self.setData({
              userInfo: app.globalData.userInfo,
              isShowModal: app.globalData.showModal,
            });
            if (self.data.userInfo.role == 1) {
              self.getHandInfo();
            }
          }, 500);
          if (!self.data.loadOnce) {
            self.setData({
              loadOnce: true,
            });
          }
        }
      }
    );
  },
  // 跳转搜索
  jumpSerch: function () {
    wx.navigateTo({
      url: "/pages/class/serch/serch",
    });
  },
  // 点击弹窗
  jumpModal() {
    // console.log(111,this.data.indexModel)
    if (this.data.indexModel.position == 1) {
      wx.navigateTo({
        url: "/pages/goodDetail/goodDetail?id=" + this.data.indexModel.info,
      });
    } else if (this.data.indexModel.position == 2) {
      wx.navigateTo({
        url: "/pages/webitem/web?param=" + this.data.indexModel.info,
      });
    } else if (this.data.indexModel.position == 3) {
      wx.navigateTo({
        url:
          "/pages/class/classDetail/classDetail?mcid=" +
          this.data.indexModel.info,
      });
    } else if (this.data.indexModel.position == 4) {
      app.globalData.rich = this.data.indexModel.content;
      wx.navigateTo({
        url: "/pages/rich/rich",
      });
    }
    this.setData({
      showIndexModel: false,
    });
  },
  // 关闭弹窗
  colseModal() {
    this.setData({
      showIndexModel: false,
    });
  },
  // 推广
  shareSkillGood(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goodDetail/share/share?id=" + id,
    });
  },
  // 分享调用点接口
  shareSuccess() {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/share-item",
      2,
      "",
      {
        token: app.globalData.token,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
        }
      }
    );
  },
  // 上拉到底部
  onReachBottom() {
    // const floorTotal = this.selectComponent("#floor-total-component");
    // const category = floorTotal.selectComponent('#category-component');
    // category.renderWaterflow();
    // this.loadMore()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.floorConfig();
    wx.stopPullDownRefresh();
  },

  // 优惠券
  getCouponList() {
    let self = this;
    http.HttpRequst(
      false,
      "/coupon/coupon-templet-api/daily-pop",
      2,
      "",
      {
        token: app.globalData.token,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            couponList: res.data.data.list,
          });
          if (res.data.data.list.length == 0) {
            self.setData({
              showType: false,
            });
          } else {
            self.setData({
              showType: true,
            });
          }
        }
      }
    );
  },
  close: function (e) {
    let self = this;
    self.setData({
      showType: e.detail.close,
    });
  },
  changeGroupTop(e) {
    let self = this;
    let index = e.detail.activeIndex;
    let id = e.detail.id;
    if (index == self.data.groupIndex) {
      return;
    } else {
      // 走场次
      self.setData({
        groupId: id,
        groupIndex: index,
        start_page: 0,
      });
      self.getGroupList();
    }
  },
  // 平团列表
  getGroupList() {
    // console.log(this.data.groupId)
    let self = this;
    common.getgoodsList(
      self,
      "/item/group-api/group-item-list",
      {
        token: app.globalData.token,
        start_page: self.data.start_page,
        pages: 10,
        category_id: self.data.groupId,
      },
      "groupList"
    );
  },
  loadMore() {
    let self = this;
    common.loadMore(
      self,
      "/item/group-api/group-item-list",
      {
        token: app.globalData.token,
        start_page: self.data.start_page,
        category_id: self.data.groupId,
        pages: 10,
      },
      "groupList"
    );
    self.loadMoreSkill();
  },
  // 组件改变了 列表 重新渲染
  changeList(e) {
    let list = "groupList.list";
    this.setData({
      [list]: e.detail.list,
    });
  },
  getHandInfo() {
    let self = this;
    http.HttpRequst(
      false,
      "/hand/hand-api/info",
      2,
      "",
      {
        token: app.globalData.token,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            handInfo: res.data.data,
          });
          app.globalData.handInfo = res.data.data;
          common.handleShareUrl(self, "pages/index/index");
        }
      }
    );
  },

  getFloor() {
    let self = this;
    http.HttpRequst(
      false,
      "/floor/floor-api/get-floor-info",
      2,
      "",
      {
        token: app.globalData.token,
        use_position: 1,
        shop_id: 0,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          const data = res.data.data;
          if(data.content.list){
            const navFloor = data.content.list.find(x=>x.type == "20");
            if(navFloor && navFloor.bgurl){
              self.setData({
                image: navFloor.bgurl,
              })
            }
          }
        }
      }
    );
  },
});
