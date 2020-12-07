// pages/order/evaluate/evaluate.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: '',
    goodData: '',
    contentEmpty: 0,
    starEmpty: 0,
    imgArr: [],
    evaluateData: '',
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        orderId: options.id
      })
      this.getOrderInfo();
    }
  },
  // 获取订单详情
  getOrderInfo: function() {
    let self = this;
    http.HttpRequst(true, '/order/order-api/main-order-info', 2, '',
      {
        token: app.globalData.token,
        main_order_id: self.data.orderId
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            goodData: res.data.data.MainOrders[0],
            evaluateData: res.data.data
          })
          let newGoodData = self.data.goodData;
          let sku = [];
          let spus = [];
          for (let i = 0; i < newGoodData.orderSkus.length; i++) {
            newGoodData.orderSkus[i].stars = [
              {
                selected: '/images/order/none-star.png'
              },
              {
                selected: '/images/order/none-star.png'
              },
              {
                selected: '/images/order/none-star.png'
              },
              {
                selected: '/images/order/none-star.png'
              }, {
                selected: '/images/order/none-star.png'
              }
            ];
            newGoodData.orderSkus[i].star = '';
            newGoodData.orderSkus[i].content = '';
            newGoodData.orderSkus[i].images = '';
            newGoodData.orderSkus[i].starLevel = '';
          }
          self.setData({
            goodData: newGoodData,
          })
        }
      }
    )
  },
  // 评论星级
  selectEvalute: function (e) {
    let index = e.currentTarget.dataset.index;
    let starsindex = e.currentTarget.dataset.starsindex;
    let goodData = this.data.goodData;
    goodData.orderSkus[index].star = starsindex + 1;
    goodData.orderSkus[index].starLevel = starsindex + 1;
    for (let i = 0; i < goodData.orderSkus[index].stars.length; i++) {
      goodData.orderSkus[index].stars[i].selected = '/images/order/none-star.png';
      if (i <= starsindex) {
        goodData.orderSkus[index].stars[i].selected = '/images/order/star.png';
      }
    }
    this.setData({
      goodData: goodData
    })
  },
  // 获取评价
  getMessage: function (e) { 
    let index = e.currentTarget.dataset.index;
    let goodData = this.data.goodData;
    goodData.orderSkus[index].content = e.detail.value;
    this.setData({
      goodData: goodData
    })
  },
  // 评论上传照片
  uploadImg: function (e) { 
    let self = this;
    let index = e.currentTarget.dataset.index;
    let len = e.currentTarget.dataset.img.length;
    let goodData = self.data.goodData;
    self.setData({
      imgArr: []
    })
    let imgArr = self.data.imgArr;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let newTempFilePaths = '';
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.baseUrl + '/material/index/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (res) {
              var data = JSON.parse(res.data)
              //do something
              // imgArr = [];
              imgArr.push(data.data.url)
              self.setData({
                imgArr: imgArr
              })
              if (len == 0) {
                goodData.orderSkus[index].images = self.data.imgArr
                self.setData({
                  goodData: goodData
                })
              } else if (len > 5) {
                wx.showToast({
                  title: '最多只能上传6张图片',
                  icon: 'none',
                  duration: 1000
                })
              } else {
                newTempFilePaths = goodData.orderSkus[index].images.concat(self.data.imgArr)
                if (newTempFilePaths.length > 6) {
                  wx.showToast({
                    title: '最多只能上传6张图片',
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  goodData.orderSkus[index].images = self.uniq(newTempFilePaths)
                  self.setData({
                    goodData: goodData
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  // 去重
  uniq(arr) {
    var result = [];
    var len = '';
    len = arr.length;
    arr.forEach(function (v, i, arr) {  //这里利用map，filter方法也可以实现
      var bool = arr.indexOf(v, i + 1);  //从传入参数的下一个索引值开始寻找是否存在重复
      if (bool === -1) {
        result.push(v);
      }
    })
    return result;
  },
  // 删除图片
  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let imgIndex = e.currentTarget.dataset.imgindex;
    let imgNew = this.data.goodData;
    imgNew.orderSkus[index].images.splice(imgIndex, 1);
    this.setData({
      goodData: imgNew
    })
  },
  // 评价
  goEvaluate() {
    let self = this;
    let goodData = self.data.goodData;
    self.setData({
      contentEmpty: 0,
      starEmpty: 0
    })
    for (let i = 0; i < goodData.orderSkus.length; i++) {
      if (goodData.orderSkus[i].content == '') {
        self.setData({
          contentEmpty: self.data.contentEmpty + 1
        })

      } if (goodData.orderSkus[i].star == '') {
        self.setData({
          starEmpty: self.data.starEmpty + 1
        })
      }
    }
    if (self.data.contentEmpty != 0) {
      wx.showToast({
        title: '请评价内容',
        icon: 'none',
        duration: 1000
      })
    } else if (self.data.starEmpty != 0) {
      wx.showToast({
        title: '请评价星级',
        icon: 'none',
        duration: 1000
      })
    } else {
      let list = [];
      for (let i = 0; i < goodData.orderSkus.length; i++) {
        list.push({
          order_sku_id: goodData.orderSkus[i].id,
          content: goodData.orderSkus[i].content,
          imgs: goodData.orderSkus[i].images,
          level: goodData.orderSkus[i].star,
        })
      }
      http.HttpRequst(true, '/item/me-commet-api/create', 2, '',
        {
          token: app.globalData.token,
          order_id: self.data.evaluateData.order_id,
          list: list
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: '评价成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        }
      )
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

  }
})