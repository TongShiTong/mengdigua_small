// pages/goodDetail/confirmOrder/confirmOrder.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
const md5 = require('../../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowShopIndex: 0,
    card_no: "", //身份证
    card_name: "", //姓名
    order_type: 1, //1普通 9 拼团 10 砍价
    totalPriceTwo: 0, //总价2 去邮费 去秒杀
    password: "", //余额支付密码
    show: false,
    payOne: true,
    inputData: {
      input_value: "", //输入框的初始内容
      value_length: 0, //输入框密码位数
      isNext: false, //是否有下一步的按钮
      get_focus: true, //输入框的聚焦状态
      focus_class: true, //输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6], //输入框格子数
      height: "98rpx", //输入框高度
      width: "604rpx", //输入框宽度
      see: false, //是否明文展示
      interval: true, //是否显示间隔格子
    },
    pay_amount: 0, //支付的 余额
    theme: false,
    couponStartPage: 0,
    oneOrderDetail: '', // 从商品详情或者礼包详情跳转过来的商品数据
    shopcarOrder: '', // 从购物车跳转过来的商品数据
    totalPrice: '', // 总价 会随使用优惠券 积分而变化
    subtotal: '', // 总价 不会变化
    detailAddress: '', // 地址详情
    isUse: false, // 是否使用积分 false 不实用 true使用
    isUsePirce: false, // 是否使用余额 false 不实用 true使用
    jumpFrom: '', // 从哪个页面跳转过来 gooddetail giftdetail shopcar
    isEmpty: true, // 是否是空地址
    addressData: '', // 地址信息
    message: '', // 买家留言
    orderData: '', // 下单后的订单数据 接口返回pay_order_no  pay_amount
    pay: [{
      img: "/images/confirm/weixinzhifu.png",
      title: '微信支付',
    }], // 默认微信支付
    payIndex: 0, // 选择支付的索引
    invoiceInfo: '', // 发票信息
    yuCouponNum: '', // 积分和优惠券数量
    disPrice: 0, // 使用积分扣除的钱
    userCoinPrice: 0, // 使用积分扣除的钱
    couponPrice: 0, // 使用优惠券的金额
    couponList: '', // 优惠券列表
    couponListPlat: false, // 平台优惠券列表
    selectedCoupon: '', // 选中的优惠券
    couponLen: 0, // 可用的优惠券长度
    // startPage: 0,
    couponModal: false, // 弹出选择优惠券的框
    totalNum: 0, // 共计多少件商品
    isShowModal: false, // 授权弹窗
    sections: [], //结果
    inWay: 0, //默认购物车进入 //其他
    shopCouponShow: false, //优惠券展示
    spikeBalanceShow: false, //余额是否展示
    hasSpike: false, //购物车有秒杀商品
    couponTotal: 0, //优惠券共减金额
    group_team_id: "",
    is_abroad: 0, //是否跨境购
    fareModelIds: [], //运费模板ids
    addressId: null, //地址id
    canBuy: true, //是否可以购买
    formatIds: [], //规格 数组
    buyOnce: true, //只能买一次
    goType: 1, // 1  2 拼团  别的其他
    ividList: [], //规格id数组
    rebate: "", //返利 金额
    cut_price: 0, //砍价的钱
    is_commission: 1, // 是否可以分润，默认是 0 否 1是
    totalPostage: 0,
    isUseCard: false, //是否使用购物卡 默认false 否  
    card_pay_amount: 0,
    shopCouponData: false,
    shopCouponNowIndex:[],//每个店铺下目前选择的店铺优惠券
    shopCouponLastIndex:[],//每个店铺下上一次选择的店铺优惠券
    platCouponShow:false,//平台优惠券是否可用
    platCouponSelected:false,//平台优惠券 是否被选择
    platCouponMaxIndex:0 ,//平台优惠券 最大值的索引
    platCouponNowIndex:false,
    handInfo: {},
    isStore: false,
    isOnSite: 0,
    extension_code: '',
    merchant_code: '',
    isModel: false,
    invitationCode:'', // 邀请码
    temporaryCode: '' //优惠码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      invitationCode: options.invitationCode,
      temporaryCode: app.globalData.temporaryCode
    })
    common.loadTheme(this)
    if (options.group_id && options.group_id != 'false') {
      this.setData({
        group_team_id: options.group_id
      })
    }
    if (options.from) {
      // jumpFrom 获取从哪个页面跳转过来
      this.setData({
        jumpFrom: options.from
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      is_show_shop:app.globalData.is_show_shop
    })
    // console.log(77777,app.globalData.userInfo)
    // 是否需要弹授权弹窗
    this.setData({
      isShowModal: app.globalData.showModal,
    })
    if (this.data.userInfo.is_hand == 1) {
      this.getHandInfo(); //获取推手信息
    }
    if (app.globalData.orderAddress) {
      var str = app.globalData.orderAddress.full_name.split(" ");
      this.setData({
        addressData: app.globalData.orderAddress,
        addressId: app.globalData.orderAddress.maid,
        isEmpty: true,
        detailAddress: str[1]
      })

      setTimeout(() => {
        
        this.getSendArea()
        this.getPostageModel();
      }, 1000)
    } else {
      setTimeout(() => {
        this.getDefaultAddress();
      }, 1000)
    }
    this.getTotalCoupon();//获取全部优惠券
    setTimeout(()=>{
      this.judgeDirection(); //判断走向
      setTimeout(() => {
        this.calcBalance();
      }, 1000)
    },1000)
    
    // this.getCouponeListPlat(); //获取店铺优惠券
    // this.getCouponeList(); // 获取平台优惠券及长度
    // this.countCouponLen();
  },

  useStore(e) {
    let store = e.detail.value
    if(store) {
      this.setData({
        isStore: store,
        isOnSite: 1
      })
    }else{
      this.setData({
        isStore: store,
        isOnSite: 0
      })
    }
    // console.log(147,e)
    // console.log(148,this.data.isStore,this.data.isOnSite)
  },

  // 推荐码填写
  bindCode(e) {
    this.setData({
      extension_code: e.detail.value
    })
  },
  bindMerchantCode(e) {
    this.setData({
      merchant_code: e.detail.value
    })
  },
  //判断走向
  judgeDirection() {
    // 砍价
    if (this.data.jumpFrom == "bargain") {
      // 数据处理
      console.log(111444,app.globalData.oneOrder)
      let temObject = app.globalData.oneOrder
      temObject = {
        ...temObject,
        buy_num: 1,
        title: temObject.item.title,
        display_price: false,
        selectData: {
          img_url: temObject.item.img_url,
          value_names: temObject.sku_name,
          price: temObject.item.start_price,
          ivid: temObject.sku_id,
        }
      }
      temObject.buy_num = 1;
      this.setData({
        inWay: 4,
        order_type: 10,
        cut_price: temObject.cut_price,
        totalPrice: temObject.item.end_price,
        subtotal: temObject.item.end_price,
        startPrice: temObject.item.start_price,
        disPrice: temObject.has_cut_price,
        spikeBalanceShow: true,
        oneOrderDetail: temObject,
        rebate: temObject.share,
        is_abroad: Number(temObject.is_abroad),
        is_commission: temObject.item.is_commission
      })
      // num: self.data.oneOrderDetail.buy_num,
      //   item_id: self.data.oneOrderDetail.item_id
    }

    // 除了礼包都展示 余额
    if (this.data.jumpFrom == 'giftdetail') {
      this.setData({
        spikeBalanceShow: false
      })
    } else {
      this.setData({
        spikeBalanceShow: true
      })
    }
    // 从商品详情或者礼包详情跳转过来

    if (this.data.jumpFrom == 'gooddetail' || this.data.jumpFrom == 'giftdetail') {
      // 获取从商品详情或者礼包详情跳转过来的商品数据
      let shopListTwo = []
      let price;
      if(this.data.temporaryCode) {
        price = Number(app.globalData.oneOrder.selectData.price) * Number(app.globalData.oneOrder.buy_num) - Number(app.globalData.oneOrder.discount) * Number(app.globalData.oneOrder.buy_num) //进去优惠金额
      }else {
        price = Number(app.globalData.oneOrder.selectData.price) * Number(app.globalData.oneOrder.buy_num)
      }
      shopListTwo.push({
        item_id: app.globalData.oneOrder.item_id,
        goodsPriceTotal: price, //商品总价 - 优惠金额
        shopIndex: 0, //加入店铺的索引
      })

      this.setData({
        rebate: app.globalData.oneOrder.share * Number(app.globalData.oneOrder.buy_num), //返利 金额
      })
      
      let subprice = price;


      //如果是单独购买的普通商品 就进入这个分支\
      let couponPrice = 0;
      let moeShopCoupon = []
      let shopCouponMaxIndex = 0;
      let shopCouponNowIndex = [];
      let shopCouponLastIndex = [];
      if (this.data.jumpFrom == 'gooddetail' && app.globalData.oneOrder.activity_type == 0) {

        //获取并选择店铺优惠券
        // this.getShopCouponeList(app.globalData.oneOrder.item_id, 0, price, 1, shopListTwo, 0)
        // console.log(22222,this.data.moeShopCoupon)
        if (this.data.moeShopCoupon && this.data.moeShopCoupon.length && this.data.moeShopCoupon[0]&&this.data.moeShopCoupon[0].coupon && this.data.moeShopCoupon[0].coupon.length){

          let { shopCoupon, maxIndex } = this.presetShopCoupon(0, price);
          moeShopCoupon.push(shopCoupon);
          shopCouponMaxIndex = maxIndex;
          shopCouponNowIndex.push(maxIndex);
          shopCouponLastIndex.push(maxIndex);
          //累计总折扣额 （店铺优惠券）
          subprice -= Number(this.data.moeShopCoupon[0].coupon[maxIndex].discount_num);
          couponPrice += Number(this.data.moeShopCoupon[0].coupon[maxIndex].discount_num);
          //将单独购买商品的店铺优惠券赋值
          app.globalData.oneOrder.cuid = this.data.moeShopCoupon[0].coupon[maxIndex].cu_id;
          app.globalData.oneOrder.discount_num = this.data.moeShopCoupon[0].coupon[maxIndex].discount_num;
          app.globalData.oneOrder.condition_num = this.data.moeShopCoupon[0].coupon[maxIndex].condition_num;

        }
        //预置平台优惠券  用减去店铺优惠券的金额继续计算
        let { moePlatCoupon, platCouponMaxIndex } = this.presetPlatCoupon(subprice);

        // console.log(platCouponMaxIndex)
        //累计总折扣额 （店铺优惠券 + 平台优惠券）
        //如果有就累加

        // if(moePlatCoupon && platCouponMaxIndex){
        if (platCouponMaxIndex != null) {
          // console.log(111111,moePlatCoupon)
          couponPrice += Number(moePlatCoupon[platCouponMaxIndex].discount_num)
        } else {
          couponPrice += 0;
        }
      // }
        //
        if (app.globalData.oneOrder.activity_type == 0) {
          app.globalData.oneOrder.shopCouponShow = true
          this.setData({
            shopCouponShow: true,
            ividList: [{
              ivid: app.globalData.oneOrder.selectData.ivid,
              num: app.globalData.oneOrder.buy_num
            }]
          })
        } else {
          app.globalData.oneOrder.shopCouponShow = false
          this.setData({
            shopCouponShow: false
          })
        }
      }
      app.globalData.oneOrder.display_price = false
      // console.log(55666,app.globalData.oneOrder)
      this.setData({
        oneOrderDetail: app.globalData.oneOrder,
        inWay: 2,
        goType: app.globalData.oneOrder.activity_type,
        moeShopCoupon,
        shopCouponMaxIndex,
        shopCouponNowIndex,
        shopCouponLastIndex,
        couponPrice
      })
      // console.log(333333,this.data.moeShopCoupon)

      if (this.data.oneOrderDetail.is_abroad == 1) {
        this.setData({
          is_abroad: 1
        })
        this.getCard();
      }

      // 计算总价 商品详情 礼包详情
      this.countPrice();

    } else if (this.data.jumpFrom == 'shopcar') { // 从购物车跳转过来
      // 计算邮费
      // this.getPostage();
      // 放置 数组
      let eachItem = {
        condition_num: false,
        discount_num: false,
        remark: "",
        invoice: "",
        cuid: "",
        shopCouponShow: "",
        shopTotalPriceTwo: "",
        display_price: false,
        isShow: false,
        shopPostage: [],
        shopNum: 0,
        shopTotalPrice: 0,
        is_buy: 1,
      }

      app.globalData.shopcarOrder.list.forEach(x => {
        x = Object.assign(x, eachItem);
        x.list.forEach(x2 => {
          x2.message = ""
          if (x2.isSelect) {
            x.isShow = true
          }
        })
      })

      // 过滤 已选 显示
      let listFilter = app.globalData.shopcarOrder.list.filter(x => x.isShow == true)
      app.globalData.shopcarOrder.list = listFilter
      // 
      let total = 0;
      // 放入店铺  优惠券
      let l = 0
      // 有秒杀商品 价格2
      let subtotalTwo = 0
      let setShopCouponShow = false //只要设置一次
      let setHasSpike = false //是否有秒杀 
      let setHasGroup = false //是否有团购
      let setIs_abroad = false //只要设置一次
      let ids = []; //商品id 数组
      let formatIds = []; //规格 数组
      let totalNum = 0; //商品个数
      let ividList = []; //
      let rebate = 0; //返利
      let moeShopCoupon = []; //存放修改后的店铺优惠券数组
      let couponPrice = 0;
      let shopCouponNowIndex = [];
      let shopCouponMaxIndex = [];
      let shopCouponLastIndex = [];
      //遍历购物车所有店铺
      app.globalData.shopcarOrder.list.forEach((x, index) => {
        let shopList = []
        let shopListTwo = []
        //遍历存在于购物车中 单一店铺内的 所有商品
        x.list.forEach((x2) => {
          x2.message = ""
          if (x2.isSelect) {
            rebate = rebate + Number(x2.num) * Number(x2.share)
            //遍历到最后一次的时候set一下返利的值
            if (index === app.globalData.shopcarOrder.list.length - 1) {
              this.setData({
                rebate: rebate,
              })
            }
            //总数自增一
            totalNum++;
            //推入商品ID 
            ids.push(x2.item_id)
            formatIds.push({
              num: x2.num,
              item_id: x2.item_id
            })
            // 数量价格
            x.shopNum += 1
            x.shopTotalPrice += Number(x2.num) * Number(x2.price)
            // 优惠券
            if (x2.activity_type == 0) {
              ividList.push({
                num: x2.num,
                ivid: x2.ivid
              })
              if (index === app.globalData.shopcarOrder.list.length - 1) {
                this.setData({
                  ividList: ividList,
                })
              }
              x.shopCouponShow = true //有一个是普通就显示
              if (!setShopCouponShow) {
                this.setData({
                  shopCouponShow: true
                })
                setShopCouponShow = true
              }
              shopList.push(x2.item_id)
              shopListTwo.push({
                item_id: x2.item_id,
                goodsPriceTotal: Number(x2.num) * Number(x2.price), //商品总价
                shopIndex: l, //加入店铺的索引
              })
              x.shopTotalPriceTwo = Number(x.shopTotalPriceTwo) + Number(x2.num) * Number(x2.price) //优惠券商品总价
            } else if (x2.activity_type == 1) {
              if (!setHasSpike) {
                this.setData({
                  hasSpike: true,
                })
                setHasSpike = true
              }
            } else if (x2.activity_type == 2){
              if(!setHasGroup){
                this.setData({
                  hasGroup:true,
                })
                setHasGroup = true;
              }
            }

            //跨境购  
            if (x2.is_abroad == 1 && !this.data.is_abroad) {
              if (!setIs_abroad) {
                this.setData({
                  is_abroad: 1
                })
                setIs_abroad = true
              }

            }
          }
        })
        total += x.shopTotalPrice //总价格 （包含秒杀 团购）
        // 店铺优惠券商品总价
        if (x.shopCouponShow) {
          //计算店铺优惠券
          //计算单店铺可使用优惠券商品的总价
          //找出对应店铺中的折扣额
          if (this.data.moeShopCoupon && this.data.moeShopCoupon.length > 0 && this.data.moeShopCoupon[index] && this.data.moeShopCoupon[index].coupon && this.data.moeShopCoupon[index].coupon.length){

            let { shopCoupon, maxIndex } = this.presetShopCoupon(index, x.shopTotalPriceTwo);
            x.shopTotalPriceTwo -= Number(this.data.moeShopCoupon[index].coupon[maxIndex].discount_num);

            //累计总折扣额 （店铺优惠券）
            couponPrice += Number(this.data.moeShopCoupon[index].coupon[maxIndex].discount_num)
            moeShopCoupon.push(shopCoupon)
            shopCouponNowIndex.push(maxIndex);
            shopCouponLastIndex.push(maxIndex);
          }
          
          // this.getShopCouponeList(shopList, l, x.shopTotalPriceTwo, 2, shopListTwo, index)
        }
        subtotalTwo = subtotalTwo + x.shopTotalPriceTwo;
        l++;
      })

      //预置平台优惠券

      let { moePlatCoupon, platCouponMaxIndex} = this.presetPlatCoupon(subtotalTwo);
      console.log(platCouponMaxIndex)
      //累计总折扣额 （店铺优惠券 + 平台优惠券）
      //如果有就累加

      // if(moePlatCoupon && platCouponMaxIndex){
      if (platCouponMaxIndex != null ){
        couponPrice += Number(moePlatCoupon[platCouponMaxIndex].discount_num)
        console.log(couponPrice)
      } else{
        couponPrice += 0;
      }
      // }

      if (app.globalData.shopcarOrder.totalPostage != undefined) {
        total += app.globalData.shopcarOrder.totalPostage;
      }
      
      // 获取跨境购
      if (this.data.is_abroad == 1) {
        this.getCard();
      }

      this.setData({

        totalNum: totalNum, //商品总数
        fareModelIds: ids,
        shopcarOrder: app.globalData.shopcarOrder,
        totalPrice: Number(total.toFixed(2)),
        subtotal: app.globalData.totalPrice,
        subtotalTwo: subtotalTwo,
        formatIds: formatIds,
        moeShopCoupon,
        moePlatCoupon,
        platCouponMaxIndex,
        shopCouponNowIndex,
        shopCouponLastIndex,
        couponPrice,

      })

      this.shopcarCountPrice();
      // 获取完平台优惠券再获取店铺优惠
      // if (!this.data.shopCouponShow) {
      //     this.getCouponeList(); // 获取平台优惠券及长度
      // }
    }
  },
  calcBalance(){
    let sub = this.data.subtotal;
    let price = this.data.totalPrice;
    let coupon = this.data.couponPrice;
    let postage = this.data.totalPostage;

    //之后购物卡移出handInfo 待改
    
    let card_balance = this.data.userInfo.card_balance || 0;
    let balance = this.data.handInfo.balance || 0;
    

    // console.log((Number(price) + Number(postage)));
    if(card_balance > (Number(price)+Number(postage))){
      card_balance = price 
      
    }
 
    if (balance > (price + postage)){
      balance = price 
    }
    //1 计算用的值
    //2 原始的值
    //3 用于显示的值
    // console.log(card_balance)
    this.setData({

      card_pay_amount:0,//1
      card_pay_amount_origin: card_balance,//2
      card_pay_amount_display:card_balance,//3

      pay_amount:0,//1
      pay_amount_origin:balance,//2
      pay_amount_display:balance,//3
      canDiscount: price+postage,
    })
  },
  //计算某一个店铺中最大满减的优惠券是哪张 并预置
  presetShopCoupon(index,subtotal){
    
    if(this.data.moeShopCoupon && this.data.moeShopCoupon.length > 0){
      let shopCoupon = this.data.moeShopCoupon[index];
      //筛选最大值 自动选择
      let maxIndex = 0;//最大店铺优惠券的索引 
      let max = 0;      //最大店铺优惠券的 满 字段
      let maxDiscount = 0;//最大店铺优惠券的 减 字段
      
      if(shopCoupon && shopCoupon.coupon && shopCoupon.coupon.length){
        //找到最大的索引值
        shopCoupon.coupon.forEach((couEle, couIdx) => {
          //初始化索引数组

          //根据优惠券票面的满和减 分别确定最大的优惠
          if (parseFloat(couEle.discount_num) > max) {
            max = parseFloat(couEle.discount_num)
            maxDiscount = parseFloat(couEle.condition_num)
            maxIndex = couIdx
          } else if (parseFloat(couEle.discount_num) == max && parseFloat(couEle.condition_num) > maxDiscount) {
            max = parseFloat(couEle.discount_num)
            maxDiscount = parseFloat(couEle.condition_num)
            maxIndex = couIdx
          }
        })


        //选择最大的优惠券
        if (shopCoupon.coupon && shopCoupon.coupon.length > 0) {
          shopCoupon.coupon[maxIndex].isSelect = true;
        }
      }

      //重新计算价格 
      // 满足先选
      if (this.data.jumpFrom == 'gooddetail' || this.data.jumpFrom == 'giftdetail') {
        // let order = app.globalData.oneOrderDetail;
        // console.log(this.data.oneOrderDetail);

      } else if (this.data.jumpFrom == 'shopcar') {
        if (max != 0) {
          let oldList = app.globalData.shopcarOrder.list
          oldList[index].condition_num = shopCoupon.coupon[maxIndex].condition_num;
          oldList[index].discount_num = shopCoupon.coupon[maxIndex].discount_num; //赋值
          oldList[index].cuid = shopCoupon.coupon[maxIndex].cu_id //
          oldList[index].shopTotalPrice = parseFloat(oldList[index].shopTotalPrice) - parseFloat(shopCoupon.coupon[maxIndex].discount_num)
          let newList = 'shopcarOrder.list'
          this.setData({
            [newList]: oldList
          })
        }
        // // 重新计算总价 商品详情 礼包详情：countPrice() 购物车：shopcarCountPrice()
        // if (this.data.jumpFrom == 'gooddetail' || this.data.jumpFrom == 'giftdetail') {
        //   this.countPrice();
        // } else {
        //   this.shopcarCountPrice()
        // }
      }
      //返回修改后的 某一 店铺优惠券数组
      return { shopCoupon, maxIndex };
    }
  },
  presetPlatCoupon(subtotal){

    let platCoupon = this.data.moePlatCoupon;
    let platCouponCopy = [];
    let temp = [];
    let maxIndex = false;
    let maxCondition = 0;
    let maxDiscount = 0;
    let show = false;//有可用的就展示
    if(platCoupon && platCoupon.length){
      //判断目前列表中的平台券是否可用
      platCoupon.forEach((platEle, platIdx) => {
        temp = {
          ...platEle,
          canUse: false
        }
        // console.log(platEle.condition_num,subtotal)
        //总额 大于 等于满减 的 满 就可以使用
        if (platEle.condition_num <= subtotal) {
          temp.canUse = true;
          show = true;
        }
        platCouponCopy.push(temp);
      })
      platCoupon = platCouponCopy;
    }
    //找出满减额度最大的平台优惠券
    if (platCoupon && platCoupon.length > 0 && show){
      platCoupon.forEach((platEle, platIdx) => {
        //判断并选出最大满减券
        //先判断是否可以使用 再判断大小
        if(platEle.canUse){
          if (parseFloat(platEle.discount_num) > maxCondition) {
            maxCondition = parseFloat(platEle.discount_num)
            maxDiscount = parseFloat(platEle.condition_num)
            maxIndex = platIdx
          } else if (parseFloat(platEle.discount_num) == maxCondition && parseFloat(platEle.condition_num) > maxDiscount) {
            maxCondition = parseFloat(platEle.discount_num)
            maxDiscount = parseFloat(platEle.condition_num)
            maxIndex = platIdx
          }
        }

        //清空当前平台优惠券的选择状态
        platEle.isSelect = false;

      })
      //选中最大那张优惠券
      if(maxIndex != -1){
        platCoupon[maxIndex].isSelect = true;
      }
      //设定平台优惠券的状态
      this.setData({
        platCouponShow: true,
        platCouponSelected: true,
        platCuid: platCoupon[maxIndex].cu_id,
        platCouponNowIndex:maxIndex,
        platCouponLastIndex:maxIndex,
        platCouponMaxIndex:maxIndex,
        moePlatCoupon:platCoupon
      })
      //返回选中后的平台优惠券数组
      return {
        moePlatCoupon: platCoupon,
        platCouponMaxIndex: maxIndex
      };
    }else{
      this.setData({
        platCouponShow:false,
        // platCouponSelected:false,
      })
      return false
    }
   
  },
  getTotalCoupon ( ) {
    //提取商品的ivid信息 组装;
    let item_data = this.getIvidArray();
    http.HttpRequst(true, '/coupon/coupon-api/order-coupon-index', 2, '', {
        token: app.globalData.token,
        item_data: item_data
      },
      'POST', false,
      (res) => {
        if (res.data.errcode == 0) {
          // console.log('优惠券',res)
          //增加isSelect属性
          res.data.data.list = this.addSelectProp(res.data.data.list);
          //获取根据店铺和平台进行初筛的优惠券列表
          let {
            shopCoupon,
            platCoupon
          } = this.totalCouponSort(res.data.data.list);
          // console.log('123',platCoupon,shopCoupon)
          //获得根据不通店铺进行细筛
          let moeShopCoupon = this.shopCouponSort(shopCoupon);
          let pingtaiquan = [];
          for(let i=0;i<platCoupon.length;i++) {
            if(platCoupon[i].item_type==1) {
              pingtaiquan.push(platCoupon[i])
            }else{
              moeShopCoupon[this.data.nowShopIndex].coupon.push(platCoupon[i])
            }
          }
          // console.log(222555,pingtaiquan)
          // console.log(222666,moeShopCoupon)
          this.setData({
            moePlatCoupon: pingtaiquan,
            moeShopCoupon,
          })
        }
      }
    )
  },
  addSelectProp(list){
    //增加可供选择的选项isSelect
    let temp = {};
    let newList = [];
    list.forEach((ele,idx)=>{
      temp = {
        ...ele,
        isSelect:false
      }
      newList.push(temp)
      temp = {};
    })
    return newList;
  },
  getIvidArray() {
    let items = [];
    let item_data = [];
    //取到目前需要购买的商品的商品数据
    if (this.data.jumpFrom == 'gooddetail' || this.data.jumpFrom == 'giftdetail') {
      //
      items = app.globalData.oneOrder;
      // console.log(items);
      return this.ividFilter(items, 1); //返回组装后的数组
    } else if (this.data.jumpFrom == 'shopcar') {
      items = app.globalData.shopcarOrder;
      console.log(items);
      return this.ividFilter(items, 2);
    }
  },

  ividFilter(items, type) {
    //type 1 直接购买 2 购物车
    let item_data = [] //用于请求优惠券的商品ivid数组
    let temp = []; // 用于提取ivid和num的中间变量
    if (type == 1) {
      //提取出ivid和购买数量信息
      temp = {
        ivid: items.selectData.ivid,
        num: items.buy_num
      }
      //推入商品信息的数组
      item_data.push(temp);
      //返回最后的商品信息数组
      return item_data;

    } else if (type == 2) {
      //取出购物车信息中 的 ivid
      items.list.forEach((shopEle, shopIdx) => {
        shopEle.list.forEach((goodEle, goodIdx) => {
          //如果购物车中的商品被选择了 就获取他的ivid信息
          if (goodEle.isSelect) {
            temp = {
              ivid: goodEle.ivid,
              num: goodEle.num
            }
            item_data.push(temp);
            temp = [];
          }
        })
      })
      //返回最后的商品信息数组
      return item_data;
    }
  },
  totalCouponSort(list) {
    let shopCoupon = []; //店铺优惠券 数组
    let platCoupon = []; //平台优惠券 数组
    let temp = []; //临时变量
    // console.log('列表', list)

    //有店铺ID的归进店铺优惠券 没有店铺ID的归进平台优惠券
    list.forEach((coupon, idx) => {
      // console.log('我是优惠',coupon)
      if (coupon.shop_id == null) {
        platCoupon.push(coupon);
      } else {
        shopCoupon.push(coupon);
      }
    })
    // console.log(platCoupon);
    return {
      shopCoupon,
      platCoupon
    };
  },
  //根据不同来源 继续将优惠券 在店铺维度进行筛选
  shopCouponSort(shopCoupon) {
    let order = [];
    let sorted = [];
    //判断进入下单页的来源
    if (this.data.jumpFrom == 'gooddetail' || this.data.jumpFrom == 'giftdetail') {
      order = app.globalData.oneOrder;
      //将优惠券数组推入 组装
      sorted = [{
        shop_id: order.shop_id,
        coupon: shopCoupon
      }]

    } else if (this.data.jumpFrom == 'shopcar') {

      //获取购物车的信息
      order = app.globalData.shopcarOrder;

      //预先组装优惠券列表
      order.list.forEach((shopEle, shopIdx) => {
        sorted.push({
          shopIndex: shopIdx,
          shop_id: shopEle.shop.id,
          coupon: [],
          isShow:false
        })

        //双循环 将整个店铺优惠券列表中的优惠券分散到各自的店铺项中
        shopCoupon.forEach((couponEle, couponIdx) => {
          sorted.forEach((shopEle, shopIdx) => {
            if (couponEle.shop_id == shopEle.shop_id) {
              sorted[shopIdx].coupon.push(couponEle)
            }
          })
        })

        //优惠券列表 去重
        sorted.forEach((shopEle, shopIdx) => {
          var obj = {};
          shopEle.coupon = shopEle.coupon.reduce(function(item, next) {
            obj[next.ctid] ? '' : obj[next.ctid] = true && item.push(next);
            return item;
          }, []);
        })
        console.log(sorted);
        //去空
        let newSort = [];
        sorted.forEach((shopEle, shopIdx)=>{
          if (shopEle.coupon.length > 0) {
            shopEle.isShow = true;
            newSort.push(shopEle)
          }
        })
        sorted = newSort;
        console.log(sorted);

      })
    }
    //根据原本购物车中店铺的顺序将优惠券列表的顺序进行重排 
    //用于在之后的 页面显示 和 优惠券选择时的索引 使用
    this.reshuffleListCoupon(sorted);
    //返回最终获得的 店铺优惠券列表
    return sorted;
  },
  input(e) {
    let type = e.currentTarget.dataset.type
    let value = e.detail
    this.setData({
      [type]: value
    })
  },
  // 获取推手信息
  getHandInfo() {
    let self = this;
    http.HttpRequst(true, '/hand/hand-api/info', 2, '', {
        token: app.globalData.token
      },
      'POST', false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            handInfo: res.data.data,
          })
          app.globalData.handInfo = res.data.data;
        }
      }
    )
  },
  // 计算邮费
  getPostage() {
    // app.globalData.shopcarOrder.totalPostage = 0 总邮费为0
    app.globalData.shopcarOrder.totalPostage = 0;
    //shopPostage：获取每个店铺的邮费 
    //shopTotalPrice：每个店铺的商品总价 
    //shopNum：每个店铺的购买了几件商品
    for (let i = 0; i < app.globalData.shopcarOrder.list.length; i++) {
      app.globalData.shopcarOrder.list[i].shopPostage = [];
      app.globalData.shopcarOrder.list[i].shopNum = 0;
      app.globalData.shopcarOrder.list[i].shopTotalPrice = 0;
      for (let j = 0; j < app.globalData.shopcarOrder.list[i].list.length; j++) {
        if (app.globalData.shopcarOrder.list[i].list[j].isSelect === true) {
          app.globalData.shopcarOrder.list[i].shopPostage.push(Number(app.globalData.shopcarOrder.list[i].list[j].postage));
        }
      }
    }
    // totalNum 共计多少件商品

    // 取最高的邮费
    for (let i = 0; i < app.globalData.shopcarOrder.list.length; i++) {
      app.globalData.shopcarOrder.list[i].shopPostage = this.getMax(app.globalData.shopcarOrder.list[i].shopPostage);
    }
    // app.globalData.shopcarOrder.totalPostage：所有最高的邮费相加
    for (let i = 0; i < app.globalData.shopcarOrder.list.length; i++) {
      if (app.globalData.shopcarOrder.list[i].shopPostage != undefined) {
        app.globalData.shopcarOrder.totalPostage += app.globalData.shopcarOrder.list[i].shopPostage;
      }
    }
    // 191223
    this.setData({
      totalPostage:app.globalData.shopcarOrder.totalPostage
    })

  },
  //运费模板获取运费 
  getPostageModel() {
    let self = this;
    http.HttpRequst(true, '/order/order-api/express-fee', 2, '', {
        token: app.globalData.token,
        address_id: self.data.addressId,
        item_list: self.data.inWay == 0 ? self.data.formatIds : [{
          num: self.data.oneOrderDetail.buy_num,
          item_id: self.data.oneOrderDetail.item_id
        }]
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          // 购物车
          if (self.data.inWay == 0) {
            // let temName = shopcarOrder
            let canBuyStatus = true
            let temArray = self.data.shopcarOrder.list
            let totalPostage = 0; //总邮费
            temArray.forEach((x, index1) => {
              let findValue = res.data.data.find((x1) => {
                return (x.shop.id == x1.shop_id)
              })
              x.shopPostage = findValue.express == null ? 0 : Number(findValue.express)
              totalPostage += findValue.express == null ? 0 : Number(findValue.express)
            })
            self.setData({
              totalPostage: Number(totalPostage),
              ['shopcarOrder.list']: temArray
            })
          } else {
            self.setData({
              ['oneOrderDetail.shopPostage']: Number(res.data.data[0].express == null ? 0 : Number(res.data.data[0].express)),
              totalPostage: Number(res.data.data[0].express == null ? 0 : Number(res.data.data[0].express))
            })
          }
          self.useBalance()
        }
      }
    )
  },
  useCard(e) {
    console.log(111,e)
    // let card_pay_amount = this.data.card_pay_amount_origin;
    // let pay_amount = this.data.pay_amount_origin;
    //获取剩余可以使用的余额
    //数据获取
    let totalPrice = this.data.subtotalOne
    let canDiscount = this.data.canDiscount;
    let card_pay_amount = this.data.card_pay_amount;
    let card_pay_amount_display = this.data.card_pay_amount_display;
    let pay_amount = this.data.pay_amount;
    let pay_amount_display = this.data.pay_amount_display;
    if (!this.data.subtotalOne) {
      this.setData({
        subtotalOne: Number(this.data.subtotal)
      })
    }

    //判断是否使用了余额
    //如果使用了余额，就要先减去
    if (this.data.isUsePirce) {
      totalPrice -= this.data.pay_amount;
    }

    //判断是否可以使用购物卡
    // console.log(this.data.userInfo)
    if (Number(this.data.userInfo.card_balance) == 0) {
      wx.showToast({
        title: '购物卡余额为0！',
      })
      this.setData({
        isUseCard: false
      })
      return false
    }
    if(totalPrice <=0){
      wx.showToast({
        title: '商品总价为0！',
      })
      this.setData({
        isUseCard: false
      })
      return false
    }
    //变更switch的状态
    if (e) {
      this.setData({
        isUseCard: e.detail.value
      })
    }
    // let totalPriceOne = parseFloat((parseFloat(totalPrice) + parseFloat(this.data.totalPostage)).toFixed(2))
    let totalPriceOne = parseFloat(totalPrice)
    if (this.data.isUseCard) {
      if (parseFloat(totalPriceOne) > parseFloat(this.data.userInfo.card_balance)) {
        this.setData({
          card_pay_amount_display: parseFloat(this.data.userInfo.card_balance),
          card_pay_amount: parseFloat(this.data.userInfo.card_balance),
        })
      } else {
        this.setData({
          card_pay_amount_display: parseFloat(totalPriceOne),
          card_pay_amount: parseFloat(totalPriceOne)
        })
      }
      if(!this.data.isUsePirce){
        this.setData({
          pay_amount_display: parseFloat((parseFloat(totalPriceOne) - parseFloat(this.data.card_pay_amount)).toFixed(2)),
        })
      }
      this.setData({
        totalPrice: parseFloat((parseFloat(totalPrice) - parseFloat(this.data.card_pay_amount)).toFixed(2))
      })
    } else {
      if(!this.data.isUsePirce){
       
          this.setData({
            pay_amount_display: parseFloat(totalPriceOne),
          })
        
        
      }
      this.setData({
        totalPrice: parseFloat(totalPrice),
        card_pay_amount: 0
      })
    }
  },
  useBalance(e) {
    if (e) {
      if (this.data.userInfo.is_set_paypassword == 0) {
        wx.navigateTo({
          url: '/pages/center/userInfo/setPayPassword/setPayPassword?status=1'
        })
        this.setData({
          isUsePirce: false
        })
        return
      }
      this.setData({
        isUsePirce: e.detail.value
      })
    }
    if (!this.data.subtotalOne) {
      this.setData({
        subtotalOne: Number(this.data.subtotal)
      })
    }
    // 使用积分之后的价格
    var totalPrice = this.data.isUse === true ? this.data.subtotalOne - this.data.disPrice : this.data.subtotalOne
    //判断是否使用余额
    if (this.data.isUseCard) {
      totalPrice -= this.data.card_pay_amount;
    }
    if (totalPrice <= 0) {
      wx.showToast({
        title: '商品总价为0！'
      })
      this.setData({
        isUsePirce: false
      })
      // 使用优惠券小于需支付金额时
      let selectdata={
        detail: {
          value: false
        }
      }
      this.useCard(selectdata)
      return false
    }
    //如果使用余额
    // let totalPriceTwo = parseFloat((parseFloat(totalPrice) + parseFloat(this.data.totalPostage)).toFixed(2))
    let totalPriceTwo = parseFloat(totalPrice)

    if (this.data.isUsePirce) {


      if (this.data.payOne) {
        this.setData({
          show: true,
        })
      }
      console.log(9999,this.data.handInfo.balance)
      if (parseFloat(totalPriceTwo) > parseFloat(this.data.handInfo.balance)) {
        this.setData({
          pay_amount: parseFloat(this.data.handInfo.balance),
          pay_amount_display: parseFloat(this.data.handInfo.balance),
        })
      } else {
        this.setData({
          pay_amount: parseFloat(totalPriceTwo),
          pay_amount_display: parseFloat(totalPriceTwo)
        })
      }
      if(!this.data.isUseCard){
        this.setData({
          card_pay_amount_display: parseFloat((parseFloat(totalPriceTwo) - parseFloat(this.data.pay_amount)).toFixed(2)),
        })
      }
      this.setData({
        totalPrice: parseFloat((parseFloat(totalPrice) - parseFloat(this.data.pay_amount)).toFixed(2)),
      })
      //如果不使用余额
    } else {
      if (!this.data.isUseCard) {
        
          this.setData({
            card_pay_amount_display: parseFloat(totalPriceTwo),
          })
        
        
      }
      this.setData({
        totalPrice: parseFloat(totalPrice),
        pay_amount: 0
      })


    }
  },
  // 取最大值
  getMax(arr) {
    var max = arr[0];
    var len = arr.length;
    for (var i = 1; i < len; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  },
  // 计算总价 商品详情 礼包详情
  countPrice: function() {
    let price = 0;
    let subtotal = 0;
    // isUse true使用积分
    if (this.data.isUse === true) {
      // 商品价格*商品数量-邮费-优惠券的优惠金额-积分抵扣金额 - 优惠金额
      if(this.data.temporaryCode) {
        price = (Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num) - Number(this.data.couponPrice) - Number(this.data.disPrice)).toFixed(2) - Number(app.globalData.oneOrder.discount) * Number(app.globalData.oneOrder.buy_num);
        subtotal = Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num) - Number(app.globalData.oneOrder.discount) * Number(app.globalData.oneOrder.buy_num)
      }else {
        price = (Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num) - Number(this.data.couponPrice) - Number(this.data.disPrice)).toFixed(2);
        subtotal = Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num)
      }
      
      // 计算出来的price小于0
      // 减去店铺 优惠券
      subtotal = subtotal - (parseFloat(this.data.oneOrderDetail.discount_num) || 0)
      price = parseFloat(price) - (parseFloat(this.data.oneOrderDetail.discount_num) || 0)
      if (price < 0) {
        price = '0.00';
      }
    } else {
      // isUse false不使用积分
      // 商品价格*商品数量-邮费-优惠券的优惠金额-优惠金额
      if(this.data.temporaryCode) {
        price = (Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num) - Number(this.data.couponPrice)).toFixed(2) - Number(app.globalData.oneOrder.discount) * Number(app.globalData.oneOrder.buy_num);
        subtotal = Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num)- Number(app.globalData.oneOrder.discount) * Number(app.globalData.oneOrder.buy_num)
      }else {
        price = (Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num) - Number(this.data.couponPrice)).toFixed(2);
        subtotal = Number(this.data.oneOrderDetail.selectData.price) * Number(this.data.oneOrderDetail.buy_num)
      }
      
      // 减去店铺 优惠券
      // subtotal = subtotal - (parseFloat(this.data.oneOrderDetail.discount_num) || 0)
      // price = parseFloat(price) - (parseFloat(this.data.oneOrderDetail.discount_num) || 0)
      // 计算出来的price小于0
      if (price < 0) {
        price = '0.00';
      }
    }
    this.setData({
      totalPrice: price,
      subtotal: subtotal,
      subtotalOne: price
    })
    // 积分重新算
    this.isUsePrice(); //购物车
  },
  // 计算总价 购物车
  shopcarCountPrice: function() {
    let price = 0;
    // isUse true使用积分
    console.log(this.data.subtotal)
    if (this.data.isUse === true) {
      // 总价-优惠券的优惠金额-（积分抵扣金额+邮费） -余额
      price = (Number(this.data.subtotal) - Number(this.data.couponPrice) - Number(this.data.disPrice)).toFixed(2)
      this.data.shopcarOrder.list.forEach((x) => {
        if (x.discount_num) {
          price = price - x.discount_num
        }
      })
      // 立即购买
      if (price < 0) {
        price = '0.00';
      }
    } else {
      // isUse false不使用积分
      // 总价-优惠券的优惠金额-邮费 -余额
      price = (Number(this.data.subtotal) - Number(this.data.couponPrice)).toFixed(2)
      // this.data.shopcarOrder.list.forEach((x) => {
      //   if (x.discount_num) {
      //     price = price - x.discount_num
      //   }
      // })
      if (price < 0) {
        price = '0.00';
      }
    }
    this.setData({
      totalPrice: price,
      // pay_amount: Number(price) - Number(app.globalData.shopcarOrder.totalPostage),
      // card_pay_amount: Number(price) - Number(app.globalData.shopcarOrder.totalPostage),
      subtotalOne: price //使用两种优惠券之后得价格
    })
    this.shopCarIsUsePrice(); //购物车
  },
  // 获取默认地址
  getDefaultAddress: function() {
    let self = this;
    http.HttpRequst(true, '/shop/me-address-api/default-view', 2, '', {
        token: app.globalData.token,
        start_page: 0,
        pages: 1
      },
      'POST',
      false,
      (res) => {
        if (res.data.errcode == 0) {
          if(res.data.data.full_name) {
            var str = res.data.data.full_name.split(" ");
            self.setData({
              addressData: res.data.data,
              isEmpty: true,
              detailAddress: str[1],
              addressId: res.data.data.maid
            })
          }
          
          // 计算 运费
          self.getPostageModel();
          // 配送支持
          self.getSendArea()
        } else {
          self.setData({
            isEmpty: false,
            isModel: true
          })
        }

      }
    )
  },
  // 判断商品是否在配送区域内
  getSendArea: function() {
    let self = this;
    http.HttpRequst(true, '/order/order-api/can-buy', 2, '', {
        token: app.globalData.token,
        address_id: self.data.addressId,
        item_list: self.data.inWay == 0 ? self.data.fareModelIds : self.data.oneOrderDetail.item_id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          // 购物车
          if (self.data.inWay == 0) {
            // let temName = shopcarOrder
            let canBuyStatus = true
            let temArray = self.data.shopcarOrder.list
            temArray.forEach((x, index1) => {
              x.list.forEach((x2, index2) => {
                if (x2.isSelect) {
                  let findValue = res.data.data.find((x3) => {
                    return (x3.item_id == x2.item_id)
                  })
                  x2.is_buy = findValue.is_buy
                  if (canBuyStatus && findValue.is_buy == 0) {
                    self.setData({
                      canBuy: false
                    })
                    x.is_buy = findValue.is_buy
                    canBuyStatus = false
                  }
                }

              })
            })
            self.setData({
              ['shopcarOrder.list']: temArray,
              canBuy: res.data.data[0].is_buy == 0 ? false : true

            })
          } else {
            self.setData({
              ['oneOrderDetail.is_buy']: res.data.data[0].is_buy,
              canBuy: res.data.data[0].is_buy == 0 ? false : true
            })
          }
        }
      }
    )
  },
 
  // 创建订单
  goBuy: function(e) {
    let self = this;
    if (!self.data.buyOnce) {
      return
    }
    self.setData({
      buyOnce: false
    })
    if (!self.data.canBuy) {
      wx.showModal({
        title: '温馨提示',
        content: '您的收货地址暂不支持配送',
        confirmText: "修改地址",
        cancelText: "确定",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/center/seting/address/address?from=' + 'confirmOrder'
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      self.setData({
        buyOnce: true
      })
      return
    }
    if (self.data.is_abroad) {

      if (!common.vaildateIdentity(self.data.card_no)) {
        wx.showToast({
          title: '请写有效身份证',
          icon: 'none',
          duration: 1000
        })
        self.setData({
          buyOnce: true
        })
        return
      }

    }
    // if (self.data.is_abroad && self.data.card_name == "") {
    //   wx.showToast({
    //     title: '请填写姓名',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   self.setData({
    //     buyOnce: true
    //   })
    //   return
    // }
    if (self.data.isEmpty === false&&!self.data.isStore) {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none',
        duration: 1000
      })
      self.setData({
        buyOnce: true
      })
    } else {
      if (self.data.password == "" && self.data.isUsePirce == true) {
        wx.showToast({
          title: '请填写支付密码',
          icon: 'none',
          duration: 1000
        })
        // 打开余额支付
        self.setData({
          payOne: true,
          show: true,
        })
        self.setData({
          buyOnce: true
        })
        return false
      }
      if (self.data.orderData.pay_order_no) {
        self.setData({
          buyOnce: true
        })
        wx.navigateTo({
          url: '/pages/goodDetail/payView/payView?goType=' + self.data.goType,
        })
      } else {
        let skus = [] //旧得
        let sections = [] //新得
        if (self.data.jumpFrom == 'gooddetail' || self.data.jumpFrom == 'giftdetail' || self.data.jumpFrom == 'bargain') {
          skus = [{
            ivid: self.data.oneOrderDetail.selectData.ivid,
            num: self.data.oneOrderDetail.buy_num,
            // remark: self.data.message
          }]
          if (self.data.jumpFrom == 'bargain') {
            skus[0].bargain_id = self.data.oneOrderDetail.id
          }
          sections = [{
            cuid: self.data.oneOrderDetail.cuid,
            display_price: self.data.oneOrderDetail.display_price ? 1 : 0,
            invoice: self.data.invoiceInfo,
            remark: self.data.message,
            item_data: [{
              ivid: self.data.oneOrderDetail.selectData.ivid,
              num: self.data.oneOrderDetail.buy_num,
            }],
          }]
          if (self.data.jumpFrom == 'bargain') {
            sections[0].item_data[0].bargain_id = self.data.oneOrderDetail.id
          }
          // 拼团 商品加 平团id
          if (self.data.inWay != 0 && self.data.oneOrderDetail.activity_type == 2) {
            sections[0].item_data[0].group_team_id = self.data.group_team_id
            self.setData({
              order_type: 9
            })
          }
        } else if (self.data.jumpFrom == 'shopcar') {
          // 循环shopcarOrder 添加skus
          self.data.shopcarOrder.list.forEach((x1, index1) => {
            sections.push({
              cuid: x1.cuid,
              display_price: x1.display_price ? 1 : 0,
              invoice: x1.invoice || [],
              remark: x1.remark || '',
              item_data: [],
            })
            x1.list.forEach((x2, index2) => {
              if (x2.isSelect) {
                sections[index1].item_data.push({
                  ivid: x2.ivid,
                  num: x2.num,
                  cart_id: x2.cart_id,
                })
              }
            })
          })
          console.log(sections)
        }
        if (this.data.inWay != 0 && self.data.invoiceInfo) {
          let invoice = self.data.invoiceInfo; // 发票信息
          if (invoice.invoice_content == 0 || invoice.invoice_content == '') {
            invoice = ''
          } else {
            if (invoice.invoice_content == '1') {
              invoice.invoice_content = '商品明细';
            } else {
              invoice.invoice_content = '不开发票';
            }
          }
        }

        let yubi = 0;
        if (self.data.isUse === true) {
          yubi = String(self.data.disPrice * 1000); // 积分抵扣
        }
        let cuid = ''; // 选中的优惠券id
        if (self.data.selectedCoupon.isSelect === false) {
          cuid = self.data.selectedCoupon.cu_id
        }
        self.setData({
          sections: sections
        })

        let discount;
        if(self.data.temporaryCode) {
          discount = self.data.oneOrderDetail.discount;
        }else {
          discount = null;
        }

        http.HttpRequst(true, '/order/order-api/create', 2, '', {
            token: app.globalData.token,
            isOnSite: self.data.isOnSite,
            extension_code: self.data.extension_code,
            temporary_code: self.data.temporaryCode,
            discount: discount,
            isSmall: 1,// 是否是小程序
            // invitation_code: self.data.invitationCode,
            // merchant_code: self.data.merchant_code,
            address_id: self.data.addressData.maid, //地址
            amount: Number(self.data.totalPrice) + Number(self.data.totalPostage), //金额
            password: self.data.password == "" ? '' : md5.md5(self.data.password),
            // item_data: skus, //改
            sections: self.data.sections, //改
            invoice: self.data.sections[0].invoice,
            // display_price: 0,
            pay_score: yubi, // 积分
            p_cuid: this.data.platCuid, //平台优惠券
            pay_amount: self.data.pay_amount,
            pay_card_amount: self.data.card_pay_amount,
            order_type: self.data.order_type,
            cut_price: self.data.cut_price,
            card_no: self.data.card_no, //身份证
            card_name: self.data.card_name //姓名
          },
          'POST',
          false,
          function(res) {

            if (res.data.errcode == 0) {
              self.setData({
                orderData: res.data.data
              })
              // pay_amount  余额全额支付走 支付成功
              console.log((parseFloat(self.data.totalPrice) + parseFloat(self.data.totalPostage)) == 0)
              if ((parseFloat(self.data.totalPrice) + parseFloat(self.data.totalPostage)) == 0) {
                if (self.data.group_team_id == "") {
                  wx.redirectTo({
                    url: '/pages/goodDetail/paySuccess/paySuccess?price=' + self.data.pay_amount + '&goType=' + self.data.goType,
                    success: function(res) {}
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/assemble/joinGroup/joinGroup?type=2' + '&group_team_id=' + self.data.group_team_id
                  })
                }

                return
              }
              app.globalData.orderInfo = self.data.orderData;
              // 拼团 商品加 平团id

              wx.redirectTo({
                url: '/pages/goodDetail/payView/payView?goType=' + self.data.goType
              })
            } else if (res.data.errcode == 30002) {
              if (res.data.errmsg == '支付密码错误') {
                self.setData({
                  payOne: true,
                  show: true,
                  password: ""
                })
                return false
              }
            } else if (res.data.errcode == 30001) {
              // 没有设置密码走 设置密码
              wx.navigateTo({
                url: '/pages/center/userInfo/setPayPassword/setPayPassword?status=1'
              })
            } else if (res.data.errcode == 30004) {
              // 没有设置密码走 设置密码
              wx.navigateTo({
                url: '/pages/assemble/joinGroup/joinGroup?type=1'
              })
            }
            self.setData({
              buyOnce: true
            })
          }
        )
      }
    }
  },
  // 支付
  // getPay() {
  //   let self = this;
  //   wx.request({
  //     url: app.globalData.baseUrl + '/pay/pay-api/mini',
  //     method: 'POST',
  //     data: {
  //       token: app.globalData.token,
  //       token_type: 1,
  //       order_id: self.data.orderData.pay_order_no,
  //       channel: "WeChat",
  //       product_type: "sku",
  //       open_id: app.globalData.userInfo.small_openid
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (res) {
  //       res.data.data = JSON.parse(res.data.data)
  //       if (res.data.data.appId) {
  //         self.setData({
  //           appId: res.data.data.appId,
  //           nonceStr: res.data.data.nonceStr,
  //           paySign: res.data.data.paySign,
  //           package: res.data.data.package,
  //           timeStamp: res.data.data.timeStamp
  //         })
  //         self.saveForm();
  //         self.rechargePay();
  //       } else {
  //         wx.showModal({
  //           title: '提示',
  //           content: "支付失败",
  //           success: function (res) {
  //           }
  //         })
  //       }
  //     }
  //   });
  // },
  /**点击确定支付***/
  // rechargePay: function (e) {
  //   //调 充值请求, 成功后type设置 为1 , 失败type为 0
  //   let self = this;
  //   self.setData({
  //     recharge_money: 6
  //   })
  //   wx.requestPayment(
  //     {
  //       'timeStamp': self.data.timeStamp + "",
  //       'nonceStr': self.data.nonceStr,
  //       'package': self.data.package,
  //       'signType': 'MD5',
  //       'appId': self.data.appId,
  //       'paySign': self.data.paySign,
  //       'success': function (res) {
  //         wx.redirectTo({
  //           url: '/pages/goodDetail/paySuccess/paySuccess?price=' + self.data.orderData.pay_amount,
  //           success: function (res) { }
  //         })
  //       },
  //       'fail': function (res) {
  //         console.log(2);

  //       },
  //       'complete': function (res) {
  //         console.log(3);
  //       }
  //     })

  // },
  // 跳转发票
  jumpInvoice(e) {
    app.globalData.comfirmInvoiceIndex = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/goodDetail/invoice/invoice'
    })
  },
  // 跳转添加地址
  jumpAddress: function() {
    wx.navigateTo({
      url: '/pages/center/seting/address/address?from=' + 'confirmOrder'
    })
  },
  // 跳转添加地址
  jumpAddress1: function() {
    this.setData({
      isModel: false,
      isStore: false,
      isOnSite: 0,
    })
    wx.navigateTo({
      url: '/pages/center/seting/address/addAddress/addAddress'
    })
  },
  xcFf() {
    this.setData({
      isModel: false,
      isStore: true,
      isOnSite: 1,
    })
  },
  // 留言
  getMessage: function(e) {
    this.setData({
      message: e.detail.value
    })
  },
  // 留言
  getMessage1: function(e) {
    let index = e.currentTarget.dataset.index;
    this.data.shopcarOrder.list[index].remark = e.detail.value
  },
  // 弹出选择优惠券的框
  showCoupon: function(e) {
    let id = e.currentTarget.id;
    this.setData({
      choiceType: id
    })
    if (id == 1) {
      let newList = 'moePlatCoupon'
      if (this.data.moePlatCoupon.length == 0) {
        wx.showToast({
          title: '暂无可用的优惠券',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      this.setData({
        [newList]: this.data.moePlatCoupon,
        couponLen: this.data.moePlatCoupon.length
      })
    } else {
      let item = e.currentTarget.dataset.item;
      if (item.length == 0) {
        return false
      }
      let index = e.currentTarget.dataset.index;
      let newList = 'moePlatCoupon'
      this.setData({
        [newList]: item,
        couponLen: item.length,
        choiceIndex: index
      })
    }

    if (this.data.couponLen == 0) {
      wx.showToast({
        title: '暂无可用的优惠券',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        couponModal: true
      })
    }
  },
  // 选择优惠券
  selectCoupon(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let item = e.currentTarget.dataset.coupon; // 获取选择的优惠券的数据信息
    let index = e.currentTarget.dataset.index; // 获取选择的优惠券的索引 index 
    let unList = this.data.couponList;
    for (let i = 0; i < unList.list.length; i++) {
      unList.list[i].isSelect = false;
    }
    if (this.data.choiceType == 2) {
      // 购物车
      if (this.data.inWay == 0) {
        if (!item.isSelect) {
          let index2 = this.data.choiceIndex
          let arr = this.data.shopcarOrder
          arr.list[index2].eList = unList.list
          arr.list[index2].shopCouponeList[index].isSelect = true
          arr.list[index2].shopTotalPrice = parseFloat(arr.list[index2].shopTotalPrice) + parseFloat(arr.list[index2].discount_num || 0) //加回来
          arr.list[index2].condition_num = item.condition_num
          arr.list[index2].discount_num = item.discount_num //赋值
          arr.list[index2].cuid = item.cu_id //
          arr.list[index2].shopTotalPrice = parseFloat(arr.list[index2].shopTotalPrice) - parseFloat(item.discount_num)
          this.setData({
            shopcarOrder: arr
          })

        } else {

          let index2 = this.data.choiceIndex
          let arr = this.data.shopcarOrder
          arr.list[index2].shopCouponeList = unList.list
          arr.list[index2].shopCouponeList[index].isSelect = false
          arr.list[index2].shopTotalPrice = parseFloat(arr.list[index2].shopTotalPrice) + parseFloat(item.discount_num)
          arr.list[index2].condition_num = false
          arr.list[index2].discount_num = false
          arr.list[index2].cuid = ""
          this.setData({
            shopcarOrder: arr
          })
        }

      } else {
        // 立即购买 写道这里
        let arr = this.data.oneOrderDetail
        arr.shopCouponeList = unList.list
        arr.shopCouponeList[index].isSelect = true
        arr.shopTotalPrice = parseFloat(arr.shopTotalPrice) + parseFloat(arr.discount_num || 0)
        arr.condition_num = item.condition_num
        arr.discount_num = item.discount_num //赋值
        arr.cuid = item.cu_id //
        arr.shopTotalPrice = parseFloat(arr.shopTotalPrice) - parseFloat(arr.discount_num)
        this.setData({
          oneOrderDetail: arr
        })
      }

    } else {
      // 给所有优惠券添加isSelect = false的对象 表示默认都是未选中
      // list 表示选中的优惠券 isSelect = true
      let list = 'couponList.list' + '[' + index + '].isSelect';
      this.setData({
        couponList: unList,
        [list]: !item.isSelect,
        selectedCoupon: item
      })
      // couponPrice获取选中优惠券的优惠金额 未选择couponPrice = 0
      if (this.data.selectedCoupon && this.data.selectedCoupon.isSelect === false) {
        this.setData({
          couponPrice: Number(this.data.selectedCoupon.discount_num)
        })
      } else {
        this.setData({
          couponPrice: 0
        })
      }
    }
    // 重新计算总价 商品详情 礼包详情：countPrice() 购物车：shopcarCountPrice()
    if (this.data.jumpFrom == 'gooddetail' || this.data.jumpFrom == 'giftdetail') {
      this.countPrice();
    } else {
      this.shopcarCountPrice()
    }
    // 选择了 店铺优惠券之后重新获取 平台
    if (this.data.choiceType == 2) {
      this.getCouponeList(); //重新获取平台优惠券
    }

    // 选择完关闭优惠券的框
    this.setData({
      couponModal: false
    })
    wx.hideLoading(); //隐藏提示框

  },
  // 加载更多优惠券
  // loadMoreCoupone() {
  //   let self = this;
  //   let pages = self.data.startPage + 1;
  //   if (pages > Math.ceil(self.data.couponList.total_pages / 10) - 1) {
  //     console.log('加载完了')
  //     return false
  //   } else {
  //     self.setData({
  //       startPage: pages
  //     })
  //     http.HttpRequst(true, '/coupon/coupon-api/index', 2, '',
  //       {
  //         token: app.globalData.token,
  //         start_page: self.data.startPage,
  //         pages: 10,
  //         status: 1
  //       },
  //       'POST',
  //       false,
  //       function (res) {
  //         if (res.data.errcode == 0) {
  //           let listData = "couponList.list";
  //           let list = [];
  //           for (let i = 0; i < res.data.data.list.length; i++) {
  //             res.data.data.list[i].isSelect = false;
  //             if (Number(res.data.data.list[i].condition_num) <= Number(self.data.totalPrice)) {
  //               list.push(res.data.data.list[i])
  //             }
  //             if (Number(res.data.data.list[i].condition_num) <= 9) {
  //               list.push(res.data.data.list[i])
  //             }
  //           }
  //           let newListData = self.data.couponList.list.concat(list);
  //           self.setData({
  //             [listData]: newListData
  //           })
  //           console.log(self.data.couponList)
  //         }
  //       }
  //     )
  //   }
  // },
  // 计算可用优惠券
  // countCouponLen() {
  //   let self = this;
  //   http.HttpRequst(false, '/coupon/coupon-api/index', 2, '',
  //     {
  //       token: app.globalData.token,
  //       start_page: 0,
  //       pages: 99999,
  //       status: 1
  //     },
  //     'POST',
  //     false,
  //     function (res) {
  //       if (res.data.errcode == 0) {
  //         let list = [];
  //         for (let i = 0; i < res.data.data.list.length; i++) {
  //           res.data.data.list[i].isSelect = false;
  //           // 优惠券的金额小于等于总价 可用此优惠券
  //           if (Number(res.data.data.list[i].condition_num) <= Number(self.data.subtotal)) {
  //             list.push(res.data.data.list[i])
  //           }
  //           // if (Number(res.data.data.list[i].condition_num) <= 9) {
  //           //   list.push(res.data.data.list[i])
  //           // }
  //         }
  //         self.setData({
  //           couponLen: list.length
  //         })
  //       }
  //     }
  //   )
  // },
  // 获取平台优惠券及长度
  getCouponeListPlat() {
    // 不能使用平台优惠券
    let self = this;
    // 购物车 去 不能使用秒杀
    if (self.data.inWay == 0) {
      // 去秒杀的总价
      let totalPriceTwo = self.data.totalPrice
      self.data.shopcarOrder.list.forEach((x) => {
        if (x.isShow) {
          totalPriceTwo = Number(totalPriceTwo)
          x.list.forEach((x2) => {
            if (x2.activity_type == 1 && x2.isSelect) {
              totalPriceTwo = Number(totalPriceTwo) - (Number(x2.price) * Number(x2.num))
            }
          })
        }

      })
      self.setData({
        totalPriceTwo: totalPriceTwo.toFixed(2)
      })

    }
    //创造一个商品id的数组 以便接口使用
    let item_arr = [];
    let sets = [];
    let items = app.globalData.shopcarOrder;
    let temp = {}
    let totalInfo = []
    items.list.forEach((ele1, idx) => {
      ele1.list.forEach((ele2, idx2) => {
        item_arr.push(ele2.item_id);
        item_arr = [...new Set(item_arr)]; //去重
      })
      temp = {
        shop_id: ele1.shop.id,
        item_arr: item_arr
      }
      totalInfo.push(temp);
      item_arr = [];
      temp = [];
    })
    // console.log(totalInfo)
    let shopCouponData = []
    let temp2 = []
    let i = 0;
    totalInfo.forEach((ele1, idx1) => {
      http.HttpRequst(true, '/coupon/coupon-api/index', 2, '', {
          token: app.globalData.token,
          item_arr: ele1.item_arr,
          scenario: 'shop',
          status: 1,
          start_page: 0,
          pages: 99
        },
        'POST',
        false,
        (res) => {
          if (res.data.errcode == 0) {
            if (res.data.data && res.data.data.list.length != 0) {
              res.data.data.list.forEach((ele1, idx2) => {
                ele1 = {
                  ...ele1,
                  isSelect: false
                }
                temp2.push(ele1)
              })
            }
            shopCouponData.push({
              shop_id: ele1.shop_id,
              list: temp2,
              index: idx1
            });
            temp2 = []

          }
        }
      )
    })
    setTimeout(() => {
      shopCouponData = this.reshuffleList(shopCouponData);
      this.setData({
        shopCouponData
      })
    }, 1000)
  },
  reshuffleListCoupon(list) {
    var i, j, temp;
    for (i = 0; i < list.length - 1; i++) {
      for (j = i + 1; j < list.length; j++) {
        if (list[i].shopIndex > list[j].shopIndex) {
          temp = list[j];
          list[j] = list[i];
          list[i] = temp;
        }
      }
    }
    return list;
  },
  reshuffleList(list) {
    var i, j, temp;
    for (i = 0; i < list.length - 1; i++) {
      for (j = i + 1; j < list.length; j++) {
        if (list[i].index > list[j].index) {
          temp = list[j];
          list[j] = list[i];
          list[i] = temp;
        }
      }
    }
    return list;
  },
  closeShopCouponModal() {
    this.setData({
      shopCouponModal: false
    })

  },
  openShopCoupon(e) {
    // console.log(e)
    let {
      index,
      id
    } = e.currentTarget.dataset;
    this.setData({
      nowShopId: id,
      nowShopIndex: index,
      shopCouponModal: true
    })
  },
  //选择店铺优惠券
  selectShopCoupon(e) {
    let param = e.currentTarget.dataset;
    //区分来源 商品详情购买 或 购物车
    if(this.data.jumpFrom == 'giftdetail' || this.data.jumpFrom == 'gooddetail'){
      this.singleSelectCoupon(param);
    } else if(this.data.jumpFrom == 'shopcar'){
      this.shopcarSelectCoupon(param);
    } 
  },
  selectPlatCoupon(e){
    let {index} = e.currentTarget.dataset;
    let platCoupon = this.data.moePlatCoupon;
    let couponPrice = this.data.couponPrice;
    let nowIndex = this.data.platCouponNowIndex;
    let lastIndex = this.data.platCouponLastIndex;

    //如果点击的平台优惠券是当前已选中的
    if(index == nowIndex){
      if(platCoupon[index].isSelect == true) {
        //清空平台优惠券选择状态
        // console.log('不对咯');
        platCoupon.forEach((platEle, platIdx) => {
          platEle.isSelect = false
        })
        //涉及计算
        couponPrice -= Number(platCoupon[index].discount_num);
        //涉及显示
        //重置平台优惠券显示值
        this.setData({
          moePlatCoupon:platCoupon,
          platCouponNowIndex:index,
          platCuid: '',
          platCouponSelected:false,
          couponModal:false,
          couponPrice,
        })
        //刷新状态后 重新计算总价
        if (this.data.jumpFrom == 'giftdetail' || this.data.jumpFrom == 'gooddetail') {
          this.countPrice();
        } else if (this.data.jumpFrom == 'shopcar') {
          this.shopcarCountPrice();
        } 
        
      }else{
        // console.log('不对咯1');
        //清空平台优惠券选择状态
        platCoupon.forEach((platEle, platIdx) => {
          platEle.isSelect = false
        })
        //涉及计算
        couponPrice += Number(platCoupon[index].discount_num);
        //涉及显示
        platCoupon[index].isSelect = true
        //重置平台优惠券显示值
        this.setData({
          moePlatCoupon: platCoupon,
          platCouponNowIndex: index,
          platCuid: platCoupon[index].cu_id,
          couponPrice,
          couponModal: false,
          platCouponSelected: true,
        })
        //刷新状态后 重新计算总价
        if (this.data.jumpFrom == 'giftdetail' || this.data.jumpFrom == 'gooddetail') {
          this.countPrice();
        } else if (this.data.jumpFrom == 'shopcar') {
          this.shopcarCountPrice();
        } 
      }
    } else {
      // console.log('不对咯2');
      //判断有没有选中的平台优惠券
      let hasCoupon = false;
      platCoupon.forEach((platEle, platIdx) => {
        if (platEle.isSelect) {
          hasCoupon = true;
        }
      })
      //价格计算
      //根据目前有没有选定优惠券来确定要不要先减去上一张券的优惠值
      if (hasCoupon) {
        couponPrice -= Number(platCoupon[lastIndex].discount_num)//加回 上一张券的值
        couponPrice += Number(platCoupon[index].discount_num);
      } else {
        couponPrice += Number(platCoupon[index].discount_num);
      }

      //清空平台优惠券选择状态
      platCoupon.forEach((platEle, platIdx) => {
        platEle.isSelect = false
      })

      //重置目前优惠券选择的索引
      let platCouponNowIndex = this.data.platCouponNowIndex;
      let platCouponLastIndex = this.data.platCouponLastIndex;
      platCouponNowIndex = index;
      platCouponLastIndex = index;

      //涉及显示
      platCoupon[index].isSelect = true;
      //重置平台优惠券信息

      this.setData({
        moePlatCoupon: platCoupon,
        couponPrice,
        platCouponNowIndex,
        platCouponLastIndex,
        platCuid:platCoupon[index].cu_id,
        platCouponSelected: true,
        couponModal: false
      })

      //刷新状态后 重新计算总价
      if (this.data.jumpFrom == 'giftdetail' || this.data.jumpFrom == 'gooddetail') {
        this.countPrice();
      } else if (this.data.jumpFrom == 'shopcar') {
        this.shopcarCountPrice();
      } 

    }
  },
  singleSelectCoupon(param){
    let shopCoupon = this.data.moeShopCoupon;
    let couponPrice = this.data.couponPrice;
    let { index } = param;
    let nowIndex = this.data.shopCouponNowIndex[0]
    let lastIndex = this.data.shopCouponLastIndex[0];
    //选择的是现在已经选中的店铺优惠券

    //点击同一张优惠券改变状态
    if (index == nowIndex){
      if (shopCoupon[0].coupon[index].isSelect == true){
        //先清除选择  使用shopCoupon[0]是因为 直接购买时的店铺优惠券也是一个数组 并且该商品占据店铺优惠券列表的一个位置
        shopCoupon[0].coupon.forEach((couEle, couIdx) => {
          couEle.isSelect = false
        })
        //价格计算
        couponPrice -= Number(shopCoupon[0].coupon[index].discount_num);
        // console.log(shopCoupon[0].coupon[index].discount_num,couponPrice)   //减去 下一张

        //涉及显示
        let condition_num = `oneOrderDetail.condition_num`;
        let discount_num = `oneOrderDetail.discount_num`;
        let cuid = `oneOrderDetail.cuid`;
        let shopCouponNowIndex = this.data.shopCouponNowIndex;

        this.setData({
          moeShopCoupon: shopCoupon,
          couponPrice,
          shopCouponNowIndex,
          [condition_num]:false,
          [discount_num]:false,
          [cuid]:'',
          shopCouponModal:false
        })
        this.countPrice();
      }else{
        //先清除选择  使用shopCoupon[0]是因为 直接购买时的店铺优惠券也是一个数组 并且该商品占据店铺优惠券列表的一个位置
        shopCoupon[0].coupon.forEach((couEle, couIdx) => {
          couEle.isSelect = false
        })
        //价格计算
        couponPrice += Number(shopCoupon[0].coupon[index].discount_num) 
        // console.log(shopCoupon[0].coupon[index].discount_num,couponPrice)   //减去 下一张
        //涉及显示
        let condition_num = `oneOrderDetail.condition_num`;
        let discount_num = `oneOrderDetail.discount_num`;
        let cuid = `oneOrderDetail.cuid`
        let shopCouponNowIndex = this.data.shopCouponNowIndex;
        
        shopCoupon[0].coupon[index].isSelect = true
        shopCouponNowIndex[0] = index;
        // console.log(shopCoupon[0].coupon[index])
        //重置值
        this.setData({
          moeShopCoupon: shopCoupon,
          couponPrice,
          shopCouponNowIndex,
          [condition_num]: shopCoupon[0].coupon[index].condition_num,
          [discount_num]: shopCoupon[0].coupon[index].discount_num,
          [cuid] : shopCoupon[0].coupon[index].cu_id,
          shopCouponModal:false
        })
        this.countPrice();
      }
    //选择的是另外的优惠券
    }else{
      let hasCoupon = false;
      shopCoupon[0].coupon.forEach((couEle, couIdx) => {
        if (couEle.isSelect) {
          hasCoupon = true;
        }
      })

      //价格计算
      //根据目前有没有选定优惠券来确定要不要先减去上一张券的优惠值
      if(hasCoupon){
        couponPrice -= Number(shopCoupon[0].coupon[lastIndex].discount_num)//加回 上一张券的值
        couponPrice += Number(shopCoupon[0].coupon[index].discount_num);
      }else{
        couponPrice += Number(shopCoupon[0].coupon[index].discount_num);
      }

      //涉及显示
      //先清除选择  使用shopCoupon[0]是因为 直接购买时的店铺优惠券也是一个数组 并且该商品占据店铺优惠券列表的一个位置
      shopCoupon[0].coupon.forEach((couEle, couIdx) => {
        couEle.isSelect = false
      })
      //选择目前选中的优惠券
      shopCoupon[0].coupon[index].isSelect = true;
      let condition_num = `oneOrderDetail.condition_num`;
      let discount_num = `oneOrderDetail.discount_num`;
      let cuid = `oneOrderDetail.cuid`;
      //重置目前优惠券选择的索引
      let shopCouponNowIndex = this.data.shopCouponNowIndex;
      let shopCouponLastIndex = this.data.shopCouponLastIndex;
      shopCouponNowIndex[0] = index;
      shopCouponLastIndex[0] = index;
      //刷新优惠券状态
      this.setData({
        moeShopCoupon: shopCoupon,
        couponPrice,
        shopCouponNowIndex,
        shopCouponLastIndex,
        [condition_num]: shopCoupon[0].coupon[index].condition_num,
        [discount_num]: shopCoupon[0].coupon[index].discount_num,
        [cuid]: shopCoupon[0].coupon[index].cu_id,
        shopCouponModal: false
      })
      this.countPrice();
    }
    //由于选择店铺优惠券后的改动 可能导致现有的店铺券列表 存在不可用的平台优惠券 所以进行重排
    this.presetPlatCoupon();

  },
  shopcarSelectCoupon(param){
    let shopCoupon = this.data.moeShopCoupon;
    let couponPrice = this.data.couponPrice;
    let {index} = param;
    let shopIndex = this.data.nowShopIndex;
    let nowIndex = this.data.shopCouponNowIndex[shopIndex]
    let lastIndex = this.data.shopCouponLastIndex[shopIndex];
    //选择的是现在已经选中的店铺优惠券
    if (index == nowIndex){
      if (shopCoupon[shopIndex].coupon[index].isSelect == true){
        //先清除选择  使用shopCoupon[0]是因为 直接购买时的店铺优惠券也是一个数组 并且该商品占据店铺优惠券列表的一个位置
        shopCoupon[shopIndex].coupon.forEach((couEle, couIdx) => {
          couEle.isSelect = false
        })
        //价格计算
        couponPrice -= Number(shopCoupon[shopIndex].coupon[index].discount_num);
        // console.log(shopCoupon[0].coupon[index].discount_num,couponPrice)   //减去 下一张
        //涉及显示
        let condition_num = `shopcarOrder.list[${shopIndex}].condition_num`;
        let discount_num = `shopcarOrder.list[${shopIndex}].discount_num`;
        let cuid = `shopcarOrder.list[${shopIndex}].cuid`;
        //重置目前优惠券选择的索引
        let shopCouponNowIndex = this.data.shopCouponNowIndex;
        
        this.setData({
          moeShopCoupon: shopCoupon,
          couponPrice,
          shopCouponNowIndex,
          [condition_num]: false,
          [discount_num]: false,
          [cuid]: '',
          shopCouponModal: false
        })
        this.shopcarCountPrice();
      }else{
        //先清除选择  使用shopCoupon[0]是因为 直接购买时的店铺优惠券也是一个数组 并且该商品占据店铺优惠券列表的一个位置
        shopCoupon[shopIndex].coupon.forEach((couEle, couIdx) => {
          couEle.isSelect = false
        })

        //价格计算
        couponPrice += Number(shopCoupon[shopIndex].coupon[index].discount_num);

        //涉及显示
        let condition_num = `shopcarOrder.list[${shopIndex}].condition_num`;
        let discount_num = `shopcarOrder.list[${shopIndex}].discount_num`;
        let cuid = `shopcarOrder.list[${shopIndex}].cuid`;


        //重置目前优惠券选择的索引
        let shopCouponNowIndex = this.data.shopCouponNowIndex;
        let shopCouponLastIndex = this.data.shopCouponLastIndex;
        shopCouponNowIndex[shopIndex] = index;
        // shopCouponLastIndex[shopIndex] = index;
        //选定选择的优惠券
        shopCoupon[shopIndex].coupon[index].isSelect = true;

        //重置店铺优惠券的值
        this.setData({
          moeShopCoupon: shopCoupon,
          couponPrice,
          shopCouponNowIndex,
          // shopCouponLastIndex,
          [condition_num]: shopCoupon[shopIndex].coupon[index].condition_num,
          [discount_num]: shopCoupon[shopIndex].coupon[index].discount_num,
          [cuid]: shopCoupon[shopIndex].coupon[index].cu_id,
          shopCouponModal: false
        })
        this.shopcarCountPrice();
      }
    }else{
      let hasCoupon = false;
      shopCoupon[shopIndex].coupon.forEach((couEle, couIdx) => {
        if (couEle.isSelect) {
          hasCoupon = true;
        }
      })

      //价格计算
      //根据目前有没有选定优惠券来确定要不要先减去上一张券的优惠值
      if (hasCoupon) {
        couponPrice -= Number(shopCoupon[shopIndex].coupon[lastIndex].discount_num)//加回 上一张券的值
        couponPrice += Number(shopCoupon[shopIndex].coupon[index].discount_num);
      } else {
        couponPrice += Number(shopCoupon[shopIndex].coupon[index].discount_num);
      }

      //涉及显示
      //先清除选择  使用shopCoupon[0]是因为 直接购买时的店铺优惠券也是一个数组 并且该商品占据店铺优惠券列表的一个位置
      shopCoupon[shopIndex].coupon.forEach((couEle, couIdx) => {
        couEle.isSelect = false
      })
      //选择目前选中的优惠券
      shopCoupon[shopIndex].coupon[index].isSelect = true;
      let condition_num = `shopcarOrder.list[${shopIndex}].condition_num`;
      let discount_num = `shopcarOrder.list[${shopIndex}].discount_num`;
      let cuid = `shopcarOrder.list[${shopIndex}].cuid`;
      //重置目前优惠券选择的索引
      let shopCouponNowIndex = this.data.shopCouponNowIndex;
      let shopCouponLastIndex = this.data.shopCouponLastIndex;
      shopCouponNowIndex[shopIndex] = index;
      shopCouponLastIndex[shopIndex] = index;
      //刷新优惠券状态
      this.setData({
        moeShopCoupon: shopCoupon,
        couponPrice,
        shopCouponNowIndex,
        shopCouponLastIndex,
        [condition_num]: shopCoupon[shopIndex].coupon[index].condition_num,
        [discount_num]: shopCoupon[shopIndex].coupon[index].discount_num,
        [cuid]: shopCoupon[shopIndex].coupon[index].cu_id,
        shopCouponModal: false
      })
      this.shopcarCountPrice();
    }
    this.presetPlatCoupon();

  },
  
  getCouponeList() {
    // this.getCouponeListPlat();
    console.log(this.data.ividList)
    // 不能使用平台优惠券
    let self = this;
    // 购物车 去 不能使用秒杀
    if (self.data.inWay == 0) {
      // 去秒杀的总价
      let totalPriceTwo = self.data.totalPrice
      console.log(self.data.shopcarOrder)
      self.data.shopcarOrder.list.forEach((x) => {
        if (x.isShow) {
          totalPriceTwo = Number(totalPriceTwo)
          x.list.forEach((x2) => {
            if (x2.activity_type == 1 && x2.isSelect) {
              totalPriceTwo = Number(totalPriceTwo) - (Number(x2.price) * Number(x2.num))
            }
          })
        }

      })
      self.setData({
        totalPriceTwo: totalPriceTwo.toFixed(2)
      })
    }
    // http.HttpRequst(true, '/coupon/coupon-api/order-coupon-index', 2, '', {
    //   token: app.globalData.token,
    //   item_data: self.data.ividList,
    // },
    //   'POST',
    //   false,
    //   function (res) {
    //     if (res.data.errcode == 0) {
    //       let list = [];
    //       let totalPayPrice = self.data.inWay == 0 ? Number(self.data.totalPriceTwo) : Number(self.data.totalPrice)
    //       for (let i = 0; i < res.data.data.list.length; i++) {
    //         res.data.data.list[i].isSelect = false;
    //         // 优惠券的金额小于等于总价 可用此优惠券
    //         if (Number(res.data.data.list[i].condition_num) <= totalPayPrice) {
    //           list.push(res.data.data.list[i])
    //         }
    //       }
    //       let max = 0 //最大值判断
    //       var indexChoice = 0; //选择优惠券
    //       var item = false; //选择优惠券对象
    //       list.forEach((x, index1) => {
    //         if (parseFloat(x.discount_num) > max) {
    //           max = parseFloat(x.discount_num)
    //           item = JSON.parse(JSON.stringify(x))
    //           indexChoice = index1
    //         }
    //       })
    //       if (max != 0) {
    //         list[indexChoice].isSelect = true
    //         item.isSelect = false
    //         self.setData({
    //           selectedCoupon: item
    //         })
    //         // couponPrice获取选中优惠券的优惠金额 未选择couponPrice = 0
    //         if (self.data.selectedCoupon && self.data.selectedCoupon.isSelect === false) {
    //           self.setData({
    //             couponPrice: Number(self.data.selectedCoupon.discount_num)
    //           })
    //         } else {
    //           self.setData({
    //             couponPrice: 0
    //           })
    //         }
    //         // 重新计算总价 商品详情 礼包详情：countPrice() 购物车：shopcarCountPrice()
    //         if (self.data.jumpFrom == 'gooddetail' || self.data.jumpFrom == 'giftdetail') {
    //           self.countPrice();
    //         } else {
    //           self.shopcarCountPrice()
    //         }
    //       } else {
    //         if (self.data.jumpFrom == 'gooddetail' || self.data.jumpFrom == 'giftdetail') {
    //           self.countPrice();
    //         } else {
    //           self.shopcarCountPrice()
    //         }
    //       }
    //       res.data.data.list = list;
    //       console.log(res.data.data)
    //       self.setData({
    //         couponList: res.data.data,
    //         couponListPlat: JSON.parse(JSON.stringify(res.data.data)),
    //         couponLen: list.length
    //       })
    //       // 获取积分和优惠券数量
    //       self.getYuCoupon();

    //     }
    //   }
    // )
    http.HttpRequst(true, '/coupon/coupon-api/index', 2, '', {
        token: app.globalData.token,
        status: 1,
        start_page: 0,
        pages: 99,
        scenario: "platform"
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          let list = [];
          let totalPayPrice = self.data.inWay == 0 ? Number(self.data.totalPriceTwo) : Number(self.data.totalPrice)
          for (let i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].isSelect = false;
            // 优惠券的金额小于等于总价 可用此优惠券
            if (Number(res.data.data.list[i].condition_num) <= totalPayPrice) {
              list.push(res.data.data.list[i])
            }
          }
          let max = 0 //最大值判断
          var indexChoice = 0; //选择优惠券
          var item = false; //选择优惠券对象
          list.forEach((x, index1) => {
            if (parseFloat(x.discount_num) > max) {
              max = parseFloat(x.discount_num)
              item = JSON.parse(JSON.stringify(x))
              indexChoice = index1
            }
          })
          if (max != 0) {
            list[indexChoice].isSelect = true
            item.isSelect = false
            self.setData({
              selectedCoupon: item
            })
            // couponPrice获取选中优惠券的优惠金额 未选择couponPrice = 0
            if (self.data.selectedCoupon && self.data.selectedCoupon.isSelect === false) {
              self.setData({
                couponPrice: Number(self.data.selectedCoupon.discount_num)
              })
            } else {
              self.setData({
                couponPrice: 0
              })
            }
            // 重新计算总价 商品详情 礼包详情：countPrice() 购物车：shopcarCountPrice()
            if (self.data.jumpFrom == 'gooddetail' || self.data.jumpFrom == 'giftdetail') {
              self.countPrice();
            } else {
              self.shopcarCountPrice()
            }
          } else {
            if (self.data.jumpFrom == 'gooddetail' || self.data.jumpFrom == 'giftdetail') {
              self.countPrice();
            } else {
              self.shopcarCountPrice()
            }
          }
          res.data.data.list = list;
          console.log(res.data.data)
          self.setData({
            couponList: res.data.data,
            couponListPlat: JSON.parse(JSON.stringify(res.data.data)),
            couponLen: list.length
          })
          // 获取积分和优惠券数量
          self.getYuCoupon();

        }
      }
    )
  },
  // 关闭优惠券窗口
  closeCouponModal: function() {
    this.setData({
      couponModal: false
    })
  },
  // 计算可使用积分
  countYubi() {
    let price = parseInt(Number(this.data.yuCouponNum.coin) / 1000);
    // price 积分抵扣最大不得超过（总价-邮费）/2
    let maxPrice;
    let couponTotal = 0;
    couponTotal = couponTotal + Number(this.data.couponPrice)
    if (this.data.inWay == 0) {
      this.data.shopcarOrder.list.forEach((x) => {
        if (x.discount_num) {
          couponTotal = couponTotal + Number(x.discount_num)
        }
      })
    } else {
      couponTotal = Number(this.data.discount_num)
    }

    this.setData({
      couponTotal: couponTotal.toFixed(2)
    })
    if (!this.data.hasSpike) {
      if (this.data.inWay != 0) {
        maxPrice = (Number(this.data.totalPrice)) / 2
      } else {
        maxPrice = (Number(this.data.totalPrice)) / 2
      }
    } else {
      maxPrice = (Number(this.data.subtotalTwo) - Number(this.data.couponTotal)) / 2
    }
    if (price >= maxPrice) {
      price = parseInt(maxPrice);
    }
    // this.setData({
    //   disPrice: price,
    //    pay_amount:this.data.totalPrice+this.data.totalPostage
    // })
  },
  // 是否抵扣 商品详情下单
  isUsePrice(e) {
    if (e) {
      this.setData({
        isUse: e.detail.value,
      })
    }
    if (!this.data.subtotalOne) {
      this.setData({
        subtotalOne: this.data.subtotal
      })
    }
    this.setData({
      totalPrice: this.data.subtotalOne, //使用两种优惠券之后得价格
    })
    if (this.data.isUse === true) { // 使用积分
      // 积分元
      let price = parseInt(Number(this.data.yuCouponNum.coin) / 1000);
      // price 积分抵扣最大不得超过（现价-邮费）/2
      let maxPrice = (Number(this.data.totalPrice)) / 2
      if (price >= maxPrice && maxPrice >= 1) {
        price = parseInt(maxPrice);
      } else if (maxPrice < 1) {
        wx.showToast({
          title: '积分抵扣数量过小',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          isUse: false
        })
        price = 0;
      } else if (price >= Number(this.data.totalPrice)) {
        price = parseInt(this.data.totalPrice);
      }
      var totalPrice = this.data.totalPrice
      this.setData({
        disPrice: price,
        userCoinPrice: price,
        totalPrice: totalPrice - price
      })
    } else {
      // 不使用积分
      this.setData({
        totalPrice: this.data.subtotalOne, //使用两种优惠券之后得价格
      })
    }
    // 重新余额
    this.useBalance();
  },
  // 是否抵扣 购物车下单
  shopCarIsUsePrice(e) {
    if (e) {
      this.setData({
        isUse: e.detail.value,
      })
    }
    // 所有优惠券都没有 subtotalOne为总价
    if (!this.data.subtotalOne) {
      this.setData({
        subtotalOne: this.data.subtotal
      })
    }
    this.setData({
      totalPrice: this.data.subtotalOne, //使用两种优惠券之后得价格
    })

    if (this.data.isUse === true) {
      // price 积分抵扣最大不得超过（总价-邮费）/2
      let price = parseInt(Number(this.data.yuCouponNum.coin) / 1000);
      let maxPrice = (Number(this.data.totalPrice)) / 2;
      if (price >= maxPrice && maxPrice >= 1) {
        price = parseInt(maxPrice);
      } else if (maxPrice < 1) {
        wx.showToast({
          title: '积分抵扣数量过小',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          isUse: false
        })
        price = 0;
      } else if (price >= Number(this.data.totalPrice)) {
        price = parseInt(this.data.totalPrice);
      }
      this.setData({
        disPrice: price,
        userCoinPrice: price,
        totalPrice: this.data.totalPrice - price
      })
    } else {
      this.setData({
        totalPrice: this.data.subtotalOne, //使用两种优惠券之后得价格
      })
    }
    // 重新计算余额
    this.useBalance();

  },
  // 获取积分和优惠券数量
  getYuCoupon() {
    let self = this;
    http.HttpRequst(true, '/member/user-coin-api/get-my-coin', 2, '', {
        token: app.globalData.token,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            yuCouponNum: res.data.data,
          })
          self.countYubi();
        }
      }
    )
  },
  //用户身份证接口
  getCard() {
    let self = this;
    http.HttpRequst(true, '/order/order-api/get-card', 2, '', {
        token: app.globalData.token,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            card_name: res.data.data.card_name, //身份证
            card_no: res.data.data.card_no, // 身份证
          })
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      isShowModal: app.globalData.showModal
    })
    // 是否选择过收货地址
    if (app.globalData.orderAddress) {
      var str = app.globalData.orderAddress.full_name.split(" ");
      this.setData({
        addressData: app.globalData.orderAddress,
        addressId: app.globalData.orderAddress.maid,
        isEmpty: true,
        detailAddress: str[1]
      })
      
      setTimeout(()=>{
        this.getSendArea()
        this.getPostageModel();
      },1000)
    } else {
      setTimeout(()=>{
        this.getDefaultAddress();
      },1000)
    }
    // 已选择过发票信息 就直接获取
    if (app.globalData.comfirmInvoiceIndex != '') {
      if (this.data.inWay != 0) {
        // 立即
        if (app.globalData.invoice.invoice_content == 0) {
          this.setData({
            invoiceInfo: ""
          })
          return
        }
        this.setData({
          invoiceInfo: app.globalData.invoice
        })
      } else {
        // 购物车
        setTimeout(() => {
          if (app.globalData.invoice.invoice_content == 0) {
            app.globalData.shopcarOrder.list[app.globalData.comfirmInvoiceIndex].invoice = false
            this.setData({
              invoiceInfo: ""
            })
          } else {
            app.globalData.shopcarOrder.list[app.globalData.comfirmInvoiceIndex].invoice = JSON.parse(JSON.stringify(app.globalData.invoice))
          }
          this.setData({
            shopcarOrder: app.globalData.shopcarOrder,
            invoiceInfo: JSON.parse(JSON.stringify(app.globalData.invoice))
          })
        }, 500)
      }


    }
    //计算可抵扣的值
    // this.calcBalance();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 清空发票信息
    ;
    app.globalData.orderAddress = false
    app.globalData.comfirmInvoiceIndex = ''
    app.globalData.invoice = {
      invoice_content: '',
      invoice_type: '',
      type: '',
      company_name: '',
      company_code: '',
      phone: '',
      mail: '',
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 跳转店铺详情
  jumpShopDetail(e) {
    let id = e.currentTarget.id;
    if (!id) {
      return
    }
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
  // 获取店铺优惠券
  getShopCouponeList(e, index, price, type, shopArray, index2) {
    let self = this;
    let shopArr = []
    // 类型 1 立即  2店铺
    if (type == 1) {
      shopArr.push(e)
    } else {
      shopArr = e
    }
    console.log(shopArr)
    http.HttpRequst(true, '/coupon/coupon-api/index', 2, '', {
        token: app.globalData.token,
        item_arr: shopArr,
        scenario: 'shop',
        start_page: self.data.couponStartPage,
        pages: 9999,
        status: 1
      },
      'POST',
      false,
      (res) => {
        if (res.data.errcode == 0) {

          let list = [];
          let temlist = res.data.data.list
          //现在的
          temlist.forEach((x, xIndex) => {
            x.isSelect = false;
            if (Number(x.condition_num) <= Number(price) && x.item_id.length == 0) {
              list.push(temlist[xIndex])
            }
            if (x.item_id.length != 0) {
              shopArray.forEach((x2) => {
                if (x.item_id.includes(x2.item_id) && Number(x2.goodsPriceTotal) > Number(x.condition_num)) {
                  list.push(temlist[xIndex])
                }
              })
            }
          })

          if (type == 2) {
            let max = 0 //最大值判断
            let maxDiscount = 0 //最大值判断
            var indexChoice = 0; //选择优惠券
            var item = false; //选择优惠券对象
            list.forEach((x, index1) => {
              if (parseFloat(x.discount_num) > max) {
                max = parseFloat(x.discount_num)
                maxDiscount = parseFloat(x.condition_num)
                item = x
                indexChoice = index1
              } else if (parseFloat(x.discount_num) == max && parseFloat(x.condition_num) > maxDiscount) {
                max = parseFloat(x.discount_num)
                maxDiscount = parseFloat(x.condition_num)
                item = x
                indexChoice = index1
              }
            })
            app.globalData.shopcarOrder.list[index2].shopCouponeList = list

            console.log(list)

            self.setData({
              shopcarOrder: app.globalData.shopcarOrder,
            })

            // 满足先选
            if (max != 0) {
              let oldList = app.globalData.shopcarOrder.list
              oldList[index2].shopCouponeList[indexChoice].isSelect = true
              oldList[index2].condition_num = item.condition_num
              oldList[index2].discount_num = item.discount_num //赋值
              oldList[index2].cuid = item.cu_id //
              oldList[index2].shopTotalPrice = parseFloat(oldList[index2].shopTotalPrice) - parseFloat(item.discount_num)
              let newList = 'shopcarOrder.list'
              self.setData({
                [newList]: oldList
              })
              // 重新计算总价 商品详情 礼包详情：countPrice() 购物车：shopcarCountPrice()
              if (self.data.jumpFrom == 'gooddetail' || self.data.jumpFrom == 'giftdetail') {
                self.countPrice();
              } else {
                self.shopcarCountPrice()
              }
            }
            // 最后一个店铺开始走平台优惠券
            if (index2 == self.data.shopcarOrder.list.length - 1) {
              self.getCouponeList();
            }

          } else {
            // 立即购买
            app.globalData.oneOrder.shopCouponeList = list;
            app.globalData.oneOrder.condition_num = false;
            app.globalData.oneOrder.discount_num = false;
            console.log(7887,app.globalData.oneOrder)
            self.setData({
              oneOrderDetail: app.globalData.oneOrder,
            })
            let max = 0 //最大值判断
            let maxDiscount = 0 //最大值判断
            var indexChoice = 0; //选择优惠券
            var item = false; //选择优惠券对象
            list.forEach((x, index1) => {
              if (parseFloat(x.discount_num) > max) {
                max = parseFloat(x.discount_num)
                maxDiscount = parseFloat(x.condition_num)
                item = x
                indexChoice = index1
              } else if (parseFloat(x.discount_num) == max && parseFloat(x.condition_num) > maxDiscount) {
                max = parseFloat(x.discount_num)
                maxDiscount = parseFloat(x.condition_num)
                item = x
                indexChoice = index1
              }
            })
            app.globalData.oneOrder.shopCouponeList = list
            // self.setData({
            //   oneOrderDetail: app.globalData.oneOrder,
            // })
            // 满足 先选
            if (max != 0) {
              let oldList = app.globalData.oneOrder
              oldList.shopCouponeList[indexChoice].isSelect = true
              oldList.condition_num = item.condition_num
              oldList.discount_num = item.discount_num //赋值
              oldList.cuid = item.cu_id //
              oldList.shopTotalPrice = parseFloat(oldList.shopTotalPrice) - parseFloat(item.discount_num)
              console.log(98898,oldList)
              self.setData({
                oneOrderDetail: oldList
              })
              self.shopcarCountPrice()
            }
            self.getCouponeList();
          }


        }


      }
    )
  },
  valueSix(e) {
    this.setData({
      password: e.detail,
      payOne: false,
      show: false,
    })
    // 模态交互效果
    // wx.showToast({
    //   title: '支付成功',
    //   icon: 'success',
    //   duration: 2000
    // })
  },
  changeSaw(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    if (self.data.inWay == 0) {
      let name = "shopcarOrder.list[" + index + "].display_price"
      this.setData({
        [name]: e.detail.value
      })
    } else {
      let name = "oneOrderDetail.display_price"
      this.setData({
        [name]: e.detail.value
      })
    }
  },
  showCard() {
    wx.showModal({
      title: '提示',
      content: '收件人与身份证姓名不一致会导致过不了海关',
      confirmText: "确定",
      showCancel: false,
      success(res) {
        if (res.confirm) {} else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }
})