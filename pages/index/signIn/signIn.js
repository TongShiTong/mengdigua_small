// pages/index/signIn/signIn.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sgData: [
      { title: '1', state: 0 },
      { title: '2', state: 0 },
      { title: '3', state: 0 },
      { title: '4', state: 0 },
      { title: '5', state: 0 },
      { title: '6', state: 0 },
      { title: '7', state: 0 },
      { title: '8', state: 0 },
      { title: '9', state: 0 },
      { title: '10', state: 0 },
      ],
    signFlag: true,
    isHelp: false,
    coupon: {},
    task: [],
    is_sign: 0,
    continue_day: 0,
    config_day: 0,
    helpContent: '',
    helpTitle: '',
    recordInfo: ''
  },
  getLike() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/like', 2, '', {
      token: app.globalData.token,
      token_type: 1
    },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            likeData: res.data.data
          })
        }
      }
    )
  },
  // 显示帮助中心
  showHelp() {
    this.setData({
      isHelp: true
    })
  },
  // 关闭帮助中心 关闭弹出页面
  close() {
    this.setData({
      isHelp: false,
    })
  },
  //签到
  signIn(){
    let self = this;
    if (this.data.is_sign == 0){
      http.HttpRequst(false, '/sign/user-sign-api/create', 2, '',
        {
          token: app.globalData.token
        },
        'POST',
        false,
        function (res) {
          self.loadingData();
          self.signInfo();
        }
      )
    }
  },
  //
  loadingData(){
    let self = this;
    let sgData = [
      { title: '1', state: 0 },
      { title: '2', state: 0 },
      { title: '3', state: 0 },
      { title: '4', state: 0 },
      { title: '5', state: 0 },
      { title: '6', state: 0 },
      { title: '7', state: 0 },
      { title: '8', state: 0 },
      { title: '9', state: 0 },
      { title: '10', state: 0 },
    ];
    //获取页面信息
    http.HttpRequst(false, '/sign/user-sign-api/info', 2, '',
      {
        token: app.globalData.token
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            coupon: {
              name: res.data.data.coupon_name,
              value: res.data.data.coupon_value,
            },
            is_sign: res.data.data.is_sign,
            continue_day: res.data.data.continue_day,
            task: res.data.data.list,
            config_day: res.data.data.config_day,
            receive_coin: res.data.data.receive_coin
          })
        }
        //遍历标出已签到的天数
        for (let i = 0; i < sgData.length; i++) {
          if (self.data.continue_day <= i) {
            break;
          }
          sgData[i].state = 1;
          self.setData({
            sgData
          })
        }
      }
    )
  },
  //帮助信息
  help() {
    let self = this;
    http.HttpRequst(false, '/content/content-api/view', 2, '',
      {
        type: 32,
        action_id: 0
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            helpContent: res.data.data.content,
            helpTitle: res.data.data.title
          })
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FFBA2F'
    })
    this.help();
    this.loadingData();
    this.calcWeek();
    this.signInfo();
    this.getLike();
  },
  // 签到信息
  calcWeek(){
    let now = new Date();
    let year = now.getFullYear();
    let month = Number(now.getMonth()) + 1;
    let target = `${year}-${month}-1`
    let time = new Date(target);
    let num = 0;
    if(Number(time.getDay()) != 7){
      num = Number(time.getDay());
    }
    console.log(Number(time.getDay()))
    this.setData({
      lastMonthNum:num
    })
  },
  signInfo() {
    let self = this;
    http.HttpRequst(true, "/sign/user-sign-api/record-info", 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            recordInfo: res.data.data
          })
        }
      }
    )
  },
  toSignRecord(){
    wx.navigateTo({
      url: '/pages/index/signIn/signInRecord/signInRecord',
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