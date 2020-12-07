// pages/member/newguide/newguide.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topPic:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.type) {
      this.setData({
        thType: options.type
      })
      this.getList()
      this.getPic()
    }
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


  // 获取列表
  getList: function (status) {
    let self = this;
    http.HttpRequst(true, '/information/information-api/theme-index', 2, '',
      {
        token: app.globalData.token,
        pid: self.data.thType,
        token_type: 1,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data
          })
        }
      }
    )
  },
  // 获取图片
  getPic: function (status) {
    let self = this;
    http.HttpRequst(true, '/banner/banner-api/index', 2, '',
      {
        seat_id:3
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            topPic: res.data.data.list[0].img_url || '/images/member/new.png'
          })
        }
      }
    )
  },
  goDeatil: function (e) {
    let id = e.currentTarget.id
    let name = e.currentTarget.dataset.name
    let pid = e.currentTarget.dataset.pid
    let index = e.currentTarget.dataset.index
    // if(index==0){
    //   id=pid
    // }
    wx.navigateTo({
      url: '/pages/member/shcoolList/shcoolList?type=' + id + "&titleName=" + name + "&pid="+ pid
    })
  },
})