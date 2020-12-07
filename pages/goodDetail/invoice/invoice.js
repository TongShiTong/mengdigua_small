// pages/goodDetail/invoice/invoice.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: false,
    tab: [
      {
        title: '不开发票'
      },
      {
        title: '商品明细'
      }
    ],
    tabIndex: 1,
    selectTab: [
      {
        title: '个人'
      },
      {
        title: '单位'
      }
    ],
    selectIndex: 0,
    invoiceInfo: '',
    content: "",
    isHelp: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      invoiceInfo: app.globalData.invoice
    })
    // this.setData({
    //   tabIndex: this.data.invoiceInfo.invoice_content
    // })
    if (this.data.invoiceInfo.type == 2) {
      this.setData({
        selectIndex: 1
      })
    } else {
      this.setData({
        selectIndex: 0
      })
    }
    this.getContent();
  },
  // 获取发票须知
  getContent() {
    let self = this;
    http.HttpRequst(true, '/content/content-api/view', 2, '',
      {
        type: 28,
        action_id: 0
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            content: res.data.data
          })
        }
      }
    )
  },
  // 是否开发票
  selectTab(e) {
    let index = e.currentTarget.dataset.index;
    let invoiceContent = 'invoiceInfo.invoice_content'
    this.setData({
      tabIndex: index,
      [invoiceContent]: String(index)
    })
  },
  // 选择发票抬头
  selectType(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectIndex: index
    })
  },
  // 显示帮助中心
  showHelp() {
    this.setData({
      isHelp: true
    })
  },
  // 关闭帮助中心
  close() {
    this.setData({
      isHelp: false
    })
  },
  // 获取手机
  getPhone(e) {
    let phone = 'invoiceInfo.phone'
    this.setData({
      [phone]: e.detail.value
    })
  },
  // 获取邮箱
  getMail(e) {
    let mail = 'invoiceInfo.mail'
    this.setData({
      [mail]: e.detail.value
    })
  },
  // 获取公司
  getCompany(e) {
    let companyName = 'invoiceInfo.company_name'
    this.setData({
      [companyName]: e.detail.value
    })
  },
  // 获取纳税人识别号
  getPersonalCode(e) {
    let companyCode = 'invoiceInfo.company_code'
    this.setData({
      [companyCode]: e.detail.value
    })
  },
  // 保存
  saveInvoice() {
    let invoiceType = 'invoiceInfo.invoice_type';
    this.setData({
      [invoiceType]: '电子发票'
    })
    if (this.data.tabIndex == 0) {
      let content = 'invoiceInfo.invoiceContent'
      this.setData({
        [content]: '0'
      })
      app.globalData.invoice = this.data.invoiceInfo;
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }else {
      let invoiceContent = 'invoiceInfo.invoice_content';
      this.setData({
        [invoiceContent]: '1',
      })
      let kind = 'invoiceInfo.type';
      if (this.data.selectIndex == 0) {
        this.setData({
          [kind]: '1'
        })
      } else {
        this.setData({
          [kind]: '2'
        })
      }
      // 手机号
      if (app.testPhone(this.data.invoiceInfo.phone) == 0) {

      } else if (app.testPhone(this.data.invoiceInfo.phone) == 1) {

      } else {
        // 邮箱
        if (app.testMail(this.data.invoiceInfo.mail) == 0) {

        } else if (app.testMail(this.data.invoiceInfo.mail) == 1) {

        } else {
          if (this.data.selectIndex == 1) {
            // 公司
            if (this.data.invoiceInfo.company_name == '') {
              wx.showToast({
                title: '请输入单位名称',
                icon: 'none',
                duration: 1000
              })
            } else {
              // 纳税人识别号
              if (this.data.invoiceInfo.company_code == '') {
                wx.showToast({
                  title: '请输入纳税人识别号',
                  icon: 'none',
                  duration: 1000
                })
              } else {
                app.globalData.invoice = this.data.invoiceInfo;
                wx.showToast({
                  title: '保存成功',
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
          } else {
            app.globalData.invoice = this.data.invoiceInfo;
            wx.showToast({
              title: '保存成功',
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
      }
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

  },


})