// pages/assemble/joinGroup/joinGroup.js
const common = require('../../../utils/common.js')
const http = require('../../../utils/http.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    type: 3, // 1 失败  2  成功 3 分享
    groupList: false,
    groupSecondTime: false,
    groupSecond: 0,
    isShowModal: false, // 确认信息
    isShowModalTwo: false, //保存图片
    showformat: false, //发起参团
    shopDetail: false,
    goodId: false,
    allGroupList: false, //大家都在拼写
    start_page: 0,
    sharePath: "",
    shareCode: "",
    listIn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    this.getUser();
    if (options.listIn) {
      this.setData({
        listIn: true,
      })
    }
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      scene = common.hrefObj(scene);
      let b = scene.group.split('/');
      this.setData({
        type: b[1],
        group_team_id: b[0]
      })
    }

    if (options.group) {
      let b = options.group.split('/');
      this.setData({
        type: b[1],
        group_team_id: b[0]
      })
    } else {
      if (options.type) {
        this.setData({
          type: options.type,
        })
      }
      if (options.group_team_id || options.group) {
        this.setData({
          group_team_id: options.group_team_id || options.group
        })
      }
    }
    this.getAllGroupList()
    let path = `pages/assemble/joinGroup/joinGroup?group_team_id=${this.data.group_team_id}&type=3`
    common.handleShareUrl(this, path)
  },
  cloosePhone() {
    this.setData({
      isBindPhone: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
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
    this.getUser();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '拼团',
      path: this.data.sharePath
    }
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
          if (self.data.group_team_id) {
            self.getGroupList();
            self.getPoster()
          }
          app.globalData.token = res.data.data.token.token
          self.setData({
            isBindPhone: app.globalData.isBindPhone,
            userInfo: res.data.data,
            
          })
          setTimeout(() => {
            self.setData({
              isShowModal: app.globalData.showModal, // 确认信息
            })
          },500)
        }
      }
    )
  },
  jumpGrounp: function() {
    wx.navigateTo({
      url: '/pages/assemble/index'
    })
  },
  // 平团列表
  getGroupList() {
    let self = this;
    common.getGroupList(self, self.data.group_team_id, function(res) {
      if (self.data.type == 3 || self.data.type == 2) {
        self.setData({
          goodId: res.team_info.item_id,
          isShowModa: app.globalData.showModal,
        })
        self.getDetail();
      }
    })

  },
  getPoster() {
    let self = this;
    common.getPoster(self, '/item/me-item-api/merger-img', {
      group_team_id: self.data.group_team_id
    })
  },
  close() {
    this.setData({
      isShowModalTwo: false
    })
  },
  openModel() {
    if (app.globalData.showModal) {
      this.setData({
        isShowModal: app.globalData.showModal
      })
      return
    }
    this.setData({
      isShowModalTwo: true
    })
  },
  // 商品详情
  getDetail: function() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/view', 2, '', {
        token: app.globalData.token,
        item_id: self.data.goodId
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            shopDetail: res.data.data
          })
        }
      }
    )
  },
  showFormat() {
    let self = this;
    if (app.globalData.showModal) {
      this.setData({
        isShowModal: app.globalData.showModal
      })
      return
    }
    if (app.globalData.showModal) {
      return
    }
    if (self.data.groupSecond == 0) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + self.data.goodId
      })
    } else {
      this.setData({
        showformat: true
      })
    }

  },
  //拼团列表大家
  getAllGroupList() {
    let self = this;
    common.getgoodsList(self, '/item/group-api/group-item-list', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    }, 'allGroupList')
  },
  loadMore() {
    let self = this
    common.loadMore(self, '/item/group-api/group-item-list', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
    }, 'allGroupList')

  },
  goback() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})