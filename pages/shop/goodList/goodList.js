// pages/shop/goodList/goodList.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    mcid: '',
    listData: '',
    showSort: false,
    tab: [
      {
        title: '综合排序'
      },
      {
        title: '上新时间'
      },
      {
        title: '销量升序'
      },
      {
        title: '销量降序'
      },
      {
        title: '价格升序'
      },
      {
        title: '价格降序'
      }
    ],
    tabIndex: 0,
    startPage: 0,
    sortName: '',
    sortType: '',
    isShowModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    if (options.id) {
      this.setData({
        id: options.id
      })
    } 
    if (options.mcid) {
      this.setData({
        mcid: options.mcid
      })
    }
    if (options.name) {
      wx.setNavigationBarTitle({
        title: options.name
      })
    }
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    this.getList()
  },
  // 获取列表
  getList: function (sort_name, sort_type) {
    let self = this;
    if (self.data.id) {
      http.HttpRequst(true, '/item/me-item-api/index', 2, '',
        {
          start_page: 0,
          pages: 4,
          shop_id: self.data.id,
          mcid: self.data.mcid,
          sort_name: sort_name,
          sort_type: sort_type
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            self.setData({
              listData: res.data.data
            })
          }
        }
      )
    }
  },
  // 加载更多商品
  loadMore: function () {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 4) - 1) {
      return false
    } else {
      self.setData({
        startPage: pages
      })
      if (self.data.id) {
        http.HttpRequst(true, '/item/me-item-api/index', 2, '',
          {
            start_page: self.data.startPage,
            pages: 4,
            shop_id: self.data.id,
            sort_name: self.data.sortName,
            sort_type: self.data.sortType
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
      } else if (self.data.mcid) {
        http.HttpRequst(true, '/item/me-item-api/index', 2, '',
          {
            start_page: self.data.startPage,
            pages: 4,
            mcid: self.data.mcid,
            sort_name: self.data.sortName,
            sort_type: self.data.sortType
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
    }
  },
  // 关闭modal
  closeModal: function () {
    this.setData({
      showSort: false
    })
  },
  // 显示排序
  showSelect: function () {
    this.setData({
      showSort: !this.data.showSort
    })
  },
  // 选择排序tab
  selectTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index,
      showSort: false
    })
    if (this.data.tabIndex == 1) {
      this.getList('is_new', 'SORT_DESC');
      this.setData({
        sortName: 'is_new',
        sortType: 'SORT_DESC'
      })
    } else if (this.data.tabIndex == 2) {
      this.getList('deal_num', 'SORT_ASC')
      this.setData({
        sortName: 'deal_num',
        sortType: 'SORT_ASC'
      })
    } else if (this.data.tabIndex == 3) {
      this.getList('deal_num', 'SORT_DESC')
      this.setData({
        sortName: 'deal_num',
        sortType: 'SORT_DESC'
      })
    } else if (this.data.tabIndex == 4) {
      this.getList('price', 'SORT_ASC')
      this.setData({
        sortName: 'price',
        sortType: 'SORT_ASC'
      })
    } else if (this.data.tabIndex == 5) {
      this.getList('price', 'SORT_DESC')
      this.setData({
        sortName: 'price',
        sortType: 'SORT_DESC'
      })
    }
  },
  // 跳转商品详情
  jumpDetail: function (e) {
    let id = e.detail;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
    })
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