// components/bargainHelperList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    helpList:{
      type:null,
      value:''
    },
    myId:{
      type:null,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    helpList:[
      {
        name: 'Rama',
        price: 12.02
      },
      {
        name: 'Rama',
        price: 12.02
      },
      {
        name: 'Rama',
        price: 12.02
      }, 
      {
        name: 'Rama',
        price: 12.02
      }
      
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(){
      wx.navigateTo({
        url: '/pages/goodDetail/bargainHelperList/index?id=' + this.data.myId,
      })
    }
  }
})
