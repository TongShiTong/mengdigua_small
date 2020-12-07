// pages/goodDetail/goodDetail.js
const app = getApp();
const http = require("../../utils/http.js");
const formatTime = require("../../utils/util.js");
const common = require("../../utils/common.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    push_status: 0, //设置推送
    launchGroup: false, //发起拼团
    group_team_id: false, //参团id
    tem_activity_type: -1, //暂时活动
    couponListShow: true, // 可领取优惠券
    theme: false,
    couponModal: false,
    activityModal: false,
    goodId: "",
    currentIndex: 0,
    detailData: false,
    property: "",
    buyNum: 1,
    selectArr: [],
    selectData: "",
    isCollect: "",
    toView: 0,
    topTab: [
      {
        title: "商品",
      },
      // {
      //   title: '素材'
      // },
      {
        title: "评价",
      },
    ],
    isImg: [
      {
        title: "全部",
        num: "",
      },
      {
        title: "有图",
        num: "",
      },
    ],
    isImgIndex: 1,
    commentData: "",
    commentPage: 0,
    tab: [
      {
        title: "商品详情",
      },
      {
        title: "购买须知",
      },
    ],
    tabIndex: 0,
    time: "",
    materialTab: [
      {
        title: "官方素材",
      },
      {
        title: "我的素材",
      },
    ],
    materialIndex: 0,
    materialData: "",
    materialPage: 0,
    propertyValue: "",
    showMoadl: false,
    serviceDes: false,
    phoneModal: false,
    indicatorDots: true,
    autoplay: true,
    showBuyBtn: false,
    isScroll: true,
    isShowModal: false,
    isBindPhone: "",
    skillStatus: 0, // 1秒杀未开始 2秒杀中 3秒杀结束
    shareInfo: "",
    shareModal: false,
    // uid: '',
    shareCode: "",
    userInfo: "",
    isChange: false,
    timeInterval: "",
    materialScrollTop: 0,
    clickButton: false, //点击过按钮
    platformPhone: "", //平台电话
    animation: "", //展示动画
    couponStartPage: 0, //优惠券分页
    barHeight: app.globalData.totalHeight,
    _ratio: app.globalData._ratio,
    sharePath: "",
    groupSecondTime: false, // 到计时函数
    groupSecond: false, // 秒倒计时
    gropTeamList: false, //拼团团队列表
    aloneProperty: false, //单独购买规格
    allProperty: "", //全部的规格
    alone: 0,
    notAdd: false,
    isAddShopcar: true,
    isToBuy: true,
    isAloneBuy: true,
    isGroupBuy: true,
    showBar: true,
    isCollected: false,
    height: app.globalData.totalHeight,
    barHeight: app.globalData.barHeight,
    lineHeight: app.globalData.totalHeight - app.globalData.barHeight,
    backIcon: false,
    bc: "transparent",
    activityList: [],
    imageSwiperCurrentIndex: 0,
    shopId:'',
    back:'',
    hotpos: wx.getStorageSync('hotpos'),
    invitationCode:'' // 邀请码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this);
    if(options.back==1) {
      this.setData({
        back: options.back
      })
    }
    if(options.shop_id) {
      this.setData({
        shopId: options.shop_id
      })
    }
    this.setData({
      is_show_shop: app.globalData.is_show_shop,
    });
    if (options.id) {
      this.setData({
        goodId: options.id,
      });
    } else if (options.scene) {
      // 获取场景值
      let scene = decodeURIComponent(options.scene);
      scene = this.hrefObj(scene);
      this.setData({
        // uid: scene.uid,
        // shareCode: scene.share_code,
        goodId: scene.item_id,
        invitationCode: scene.shop_id,
        back: 1
      });
      this.getShop(scene.item_id)
      // this.getSuperUser();
    }
    // this.getPhone()
    // this.getShop(options.id)
    if(options.shop_id) {
      this.init();
    }
    this.getCouponeList();
    this.getActivityList();
    this.getContent(); //富文本
  },

  // 获取商品所属店铺
  getShop(id) {
    let self = this
    http.HttpRequst(
      false,
      "/item/me-item-api/get-shop",
      2,
      "",
      {
        item_id: id,
      },
      "POST",
      false,
      (res) => {
        if (res.data.errcode == 0) {
          // console.log(1122233,res)
          self.setData({
            shopId: res.data.data
          })
          self.init();
          console.log(444,self.data.shopId)
        }
      }
    );
  },
  init() {
    this.getCommontList();
    
    if(this.data.shopId!=249) {
      this.getProperty();
      this.getAllProperty();
    }else {
    }
    this.getMaterial(1);
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
  toCollect() {
    let url = "/item/me-item-collection-api/collection";
    if (this.data.isCollected) {
      http.HttpRequst(
        true,
        "/item/me-item-collection-api/del-collection",
        2,
        "",
        {
          token: app.globalData.token,
          item_id: [this.data.goodId],
        },
        "POST",
        false,
        (res) => {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: "取消收藏成功！",
            });
            this.setData({
              isCollected: false,
            });
          }
        }
      );
    } else {
      http.HttpRequst(
        true,
        url,
        2,
        "",
        {
          token: app.globalData.token,
          item_id: this.data.goodId,
        },
        "POST",
        false,
        (res) => {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: "收藏成功！",
            });
            this.setData({
              isCollected: true,
            });
          }
        }
      );
    }
  },
  
  toShopcar() {
    wx.switchTab({
      url: "/pages/shopCar/shopCar",
    });
  },
  canAdd() {
    const limit =
      this.data.detailData.activity_type == 1
        ? this.data.detailData.seckillItem.num || 0
        : this.data.detailData.groupItem.num || 0;
    if (this.data.buyNum + 1 > limit) {
      this.setData({
        notAdd: true,
      });
      wx.showToast({
        title: `限购${limit}件！`,
      });
      return true;
    }
    return false;
  },
  jumpToAlone() {
    const oldId = this.data.detailData.meItemActivity.old_item_id;
    wx.navigateTo({
      url: `/pages/goodDetail/goodDetail?id=${oldId}`,
    });
  },
  // 商品详情
  getDetail: function () {
    let self = this;
    http.HttpRequst(
      true,
      "/item/me-item-api/view",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: self.data.goodId,
      },
      "POST",
      false,
      function (res) {
        // console.log(222,res)
        if (res.data.errcode == 0) {
          let short_video_url = res.data.data.short_video_url;
          app.globalData.goodDeatil = res.data.data;
          const detailData = res.data.data;
          const regex = new RegExp("<img", "gi");
          detailData.rich_text = detailData.rich_text.replace(
            regex,
            `<img mode="widthFix" class="pic"`
          );

          self.setData({
            detailData: res.data.data,
            push_status: res.data.data.groupItem
              ? res.data.data.groupItem.push_status
                ? res.data.data.groupItem.push_status
                : null
              : 0,
            isCollect: res.data.data.is_collection,
            short_video_url:
              short_video_url == "" ||
              short_video_url == null ||
              short_video_url == undefined
                ? false
                : res.data.data.short_video_url,
            isCollected: res.data.data.is_collection == 0 ? false : true,
          });
          let path = `/pages/goodDetail/goodDetail?id=${self.data.goodId}`;
          common.handleShareUrl(self, path);
          if (self.data.clickButton == true) {
            self.setData({
              isBindPhone: app.globalData.isBindPhone,
            });
          }
          self.setData({
            isSet: self.data.push_status == null ? true : false,
          });
          self.getPv();
          if (
            self.data.detailData.activity_type == 1 &&
            self.data.detailData.seckillItem != null
          ) {
            // 秒杀倒计时
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.seckillItem.start_time,
                self.data.detailData.seckillItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          // 拼团
          if (
            self.data.detailData.activity_type == 2 &&
            self.data.detailData.groupItem != "null"
          ) {
            self.groupTime();
            self.getGroupList();
            self.getAloneProperty(); //单独
            self.getAllAloneProperty(); //所有
            self.getServicekeFu(); //智齿
          }
          //秒杀
          if (self.data.detailData.activity_type == 1) {
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.seckillItem.start_time,
                self.data.detailData.seckillItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          //拼团
          if (self.data.detailData.activity_type == 2) {
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.groupItem.start_time,
                self.data.detailData.groupItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          // 砍价
          if (
            self.data.detailData.activity_type == 3 &&
            self.data.detailData.bargainItem != "null"
          ) {
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.bargainItem.start_time,
                self.data.detailData.bargainItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          self.getServicekeFu();
          self.getShareInfo();
        }
      }
    );
  },
  getDetail1: function () {
    let self = this;
    http.HttpRequst(
      true,
      "/item/jxk-product-api/detail",
      2,
      "",
      {
        token: app.globalData.token,
        id: self.data.goodId,
      },
      "POST",
      false,
      function (res) {
        // console.log(111,res)
        if (res.data.errcode == 0) {
          let short_video_url = res.data.data.short_video_url;
          app.globalData.goodDeatil = res.data.data;
          const detailData = res.data.data;
          const regex = new RegExp("<img", "gi");
          detailData.rich_text = detailData.rich_text.replace(
            regex,
            `<img mode="widthFix" class="pic"`
          );
          let itemImgs = []
          let data = res.data.data
          for(let i = 0; i<res.data.data.imgs.length;i++) {
            itemImgs.push(res.data.data.imgs[i].img_url)
          }
          data.itemImgs = itemImgs
          if((typeof data.phoneDetail) === 'string') {
            data.phoneDetail = data.phoneDetail.split(',')
          }
          self.setData({
            detailData: data,
            push_status: res.data.data.groupItem
              ? res.data.data.groupItem.push_status
                ? res.data.data.groupItem.push_status
                : null
              : 0,
            isCollect: res.data.data.is_collection,
            short_video_url:
              short_video_url == "" ||
              short_video_url == null ||
              short_video_url == undefined
                ? false
                : res.data.data.short_video_url,
            isCollected: res.data.data.is_collection == 0 ? false : true,
          });
          self.getProperty1();
          self.getAllProperty1();
          let path = `/pages/goodDetail/goodDetail?id=${self.data.goodId}`;
          common.handleShareUrl(self, path);
          if (self.data.clickButton == true) {
            self.setData({
              isBindPhone: app.globalData.isBindPhone,
            });
          }
          self.setData({
            isSet: self.data.push_status == null ? true : false,
          });
          self.getPv();
          if (
            self.data.detailData.activity_type == 1 &&
            self.data.detailData.seckillItem != null
          ) {
            // 秒杀倒计时
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.seckillItem.start_time,
                self.data.detailData.seckillItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          // 拼团
          if (
            self.data.detailData.activity_type == 2 &&
            self.data.detailData.groupItem != "null"
          ) {
            self.groupTime();
            self.getGroupList();
            self.getAloneProperty(); //单独
            self.getAllAloneProperty(); //所有
            self.getServicekeFu(); //智齿
          }
          //秒杀
          if (self.data.detailData.activity_type == 1) {
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.seckillItem.start_time,
                self.data.detailData.seckillItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          //拼团
          if (self.data.detailData.activity_type == 2) {
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.groupItem.start_time,
                self.data.detailData.groupItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          // 砍价
          if (
            self.data.detailData.activity_type == 3 &&
            self.data.detailData.bargainItem != "null"
          ) {
            let timeIn = setInterval(() => {
              self.timeCountDown(
                self.data.detailData.bargainItem.start_time,
                self.data.detailData.bargainItem.end_time
              );
            }, 1000);
            self.setData({
              timeInterval: timeIn,
            });
          }
          self.getServicekeFu();
          self.getShareInfo();
        }
      }
    );
  },

  // 秒杀倒计时
  timeCountDown(startTime, endTime) {
    var nowTime = Date.parse(new Date());
    // var nowTime = new Date(this.data.detailData.seckillItem.now_time.replace(/-/g, "/")).getTime(); // 现在时间
    var date1 = new Date(startTime.replace(/-/g, "/")).getTime(); // 开始时间
    var date2 = new Date(endTime.replace(/-/g, "/")).getTime(); // 结束时间
    if (nowTime < date1) {
      this.setData({
        skillStatus: 1,
        time: formatTime.skillTwo(date1 - nowTime),
      });
    } else if (nowTime >= date1 && nowTime <= date2) {
      this.setData({
        skillStatus: 2,
        time: formatTime.skillTwo(date2 - nowTime),
      });
    } else if (nowTime > date2) {
      this.setData({
        skillStatus: 3,
      });
      clearInterval(this.data.timeInterval);
    }
  },
  // 所有商品规格
  getAllProperty: function () {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/get-all-property",
      2,
      "",
      {
        item_id: self.data.goodId,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let arr = self.createAllPropertyArr(res.data.data);
          self.setData({
            allPropertyArr: arr,
            allProperty: res.data.data,
            temAllProperty: JSON.parse(JSON.stringify(res.data.data)),
          });
        }
      }
    );
  },
  getAllProperty1() {
    let self = this;
    let arr = self.createAllPropertyArr(self.data.detailData.sku_list);
    self.setData({
      allPropertyArr: arr,
      allProperty: self.data.detailData.sku_list,
      temAllProperty: JSON.parse(JSON.stringify(self.data.detailData.sku_list)),
    });
  },
  // 单独购买的规格
  getAllAloneProperty: function () {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/get-all-property",
      2,
      "",
      {
        item_id: self.data.detailData.meItemActivity.old_item_id,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            aloneAllProperty: res.data.data,
          });
        }
      }
    );
  },
  // 商品规格
  getProperty: function () {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/get-property",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: self.data.goodId,
      },
      "POST",
      false,
      function (res) {
        // console.log(888888,res)
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < res.data.data[i].children.length; j++) {
              res.data.data[i].hasSelect = false;
              res.data.data[i].has = false;

              res.data.data[i].children[j].isSelect = false;
              res.data.data[i].children[j].isCanSelect = true;
              res.data.data[i].children[j].has = true;
            }
          }
          self.setData({
            property: res.data.data,
            temproperty: JSON.parse(JSON.stringify(res.data.data)),
          });
          // console.log(444444,self.data.property)
          let propertyValue = "";
          for (let i = 0; i < res.data.data.length; i++) {
            propertyValue += res.data.data[i].prop_name + " ";
          }
          self.setData({
            propertyValue: propertyValue,
            tempropertyValue: JSON.parse(JSON.stringify(propertyValue)),
          });
          let arr = [];
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push("");
          }
          self.setData({
            selectArr: arr,
            temselectArr: JSON.parse(JSON.stringify(arr)),
          });
        }
      }
    );
  },

  getProperty1: function () {
    let self = this;
    // console.log(7777,self.data.detailData) 
 
    let sku = [
      {
        children:self.data.detailData.sku_list
      }
    ]

    for (let i = 0; i < sku.length; i++) {
      for (let j = 0; j < sku[i].children.length; j++) {
        sku[i].hasSelect = false;
        sku[i].has = false;
        sku[i].children[j].isSelect = false;
        sku[i].children[j].isCanSelect = true;
        sku[i].children[j].has = true;
      }
    }
    self.setData({
      property: sku,
      temproperty: JSON.parse(JSON.stringify(sku)),
    });
    // console.log(555555,self.data.property)
    let propertyValue = "";
    for (let i = 0; i < sku.length; i++) {
      propertyValue += sku[i].prop_name + " ";
    }
    self.setData({
      propertyValue: propertyValue,
      tempropertyValue: JSON.parse(JSON.stringify(propertyValue)),
    });
    let arrSku = [];
    for (let i = 0; i < sku.length; i++) {
      arrSku.push("");
    }
    self.setData({
      selectArr: arrSku,
      temselectArr: JSON.parse(JSON.stringify(arrSku)),
    });
  },
  // 单独商品规格
  getAloneProperty: function () {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/get-property",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: self.data.detailData.meItemActivity.old_item_id,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < res.data.data[i].children.length; j++) {
              res.data.data[i].hasSelect = false;
              res.data.data[i].has = false;
              res.data.data[i].children[j].isSelect = false;
              res.data.data[i].children[j].isCanSelect = true;
              res.data.data[i].children[j].has = true;
            }
          }
          self.setData({
            aloneProperty: res.data.data,
          });
          let propertyValue = "";
          for (let i = 0; i < res.data.data.length; i++) {
            propertyValue += res.data.data[i].prop_name + " ";
          }
          self.setData({
            alonePropertyValue: propertyValue,
          });
          let arr = [];
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push("");
          }
          self.setData({
            aloneSelectArr: arr,
          });
        }
      }
    );
  },
  createAllPropertyArr(data) {
    // console.log(789,data)
    //取出所有的规格值组合 以便之后的查验
    let propArr = [];
    let temp = [];
    //循环取出规格值 并切分为数组
    data.forEach((prop, idx) => {
      if(prop.value_ids==null) {
        // console.log(prop.jxk_sku_id)
        if(prop.jxk_sku_id) {
          temp = prop.jxk_sku_id.split(",");
          propArr.push(temp);
        }
      }else {
        temp = prop.value_ids.split(",");
        propArr.push(temp);
      }
    });
    return propArr;
  },
  //用于计算是否有可用的规格
  calcHasValueId(index, selectArr, propArr, allPropArr, isSelect) {
    // console.log(allPropArr);
    console.log(selectArr);
    let isEnableProp = [];
    let tempArr = [];
    //遍历每一项规格组合
    allPropArr.forEach((propItem, idx) => {
      //判断已选择的规格 和 所有的规格值的每一项 两个之间是否有交集
      tempArr = propItem.filter((item) => {
        return selectArr.includes(item);
      });
      //如果有交集 就推入可用规格数组
      if (tempArr.length > 0) {
        isEnableProp.push(propItem);
      }
      //清空中间变量
      tempArr = [];
    });
    // console.log('自规格',propArr)
    let hasCanUse = [];
    console.log(isEnableProp);
    propArr.forEach((propItem, idx) => {
      //如果目前遍历到的属性 是 点击选择的属性 就将是否选择设为 选择的状态
      if (idx == index) {
        propItem.hasSelect = isSelect;
      }
      propItem.children.forEach((child, idx2) => {
        isEnableProp.forEach((item) => {
          if (child.value_id == item[idx]) {
            child.isCanSelect = true;
          } else {
            child.isCanSelect = false;
          }
        });
      });
      // console.log(propItem)
    });
    //如果没选 清空状态
    let flag = false;
    selectArr.forEach((item) => {
      if (item != "") {
        flag = true;
      }
    });
    if (!flag) {
      propArr.forEach((propItem, idx) => {
        propItem.children.forEach((child, idx2) => {
          child.isCanSelect = true;
        });
      });
    }
    let copy = propArr;
    return copy;
  },
  // 选择规格
  selectValue: function (e) {
    //获取规格值在规格数组中的索引
    // console.log(e);
    let index = e.currentTarget.dataset.index;
    let childrenIndex = e.currentTarget.dataset.childrenindex;
    let isSelect = e.currentTarget.dataset.isselect;
    let has = e.currentTarget.dataset.has;
    if (!has) {
      // console.log(111);
      return;
    }
    let choiceId = this.data.property[index].children[childrenIndex].value_id;
    let selectId = "selectArr[" + index + "]";
    
    //将选择的规格推入数组
    this.setData({
      [selectId]: !isSelect ? choiceId : ""
    });
    //根据获取的索引来改变页面上的选择状态
    let propertyArr = this.data.property;
    propertyArr.forEach((son, idx1) => {
      son.children.forEach((child, idx2) => {
        if (this.data.selectArr.includes(child.value_id)) {
          child.isSelect = true;
        } else {
          child.isSelect = false;
        }
      });
      if(son.children.some(item=>{
        return item.isSelect === true;
      })) {
        // console.log(1111)
      }else {
        // console.log(2222)
        this.setData({
          selectData: ""
        })
      }
      
    });


    this.setData({
      property: propertyArr,
    });
    let selected = this.data.selectArr.join(",");
    // let
    let arrSpe = [];
    this.data.allProperty.forEach((ele, idx) => {
      let arr = ele.value_ids.split(",");
      arr.forEach((x) => {
        if (x == choiceId && !isSelect) {
          let arrSpe2 = arr.filter((x1) => x1 != x);
          let arrSpe3 = arrSpe2.map((x, index) => {
            return {
              value: x,
              stock: ele.stock,
            };
          });
          arrSpe = [...arrSpe, ...arrSpe3];
        }
      });
      if (ele.value_ids == selected) {
        this.setData({
          selectData: this.data.allProperty[idx],
        });
      }
    });
    // console.log(arrSpe)
    arrSpe = this.unique(arrSpe);
    // console.log(arrSpe)
    let tem = this.data.property;
    tem.forEach((ele1, index1) => {
      if (index1 == index) return;
      ele1.children.forEach((ele2, index2) => {
        ele2.has = false;
        if (arrSpe.length == 0) {
          ele2.has = true;
        } else {
          arrSpe.forEach((ele3, index3) => {
            // console.log(ele3)
            if (ele2.value_id == ele3.value) {
              ele2.has = true;
              if (ele3.stock == 0) {
                ele2.has = false;
              }
            }
          });
        }
      });
    });
    // console.log(tem)
    this.setData({
      property: tem,
    });
  
  },
  // 选择规格
  selectValue1: function (e) {
    //获取规格值在规格数组中的索引
    // console.log(e);
    // console.log(this.data.property)
    let index = e.currentTarget.dataset.index;
    let childrenIndex = e.currentTarget.dataset.childrenindex;
    let isSelect = e.currentTarget.dataset.isselect;
    let has = e.currentTarget.dataset.has;
    if (!has) {
      // console.log(111);
      return;
    }
    let choiceId = this.data.property[index].children[childrenIndex].jxk_sku_id;
    let selectId = "selectArr[" + index + "]";
    //将选择的规格推入数组
    this.setData({
      [selectId]: !isSelect ? choiceId : ""
    });
    //根据获取的索引来改变页面上的选择状态
    let propertyArr = this.data.property;
    propertyArr.forEach((son, idx1) => {
      son.children.forEach((child, idx2) => {
        if (this.data.selectArr.includes(child.jxk_sku_id)) {
          child.isSelect = true;
        } else {
          child.isSelect = false;
        }
      });
      if(son.children.some(item=>{
        return item.isSelect === true;
      })) {
        console.log(1111)
      }else {
        console.log(2222)
        this.setData({
          selectData: ""
        })
      }
    });
    this.setData({
      property: propertyArr,
    });
    let selected = this.data.selectArr.join(",");
    // let
    let arrSpe = [];
    for(let i = 0;i<this.data.allProperty.length;i++) {
      let valueIds = []
      valueIds.push(this.data.allProperty[i].jxk_sku_id)
      this.data.allProperty[i].value_ids = valueIds
    }
    
    // console.log(this.data.allProperty)
    this.data.allProperty.forEach((ele, idx) => {
      let arr = ele.value_ids;
      arr.forEach((x) => {
        if (x == choiceId && !isSelect) {
          let arrSpe2 = arr.filter((x1) => x1 != x);
          let arrSpe3 = arrSpe2.map((x, index) => {
            return {
              value: x,
              stock: ele.stock,
            };
          });
          arrSpe = [...arrSpe, ...arrSpe3];
          // console.log(arrSpe);
        }
      });
      if (ele.value_ids == selected) {
        this.setData({
          selectData: this.data.allProperty[idx],
        });
      }
    });
    // console.log(arrSpe)
    arrSpe = this.unique(arrSpe);
    // console.log(arrSpe)
    let tem = this.data.property;
    tem.forEach((ele1, index1) => {
      if (index1 == index) return;
      ele1.children.forEach((ele2, index2) => {
        ele2.has = false;
        if (arrSpe.length == 0) {
          ele2.has = true;
        } else {
          arrSpe.forEach((ele3, index3) => {
            // console.log(ele3)
            if (ele2.value_id == ele3.value) {
              ele2.has = true;
              if (ele3.stock == 0) {
                ele2.has = false;
              }
            }
          });
        }
      });
    });
    // console.log(tem)
    this.setData({
      property: tem,
    });
    // console.log(this.data.property);
    // console.log(this.data.selectData);
  },
  // 数组去重
  unique(array) {
    var temp = []; //一个新的临时数组
    array.forEach((x1) => {
      if (temp.length != 0) {
        let add = true;
        for (var i = 0; i < temp.length; i++) {
          if (x1.value == temp[i].value) {
            add = false;
          }
        }
        if (add) temp.push(x1);
      } else {
        temp.push(x1);
      }
    });
    // console.log(temp);
    return temp;
  },
  // // 选择规格
  // selectValue: function(e) {
  //   //获取所选属性 所在的索引
  //   let index = e.currentTarget.dataset.index;
  //   let childrenIndex = e.currentTarget.dataset.childrenindex;

  //   console.log(index)
  //   console.log(childrenIndex)
  //   console.log(this.data.property)
  //   let newProp = [];
  //   let selectId = 'selectArr[' + index + ']';
  //   let propertyArr = this.data.property;
  //   console.log(propertyArr)
  //   //如果目前选择的属性是
  //   //1.已选择过的 取消选择
  //   //2.未选择过的 选择
  //   if (this.data.selectArr[index] == this.data.property[index].children[childrenIndex].value_id){

  //     this.setData({
  //       [selectId]:""
  //     })
  //     newProp = this.calcHasValueId(index,this.data.selectArr,propertyArr,this.data.allPropertyArr,false)

  //   }else{

  //     this.setData({
  //       [selectId]: this.data.property[index].children[childrenIndex].value_id
  //     })
  //     newProp=this.calcHasValueId(index, this.data.selectArr, propertyArr, this.data.allPropertyArr,true)

  //   }

  //   console.log(this.data.selectArr)

  //   //单纯 进行选取操作
  //   //遍历 规格数组 进行操作
  //   console.log(newProp)
  //   newProp.forEach((item,idx)=>{
  //     item.children.forEach((child,idx2)=>{
  //       //如果
  //       if(this.data.selectArr.includes(child.value_id)){
  //         child.isSelect = true;
  //       }else{
  //         child.isSelect = false;
  //       }
  //     })
  //   })

  //   this.setData({
  //     property: newProp,

  //   })

  //   let selected = this.data.selectArr.join(',');
  //   console.log(selected)

  //   for (let i = 0; i < this.data.allProperty.length; i++) {
  //     if (this.data.allProperty[i].value_ids == selected) {
  //       this.setData({
  //         selectData: this.data.allProperty[i]
  //       })
  //     }
  //   }
  //   console.log(this.data.selectValue)
  // },
  // 购买数量
  changeBuyNum: function (e) {
    this.setData({
      buyNum: e.detail,
    });
  },
  juDgeStart() {
    let self = this;
    let temObject = self.data.detailData;
    if (
      common.compareTime(
        temObject.groupItem.start_time,
        temObject.groupItem.end_time
      ) == 0
    ) {
      wx.showToast({
        title: "拼图未开时",
        icon: "none",
        duration: 2000,
      });
      return false;
    }
  },
  buyNew(e) {
    // console.log(99999,e)
    this.setData({
      isAddShopcar: true,
      isToBuy: true,
      isGroupBuy: true,
      isAloneBuy: true,
    });
    if (app.globalData.isDistr == 1) {
      if (
        this.data.userInfo.role == 0 &&
        (this.data.detailData.is_buy == 1 ||
          (this.data.detailData.is_vip == 1 &&
            this.data.detailData.activity_type == 1) ||
          (this.data.detailData.is_vip == 1 &&
            this.data.detailData.activity_type == 0))
      ) {
        this.update();

        return;
      }
    }
    let self = this; //alone  0 1 拼团 是否自己买  2不是拼团
    if(!this.data.detailData.can_buy) {
      this.data.detailData.can_buy=''
    }
    if (this.data.detailData.can_buy != "") {
      wx.showModal({
        title: "提示",
        content: this.data.detailData.can_buy,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/member/promote/promote",
            });
          } else if (res.cancel) {
          }
        },
      });

      return;
    }
    let alone = e.currentTarget.dataset.alone;
    self.setData({
      alone: alone,
    });
    let buyObject = self.data.detailData;

    if (buyObject.activity_type == 2) {
      if (alone == 0 && self.juDgeStart() == false) {
        return;
      }
    }
    if (this.data.detailData.activity_type == 2) {
      if (this.data.detailData.groupItem.is_join_group == 2) {
        wx.showModal({
          title: "拼团提醒",
          content: "您已经参与团购啦，先去邀请好友满团吧！",
          cancelText: "好的",
          confirmText: "去链接",
          success(res) {
            if (res.confirm) {
              self.spread();
            } else if (res.cancel) {
            }
          },
        });
        return;
      }
    }

    // 拼团单独购买改变规格
    if (alone == 1 || alone == 0) {
      if (alone == 1) {
        // 变普通商品
        this.setData({
          allProperty: this.data.aloneAllProperty,
          property: this.data.aloneProperty,
          propertyValue: this.data.alonePropertyValue,
          selectArr: this.data.aloneSelectArr,
          tem_activity_type: 0,
        });
      } else {
        // 变回拼团商品
        this.setData({
          allProperty: this.data.temAllProperty,
          property: this.data.temproperty,
          propertyValue: this.data.tempropertyValue,
          selectArr: this.data.temselectArr,
          tem_activity_type: 2,
        });
      }
    }

    this.setData({
      isBindPhone: app.globalData.isBindPhone,
      clickButton: true,
    });
    // if (this.data.userInfo.is_invited == 0) {
    //   // this.goInvite()
    //   return
    // }
    if (this.data.isBindPhone === false) {
      this.setData({
        showMoadl: true,
        showBuyBtn: true,
        isScroll: false,
      });
      return;
    }
  },
  // 立即购买 打开选择
  buy: function (e) {
    if (app.globalData.showModal) {
      this.setData({
        isShowModal: app.globalData.showModal,
      });
      return;
    }
    if (this.data.detailData.activity_type != 2) {
      this.setData({
        isAddShopcar: false,
        isToBuy: true,
      });
    } else {
      this.setData({
        isAloneBuy: false,
        isGroupBuy: true,
      });
    }
    if (app.globalData.isDistr == 1) {
      if (
        this.data.userInfo.role == 0 &&
        (this.data.detailData.is_buy == 1 ||
          (this.data.detailData.is_vip == 1 &&
            this.data.detailData.activity_type == 1) ||
          (this.data.detailData.is_vip == 1 &&
            this.data.detailData.activity_type == 0))
      ) {
        this.update();

        return;
      }
    }
    let self = this; //alone  0 1 拼团 是否自己买  2不是拼团
    if (this.data.detailData.can_buy != "") {
      wx.showModal({
        title: "提示",
        content: this.data.detailData.can_buy,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/member/promote/promote",
            });
          } else if (res.cancel) {
          }
        },
      });

      return;
    }
    let alone = e.currentTarget.dataset.alone;
    self.setData({
      alone: alone,
    });
    let buyObject = self.data.detailData;
    if (buyObject.activity_type == 2) {
      if (alone == 0 && self.juDgeStart() == false) {
        return;
      }
    }
    if (this.data.detailData.activity_type == 2) {
      if (this.data.detailData.groupItem.is_join_group == 2) {
        wx.showModal({
          title: "拼团提醒",
          content: "您已经参与团购啦，先去邀请好友满团吧！",
          cancelText: "好的",
          confirmText: "去链接",
          success(res) {
            if (res.confirm) {
              self.spread();
            } else if (res.cancel) {
            }
          },
        });
        return;
      }
    }

    // 拼团单独购买改变规格
    if (alone == 1 || alone == 0) {
      if (alone == 1) {
        // 变普通商品
        this.setData({
          allProperty: this.data.aloneAllProperty,
          property: this.data.aloneProperty,
          propertyValue: this.data.alonePropertyValue,
          selectArr: this.data.aloneSelectArr,
          tem_activity_type: 0,
        });
      } else {
        // 变回拼团商品
        this.setData({
          allProperty: this.data.temAllProperty,
          property: this.data.temproperty,
          propertyValue: this.data.tempropertyValue,
          selectArr: this.data.temselectArr,
          tem_activity_type: 2,
        });
      }
    }

    this.setData({
      isBindPhone: app.globalData.isBindPhone,
      clickButton: true,
    });
    // if (this.data.userInfo.is_invited == 0) {
    //   this.goInvite()
    //   return
    // }
    if (this.data.isBindPhone === false) {
      this.setData({
        showMoadl: true,
        showBuyBtn: true,
        isScroll: false,
      });
      return;
    }
  },
  // 确认够买
  confirmBuy: function () {
    let self = this;
    let buyObject = this.data.detailData;
    if (self.data.detailData.activity_type != 0) {
      // console.log(2222);
      if (self.data.skillStatus == 1) {
        // 秒杀尚未开始
        wx.showToast({
          title: "活动尚未开始",
          icon: "none",
          duration: 1000,
        });
      } else if (self.data.skillStatus == 3) {
        // 秒杀尚未开始
        wx.showToast({
          title: "活动已结束",
          icon: "none",
          duration: 1000,
        });
      } else if (self.data.skillStatus == 2) {
        // 秒杀中
        if (this.data.selectData.stock == 0) {
          wx.showToast({
            title: "库存不足",
            icon: "none",
            duration: 1000,
          });
        } else {
          console.log(3333);
          console.log(this.data.selectData.value_names);

          if (this.data.selectData.value_names) {
            if (this.data.detailData.status == 5) {
              // 砍价
              if (this.data.detailData.activity_type == 3) {
                if (this.data.detailData.bargainItem.is_join_bargain == 2) {
                  wx.showModal({
                    title: "当前商品正在砍价中",
                    content: "快去邀请好友帮忙砍价吧",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url:
                            "/pages/goodDetail/bargainDeatil/bargainDeatil?id=" +
                            self.data.detailData.bargainItem.bargain_id,
                        });
                      }
                    },
                  });
                  return;
                }
                http.HttpRequst(
                  false,
                  "/bargain/me-bargain-api/create-bargain",
                  2,
                  "",
                  {
                    sku_id: self.data.selectData.ivid,
                    token: app.globalData.token,
                    num: self.data.buyNum,
                  },
                  "POST",
                  false,
                  function (res) {
                    if (res.data.errcode == 0) {
                      wx.navigateTo({
                        url:
                          "/pages/goodDetail/bargainDeatil/bargainDeatil?id=" +
                          res.data.data.id,
                      });
                    }
                  }
                );
              } else {
                // 其他
                let orderData = this.data.detailData;
                orderData.selectData = this.data.selectData;
                orderData.buy_num = this.data.buyNum;
                app.globalData.oneOrder = orderData;
                // 拼团  改变状态
                if (this.data.tem_activity_type != -1) {
                  orderData.activity_type = this.data.tem_activity_type;
                }
                wx.navigateTo({
                  url:
                    "/pages/goodDetail/confirmOrder/confirmOrder?from=gooddetail" +
                    "&group_id=" +
                    this.data.group_team_id + "&invitationCode=" + this.data.invitationCode,
                });
                this.setData({
                  showMoadl: false,
                });
              }
            } else if (this.data.detailData.status == 7) {
              wx.showToast({
                title: "该商品已下架",
                icon: "none",
                duration: 1000,
              });
            } else {
              wx.showToast({
                title: "无法购买该商品",
                icon: "none",
                duration: 1000,
              });
            }
          } else {
            wx.showToast({
              title: "请选择规格",
              icon: "none",
              duration: 1000,
            });
          }
        }
      } else if (nowTime > date2) {
        wx.showToast({
          title: "秒杀已结束",
          icon: "none",
          duration: 1000,
        });
      }
    } else {
      // console.log(1111);
      // 不是秒杀
      if (this.data.selectData.stock == 0) {
        wx.showToast({
          title: "库存不足",
          icon: "none",
          duration: 1000,
        });
      } else {
        if (this.data.selectData.value_names) {
          if (this.data.detailData.status == 5) {
            // 其他
            let orderData = this.data.detailData;
            orderData.selectData = this.data.selectData;
            orderData.buy_num = this.data.buyNum;
            app.globalData.oneOrder = orderData;
            // 拼团  改变状态
            if (this.data.tem_activity_type != -1) {
              orderData.activity_type = this.data.tem_activity_type;
            }
            wx.navigateTo({
              url:
                "/pages/goodDetail/confirmOrder/confirmOrder?from=gooddetail" +
                "&group_id=" +
                this.data.group_team_id + "&invitationCode=" + this.data.invitationCode,
            });
            this.setData({
              showMoadl: false,
            });
          } else if (this.data.detailData.status == 7) {
            wx.showToast({
              title: "该商品已下架",
              icon: "none",
              duration: 1000,
            });
          } else {
            wx.showToast({
              title: "无法购买该商品",
              icon: "none",
              duration: 1000,
            });
          }
        } else {
          wx.showToast({
            title: "请选择规格",
            icon: "none",
            duration: 1000,
          });
        }
      }
    }
  },
  // 显示选择框
  addShopCar: function () {
    // console.log(787878,this.data.detailData.can_buy)
    if (app.globalData.showModal) {
      this.setData({
        isShowModal: app.globalData.showModal,
      });
      return;
    }
    this.setData({
      isAddShopcar: true,
      isToBuy: false,
    });
    if (app.globalData.isDistr == 1) {
      if (
        this.data.userInfo.role == 0 &&
        (this.data.detailData.is_buy == 1 ||
          (this.data.detailData.is_vip == 1 &&
            this.data.detailData.activity_type == 1) ||
          (this.data.detailData.is_vip == 1 &&
            this.data.detailData.activity_type == 0))
      ) {
        this.update();

        return;
      }
    }
    
    if (this.data.detailData.can_buy != "") {
      wx.showToast({
        title: this.data.detailData.can_buy,
        icon: "none",
        duration: 2000,
      });
      return;
    }
    this.setData({
      isBindPhone: app.globalData.isBindPhone,
      clickButton: true,
    });
    // if (this.data.userInfo.is_invited == 0) {
    //   this.goInvite()
    //   return
    // }
    if (this.data.isBindPhone === false) {
      this.setData({
        showMoadl: true,
        showBuyBtn: false,
        isScroll: false,
      });
      return;
    }
  },
  cloosePhone() {
    this.setData({
      isBindPhone: false
    })
  },
  // 素材
  goMaterial() {
    this.setData({
      currentIndex: 1,
    });
  },
  // 加入购物车
  confirmAdd: function () {
    let self = this;
    if (self.data.skillStatus == 1) {
      // 秒杀尚未开始
      wx.showToast({
        title: "活动尚未开始",
        icon: "none",
        duration: 1000,
      });
    } else if (self.data.skillStatus == 3) {
      // 秒杀尚未开始
      wx.showToast({
        title: "活动已结束",
        icon: "none",
        duration: 1000,
      });
    } else {
      if (self.data.selectData.stock == 0) {
        wx.showToast({
          title: "库存不足",
          icon: "none",
          duration: 1000,
        });
      } else {
        if (self.data.selectData.value_names) {
          if (self.data.detailData.status == 5) {
            http.HttpRequst(
              true,
              "/item/me-cart-api/create",
              2,
              "",
              {
                token: app.globalData.token,
                ivid: self.data.selectData.ivid,
                num: self.data.buyNum,
              },
              "POST",
              false,
              function (res) {
                if (res.data.errcode == 0) {
                  wx.showToast({
                    title: "加入成功",
                    icon: "success",
                    duration: 1000,
                  });
                  setTimeout(() => {
                    self.setData({
                      showMoadl: false,
                      showBuyBtn: false,
                      isScroll: true,
                    });
                  }, 1000);
                }
              }
            );
          } else if (self.data.detailData.status == 7) {
            wx.showToast({
              title: "该商品已下架",
              icon: "none",
              duration: 1000,
            });
          } else {
            wx.showToast({
              title: "无法购买该商品",
              icon: "none",
              duration: 1000,
            });
          }
        } else {
          wx.showToast({
            title: "请选择规格",
            icon: "none",
            duration: 1000,
          });
        }
      }
    }
  },
  // 增加购买数量
  addNum: function () {
    if (this.data.selectData == "") {
      wx.showToast({
        title: "请选择规格",
        icon: "none",
        duration: 1000,
      });
    } else {
      let num = Number(this.data.buyNum);
      if (
        this.data.detailData.activity_type == 1 ||
        this.data.detailData.activity_type == 2
      ) {
        if (this.canAdd()) {
          return;
        }
      }

      num += 1;
      if (num >= this.data.selectData.stock) {
        num = this.data.selectData.stock;
        wx.showToast({
          title: "已至最大库存",
          icon: "none",
          duration: 1000,
        });
      }
      this.setData({
        buyNum: num,
      });
    }
  },
  // 减少购买数量
  reduce: function () {
    this.setData({
      notAdd: false,
    });
    if (this.data.selectData == "") {
      wx.showToast({
        title: "请选择规格",
        icon: "none",
        duration: 1000,
      });
    } else {
      let num = Number(this.data.buyNum);
      num -= 1;
      if (num <= 1) {
        num = 1;
      }
      this.setData({
        buyNum: num,
      });
    }
  },
  // 输入购买数量
  changeNum: function (e) {
    if (this.data.selectData == "") {
      this.setData({
        buyNum: 1,
      });
      wx.showToast({
        title: "请选择规格",
        icon: "none",
        duration: 1000,
      });
    } else {
      let num = e.detail.value;
      if (num >= parseInt(this.data.selectData.stock)) {
        num = this.data.selectData.stock;
        wx.showToast({
          title: "已至最大库存",
          icon: "none",
          duration: 1000,
        });
      } else if (num <= 1) {
        num = 1;
        wx.showToast({
          title: "购买数量不能小于1",
          icon: "none",
          duration: 1000,
        });
      }
      this.setData({
        buyNum: num,
      });
    }
  },
  // 关闭选择
  closeModal: function () {
    this.setData({
      showMoadl: false,
      isScroll: true,
      group_team_id: false, //取消就取消 id
    });
  },
  // 显示服务描述
  showService: function (e) {
    let self = this;
    let type = e.currentTarget.dataset.type;
    let buyObject = self.data.detailData;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0,
    });
    animation.height(400).step();
    if (type == 1) {
      if (
        buyObject.stock == 0 ||
        (buyObject.activity_type == 2 &&
          Number(buyObject.stock) < Number(buyObject.groupItem.number))
      ) {
        wx.showToast({
          title: "库存不足",
          icon: "none",
          duration: 2000,
        });
        return;
      }
    }
    if (buyObject.activity_type == 2) {
      if (this.juDgeStart() == false) {
        return;
      }
    }

    // 拼团文案
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        launchGroup: true,
      });
    }

    this.setData({
      serviceDes: true,
      isScroll: false,
    });
  },
  // 关闭服务描述
  closeServiceModal: function () {
    if (this.data.launchGroup) {
      this.setData({
        launchGroup: false,
      });
    }
    this.setData({
      serviceDes: false,
      isScroll: true,
    });
  },
  // 跳转上传素材
  uploadMaterail() {
    wx.navigateTo({
      url:
        "/pages/goodDetail/uploadMaterial/uploadMaterial?id=" +
        this.data.goodId,
    });
  },
  // pv
  getPv() {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/add-item-click",
      2,
      "",
      {
        shop_id: self.data.detailData.shop.id,
        item_id: self.data.goodId,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
        }
      }
    );
  },
  // 预览商品图片
  previewBanner: function (e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.detailData.itemImgs != "") {
      wx.previewImage({
        current: this.data.detailData.itemImgs[index], // 当前显示图片的http链接
        urls: this.data.detailData.itemImgs, // 需要预览的图片http链接列表
      });
    }
  },
  // 预览素材图片
  previewMaterial: function (e) {
    let index = e.currentTarget.dataset.index;
    let imgIndex = e.currentTarget.dataset.imgindex;
    if (this.data.materialData.list[index].imgs != "") {
      wx.previewImage({
        current: this.data.materialData.list[index].imgs[imgIndex], // 当前显示图片的http链接
        urls: this.data.materialData.list[index].imgs, // 需要预览的图片http链接列表
      });
    }
  },
  jumpCar() {
    wx.navigateTo({
      url: "/pages/goodDetail/shopCarCopy/shopCarCopy",
    });
  },
  // 选择底部tab
  selectTab(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.tabIndex) {
      return;
    } else {
      this.setData({
        tabIndex: index,
      });
    }
  },
  // 官方素材 我的素材
  selectMaterial(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.materialIndex) {
      return;
    } else {
      this.setData({
        materialIndex: index,
        materialPage: 0,
        materialScrollTop: 0,
      });
      let status = "";
      if (this.data.materialIndex == 0) {
        status = 1;
      } else {
        status = 2;
      }
      this.getMaterial(status);
    }
  },
  // 素材
  getMaterial(status) {
    let self = this;
    http.HttpRequst(
      false,
      "/stuff/item-material-api/item-list",
      2,
      "",
      {
        token: app.globalData.token,
        start_page: self.data.materialPage,
        pages: 10,
        item_id: self.data.goodId,
        use_type: status,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].rich_text = self.replaceRich(
              res.data.data.list[i].rich_text
            );
          }
          self.setData({
            materialData: res.data.data,
          });
        }
      }
    );
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
    wx.setClipboardData({
      data: this.data.materialData.list[index].rich_text,
      success(res) {
        wx.getClipboardData({
          success(res) {},
        });
      },
    });
  },
  //
  copyInfoTwo: function () {
    wx.setClipboardData({
      data: this.data.detailData.title,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: "已经复制文案",
              icon: "none",
              duration: 2000,
            });
          },
        });
      },
    });
  },
  // 顶部tab
  selectTopTab(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.currentIndex == index) {
      return;
    } else {
      this.setData({
        currentIndex: index,
      });
      if (index == 1) {
        this.data.commentData;
        if (this.data.commentData == "") {
          this.getCommontList();
        }
      }
      // if (index == 2) {
      //   (this.data.commentData)
      //   if (this.data.commentData == '') {
      //     this.getCommontList()
      //   }
      // } else if (index == 1) {
      //   if (this.data.materialData == '') {
      //     let status = '';
      //     if (this.data.materialIndex == 0) {
      //       status = 1;
      //     } else {
      //       status = 2;
      //     }
      //     this.getMaterial(status);
      //   }
      // }
    }
  },
  // 选择view
  changeView(e) {
    let index = e.detail.current;
    this.setData({
      currentIndex: index,
    });
    if (index == 2) {
      if (index == 2) {
        if (this.data.commentData == "") {
          this.getCommontList();
        }
      } else if (index == 1) {
        if (this.data.materialData == "") {
          let status = "";
          if (this.data.materialIndex == 0) {
            status = 1;
          } else {
            status = 2;
          }
          this.getMaterial(status);
        }
      }
    }
  },
  tuiguang() {
    wx.navigateTo({
      url: "/pages/goodDetail/share/share?id=" + this.data.goodId,
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
  // 分享素材
  getShareInfo(e) {
    const self = this;
    const id = this.data.detailData.item_id;
    http.HttpRequst(
      false,
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
          const shareInfo = res.data.data[0];
          shareInfo.path =
            "/pages/goodDetail/goodDetail?id=" + self.data.detailData.item_id;
          shareInfo.query = "id=" + self.data.detailData.item_id;
          self.setData({
            shareInfo: shareInfo,
          });
        }
      }
    );
  },
  // 获取评论列表
  getCommontList: function () {
    let self = this;
    http.HttpRequst(
      true,
      "/item/me-commet-api/index",
      2,
      "",
      {
        start_page: 0,
        pages: 10,
        item_id: self.data.goodId,
        flag: this.data.isImgIndex,
        level: 4,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            commentData: res.data.data,
          });
          let imgTab = self.data.isImg;
          if (self.data.isImgIndex == 0) {
            imgTab[0].num = res.data.data.total_pages;
          }
          imgTab[1].num = res.data.data.pic_commet_num;
          self.setData({
            isImg: imgTab,
          });
        }
      }
    );
  },
  // 选择无图 有图
  selectisImg(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.isImgIndex) {
      return;
    } else {
      this.setData({
        isImgIndex: index,
      });
      this.getCommontList();
    }
  },
  // 图片预览
  previewImg: function (e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let imgindex = e.currentTarget.dataset.imgindex;
    let urls = [];
    for (
      let i = 0;
      i < self.data.commentData.list[index].meCommetImgs.length;
      i++
    ) {
      urls.push(self.data.commentData.list[index].meCommetImgs[i]);
    }
    wx.previewImage({
      current: self.data.commentData.list[index].meCommetImgs[imgindex], // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    });
  },
  // 加载更多
  loadMoreComment: function () {
    let self = this;
    let pages = self.data.commentPage + 1;
    if (pages > Math.ceil(self.data.commentData.total_pages / 10) - 1) {
      return false;
    } else {
      self.setData({
        commentPage: pages,
      });
      http.HttpRequst(
        true,
        "/item/me-commet-api/index",
        2,
        "",
        {
          start_page: self.data.commentPage,
          pages: 10,
          item_id: self.data.goodId,
          flag: self.data.isImgIndex,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "commentData.list";
            let list = res.data.data.list;
            let newListData = self.data.commentData.list.concat(list);
            self.setData({
              [listData]: newListData,
            });
          }
        }
      );
    }
  },
  // 加载更多素材
  loadMoreMaterail() {
    let self = this;
    let pages = self.data.materialPage + 1;
    if (pages > Math.ceil(self.data.materialData.total_pages / 10) - 1) {
      return false;
    } else {
      self.setData({
        materialPage: pages,
      });
      let status = "";
      if (self.data.materialPage == 0) {
        status = 1;
      } else {
        status = 2;
      }
      http.HttpRequst(
        true,
        "/stuff/item-material-api/item-list",
        2,
        "",
        {
          token: app.globalData.token,
          start_page: self.data.materialPage,
          pages: 10,
          item_id: self.data.goodId,
          use_type: status,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              res.data.data.list[i].rich_text = self.replaceRich(
                res.data.data.list[i].rich_text
              );
            }
            let list = res.data.data.list;
            let listData = "materialData.list";
            let newListData = self.data.materialData.list.concat(list);
            self.setData({
              [listData]: newListData,
            });
          }
        }
      );
    }
  },
  // 查看更多评价
  lookMoreComment() {
    this.setData({
      currentIndex: 2,
    });
  },
  // 获取上级信息
  getSuperUser() {
    let self = this;
    if (self.data.shareCode) {
      http.HttpRequst(
        false,
        "/hand/fans-api/create-fans",
        2,
        "",
        {
          token: app.globalData.token,
          share_code: self.data.shareCode,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            // self.fans();
          }
        }
      );
    }
  },
  // 生成上下级 粉丝
  fans() {
    let self = this;
    http.HttpRequst(
      false,
      "/hand/fans-api/create-fans-from-share",
      2,
      "",
      {
        token: app.globalData.token,
        puid: self.data.uid,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
        }
      }
    );
  },
  getPhone() {
    let self = this;
    http.HttpRequst(
      false,
      "/base/intel-api/info",
      2,
      "",
      {},
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            platformPhone: res.data.data.liemi_intel_tel,
          });
        }
      }
    );
  },
  // 拨打电话
  makePhone() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.platformPhone, // 仅为示例，并非真实的电话号码
    });
  },
  // 返回
  jumpBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  jumpBack1() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  jumpSerch: function () {
    wx.navigateTo({
      url: "/pages/class/serch/serch",
    });
  },
  jumpGoodReviews(e) {
    wx.navigateTo({
      url: `/pages/goodReviews/goodReviews?id=${this.data.goodId}&level=${this.data.detailData.total_level}`,
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
  // 获取用户身份
  getUserInfo() {
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
            isShowModal: app.globalData.showModal,
          });
          if (self.data.userInfo.role == 0) {
            self.setData({
              topTab: [
                {
                  title: "商品",
                },
                {
                  title: "评价",
                },
              ],
            });
          } else {
            self.setData({
              topTab: [
                {
                  title: "商品",
                },
                // {
                //   title: '素材'
                // },
                {
                  title: "评价",
                },
              ],
            });
          }
          if(self.data.shopId==249) {
            // console.log("是京小康")
            self.getDetail1();
          }else{
            // console.log("不是京小康")
            self.getDetail();
          }
          app.globalData.userInfo = res.data.data;
        }
      }
    );
  },
  // 监听滚动高度
  scrollTop(e) {
    if (e.detail.scrollTop > 50) {
      this.setData({
        showBar: false,
        bgColor: "#fff",
      });
    }
    if (e.detail.scrollTop < 50) {
      this.setData({
        showBar: true,
        bgColor: "",
      });
    }
    // if (e.detail.scrollTop > 175) {
    //   this.setData({
    //     isChange: true
    //   })
    //   wx.setNavigationBarColor({
    //     frontColor: '#000000',
    //     backgroundColor: '#ffffff'
    //   })
    // } else {
    //   this.setData({
    //     isChange: false
    //   })
    //   wx.setNavigationBarColor({
    //     frontColor: '#ffffff',
    //     backgroundColor: '#1D1E1F'
    //   })
    // }
  },
  // 删除素材
  deleteMaterial(e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    http.HttpRequst(
      false,
      "/stuff/item-material-api/del",
      2,
      "",
      {
        token: app.globalData.token,
        material_id: id,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: "删除成功",
            icon: "success",
            duration: 1000,
          });
          setTimeout(() => {
            self.getMaterial(2);
          }, 1000);
        }
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
    this.setData({
      isScroll: true,
    });
    if (this.data.clickButton == true) {
    }

    if (this.data.currentIndex == 1 && this.data.materialIndex == 1) {
      this.getMaterial(2);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timeInterval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timeInterval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  onPageScroll: function (res) {
    // if(res.scrollTop>60){
    //   this.setData({
    //     showBar:false
    //   })
    // }
    // if(res.scrollTop<100){
    //   this.setData({
    //     showBar: true
    //   })
    // }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareInfo.title,
      imageUrl: this.data.detailData.itemImgs[0],
      path: '/pages/goodDetail/goodDetail?back=1&shop_id=' + this.data.shopId + '&id=' + this.data.goodId,
    };
  },
  // onShareTimeline: function () {
  //   return {
  //     title: this.data.shareInfo.title,
  //     imageUrl: this.data.detailData.itemImgs[0],
  //     // query: this.data.shareInfo.query + '&back=1&shop_id=' + this.data.shopId,
  //     query: 'id=' + this.data.goodId + '&back=1&shop_id=' + this.data.shopId,
  //   };
  // },
  // 跳转店铺详情
  jumpShopDetail(e) {
    let pages = getCurrentPages()
    let page = pages.find((m)=>m.route==="pages/shop/shopDetail/shopDetail")
    if(page===undefined) {
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: "/pages/shop/shopDetail/shopDetail?id=" + id,
      });
    }else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  // 优惠券
  // 打开优惠券
  showCoupon: function () {
    if (this.data.couponListData.list.length == 0) {
      wx.showToast({
        title: "暂无可用的优惠券",
        icon: "none",
        duration: 1000,
      });
    } else {
      this.setData({
        couponModal: true,
      });
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 500,
        timingFunction: "ease",
        delay: 0,
      });
      animation.height(400).step();
      this.setData({
        contentShow: true,
        animationData: animation.export(),
      });
    }
  },
  // 关闭优惠券
  closeCouponModal: function () {
    this.setData({
      couponModal: false,
    });
  },

  // 获取店铺优惠券
  getCouponeList() {
    let self = this;
    http.HttpRequst(
      false,
      "/coupon/coupon-templet-api/item-index",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: self.data.goodId,
        scenario: "item",
        start_page: self.data.couponStartPage,
        pages: 9999,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let couponListShow = false;
          res.data.data.list.forEach((x) => {
            if (x.is_accept == 0) {
              couponListShow = true;
            }
          });

          self.setData({
            couponListData: res.data.data,
            couponListShow: couponListShow,
          });
        }
      }
    );
  },
  //加载更多优惠券
  loadMoreCoupon() {
    let self = this;
    let pages = self.data.couponStartPage + 1;
    if (pages > Math.ceil(self.data.couponListData.total_pages / 10) - 1) {
      // console.log('加载完了')
      return false;
    } else {
      self.setData({
        couponStartPage: pages,
      });
      http.HttpRequst(
        true,
        "/coupon/coupon-templet-api/item-index",
        2,
        "",
        {
          token: app.globalData.token,
          item_id: self.data.goodId,
          scenario: "item",
          start_page: self.data.couponStartPage,
          pages: 10,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let listData = "couponListData.list";
            let list = res.data.data.list;
            let newList = self.data.couponListData.list.concat(
              res.data.data.list
            );
            self.setData({
              [listData]: newList,
            });
          }
        }
      );
    }
  },
  // 获取店铺优惠券
  getShopCoupon(e) {
    let self = this;
    var id = e.currentTarget.id;
    http.HttpRequst(
      true,
      "/coupon/coupon-templet-api/receive",
      2,
      "",
      {
        token: app.globalData.token,
        ctid: id,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: "领取成功",
            icon: "none",
            duration: 1000,
          });
          self.getCouponeList();
        }
      }
    );
  },

  // 获取商品活动列表
  getActivityList() {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/activity-banner-list",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: self.data.goodId,
        start_page: 0,
        pages: 10,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            activityList: res.data.data,
          });
        }
      }
    );
  },

  // 打开活动弹窗
  showActivity: function () {
    this.setData({
      activityModal: true,
    });
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0,
    });
    animation.height(400).step();
    this.setData({
      contentShow: true,
      animationData: animation.export(),
    });
  },

  // 关闭活动弹窗
  closeActivityModal: function () {
    this.setData({
      activityModal: false,
    });
  },

  // 分享到微信&朋友圈弹窗
  showShare: function () {
    this.setData({
      shareModal: true,
    });
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0,
    });
    animation.height(200).step();
    this.setData({
      contentShow: true,
      animationData: animation.export(),
    });
  },

  // 关闭分享到微信&朋友圈弹窗
  closeShareModal: function () {
    this.setData({
      shareModal: false,
    });
  },

  // 跳转商品详情
  jumpGoodDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goodDetail/goodDetail?id=" + id,
    });
  },
  groupTime() {
    let self = this;
    let temObject = self.data.detailData;
    if (temObject.activity_type == 2 && temObject.groupItem != "null") {
      if (
        common.compareTime(
          temObject.groupItem.start_time,
          temObject.groupItem.end_time
        ) == 1 ||
        common.compareTime(
          temObject.groupItem.start_time,
          temObject.groupItem.end_time
        ) == 0
      ) {
        var second;
        if (
          common.compareTime(
            temObject.groupItem.start_time,
            temObject.groupItem.end_time
          ) == 1
        ) {
          second =
            (new Date(
              temObject.groupItem.end_time.replace(/-/g, "/")
            ).getTime() -
              new Date(
                temObject.groupItem.now_time.replace(/-/g, "/")
              ).getTime()) /
            1000;
        }
        if (
          common.compareTime(
            temObject.groupItem.start_time,
            temObject.groupItem.end_time
          ) == 0
        ) {
          second =
            (new Date(
              temObject.groupItem.start_time.replace(/-/g, "/")
            ).getTime() -
              new Date(
                temObject.groupItem.now_time.replace(/-/g, "/")
              ).getTime()) /
            1000;
        }
        if (self.data.groupSecondTime != false) {
          clearInterval(self.data.groupSecondTime);
        }
        self.data.groupSecondTime = setInterval(() => {
          if (second <= 0) {
            clearInterval(self.data.groupSecondTime);
            return;
          }
          second--;
          self.setData({
            groupSecond: second,
          });
        }, 1000);
      }
    }
  },
  //拼团团队列表
  getGroupList() {
    let self = this;
    common.getgoodsList(
      self,
      "/item/me-group-team-api/index",
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        item_id: self.data.goodId,
      },
      "gropTeamList"
    );
  },
  saveId(e) {
    let self = this;
    self.setData({
      group_team_id: e.detail.id,
    });
    self.buy(e);
  },
  // 富文本
  getContent() {
    let self = this;
    common.getContent(self, 38, "groupContent", function (res) {
      if(res!=null) {
        self.setData({
          contentTitle: res.title,
        });
      }
    });
  },
  // 立即推广
  spread() {
    let self = this;
    http.HttpRequst(
      true,
      "/order/order-api/create-spread-order",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: self.data.goodId,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let temValue = "detailData.groupItem.is_join_group";
          self.setData({
            [temValue]: 2,
          });
          wx.redirectTo({
            url:
              "/pages/assemble/joinGroup/joinGroup?type=2" +
              "&group_team_id=" +
              res.data.data.group_team_id,
          });
        }
      }
    );
  },
  remindMe() {
    let self = this;
    http.HttpRequst(
      true,
      "/item/me-activity-push-api/push",
      2,
      "",
      {
        token: app.globalData.token,
        item_id: self.data.goodId,
        type: self.data.push_status != null ? "1" : "0",
        activity_type: 2,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: self.data.push_status == null ? "设置成功" : "取消成功",
            icon: "none",
            duration: 2000,
          });
          if (self.data.push_status == null) {
            self.setData({
              push_status: 1,
            });
          } else {
            self.setData({
              push_status: null,
            });
          }
          app.globalData.setRemined = true;
        }
      }
    );
  },
  getServicekeFu() {
    let self = this;
    common.servicekeFu(self, self.data.shop_id, self.data.goodId, 1, function (
      res
    ) {
      self.setData({
        params: JSON.stringify(res.param),
        transferAction: res.transferAction,
      });
    });
  },
  update() {
    wx.showModal({
      title: "提示",
      content: "您还不是分销员，成为分销员即可享受专属折扣和更多福利",
      confirmText: "成分销员",
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "/pages/member/promote/promote",
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      },
    });
  },
  goInvite() {
    wx.showModal({
      title: "提示",
      content: "填写邀请码才能购买",
      confirmText: "填邀请码",
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "/pages/bindInviteCode/bindInviteCode",
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      },
    });
  },
  onImageSwiperChanged(e) {
    const detail = e.detail;
    this.setData({
      imageSwiperCurrentIndex: detail.current,
    });
  },
  scrollToTop() {
    this.setData({
      toView: 0,
    });
  },
});
