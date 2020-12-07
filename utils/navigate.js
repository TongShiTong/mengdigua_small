function tapFloor(e) {
  // console.log(e);
  if(!e.currentTarget.dataset.type&&!e.currentTarget.dataset.param) {
    // console.log(showType,param)
    return 
  }
  let showType =
    e.currentTarget.dataset.type || e.detail.currentTarget.dataset.type;
  let param =
    e.currentTarget.dataset.param != ""
      ? e.currentTarget.dataset.param
      : e.detail.currentTarget.dataset.param;

  let shop_id =
      e.currentTarget.dataset.shop_id
  
  // let title = e.currentTarget.dataset.title || e.detail.currentTarget.dataset.title;

  // let showType = e.currentTarget.dataset.type ;
  // let param = e.currentTarget.dataset.param ;
  let title = e.currentTarget.dataset.title;

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
      url: "/pages/goodDetail/goodDetail?id=" + param + "&shop_id=" + shop_id,
    });
  } else if (showType == 2) {
    if (param == "") {
      return;
    }
    wx.navigateTo({
      url: "/pages/class/classDetail/classDetail?mcid=" + param + "&name=商品",
    });
  } else if (showType == 3) {
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + param
    })
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

export { tapFloor };
