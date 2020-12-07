// pages/class/class.js
const app = getApp();
const http = require("../../utils/http.js");
const common = require("../../utils/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    category: "",
    listIndex: 0,
    showNoRead: false,
    isShowModal: false,
    secondLevel: "",
    barHeight: app.globalData.totalHeight,
    pageHeight: app.globalData.pageHeight,
    _ratio: app.globalData._ratio,
    sharePath: "",
    add: 0,
    firstIn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this);
    if (options.add == 1) {
      this.setData({
        add: 1,
      });
    }
    common.handleShareUrl(this, "pages/class/class");
    this.getCategory();
  },
  onShareAppMessage() {
    return {
      title: "商品分类",
      path: this.data.sharePath,
    };
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getNotice();
    this.setData({
      isShowModal: app.globalData.showModal,
    });
    //wx.hideTabBar();
    if (
      app.globalData.role != app.globalData.userInfo.role ||
      !this.data.firstIn
    ) {
      if (app.globalData.userInfo.role == 0) {
        this.setData({
          tabbar: app.globalData.tabBar2,
        });
      } else {
        this.setData({
          tabbar: app.globalData.tabBar,
        });
      }
      this.setData({
        firstIn: true,
      });
      app.editTabbar(app.globalData.userInfo.role, app.globalData.isDistr);
    }
    wx.hideNavigationBarLoading();
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
  onReachBottom: function () {},
  // 获取分类
  getCategory: function () {
    let self = this;
    http.HttpRequst(
      true,
      "/item/me-category-api/index",
      2,
      "",
      {
        token: app.globalData.token,
        shop_id: 0,
        is_home: 0,
        start_page: 0,
        pages: 999,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            category: res.data.data,
          });
          if (self.data.category.list[0]) {
            self.getSecondLevel(self.data.category.list[0].mcid);
          }
        }
      }
    );
  },
  // 获取二级分类
  getSecondLevel: function (pid) {
    let self = this;
    http.HttpRequst(
      true,
      "/item/me-category-api/get-category-list",
      2,
      "",
      {
        token: app.globalData.token,
        shop_id: 0,
        pid: pid,
        page: 0,
        size: 999,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            secondLevel: res.data.data,
          });
        }
      }
    );
  },
  // 选择分类
  selectTab: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.listIndex) {
      return;
    } else {
      this.setData({
        listIndex: index,
      });
    }
    this.getSecondLevel(this.data.category.list[this.data.listIndex].mcid);
  },
  // 跳转子分类
  jumpDetail: function (e) {
    let mcid = e.currentTarget.dataset.mcid;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url:
        "/pages/class/classDetail/classDetail?mcid=" +
        mcid +
        "&name=" +
        name +
        "&add=" +
        this.data.add,
    });
  },
  // 获取站内信未读数
  getNotice() {
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
        }
      }
    );
  },
});
