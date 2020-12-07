// pages/center/myWallet/myWallet.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mslData: [],
    coin: 0,
    detailed: [],
    isHelp: false,
    isShowModal: false,
    startPage: 0,
    helpContent: '',
    helpTitle: '',
    showDetail: false,
    animation: '',
  },
  // 显示帮助中心
  showHelp() {
    this.setData({
      isHelp: true
    })
  },
  // 关闭帮助中心
  close() {
    this.setData({
      isHelp: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    let self = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#D1BC9D'
    })
    //我的积分
    http.HttpRequst(false, '/member/user-coin-api/get-my-coin', 2, '',
    { 
      token: app.globalData.token,
    },
    'POST',false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            coin: res.data.data.coin
          })
        }
      }
    );
    //积分任务
    http.HttpRequst(false, '/member/user-coin-api/get-coin-task', 2, '',
      {
        token: app.globalData.token,
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            mslData: res.data.data.list,
          })
        }
      }
    );
    //积分明细
    http.HttpRequst(false, '/member/user-coin-api/get-coin-list', 2, '',
      { 
        token: app.globalData.token,
        start_page: 0,
        pages: 10
      },
       'POST', false,
      function (res) {
        self.changeList(res.data.data.list);
        if (res.data.errcode == 0) {
          self.setData({
            detailed: res.data.data,
          })
        }
      }
    )
    // 帮助信息
    http.HttpRequst(false, '/content/content-api/view', 2, '',
      {
        "type": 34,
        "action_id": 0
      },
      'POST', false,
      function (res) {
        self.setData({
          helpContent: res.data.data.content,
          helpTitle: res.data.data.title,
        })
      }
    )
  },
  //获取节点
  getNode(dom,res){
    let query = wx.createSelectorQuery();
    return new Promise(function (resolve, reject) {
      query.select(dom).boundingClientRect(res).exec();
      resolve('1');
    })
  },
  //取最大值
  maxNum(num1, num2){
    return num1 > num2 ? num1 : num2
  },
  //加载更多明细
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.detailed.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/member/user-coin-api/get-coin-list', 2, '',
        {
          token: app.globalData.token,
          start_page: self.data.startPage,
          pages: 10
        },
        'POST',
        false,
        function (res) {
          self.changeList(res.data.data.list);
          if (res.data.errcode == 0) {
            let listData = "detailed.list";
            let list = res.data.data.list;
            let newListData = self.data.detailed.list.concat(list);
            self.setData({
              [listData]: newListData
            })
          }
        }
      )
    }
  },
  //重新定义获取的list
  changeList: function(list){
    for(let i = 0; i < list.length; i++){
      switch (Math.ceil(list[i].type)){
        case 1:
          list[i].type = '注册';
          list[i].coin = '+' + list[i].coin;
          break;
        case 2:
          list[i].type = '签到';
          list[i].coin = '+' + list[i].coin;
          break;
        case 3:
          list[i].type = '购买商品';
          list[i].coin = '+' + list[i].coin;
          break;
        case 4:
          list[i].type = '评价';
          list[i].coin = '+' + list[i].coin;
          break;
        case 5:
          list[i].type = '分享商品';
          list[i].coin = '+' + list[i].coin;
          break;
        case 6:
          list[i].type = '邀请好友';
          list[i].coin = '+' + list[i].coin;
          break;
        case 7:
          list[i].type = '升级VIP';
          list[i].coin = '+' + list[i].coin;
          break;
        case 8:
          list[i].type = '后台增加';
          list[i].coin = '+' + list[i].coin;
          break;
        case 9:
          list[i].type = '后台扣除';
          list[i].coin = '-' + list[i].coin;
          break;
        case 10:
          list[i].type = '下单使用';
          list[i].coin = '-' + list[i].coin;
          break;
        case 11:
          list[i].type = '过期';
          list[i].coin = '-' + list[i].coin;
          break;
        case 12:
          list[i].type = '素材被采纳';
          list[i].coin = '+' + list[i].coin;
          break;
        case 13:
          list[i].type = '取消订单返回';
          list[i].coin = '+' + list[i].coin;
          break;
        default:
          break;
      }
    }
  },
  closeDetail() {
    this.setData({
      showDetail: false
    })
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0,
      transformOrigin: '50% 50%',
      success: function (res) {
        
      }
    })
    this.data.animation = animation;
    animation.height(25).step();
    this.setData({
      animation: this.data.animation.export(),
    })
  },
  // 查看积分明细
  lookDetail() {
    this.setData({
      showDetail: !this.data.showDetail
    })
    if (this.data.showDetail === true) {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        delay: 0,
        transformOrigin: '50% 50%',
        success: function (res) {
          
        }
      })
      this.data.animation = animation;
      animation.height(500).step();
    }else {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
        delay: 0,
        transformOrigin: '50% 50%',
        success: function (res) {
          
        }
      })
      this.data.animation = animation;
      animation.height(25).step();
    }
    this.setData({
      animation: this.data.animation.export(),
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})