// pages/member/fans/fans.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    startPage: 0,
    listData: '',
    tab: [
      {
        title: '我的会员',
        num:'0'
      },
      {
        title: '我的粉丝',
        num:'0'
      }
    ],
    memberList: '',
    fansList: '',
    memberPage: 0,
    fansPage: 0,
    tabIndex: 0,
    showFans:false,
    showFansTwo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      code: options.code,
      tabIndex: options.index,
      handInfo: app.globalData.handInfo
    })
    this.getMember();
    this.getFans();
  },
  // 会员列表
  getMember: function () {
    let self = this;
    http.HttpRequst(true, '/hand/hand-api/get-first-vip-list', 2, '',
      {
        token: app.globalData.token,
        start_page: self.data.memberPage,
        pages: 10
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            memberList: res.data.data
          })
          let num = "tab[" + 0 + "].num"
          self.setData({
            [num]: res.data.data.total_pages
          })
        }
      }
    )
  },
  // 粉丝列表
  getFans: function () {
    let self = this;
    http.HttpRequst(true, '/hand/fans-api/fans', 2, '',
      {
        token: app.globalData.token,
        start_page: self.data.fansPage,
        pages: 10
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            fansList: res.data.data
          })
          let num = "tab[" + 1 + "].num"
          self.setData({
            [num]: res.data.data.fans_num
          })
        }
      }
    )
  },
  // 选择tab
  selectTab(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.tabIndex == index) {
      return
    }else {
      this.setData({
        tabIndex: index
      })
      if (this.data.tabIndex == 0 && this.data.memberList == '') {
        this.getMember();
      } else if (this.data.tabIndex == 1 && this.data.fansList == '') {
        this.getFans();
      }
    }
  },
  // 复制邀请码
  copyInfo: function () {
    wx.setClipboardData({
      data: this.data.code,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      }
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
    let self = this;
    if(self.data.tabIndex == 0) {
      let pages = self.data.memberPage + 1;
      if (pages > Math.ceil(self.data.memberList.total_pages / 10) - 1) {
        return false
      } else {
        self.setData({
          memberPage: pages
        })
        http.HttpRequst(true, '/hand/hand-api/get-first-vip-list', 2, '',
          {
            token: app.globalData.token,
            start_page: self.data.memberPage,
            pages: 10
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              let listData = "memberList.list";
              let list = res.data.data.list;
              let newListData = self.data.memberList.list.concat(list);
              self.setData({
                [listData]: newListData
              })
            }
          }
        )
      }
    } else if (self.data.tabIndex == 1) {
      let pages = self.data.fansPage + 1;
      if (pages > Math.ceil(self.data.fansList.total_pages / 10) - 1) {
        return false
      } else {
        self.setData({
          fansPage: pages
        })
        http.HttpRequst(true, '/hand/fans-api/fans', 2, '',
          {
            token: app.globalData.token,
            start_page: self.data.fansPage,
            pages: 10
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              let listData = "fansList.list";
              let list = res.data.data.list;
              let newListData = self.data.fansList.list.concat(list);
              self.setData({
                [listData]: newListData
              })
            }
          }
        )
      }
    }
  },
  showfansShadow(e){
    let self = this;
    self.setData({
      showFans:true
    })
  },
   showfansShadowTwo(e) {
    let self = this;
    self.setData({
      showFansTwo: true
    })
  },
  closeFans(e){
    let self = this;
    self.setData({
      showFansTwo: false,
      showFans: false
    })
  }

 
})