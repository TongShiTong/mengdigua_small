// pages/center/userInfo/userInfo.js
const app = getApp()
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    endTime: '',
    date: '',
    wexin: '',
    isShowModal: false,
    array: ['男', '女'],
    isDistr:app.globalData.isDistr,
    isBindPhone:''
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
    common.loadTheme(this)
    let time = util.formatTimeTow(new Date());
    this.setData({
      endTime: time
    })
    this.setData({
      isBindPhone: app.globalData.isBindPhone
    })
  },
  // 更换头像
  changeHeadImg: function() {
    let self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.globalData.baseUrl + '/material/index/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
            var data = JSON.parse(res.data)
            //do something
            http.HttpRequst(true, '/member/user-api/update', 2, '', {
                token: app.globalData.token,
                head_url: data.data.url
              },
              'POST',
              false,
              function(res) {
                if (res.data.errcode == 0) {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1000
                  })
                  setTimeout(() => {
                    self.getUser();
                  }, 1000)
                }
              }
            )
          }
        })
      }
    })
  },
  // 选择性别
  selectSex: function() {
    let self = this;
    let sex = ''
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        if (res.tapIndex == 0) {
          sex = 1;
        } else if (res.tapIndex == 1) {
          sex = 2;
        }
        http.HttpRequst(true, '/member/user-api/update', 2, '', {
            token: app.globalData.token,
            sex: sex,
          },
          'POST',
          false,
          function(res) {
            if (res.data.errcode == 0) {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(() => {
                self.getUser();
              }, 1000)
            }
          }
        )
      },
      fail(res) {

      }
    })
  },
  // 生日选择
  bindDateChange: function(e) {
    let self = this;
    self.setData({
      date: e.detail.value
    })
    http.HttpRequst(true, '/member/user-api/update', 2, '', {
        token: app.globalData.token,
        date_birth: self.data.date
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            self.getUser();
          }, 1000)
        }
      }
    )
  },
  // 跳转修改昵称
  jumpChangeName: function() {
    wx.navigateTo({
      url: '/pages/center/userInfo/changeName/changeName'
    })
  },
  // 跳转微信名片
  jumpCard: function() {
    wx.navigateTo({
      url: '/pages/center/userInfo/visitCard/visitCard'
    })
  },
  // 跳转修改手机号
  jumpChangePhone: function() {
    wx.navigateTo({
      url: '/pages/center/userInfo/changePhone/changePhone?check=1'
    })
  },
  //设置支付密码
  setPassword(e) {
    const {
      status
    } = e.currentTarget.dataset
    let url = ~~status == 1 ? `/pages/center/userInfo/setPayPassword/mainItem` : `/pages/center/userInfo/setPayPassword/setPayPassword?status=1`
    wx.navigateTo({
      url
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
    this.getUser();

    this.setData({
      isShowModal: app.globalData.showModal,
      isBindPhone: app.globalData.isBindPhone
    })
  },
  // 获取个人信息
  getUser: function() {
    let self = this;
    http.HttpRequst(true, '/member/user-api/info', 2, '', {
        token: app.globalData.token,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            userInfo: res.data.data
          })
          app.globalData.userInfo = self.data.userInfo;
          self.getInvite();
        }
      }
    )
  },
  // 获取上级信息
  getInvite() {
    let self = this;
    http.HttpRequst(false, '/member/user-api/get-up-wechat', 2, '', {
        token: app.globalData.token,
      },
      'POST',
      false,
      function(res) {
        if (res.data.errcode == 0) {
          self.setData({
            wexin: res.data.data,
          })
        }
      }
    )
  },
  // 跳转我的邀请田铺
  jumpInvite() {
    if (this.data.wexin.wechat == null || this.data.wexin.wechat == '' || this.data.wexin.wechat_img == null || this.data.wexin.wechat_img == '') {
      wx.showToast({
        title: '上级未上传微信名片',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: '/pages/center/userInfo/inviteShop/inviteShop'
      })
    }
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

  },
  bindPickerChange: function (e) {
    let self = this;
    let sex = ''
    if (e.detail.value == 0) {
      sex = 1;
    } else if (e.detail.value == 1) {
      sex = 2;
    }
    http.HttpRequst(true, '/member/user-api/update', 2, '', {
      token: app.globalData.token,
      sex: sex,
    },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            self.getUser();
          }, 1000)
        }
      }
    )
  },
})