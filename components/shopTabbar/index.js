// components/shopTabbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    curIndex:{
      type:Number,
      value:0
    },
    isShowTab:{
      type:Boolean,
      value:false,
    },
    shopId:{
      type:Number,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList:[
      {
        name:'首页',
        tabIndex:0,
        icon:'index',
        url:''
      },
      {
        name:'商品',
        tabIndex:1,
        icon:'item',
        url:'/pages/shop/shopDetail/shopDetail?isShowTab=true&tabIndex=1'
      },
      {
        name:'分类',
        tabIndex:2,
        icon:'cate',
        url: `/pages/shop/goodClass/goodClass?isShowTab=true&tabIndex=2`
      },
      {
        name:'客服',
        tabIndex:3,
        icon:'service'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectTab(e){
      // console.log('123')
      // let urls = [
      //   '/pages/shop/shopDetail/shopDetail',
      //   `/pages/class/serch/serch?isShowTab=true&shop_id=${this.data.shopId}`,
      //   `/pages/shop/goodClass/goodClass?isShowTab=true&tabIndex=2&id=${this.data.shopId}`,
      //   ''
      // ]
      let { index , url} = e.currentTarget.dataset;
      this.setData({
        curIndex:index
      })
      this.triggerEvent('selectTab',index)
      // wx.redirectTo({url:urls[index]})
    }
  } 
})
