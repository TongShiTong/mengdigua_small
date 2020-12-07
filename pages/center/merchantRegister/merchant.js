// pages/center/merchantRegister/merchant.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowMask:false,
    webSite:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getContent();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openMask(){
    this.setData({
      isShowMask:true
    })
  },
  closeMask(){
    this.setData({
      isShowMask:false
    })
  },
  copy(){
    //临时写死 待调
    wx.setClipboardData({
      data: this.data.webSite,
      success:()=>{
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  getContent(){
    let url = `/content/content-api/view`
    http.HttpRequst(true, url, 2, '',
      {
        type:7
      },
      'POST',
      false,
       (res)=> {
        if (res.data.errcode == 0) {
          this.setData({
            content:res.data.data.content,
            webSite:res.data.data.param
          })
        }
      }
    )
  }
})