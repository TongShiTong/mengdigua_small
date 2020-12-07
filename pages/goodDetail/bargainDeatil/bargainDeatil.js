// pages/goodDetail/bargainDeatil/bargainDeatil.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
const formatTime = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalHeight: app.globalData.totalHeight,
    showShare: false,
    helpList: [],
    isShowModal: false,
    img_url: 'https://social-shop.oss-cn-hangzhou.aliyuncs.com/__liemi__/default/BFWXZMNTHK123457_1560133174.jpg',
    bargainData: '', //砍价详情
    bargainPrice: 0,
    showPrice: false,
    clickOne: false,
    launchOptions: false,
    myClick: false,
    showBar: false
  },
  cloosePhone() {
    this.setData({
      isBindPhone: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    if (options.bId) {
      this.setData({
        id: options.bId,
        launchOptions: true
      })
    }
    if (options.scene) {
      this.setData({
        launchOptions: true
      })
      let scene = decodeURIComponent(options.scene);
      scene = app.hrefObj(scene);
      this.setData({
        launchOptions: true,
        id: scene.bId
      })

    }
    common.loadTheme(this)
    let path = `/pages/goodDetail/bargainDeatil/bargainDeatil?bId=${this.data.id}`
    common.handleShareUrl(this, path)
    this.getLike()
    this.getDetailList()
    this.getDetailPoster()

  },
  closeShare(){
    this.setData({
      showShare:false
    })
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
    this.setData({
      isShowModal: app.globalData.showModal,
      isBindPhone: app.globalData.isBindPhone
    })
    this.getDetail()
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
    clearInterval(this.data.timeInterval)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '砍价详情',
      path: this.data.sharePath
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > 50) {
      this.setData({
        showBar: true
      })
    }
    if (e.scrollTop < 50) {
      this.setData({
        showBar: false
      })
    }
  },
  getLike() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/like', 2, '', {
        token: app.globalData.token,
        token_type: 1
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            likeData: res.data.data
          })
        }
      }
    )
  },
  openModal() {
    this.setData({
      showShare: true
    })
  },
  getDetail() {
    let self = this;
    http.HttpRequst(false, '/bargain/me-bargain-api/detail', 2, '', {
        token: app.globalData.token,
        bargain_id: self.data.id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            bargainData: res.data.data,
            bargainPrice: res.data.data.cut
          })
          if (!self.data.timeInterval) {
            setTimeout(() => {
              self.setData({
                isShowModal: app.globalData.showModal,
                isBindPhone: app.globalData.isBindPhone
              })
              if (app.globalData.userInfo.uid == self.data.bargainData.uid) {
                self.setData({
                  myClick: true
                })
              }
            }, 1000)

            let timeIn = setInterval(() => {
              self.timeCountDown(self.data.bargainData.create_time, self.data.bargainData.end_time);
            }, 1000)
            self.setData({
              timeInterval: timeIn
            })
          }

        }
      }
    )
  },
  // 
  getDetailList() {
    let self = this;
    http.HttpRequst(false, '/bargain/me-bargain-api/get-cut-list', 2, '', {
        token: app.globalData.token,
        id: self.data.id,
        start_page: 0,
        pages: 10
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            helpList: res.data.data.list
          })
        }
      }
    )
  },
  // 获取砍价海报
  getDetailPoster() {
    let self = this;
    http.HttpRequst(false, '/bargain/me-bargain-api/get-poster', 2, '', {
        token: app.globalData.token,
        bargain_id: self.data.id,
        type: 1,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          if (res.data.data) {
            self.setData({
              shareImg: res.data.data[0]
            })
          }
        }
      }
    )
  },
  // 砍
  getPrice() {
    let self = this;
    if (app.globalData.showModal || app.globalData.isBindPhone) {
      self.setData({
        isShowModal: app.globalData.showModal,
        isBindPhone: app.globalData.isBindPhone
      })
      return
    }
    if (self.data.clickOne) {
      return
    }

    self.data.clickOne = true
    http.HttpRequst(true, '/bargain/me-bargain-api/help-cut', 2, '', {
        token: app.globalData.token,
        id: self.data.id
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          if (res.data.data) {}
          self.setData({
            bargainPrice: res.data.data,
            showPrice: true,
            clickOne: false
          })
          self.getDetail()
          self.getDetailList()
        }
        self.data.clickOne = false
      }
    )
  },
  // 
  closeModel() {
    let self = this
    self.setData({
      showPrice: false
    })
  },

  timeCountDown(startTime, endTime) {
    var nowTime = Date.parse(new Date());
    // var nowTime = new Date(this.data.detailData.seckillItem.now_time.replace(/-/g, "/")).getTime(); // 现在时间
    var date1 = new Date(startTime.replace(/-/g, "/")).getTime(); // 开始时间
    var date2 = new Date(endTime.replace(/-/g, "/")).getTime(); // 结束时间

    if (nowTime < date1) {
      this.setData({
        skillStatus: 1,
        time: formatTime.skillTwo(date1 - nowTime)
      })
    } else if (nowTime >= date1 && nowTime <= date2) {
      this.setData({
        skillStatus: 2,
        time: formatTime.skillTwo(date2 - nowTime)
      })
    } else if (nowTime > date2) {
      this.setData({
        skillStatus: 3,
        ['bargainData.bargainData']: 3
      })
      clearInterval(this.data.timeInterval)
    }
  },
  goOrder() {
    app.globalData.oneOrder = this.data.bargainData;
    wx.navigateTo({
      url: '/pages/goodDetail/confirmOrder/confirmOrder?from=bargain'
    })
  },
  goback() {
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + this.data.bargainData.item_id
    })
  },
  goOrderDetail() {
    wx.navigateTo({
      url: '/pages/order/orderDetail/orderDetail?id=' + this.data.bargainData.main_order_id
    })
  },
  goDetail() {
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + this.data.bargainData.item_id
    })
  }
})