// components/customHorizon/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    countDownTime:{
      type:null,
      value:10000
    },
    showType:{
      type:Number,
      value:1
    },
    listData:{
      type:null,
      value:[0,0,0,0,0,0,0]
    },
    totalData:{
      type:null,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hour:'',
    minute:'',
    second:'',
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      if(this.properties.showType == 1){
        this.startCountDown();
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jumpToDetail(e){
      console.log(e)
      let { id } = e.currentTarget.dataset;
      let { shop_id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/goodDetail/goodDetail?id=${id}&shop_id=${shop_id}`,
      })
    },
    startCountDown(){
      let time = Number(this.data.countDownTime);
      let timer = setInterval(()=>{
        time -= 1
        if (time == -1){
          clearInterval(timer);
          return false;
        }
        this.timeFormat(time);
      },1000)
    },
    timeFormat(time){
      console.log(time);
      let hour = parseInt(time/3600);
      let minute = parseInt(time / 60) % 60; 
      let second = time % 60;//秒
      if(hour < 10){
        hour = '0'+ hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second

      }
      this.setData({
        hour,
        minute,
        second
      })

    }
  }
})
