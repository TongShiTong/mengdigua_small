//app.js
const http = require("./utils/http.js");

const _systemInfo = wx.getSystemInfoSync();
const _barHeight = _systemInfo.statusBarHeight;
const _screenHeight = _systemInfo.screenHeight;
const _ratio = _systemInfo.screenWidth / 750;
const _ratio2 = _systemInfo.screenWidth / 375;

App({
  onLaunch: function (option) {
    // console.log(123456,option)
    this.getTheme();
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log('小程序自动更新最新版本' + res.hasUpdate);
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    });
    // 登录  获取场景值
    this.globalData.launchOptions = wx.getLaunchOptionsSync();
    //wx.hideTabBar();
    this.getSystemInfo();
  },

  onShow: function (option) {
    const that = this;
    // console.log(option)
    //隐藏系统tabbar
    //wx.hideTabBar();
    if (option.query.scene) {
      let scene = decodeURIComponent(option.query.scene);
      scene = that.hrefObj(scene);
      option.query.share_code = scene.share_code;
    }
    const query = option.query;

    // query.share_code ="9898ea"

    if (query.share_code === void 0) {
      return;
    } else {
      // 成为下级
      (function becomeFans() {
        console.log("要变为下级了");
        if (query.share_code) {
          that.globalData.share_code = query.share_code;
          http.HttpRequst(
            false,
            "/hand/fans-api/create-fans",
            2,
            "",
            {
              token: that.globalData.token,
              share_code: query.share_code,
            },
            "POST",
            false,
            function (res) {
              if (res.data.errcode == 0) {
                console.log("绑定成功");
              }
            }
          );
        }
      })();
    }
  },
  onHide() {
    this.globalData.temporaryCode=""
  },

  globalData: {
    // baseUrl: 'http://tmp-api.netmi.com.cn', //
    // baseUrl: 'https://merchant-api-f.netmi.com.cn', // 开发 wx595868e5dcb4a363
    // baseUrl: "http://192.168.5.13:8087", // 1测试 wxb2af63a5d11214d3
    baseUrl: "https://t1.mengdigua.cn", // 1测试 wxb2af63a5d11214d3
    // baseUrl: 'https://shop-api.netmi.com.cn', // 正式 wx25110d49fc537468
    share_code: "", //绑定上下级的id
    isDistr: 1, // 是否是分销 0否 1是
    showUrl: false, //公猫链接
    goodDeatil: false, //商品详情
    role: 0, //身份默认 普通
    theme: 0, //主题编号
    themeInfo: null, //主题信息
    groupRemind: null, //拼图提醒
    personShopList: 0,
    groupId: 0,
    setRemined: false, //提现后充值拼团
    userInfo: null,
    handInfo: "", // 推手等级
    launchOptions: "", // 登录场景值
    temporaryCode: "", //通过小程序码获取的参数
    token: "",
    openId: "",
    isBindPhone: false, // 是否绑定手机号
    // isUse: false, // 判断当前token是否有效
    oneOrder: "", // 商品详情的订单数据
    shopcarOrder: "", // 购物车的订单数据
    totalPrice: "", // 购物车总价
    showModal: false, // 是否显示弹窗
    orderReturn: "", // 退货退款的商品数据
    editOrderReturn: "", // 修改退款详情的数据
    rich: "", // 富文本
    orderInfo: "", // 下单完的订单信息
    orderAddress: "", // 下单选择的地址
    systemX: false, // 是不是iphoneX
    returnShop: false, // 退款店铺信息
    comfirmInvoiceIndex: "", //发票确认索引
    hasChangeThem: false, //改变主题
    shop_name: "", //标题得名字
    invoice: {
      invoice_content: "",
      invoice_type: "",
      type: "",
      company_name: "",
      company_code: "",
      phone: "",
      mail: "",
    }, // 发票信息
    systemInfo: "",
    _ratio,
    _ratio2,
    barHeight: _barHeight,
    totalHeight: 90 * _ratio + _barHeight,
    pageHeight: _screenHeight - 90 * _ratio - _barHeight,
    tabBar: {
      color: "#999999",
      selectedColor: "#F8DA0D",
      backgroundColor: "#ffffff",
      borderStyle: "black",
      list: [
        {
          pagePath: "/pages/index/index",
          text: "首页",
          iconPath: "/images/1-U.png",
          selectedIconPath: "/images/1-C.png",
        },
        {
          pagePath: "/pages/fq/fq",
          text: "发圈",
          iconPath: "/images/2-U.png",
          selectedIconPath: "/images/2-C.png",
        },
        {
          pagePath: "/pages/member/member",
          text: "分类",
          iconPath: "/images/3-U.png",
          selectedIconPath: "/images/3-C.png",
        },
        {
          pagePath: "/pages/shopCar/shopCar",
          text: "购物车",
          iconPath: "/images/4-U.png",
          selectedIconPath: "/images/4-C.png",
        },
        {
          pagePath: "/pages/center/center",
          text: "我的",
          iconPath: "/images/5-U.png",
          selectedIconPath: "/images/5-C.png",
        },
      ],
    },
    tabBar1: {
      color: "#999999",
      selectedColor: "#F8DA0D",
      backgroundColor: "#ffffff",
      borderStyle: "black",
      list: [
        {
          pagePath: "/pages/index/index",
          text: "首页",
          iconPath: "/images/1-U.png",
          selectedIconPath: "/images/1-C.png",
        },
        {
          pagePath: "/pages/member/member",
          text: "分类",
          iconPath: "/images/3-U.png",
          selectedIconPath: "/images/3-C.png",
        },
        {
          pagePath: "/pages/shopCar/shopCar",
          text: "购物车",
          iconPath: "/images/4-U.png",
          selectedIconPath: "/images/4-C.png",
        },
        {
          pagePath: "/pages/center/center",
          text: "我的",
          iconPath: "/images/5-U.png",
          selectedIconPath: "/images/5-C.png",
        },
      ],
    },
    tabBar2: {
      color: "#999999",
      selectedColor: "#F8DA0D",
      backgroundColor: "#ffffff",
      borderStyle: "black",
      list: [
        {
          pagePath: "/pages/index/index",
          text: "首页",
          iconPath: "/images/1-U.png",
          selectedIconPath: "/images/1-C.png",
        },
        {
          pagePath: "/pages/class/class",
          text: "分类",
          iconPath: "/images/3-U.png",
          selectedIconPath: "/images/3-C.png",
        },
        {
          pagePath: "/pages/shopCar/shopCar",
          text: "购物车",
          iconPath: "/images/4-U.png",
          selectedIconPath: "/images/4-C.png",
        },
        {
          pagePath: "/pages/center/center",
          text: "我的",
          iconPath: "/images/5-U.png",
          selectedIconPath: "/images/5-C.png",
        },
      ],
    },
  },
  hrefObj: function (url) {
    var localarr = url.split("&");
    var tempObj = {};
    for (var i = 0; i < localarr.length; i++) {
      tempObj[localarr[i].split("=")[0]] = localarr[i].split("=")[1];
    }
    return tempObj;
  },
  // 手机号是否正确
  testPhone: function (phone) {
    // 0 空 1 有误  2正确
    let phonereg = /^1(2|3|4|5|6|7|8|9)\d{9}$/;
    if (phone == "") {
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
        duration: 1000,
      });
      return 0;
    } else if (!phonereg.test(phone)) {
      wx.showToast({
        title: "输入的手机号有误",
        icon: "none",
        duration: 1000,
      });
      return 1;
    } else {
      return 2;
    }
  },
  // 邮箱验证
  testMail: function (mail) {
    // 0 空 1 有误  2正确
    let mailreg = new RegExp(
      "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
    );
    if (mail == "") {
      wx.showToast({
        title: "请输入邮箱",
        icon: "none",
        duration: 1000,
      });
      return 0;
    } else if (!mailreg.test(mail)) {
      wx.showToast({
        title: "输入的邮箱有误",
        icon: "none",
        duration: 1000,
      });
      return 1;
    } else {
      return 2;
    }
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
        if (res.model.indexOf("iPhone X") == "-1") {
          t.globalData.systemX = false;
        } else {
          t.globalData.systemX = true;
        }
      },
    });
  },
  //更改tab
  editTabbar: function (status, isDistr) {
    let tabbar = {};
    if (status == 0) {
      if (isDistr == 0) {
        // tabbar = this.globalData.tabBar1;
        tabbar = this.globalData.tabBar2;
      } else {
        tabbar = this.globalData.tabBar2;
      }
    } else {
      // tabbar = this.globalData.tabBar;
      tabbar = this.globalData.tabBar2;
    }
    let theme = this.globalData.theme;
    let themeInfo = this.globalData.themeInfo;
    if (themeInfo && themeInfo.icons.length && themeInfo.icons[0].icon_act) {
      let length = tabbar.list.length;
      tabbar.list.forEach((item, index) => {
        let idx = 0;
        if (length === 4) {
          idx = index > 0 ? index + 1 : index;
        } else {
          idx = index;
        }
        item.iconPath = themeInfo.icons[idx].icon;
        item.selectedIconPath = themeInfo.icons[idx].icon_act;
      });
    }
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    pagePath.indexOf("/") != 0 && (pagePath = "/" + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      tabbar.list[i].pagePath == pagePath && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar,
    });
  },

  //获取主题参数
  getTheme() {
    http.HttpRequst(
      false,
      "/base/templet-api/info",
      2,
      "",
      {},
      "POST",
      false,
      (res) => {
        if (res.data.errcode == 0) {
          const data = res.data.data;
          const theme = ~~data.color_theme;
          // const theme = 1
          this.globalData.theme = theme;
          this.globalData.themeInfo = data;
          this.globalData.shop_name = data.shop_name;
          this.globalData.hasChangeThem = this.globalData.theme !== theme; //主题色已经变了
          // console.log(this.globalData.hasChangeThem)
        } else {
          this.globalData.hasChangeThem = !this.globalData.hasChangeThem;
        }
      }
    );
  },
  // 路由push
  pushRoute(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    });
  },
  // 路由back
  routeBack() {
    wx.navigateBack({});
  },
  // 存 缓存
});
