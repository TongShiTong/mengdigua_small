// pages/member/community/community.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: [1, 2, 3],
    sortIndex: null,
    pageHeight: app.globalData.pageHeight,
    barHeight: app.globalData.totalHeight,
    params:{
      level: "", //等级
      relation: "", //关系 1：直属；2间属
      max_income: "", //最高收益	
      min_income: "", //最低收益	
    },
    start_page: 0, //
    sortTab: [
      {
        title: '身份',
        status: 3
      },
      {
        title: '关系',
        status: 3
      },
      {
        title: '收入',
        status: 3
      },
    ],
    levelsList:[],
    relationList: ["直属", "间属"],
    incomelist: ["全部收入", "0~1000", "1000~5000", "5000~10000", "10000以上"],
    incomelistTwo: [{ min_income: "", max_income: "" }, { min_income: 0, max_income: 1000 }, { min_income: 1000, max_income: 5000 }, { min_income: 5000, max_income: 10000 }, { min_income: 10000, max_income:"" }],
    showModel:false,
    ids:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    common.loadTheme(this)
    this.getgoodsList()
    this.getlevelsList()

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
    this.loadMoregoods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 商品推荐
  getgoodsList() {
    let self = this;
    this.setData({
      start_page: 0,
      goodsList: false,
    })
    common.getList(self, '/hand/hand-team-api/get-list', {
      token: app.globalData.token,
      level: self.data.params.level, //等级
      relation: self.data.params.relation, //关系 1：直属；2间属
      max_income: self.data.params.max_income, //最高收益	
      min_income: self.data.params.min_income, //最低收益	
      start_page: self.data.start_page,
      pages: 10,
    }, 'goodsList', function(res) {
      let name = "goodsList.list"
      let list = self.data.goodsList.list
      list.forEach((x, index) => {
        x.select = false
      })
      self.setData({
        [name]: list
      })
    })
  },
  // 商品推荐更多
  loadMoregoods() {
    let self = this
    common.loadMoreChange(self, '/hand/hand-team-api/get-list', {
      token: app.globalData.token,
      level: self.data.params.level, //等级
      relation: self.data.params.relation, //关系 1：直属；2间属
      max_income: self.data.params.max_income, //最高收益	
      min_income: self.data.params.min_income, //最低收益	
      start_page: self.data.start_page,
      pages: 10,
    }, 'goodsList', 'start_page', function(res) {})
  },
  changeSatus(e) {
    let index = e.currentTarget.dataset.index
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    let name = "goodsList.list[" + index + "].select"
    this.setData({
      [name]: !status
    })
    let ids = this.data.ids
    if (status){
      const result = ids.filter(x =>id != x );
      this.setData({
        ids: result
      })
    }else{
      ids.push(id)
      this.setData({
        ids: ids
      })
    }
  
  },
  // 选择排序
  selectSort(e) {
    let self = this
    let sort = this.data.sortTab;
    for (let i = 0; i < sort.length; i++) {
      sort[i].status = 3;
    }
    let index = e.currentTarget.dataset.index;
    let status = e.currentTarget.dataset.status;
    this.setData({
      sortIndex: index
    })
    // if (status == 3 || status == 2) {
    //   sort[index].status = 1;
    // } else {
    //   sort[index].status = 2;
    // }
    let detail = {
      index: index,
      status: sort[index].status
    }
    this.setData({
      sortTab: sort
    })
    let sortName = '';
    let sortType = '';
    if (index == 0) {
      let name = "sortTab[0].title";
      wx.showActionSheet({
        itemList: self.data.temlist,
        success(res) {
          self.setData({
            "params.level": self.data.levelsList[res.tapIndex].level,
            [name]: self.data.levelsList[res.tapIndex].name,
          })
          self.getgoodsList()
        },
        fail(res) {
          self.setData({
            "params.level": "",
            [name]:"身份",
          })
          self.getgoodsList()
        }
      })
    } else if (index == 1) {
      let name = "sortTab[1].title"
      wx.showActionSheet({
        itemList: self.data.relationList,
        success(res) {
          self.setData({
            "params.relation": res.tapIndex+1,
            [name]: self.data.relationList[res.tapIndex]
          })
          self.getgoodsList()
        },
        fail(res) {
          self.setData({
            "params.relation": "",
            [name]:"关系"
          })
          self.getgoodsList()
        }
      })
    } else if (index == 2) {
      let name = "sortTab[2].title"
      wx.showActionSheet({
        itemList: self.data.incomelist,
        success(res) {
          self.setData({
            "params.min_income": self.data.incomelistTwo[res.tapIndex].min_income,
            "params.max_income": self.data.incomelistTwo[res.tapIndex].max_income,
            [name]: self.data.incomelist[res.tapIndex]
          })
          self.getgoodsList()
        },
        fail(res) {
          self.setData({
            "params.relation": "",
            [name]: "关系"
          })
          self.getgoodsList()
        }
      })
    } 
    // if (e.detail.status == 1) {
    //   sortType = 'SORT_DESC'
    // } else if (e.detail.status == 2) {
    //   sortType = 'SORT_ASC'
    // }
    this.setData({
      sortName: sortName,
      sortType: sortType
    })
    // this.serchGood();
  },
  getlevelsList(){
    let self = this;
    http.HttpRequst(true, '/hand/hand-team-api/get-levels', 2, '',
      {
        token: app.globalData.token,
      
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let temlist = res.data.data.map(x => x=x.name)
          // let listFilter = app.globalData.shopcarOrder.list.filter(x => x.isShow == true)
          self.setData({
            levelsList: res.data.data,
            temlist: temlist
          })
        }
      }
    )
  },
  changeNum(e){
    let self = this;
    self.setData({
      "params.min_income":e.detail.value
    })
  },
  changeNum1(e) {
    let self = this;
    self.setData({
      ["params.max_income"]: e.detail.value
    })
  },
  close(){
    this.setData({
      showModel:false
    })
  },
  confirmValue(){
    this.setData({
      showModel:false
    })
    this.getgoodsList()
  },
  send(){
    let self = this;
    wx.navigateTo({
      url: "/pages/goodDetail/uploadMaterial/uploadMaterial?info=1&params="+JSON.stringify(self.data.params)
    })
  },
  sendTwo(){
    let self = this;
    if (self.data.ids.length==0){
      wx.showToast({
        title: '请选择用户',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    wx.navigateTo({
      url: "/pages/goodDetail/uploadMaterial/uploadMaterial?info=1&ids=" + JSON.stringify(self.data.ids)
    })
  }
})