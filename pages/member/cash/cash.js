// pages/member/cash/cash.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankName: '',
    bankId: '',
    bankList: '',
    bankInfo: '',
    userInfo: '',
    name: '',
    bankCode: '',
    amount: 0,
    showCode: false,
    time: '',
    code: '',
    choiceiIndex:0,
    tip: '',
    codePic:"",
    cashValue:'',
    allCash:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.getPicCode()
    this.getBank();
    this.getHandInfo()
    this.setData({
      userInfo: app.globalData.userInfo,
      phone: app.globalData.userInfo.phone,
      allCash: app.globalData.handInfo.balance,
    })
    this.getTip();
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
    this.setData({
      handInfo: app.globalData.handInfo
    })
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
  // 银行列表
  getBank: function () {
    let self = this;
    http.HttpRequst(false, '/hand/me-cash-api/bank', 2, '',
      {
        token: app.globalData.token
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            bankInfo: res.data.data
          })
          let arr = [];
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push(res.data.data[i].name)
          }
          self.setData({
            bankList: arr,
          })
          self.getLast();

        }
      }
    )
  },
  // 银行列表
  getTip: function () {
    let self = this;
    http.HttpRequst(false, '/content/content-api/view', 2, '',
      {
        token: app.globalData.token,
        action_id: 0,
        type: 18
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            tip: res.data.data
          })
        }
      }
    )
  },
  // 获取姓名
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 获取银行卡号
  getBankCode(e) {
    this.setData({
      bankCode: e.detail.value
    })
  },
  // 获取提现金额
  getAmount(e) {
    let value = e.detail.value;

    if(value > this.data.allCash){
      value = this.data.allCash
    }
    this.setData({
      cashValue:value
    })
  },
  // 获取验证码
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 发送验证码
  sendCode() {
    let self = this;
    // if (self.data.codePic == "") {
    //   wx.showToast({
    //     title: "请输入图片验证码",
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    http.HttpRequst(true, '/member/user-api/send-sms', 2, '',
      {
        phone: self.data.userInfo.phone,
        type: 'applyCash',
        code: self.data.codePic,
        sign: self.data.sign,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            bankList: res.data.data,
            time: 60
          })
          self.setData({
            showCode: true
          })
          var codeTime = setInterval(function () {
            self.setData({
              time: self.data.time - 1
            });
            if (self.data.time == -1) {
              clearInterval(codeTime);
              self.setData({
                showCode: false,
                codeText: ''
              })
            }
          }, 1000)
        }
      }
    )
  },
  // 选择银行
  bindPickerChange(e) {
    const index = e.detail.value;
    this.setData({
      bankName: this.data.bankInfo[index].name,
      bankId: this.data.bankInfo[index].id
    })
  },
  getAccount(e){
    this.setData({
      alipay_account:e.detail.value
    })
  },
  // 提现
  confirm() {
    let self = this;
    if (self.data.name == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      })
    } else if (self.data.cashValue == '' || self.data.cashValue == 0) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
    } 
    else if (Number(self.data.handInfo.balance) < Number(self.data.cashValue)) {
      wx.showToast({
        title: '余额不足',
        icon: 'none',
        duration: 2000
      })
    } else {
        http.HttpRequst(true, '/hand/me-cash-api/apply-cash', 2, '',
          {
            token: app.globalData.token,
            price: self.data.cashValue,
            name: self.data.name,
            alipay_account:this.data.alipay_account
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              wx.navigateTo({
                url: '/pages/member/cashView/cashView'
              })
            }
          }
        )
      }

  },
  getLast(){
    let self = this;
    http.HttpRequst(false, '/hand/me-cash-api/pre-input-bank', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
           bankName: res.data.data.bank_name,
           bankCode: res.data.data.bank_card,
           bankId: res.data.data.bank_code,
           name: res.data.data.name,
            phone: res.data.data.phone != "" ? res.data.data.phone : app.globalData.userInfo.phone,
         })
          self.data.bankInfo.forEach((x,index)=>{
            if (x.id == self.data.bankId){
              self.setData({
                choiceiIndex: index
              })
            }
          })
        }
        
      }
    )
  },// 获取输入的验证码
  inputCode1: function (e) {
    this.setData({
      codePic: e.detail.value
    })
  },
  getPicCode() {
    let self = this;
    http.HttpRequst(true, '/member/user-api/get-img-code', 2, '',
      {
        phone: self.data.phone,
        type: 'applyCash',
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            sign: res.data.data.sign,
            url: res.data.data.url
          })
        }
      })
  },
  // 获取推手信息
  getHandInfo() {
    let self = this;
    http.HttpRequst(false, '/hand/hand-api/info', 2, '', {
      token: app.globalData.token
    },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            handInfo: res.data.data,
          })
          app.globalData.handInfo = res.data.data;
        }
      }
    )
  },
  cashAll(){
    if(Number(this.data.allCash) == 0){
      wx.showToast({
        title: '余额不足！',
        icon:'none'
      })
      return false;
    }
    this.setData({
      cashValue:this.data.allCash
    })
  },
  toRecord(){
    wx.navigateTo({
      url: '/pages/member/cashRecord/cashRecord',
    })
  }
})