// components/giftList/giftList.js
const app = getApp();
const http = require("../../utils/http.js");
const common = require("../../utils/common.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gooddata: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    
  },

  /**
  * 组件的初始数据
  */
  data: {
    goodsList:[]
  },
  ready() {
   
  },
  attached() {
    this.getgoodsList(this.data.gooddata)
  },

  /**
   * 组件的方法列表
   */
  methods: {
   // 获取商品列表
   getgoodsList(ids) {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/index",
      2,
      "",
      {
        item_ids: ids,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            goodsList: res.data.data.list
          })
        }
      }
    );
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
  }
})
