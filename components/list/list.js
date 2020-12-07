// components/list/list.js
const app = getApp()
const http = require('../../utils/http.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listTopMargin:{
      type:Number,
      value:0
    },
    addTopHeight:{
      type:Number,
      value:500
    },
    listData: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        this.setData({
          listData: newVal
        })
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    isBaseLine: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    role: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    isTop: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    isTopTwo: {
      type: null,
      value: '',
      observer: function(newVal, oldVal, changedPath) {

      }
    },
    topNum:{
      type:Number,
      value:0
    },
    addGoods: {
      type: null,
      value: 0,
      observer: function(newVal, oldVal, changedPath) {

      }
    },
    showList:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    barHeight: app.globalData.totalHeight,
    _ratio: app.globalData._ratio,
    pageHeight: app.globalData.pageHeight,
    animationData: {},
    animation: {},
    sortTab: [{
        title: '综合',
        status: 1,
        showType: 1
      },
      // {
      //   title: '返利',
      //   status: 3
      // },
      {
        title: '销量',
        status: 3,
        showType: 2
      },
      {
        title: '价格',
        status: 3,
        showType: 2
      },
    ],
    sortTabTwo: [{
      title: "综合",
      choice: true,
      value: "",
    }, {
      title: "人气",
      choice: false,
      value: 0,
    }, {
      title: "佣金升序",
      choice: false,
      value: 1,
    }, {
      title: "佣金降序",
      choice: false,
      value: 1,

    }],
    showContent: false,
    sortIndex: null,
    theme: ""
  },
  attached() {
    this.data.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.data.animation.height(0).step()
    this.setData({
      theme: getApp().globalData.theme,
      listNumber: app.globalData.personShopList,
      animationData: this.data.animation.export(),
      userInfo: app.globalData.userInfo
    })


  },
  /**
   * 组件的方法列表
   */
  methods: {
    choiceValue(e) {
      let value = e.currentTarget.dataset.value
      let index = e.currentTarget.dataset.index
      let detail = {
        index: value,
        status: index==3?2:1
      }
      let sortTabTwo = this.data.sortTabTwo
      // sortTabTwo.forEach((x,index1)=>{
      //   if (index==index1){
      //     x.choice = true
      //   }else{
      //     x.choice = false
      //   }
      // })
      this.data.animation.height(0).step()
      this.setData({
        ['sortTab[0].status']: 1,
        ['sortTab[0].title']: this.data.sortTabTwo[index].title,
        sortTabTwo: sortTabTwo,
        animationData: this.data.animation.export(),
      })
      this.triggerEvent('selectSort', detail);
    },
    changeStatus(e) {
      let self = this;

      let id = []
      id.push(e.currentTarget.id)
      let type = e.currentTarget.dataset.stautus
      let index = e.currentTarget.dataset.index
      let postUrl, params
      if (type == 1) {
        postUrl = "/handShop/hand-shop-api/delete-item"
        params = {
          token: app.globalData.token,
          item_ids: id
        }
      } else {
        postUrl = "/handShop/hand-shop-api/create",
          params = {
            token: app.globalData.token,
            item_id: e.currentTarget.id
          }
      }
      http.HttpRequst(false, postUrl, 2, '', params,
        'POST',
        false,
        function(res) {
          if (res.data.errcode == 0) {
            let total_number = self.data.listNumber
            if (type == 1) {
              self.setData({
                listNumber: total_number - 1
              })
            } else {
              self.setData({
                listNumber: total_number + 1
              })
            }
            var myEventDetail = {
              index: index,
              type: type,
            } // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            self.triggerEvent('changeList', myEventDetail, myEventOption);
          }
        }
      )
    },
    loadMore() {
      this.triggerEvent('loadMore');
    },
    // 跳转商品详情
    jumpDetail(e) {
      let id = e.currentTarget.dataset.id;
      let shop_id = e.currentTarget.dataset.shop_id;
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + id + "&shop_id=" + shop_id
      })
    },
    // 选择排序
    selectSort(e) {
      let sort = this.data.sortTab;
      let showType = e.currentTarget.dataset.show;
      let index = e.currentTarget.dataset.index;
      let status = e.currentTarget.dataset.status;
      this.setData({
        sortIndex: index
      })
      if (showType == 1) {
        for (let i = 0; i < sort.length; i++) {
          if (i != 0) {
            sort[i].status = 3;
          }
        }
        this.setData({
          sortTab: sort
        })
     
        let heightValue = status === 2 ? 0 : this.data.userInfo.role==1?180:90
        this.data.animation.height(heightValue).step()
        this.setData({
          animationData: this.data.animation.export(),
          ['sortTab[' + index + '].status']: status === 2 ? 1 : 2,
        })
      } else {
        for (let i = 0; i < sort.length; i++) {
          sort[i].status = 3;
          
        }
        let sortTabTwo = this.data.sortTabTwo
        sortTabTwo.forEach((x,choiceIndex)=>{
          if (choiceIndex==0){
            x.choice = true
          }else{
            x.choice = false
          }
        })
        if (status == 3 || status == 2) {
          sort[index].status = 1;
        } else {
          sort[index].status = 2;
        }
        let detail = {
          index: index,
          status: sort[index].status
        }
        this.data.animation.height(0).step()
        this.setData({
          animationData: this.data.animation.export(),
          sortTab: sort,
          sortTabTwo:sortTabTwo
        })
        this.triggerEvent('selectSort', detail);
      }

    },
    share(e) {
      let id = e.currentTarget.dataset.id;
      // this.triggerEvent('shareGood', id)
      wx.navigateTo({
        url: '/pages/goodDetail/share/share?id=' + id
      })
    },
    goPushRoute(e) {
      app.pushRoute(e)
    },
    routeBack() {
      wx.reLaunch({
        url: '/pages/personShop/personShop'
      })
    },
  }
})