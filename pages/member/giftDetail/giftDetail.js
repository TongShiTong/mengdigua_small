// pages/member/giftDetail/giftDetail.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userInfo: '',
    detailData: '',
    autoplay: true,
    indicatorDots: true,
    property: '',
    allProperty: '',
    selectArr: [],
    showMoadl: false,
    buyNum: 1,
    selectData: '',
    showShare: false,
    shareImg: '',
    // uid: '',
    shareCode: '',
    handInfo: ''
  },
  cloosePhone() {
    this.setData({
      isBindPhone: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    let path = `/pages/member/giftDetail/giftDetail?id=${options.id}`
    common.handleShareUrl(this, path)
    if (options.id) {
      this.setData({
        id: options.id
      })
    } else if (options.scene) {// 获取场景值
      let scene = decodeURIComponent(options.scene);
      scene = this.hrefObj(scene);
      this.setData({
        // uid: scene.uid,
        shareCode: scene.share_code,
        id: scene.item_id
      })
      this.getSuperUser();
    }
    this.getDetail();
    this.getProperty();
    this.getAllProperty();
  },
  // 礼包详情
  getDetail: function () {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/view', 2, '',
      {
        token: app.globalData.token,
        item_id: self.data.id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            detailData: res.data.data
          })
        }
      }
    )
  },
  // 预览商品图片
  previewBanner: function () {
    if (this.data.detailData.itemImgs != '') {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: this.data.detailData.itemImgs // 需要预览的图片http链接列表
      })
    }
  },
  // 所有商品规格
  getAllProperty: function () {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/get-all-property', 2, '',
      {
        item_id: self.data.id,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            allProperty: res.data.data
          })
        }
      }
    )
  },
  // 商品规格
  getProperty: function () {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/get-property', 2, '',
      {
        token: app.globalData.token,
        item_id: self.data.id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < res.data.data[i].children.length; j++) {
              res.data.data[i].children[j].isSelect = false;
            }
          }
          self.setData({
            property: res.data.data
          })
          let arr = [];
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push('')
          }
          self.setData({
            selectArr: arr
          })
        }
      }
    )
  },
  // 获取用户身份
  getUserInfo() {
    let self = this;
    http.HttpRequst(false, '/member/user-api/info', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            userInfo: res.data.data,
            isShowModal: app.globalData.showModal
          })
          if (self.data.userInfo.role == 1) {
            self.getHandInfo()
          }
          app.globalData.userInfo = res.data.data;
        }
      }
    )
  },
  // 获取用户推手
  getHandInfo() {
    let self = this;
    http.HttpRequst(false, '/hand/hand-api/info', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            handInfo: res.data.data
          })
          app.globalData.handInfo = res.data.data;
        }
      }
    )
  },
  // 打开选择规格
  buyGift() {
    if (app.globalData.showModal) {
      this.setData({
        isShowModal: app.globalData.showModal
      })
      return
    }
    if (app.globalData.isBindPhone) {
      this.setData({
        isBindPhone: true,
      
      })
      return
    }
    if (app.globalData.showModal) {
      this.setData({
        isShowModal: app.globalData.showModal
      })
      return
    }
    if (this.data.userInfo.is_invited == 0) {
      wx.navigateTo({
        url: '/pages/bindInviteCode/bindInviteCode',
      })
    }else {
      // this.setData({
      //   showMoadl: true
      // })
      let e={
        currentTarget:{
          dataset:{
            childrenindex:0,
            index:0
          }
        }
      };
      this.selectValue(e)
    }
  },
  // 关闭选择规格
  closeModal() {
    this.setData({
      showMoadl: false
    })
  },
  // 增加购买数量
  addNum: function () {
    if (this.data.selectData == '') {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 1000
      })
    } else {
      let num = Number(this.data.buyNum);
      num += 1;
      if (num >= this.data.selectData.stock) {
        num = this.data.selectData.stock;
        wx.showToast({
          title: '已至最大库存',
          icon: 'none',
          duration: 1000
        })
      }
      this.setData({
        buyNum: num
      })
    }
  },
  // 减少购买数量
  reduce: function () {
    if (this.data.selectData == '') {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 1000
      })
    } else {
      let num = Number(this.data.buyNum);
      num -= 1;
      if (num <= 1) {
        num = 1
      }
      this.setData({
        buyNum: num
      })
    }
  },
  // 选择规格
  selectValue: function (e) {
    let index = e.currentTarget.dataset.index;
    let childrenIndex = e.currentTarget.dataset.childrenindex;
    let selectId = 'selectArr[' + index + ']';
    this.setData({
      [selectId]: this.data.property[index].children[childrenIndex].value_id
    })
    let propertyArr = this.data.property;
    for (let i = 0; i < propertyArr.length; i++) {
      for (let j = 0; j < propertyArr[i].children.length; j++) {
        if (this.data.selectArr.indexOf(propertyArr[i].children[j].value_id) > -1) {
          propertyArr[i].children[j].isSelect = true;
        } else {
          propertyArr[i].children[j].isSelect = false;
        }
      }
    }
    this.setData({
      property: propertyArr
    })
    let selected = this.data.selectArr.join(',');
    for (let i = 0; i < this.data.allProperty.length; i++) {
      if (this.data.allProperty[i].value_ids == selected) {
        this.setData({
          selectData: this.data.allProperty[i]
        })
      }
    }
    this.confirmBuy()
  },
  // 确认够买
  confirmBuy: function () {
    if (this.data.selectData.value_names) {
      if (this.data.detailData.status == 5) {
        let orderData = this.data.detailData;
        orderData.selectData = this.data.selectData;
        orderData.buy_num = this.data.buyNum;
        app.globalData.oneOrder = orderData;
        wx.navigateTo({
          url: '/pages/goodDetail/confirmOrder/confirmOrder?from=giftdetail'
        })
        this.setData({
          showMoadl: false
        })
      } else if (this.data.detailData.status == 7) {
        wx.showToast({
          title: '该商品已下架',
          icon: 'none',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '无法购买该商品',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 1000
      })
    }
  },
  // 分享礼包
  shareGift() {
    let self = this;
    http.HttpRequst(true, '/item/me-item-api/share-gift', 2, '',
      {
        token: app.globalData.token,
        item_id: self.data.id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            shareImg: res.data.data[0],
            showShare: true,
          })
        }
      }
    )
  },
  // 分享调用点接口
  shareSuccess() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/share-item', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {

        }
      }
    )
  },
  // 解析小程序的url
  hrefObj(url) {
    var localarr = url.split('&');
    var tempObj = {};
    for (var i = 0; i < localarr.length; i++) {
      tempObj[localarr[i].split('=')[0]] = localarr[i].split('=')[1];
    }
    return tempObj;
  },
  // 获取上级信息
  getSuperUser() {
    let self = this;
    if (self.data.shareCode) {
      http.HttpRequst(false, '/hand/fans-api/create-fans', 2, '',
        {
          token: app.globalData.token,
          share_code: self.data.shareCode
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            // self.fans();
          }
        }
      )
    }
  },
  // 生成上下级 粉丝
  fans() {
    let self = this;
    http.HttpRequst(false, '/hand/fans-api/create-fans-from-share', 2, '',
      {
        token: app.globalData.token,
        puid: self.data.uid
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
        }
      }
    )
  },
  // 跳转
  jumpGift() {
    wx.navigateTo({
      url: '/pages/member/promote/promote'
    })
  },
  // 返回
  jumpBack() {
    wx.reLaunch({
      url: '/pages/index/index',
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
    this.getUserInfo();
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
    return {
      title: '礼包',
      path: this.data.sharePath
    }
    // return {
    //   title: '礼包',
    //   path: '/pages/member/giftDetail/giftDetail?id=' + self.data.id
    // }
  }
})