// pages/fq/fq.js
const app = getApp();
const http = require("../../utils/http.js");
const common = require("../../utils/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      {
        title: "商品推荐",
      },
      {
        title: "营销素材",
      },
      {
        title: "新手必发",
      },
    ],
    tabIndex: 0,
    startPage: 0,
    listData: "",
    scrollTop: "",
    tabbar: {},
    isIphoneX: false,
    barHeight: app.globalData.totalHeight,
    _ratio: app.globalData._ratio,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this);
    this.setData({
      isIphoneX: app.globalData.systemX,
    });
    this.getMaterial(1);
  },
  // 获取列表
  getMaterial: function (status) {
    let self = this;
    http.HttpRequst(
      true,
      "/stuff/item-material-api/list",
      2,
      "",
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        show_type: status,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data,
          });
        }
      }
    );
  },
  // 选择tab
  selectTab(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.tabIndex) {
      return;
    } else {
      this.setData({
        tabIndex: index,
        startPage: 0,
        scrollTop: 0,
      });
      // wx.pageScrollTo({
      //   scrollTop: 0
      // })
      let status = Number(index) + 1;
      this.getMaterial(status);
    }
  },
  // 过滤标签
  replaceRich(string) {
    var str = string;
    var dd = str.replace(/<(\/?[^Pp].*?)>/g, "\r\n");
    var dds = dd.replace(/<p>/g, "");
    var ddss = str.replace(/<\/?.+?>/g, "");
    return dds;
  },
  // 复制文本
  copyInfo: function (e) {
    let index = e.currentTarget.dataset.index;
    let text = this.replaceRich(this.data.listData.list[index].rich_text);
    wx.setClipboardData({
      data: text,
      success(res) {
        wx.getClipboardData({
          success(res) {},
        });
      },
    });
  },
  //提示
  showTip() {
    wx.showToast({
      title:
        "因为小程序的限制，请长按图片保存，手动转发至朋友圈。给您带来不便恳请谅解。",
      icon: "none",
      duration: 2000,
    });
  },
  // 预览商品图片
  preview: function (e) {
    let index = e.currentTarget.dataset.index;
    let imgIndex = e.currentTarget.dataset.imgindex;
    if (this.data.listData.list[index].imgs != "") {
      wx.previewImage({
        current: this.data.listData.list[index].imgs[imgIndex], // 当前显示图片的http链接
        urls: this.data.listData.list[index].imgs, // 需要预览的图片http链接列表
      });
    }
  },
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false;
    } else {
      self.setData({
        startPage: pages,
      });
      let status = Number(self.data.tabIndex) + 1;
      http.HttpRequst(
        true,
        "/stuff/item-material-api/list",
        2,
        "",
        {
          token: app.globalData.token,
          show_type: status,
          start_page: self.data.startPage,
          pages: 10,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "listData.list";
            let list = res.data.data.list;
            let newListData = self.data.listData.list.concat(list);
            self.setData({
              [listData]: newListData,
            });
          }
        }
      );
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      tabbar: app.globalData.tabBar,
    });
    app.editTabbar();
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
  onReachBottom: function () {},

  extension(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    http.HttpRequst(
      true,
      "/item/me-item-api/merger-img",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: id,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            shareImg: res.data.data[0],
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
});
