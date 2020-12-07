let startX = 0
Component({
  /**
   * 组件的初始数据
   * 
   */
  properties: {
    translateX: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
  },
  data: {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    deleteItem: function (e) {
      this.setData({
        translateX: 0
      })
      this.triggerEvent('deleteChatItem', {}, {bubbles: true})
    },
    /**
     * 滑动删除事件-滑动开始
     */
    touchStartHandler: function(e) {
      startX = e.touches[0].pageX
    },
    /**
     * 滑动删除事件-滑动
     */
    touchMoveHandler: function(e) {
      let pageX = e.touches[0].pageX
      let moveX = pageX - startX
      if(Math.abs(moveX) < 40) {
        return
      }
      // e.target.style.WebkitTransform = `translateX(${moveX}px)`
      if (moveX > 0) { // 右滑 隐藏删除
        if (Math.abs(this.data.translateX) == 0) {
          return
        } else {
          this.setData({
            translateX: 0
          })
        }
      } else { // 左滑 显示删除
        if (Math.abs(this.data.translateX) >= 56) {
          return
        } else {
          this.setData({
            translateX: -56
          })
        }
      }
    }
  }
})
