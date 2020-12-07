// pages/center/seting/feedback/feedback.js
const app = getApp()
const http = require('../../../../utils/http.js')
const common = require('../../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    phone: '',
    idea: '',
    imgList: '',
    imgArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)

  },
  // 获取手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取建议
  getIdea: function (e) {
    this.setData({
      idea: e.detail.value
    })
  },
  // 获取联系人
  getNickname: function (e) {
    this.setData({
      nickname: e.detail.value
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
  // 提交建议
  saveIdea: function () {
    let self = this;
    if (self.data.idea == '') {
      wx.showToast({
        title: '请填写反馈意见',
        icon: 'none',
        duration: 1000
      })
    } else if (self.data.nickname == '') {
      wx.showToast({
        title: '请填联系人',
        icon: 'none',
        duration: 1000
      })
    }else if (app.testPhone(self.data.phone) === 0) {

    } else if (app.testPhone(self.data.phone) === 1) {
      
    } else {
      http.HttpRequst(true, '/feedback/feedback-api/create', 2, '',
        {
          token: app.globalData.token,
          tel: self.data.phone,
          remark: self.data.idea,
          imgs: self.data.imgList
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