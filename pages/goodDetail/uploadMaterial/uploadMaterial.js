// pages/goodDetail/uploadMaterial/uploadMaterial.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idea: '',
    imgList: '',
    imgArr: [],
    id: '',
    title:"上传素材",
    imglength:8,
    info:0,
    ids:[],
    params: {
      level: "", //等级
      relation: "", //关系 1：直属；2间属
      max_income: "", //最高收益	
      min_income: "", //最低收益	
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F7F7F7'
    })
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    if (options.info){
      this.setData({
        title:"发通知",
        info:1,
        imglength:1
      })
    }
    if (options.params){
      this.setData({
        params: JSON.parse(options.params)
      })
    }
    if (options.ids){
      this.setData({
        ids: JSON.parse(options.ids)
      })
    }
  },
  // 获取建议
  getIdea: function (e) {
    this.setData({
      idea: e.detail.value
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
      count: self.data.imglength, // 默认9
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
              } else if (len > self.data.imglength) {
                wx.showToast({
                  title: '最多只能上传' + self.data.imglength+'张图片',
                  icon: 'none',
                  duration: 1000
                })
              } else {
                newTempFilePaths = self.data.imgList.concat(self.data.imgArr)
                if (newTempFilePaths.length > self.data.imglength) {
                  wx.showToast({
                    title: '最多只能上传'+self.data.imglength+'张图片',
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
  report: function () {
    let self = this;
    if (self.data.idea == '') {
      wx.showToast({
        title: '请填写内容',
        icon: 'none',
        duration: 1000
      })
    } else {
      if (self.data.info==0){
        http.HttpRequst(true, '/stuff/item-material-api/create', 2, '',
          {
            token: app.globalData.token,
            item_id: self.data.id,
            rich_text: self.data.idea,
            img_arr: self.data.imgList
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
      }else{
        http.HttpRequst(true, '/hand/hand-team-api/notice', 2, '',
          {
            token: app.globalData.token,
            level: self.data.params.level,
            relation: self.data.params.relation,
            max_income: self.data.params.max_income,
            min_income: self.data.params.min_income,
            content: self.data.idea,
            img: self.data.imgList,
            push_uids:self.data.ids,
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