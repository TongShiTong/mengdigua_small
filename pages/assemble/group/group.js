// pages/assemble/group/group.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_page:0,
    list: [{
        title: '九重天的团天的团啊',
        img_url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1540629479,3296925730&fm=58',
        second: '86400000'
      },
      {
        title: '九重天的团',
        img_url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1540629479,3296925730&fm=58',
        second: '96400000'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        is_join_group: options.join,
        goodId: options.id,
        goodDeatil: app.globalData.goodDeatil,
        userInfo: app.globalData.userInfo
      })
      this.getGroupList()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    common.loadTheme(this)
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
    this.loadMore();
  },

 
  saveId(e) {
    let self = this;
    if (this.data.is_join_group == 2) {
      wx.showModal({
        title: '拼团提醒',
        content: '您已经参与团购啦，先去邀请好友满团吧！',
        cancelText: "好的",
        confirmText: "去链接",
        success(res) {
          if (res.confirm) {
            self.spread()
          } else if (res.cancel) {
          }
        }
      })
      return
    }
    self.setData({
      group_team_id: e.detail.id
    })
    self.showFormat()
  },
  //拼团团队列表
  getGroupList() {
    let self = this;
    common.getgoodsList(self, '/item/me-group-team-api/index', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
      item_id: self.data.goodId,
    }, 'gropTeamList')
  },
  showFormat() {
    let self = this;
    this.setData({
      showformat: true
    })
  },
  loadMore(){
    let self = this
    common.loadMore(self, '/item/me-group-team-api/index', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
      item_id: self.data.goodId,
    }, 'gropTeamList')

  },
  // 立即推广
  spread() {
    let self = this;
    http.HttpRequst(true, '/order/order-api/create-spread-order', 2, '', {
      token: app.globalData.token,
      item_id: self.data.goodId,
    },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.redirectTo({
            url: '/pages/assemble/joinGroup/joinGroup?type=2' + '&group_team_id=' + res.data.data.group_team_id
          })
        }
      }
    )
  }
  

})