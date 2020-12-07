// pages/member/income/income.js
const app = getApp()
const http = require('../../../utils/http.js')
const util = require('../../../utils/util.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['当日', '当周', '当月', '累计'],
    tabIndex: 0,
    otherIn: false, //其他进
    showTime: false,
    incomeTab: [
      {
        title: '全部'
      },
      {
        title: '退款'
      },
      {
        title: '已结算'
      },
      {
        title: '未结算'
      },
      {
        title: '业绩明细'
      }
    ],
    incomeIndex: 0,
    incomeData: '',
    nowIncome: '',
    nowTime: '',
    endTime: '',
    startTime: '',
    endTime: '',
    startPage: 0,
    orderNo: '',
    orderStartTime: '',
    orderEndTime: '',
    status: 0,
    listData: '',
    weflareData: '',
    weflarePage: 0,
    showStartTime: false,
    showStartEnd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#D1BC9D'
    })
    if (options.tabIndex){
      this.setData({
        tabIndex: options.tabIndex,
        otherIn:true
      })
    }
    let time = util.formatTimeTow(new Date());
    this.setData({
      endTime: time
    })
    this.getIncome();
    this.getOrder();
  },
  // 获取收入 '当日', '当周', '当月', '累计'
  getIncome(){
    let self = this;
    http.HttpRequst(false, '/hand/hand-api/get-my-income', 2, '',
      {
        token: app.globalData.token
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          res.data.data.today.start_time = self.replaceStr(res.data.data.today.start_time);
          res.data.data.today.end_time = self.replaceStr(res.data.data.today.end_time);
          res.data.data.week.start_time = self.replaceStr(res.data.data.week.start_time);
          res.data.data.week.end_time = self.replaceStr(res.data.data.week.end_time);
          res.data.data.month.start_time = self.replaceStr(res.data.data.month.start_time);
          res.data.data.month.end_time = self.replaceStr(res.data.data.month.end_time);
          res.data.data.total.start_time = self.replaceStr(res.data.data.total.start_time);
          res.data.data.total.end_time = self.replaceStr(res.data.data.total.end_time);
          self.setData({
            incomeData: res.data.data,
            nowIncome: res.data.data.today.income,
            nowTime: res.data.data.today.start_time
          })
          if (self.data.otherIn){
            self.selctTab()
          }
        }
      }
    )
  },
  // 获取收益订单
  getOrder() {
    let self = this;
    http.HttpRequst(true, '/hand/hand-api/order', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        type: self.data.status,
        order_no: self.data.orderNo,
        start_time: self.data.orderStartTime,
        end_time: self.data.orderEndTime,
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            listData: res.data.data
          })
        }
      }
    )
  },
  // 字符串替换
  replaceStr(str) {
    str = str.replace(/-/g, '.');
    return str
  },
  // 显示累计
  showTab() {
    this.setData({
      showTime: true
    })
    if (this.data.tabIndex == 0) {
      let text = 'tab[' + this.data.tabIndex + ']';
      this.setData({
        [text]: '当日(目前选择)'
      })
    } else if (this.data.tabIndex == 1) {
      let text = 'tab[' + this.data.tabIndex + ']';
      this.setData({
        [text]: '当周(目前选择)'
      })
    } else if (this.data.tabIndex == 2) {
      let text = 'tab[' + this.data.tabIndex + ']';
      this.setData({
        [text]: '当月(目前选择)'
      })
    } else if (this.data.tabIndex == 3) {
      let text = 'tab[' + this.data.tabIndex + ']';
      this.setData({
        [text]: '累计(目前选择)'
      })
    }
  },
  // 关闭选择
  closeTopTime() {
    let initTab = ['当日', '当周', '当月', '累计'];
    this.setData({
      showTime: false,
      tab: initTab
    })
  },
  // 选择类型
  selctTab(e) {
    let index =""
    if(e){
       index = e.currentTarget.dataset.index;
    }else{
      index = this.data.tabIndex
    }
    if (index == this.data.tabIndex && !this.data.otherIn) {
      return
    }else {
      let time = new Date().getTime();
      let initTab = ['当日', '当周', '当月', '累计'];
      if(index == 0) {
        this.setData({
          nowIncome: this.data.incomeData.today.income,
          nowTime: this.data.incomeData.today.start_time,
          orderStartTime: util.formatTimeFour(time),
          orderEndTime: this.data.endTime
        })
      }else if(index == 1) {
        let weekTime = time - (60 * 60 * 24 * 7)*1000;
        this.setData({
          nowIncome: this.data.incomeData.week.income,
          nowTime: this.data.incomeData.week.start_time + "-" + this.data.incomeData.week.end_time,
          orderStartTime: util.formatTimeFour(this.data.incomeData.week.start_time),
          orderEndTime: util.formatTimeFour(this.data.incomeData.week.end_time)
        })
      } else if (index == 2) {
        let monthTime = time - (60 * 60 * 24 * 30)*1000;
        this.setData({
          nowIncome: this.data.incomeData.month.income,
          nowTime: this.data.incomeData.month.start_time + "-" + this.data.incomeData.month.end_time,
          orderStartTime: util.formatTimeFour(this.data.incomeData.month.start_time),
          orderEndTime: util.formatTimeFour(this.data.incomeData.month.end_time)
        })
      } else if (index == 3) {
        this.setData({
          nowIncome: this.data.incomeData.total.income,
          nowTime: this.data.incomeData.total.start_time + "-" + this.data.incomeData.total.end_time,
          orderStartTime: '',
          orderEndTime: ''
        })
      }
      this.setData({
        tabIndex: index,
        showTime: false,
        tab: initTab
      })
      if (this.data.incomeIndex != 4) {
        this.getOrder();
      } else if (this.data.incomeIndex == 4) {
        this.getWelfare();
      }
    }
  },
  // 获取福利金
  getWelfare() {
    let self = this;
    http.HttpRequst(true, '/hand/hand-api/income-list', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 10,
        type:1,
        start_time: self.data.orderStartTime,
        end_time: self.data.orderEndTime,
      },
      'POST', false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            weflareData: res.data.data
          })
        }
      }
    )
  },
  // 选择订单类型
  selctIncomeTab(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.incomeIndex) {
      return
    } else {
      if(index == 0) {
        this.setData({
          status: 0
        })
        this.getOrder();
      } else if (index == 1) {
        this.setData({
          status: 1
        })
        this.getOrder();
      } else if (index == 2) {
        this.setData({
          status: 2
        })
        this.getOrder();
      } else if (index == 3) {
        this.setData({
          status: 3
        })
        this.getOrder();
      } else if (index == 4) {
        this.getWelfare();
      }
      this.setData({
        incomeIndex: index
      })
    }
    this.setData({
      startPage: 0,
      weflarePage: 0
    })
  },
  // 时间选择
  bindDateChange(e) {
    wx.showToast({
      title: '请选择结束时间',
      icon: 'none',
      duration: 2000
    })
    let time = this.replaceStr(e.detail.value);
    this.setData({
      startTime: time,
      showDateStart: false,
    })
  },
  // 获取输入订单号
  getOrderNo(e) {
    this.setData({
      orderNo: e.detail.value
    })
  },
  // 搜索订单 
  serchOrder() {
    this.getOrder();
  },
  // 跳转订单返利详情
  jumoDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/awardInfo/awardInfo?id=' + id
    })
  },
  // 显示时间
  selectTime() {
    this.setData({
      showStartTime: true
    })
    wx.showToast({
      title: '请选择开始时间',
      icon: 'none',
      duration: 1000
    })
  },
  // 第一个时间
  getFirstTime(e) {
    let time = e.detail.year + '-' + e.detail.month + '-' + e.detail.day;
    this.setData({
      showStartTime: false,
      orderStartTime: time
    })
    setTimeout(()=>{
      this.setData({
        showStartEnd: true,
      })
    },200)
    wx.showToast({
      title: '请结束开始时间',
      icon: 'none',
      duration: 1000
    })
  },
  // 关闭选择
  closeTime() {
    this.setData({
      showStartTime: false,
      showStartEnd: false,
      orderStartTime: '',
      orderEndTime: ''
    })
  },
  // 第二个时间
  getSecondTime(e) {
    let time = e.detail.year + '-' + e.detail.month + '-' + e.detail.day;
    this.setData({
      showStartEnd: false,
      orderEndTime: time
    })
    this.getOrder();
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
    let self = this;
    if (self.data.incomeIndex != 4) {
      let pages = self.data.startPage + 1;
      if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
        return false
      } else {
        self.setData({
          startPage: pages
        })
        http.HttpRequst(true, '/hand/hand-api/order', 2, '',
          {
            token: app.globalData.token,
            start_page: self.data.startPage,
            pages: 10,
            order_no: self.data.orderNo,
            start_time: self.data.orderStartTime,
            end_time: self.data.orderEndTime,
            type: self.data.status
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              let listData = "listData.list";
              let list = res.data.data.list;
              let newListData = self.data.listData.list.concat(list);
              self.setData({
                [listData]: newListData
              })
            }
          }
        )
      }
    } else if (self.data.incomeIndex == 4) {
      let pages = self.data.weflarePage + 1;
      if (pages > Math.ceil(self.data.weflareData.total_pages / 10) - 1) {
        return false
      } else {
        self.setData({
          weflarePage: pages
        })
        http.HttpRequst(true, '/hand/hand-api/income-list', 2, '',
          {
            token: app.globalData.token,
            start_page: self.data.weflarePage,
            pages: 10,
            type: 1,
            start_time: self.data.orderStartTime,
            end_time: self.data.orderEndTime,
          },
          'POST',
          false,
          function (res) {
            if (res.data.errcode == 0) {
              let listData = "weflareData.list";
              let list = res.data.data.list;
              let newListData = self.data.weflareData.list.concat(list);
              self.setData({
                [listData]: newListData
              })
            }
          }
        )
      }  
    }
  },

  
})