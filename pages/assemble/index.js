// pages/assemble/index.js
const app = getApp()
const http = require('../../utils/http.js')
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1, //1 拼团 2 秒杀
    title:"拼团专区",
    start_page:0,
    groupList:false,
   
    tabIndex: 0,
    skillData: '',
    skillIndex: null,
    skillContentIndex: null,
    skillCode: '',
    listData: '',
    yesterdayData: '',
    tomorrowData: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this)
    this.setData({
      userInfo: app.globalData.userInfo,
      pageHeight: app.globalData.pageHeight,
      totalHeight: app.globalData.totalHeight
    })
    if (options.type){
      this.setData({
        type:2,
        title:"秒杀专区"
      })
      if (options.index) {
        let { index, code } = options
        this.fromSelectSkill({ index, code });
        this.fromSkill();
        this.yesterday();

      }else{
        this.skill();
        this.yesterday();
      }
      
      
    }else{
      this.getGroupTimes()
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
    if (app.globalData.setRemined) {
      app.globalData.setRemined = !app.globalData.setRemined
      this.setData({
        groupList: false,
        start_page: 0,
        groupId: app.globalData.groupId
      })
      this.getGroupList()
    }
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
    this.loadMore()
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
  // 平团列表
  getGroupList() {
    let self = this;
    common.getgoodsList(self, '/item/group-api/group-item-list', {
      token: app.globalData.token,
      start_page: self.data.start_page,
      category_id: self.data.groupId,
    }, 'groupList')
  },
  // 组件改变了 列表 重新渲染
  changeList(e) {
    let list = 'groupList.list'
    this.setData({
      [list]: e.detail.list
    })
  },
  changeGroupTop(e) {
    let self = this;
    let index = e.detail.activeIndex
    let id = e.detail.id
    if (index == self.data.groupIndex) {
      return
    } else {
      // 走场次
      self.setData({
        groupId: id,
        groupIndex: index,
        start_page:0,
      })
      self.getGroupList()
    }
  },
  loadMore() {
    let self = this
    if(self.data.type==1){
      common.loadMore(self, '/item/group-api/group-item-list', {
        token: app.globalData.token,
        start_page: self.data.start_page,
        category_id: self.data.groupId,
      }, 'groupList')
    }else{
      self.loadMoreSkill()
    }
  
  },


  // 获取秒杀
  skill() {
    let self = this;
    let date = new Date();
    let nowTime = date.getTime();
    http.HttpRequst(false, '/item/seckill-api/seckill-scene-list', 2, '', {
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
          let nowId = self.data.skillData.list[0].seckill_scene_id
          //找到第一个正在秒杀的场次 返回ID
          try {
            self.data.skillData.list.forEach((sku, skuIdx) => {
              if (sku.status == 1) {
                self.setData({
                  skillIndex: skuIdx
                })
                nowId = sku.seckill_scene_id
                // throw new Error('exist')
              }
            })
          } catch (e) {
            if (e.message == 'exist') throw e
          } finally {
            self.getSkillContent(nowId)
          }
        }
      }
    )
  },
  fromSkill(){
    // 获取秒杀
      let self = this;
      let date = new Date();
      let nowTime = date.getTime();
      http.HttpRequst(false, '/item/seckill-api/seckill-scene-list', 2, '', {
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
            let nowId = self.data.skillData.list[0].seckill_scene_id
            //找到第一个正在秒杀的场次 返回ID
            try {
              self.data.skillData.list.forEach((sku, skuIdx) => {
                if (sku.status == 1) {
                  self.setData({
                    skillIndex: skuIdx
                  })
                  nowId = sku.seckill_scene_id
                  // throw new Error('exist')
                }
              })
            } catch (e) {
              if (e.message == 'exist') throw e
            } finally {
            }
          }
        }
      )
  },
  fromSelectSkill(e){
    let {index ,code} = e
    this.setData({
      skillIndex: index,
      skillCode: code,
      skillContentIndex: null,
      tomorrowData: 0,
      toView: 'skillView',
      start_page: 0,
    })
    this.getSkillContent(this.data.skillCode)

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
      toView: 'skillView',
      start_page: 0,
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
      toView: 'skillView',
    })
  },
  // 秒杀场次列表
  getSkillContent(code) {
    let self = this;
    let date = new Date();
    let nowTime = date.getTime();
    http.HttpRequst(false, '/item/seckill-api/seckill-item-list', 2, '', {
      token: app.globalData.token,
      start_page: self.data.start_page,
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
  // 秒杀场次列表
  getGroupContent(code) {
    let self = this;
    let date = new Date();
    let nowTime = date.getTime();
    http.HttpRequst(false, '/item/group-api/group-scene-list', 2, '', {
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
    http.HttpRequst(false, '/item/seckill-api/seckill-item-list-last', 2, '', {
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
    http.HttpRequst(false, '/item/seckill-api/seckill-item-list-next', 2, '', {
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
          })
        }
      }
    )
  },
  // 秒杀加载更多
  loadMoreSkill() {
    let self = this;
    if (!self.data.listData) {
      return false
    }
    let pages = self.data.start_page + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      return false
    } else {
      self.setData({
        start_page: pages
      })
      http.HttpRequst(false, '/item/seckill-api/seckill-item-list', 2, '', {
        token: app.globalData.token,
        start_page: self.data.start_page,
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
  },
})