// components/share/share.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showShare: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    showHeader: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    shareImg: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    homePage: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  attached:function(){
    this.setData({
      theme: getApp().globalData.theme
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        showShare: false
      })
      this.triggerEvent('close');
    },
    shareSuccess() {
      this.triggerEvent('shareSuccess');
    },
    // 长按保存
    preeSave() {
      let self = this;
      common.judePicSave(self, self.data.shareImg)
      self.triggerEvent('shareSuccess');
    },
    shareSave() {
      let self = this;
      this.setData({
        showsetModel:false,
      })
      wx.getImageInfo({
        src: self.data.shareImg,
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000
              })
              self.triggerEvent('shareSuccess');
             }
          })
        }
      })
    },
    // 预览商品图片
    preview: function () {
      wx.previewImage({
        current: [this.data.shareImg], // 当前显示图片的http链接
        urls: [this.data.shareImg] // 需要预览的图片http链接列表
      })
    }
  }
})
