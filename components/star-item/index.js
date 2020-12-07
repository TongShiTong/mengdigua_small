// components/star-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 得分
    starVal: {
      type: [Number, String],
      value: '',
      observer: 'checkStar'
    },
    //总星数
    starTotal: {
      type: [Number, String],
      value: 5,
      observer: 'createStar'
    },
    //星星样式
    starStyle: {
      type: String,
      value: '',
    },
    showType:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    starArray: new Array(5),
    stars: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 生成评星数组
    createStar(newVal) {
      let length = +newVal
      if (length >= 1 && length !== 5) {
        this.setData({
          starArray: new Array(length)
        })
      }
    },
    // 检测评分有效值
    checkStar(newVal) {
      const total = this.data.starArray.length
      let val = +newVal
      if (val >= 0) {
        val = val > total ? total : val
        this.setData({
          stars: val
        })
      }
    },
  }
})