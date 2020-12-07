// components/rowscroll/rowscroll.js
const app = getApp()
const http = require('../../utils/http.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: { // 传入的数组
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        this.setData({
          listLength: newVal.length
        })
      }
    },
    showType: { // 传入的数组
      type: String,
      value: "header",
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    activeShow: { // 当前的索引
      type: Number,
      value: 0,
      observer: function(newVal, oldVal, changedPath) {

      }
    },
    mb: { //margin-bottom
      type: Number,
      value: 0,
      observer: function(newVal, oldVal, changedPath) {

      }
    },
    schoolSeat: {
      type: Number,
      value: 1,
      observer: function(newVal, oldVal, changedPath) {}
    },
    toId: {
      type: String,
      observer: function(newVal, oldVal, changedPath) {}
    },
    userInfo: {
      type: Object,
      observer: function(newVal, oldVal, changedPath) {}
    },
    groupType: { //拼团类型 1秒杀 2拼团
      type: Number,
      value: 1,
      observer: function(newVal, oldVal, changedPath) {}
    },
    bgColor: { //背景颜色
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {}
    },

  },
  created: function() {},
  /**
   * 组件的初始数据
   */
  data: {
    theme: '',
    imgList: [],
    imgArr: [],
    choiceTimes: 0,
    imgMore:false, //多余9张
  },
  attached() {
    // 在组件实例进入页面节点树时执行
    this.setData({
      theme: getApp().globalData.theme,
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {
    choice() {
      let self = this;

      // if (this.data.choiceTimes == 0) {
      //   let imgList = []
      //   this.data.list.forEach((x) => {
      //     imgList.push(x.img_url)
      //   })
      //   this.setData({
      //     imgList: imgList,
      //     choiceTimes: 1
      //   })
      // }
      if (self.data.list.length >= 9) {
        wx.showToast({
          title: '最多只能上传9张图片',
          icon: 'none',
          duration: 1000
        })
        return
      }
      let len = self.data.list.length
      self.setData({
        imgArr: [],
        imgMore:false,
      })
      let imgArr = self.data.imgArr;
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // 数组
          var tempFilePaths = res.tempFilePaths;
          var arrLength = res.tempFilePaths.length
          var newTempFilePaths = '';
          for (let i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: app.globalData.baseUrl + '/material/index/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function(res) {
                var data = JSON.parse(res.data)
                //do something
                imgArr.push(data.data.url)
                self.setData({
                  imgArr: imgArr
                })
                if (len == 0) {
                  // self.setData({
                  //   imgList: self.data.imgArr
                  // })
                } else if (len > 9) {
                  wx.showToast({
                    title: '最多只能上传9张图片',
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  newTempFilePaths = self.data.list.length + self.data.imgArr.length
                  if (newTempFilePaths> 9) {
                    let temArr = JSON.parse(JSON.stringify(self.data.imgArr))
                    temArr.pop()
                    arrLength--
                    self.setData({
                      imgArr: temArr,
                      imgMore:true,
                    })
                   
                  } else {
                    // newTempFilePaths = self.uniq(newTempFilePaths)
                    // self.setData({
                    //   imgList: newTempFilePaths
                    // })
                  }
                }
              
                if (self.data.imgArr.length == arrLength) {
                  if (self.data.imgMore) {
                    wx.showToast({
                      title: '最多只能上传9张图片',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                
                  self.uploadUrl()
                }

              },

            })
          }

        }
      })
    },
    uploadUrl() {
      let self = this;
      http.HttpRequst(false, '/handShop/hand-shop-api/create-banner', 2, '', {
          token: app.globalData.token,
          img_url: self.data.imgArr
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let list = JSON.parse(JSON.stringify(self.data.list))
            res.data.data.banner_id.forEach((x, index) => {
              list.unshift({
                banner_id: x,
                img_url: self.data.imgArr[index]
              })
            })
            self.setData({
              list: list,
            })
          }
        }
      )
    },
    // 删除
    delateNumber(e) {
      let self = this;
      let id = e.currentTarget.id
      let index = e.currentTarget.dataset.index

      http.HttpRequst(true, '/handShop/hand-shop-api/delete-banner', 2, '', {
          token: app.globalData.token,
          banner_id: id,
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let listTwo = JSON.parse(JSON.stringify(self.data.list))
            listTwo.splice(index, 1)
            self.setData({
              list: listTwo
            })
          }
        }
      )
    },
    // 跳转详情
    jumpGoodDetail(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + id
      })
    },
    // 头像模块 进入详情页面
    goPersonDetail: function(e) {
      let self = this;
      wx.navigateTo({
        url: '/pages/index/teacherdeatil/teacherdetail?tea_uid=' + e.currentTarget.id,
        success: function(res) {}
      })
    },
    changeIndex(e) {
      let index = e.currentTarget.dataset.index
      let id = e.currentTarget.dataset.id
      this.setData({
        activeShow: index
      })
      var myEventDetail = {
        activeIndex: this.data.activeShow,
        id: id
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('navChange', myEventDetail, myEventOption)
    },
    joinSchool: function(e) {
      let self = this;
      if (self.data.schoolSeat == 1) {
        app.globalData.ins_id = e.currentTarget.id
        app.globalData.collegeIndex = e.currentTarget.dataset.index
        app.globalData.clickScool = true
        wx.switchTab({
          url: '/pages/college/college'
        })
      } else if (self.data.schoolSeat == 2) {
        var myEventDetail = {
          activeIndex: e.currentTarget.dataset.index
        } // detail对象，提供给事件监听函数
        var myEventOption = {} // 触发事件的选项
        this.triggerEvent('posterChange', myEventDetail, myEventOption)
      }

    },
    action(event) {
      this.setData({
        activeShow: event.currentTarget.dataset.index,
        color: event.currentTarget.dataset.color || false,
        join_status: event.currentTarget.dataset.join || false,
      })
      var myEventDetail = {
        activeIndex: this.data.activeShow,
        color: this.data.color,
        join_status: this.data.join_status
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('onchange', myEventDetail, myEventOption)
    },
    loadMore: function(e) {
      let self = this;
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('rowMore', myEventDetail, myEventOption)
    },


    // 取消提醒
    changeRemind: function(e) {
      let self = this;
      let id = event.currentTarget.dataset.id
      let status = event.currentTarget.dataset.status
      http.HttpRequst(true, '/item/me-activity-push-api/push', 2, '', {
          token: app.globalData.token,
          item_id: id,
          type: status,
          activity_type: 2,
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {

          }
        }
      )
    },
    // 去重
    uniq(arr) {
      var result = [];
      var len = '';
      len = arr.length;
      arr.forEach(function(v, i, arr) { //这里利用map，filter方法也可以实现
        var bool = arr.indexOf(v, i + 1); //从传入参数的下一个索引值开始寻找是否存在重复
        if (bool === -1) {
          result.push(v);
        }
      })
      return result;
    },
    share(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/goodDetail/share/share?id=' + id
      })
    },

  }
})