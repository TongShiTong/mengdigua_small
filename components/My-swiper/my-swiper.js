// components/My-swiper/my-swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source: {
      type: Array,
      value: []
    },
    //轮播间隔时间
    delay: {
      type: Number,
      value: 2000
    },
    //轮播方向
    direction: {
      type: String,
      value: "left"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //轮播数据
    listData: [],

    xBegin: 0,
    yBegin: 0,

    index: 0,

    isLoading: false,//用于判断加载(初始化)完成后开启css过渡动画效果，否则在初始化的时候也有动画

    playInterval: {}//保存轮播定时器

  },

  ready(){
    this.init();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化，部署开始各轮播的位置
    init(){
      this.setData({listData: this.properties.source});
      // console.log(44455,this.properties.source)

      const arr = this.data.listData;
      //不传source报错
      if(arr.length < 1) throw new Error("[旋转木马轮播器组件报错] 请传入正确的source参数");
      //不足三张补齐三张
      // while(arr.length < 3){
      //   arr.push(arr[arr.length-1]);
      // }
      for(let i = 0; i < arr.length; i++){
        i == 0 && (arr[i].type = "center");
        i == 1 && (arr[i].type = "right");
        i == 2 && (arr[i].type = "left");
        i == 3 && (arr[i].type = "after1");
        i != 0 && i != 1 && i != 2 && i != 3 && (arr[i].type = "after");

        // i != 0 && i != 1 && i != arr.length-1 && (arr[i].type = "after");
      }
      this.setData({ listData: arr });
      //延迟一会设置css过渡效果
      setTimeout(()=>{
        this.setData({ isLoading: true});
      },500);
      //启动轮播
      this.actionPlay();
    },

    //执行轮播
    actionPlay(){
      if(this.properties.direction != "left" && this.properties.direction != "right"){
        throw new Error("[旋转木马轮播器组件报错] 请传入正确的direction参数");
      }
      const interval = setInterval(()=>{
        if(this.properties.direction == "left"){
          this.leftMove();
        }
        if (this.properties.direction == "right") {
          this.rightMove();
        }
      }, this.properties.delay);
      this.setData({playInterval: interval});
    },

    //滑动按下时
    touchStart({touches:[touch]}){
      //记录按下时候的坐标
      const x = touch.clientX, y = touch.clientY;
      this.setData({xBegin: x, yBegin: y});
      //清除轮播定时器
      clearInterval(this.data.playInterval);
    },
    //滑动进行时候
    touchMove({touches:[touch]}){
      if(this.data.lock) return;
      this.data.lock = true;
      const x = touch.clientX, y = touch.clientY, offsetX = x - this.data.xBegin, offsetY = y - this.data.yBegin;
      if( Math.abs(offsetX) > Math.abs(offsetY) ){
        //向右滑动
        if(offsetX > 0){
          this.rightMove();
        }
        //向左滑动
        if(offsetX < 0){
          this.leftMove();
        }
      }
    },
    //滑动结束抬起时
    touchEnd(){
      this.setData({lock: false});
      //重启轮播定时
      this.actionPlay();
    },

    //左滑动作执行
    leftMove(){
      let arr = this.data.listData;
      arr.forEach(obj=>{
        obj.type = "after";
      });
      const index = this.data.index;
      if(arr.length==1){
        const idx1 = index == arr.length ? 0 : index;
        arr[idx1].type = "center";
      }else if(arr.length==2) {
        const idx1 = index == arr.length ? 0 : index;
        const idx2 = index + 1 == arr.length ? 0 : index + 1;
        arr[idx1].type = "right";
        arr[idx2].type = "center";
      }else {
        const 
          idx1 = index == arr.length ? 0 : index,
          idx2 = index + 1 == arr.length ? 0 : index + 1,
          idx3 = index + 2 == arr.length ? 0 : index + 2 == arr.length + 1 ? 1 : index + 2,
          idx4 = index + 3 == arr.length ? 0 : index + 3 == arr.length + 1 ? 1 : index + 3 == arr.length + 2 ? 2 : index + 3;
        arr[idx1].type = "after";
        arr[idx2].type = "center";
        arr[idx3].type = "right";
        arr[idx4].type = "left";
        // console.log(idx1,idx2,idx3,idx4,arr)
      }
      this.setData({
        listData: arr,
        index: index == arr.length-1 ? 0 : index + 1
      });
    },
    //右滑动作执行
    rightMove() {
      let arr = this.data.listData;
      arr.forEach(obj => {
        obj.type = "after";
      });
      const index = this.data.index;
      if(arr.length==1){
        const toRight = index == arr.length ? 0 : index;
        arr[toRight].type = "center";
      }else if(arr.length==2) {
        const toRight = index == arr.length ? 0 : index;
        const toCenter = index + 1 == arr.length ? 0 : index + 1;
        arr[toRight].type = "right";
        arr[toCenter].type = "center";
      }else if(arr.length==3) {
        const
          // toRight = index,
          // toCenter = index-1 == -1 ? arr.length-1 : index-1,
          // toLeft = index-2 == -1 ? arr.length-1 : index-2 == -2 ? arr.length-2 : index - 2,
          // toAfter = index-3 == -1 ? arr.length-1 : index-3 == -2 ? arr.length-2 : index-3 == -3 ? arr.length-3 : index - 3;
          toRight = index == arr.length ? 0 : index,
          toCenter = index - 1 == -1 ? arr.length-1 : index - 1,
          toLeft = index + 1 == arr.length ? 0 : index + 1;
          // toAfter = index + 2 == arr.length ? 0 : index + 2 == arr.length + 1 ? 1 : index + 2,
          // toAfter1 = index + 3 == arr.length ? 0 : index + 3 == arr.length + 1 ? 1 : index + 3 == arr.length + 2 ? 2 : index + 3;

        arr[toRight].type = "right";
        arr[toCenter].type = "center";
        arr[toLeft].type = "left";
        // arr[toAfter].type = "after";
        // arr[toAfter1].type = "after"

        console.log(toRight,toCenter,toLeft)
      }else if(arr.length==4) {
        const
          toRight = index == arr.length ? 0 : index,
          toCenter = index - 1 == -1 ? arr.length-1 : index - 1,
          toLeft = index + 1 == arr.length ? 0 : index + 1,
          toAfter = index + 2 == arr.length ? 0 : index + 2 == arr.length + 1 ? 1 : index + 2;

        arr[toRight].type = "right";
        arr[toCenter].type = "center";
        arr[toLeft].type = "left";
        arr[toAfter].type = "after";

        console.log(toRight,toCenter,toLeft,toAfter)
      }else {
        const
          toRight = index == arr.length ? 0 : index,
          toCenter = index - 1 == -1 ? arr.length-1 : index - 1,
          toLeft = index + 1 == arr.length ? 0 : index + 1,
          toAfter = index + 2 == arr.length ? 0 : index + 2 == arr.length + 1 ? 1 : index + 2,
          toAfter1 = index + 3 == arr.length ? 0 : index + 3 == arr.length + 1 ? 1 : index + 3 == arr.length + 2 ? 2 : index + 3;

        arr[toRight].type = "right";
        arr[toCenter].type = "center";
        arr[toLeft].type = "left";
        arr[toAfter].type = "after";
        arr[toAfter1].type = "after"

        console.log(toRight,toCenter,toLeft,toAfter,toAfter1)
      }

      this.setData({
        listData: arr,
        index: index == 0 ? arr.length-1 : index - 1
      });
    },

    //点击事件
    touch(e){
      // const obj = this.data.listData[index];//获取当前轮播对象，为toch事件回传传入的（对象）值
      // delete obj.type;//删除type,因为这个属性用于设定轮播的，返回没用
      //触发touch事件
      this.triggerEvent("touch", e);
    }

  }
})
