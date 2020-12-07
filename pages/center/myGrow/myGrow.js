// pages/center/myGrow/myGrow.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHelp: false,
    isShowModal: false,
    taskData: [],
    detailed: [],
    growth: "0", //用户成长值
    listData: '',
    startPage: 0,
    userInfo: '',
    deg: '',
    content: '',
    helpTitle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    var self = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#D1BC9D'
    })
    //用户身份
    http.HttpRequst(false, '/member/user-api/info', 2, '',
      { token: app.globalData.token },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            userInfo: res.data.data
          })
          self.getGrow()
        }
      }
    );
    //获取成长值任务
    http.HttpRequst(false, '/member/growth-api/get-growth-task', 2, '',
      { token: app.globalData.token },
      'POST', false,
      function (res) {
        self.changeList(res.data.data.list);
        if (res.data.errcode == 0) {
          self.setData({
            taskData: res.data.data.list
          })
        }
      }
    );
    //获取成长值明细
    http.HttpRequst(false, '/member/growth-api/get-growth-list', 2, '',
      { 
        token: app.globalData.token,
        start_page: self.data.startPage,
        pages: 10
      },
      'POST', false,
      function (res) {
        self.changeList(res.data.data.list);
        if (res.data.errcode == 0) {
          self.setData({
            detailed: res.data.data.list,
            listData: res.data.data
          })
        }
      }
    )
    // 帮助信息
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
  //获取成长值信息
  getGrow() {
    let self = this;
    http.HttpRequst(false, '/member/growth-api/get-info', 2, '',
      { token: app.globalData.token },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          let total = Number(res.data.data.growth) + Number(res.data.data.less_growth);
          let deg = (Number(res.data.data.growth) / total) * 100;
          deg = deg.toFixed(2);
          self.setData({
            growth: res.data.data,
            deg: deg
          })
        }
      }
    );
  },
  // 加载更多任务
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(true, '/member/growth-api/get-growth-list', 2, '',
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
            let newList = self.data.detailed.concat(res.data.data.list)
            self.setData({
              detailed: newList
            })
          }
        }
      )
    }
  },
  //重新定义获取的list
  changeList: function (list) {
    for (let i = 0; i < list.length; i++) {
      switch (Math.ceil(list[i].type)) {
        case 1:
          list[i].type = '注册';
          break;
        case 2:
          list[i].type = '签到';
          break;
        case 3:
          list[i].type = '购买商品';
          break;
        case 4:
          list[i].type = '推荐购买';
          break;
        case 5:
          list[i].type = 'VIP商品';
          break;
        case 6:
          list[i].type = '后台扣除';
          break;
        default:
          break;
      }
    }
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