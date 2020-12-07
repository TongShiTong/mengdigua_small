// pages/shopCar/shopCar.js
const app = getApp();
const http = require("../../utils/http.js");
const common = require("../../utils/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopcarData: "",
    noticeData: "",
    showMessage: false,
    totalPrice: 0,
    selectLen: 0,
    checkAll: false,
    totalLen: 0,
    isShowModal: false,
    isBindPhone: "",
    isEmpty: false,
    likeData: "",
    shopCarStatus: null,
    translateX: 0,
    goodAllLen: 0,
    tabbar: {},
    showManage: false, //管理
    firstIn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.loadTheme(this);
    this.setData({
      isIphoneX: app.globalData.systemX,
    });
    this.getLike();
  },
  // 获取购物车列表
  getList: function () {
    let self = this;
    self.setData({
      goodAllLen: 0,
    });
    http.HttpRequst(
      true,
      "/item/me-cart-api/index",
      2,
      "",
      {
        token: app.globalData.token,
        start_page: 0,
        pages: 9999,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            isBindPhone: app.globalData.isBindPhone,
            isShowModal: app.globalData.showModal,
          });
          // if (self.data.isBindPhone === false) {
          //   self.setData({
          //     isShowModal: app.globalData.showModal,
          //   })
          // }
          if (res.data.data.total_pages == 0) {
            self.setData({
              isEmpty: true,
            });
          } else {
            self.setData({
              isEmpty: false,
            });
          }
          for (let i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].isSelect = false;
            for (let j = 0; j < res.data.data.list[i].list.length; j++) {
              res.data.data.list[i].list[j].num = Number(
                res.data.data.list[i].list[j].num
              );
              res.data.data.list[i].list[j].isSelect = false;
              res.data.data.list[i].list[j].goodStatus = 0;
              res.data.data.list[i].list[j].goodStatus2 = -1; //
              // whf  秒杀
              if (
                res.data.data.list[i].list[j].activity_type == 1 &&
                res.data.data.list[i].list[j].item.seckillItem != null
              ) {
                let timeOne =
                  res.data.data.list[i].list[j].item.seckillItem.start_time;
                let timeTwo =
                  res.data.data.list[i].list[j].item.seckillItem.end_time;
                res.data.data.list[i].list[j].goodStatus2 = common.compareTime(
                  timeOne,
                  timeTwo
                );
              }
              // yxj
              if (
                res.data.data.list[i].list[j].item.is_seckill == 1 &&
                res.data.data.list[i].list[j].item.seckillItem != null
              ) {
                let nowTime = new Date(
                  res.data.data.list[i].list[
                    j
                  ].item.seckillItem.now_time.replace(/-/g, "/")
                ).getTime(); // 当前时间
                let date1 = new Date(
                  res.data.data.list[i].list[
                    j
                  ].item.seckillItem.start_time.replace(/-/g, "/")
                ).getTime(); // 开始时间
                let date2 = new Date(
                  res.data.data.list[i].list[
                    j
                  ].item.seckillItem.end_time.replace(/-/g, "/")
                ).getTime(); // 结束时间
                if (nowTime < date1) {
                  // 有商品秒杀尚未开始
                  res.data.data.list[i].list[j].goodStatus = 1;
                } else if (nowTime > date2) {
                  // 有商品秒杀尚已结束
                  res.data.data.list[i].list[j].goodStatus = 2;
                } else if (nowTime >= date1 && nowTime <= date2) {
                  // 有商品正在秒杀
                  res.data.data.list[i].list[j].goodStatus = 3;
                }
              }
            }
            // let goodAllLen = self.data.goodAllLen;
            // goodAllLen += res.data.data.list[i].list.length;
            // self.setData({
            //   goodAllLen: goodAllLen
            // })
            // wx.setNavigationBarTitle({
            //   title: '购物车' + '(' + self.data.goodAllLen + ')'
            // })
          }
          wx.stopPullDownRefresh();
          self.setData({
            shopcarData: res.data.data,
          });
          self.countPrice();
          self.getNotice();
        }
      }
    );
  },
  // 猜你喜欢
  getLike() {
    let self = this;
    http.HttpRequst(
      false,
      "/item/me-item-api/like",
      2,
      "",
      {
        token: app.globalData.token,
        token_type: 1,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            likeData: res.data.data,
          });
        }
      }
    );
  },
  // 减少数量
  reduce: function (e) {
    let num = Number(e.currentTarget.dataset.num);
    let stock = Number(e.currentTarget.dataset.stock);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    if (num <= 1) {
      num = 1;
    } else {
      num -= 1;
      let buyNum =
        "shopcarData.list" + "[" + index + "].list" + "[" + goodIndex + "].num";
      this.setData({
        [buyNum]: num,
      });
      let self = this;
      http.HttpRequst(
        true,
        "/item/me-cart-api/update",
        2,
        "",
        {
          token: app.globalData.token,
          cart_id: id,
          num: num,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
          }
        }
      );
    }
    this.countPrice();
  },
  // 增加数量
  addNum: function (e) {
    let num = Number(e.currentTarget.dataset.num);
    let stock = Number(e.currentTarget.dataset.stock);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    if (num >= stock) {
      num = stock;
    } else {
      num += 1;
      let buyNum =
        "shopcarData.list" + "[" + index + "].list" + "[" + goodIndex + "].num";
      this.setData({
        [buyNum]: num,
      });
      let self = this;
      http.HttpRequst(
        true,
        "/item/me-cart-api/update",
        2,
        "",
        {
          token: app.globalData.token,
          cart_id: id,
          num: num,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
          }
        }
      );
    }
    this.countPrice();
  },
  // 失去焦点
  // blurInput(e) {
  //   let stock = Number(e.currentTarget.dataset.stock);
  //   let id = e.currentTarget.dataset.id;
  //   let index = e.currentTarget.dataset.index;
  //   let goodIndex = e.currentTarget.dataset.goodindex;
  //   let buyNum = 'shopcarData.list' + '[' + index + '].list' + '[' + goodIndex + '].num';
  //   if (e.detail.value == '') {
  //     this.setData({
  //       [buyNum]: 1
  //     })
  //     let self = this;
  //     http.HttpRequst(true, '/item/me-cart-api/update', 2, '',
  //       {
  //         token: app.globalData.token,
  //         cart_id: id,
  //         num: 1,
  //       },
  //       'POST',
  //       false,
  //       function (res) {
  //         if (res.data.errcode == 0) {

  //         }
  //       }
  //     )
  //   }
  // },
  // 改变数量
  // changeNum: function(e) {
  //   let num = Number(e.detail.value);
  //   let stock = Number(e.currentTarget.dataset.stock);
  //   let id = e.currentTarget.dataset.id;
  //   let index = e.currentTarget.dataset.index;
  //   let goodIndex = e.currentTarget.dataset.goodindex;
  //   if (num == 0) {

  //   }else {
  //     if (num >= stock) {
  //       num = stock
  //     } else if (num <= 1) {
  //       num = 1
  //     }
  //     let buyNum = 'shopcarData.list' + '[' + index + '].list' + '[' + goodIndex + '].num';
  //     this.setData({
  //       [buyNum]: num
  //     })
  //     let self = this;
  //     http.HttpRequst(true, '/item/me-cart-api/update', 2, '',
  //       {
  //         token: app.globalData.token,
  //         cart_id: id,
  //         num: num,
  //       },
  //       'POST',
  //       false,
  //       function (res) {
  //         if (res.data.errcode == 0) {

  //         }
  //       }
  //     )
  //   }
  //   this.countPrice();
  // },
  // 选择商品
  selectGood: function (e) {
    let selected = e.currentTarget.dataset.isselect;
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    let len = this.data.shopcarData.list[index].list.length;
    let status =
      "shopcarData.list" +
      "[" +
      index +
      "].list" +
      "[" +
      goodIndex +
      "].isSelect";
    this.setData({
      [status]: !selected,
    });
    let selectLen = 0;
    for (let i = 0; i < len; i++) {
      if (
        this.data.shopcarData.list[index].list[i].isSelect === true ||
        this.data.shopcarData.list[index].list[i].goodStatus2 == 0 ||
        this.data.shopcarData.list[index].list[i].goodStatus2 == 2 ||
        this.data.shopcarData.list[index].list[i].stock == 0 ||
        this.data.shopcarData.list[index].list[i].status == 0
      ) {
        selectLen += 1;
      }
    }
    this.setData({
      selectLen: selectLen,
    });

    let shopStatus = "shopcarData.list" + "[" + index + "].isSelect";
    if (len == this.data.selectLen) {
      this.setData({
        [shopStatus]: true,
      });
    } else {
      this.setData({
        [shopStatus]: false,
      });
    }
    this.allLen();
    this.checkSelectAll();
    this.countPrice();
  },
  // 结算 删除的长度
  allLen: function () {
    let len = 0;
    for (let i = 0; i < this.data.shopcarData.list.length; i++) {
      for (let j = 0; j < this.data.shopcarData.list[i].list.length; j++) {
        if (this.data.shopcarData.list[i].list[j].isSelect == true) {
          len += 1;
        }
      }
    }
    this.setData({
      totalLen: len,
    });
  },
  // 判断是否全选
  checkSelectAll: function () {
    let newData = this.data.shopcarData;
    let selectLen = 0;
    let canSelectLen = 0;
    // for (let i = 0; i < newData.list.length; i++) {
    //   if (newData.list[i].isSelect === true) {
    //     selectLen += 1;
    //   }
    // }
    for (let i = 0; i < newData.list.length; i++) {
      for (let j = 0; j < newData.list[i].list.length; j++) {
        if (
          newData.list[i].list[j].isSelect === true &&
          (newData.list[i].list[j].goodStatus == 0 ||
            newData.list[i].list[j].goodStatus == 3)
        ) {
          selectLen += 1;
        }
        if (
          newData.list[i].list[j].goodStatus == 0 ||
          newData.list[i].list[j].goodStatus == 3
        ) {
          canSelectLen += 1;
        }
        // whf 加上 秒杀不能秒杀的商品
        if (
          newData.list[i].list[j].goodStatus2 == 0 ||
          newData.list[i].list[j].goodStatus2 == 2 ||
          newData.list[i].list[j].stock == 0
        ) {
          canSelectLen -= 1;
        }
      }
    }
    if (selectLen == canSelectLen && canSelectLen != 0) {
      this.setData({
        checkAll: true,
      });
    } else {
      this.setData({
        checkAll: false,
      });
    }
  },
  // 全选
  selectAll: function () {
    let newData = this.data.shopcarData;
    if (this.data.shopcarData.list == "") {
      wx.showToast({
        title: "暂无商品可选",
        icon: "none",
        duration: 1000,
      });
    } else {
      this.setData({
        checkAll: !this.data.checkAll,
      });
      // 选择的时候改
      if (this.data.checkAll === true) {
        for (let i = 0; i < newData.list.length; i++) {
          newData.list[i].isSelect = true;
          let cancelStatus = false;
          for (let j = 0; j < newData.list[i].list.length; j++) {
            if (
              newData.list[i].list[j].goodStatus == 0 ||
              newData.list[i].list[j].goodStatus == 3
            ) {
              newData.list[i].list[j].isSelect = true;
            }
            // 未开时和 结束不能选
            if (
              newData.list[i].list[j].goodStatus2 == 0 ||
              newData.list[i].list[j].goodStatus2 == 2 ||
              newData.list[i].list[j].stock == 0 ||
              this.data.shopcarData.list[i].list[j].status == 7
            ) {
              newData.list[i].list[j].isSelect = false;
              cancelStatus = true;
            }
          }
        }
        this.setData({
          shopcarData: newData,
        });
      } else if (this.data.checkAll === false) {
        for (let i = 0; i < newData.list.length; i++) {
          newData.list[i].isSelect = false;
          for (let j = 0; j < newData.list[i].list.length; j++) {
            if (
              newData.list[i].list[j].goodStatus == 0 ||
              newData.list[i].list[j].goodStatus == 3
            ) {
              newData.list[i].list[j].isSelect = false;
            }
          }
        }
        this.setData({
          shopcarData: newData,
        });
      }
    }
    this.allLen();
    this.countPrice();
  },
  // 计算价格
  countPrice: function () {
    let price = 0;
    for (let i = 0; i < this.data.shopcarData.list.length; i++) {
      for (let j = 0; j < this.data.shopcarData.list[i].list.length; j++) {
        if (this.data.shopcarData.list[i].list[j].isSelect === true) {
          price +=
            Number(this.data.shopcarData.list[i].list[j].price) *
            Number(this.data.shopcarData.list[i].list[j].num);
        }
      }
    }
    price = price.toFixed(2);
    this.setData({
      totalPrice: price,
    });
  },
  // 管理
  manage: function () {
    this.setData({
      showManage: !this.data.showManage,
    });
  },
  // 删除单个
  deleteCar: function (e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    let goodIndex = e.currentTarget.dataset.goodindex;
    let cart_id = [];
    cart_id.push(self.data.shopcarData.list[index].list[goodIndex].cart_id);
    http.HttpRequst(
      true,
      "/item/me-cart-api/delete",
      2,
      "",
      {
        token: app.globalData.token,
        cart_ids: cart_id,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          wx.showToast({
            title: "删除成功",
            icon: "success",
            duration: 1000,
          });
          self.setData({
            checkAll: false,
            totalLen: 0,
          });
          setTimeout(() => {
            self.getList();
          }, 1000);
        }
      }
    );
    // let deleteArr = [];
    // for (let i = 0; i < this.data.shopcarData.list.length; i++) {
    //   for (let j = 0; j < this.data.shopcarData.list[i].list.length; j++) {
    //     if (this.data.shopcarData.list[i].list[j].isSelect === true) {
    //       deleteArr.push(this.data.shopcarData.list[i].list[j].cart_id)
    //     }
    //   }
    // }
    // let self = this;
    // if (deleteArr == '') {
    //   wx.showToast({
    //     title: '请选择商品',
    //     icon: 'none',
    //     duration: 1000
    //   })
    // }else {
    //   http.HttpRequst(true, '/item/me-cart-api/delete', 2, '',
    //     {
    //       token: app.globalData.token,
    //       cart_ids: deleteArr
    //     },
    //     'POST',
    //     false,
    //     function (res) {
    //       if (res.data.errcode == 0) {
    //         wx.showToast({
    //           title: '删除成功',
    //           icon: 'success',
    //           duration: 1000
    //         })
    //         self.setData({
    //           checkAll: false,
    //           totalLen: 0
    //         })
    //         self.getList();
    //       }
    //     }
    //   )
    // }
  },
  // 删除购物车选择框
  deleteCarSelect: function () {
    let deleteArr = [];
    for (let i = 0; i < this.data.shopcarData.list.length; i++) {
      for (let j = 0; j < this.data.shopcarData.list[i].list.length; j++) {
        if (this.data.shopcarData.list[i].list[j].isSelect === true) {
          deleteArr.push(this.data.shopcarData.list[i].list[j].cart_id);
        }
      }
    }
    let self = this;
    if (deleteArr == "") {
      wx.showToast({
        title: "请选择商品",
        icon: "none",
        duration: 1000,
      });
    } else {
      http.HttpRequst(
        true,
        "/item/me-cart-api/delete",
        2,
        "",
        {
          token: app.globalData.token,
          cart_ids: deleteArr,
        },
        "POST",
        false,
        function (res) {
          if (res.data.errcode == 0) {
            wx.showToast({
              title: "删除成功",
              icon: "success",
              duration: 1000,
            });
            self.setData({
              checkAll: false,
              showManage: false,
              totalLen: 0,
            });
            self.getList();
            // setTimeout(() => {
            //   self.setData({
            //     checkAll: false,
            //     showManage: false,
            //     totalLen: 0
            //   })
            //   self.getList();
            // }, 1000)
          }
        }
      );
    }
  },
  // 跳转消息
  jumpMessage() {
    wx.navigateTo({
      url: "/pages/center/message/message",
    });
  },
  // 跳转结算页面
  jumpConfirmOrder: function () {
    if (this.data.totalLen == 0) {
      wx.showToast({
        title: "请选择商品",
        icon: "none",
        duration: 1000,
      });
    } else {
      end: for (let i = 0; i < this.data.shopcarData.list.length; i++) {
        for (let j = 0; j < this.data.shopcarData.list[i].list.length; j++) {
          if (this.data.shopcarData.list[i].list[j].isSelect === true) {
            if (
              this.data.shopcarData.list[i].list[j].item.is_seckill == 1 &&
              this.data.shopcarData.list[i].list[j].item.seckillItem != null
            ) {
              let nowTime = new Date(
                this.data.shopcarData.list[i].list[
                  j
                ].item.seckillItem.now_time.replace(/-/g, "/")
              ).getTime();
              let date1 = new Date(
                this.data.shopcarData.list[i].list[
                  j
                ].item.seckillItem.start_time.replace(/-/g, "/")
              ).getTime(); // 开始时间
              let date2 = new Date(
                this.data.shopcarData.list[i].list[
                  j
                ].item.seckillItem.end_time.replace(/-/g, "/")
              ).getTime(); // 结束时间
              if (nowTime < date1) {
                // 有商品秒杀尚未开始
                this.setData({
                  shopCarStatus: 0,
                });
                break end;
              } else if (nowTime > date2) {
                // 有商品秒杀尚已结束
                this.setData({
                  shopCarStatus: 1,
                });
                break end;
              } else if (nowTime >= date1 && nowTime <= date2) {
                // 有商品正在秒杀
                this.setData({
                  shopCarStatus: 2,
                });
                break end;
              }
            } else if (
              this.data.shopcarData.list[i].list[j].item.is_seckill == 0
            ) {
              this.setData({
                shopCarStatus: 3,
              });
            }
          }
        }
      }
      if (this.data.shopCarStatus == 0) {
        wx.showToast({
          title: "有商品秒杀尚未开始",
          icon: "none",
          duration: 1000,
        });
      } else if (this.data.shopCarStatus == 1) {
        wx.showToast({
          title: "有商品秒杀已结束",
          icon: "none",
          duration: 1000,
        });
      } else {
        app.globalData.shopcarOrder = this.data.shopcarData;
        app.globalData.totalPrice = this.data.totalPrice;
        this.setData({
          translateX: 0,
        });

        wx.navigateTo({
          url: "/pages/goodDetail/confirmOrder/confirmOrder?from=shopcar",
        });
      }
    }
  },
  // 选择店铺
  selectShop: function (e) {
    let selected = e.currentTarget.dataset.isselect;
    let index = e.currentTarget.dataset.index;
    let status = "shopcarData.list" + "[" + index + "].isSelect";
    this.setData({
      [status]: !selected,
    });
    if (!selected === false) {
      let list = "shopcarData.list" + "[" + index + "].list";
      let newList = this.data.shopcarData.list[index].list;
      for (let i = 0; i < newList.length; i++) {
        newList[i].isSelect = false;
      }
      this.setData({
        [list]: newList,
      });
    } else {
      let list = "shopcarData.list" + "[" + index + "].list";
      let newList = this.data.shopcarData.list[index].list;
      for (let i = 0; i < newList.length; i++) {
        if (
          ((newList[i].goodStatus2 == -1 || newList[i].goodStatus2 == 1) &&
            newList[i].stock != 0) ||
          newList[i].status == 7
        ) {
          newList[i].isSelect = true;
        }
      }
      // let status2 = true
      // newList.forEach((x) => {
      //   if (x.isSelect == false) {
      //     status2 = false
      //   }
      // })
      // if (status2) {
      //   this.setData({
      //     [status]: true
      //   })
      // } else {
      //   this.setData({
      //     [status]: false
      //   })
      // }

      this.setData({
        [list]: newList,
      });
    }
    this.allLen();
    this.checkSelectAll();
    this.countPrice();
  },
  // 进入店铺
  godetail: function (e) {
    let self = this;
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/shop/shopDetail/shopDetail?id=" + id,
    });
  },
  // 跳转详情
  jumpDetail(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      translateX: 0,
    });
    wx.navigateTo({
      url: "/pages/goodDetail/goodDetail?id=" + id,
    });
  },
  // 获取站内信未读数
  getNotice() {
    let self = this;
    http.HttpRequst(
      false,
      "/notice/notice-api/get-num",
      2,
      "",
      {
        token: app.globalData.token,
      },
      "POST",
      false,
      function (res) {
        if (res.data.errcode == 0) {
          self.setData({
            noticeData: res.data.data,
          });
          if (res.data.data.all_no_readnum != 0) {
            self.setData({
              showMessage: true,
            });
          } else {
            self.setData({
              showMessage: false,
            });
          }
        }
      }
    );
  },
  // 跳转首页
  jumpHome() {
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
    this.setData({
      checkAll: false,
      totalLen: 0,
    });
    //wx.hideTabBar();
    if (
      app.globalData.role != app.globalData.userInfo.role ||
      !this.data.firstIn
    ) {
      if (app.globalData.userInfo.role == 0) {
        this.setData({
          tabbar: app.globalData.tabBar2,
        });
      } else {
        this.setData({
          tabbar: app.globalData.tabBar,
        });
      }
      this.setData({
        firstIn: true,
      });
      app.editTabbar(app.globalData.userInfo.role, app.globalData.isDistr);
    }
    wx.hideNavigationBarLoading();
  },

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
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    setTimeout(() => {
      this.getList();
      this.getLike();
      this.setData({
        checkAll: false,
        totalLen: 0,
      });
      wx.hideNavigationBarLoading();
    }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
});
