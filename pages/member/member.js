// pages/member/member.js
const app = getApp();
const http = require("../../utils/http.js");
const common = require("../../utils/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _ratio: app.globalData._ratio2,
    isHelp: false,
    is_stuck: 0, //是否卡位身份 0:否 1:是
    bannerList: [], //banner 数组
    theme: false,
    isShowModal: false,
    userInfo: "",
    isBindPhone: false,
    banner: "",
    percent: "",
    growth: "",
    giftData: "",
    scrollIndex: 0,
    startPage: 0,
    autoplay: true,
    circel: [0, 1, 2, 3],
    vipTitle: "",
    vipText: "",
    explainMask: false,
    handInfo: false,
    showShare: false,
    income: "",
    adData: "",
    tabbar: {},
    isIphoneX: false,
    schoolList: [],
    sharePath: "",
    totalHeight: app.globalData.totalHeight,
    barHeight: app.globalData.totalHeight,
    bgImg: false, //非会员背景图
    bgImg2: false, //会员背景图
    firstIn: false,
    second: 0, //卡位到期
    step2: false,
    showInfo: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage();
    this.setData({
      isIphoneX: app.globalData.systemX,
    });
  },
  // 授权获取头像
  authorization() {
    setTimeout(() => {
      this.getUser();
    }, 500);
  },
  // 获取用户信息
  banner: function () {
    let self = this;
    http.HttpRequst(
      false,
      "/banner/banner-api/index",
      2,
      "",
      {
        seat_id: 16,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            bannerList: res.data.data.list,
          });
        }
      }
    );
  },
  // 获取用户信息
  getUser: function () {
    let self = this;
    http.HttpRequst(
      false,
      "/member/user-api/info",
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
            userInfo: res.data.data,
            isBindPhone: app.globalData.isBindPhone,
            isShowModal: app.globalData.showModal,
          });
          app.globalData.userInfo = res.data.data;
          if (
            app.globalData.role != self.data.userInfo.role ||
            !self.data.firstIn
          ) {
            if (self.data.userInfo.role == 0) {
              self.setData({
                tabbar: app.globalData.tabBar2,
              });
            } else {
              self.setData({
                tabbar: app.globalData.tabBar,
              });
            }
            self.setData({
              firstIn: true,
            });
            app.editTabbar(self.data.userInfo.role);
          }
          // self.getBanner();
          if (self.data.banner == "") {
            self.banner();
          }
          self.getGrow();
          if (self.data.userInfo.role == 0 || self.data.is_stuck == 1) {
            self.getGift();
          } else if (self.data.userInfo.role == 1) {
            self.getHandInfo();
            self.getIncome();
            self.meaasgeList();
            self.meaasgeList();
            self.setData({
              percent: 100,
            });
          }
        }
      }
    );
  },
  // 获取推手信息
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
          if (self.data.handInfo.stuck_time != null) {
            let second =
              (new Date(
                self.data.handInfo.stuck_time.replace(/-/g, "/")
              ).getTime() -
                new Date().getTime()) /
              1000;
            self.setData({
              second: second,
            });
          }
          app.globalData.handInfo = res.data.data;
        }
      }
    );
  },
  // 消息列表
  meaasgeList() {
    let self = this;
    http.HttpRequst(
      false,
      "/notice/notice-api/get-message-from-type",
      2,
      "",
      {
        token: app.globalData.token,
        type_arr: [1],
        start_page: 0,
        pages: 2,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            adData: res.data.data,
          });
        }
      }
    );
  },
  // 获取收入
  getIncome() {
    let self = this;
    http.HttpRequst(
      false,
      "/hand/hand-api/get-my-income",
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
            income: res.data.data,
          });
        }
      }
    );
  },
  // 获取成长值
  getGrow() {
    let self = this;
    http.HttpRequst(
      false,
      "/member/growth-api/get-info",
      2,
      "",
      {
        token: app.globalData.token,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let total =
            Number(res.data.data.growth) + Number(res.data.data.less_growth);
          let percent = (Number(res.data.data.growth) / total) * 100;
          percent = percent.toFixed(2);
          self.setData({
            growth: res.data.data,
            percent: percent,
          });
        }
      }
    );
    http.HttpRequst(
      false,
      "/content/content-api/view",
      2,
      "",
      {
        type: 30,
        action_id: 0,
      },
      "POST",
      false,
      function (res) {
        self.setData({
          content: res.data.data.content,
          helpTitle: res.data.data.title,
        });
      }
    );
  },
  // 获取vip轮播
  getBanner() {
    let self = this;
    http.HttpRequst(
      false,
      "/member/user-api/get-information-list",
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
            banner: res.data.data,
          });
        }
      }
    );
  },
  // 滚动vip展示图监听
  scrollVip(e) {
    if (e.detail.scrollLeft < 460 && e.detail.scrollLeft > 200) {
      this.setData({
        scrollIndex: 1,
      });
    } else if (e.detail.scrollLeft < 730 && e.detail.scrollLeft > 460) {
      this.setData({
        scrollIndex: 2,
      });
    } else if (e.detail.scrollLeft > 730) {
      this.setData({
        scrollIndex: 3,
      });
    } else if (e.detail.scrollLeft < 200) {
      this.setData({
        scrollIndex: 0,
      });
    }
  },
  // 礼包
  getGift() {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/index",
      2,
      "",
      {
        token: app.globalData.token,
        item_type: 4,
        pages: 10,
        start_page: self.data.startPage,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            giftData: res.data.data,
          });
        }
      }
    );
  },
  // 跳转升级vip
  jumpPromote() {
    wx.navigateTo({
      url: "/pages/member/promote/promote",
    });
  },
  // 跳转邀请好友
  jumpInvite() {
    wx.navigateTo({
      url: "/pages/member/invite/invite",
    });
  },
  // 跳转订单管理 预计收入
  jumpIncome() {
    wx.navigateTo({
      url: "/pages/member/income/income",
    });
  },
  jumpIncomeTwo(e) {
    let tabIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "/pages/member/income/income?tabIndex=" + tabIndex,
    });
  },
  // 跳转分享收入
  jumpShareIncome() {
    wx.navigateTo({
      url: "/pages/member/shareIncome/shareIncome",
    });
  },
  // 跳转消息
  jumpMessage() {
    wx.navigateTo({
      url: "/pages/center/message/notice/notice?id=" + 1,
    });
  },
  // 消息详情
  jumpMessageDetail(e) {
    let param = e.currentTarget.dataset.j.param;
    let notice = e.currentTarget.dataset.j.notice;
    let linkType = e.currentTarget.dataset.j.link_type;
    if (linkType == 2) {
    } else if (linkType == 3) {
      app.globalData.rich = notice;
      wx.navigateTo({
        url:
          "/pages/center/message/detail/detail?id=" +
          e.currentTarget.dataset.j.notice.id,
      });
    } else if (linkType == 4) {
      wx.navigateTo({
        url: "/pages/order/orderDetail/orderDetail?id=" + param,
      });
    } else if (linkType == 5) {
      wx.navigateTo({
        url: "/pages/center/refund/refundDetail/refundDetail?id=" + param,
      });
    } else if (linkType == 6) {
      wx.navigateTo({
        url: "/pages/goodDetail/goodDetail?id=" + param,
      });
    }
  },
  // 跳转提现
  jumpCash() {
    if (this.data.handInfo.is_stuck == 1) {
      wx.showModal({
        title: "温馨提示",
        content: "您当前为非正式会员，需要完成指定任务转正后才能提现噢！",
        confirmText: "去完成",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/member/identityRule/identityRule",
            });
          } else if (res.cancel) {
            ("用户点击取消");
          }
        },
      });
      return;
    }
    wx.navigateTo({
      url: "/pages/member/cash/cash",
    });
  },
  // vip权益说明
  showExplain(e) {
    let id = e.currentTarget.dataset.item.id;
    let item = e.currentTarget.dataset.item;
    this.setData({
      vipTitle: item.name,
      vipText: item.remark,
    });
    this.setData({
      explainMask: true,
    });
  },
  // 关闭vip权益说明
  closeExplain() {
    this.setData({
      explainMask: false,
    });
  },
  // 复制邀请码
  copyInfo: function () {
    wx.setClipboardData({
      data: this.data.handInfo.share_code,
      success(res) {
        wx.getClipboardData({
          success(res) {},
        });
      },
    });
  },
  // 分享店铺
  shareShop() {
    let self = this;
    http.HttpRequst(
      true,
      "/member/user-api/get-vip-share-poster",
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
            shareImg: res.data.data,
            showShare: true,
          });
        }
      }
    );
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
  // 跳转粉丝
  jumpFans(e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url:
        "/pages/member/fans/fans?code=" +
        this.data.handInfo.share_code +
        "&index=" +
        index,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSchoolList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    common.loadTheme(this);
    common.handleShareUrl(this, "pages/member/member");
    this.getUser();
    //wx.hideTabBar();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this;
    if (self.data.userInfo.role == 0) {
      let pages = self.data.startPage + 1;
      if (pages > Math.ceil(self.data.giftData.total_pages / 10) - 1) {
        return false;
      } else {
        self.setData({
          startPage: pages,
        });
        http.HttpRequst(
          true,
          "/item/me-item-api/index",
          2,
          "",
          {
            token: app.globalData.token,
            item_type: 4,
            pages: 10,
            start_page: self.data.startPage,
          },
          "POST",
          false,
          function (res) {
            if (res.data.errcode == 0) {
              let listData = "giftData.list";
              let list = res.data.data.list;
              let newListData = self.data.giftData.list.concat(list);
              self.setData({
                [listData]: newListData,
              });
            }
          }
        );
      }
    }
  },

  goSchoolDeatil: function (e) {
    let type = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    if (type == 14) {
      wx.navigateTo({
        url:
          "/pages/member/newguide/newguide?type=" + type + "&titleName=" + name,
      });
    } else {
      wx.navigateTo({
        url:
          "/pages/member/shcoolList/shcoolList?type=" +
          type +
          "&titleName=" +
          name,
      });
    }
  },
  // 获取列表
  getSchoolList: function (status) {
    let self = this;
    http.HttpRequst(
      true,
      "/information/information-api/theme-index",
      2,
      "",
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 4,
        pid: 0,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            schoolList: res.data.data.list,
          });
        }
      }
    );
  },
  // 跳转任务进度
  jumpRule() {
    wx.navigateTo({
      url: "/pages/member/identityRule/identityRule",
    });
  },
  goDetailTwo(e) {
    app.pushRoute(e);
  },

  showModelquesion(e) {
    this.setData({
      isHelp: true,
    });
  },
  closeQuesion(e) {
    this.setData({
      isHelp: false,
    });
  },
  getStorage() {
    let self = this;
    wx.getStorage({
      key: "step2",
      success(res) {
        self.setData({
          step2: true,
        });
      },
      fail(res) {},
    });
  },
  setStorage() {
    let self = this;
    wx.setStorage({
      key: "step2",
      data: "1",
    });
  },
  nextStep() {
    if (this.data.showInfo == 1) {
      this.setData({
        showInfo: 2,
      });
    } else if (this.data.showInfo == 2) {
      this.setData({
        showInfo: false,
        step2: true,
      });
      this.setStorage();
    }
  },
});
