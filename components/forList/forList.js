const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')

// components/courselist/courselist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: { //  数组
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function(newVal, oldVal, changedPath) {
        if (typeof newVal == "object" || newVal.length==0){
          this.setData({
            listLength: newVal.length
          })
        }
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    showType: { // 显示样式
      type: Number,
      value: 1,
      observer: function(newVal, oldVal, changedPath) {}
    },
    userInfo: { // 用户信息
      type: Object,
      observer: function(newVal, oldVal, changedPath) {}
    },
    skillType: { // 秒杀类型  2的时候是今日秒杀
      type: String,
      value: -1,
      observer: function(newVal, oldVal, changedPath) {}
    },
    groupType: { //拼团类型 1秒杀 2拼团
      type: Number,
      value: 1,
      observer: function(newVal, oldVal, changedPath) {}
    },
    showManage: { //管理選擇
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        
      }
    },
    maxValue: { //最大值
      type: Number,
      value: 0,
      observer: function(newVal, oldVal, changedPath) {}
    },
    showAdd:{
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal, changedPath) { 
      }
    },
    newList: { //拼团类型 1秒杀 2拼团
      type: Object,
      observer: function(newVal, oldVal, changedPath) {
        if (newVal != "null" && this.data.groupType == 2) {
          this.data.list.forEach((item, index) => {
            if (item.item_id = newVal.item_id) {
              this.setData({
                updateIndex: index
              })
            }
          })
        }
        let up = "list[" + this.data.updateIndex + "].push_status"
        this.setData({
          [up]: newVal.push_status == 0 ? null : 0
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    listLength: 1,
    theme: '',
    cancelModal: false,
    updateIndex: 0,
    isShowModalTwo: false,
    item_id: 0, //商品id
    old_sort: 0, //旧的序号
    new_sort: 0, //新的序号
    choiceIndex: 0, //选择索引
    temArr: [], //顺序暂时的数组
  },
  attached() {
    // 在组件实例进入页面节点树时执行
    this.setData({
      theme: getApp().globalData.theme
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e) {
      app.pushRoute(e)
    },
    showFunction(e) {
      let self = this;
      let id = e.currentTarget.id
      let index = e.currentTarget.dataset.index;
      let sort = e.currentTarget.dataset.sort;
      wx.showActionSheet({
        itemList: ['顶置商品', '推广商品', '移除商品'],
        success(res) {
          if (res.tapIndex == 0) {
            self.setData({
              old_sort: sort,
              new_sort: self.data.maxValue,
              item_id: id,
              choiceIndex: index,
            })
            self.changeSort();
          } else if (res.tapIndex == 1) {
            wx.navigateTo({
              url: '/pages/goodDetail/share/share?id=' + id
            })
          } else {
            let id = []
            id.push(e.currentTarget.id)
            let params = {
              token: app.globalData.token,
              item_ids: id
            }
            http.HttpRequst(false, "/handShop/hand-shop-api/delete-item", 2, '', params,
              'POST',
              false,
              function(res) {
                if (res.data.errcode == 0) {
                  let list = JSON.parse(JSON.stringify(self.data.list))
                  list.splice(index, 1)
                  self.setData({
                    list: list
                  })
                  wx.showToast({
                    title: "刪除成功",
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            )

          }
        },
        fail(res) {
          // console.log(res.errMsg)
        }
      })
    },
    close() {
      this.setData({
        isShowModalTwo: true
      })

    },
    // 推广
    choice() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {

          // tempFilePath可以作为img标签的src属性显示图片
          // 数组
          const tempFilePaths = res.tempFilePaths
        }
      })
    },
    shareSkillGood(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/goodDetail/share/share?id=' + id
      })
    },
    // 跳转详情
    jumpGoodDetail(e) {
      let id = e.currentTarget.dataset.id;
      let shop_id = e.currentTarget.dataset.shop_id
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + id + "&shop_id=" + shop_id
      })
    },
    // 去
    goDeatil: function(e) {
      if (this.data.detailType == 1) {
        // 历史记录进 详情 有id
        if (e.currentTarget.dataset.son != undefined) {
          wx.navigateTo({
            url: '/pages/index/coursedetail/coursedetail?cou_id=' + e.currentTarget.id + '&son_id=' + e.currentTarget.dataset.son,
            success: function(res) {}
          })
        } else {
          wx.navigateTo({
            url: '/pages/index/coursedetail/coursedetail?cou_id=' + e.currentTarget.id,
            success: function(res) {}
          })
        }

      } else if (this.data.detailType == 2) {
        wx.navigateTo({
          url: '/pages/mine/activity/activitydeatil/activitydetail?id=' + e.currentTarget.id,
          success: function(res) {}
        })
      }

    },
    showModel(e) {
      this.setData({
        cancelModal: true,
        id: e.currentTarget.dataset.id,
        status: e.currentTarget.dataset.status,
        index: e.currentTarget.dataset.index,
      })
    },
    // 取消提醒
    changeRemind: function(e) {
      let self = this;
      let id, status, index
      if (e.currentTarget.dataset.id) {
        id = e.currentTarget.dataset.id
        status = e.currentTarget.dataset.status
        index = e.currentTarget.dataset.index
      } else {
        id = self.data.id
        status = self.data.status
        index = self.data.index
      }
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
            wx.showToast({
              title: status == 0 ? '设置成功' : '取消成功',
              icon: 'none',
              duration: 2000
            })
            let temList = self.data.list
            if (status == 0) {
              temList[index].push_status = 0
            } else {
              temList[index].push_status = null
            }
            self.setData({
              list: temList,
              cancelModal: false
            })
          }
        }
      )
    },
    cancle() {
      this.setData({
        cancelModal: false
      })
    },
    changeSort() {
      let self = this;
      http.HttpRequst(true, '/handShop/hand-shop-api/update-item-sort', 2, '', {
          token: app.globalData.token,
          item_id: self.data.item_id,
          old_sort: Number(self.data.old_sort),
          new_sort: self.data.new_sort,
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: "修改成功",
              icon: 'none',
              duration: 2000
            })
            let tem = JSON.parse(JSON.stringify(self.data.list))
            // tem[0].sort = tem[self.data.choiceIndex].sort
            // tem[self.data.choiceIndex].sort = temSort
            // tem[0] = tem[self.data.choiceIndex]
            // tem[self.data.choiceIndex] = centerValue
            // self.setData({
            //   list:tem
            // })
            // common.arrayFilter(tem,0,self.data.choiceIndex+1)
            self.swapValue(tem, 0, self.data.choiceIndex, self.data.list[0].sort, self.data.list[self.data.choiceIndex].sort)
          }
        }
      )
    },
    // 改变顺序
    swapValue(tem, index1, index2, value1, value2) {
      let self = this
      let centerValue = tem[index2]
      centerValue.sort = tem[0].sort //最大
      // let temSort = tem[index2].sort
      tem.splice(index2, 1)
      tem.forEach((x, index) => {
        if (index >= index1 && index < index2) {
          x.sort = x.sort - 1
        }
      })
      tem.splice(index1, 0, centerValue)
      self.setData({
        list: tem
      })
    },
    // 选择
    choiceDelate(e){
      let self = this;
      let id = e.currentTarget.id
      let index = e.currentTarget.dataset.index;
      let select = e.currentTarget.dataset.select;
      let up = "list[" + index + "].select"
      this.setData({
        [up]: !select
      })
      let choiceAll =true
      let ids = []
      self.data.list.forEach(x=>{
        if (x.select ==false) {
          choiceAll = false
        }else{
          ids.push(e.currentTarget.id)
        }
      })
      var myEventDetail = {
        choiceAll: choiceAll,
        ids: ids,
        list:self.data.list
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      self.triggerEvent('changeAll', myEventDetail, myEventOption)

    },

    // 
    onSorted: function (e) {
      if (e.detail.list.length >= 0) {
        this.setData({
          list: e.detail.list,
        })
      }
    },
    onPackup: function (e) {
      this.setData({
        showSort: !e.detail.packup
      })
    },
  },

})