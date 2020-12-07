// components/floorGood/floorGood.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    listData: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    role: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    shopId: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    goodsType: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    goType: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {

      }
    },
    showType: {
      type: Number,
      value:1,
      observer: function(newVal, oldVal, changedPath) {

      }
    },
    showList:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    theme: ''
  },
  ready() {
    this.setData({
      theme: getApp().globalData.theme
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jumpDetail(e) {
      let id = e.currentTarget.dataset.id;
      let type = e.currentTarget.dataset.type;
      let shop_id = e.currentTarget.dataset.shop_id
      if (type == 4) {
        wx.navigateTo({
          url: '/pages/member/giftDetail/giftDetail?id=' + id + '&shop_id' + shop_id
        })
      } else {
        wx.navigateTo({
          url: '/pages/goodDetail/goodDetail?id=' + id
        })
      }
    },
    share(e) {
      let id = e.currentTarget.dataset.id;
      // this.triggerEvent('shareGood', id)
      wx.navigateTo({
        url: '/pages/goodDetail/share/share?id=' + id
      })
    },
    // 跳转搜索 
    jumpSerch: function() {
      wx.navigateTo({
        // url: '/pages/class/serch/serch?id=' + this.data.shopId
        url: '/pages/class/classDetail/classDetail?id=' + this.data.shopId + '&' + this.data.goType + '=' + 1
      })
    },
    
  }
})