// components/groupInfo/groupInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    user_list: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    team_info: { 
      type: Object, 
      observer: function(newVal, oldVal, changedPath) {

      }
    },
    showType: { 
      type: String,
      value:'1', 
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    showTime: { 
      type: String,
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    listIn: { 
      type: Boolean,
      value:false,
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    showStatus: { // 订单状态  不等同于 待付款显示倒计时
      type: null,
      value: 1,
      observer: function (newVal, oldVal, changedPath) {
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModel(){
      let self = this;
      if (self.data.team_info.status == 2){
        return
      }
      this.triggerEvent('show')
    }
  }
})