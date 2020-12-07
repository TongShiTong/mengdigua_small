// components/kanjia/kanjia.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    theme:''
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
      this.triggerEvent('jumpDetail', id)
    }
  }
})
