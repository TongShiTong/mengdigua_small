// pages/goodReviews/goodReviews.js
const app = getApp();
const http = require("../../utils/http.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemId: "",
    totalLevel:0,
    onlyImage: 0,
    commentList: [],
    listData: {},
    startPage: 0, //起始页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        itemId: options.id,
      });
      this.getCommontList();
    }
    if(options.level){
      this.setData({
        totalLevel: options.level,
      });
      console.log(options.level);
    }
  },
  previewImg(e) {
    let that = this
    // console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var bindex = e.currentTarget.dataset.bindex;
    var imgArr = that.data.commentList[bindex].meCommetImgs;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMore()
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  switchOnlyImage() {
    const onlyImage = this.data.onlyImage == 0 ? 1 : 0;
    this.setData({
      onlyImage: onlyImage,
    });
    this.getCommontList();
  },

  // 加载更多
  loadMore() {
    let self = this;
    let pages = self.data.startPage + 1;
    if (pages > Math.ceil(self.data.listData.total_pages / 10) - 1) {
      wx.showToast({
        title: '没有更多了~',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      self.setData({
        startPage: pages
      })
      http.HttpRequst(
        true,
        "/item/me-commet-api/index",
        2,
        "",
        {
          start_page: self.data.startPage,
          pages: 10,
          item_id: this.data.itemId,
          flag: this.data.onlyImage,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            let data = res.data.data
            for(let i=0;i<data.list.length;i++) {
              data.list[i].level = Number(data.list[i].level)
              data.list[i].create_time = data.list[i].create_time.slice(0,-9)
              if(data.list[i].u.nickname.length>2) {
                let str = data.list[i].u.nickname
                let num = str.length;
                let a = str[0];
                for(let i=0;i<num-2;i++) {
                  a+='*'
                }
                a+=str[num-1]
                data.list[i].u.nickname = a
              }else {
                let str = data.list[i].u.nickname
                data.list[i].u.nickname = data.list[i].u.nickname.replace(str.substr(1,1),'*')
              }
            }
            let dataLists = self.data.commentList.concat(res.data.data.list)
            self.setData({
              commentList: dataLists,
            });
          }
        }
      );
    }
    
  },
  // 获取评论列表
  getCommontList: function () {
    let self = this;
    http.HttpRequst(
      true,
      "/item/me-commet-api/index",
      2,
      "",
      {
        start_page: 0,
        pages: 10,
        item_id: this.data.itemId,
        flag: this.data.onlyImage,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          let data = res.data.data
          for(let i=0;i<data.list.length;i++) {
            data.list[i].level = Number(data.list[i].level)
            data.list[i].create_time = data.list[i].create_time.slice(0,-9)
            if(data.list[i].u.nickname.length>2) {
              let str = data.list[i].u.nickname
              let num = str.length;
              let a = str[0];
              for(let i=0;i<num-2;i++) {
                a+='*'
              }
              a+=str[num-1]
              data.list[i].u.nickname = a
            }else {
              let str = data.list[i].u.nickname
              data.list[i].u.nickname = data.list[i].u.nickname.replace(str.substr(1,1),'*')
            }
          }
          console.log(58585,res.data.data)
          self.setData({
            commentList: res.data.data.list,
            listData: res.data.data
          });
        }
      }
    );
  },
});
