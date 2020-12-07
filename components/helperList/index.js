// components/helperList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    helpList: { 
      type: null, 
      observer: function(newVal, oldVal, changedPath) {
        console.log(newVal)
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

  }
})
