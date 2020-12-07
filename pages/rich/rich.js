// pages/rich/rich.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rich: '',
    id: false, //商学院id
    title: '富文本',
    viewId:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    if (options.viewId==1) {
      this.setData({
        viewId:1
      })
      this.getContentView()
    }else if(options.viewId==33) {
      this.setData({
        viewId:33
      })
      this.getContentView()
    }
    if (options.title) {
      this.setData({
        title: options.title
      })
    }
    if (options.param) {
      this.setData({
        id: options.param,
      })
      this.getContent()
    }
    if (options.id) {
      this.setData({
        id: options.id,
        title: options.title,
        time: options.time
      })
      this.geSchoolDetail()
    } else {
      this.setData({
        rich: app.globalData.rich
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  // 注册协议
  getContentView() {
    let self = this;
    common.getContent(self, self.data.viewId, 'rich', function(res) {
      console.log(14788,res)
      self.setData({
        title: res.title
      })
    })
  },
  // 获取列表
  geSchoolDetail: function(status) {
    let self = this;
    http.HttpRequst(true, '/information/information-api/index', 2, '', {
        token: app.globalData.token,
        token_type: 1,
        id: self.data.id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            rich: res.data.data.list[0].content
          })
        }
      }
    )
  },


  // 富文本内容
  getContent: function(status) {
    let self = this;
    http.HttpRequst(true, '/floor/floor-content-api/get-content', 2, '', {
        id: self.data.id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            rich: res.data.data.content
          })
        }
      }
    )
  },
})