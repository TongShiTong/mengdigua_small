// components/serchThree/serchThree.js
Component({
  /**
   * 组件的属性列表
   */
  // options: {
  //   addGlobalClass: true,
  // },
  properties: {
    placeholder: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    isRead: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    hotpos:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    theme: '',
    logo_url: ""
  },
  ready() {
    // 在组件实例进入页面节点树时执行
    this.setData({
      theme: getApp().globalData.theme,
      logo_url: getApp().globalData.themeInfo && getApp().globalData.themeInfo.logo_url||'/images/lm.png',
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jumpSerch: function() {
      wx.navigateTo({
        url: '/pages/class/serch/serch'
      })
    },
    jumpMail: function() {
      wx.switchTab({
        url: '/pages/class/class',
      })
      // wx.navigateTo({
      //   url: '/pages/center/message/message'
      // })
    },
    jumpToCert(){
      wx.navigateTo({
        url: '/pages/index/certificate/certificate',
      })
    }
  }
})