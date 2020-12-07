// components/shopFormat/shopFormat.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodId: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function(newVal, oldVal, changedPath) {


      }
    },
    showMoadl: { //展示
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal, changedPath) {
        this.buy()
      }
    },
    group_team_id: { //展示
      type: String,
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    detailData: { //展示
      type: Object,
      value: false,
      observer: function(newVal, oldVal, changedPath) {

        this.setData({
          selectData: newVal
        })
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    buyNum: 1,
  },
  attached() {
    // 在组件实例进入页面节点树时执行
    this.setData({
      theme: getApp().globalData.theme
    })
    this.getProperty()
    this.getAllProperty()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 增加购买数量
    addNum: function () {
      if (this.data.selectData == '') {
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 1000
        })
      } else {
        let num = Number(this.data.buyNum);
        num += 1;
        if (num >= this.data.selectData.stock) {
          num = this.data.selectData.stock;
          wx.showToast({
            title: '已至最大库存',
            icon: 'none',
            duration: 1000
          })
        }
        this.setData({
          buyNum: num
        })
      }
    },
    // 减少购买数量
    reduce: function () {
      if (this.data.selectData == '') {
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 1000
        })
      } else {
        let num = Number(this.data.buyNum);
        num -= 1;
        if (num <= 1) {
          num = 1
        }
        this.setData({
          buyNum: num
        })
      }
    },
    // 输入购买数量
    changeNum: function (e) {
      if (this.data.selectData == '') {
        this.setData({
          buyNum: 1
        })
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 1000
        })
      } else {
        let num = e.detail.value;
        if (num >= parseInt(this.data.selectData.stock)) {
          num = this.data.selectData.stock;
          wx.showToast({
            title: '已至最大库存',
            icon: 'none',
            duration: 1000
          })
        } else if (num <= 1) {
          num = 1;
          wx.showToast({
            title: '购买数量不能小于1',
            icon: 'none',
            duration: 1000
          })
        }
        this.setData({
          buyNum: num
        })
      }
    },
    closeModal: function() {
      let self = this;
      self.setData({
        showMoadl: false
      })
    },
    // 商品规格
    getProperty: function() {
      let self = this;
      http.HttpRequst(false, '/item/me-item-api/get-property', 2, '', {
          token: app.globalData.token,
          item_id: self.data.goodId
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              for (let j = 0; j < res.data.data[i].children.length; j++) {
                res.data.data[i].children[j].isSelect = false;
              }
            }
            self.setData({
              property: res.data.data,
              temproperty: JSON.parse(JSON.stringify(res.data.data)),
            })
            let propertyValue = '';
            for (let i = 0; i < res.data.data.length; i++) {
              propertyValue += res.data.data[i].prop_name + ' '
            }
            self.setData({
              propertyValue: propertyValue,
              tempropertyValue: JSON.parse(JSON.stringify(propertyValue)),
            })
            let arr = [];
            for (let i = 0; i < res.data.data.length; i++) {
              arr.push('')
            }
            self.setData({
              selectArr: arr,
              temselectArr: JSON.parse(JSON.stringify(arr)),

            })
          }
        }
      )
    },
    // 所有商品规格
    getAllProperty: function() {
      let self = this;
      http.HttpRequst(false, '/item/me-item-api/get-all-property', 2, '', {
          item_id: self.data.goodId,
        },
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            self.setData({
              allProperty: res.data.data,
              temAllProperty: JSON.parse(JSON.stringify(res.data.data)),
            })
          }
        }
      )
    },

    // 选择规格
    selectValue: function(e) {
      let index = e.currentTarget.dataset.index;
      let childrenIndex = e.currentTarget.dataset.childrenindex;
      let selectId = 'selectArr[' + index + ']';
      this.setData({
        [selectId]: this.data.property[index].children[childrenIndex].value_id
      })
      let propertyArr = this.data.property;
      for (let i = 0; i < propertyArr.length; i++) {
        for (let j = 0; j < propertyArr[i].children.length; j++) {
          if (this.data.selectArr.indexOf(propertyArr[i].children[j].value_id) > -1) {
            propertyArr[i].children[j].isSelect = true;
          } else {
            propertyArr[i].children[j].isSelect = false;
          }
        }
      }
      this.setData({
        property: propertyArr
      })
      let selected = this.data.selectArr.join(',');
      for (let i = 0; i < this.data.allProperty.length; i++) {
        if (this.data.allProperty[i].value_ids == selected) {
          this.setData({
            selectData: this.data.allProperty[i]
          })
        }
      }
    },
    // 立即购买 打开选择
    buy: function(e) {
      // 拼团单独购买改变规格
      this.setData({
        isBindPhone: app.globalData.isBindPhone,
        clickButton: true
      })
      if (this.data.isBindPhone === false) {
        this.setData({
          showBuyBtn: true,
          isScroll: false,
        })
      }
    },
    // 确认够买
    confirmBuy: function() {
      // 不是秒杀
     
      if (this.data.selectData.stock == 0) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
          duration: 1000
        })
      } else {
        if (this.data.selectData.value_names) {
          if (this.data.detailData.status == 5) {
            let orderData = this.data.detailData;
            orderData.selectData = this.data.selectData;
            orderData.buy_num = this.data.buyNum;
            app.globalData.oneOrder = orderData;
            // 拼团  改变状态
            // if (this.data.tem_activity_type != -1) {
            //   orderData.activity_type = this.data.tem_activity_type
            // }
            wx.navigateTo({
              url: '/pages/goodDetail/confirmOrder/confirmOrder?from=gooddetail' + '&group_id=' + this.data.group_team_id
            })
            this.setData({
              showMoadl: false
            })
          } else if (this.data.detailData.status == 7) {
            wx.showToast({
              title: '该商品已下架',
              icon: 'none',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: '无法购买该商品',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          wx.showToast({
            title: '请选择规格',
            icon: 'none',
            duration: 1000
          })
        }
      }
    },
  },
  // 关闭选择

})