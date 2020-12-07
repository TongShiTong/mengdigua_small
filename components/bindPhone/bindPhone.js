// components/bindPhone/bindPhone.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    quxiao:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取消弹框
    cloosePhone() {
      this.triggerEvent('cloosePhone')
    },
    // 跳转绑定手机
    jumpBindPhone() {
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone'
      })
    }
  }
})
