// components/navbar/index.js
const app = getApp()
const routeMap = {
  '首页': 'pages/index/index',
  '发圈': 'pages/fq/fq',
  '分销员': 'pages/member/member',
  '购物车': 'pages/shopCar/shopCar',
  '我的': 'pages/center/center',
}

Component({
  properties: {
    title: {
      type: String,
      value: " ",
      observer: function(newVal, oldVal) {}
    },
    // 导航背景是否是白色
    bgColor: {
      type: String,
      value: "",
      observer: 'setWhiteColor'
    },
    //是否透明
    isTransparent: {
      type: Boolean,
      value: false,
      observer: 'setTransparent'
    }
  },
  data: {
    height: app.globalData.totalHeight,
    barHeight: app.globalData.barHeight,
    lineHeight: app.globalData.totalHeight - app.globalData.barHeight,
    backIcon: false,
    bc: 'transparent',
    titleColor: "#fff",
    isIndex: false, //是否是主tabbar
  },
  attached: function() {
    const {
      length,
    } = getCurrentPages()
    const route = getCurrentPages()[length - 1].route
    length > 1 && this.setData({
      backIcon: true,
    })
    this.setThemeColor()
    for (let i in routeMap) {
      if (route === routeMap[i]) {
        this.setData({
          isIndex: true
        })
      }
    }
  },

  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },
    //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    //设置主题色
    setThemeColor() {
      if (this.properties.bgColor !== "" || this.properties.isTransparent) {
        return
      }
      // wx.setNavigationBarColor({
      //   frontColor: "#ffffff",
      //   backgroundColor: "#ffffff"
      // })
      // const theme = app.globalData.theme
      const theme = -1
      let fc = '#ffffff',
        bc = 'linear-gradient(209deg,rgba(215,29,72,1) 0%,rgba(240,60,102,1) 100%);'
      switch (theme) {
        case 0:
          bc = 'linear-gradient(270deg,rgba(255,151,178,1) 0%,rgba(255,104,143,1) 100%);'
          break;
        case 1:
          bc = 'linear-gradient(209deg,rgba(215,29,72,1) 0%,rgba(240,60,102,1) 100%);'
          break;
        case 2:
          bc = 'linear-gradient(270deg,rgba(118,189,255,1) 0%,rgba(70,161,247,1) 100%);'
          break;
        case 3:
          bc = 'linear-gradient(270deg,rgba(240,84,90,1) 0%,rgba(208,46,52,1) 100%);'
          break;
        case 4:
          bc = 'linear-gradient(270deg,rgba(52,229,203,1) 0%,rgba(13,205,177,1) 100%);'
          break;
        case 5:
          bc = 'linear-gradient(270deg,rgba(47,47,47,1) 0%,rgba(34,34,34,1) 100%);'
          break;
        default :
          bc = "#fff"
          break;
      }
      this.setData({
        bc,
      })
      if (this.data.bgColor==""){
        this.setData({
          bgColor:"#fff"
        })
      }
      if (bc === '#fff') {
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#ffffff"
        })
        this.setData({
          titleColor: "#000"
        })
      }
    },
    //设置字体颜色
    setWhiteColor(newVal, oldVal) {
      if (newVal == 'theme') {
        const theme = app.globalData.theme
        let fc = '#ffffff',
          bc = 'linear-gradient(209deg,rgba(215,29,72,1) 0%,rgba(240,60,102,1) 100%);'
        switch (theme) {
          case 0:
            bc = 'linear-gradient(270deg,rgba(255,151,178,1) 0%,rgba(255,104,143,1) 100%);'
            break;
          case 1:
            bc = 'linear-gradient(209deg,rgba(215,29,72,1) 0%,rgba(240,60,102,1) 100%);'
            break;
          case 2:
            bc = 'linear-gradient(270deg,rgba(118,189,255,1) 0%,rgba(70,161,247,1) 100%);'
            break;
          case 3:
            bc = 'linear-gradient(270deg,rgba(240,84,90,1) 0%,rgba(208,46,52,1) 100%);'
            break;
          case 4:
            bc = 'linear-gradient(270deg,rgba(52,229,203,1) 0%,rgba(13,205,177,1) 100%);'
            break;
          case 5:
            bc = 'linear-gradient(270deg,rgba(47,47,47,1) 0%,rgba(34,34,34,1) 100%);'
            break;
          default:
            bc = "#fff"
            break;
        }
        this.setData({
          bgColor: bc
        })
        newVal = bc
      }
      if (newVal === '#fff' || newVal === '#ffffff') {
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#ffffff"
        })
        this.setData({
          titleColor: "#000"
        })
      }
      if (oldVal.indexOf("#fff") > -1 && newVal == "") {
        this.setData({
          titleColor: "#fff"
        })
      }
    
    },
    //设置透明navbar
    setTransparent(newVal) {
        if(newVal) {
          this.setData({
            bc: "transparent"
          })
       
        }
     
    }
  },
})