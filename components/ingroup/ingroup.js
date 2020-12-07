// components/ingroup/ingroup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal, changedPath) {}

    },
    userInfo: {
      type: Object,
      observer: function(newVal, oldVal, changedPath) {}

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    theme: '',
    timer: null, // 计时器
    groupSecondTime: false
  },

  ready() {
    this.setData({
      theme: getApp().globalData.theme
    })
    this.getTime();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTime() {
      let self = this;
      if (self.data.groupSecondTime != false) {
        clearInterval(self.data.groupSecondTime)
      }
      let newVal = self.data.listData
      newVal.forEach(x => {
        x.second = (new Date(x.end_time.replace(/-/g, "/")).getTime() - new Date(x.now_time.replace(/-/g, "/")).getTime()) / 1000
      })
      self.data.groupSecondTime = setInterval(() => {
        let status = false
        newVal.forEach(x => {
          if (x.second >= 0) {
            x.second = x.second - 1
            status = true
          }
        })
        if (!status) {
          clearInterval(self.data.groupSecondTime)
          return
        }
        self.setData({
          listData: newVal
        })

      }, 1000)



    },
    goCatch(e) {
      let id = e.currentTarget.dataset.id
      let uid = e.currentTarget.dataset.uid
      let myEventDetail = {
        id: id
      } // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('saveId', myEventDetail, myEventOption)
    }
  }
})