// pages/member/identityRule/identityRule.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    handInfo: "",
    handList: [], //
    handListLength: 0,
    progreeWidth: "", //滚动条长度
    nowLevel:"",//等级
    nowLevelNmae:"",//等级名称
    taskList:[],//任务列表
    levelProgress:[],//任务进度条
    endProgress: '',//最后得进度条
    content:"",//会员规则
    arr: [{
        value: 1
      },
      {
        value: 2
      },
      {
        value: 3
      },
    ],
    posterImage:false,
    modelStatus:false,
    second: 0,//卡位到期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    this.getHandRule();
    this.getHandList()
    this.getPoster();
    this.getUser()
    this.getRule()
    this.getHandInfo()
    this.getGrow()
    this.banner()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  
    // var cxt_arc = wx.createCanvasContext('canvasCircle');
    // cxt_arc.setLineWidth(6);
    // cxt_arc.setStrokeStyle('#eaeaea');
    // cxt_arc.setLineCap('round');
    // cxt_arc.beginPath();
    // cxt_arc.arc(100, 100, 96, 0, 2 * Math.PI, false);
    // cxt_arc.stroke();
    // cxt_arc.draw();
  },
  goRich(){
    let self = this;
    app.globalData.rich = self.data.rich;
    wx.navigateTo({
      url: '/pages/rich/rich?title=会员规则',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  
  // 获取用户信息
  getUser: function() {
    let self = this;
    http.HttpRequst(false, '/member/user-api/info', 2, '', {
        token: app.globalData.token,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            userInfo: res.data.data,
          })
          app.globalData.userInfo = res.data.data;
        }
      }
    )
  },

  // 获取推手信息
  getHandInfo() {
    let self = this;
    http.HttpRequst(false, '/hand/hand-api/info', 2, '', {
        token: app.globalData.token
      },
      'POST', false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            handInfo: res.data.data,
          })
          if (self.data.handInfo.stuck_time != null) {
            let second = (new Date(self.data.handInfo.stuck_time.replace(/-/g, "/")).getTime() - new Date().getTime()) / 1000
            self.setData({
              second: second
            })
          }
          app.globalData.handInfo = res.data.data;
        }
      }
    )
  },

  // 获取推手信息
  getHandList() {
    let self = this;
    http.HttpRequst(false, '/handConfig/hand-config-api/index', 2, '', {},
      'POST', false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            handList: res.data.data,
            handListLength: res.data.data.length,
            progreeWidth: (20 * res.data.data.length) + '%'
          })
        }
      }
    )
  },
  // 获取海报
  getPoster() {
    let self = this;
    http.HttpRequst(false, '/handUpdate/hand-update-level-api/get-poster', 2, '', {
      token: app.globalData.token
    },
      'POST', false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            posterImage: res.data.data.img_url,
            modelStatus:true
          })
        }
      }
    )
  },
  // 会员规则
  getRule() {
    let self = this;
    http.HttpRequst(false, '/content/content-api/view', 2, '', {
      type: 37    
      },
      'POST', false,
      function(res) {
        if (res.data.errcode == 0) {
          if (res.data.data){
            self.setData({
              rich: res.data.data.content
            })
          }
        }
      }
    )
  },
  // 获取推手规则
  getHandRule() {
    let self = this;
    http.HttpRequst(false, '/handUpdate/hand-update-level-api/info', 2, '', {},
      'POST', false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            taskList: res.data.data.list,
            level_name: res.data.data.level_name,
            level: res.data.data.level,
            levelProgress: res.data.data.progress,
            top_level: res.data.data.top_level,
          })
          for (let i = 0; i < self.data.taskList.length; i++) {
            self.initChart('canvasArcCir' + i, self.data.taskList[i].num||0, self.data.taskList[i].total_num);
          }
           //平均份 进度条
          if (self.data.top_level==0){
            let eachpersent = 100 / (self.data.handListLength - 1)
            self.data.handList.forEach((e, index) => {
              if (e.level == self.data.level) {
                self.setData({
                  endProgress: (eachpersent * index + eachpersent*0.01 * self.data.levelProgress).toFixed(2)
                })
              }
            })
           }else{
            self.setData({
              endProgress: 100
            })
           }
         
         
        }
      },
      
    )
  },
  initChart: function(canvasId, num, totalNum) {
 
    const ctx = wx.createCanvasContext(canvasId);
    ctx.setFillStyle('white');
    ctx.clearRect(0, 0, 84, 84);
    ctx.draw();
    var x = 41,
    y = 41,
    radius = 36;
    ctx.setLineWidth(4);
    ctx.setStrokeStyle('#888888');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 360* Math.PI / 180, false);
    ctx.stroke()
    ctx.setLineWidth(4);
    ctx.setStrokeStyle('#FEC951');
    ctx.setLineCap('round');
    ctx.beginPath();
    let persent = parseFloat(num)/parseFloat(totalNum)
    ctx.arc(x, y, radius, 0, persent*360* Math.PI / 180, false);
    ctx.stroke()
    ctx.draw()
  },
  // 进入详情
  goDetail: function (e) {
    var choiceType = parseInt(e.currentTarget.dataset.type)
    switch (choiceType) {
      case 1:
        wx.switchTab({
          url: '/pages/index/index'
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/member/income/income', //收货明细
          success: function (res) { }
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/member/invite/invite', //邀请好友
          success: function (res) { }
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/member/fans/fans'
        })
        break;
      default:

    }
  },
  close:function(e){
    let self =this;
    self.setData({
      modelStatus:false
    })
  },
  goback:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  savePic:function(){
    let self = this;
    wx.getImageInfo({
      src: self.data.posterImage,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
  // 获取成长值
  getGrow() {
    let self = this;
    http.HttpRequst(false, '/member/growth-api/get-info', 2, '', {
      token: app.globalData.token
    },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          let total = Number(res.data.data.growth) + Number(res.data.data.less_growth);
          let percent = (Number(res.data.data.growth) / total) * 100;
          percent = percent.toFixed(2);
          self.setData({
            growth: res.data.data,
            percent: percent
          })
          self.initChart('canvasArcCirD', Number(res.data.data.growth) || 0, total);
        }
      }
    )
    http.HttpRequst(false, '/content/content-api/view', 2, '',
      {
        "type": 30,
        "action_id": 0
      },
      'POST', false,
      function (res) {
        self.setData({
          content: res.data.data.content,
          helpTitle: res.data.data.title,
        })
      }
    )
  },
  showModelquesion(e) {
    this.setData({
      isHelp: true
    })
  },
  closeQuesion(e) {
    this.setData({
      isHelp: false
    })
  },
   banner: function () {
    let self = this;
    http.HttpRequst(false, '/banner/banner-api/index', 2, '', {
      seat_id: 16,
    },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            bannerList: res.data.data.list
          })
        }
      }
    )
  },
  // 跳转升级vip
  jumpPromote() {
    wx.navigateTo({
      url: '/pages/member/promote/promote',
    })
  },
})