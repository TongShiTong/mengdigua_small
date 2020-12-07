// pages/center/refund/editRefund/editRefund.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')

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
    showReturn: false,
    companyList: '',
    company: '',
    companyIndex: 0,
    companyId: '',
    logNo: '',
    maxPrice: '',
    showLog: false,
    imgList: '',
    imgArr: [],
    refundInfo: ""//退款金额和邮费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    app.globalData.editOrderReturn.price_total = Number(app.globalData.editOrderReturn.price_total).toFixed(2);
    this.setData({
      orderData: app.globalData.editOrderReturn,
      statusIndex: app.globalData.editOrderReturn.state,
      statusText: this.data.goodStatus[app.globalData.editOrderReturn.state].title,
      company: app.globalData.editOrderReturn.mail_name,
      logNo: app.globalData.editOrderReturn.mail_no,
      companyId: app.globalData.editOrderReturn.mail_code,
    })
    this.getReason();
    if (this.data.orderData.refund_status == 2 || this.data.orderData.refund_status == 3) {
      this.getLog();
    }
    this.getImg();
    this.getRefundAmount();
  },
  // 获取图片
  getImg() {
    let img = []
    if (this.data.orderData.meRefundImgs.length>0) {
      for (let i = 0; i < this.data.orderData.meRefundImgs.length;i++) {
        img.push(this.data.orderData.meRefundImgs[i].img_url)
        this.setData({
          imgList: img
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
  // 获取物流公司
  getLog() {
    let self = this;
    http.HttpRequst(true, '/order/me-refund-api/delivery', 2, '',
      {
        token: app.globalData.token
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            companyList: res.data.data
          })
        }
      }
    )
  },
  // 获取退款金额和邮费
  getRefundAmount() {
    let self = this;
    http.HttpRequst(true, '/order/me-refund-api/postage', 2, '',
      {
        token: app.globalData.token,
        id: self.data.orderData.orderSku[0].id
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            refundInfo: res.data.data,
            is_postage: res.data.data.is_postage,
            ['orderData.price_total']: res.data.data.is_postage == 1 ? (parseFloat(res.data.data.refund_price) + parseFloat(res.data.data.postage)).toFixed(2): self.data.refundInfo.refund_price,
            maxPrice: res.data.data.refund_price
          })
          console.log()
          console.log(self.data.orderData)
          console.log(self.data.maxPrice)
        }
      }
    )
  },
  // 选择物流公司
  selectCompany(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    this.setData({
      companyIndex: index,
      companyId: id,
      company: this.data.companyList[index].name,
      showLog: false
    })
  },
  // 选择货物状态
  selectStatus: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      statusIndex: index,
      statusText: this.data.goodStatus[index].title,
      showGood: false
    })
  },
  // 显示选择货物状态
  showGoodModal: function () {
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
    let reasonText = 'orderData.bec_type'
    this.setData({
      reasonIndex: index,
      [reasonText]: this.data.reasonList[index].name,
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
  // 显示选择物流
  showLogSelect() {
    this.setData({
      showLog: true
    })
  },
  // 关闭选择物流
  closeLog() {
    this.setData({
      showLog: false
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
    let remark = 'orderData.remark'
    this.setData({
      [remark]: e.detail.value
    })
  },
  // 确定提交
  confirmSubmit: function () {
    let self = this;
    // 修改退款申请
    console.log(self.data.orderData)
    if (self.data.orderData.type == 1) {
      if (self.data.orderData.bec_type == '') {
        wx.showToast({
          title: '请选择退款原因',
          icon: 'none',
          duration: 1000
        })
      } else if (Number(self.data.orderData.price_total) == 0) {
        wx.showToast({
          title: '退款金额不能为0',
          icon: 'none',
          duration: 1000
        })
      }else {
        console.log('order',self.data.orderData.price_total)
        console.log(self.data.maxPrice)
        http.HttpRequst(true, '/order/me-refund-api/add', 2, '',
          {
            token: app.globalData.token,
            id: self.data.orderData.orderSku[0].id,
            name: self.data.orderData.bec_type,
            remark: self.data.orderData.remark,
            img_urls: self.data.imgList,
            type: self.data.orderData.type,
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
    } else if (self.data.orderData.type == 2 && (self.data.orderData.refund_status == 1 || self.data.orderData.refund_status == 4)) {  // 修改退货申请
      if (self.data.orderData.bec_type == '') {
        wx.showToast({
          title: '请选择退款原因',
          icon: 'none',
          duration: 1000
        })
      } else if (Number(self.data.orderData.price_total) == 0) {
        wx.showToast({
          title: '退款金额不能为0',
          icon: 'none',
          duration: 1000
        })
      } else {
        http.HttpRequst(true, '/order/me-refund-api/add', 2, '',
          {
            token: app.globalData.token,
            id: self.data.orderData.orderSku[0].id,
            name: self.data.orderData.bec_type,
            remark: self.data.orderData.remark,
            state: self.data.statusIndex,
            img_urls: self.data.imgList,
            type: self.data.orderData.type,
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
    } else if (self.data.orderData.type == 2 && (self.data.orderData.refund_status == 2 || self.data.orderData.refund_status == 3)) { // 修改退货申请 填写物流单号
      if (self.data.company == '') {
        wx.showToast({
          title: '请选择物流公司',
          icon: 'none',
          duration: 1000
        })
      } else if (self.data.logNo == '') {
        wx.showToast({
          title: '请填写物流单号',
          icon: 'none',
          duration: 1000
        })
      } else {
        http.HttpRequst(true, '/order/me-refund-api/agree', 2, '',
          {
            token: app.globalData.token,
            id: self.data.orderData.id,
            img_url: self.data.imgList,
            mail_no: self.data.logNo,
            mail_name: self.data.companyList[self.data.companyIndex].name,
            mail_code: self.data.companyList[self.data.companyIndex].id
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
  },
  // 修改金额
  getPrcie(e) {
    let maxPrice = 'orderData.price_total';
    let self = this
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    e.detail.value = (e.detail.value).substr(1)
    if (parseFloat(e.detail.value) > parseFloat(this.data.maxPrice)) {
      this.setData({
        [maxPrice]: self.data.refundInfo.is_postage == 1 ? (parseFloat(self.data.refundInfo.refund_price) + parseFloat(self.data.refundInfo.postage)).toFixed(2) : self.data.refundInfo.fund_price
      })
    } else {
      if (reg.test(Number(e.detail.value))){
        this.setData({
          [maxPrice]: (e.detail.value)
        })
      }else {
        this.setData({
          [maxPrice]: this.data.maxPrice
        })
      }
    }
  },
  // 获取物流单号
  getLogNo(e) {
    this.setData({
      logNo: e.detail.value
    })
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

  }
})