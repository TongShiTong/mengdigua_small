// pages/index/floor/floor.js
const app = getApp()
const http = require('../../../utils/http.js')
const common = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */

  data: {
    pageHeight: app.globalData.pageHeight,
    indicatorDots: true,
    showNoRead: false,
    hotSize: 0,
    newSize: 0,
    comSize: 0,
    cuscomSize: [],
    hotData: '',
    newData: '',
    comData: '',
    cuscomData: '',
    skillData: '',
    skillIndex: null,
    skillContentIndex: 0,
    skillCode: '',
    listData: '',
    yesterdayData: '',
    tomorrowData: '',
    userInfo: '',
    autoplay: true,
    floorCode: '',
    isShowModal: false,
    titleName:"",
    image:"",
    back:'',
    bg_color:'',
    show_type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.getGroupTimes()
    if(options.back==1) {
      this.setData({
        back: options.back
      })
    }
    if (options.code) {
      this.setData({
        floorCode: options.code
      })
      this.getFloor(this.data.floorCode);
    }
  },
  // 获取秒杀
  skill() {
    let self = this;
    let date = new Date();
    let nowTime = date.getTime();
    http.HttpRequst(false, '/item/seckill-api/seckill-scene-list', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.list.length; i++) {
            if (nowTime < new Date(res.data.data.list[i].start_time.replace(/-/g, "/")).getTime()) {
              res.data.data.list[i].status = 0; // 未开始
            } else if (new Date(res.data.data.list[i].start_time.replace(/-/g, "/")).getTime() <= nowTime && nowTime <= new Date(res.data.data.list[i].end_time.replace(/-/g, "/")).getTime()) {
              res.data.data.list[i].status = 1; // 进行中
            } else if (nowTime > new Date(res.data.data.list[i].end_time.replace(/-/g, "/")).getTime()) {
              res.data.data.list[i].status = 2; // 已结束
            }
          }
          self.setData({
            skillData: res.data.data
          })
        }
      }
    )
  },
  // 选择秒杀的场次
  selectSkill(e) {
    let index = e.currentTarget.dataset.index;
    let code = e.currentTarget.dataset.code;
    this.setData({
      skillIndex: index,
      skillCode: code,
      skillContentIndex: null,
      tomorrowData: 0,
    })
    this.getSkillContent(this.data.skillCode)
  },
  // 选择秒杀内容
  slectSkillContent(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.skillContentIndex) {
      return
    } else {
      if (index == 1) {
        if (this.data.tomorrowData == '') {
          this.tomorrow();
        }
      } else if (index == 0) {
        if (this.data.yesterdayData == '') {
          this.yesterday();
        }
      }
    }
    this.setData({
      skillContentIndex: index,
      skillIndex: null,
      tomorrowData: 0,
    })
  },
  // 秒杀场次列表
  getSkillContent(code) {
    let self = this;
    let date = new Date();
    let nowTime = date.getTime();
    http.HttpRequst(false, '/item/seckill-api/seckill-item-list', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 9999,
        seckill_scene_id: code
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          for (let i = 0; i < res.data.data.list.length; i++) {
            if (nowTime < new Date(res.data.data.list[i].start_time.replace(/-/g, "/")).getTime()) {
              res.data.data.list[i].status = 0; // 未开始
            } else if (new Date(res.data.data.list[i].start_time.replace(/-/g, "/")).getTime() <= nowTime && nowTime <= new Date(res.data.data.list[i].end_time.replace(/-/g, "/")).getTime()) {
              res.data.data.list[i].status = 1; // 进行中
            } else if (nowTime > new Date(res.data.data.list[i].end_time.replace(/-/g, "/")).getTime()) {
              res.data.data.list[i].status = 2; // 已结束
            }
          }
          self.setData({
            listData: res.data.data,
          })
        }
      }
    )
  },
  // 昨日精选
  yesterday() {
    let self = this;
    http.HttpRequst(false, '/item/seckill-api/seckill-item-list-last', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 9999,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            yesterdayData: res.data.data,
          })
        }
      }
    )
  },
  // 明日日精选
  tomorrow() {
    let self = this;
    http.HttpRequst(false, '/item/seckill-api/seckill-item-list-next', 2, '',
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 9999,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            tomorrowData: res.data.data,
            title: res.data.data.shop_name
          })
        }
      }
    )
  },
  // 获取楼层
  getFloor(code) {
    let self = this;
    http.HttpRequst(false, '/floor/floor-api/get-floor-info', 2, '',
      {
        token: app.globalData.token,
        use_position: code,
        shop_id: 0
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            floorData: res.data.data,
            title: res.data.data.title,
          })
          // console.log(45445,self.data.floorData)
          const data = res.data.data;
          if(data.content.list){
            const navFloor = data.content.list.find(x=>x.type == "20");
            if(navFloor) {
              self.setData({
                show_type: navFloor.show_type
              }) 
            }
      
            if(navFloor && navFloor.bgcolor) {
              self.setData({
                bg_color: navFloor.bgcolor
              }) 
            }
            if(!navFloor) {
              self.setData({
                bg_color: '#fff'
              }) 
            }
        
            if(navFloor && navFloor.bgurl){
              self.setData({
                image: navFloor.bgurl,
              }) 
            }
          }
          // wx.stopPullDownRefresh();
          // self.skill();
          // self.yesterday();
          // self.getList();
        }
      }
    )
  },
  // 跳转分类
  jumpClass() {
    wx.navigateTo({
      url: '/pages/class/class',
    })
  },
  // 获取热门商品
  getHotGood() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/index', 2, '',
      {
        start_page: 0,
        token: app.globalData.token,
        pages: self.data.hotSize,
        is_hot: 1
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            hotData: res.data.data
          })
        }
      }
    )
  },
  // 获取新品商品
  getNewGood() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/index', 2, '',
      {
        start_page: 0,
        token: app.globalData.token,
        pages: self.data.newSize,
        is_new: 1
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            newData: res.data.data
          })
        }
      }
    )
  },
  // 楼层自定义列表
  getCuscom() {
    let self = this;
    http.HttpRequst(false, '/item/me-item-api/index', 2, '',
      {
        item_ids: self.data.cuscomSize,
        start_page: 0,
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            cuscomData: res.data.data
          })
        }
      }
    )
  },
  // 获取推荐店铺
  getComShop() {
    let self = this;
    http.HttpRequst(false, '/shop/shop-api/index', 2, '',
      {
        start_page: 0,
        token: app.globalData.token,
        pages: self.data.comSize,
        is_recommend: 2
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            comData: res.data.data
          })
        }
      }
    )
  },
  // 站内信未读数
  getList() {
    let self = this;
    http.HttpRequst(false, '/notice/notice-api/get-num', 2, '',
      {
        token: app.globalData.token,
      },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            isShowModal: app.globalData.showModal
          })
          if (res.data.data.all_no_readnum > 0) {
            self.setData({
              showNoRead: true
            })
          } else {
            self.setData({
              showNoRead: false
            })
          }
          for (let i = 0; i < self.data.floorData.content.list.length; i++) {
            if (self.data.floorData.content.list[i].type == 6) {
              self.setData({
                hotSize: self.data.floorData.content.list[i].nums
              })
              if (self.data.floorData.content.list[i].nums != 0) {
                self.getHotGood();
              }
            }
            if (self.data.floorData.content.list[i].type == 7) {
              self.setData({
                newSize: self.data.floorData.content.list[i].nums
              })
              if (self.data.floorData.content.list[i].nums != 0) {
                self.getNewGood();
              }
            }
            if (self.data.floorData.content.list[i].type == 8) {
              self.setData({
                comSize: self.data.floorData.content.list[i].nums
              })
              if (self.data.floorData.content.list[i].nums != 0) {
                self.getComShop();
              }
            }
            if (self.data.floorData.content.list[i].type == 10) {
              self.setData({
                cuscomSize: self.data.floorData.content.list[i].goods_list
              })
              if (self.data.floorData.content.list[i].goods_list != '') {
                self.getCuscom();
              }
            }
          }
          self.setData({
            userInfo: app.globalData.userInfo
          })
        }
      }
    )
  },
  // 跳转搜索
  jumpSerch: function () {
    wx.navigateTo({
      url: '/pages/class/serch/serch'
    })
  },
  // 点击楼层
  tapFloor: function (e) {
    let showType = e.currentTarget.dataset.type;
    let param = e.currentTarget.dataset.param;
    let title = e.currentTarget.dataset.title;
    // 商品：1，-- 分类对应列表：2，-- 店铺：3，-- 热门商品列表：4，-- 新品推荐列表：5，-- 推荐店铺列表：6，-- 富文本：7，-- 外链：8，-- 其他同一店铺下楼层的use_position：9，-- 新人必买：10，-- 品牌精选：11，-- VIP专区：12，-- 签到领币：13，
    if (showType == 1) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?id=' + param
      })
    } else if (showType == 2) {
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?mcid=' + param + '&name=' + title
      })
    } else if (showType == 3) {
      // wx.navigateTo({
      //   url: '/pages/shop/shopDetail/shopDetail?id=' + param
      // })
    } else if (showType == 4) {
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?name=热门商品&isHot=1'
      })
    } else if (showType == 5) {
      wx.navigateTo({
        url: '/pages/class/classDetail/classDetail?name=新品推荐&isNew=1'
      })
    } else if (showType == 6) {
      // wx.reLaunch({
      //   url: '/pages/shop/shop?recommend=1'
      // })
    } else if (showType == 7) {
      app.globalData.rich = param;
      wx.navigateTo({
        url: '/pages/rich/rich'
      })
    } else if (showType == 8) {

    } else if (showType == 9) {
      wx.navigateTo({
        url: '/pages/index/floor/floor',
      })
    } else if (showType == 10) {
      wx.navigateTo({
        url: '/pages/index/newPeople/newPeople',
      })
    } else if (showType == 11) {
      wx.navigateTo({
        url: '/pages/index/bestSelect/bestSelect',
      })
    } else if (showType == 12) {
      wx.navigateTo({
        url: '/pages/index/vip/vip',
      })
    } else if (showType == 12) {
      wx.navigateTo({
        url: '/pages/index/signIn/signIn',
      })
    }
  },
  // 跳转详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + id
    })
  },
  // 上拉到底部
  onReachBottom() {
    
  },
  getGroupTimes() {
    let self = this;
    http.HttpRequst(false, '/item/group-api/group-category-list', 2, '', {

    },
      'POST',
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            groundTimes: res.data.data
          })
          // let firstIndex =0
          // self.data.groundTimes.list.forEach((x,index)=>{
          //   x.goodStatus = common.compareTime(x.start_time, x.end_time)
          //   if (x.goodStatus == 1 && firstIndex == 0){
          //     self.setData({
          //       groupId: x.id
          //     })
          //     firstIndex =1
          //   }
          // })
          // 有场次 调取拼团
          if (self.data.groundTimes.list.length > 0) {
            self.setData({
              groupId: self.data.groundTimes.list[0].id
            })
            self.getGroupList()
          }

        }
      }
    )
  },
  getGroupList() {
    let self = this;
    common.getgoodsList(self, '/item/group-api/group-item-list', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      pages: 10,
      category_id: self.data.groupId,
    }, 'groupList')
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    let self = this;
    setTimeout(() => {
      http.HttpRequst(true, '/floor/floor-api/get-use-position-list', 2, '',
        {
          token: app.globalData.token,
          introduction: 1,
          shop_id: 0
        },
        'POST',
        false,
        function (res) {
          if (res.data.errcode == 0) {
            wx.stopPullDownRefresh();
            self.setData({
              tab: res.data.data,
            })
            self.getFloor(self.data.tab[self.data.tabIndex].position_code);
            self.skill();
            self.yesterday();
          }
        }
      )
      wx.hideNavigationBarLoading();
    }, 2000)
  },
  onShow: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {
    return {
      title: this.data.floorData.title,
      path: '/pages/index/floor/floor?back=1&code='+ this.data.floorCode,
    };
  }
})