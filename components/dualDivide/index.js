// components/qualDivide/index.js
const app = getApp()
const http = require('../../utils/http.js')
const formatTime = require('../../utils/util.js')
const common = require('../../utils/common.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
      type:null,
      value:''
    },
    times:{
      type:null,
      value:[10,1000]
    },
    seckillScene:{
      type:null,
      value:''
    }
  },
  lifetimes:{
    attached(){
      setTimeout(()=>{
        this.handleSeckill();
        this.createTimers();
        this.getSecItem();
      },2000)
    },
    detached(){

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    timeIndex:[0,0],
    dispTime:[0,0],
    skillData:'',
    isShow:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getSecItem(){
      http.HttpRequst(true, '/item/seckill-api/seckill-item-list', 2, '', {
        token: app.globalData.token,
        start_page:0,
        pages: 2,
        seckill_scene_id: this.data.secCode
      },
        'POST',
        false,
         (res) =>{
          if (res.data.errcode == 0) {
            this.setData({
              skillData:res.data.data
            })
            console.log(res.data.data.list);
          }
        }
      )
    },

    tapFloor(e){
      this.triggerEvent("tapFloor",e);
    },

    handleSeckill(){
      //获取秒杀场次列表
      let scene = this.properties.seckillScene.list;

      console.log(scene);
      //初始化起始时间数组
      let timeStart = [];
      let timeEnd = [];
      let second = ''
      let dispTime = [];
      let now = new Date().getTime()

      console.log(now)
      //取出所有场次得开始时间
      scene.forEach((ele,idx)=>{
        ele.start_time = ele.start_time.replace(/-/g, "/");
        console.log(ele.start_time)
        second = new Date(ele.start_time).getTime()
        timeStart.push(second)
      })
      //取出所有场次得结束时间
      scene.forEach((ele, idx) => {
        ele.end_time = ele.end_time.replace(/-/g, "/");
        console.log(ele.end_time)
        second = new Date(ele.end_time).getTime()
        timeEnd.push(second)
      })
      console.log(timeStart,timeEnd)
      //根据当前时间获得最近一场的秒杀场次在数组中的位置
      let secIndex = this.getRecentSec(timeStart,1);
      //根据索引值给倒计时显示时间赋值
      // console.log(time)
      let times =[]
      //如果秒杀还没开始  就取现在到开始的时间  如果开始了 就取结束到现在的时间
      if (now - timeStart[secIndex]<0){
        times = [timeStart[secIndex] - now ,timeStart[secIndex] - now];
      }else{
        times = [timeEnd[secIndex] - now, timeEnd[secIndex] - now];

      }
      console.log(times)
      this.setData({
        times,
        secCode: scene[secIndex].seckill_scene_id,
        secIndex:secIndex
      })
    },
    getRecentSec(arr,type=1){
      let lowest = 0;
      //type
      //1.根据现在时间和秒杀场次的差值计算
      //2.根据秒杀场次起始时间的先后计算
      switch(+type){
        case 1:
          //根据起始时间和目前时间的差值的绝对值大小 来获取离现在最近一场的秒杀场次
          let now = new Date().getTime();
          let newArr = [];
          let tem = 0;
          arr.forEach((ele,idx)=>{
            tem = now - ele
            if(tem>0){
              newArr.push(tem)              
            }else{
              newArr.push('')
            }
          })
          let low = 0;
          // 可能出现lowest所指位置为空的情况
          for (let i = 1; i < newArr.length; i++) {
            if(newArr[i] != ''){
              if (newArr[i] < newArr[lowest]){
                lowest = i;
                low = newArr[lowest]
              }
            }
          }
          break;
        case 2:
          for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[lowest]) lowest = i;
          }
          break;
      }
      
      return lowest;      
    },
    createTimers(){
      let items = this.properties.listData;
      let times = this.properties.times;
      let timers = [0,0];
      let timeSet = ''
      let dispTime = ''
      items.forEach((ele,idx)=>{
        if(ele.kind == 2){
          timeSet = `times[${idx}]`
          dispTime = `dispTime[${idx}]`
          //设置定时器启动倒计时
          let timer = setInterval(()=>{
            times[idx] = Number(times[idx])-1;
            if(times[idx]==0){
              clearInterval(timer)
            }else{
              this.setData({
                [timeSet]:times[idx],
                [dispTime]: this.timeFormat(times[idx])
              })
            }
          },1000)
        }
      })
    },
    skillTwo (value) {
      let leftSecond = parseInt(value / 1000)
      let Day = Math.floor(leftSecond / (60 * 60 * 24))
      let Hour = Math.floor((leftSecond - Day * 24 * 60 * 60) / 3600)
      let Minute = Math.floor((leftSecond - Day * 24 * 60 * 60 - Hour * 3600) / 60)
      let Second = Math.floor(leftSecond - Day * 24 * 60 * 60 - Hour * 3600 - Minute * 60)
      return {
        'day': String((Day < 10 ? '0' + Day : Day)),
        'hour': String((Hour < 10 ? '0' + Hour : Hour)),
        'minute': String((Minute < 10 ? '0' + Minute : Minute)),
        'second': String((Second < 10 ? '0' + Second : Second))
      }
    },
    timeFormat(time) {
      let hour = parseInt(time / 3600);
      let minute = parseInt(time / 60) % 60;
      let second = time % 60;//秒
      if (hour < 10) {
        hour = '0' + hour
      } else if(hour > 99){
        hour = '99'
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second

      }
      
      return {
        hour:String(hour),
        minute:String(minute),
        second:String(second)
      }
   },
   jumpToDetail(e){
    //  let {id} = e.currentTarget.dataset;
    //  wx.navigateTo({
    //    url: `/pages/goodDetail/goodDetail?id=${id}`,
    //  })
    let {index , code} = e.currentTarget.dataset;
     wx.navigateTo({
       url: `/pages/assemble/index?type=2&index=${index}&code=${code}`,
     })
   }
  }
})
