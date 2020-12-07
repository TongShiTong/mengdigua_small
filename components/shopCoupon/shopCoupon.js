// components/shopCoupon/shopCoupon.js
const app = getApp()
const http = require('../../utils/http.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponInfo: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function (newVal, oldVal, changedPath) {

        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    tu_coupon: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    couponListData:[]
  },

  attached() {
    this.getCouponeDetails(this.data.couponInfo.goods_list);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开优惠券
    showCoupon: function () {
      if (this.data.couponListData.list.length == 0) {
        wx.showToast({
          title: '暂无可用的优惠券',
          icon: 'none',
          duration: 1000
        })
      } else {
        this.setData({
          couponModal: true
        })
        var animation = wx.createAnimation({
          transformOrigin: "50% 50%",
          duration: 500,
          timingFunction: "ease",
          delay: 0
        })
        animation.height(400).step()
        this.setData({
          contentShow: true,
          animationData: animation.export(),
        })
      }
    },
    // 关闭优惠券
    closeCouponModal: function () {
      this.setData({
        couponModal: false
      })
    },
    loadMoreCoupon:function(){
      let myEventDetail = {  } // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('loadMoreCoupon', myEventDetail, myEventOption)
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

    // 跳转商品详情
    tapGood(e) {
      // console.log(e)
      let param = e.currentTarget.dataset.id
      let shop_id = e.currentTarget.dataset.shop_id
      wx.navigateTo({
        url: "/pages/goodDetail/goodDetail?id=" + param + "&shop_id=" + shop_id,
      });
    },

    // 获取店铺优惠券
    getShopCoupon(e) {
      let self = this;
      var id = e.currentTarget.id;
      http.HttpRequst(true, '/coupon/coupon-templet-api/receive', 2, '', {
        token: app.globalData.token,
        ctid: id,
      },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '领取成功',
              icon: 'none',
              duration: 1000
            })
            let myEventDetail = {} // detail对象，提供给事件监听函数
            let myEventOption = {} // 触发事件的选项
            self.triggerEvent('loadNew', myEventDetail, myEventOption)
          }
        }
      )
    },
    receiveCoupon(e) {
      const self = this;
      var coupon = e.currentTarget.dataset.coupon;
      http.HttpRequst(true, '/coupon/coupon-templet-api/receive', 2, '', {
        token: app.globalData.token,
        ctid: coupon.id,
      },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '领取成功',
              icon: 'none',
              duration: 1000
            });
            const couponListData = self.data.couponListData;
            const target = couponListData.find(c=>c.id === coupon.id);
            target.is_accept = 1;
            self.setData({
              couponListData: self.data.couponListData
            });
          }
        }
      )
    }
  }
})
