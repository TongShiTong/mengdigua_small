// pages/order/applicationReturn/applicationReturn.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: '',
    submit: false,
    goodStatus: [
      {
        title: '未收到货物'
      },
      {
        title: '已收到货物'
      },
    ],
    statusIndex: null,
    statusText: '',
    showGood: false,
    reasonList: '',
    reasonIndex: null,
    reasonText: '',
    remark: '',
    showReturn: false,
    imgList: '',
    maxPrice: '',
    imgArr: [],
    refunStatus: '', // 1仅退款 2退款退货
    refundInfo: "",//退款金额和邮费,
    maxPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      orderData: app.globalData.orderReturn,
      returnShop: app.globalData.returnShop,
    })
    if (options.order_pay_amount){
      this.setData({
        order_pay_amount: options.order_pay_amount
      })
    }
   
   
    // 货物状态
    if (options.index && options.index==0) {
      this.setData({
        statusIndex: options.index,
        statusText: this.data.goodStatus[options.index].title
      })
    } else if (options.index && options.index == 1) {
      this.setData({
        statusIndex: options.index,
        statusText: this.data.goodStatus[options.index].title
      })
    }
    // 判断退款还是退款退货
    if (options.refunStatus) {
      this.setData({
        refunStatus: options.refunStatus
      })
    }
    this.getReason();
    this.getRefundAmount();
  },
  // 获取退款金额和邮费
  getRefundAmount() {
    let self = this;
    http.HttpRequst(true, '/order/me-refund-api/postage', 2, '',
      {
        token: app.globalData.token,
        id: self.data.orderData.id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            refundInfo: res.data.data,
            maxPrice: res.data.data.is_postage == 1 ? (parseFloat(res.data.data.refund_price) + parseFloat(res.data.data.postage)).toFixed(2) : res.data.data.refund_price
          })
        }
        console.log('金额是', (parseFloat(self.data.refundInfo.refund_price) + parseFloat(self.data.refundInfo.postage)).toFixed(2) )
      }
    )
  },
  // 修改金额
  getPrcie(e) {
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    e.detail.value = e.detail.value.substr(1)
    if (Number(e.detail.value) > Number(this.data.refundInfo.refund_price)) {
      this.setData({
        maxPrice: this.data.refundInfo.refund_price
      })
    } else {
      if (reg.test(Number(e.detail.value))) {
        this.setData({
          maxPrice: e.detail.value
        })
      }
    }
  },
  // 获取退款原因
  getReason() {
    let self = this;
    http.HttpRequst(true, '/order/me-refund-api/run', 2, '',
      {
        token: app.globalData.token
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            reasonList: res.data.data
          })
        }
      }
    )
  },
  // 选择货物状态
  selectStatus: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      statusIndex: index,
      statusText: this.data.goodStatus[index].title,
      showGood: false
    })
  },
  // 显示选择货物状态
  showGoodModal: function() {
    this.setData({
      showGood: true
    })
  },
  // 关闭选择货物状态
  closeGood: function () {
    this.setData({
      showGood: false
    })
  },
  // 选择退款原因
  selectReason: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      reasonIndex: index,
      reasonText: this.data.reasonList[index].name,
      showReturn: false
    })
  },
  // 显示退款原因
  showReturnModal: function () {
    this.setData({
      showReturn: true
    })
  },
  // 关闭退款原因
  closeRerurn: function () {
    this.setData({
      showReturn: false
    })
  },
  // 上传图片
  uploadImg: function () {
    let self = this;
    let len = self.data.imgList.length;
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
        var tempFilePaths = res.tempFilePaths;
        var newTempFilePaths = '';
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
              imgArr.push(data.data.url)
              self.setData({
                imgArr: imgArr
              })
              if (len == 0) {
                self.setData({
                  imgList: self.data.imgArr
                })
              } else if (len > 5) {
                wx.showToast({
                  title: '最多只能上传6张图片',
                  icon: 'none',
                  duration: 1000
                })
              } else {
                newTempFilePaths = self.data.imgList.concat(self.data.imgArr)
                if (newTempFilePaths.length > 6) {
                  wx.showToast({
                    title: '最多只能上传6张图片',
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  newTempFilePaths = self.uniq(newTempFilePaths)
                  self.setData({
                    imgList: newTempFilePaths
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
    let img = this.data.imgList;
    img.splice(index, 1);
    this.setData({
      imgList: img
    })
  },
  // 获取退款说明
  getRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  addNumber: function (num1, num2) {
    num1 = parseFloat(num1)
    num2 = parseFloat(num2)
    var finaly = (num2 + num1).toFixed(2)
    return finaly
  },
  // 确定提交
  confirmSubmit: function (e) {
    let self = this;
    self.setData({
      formId: e.detail.formId
    })
    common.saveForm(self)
    if (self.data.orderData.status == 1) {
      if (self.data.reasonText == '') {
        wx.showToast({
          title: '请选择退款原因',
          icon: 'none',
          duration: 1000
        })
      }  else {
        http.HttpRequst(true, '/order/me-refund-api/refund-back', 2, '',
          {
            token: app.globalData.token,
            id: self.data.orderData.id,
            name: self.data.reasonList[self.data.reasonIndex].name,
            img_url: self.data.imgList,
            remark: self.data.remark,
            price_total: self.data.refundInfo.is_postage == 1 ? this.addNumber(self.data.refundInfo.refund_price, self.data.refundInfo.postage) : self.data.maxPrice == 0 ? (self.data.order_pay_amount - self.data.refundInfo.postage) : self.data.maxPrice
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(() => {
                self.setData({
                  submit: true
                })
              }, 1000)
            }
          }
        )
      }
    } else if (self.data.orderData.status == 2) {
      if (self.data.reasonText == '') {
        wx.showToast({
          title: '请选择退货原因',
          icon: 'none',
          duration: 1000
        })
      }  else {
        // 退款退货的退货
        if (self.data.refunStatus == 2) {
          http.HttpRequst(true, '/order/me-refund-api/goods-back', 2, '',
            {
              token: app.globalData.token,
              id: self.data.orderData.id,
              name: self.data.reasonList[self.data.reasonIndex].name,
              state: self.data.statusIndex,
              remark: self.data.remark,
              img_url: self.data.imgList,
              price_total: self.data.maxPrice,
              refund_status: '1'
            },
            'POST',
            false,
            function (res) {
              if (res.data.errcode == 0) {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(() => {
                  self.setData({
                    submit: true
                  })
                }, 1000)
              }
            }
          )
        } else if (self.data.refunStatus == 1) {  // 退款退货的仅退款
          http.HttpRequst(true, '/order/me-refund-api/refund-back', 2, '',
            {
              token: app.globalData.token,
              id: self.data.orderData.id,
              name: self.data.reasonList[self.data.reasonIndex].name,
              img_url: self.data.imgList,
              remark: self.data.remark,
              price_total: self.data.maxPrice
            },
            'POST',
            false,
            function (res) {
              if (res.data.errcode == 0) {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(() => {
                  self.setData({
                    submit: true
                  })
                }, 1000)
              }
            }
          )
        }
      }
    }
  },
  // 跳转个人中心
  jumpReturnList() {
    wx.reLaunch({
      url: '/pages/center/center'
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
  // 跳转店铺详情
  jumpShopDetail(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shop/shopDetail/shopDetail?id=' + id
    })
  },
})